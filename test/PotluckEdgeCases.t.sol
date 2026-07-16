// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {Potluck} from "../src/Potluck.sol";

/// @notice Boundary and compound scenarios beyond a single function's basic contract.
contract PotluckEdgeCasesTest is Test {
    Potluck internal potluck;
    address internal organizer = makeAddr("organizer");
    address internal alice = makeAddr("alice");
    address internal bob = makeAddr("bob");

    function setUp() public {
        potluck = new Potluck();
        vm.deal(alice, 1_000 ether);
        vm.deal(bob, 1_000 ether);
    }

    /// Expected: reverts InvalidPotId. `nextPotId` itself has never been minted —
    /// this is the exact off-by-one an attacker would probe first.
    function test_Edge_PotIdExactlyAtNextPotIdBoundaryReverts() public {
        vm.prank(organizer);
        uint256 potId = potluck.createPot("A", "d", 1 ether, block.timestamp + 1 days);

        vm.expectRevert(Potluck.InvalidPotId.selector);
        potluck.getPot(potId + 1);
    }

    /// Expected: contributing to, and releasing, pot A has zero effect on pot B's
    /// balance or released flag. Each `Pot` struct in the mapping must be fully
    /// self-contained — this is the whole justification for the single-contract,
    /// multi-pot design over per-pot deployments.
    function test_Edge_MultiplePotsAreFullyIsolated() public {
        vm.prank(organizer);
        uint256 potA = potluck.createPot("A", "d", 5 ether, block.timestamp + 1 days);
        vm.prank(organizer);
        uint256 potB = potluck.createPot("B", "d", 5 ether, block.timestamp + 1 days);

        vm.prank(alice);
        potluck.contribute{value: 5 ether}(potA);

        (,,,,, uint256 totalA,,) = potluck.getPot(potA);
        (,,,,, uint256 totalB,,) = potluck.getPot(potB);
        assertEq(totalA, 5 ether);
        assertEq(totalB, 0);

        vm.prank(organizer);
        potluck.release(potA);

        (,,,,,,, bool releasedA) = potluck.getPot(potA);
        (,,,,,,, bool releasedB) = potluck.getPot(potB);
        assertTrue(releasedA);
        assertFalse(releasedB);
    }

    /// Expected: contributor gets back the full 9 ether, not capped at the
    /// 5 ether target. A refund is defined as "return what you put in," not
    /// "return your pro-rata share of the goal" — overfunding must round-trip.
    function test_Edge_OverfundedUnreleasedPotRefundsFullOverfundedAmount() public {
        vm.prank(organizer);
        uint256 potId = potluck.createPot("A", "d", 5 ether, block.timestamp + 1 days);

        vm.prank(alice);
        potluck.contribute{value: 9 ether}(potId);
        vm.warp(block.timestamp + 2 days);

        uint256 before = alice.balance;
        vm.prank(alice);
        potluck.claimRefund(potId);

        assertEq(alice.balance, before + 9 ether);
    }

    function test_Edge_CreatePotWithFarFutureDeadlineSucceeds() public {
        uint256 deadline = block.timestamp + 100 * 365 days;
        vm.prank(organizer);
        uint256 potId = potluck.createPot("Legacy pot", "d", 1 ether, deadline);

        (,,,, uint256 storedDeadline,,,) = potluck.getPot(potId);
        assertEq(storedDeadline, deadline);
    }

    /// Expected: an unreachably large target never blocks a contributor from
    /// getting their own money back — the refund path must not assume the
    /// target is realistic.
    function test_Edge_CreatePotWithExtremeTargetNeverBlocksRefunds() public {
        vm.prank(organizer);
        uint256 potId = potluck.createPot("Whale pot", "d", type(uint128).max, block.timestamp + 1 days);

        vm.prank(alice);
        potluck.contribute{value: 1 ether}(potId);
        vm.warp(block.timestamp + 2 days);

        uint256 before = alice.balance;
        vm.prank(alice);
        potluck.claimRefund(potId);
        assertEq(alice.balance, before + 1 ether);
    }

    /// Expected: contributorCount stays 2 after a refund. This documents an
    /// intentional design decision — contributorCount is a historical record of
    /// unique participants, not a live "still owed" counter — so it doesn't
    /// silently look like a bug when it's read after a refund has happened.
    function test_Edge_ContributorCountUnaffectedByRefunds() public {
        vm.prank(organizer);
        uint256 potId = potluck.createPot("A", "d", 10 ether, block.timestamp + 1 days);

        vm.prank(alice);
        potluck.contribute{value: 1 ether}(potId);
        vm.prank(bob);
        potluck.contribute{value: 1 ether}(potId);
        vm.warp(block.timestamp + 2 days);

        vm.prank(alice);
        potluck.claimRefund(potId);

        (,,,,, , uint256 contributorCount,) = potluck.getPot(potId);
        assertEq(contributorCount, 2);
    }
}
