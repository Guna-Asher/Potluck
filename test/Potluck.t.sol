// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {Potluck} from "../src/Potluck.sol";

/// @notice Core unit + happy-path coverage for every function, one function per section.
contract PotluckTest is Test {
    Potluck internal potluck;

    address internal organizer = makeAddr("organizer");
    address internal alice = makeAddr("alice");
    address internal bob = makeAddr("bob");
    address internal carol = makeAddr("carol");

    string internal constant TITLE = "Beach house";
    string internal constant DESCRIPTION = "6 people, $1200 total";
    uint256 internal constant TARGET = 10 ether;
    uint256 internal DEADLINE;

    event PotCreated(
        uint256 indexed potId, address indexed organizer, string title, uint256 targetAmount, uint256 deadline
    );
    event Contributed(uint256 indexed potId, address indexed contributor, uint256 amount, uint256 newTotal);
    event Released(uint256 indexed potId, address indexed organizer, uint256 amount);
    event Refunded(uint256 indexed potId, address indexed contributor, uint256 amount);

    function setUp() public {
        potluck = new Potluck();
        DEADLINE = block.timestamp + 7 days;

        vm.deal(organizer, 100 ether);
        vm.deal(alice, 100 ether);
        vm.deal(bob, 100 ether);
        vm.deal(carol, 100 ether);
    }

    function _createPot() internal returns (uint256) {
        vm.prank(organizer);
        return potluck.createPot(TITLE, DESCRIPTION, TARGET, DEADLINE);
    }

    // ==================== createPot ====================
    // Verifies: pot registration, input validation, ID sequencing, organizer isolation.
    // Matters: this is the only entry point into the system — if it mis-records the
    // organizer, target, or deadline, every downstream guarantee is void.

    function test_CreatePot_HappyPath() public {
        vm.expectEmit(true, true, false, true);
        emit PotCreated(1, organizer, TITLE, TARGET, DEADLINE);

        uint256 potId = _createPot();
        assertEq(potId, 1);

        (
            address returnedOrganizer,
            string memory title,
            string memory description,
            uint256 targetAmount,
            uint256 deadline,
            uint256 totalContributed,
            uint256 contributorCount,
            bool released
        ) = potluck.getPot(potId);

        assertEq(returnedOrganizer, organizer);
        assertEq(title, TITLE);
        assertEq(description, DESCRIPTION);
        assertEq(targetAmount, TARGET);
        assertEq(deadline, DEADLINE);
        assertEq(totalContributed, 0);
        assertEq(contributorCount, 0);
        assertFalse(released);
    }

    /// Expected: reverts DeadlineInPast. A pot that's already expired at creation
    /// would be un-fundable and un-releasable from the first block — a dead pot.
    function test_CreatePot_RevertsOnPastDeadline() public {
        vm.warp(1_000);
        vm.expectRevert(Potluck.DeadlineInPast.selector);
        vm.prank(organizer);
        potluck.createPot(TITLE, DESCRIPTION, TARGET, block.timestamp - 1);
    }

    /// Expected: reverts DeadlineInPast. Boundary case — `deadline == now` must be
    /// treated as already-expired, not as "exactly on time", to match contribute's
    /// and release's own `<=` semantics.
    function test_CreatePot_RevertsWhenDeadlineEqualsNow() public {
        vm.expectRevert(Potluck.DeadlineInPast.selector);
        vm.prank(organizer);
        potluck.createPot(TITLE, DESCRIPTION, TARGET, block.timestamp);
    }

    /// Expected: reverts ZeroTarget. A zero target would make the pot instantly
    /// "goal met" with no contributions, defeating the entire escrow premise.
    function test_CreatePot_RevertsOnZeroTarget() public {
        vm.expectRevert(Potluck.ZeroTarget.selector);
        vm.prank(organizer);
        potluck.createPot(TITLE, DESCRIPTION, 0, DEADLINE);
    }

    /// Expected: potIds are 1, 2, 3 in creation order. The frontend's shareable
    /// link embeds this ID directly, so stable sequencing is a product requirement.
    function test_CreatePot_IdsIncrementSequentially() public {
        assertEq(_createPot(), 1);
        assertEq(_createPot(), 2);
        assertEq(_createPot(), 3);
    }

    /// Expected: two pots created by different organizers store independent
    /// organizer addresses — no shared/global state leaks between them.
    function test_CreatePot_IndependentAcrossOrganizers() public {
        uint256 potA = _createPot();
        vm.prank(alice);
        uint256 potB = potluck.createPot("Trip", "desc", 5 ether, DEADLINE);

        (address orgA,,,,,,,) = potluck.getPot(potA);
        (address orgB,,,,,,,) = potluck.getPot(potB);
        assertEq(orgA, organizer);
        assertEq(orgB, alice);
    }

    // ==================== contribute ====================
    // Verifies: balance accounting, unique-contributor counting, time/state gating.
    // Matters: this function moves real money into escrow — any accounting bug here
    // is a direct financial bug for a real contributor.

    function test_Contribute_HappyPath_UpdatesState() public {
        uint256 potId = _createPot();

        vm.expectEmit(true, true, false, true);
        emit Contributed(potId, alice, 2 ether, 2 ether);

        vm.prank(alice);
        potluck.contribute{value: 2 ether}(potId);

        (,,,,, uint256 totalContributed, uint256 contributorCount,) = potluck.getPot(potId);
        assertEq(totalContributed, 2 ether);
        assertEq(contributorCount, 1);
        assertEq(potluck.getContribution(potId, alice), 2 ether);
    }

    /// Expected: contributorCount == 3. Three distinct addresses must each be
    /// counted once — this is the number the PRD requires the tracker UI to show.
    function test_Contribute_MultipleDistinctContributorsIncrementCount() public {
        uint256 potId = _createPot();

        vm.prank(alice);
        potluck.contribute{value: 1 ether}(potId);
        vm.prank(bob);
        potluck.contribute{value: 1 ether}(potId);
        vm.prank(carol);
        potluck.contribute{value: 1 ether}(potId);

        (,,,,, uint256 totalContributed, uint256 contributorCount,) = potluck.getPot(potId);
        assertEq(totalContributed, 3 ether);
        assertEq(contributorCount, 3);
    }

    /// Expected: contributorCount stays 1, but totalContributed and the caller's
    /// own recorded contribution both sum correctly. Guards against a naive
    /// implementation that double-counts repeat contributors.
    function test_Contribute_SameAddressTwiceDoesNotDoubleCount() public {
        uint256 potId = _createPot();

        vm.startPrank(alice);
        potluck.contribute{value: 1 ether}(potId);
        potluck.contribute{value: 1.5 ether}(potId);
        vm.stopPrank();

        (,,,,, uint256 totalContributed, uint256 contributorCount,) = potluck.getPot(potId);
        assertEq(totalContributed, 2.5 ether);
        assertEq(contributorCount, 1);
        assertEq(potluck.getContribution(potId, alice), 2.5 ether);
    }

    function test_Contribute_RevertsOnInvalidPotId() public {
        vm.expectRevert(Potluck.InvalidPotId.selector);
        vm.prank(alice);
        potluck.contribute{value: 1 ether}(999);
    }

    /// Expected: reverts ZeroValue. A no-op contribution would still increment
    /// contributorCount for a first-time caller if not blocked explicitly.
    function test_Contribute_RevertsOnZeroValue() public {
        uint256 potId = _createPot();
        vm.expectRevert(Potluck.ZeroValue.selector);
        vm.prank(alice);
        potluck.contribute{value: 0}(potId);
    }

    function test_Contribute_RevertsAfterDeadline() public {
        uint256 potId = _createPot();
        vm.warp(DEADLINE + 1);

        vm.expectRevert(Potluck.DeadlinePassed.selector);
        vm.prank(alice);
        potluck.contribute{value: 1 ether}(potId);
    }

    /// Expected: reverts AlreadyReleased. Once funds are paid out, the pot must be
    /// fully closed to new money — otherwise late contributions are silently stranded.
    function test_Contribute_RevertsAfterRelease() public {
        uint256 potId = _createPot();
        vm.prank(alice);
        potluck.contribute{value: TARGET}(potId);
        vm.prank(organizer);
        potluck.release(potId);

        vm.expectRevert(Potluck.AlreadyReleased.selector);
        vm.prank(bob);
        potluck.contribute{value: 1 ether}(potId);
    }

    /// Expected: succeeds, totalContributed > targetAmount. The contract has no cap —
    /// real friend groups round up or over-pay, and that must not revert.
    function test_Contribute_AllowsOverfunding() public {
        uint256 potId = _createPot();
        vm.prank(alice);
        potluck.contribute{value: TARGET + 5 ether}(potId);

        (,,,,, uint256 totalContributed,,) = potluck.getPot(potId);
        assertEq(totalContributed, TARGET + 5 ether);
    }

    /// Expected: succeeds. `block.timestamp == deadline` is still "before or at"
    /// the deadline under the contract's `>` check — the open/closed boundary
    /// must be consistent so the frontend's own countdown logic can rely on it.
    function test_Contribute_SucceedsExactlyAtDeadline() public {
        uint256 potId = _createPot();
        vm.warp(DEADLINE);

        vm.prank(alice);
        potluck.contribute{value: 1 ether}(potId);

        assertEq(potluck.getContribution(potId, alice), 1 ether);
    }

    // ==================== release ====================
    // Verifies: payout correctness, access control, the target/deadline gate.
    // Matters: this is the one function that moves the entire pot balance out in
    // a single call — the highest-value target in the whole contract.

    function test_Release_HappyPath_TransfersFundsToOrganizer() public {
        uint256 potId = _createPot();
        vm.prank(alice);
        potluck.contribute{value: TARGET}(potId);

        uint256 balanceBefore = organizer.balance;

        vm.expectEmit(true, true, false, true);
        emit Released(potId, organizer, TARGET);

        vm.prank(organizer);
        potluck.release(potId);

        assertEq(organizer.balance, balanceBefore + TARGET);
        (,,,,,,, bool released) = potluck.getPot(potId);
        assertTrue(released);
    }

    /// Expected: reverts NotOrganizer. Only the address recorded at creation may
    /// ever trigger a payout — this is the core "no one else can move the money" claim.
    function test_Release_RevertsIfNotOrganizer() public {
        uint256 potId = _createPot();
        vm.prank(alice);
        potluck.contribute{value: TARGET}(potId);

        vm.expectRevert(Potluck.NotOrganizer.selector);
        vm.prank(alice);
        potluck.release(potId);
    }

    function test_Release_RevertsIfTargetNotMet() public {
        uint256 potId = _createPot();
        vm.prank(alice);
        potluck.contribute{value: TARGET - 1}(potId);

        vm.expectRevert(Potluck.TargetNotMet.selector);
        vm.prank(organizer);
        potluck.release(potId);
    }

    /// Expected: reverts DeadlinePassed even though the target WAS met. This is the
    /// architectural decision that collapses "organizer went silent after success"
    /// into the ordinary refund path with zero extra branching — the single most
    /// important behavior in the contract to pin down with a test.
    function test_Release_RevertsAfterDeadlineEvenIfTargetMet() public {
        uint256 potId = _createPot();
        vm.prank(alice);
        potluck.contribute{value: TARGET}(potId);
        vm.warp(DEADLINE + 1);

        vm.expectRevert(Potluck.DeadlinePassed.selector);
        vm.prank(organizer);
        potluck.release(potId);
    }

    function test_Release_RevertsIfAlreadyReleased() public {
        uint256 potId = _createPot();
        vm.prank(alice);
        potluck.contribute{value: TARGET}(potId);
        vm.prank(organizer);
        potluck.release(potId);

        vm.expectRevert(Potluck.AlreadyReleased.selector);
        vm.prank(organizer);
        potluck.release(potId);
    }

    function test_Release_RevertsOnInvalidPotId() public {
        vm.expectRevert(Potluck.InvalidPotId.selector);
        vm.prank(organizer);
        potluck.release(42);
    }

    /// Expected: succeeds. Mirrors contribute's boundary — release must still be
    /// reachable at the exact deadline second, not just strictly before it.
    function test_Release_SucceedsExactlyAtDeadline() public {
        uint256 potId = _createPot();
        vm.prank(alice);
        potluck.contribute{value: TARGET}(potId);
        vm.warp(DEADLINE);

        vm.prank(organizer);
        potluck.release(potId);

        (,,,,,,, bool released) = potluck.getPot(potId);
        assertTrue(released);
    }

    // ==================== claimRefund ====================
    // Verifies: exact-amount refunds, time/state gating, the abandoned-organizer
    // fallback, and that a claim can never be repeated.
    // Matters: this is the trust guarantee contributors are actually relying on —
    // "my money comes back with no one's permission" only holds if this is airtight.

    function test_ClaimRefund_HappyPath_ReturnsExactContribution() public {
        uint256 potId = _createPot();
        vm.prank(alice);
        potluck.contribute{value: 3 ether}(potId);
        vm.warp(DEADLINE + 1);

        uint256 balanceBefore = alice.balance;

        vm.expectEmit(true, true, false, true);
        emit Refunded(potId, alice, 3 ether);

        vm.prank(alice);
        potluck.claimRefund(potId);

        assertEq(alice.balance, balanceBefore + 3 ether);
        assertEq(potluck.getContribution(potId, alice), 0);
    }

    function test_ClaimRefund_RevertsBeforeDeadline() public {
        uint256 potId = _createPot();
        vm.prank(alice);
        potluck.contribute{value: 1 ether}(potId);

        vm.expectRevert(Potluck.DeadlineNotReached.selector);
        vm.prank(alice);
        potluck.claimRefund(potId);
    }

    /// Expected: reverts DeadlineNotReached. Mirror image of release's boundary —
    /// refund requires *strictly after* the deadline, so the two paths never
    /// overlap at the exact second the deadline falls.
    function test_ClaimRefund_RevertsExactlyAtDeadline() public {
        uint256 potId = _createPot();
        vm.prank(alice);
        potluck.contribute{value: 1 ether}(potId);
        vm.warp(DEADLINE);

        vm.expectRevert(Potluck.DeadlineNotReached.selector);
        vm.prank(alice);
        potluck.claimRefund(potId);
    }

    function test_ClaimRefund_RevertsIfNoContribution() public {
        uint256 potId = _createPot();
        vm.warp(DEADLINE + 1);

        vm.expectRevert(Potluck.NoContribution.selector);
        vm.prank(bob);
        potluck.claimRefund(potId);
    }

    /// Expected: reverts AlreadyReleased. A contributor to a *successfully released*
    /// pot must not also be able to claim a refund after the deadline passes.
    function test_ClaimRefund_RevertsIfAlreadyReleased() public {
        uint256 potId = _createPot();
        vm.prank(alice);
        potluck.contribute{value: TARGET}(potId);
        vm.prank(organizer);
        potluck.release(potId);
        vm.warp(DEADLINE + 1);

        vm.expectRevert(Potluck.AlreadyReleased.selector);
        vm.prank(alice);
        potluck.claimRefund(potId);
    }

    /// Expected: first claim succeeds, second reverts NoContribution. This is the
    /// business-logic proof that a contribution can only ever be paid out once —
    /// the non-reentrant version of the property Section "Reentrancy" stress-tests.
    function test_ClaimRefund_RevertsOnDoubleClaim() public {
        uint256 potId = _createPot();
        vm.prank(alice);
        potluck.contribute{value: 1 ether}(potId);
        vm.warp(DEADLINE + 1);

        vm.prank(alice);
        potluck.claimRefund(potId);

        vm.expectRevert(Potluck.NoContribution.selector);
        vm.prank(alice);
        potluck.claimRefund(potId);
    }

    /// Expected: succeeds even though totalContributed >= targetAmount. Proves the
    /// "abandoned organizer" fallback: hitting the target is not enough on its own —
    /// if release() was never called before the deadline, refund is still available.
    function test_ClaimRefund_WorksEvenIfTargetMetButNeverReleased() public {
        uint256 potId = _createPot();
        vm.prank(alice);
        potluck.contribute{value: TARGET}(potId);
        vm.warp(DEADLINE + 1);

        uint256 balanceBefore = alice.balance;
        vm.prank(alice);
        potluck.claimRefund(potId);

        assertEq(alice.balance, balanceBefore + TARGET);
    }

    /// Expected: each contributor receives exactly their own amount, and claiming
    /// one contributor's refund has zero effect on the others' balances or claims.
    function test_ClaimRefund_EachContributorGetsOnlyOwnAmount() public {
        uint256 potId = _createPot();
        vm.prank(alice);
        potluck.contribute{value: 1 ether}(potId);
        vm.prank(bob);
        potluck.contribute{value: 2 ether}(potId);
        vm.prank(carol);
        potluck.contribute{value: 3 ether}(potId);
        vm.warp(DEADLINE + 1);

        uint256 aliceBefore = alice.balance;
        uint256 carolBefore = carol.balance;

        vm.prank(bob);
        potluck.claimRefund(potId);
        assertEq(alice.balance, aliceBefore);
        assertEq(carol.balance, carolBefore);

        vm.prank(alice);
        potluck.claimRefund(potId);
        vm.prank(carol);
        potluck.claimRefund(potId);

        assertEq(alice.balance, aliceBefore + 1 ether);
        assertEq(carol.balance, carolBefore + 3 ether);
    }

    // ==================== views ====================
    // Verifies: read functions never expose data for pots that don't exist, and
    // return accurate zero-state for addresses that never contributed.

    function test_GetPot_RevertsOnInvalidPotId() public {
        vm.expectRevert(Potluck.InvalidPotId.selector);
        potluck.getPot(0);

        vm.expectRevert(Potluck.InvalidPotId.selector);
        potluck.getPot(1);
    }

    function test_GetContribution_ReturnsZeroForNonContributor() public {
        uint256 potId = _createPot();
        assertEq(potluck.getContribution(potId, bob), 0);
    }

    function test_GetContribution_RevertsOnInvalidPotId() public {
        vm.expectRevert(Potluck.InvalidPotId.selector);
        potluck.getContribution(999, bob);
    }

    // ==================== fuzz ====================
    // Verifies invariants across a wide input space instead of a handful of
    // hand-picked values — this is what makes the coverage "meaningful" rather
    // than just line-count.

    /// Expected: every deadline at or before "now" reverts, across the full
    /// range of possible timestamps, not just the one or two values tested above.
    function testFuzz_CreatePot_OnlyFutureDeadlinesAccepted(uint256 deadline) public {
        deadline = bound(deadline, 0, block.timestamp);
        vm.expectRevert(Potluck.DeadlineInPast.selector);
        vm.prank(organizer);
        potluck.createPot(TITLE, DESCRIPTION, TARGET, deadline);
    }

    /// Expected: for any two contribution amounts, totalContributed equals their
    /// sum AND the contract's actual MON balance equals that same sum — catches
    /// any accounting drift between the ledger and real escrowed funds.
    function testFuzz_Contribute_TotalAlwaysMatchesSumAndBalance(uint96 amountA, uint96 amountB) public {
        amountA = uint96(bound(amountA, 1, 50 ether));
        amountB = uint96(bound(amountB, 1, 50 ether));

        uint256 potId = _createPot();

        vm.prank(alice);
        potluck.contribute{value: amountA}(potId);
        vm.prank(bob);
        potluck.contribute{value: amountB}(potId);

        (,,,,, uint256 totalContributed,,) = potluck.getPot(potId);
        assertEq(totalContributed, uint256(amountA) + uint256(amountB));
        assertEq(address(potluck).balance, uint256(amountA) + uint256(amountB));
    }
}
