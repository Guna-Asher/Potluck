// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Potluck} from "../../src/Potluck.sol";

/// @notice Test double that rejects all incoming MON, used to trigger TransferFailed.
contract RevertingReceiver {
    Potluck public immutable potluck;

    constructor(Potluck _potluck) {
        potluck = _potluck;
    }

    function createPotAsOrganizer(
        string calldata title,
        string calldata description,
        uint256 target,
        uint256 deadline
    ) external returns (uint256) {
        return potluck.createPot(title, description, target, deadline);
    }

    function releasePot(uint256 potId) external {
        potluck.release(potId);
    }

    function contributeToPot(uint256 potId) external payable {
        potluck.contribute{value: msg.value}(potId);
    }

    function claimRefundFor(uint256 potId) external {
        potluck.claimRefund(potId);
    }

    receive() external payable {
        revert("no MON accepted");
    }
}

/// @notice Test double that reenters Potluck from within its receive() hook.
/// @dev The reentry target is configurable so the same attacker can prove both
///      that release() can't be re-triggered on itself, and that the same
///      `released` flag also blocks a reentrant claimRefund() on the same pot.
contract ReentrantOrganizerAttacker {
    Potluck public immutable potluck;
    uint256 public potId;
    bool public attacked;
    bool public reentrantCallSucceeded;
    bytes4 private reentryTarget;

    constructor(Potluck _potluck) {
        potluck = _potluck;
    }

    function createAttackPot(
        string calldata title,
        string calldata description,
        uint256 target,
        uint256 deadline
    ) external returns (uint256) {
        potId = potluck.createPot(title, description, target, deadline);
        return potId;
    }

    function setReentryTarget(bytes4 selector) external {
        reentryTarget = selector;
    }

    function attackRelease() external {
        potluck.release(potId);
    }

    receive() external payable {
        if (!attacked) {
            attacked = true;
            bytes4 selector = reentryTarget == bytes4(0) ? Potluck.release.selector : reentryTarget;
            (bool success, ) = address(potluck).call(abi.encodeWithSelector(selector, potId));
            reentrantCallSucceeded = success;
        }
    }
}

/// @notice Test double that reenters claimRefund() from within its receive() hook.
contract ReentrantContributorAttacker {
    Potluck public immutable potluck;
    uint256 public potId;
    bool public attacked;
    bool public reentrantCallSucceeded;

    constructor(Potluck _potluck) {
        potluck = _potluck;
    }

    function contributeToPot(uint256 _potId) external payable {
        potId = _potId;
        potluck.contribute{value: msg.value}(_potId);
    }

    function attackClaimRefund() external {
        potluck.claimRefund(potId);
    }

    receive() external payable {
        if (!attacked) {
            attacked = true;
            (bool success, ) =
                address(potluck).call(abi.encodeWithSelector(Potluck.claimRefund.selector, potId));
            reentrantCallSucceeded = success;
        }
    }
}
