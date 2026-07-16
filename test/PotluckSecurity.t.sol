// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {Potluck} from "../src/Potluck.sol";
import {RevertingReceiver} from "./utils/Attackers.sol";

/// @notice Access-control, griefing, and fund-accounting invariant tests.
contract PotluckSecurityTest is Test {
    Potluck internal potluck;
    address internal organizer = makeAddr("organizer");
    address internal attacker = makeAddr("attacker");

    function setUp() public {
        potluck = new Potluck();
        vm.deal(organizer, 100 ether);
        vm.deal(attacker, 100 ether);
        vm.deal(address(this), 100 ether);
    }

    /// Expected: reverts NotOrganizer. An outsider must never be able to trigger
    /// a payout, regardless of how much they themselves contributed.
    function test_Security_NonOrganizerCannotRelease() public {
        vm.prank(organizer);
        uint256 potId = potluck.createPot("A", "d", 1 ether, block.timestamp + 1 days);
        vm.prank(organizer);
        potluck.contribute{value: 1 ether}(potId);

        vm.expectRevert(Potluck.NotOrganizer.selector);
        vm.prank(attacker);
        potluck.release(potId);
    }

    /// Expected: reverts NoContribution. An address with no recorded contribution
    /// must never be able to withdraw from a pot it never paid into.
    function test_Security_NonContributorCannotClaimRefund() public {
        vm.prank(organizer);
        uint256 potId = potluck.createPot("A", "d", 5 ether, block.timestamp + 1 days);
        vm.prank(organizer);
        potluck.contribute{value: 1 ether}(potId);
        vm.warp(block.timestamp + 2 days);

        vm.expectRevert(Potluck.NoContribution.selector);
        vm.prank(attacker);
        potluck.claimRefund(potId);
    }

    /// Expected: every state-changing function rejects an unminted potId. Confirms
    /// `potExists` actually guards all three entry points, not just some of them.
    function test_Security_CannotActOnNonexistentPot() public {
        vm.expectRevert(Potluck.InvalidPotId.selector);
        vm.prank(attacker);
        potluck.contribute{value: 1 ether}(1);

        vm.expectRevert(Potluck.InvalidPotId.selector);
        vm.prank(attacker);
        potluck.release(1);

        vm.expectRevert(Potluck.InvalidPotId.selector);
        vm.prank(attacker);
        potluck.claimRefund(1);
    }

    /// Expected: release() pays only the recorded organizer, and a contributor's
    /// own balance is untouched by someone else's release call.
    function test_Security_ReleaseAlwaysPaysRecordedOrganizerOnly() public {
        vm.prank(organizer);
        uint256 potId = potluck.createPot("A", "d", 1 ether, block.timestamp + 1 days);
        vm.prank(attacker);
        potluck.contribute{value: 1 ether}(potId);

        uint256 attackerBefore = attacker.balance;
        uint256 organizerBefore = organizer.balance;

        vm.prank(organizer);
        potluck.release(potId);

        assertEq(organizer.balance, organizerBefore + 1 ether);
        assertEq(attacker.balance, attackerBefore);
    }

    /// Expected: 50 independent dust contributions can each be refunded on their
    /// own, one call per contributor. Proves the pull-based refund design has no
    /// "loop over all contributors" gas bomb a griefer could exploit to brick a pot.
    function test_Security_ManySmallContributorsCanAllRefundIndependently() public {
        vm.prank(organizer);
        uint256 potId = potluck.createPot("Griefing pot", "d", 1_000 ether, block.timestamp + 1 days);

        uint256 n = 50;
        address[] memory contributors = new address[](n);
        for (uint256 i = 0; i < n; i++) {
            address c = address(uint160(uint256(keccak256(abi.encode("griefer", i)))));
            vm.deal(c, 1 ether);
            contributors[i] = c;
            vm.prank(c);
            potluck.contribute{value: 1 wei}(potId);
        }

        (,,,,, , uint256 contributorCount,) = potluck.getPot(potId);
        assertEq(contributorCount, n);

        vm.warp(block.timestamp + 2 days);

        for (uint256 i = 0; i < n; i++) {
            uint256 before = contributors[i].balance;
            vm.prank(contributors[i]);
            potluck.claimRefund(potId);
            assertEq(contributors[i].balance, before + 1 wei);
        }
    }

    /// Expected: reverts TransferFailed. If the organizer's address can't accept
    /// MON, the release must fail loudly and leave `released == false` rather than
    /// silently marking the pot released with funds actually stuck in the contract.
    function test_Security_RevertsWithTransferFailedIfOrganizerRejectsPayment() public {
        RevertingReceiver badOrganizer = new RevertingReceiver(potluck);
        uint256 potId = badOrganizer.createPotAsOrganizer("Bad pot", "d", 1 ether, block.timestamp + 1 days);

        vm.prank(attacker);
        potluck.contribute{value: 1 ether}(potId);

        vm.expectRevert(Potluck.TransferFailed.selector);
        badOrganizer.releasePot(potId);
    }

    /// Expected: reverts TransferFailed, and the contributor's own accounting is
    /// left untouched (not zeroed) by the failed attempt, so a later working
    /// address could still be used — this test only asserts the revert itself,
    /// since the contract has no separate withdrawal-address mechanism.
    function test_Security_RevertsWithTransferFailedIfContributorRejectsRefund() public {
        RevertingReceiver badContributor = new RevertingReceiver(potluck);
        vm.deal(address(badContributor), 5 ether);

        vm.prank(organizer);
        uint256 potId = potluck.createPot("A", "d", 5 ether, block.timestamp + 1 days);

        badContributor.contributeToPot{value: 1 ether}(potId);
        vm.warp(block.timestamp + 2 days);

        vm.expectRevert(Potluck.TransferFailed.selector);
        badContributor.claimRefundFor(potId);
    }

    /// Expected: the contract's actual MON balance always equals the sum of every
    /// pot's still-unsettled funds — never more (no phantom balance), never less
    /// (no under-collateralization). Checked across create → contribute → release
    /// → refund in the same test to catch any drift introduced by either path.
    function test_Invariant_ContractBalanceMatchesUnsettledContributions() public {
        vm.prank(organizer);
        uint256 potA = potluck.createPot("A", "d", 3 ether, block.timestamp + 1 days);
        vm.prank(organizer);
        uint256 potB = potluck.createPot("B", "d", 10 ether, block.timestamp + 1 days);

        vm.prank(attacker);
        potluck.contribute{value: 3 ether}(potA);
        vm.prank(attacker);
        potluck.contribute{value: 2 ether}(potB);

        assertEq(address(potluck).balance, 5 ether);

        vm.prank(organizer);
        potluck.release(potA);
        assertEq(address(potluck).balance, 2 ether);

        vm.warp(block.timestamp + 2 days);
        vm.prank(attacker);
        potluck.claimRefund(potB);
        assertEq(address(potluck).balance, 0);
    }
}
