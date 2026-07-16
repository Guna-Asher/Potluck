// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {Potluck} from "../src/Potluck.sol";
import {ReentrantOrganizerAttacker, ReentrantContributorAttacker} from "./utils/Attackers.sol";

/// @notice Proves the checks-effects-interactions ordering in release() and
///         claimRefund() actually holds under an active reentrancy attempt,
///         not just by inspection.
contract PotluckReentrancyTest is Test {
    Potluck internal potluck;
    address internal contributor = makeAddr("contributor");

    function setUp() public {
        potluck = new Potluck();
        vm.deal(contributor, 100 ether);
        vm.deal(address(this), 100 ether);
    }

    /// Expected: the reentrant call from receive() fails (reentrantCallSucceeded
    /// == false) because `released` was already flipped to true before the
    /// external call; the original release still succeeds exactly once and the
    /// attacker's balance reflects one payout, not two.
    function test_Reentrancy_ReleaseCannotBeDrainedTwice() public {
        ReentrantOrganizerAttacker attackerOrg = new ReentrantOrganizerAttacker(potluck);
        uint256 potId = attackerOrg.createAttackPot("Attack pot", "d", 5 ether, block.timestamp + 1 days);

        vm.prank(contributor);
        potluck.contribute{value: 5 ether}(potId);

        attackerOrg.attackRelease();

        assertFalse(attackerOrg.reentrantCallSucceeded());
        assertEq(address(attackerOrg).balance, 5 ether);
        assertEq(address(potluck).balance, 0);

        (,,,,,,, bool released) = potluck.getPot(potId);
        assertTrue(released);
    }

    /// Expected: same shape as the release attack, but for claimRefund — the
    /// reentrant second claim fails because `contributions[msg.sender]` was
    /// zeroed before the transfer, so the attacker only ever recovers exactly
    /// what it originally put in.
    function test_Reentrancy_ClaimRefundCannotBeDrainedTwice() public {
        ReentrantContributorAttacker attackerContributor = new ReentrantContributorAttacker(potluck);
        vm.deal(address(attackerContributor), 10 ether);

        vm.prank(contributor);
        uint256 potId = potluck.createPot("Target pot", "d", 100 ether, block.timestamp + 1 days);

        attackerContributor.contributeToPot{value: 3 ether}(potId);
        vm.warp(block.timestamp + 2 days);

        attackerContributor.attackClaimRefund();

        assertFalse(attackerContributor.reentrantCallSucceeded());
        assertEq(potluck.getContribution(potId, address(attackerContributor)), 0);
    }

    /// Expected: reentering into claimRefund() *from within release()'s payout*
    /// on the SAME pot also fails, proving the single `released` flag guards
    /// both entry points at once — not just the function currently executing.
    function test_Reentrancy_ReleasedFlagAlsoBlocksReentrantClaimRefund() public {
        ReentrantOrganizerAttacker attackerOrg = new ReentrantOrganizerAttacker(potluck);
        uint256 potId = attackerOrg.createAttackPot("Attack pot", "d", 5 ether, block.timestamp + 1 days);

        vm.prank(contributor);
        potluck.contribute{value: 5 ether}(potId);

        attackerOrg.setReentryTarget(Potluck.claimRefund.selector);
        attackerOrg.attackRelease();

        assertFalse(attackerOrg.reentrantCallSucceeded());
        assertEq(address(attackerOrg).balance, 5 ether);
    }
}
