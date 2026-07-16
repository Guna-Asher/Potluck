// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title Potluck
/// @notice Trustless group pots: contribute MON toward a target, organizer
///         releases on success, contributors self-refund on expiry.
contract Potluck {
    struct Pot {
        address organizer;
        string title;
        string description;
        uint256 targetAmount;
        uint256 deadline;
        uint256 totalContributed;
        uint256 contributorCount;
        bool released;
        mapping(address => uint256) contributions;
        mapping(address => bool) hasContributed;
    }

    mapping(uint256 => Pot) private pots;
    uint256 private nextPotId = 1;

    event PotCreated(
        uint256 indexed potId,
        address indexed organizer,
        string title,
        uint256 targetAmount,
        uint256 deadline
    );
    event Contributed(
        uint256 indexed potId,
        address indexed contributor,
        uint256 amount,
        uint256 newTotal
    );
    event Released(uint256 indexed potId, address indexed organizer, uint256 amount);
    event Refunded(uint256 indexed potId, address indexed contributor, uint256 amount);

    error InvalidPotId();
    error DeadlineInPast();
    error ZeroTarget();
    error AlreadyReleased();
    error DeadlinePassed();
    error DeadlineNotReached();
    error ZeroValue();
    error NotOrganizer();
    error TargetNotMet();
    error NoContribution();
    error TransferFailed();

    modifier potExists(uint256 potId) {
        if (potId == 0 || potId >= nextPotId) revert InvalidPotId();
        _;
    }

    modifier onlyOrganizer(uint256 potId) {
        if (msg.sender != pots[potId].organizer) revert NotOrganizer();
        _;
    }

    modifier notReleased(uint256 potId) {
        if (pots[potId].released) revert AlreadyReleased();
        _;
    }

    /// @notice Registers a new pot. Caller becomes the organizer.
    function createPot(
        string calldata title,
        string calldata description,
        uint256 targetAmount,
        uint256 deadline
    ) external returns (uint256 potId) {
        if (deadline <= block.timestamp) revert DeadlineInPast();
        if (targetAmount == 0) revert ZeroTarget();

        potId = nextPotId++;

        Pot storage pot = pots[potId];
        pot.organizer = msg.sender;
        pot.title = title;
        pot.description = description;
        pot.targetAmount = targetAmount;
        pot.deadline = deadline;

        emit PotCreated(potId, msg.sender, title, targetAmount, deadline);
    }

    /// @notice Adds msg.value to the pot's balance and the caller's contribution.
    function contribute(uint256 potId)
        external
        payable
        potExists(potId)
        notReleased(potId)
    {
        Pot storage pot = pots[potId];
        if (block.timestamp > pot.deadline) revert DeadlinePassed();
        if (msg.value == 0) revert ZeroValue();

        if (!pot.hasContributed[msg.sender]) {
            pot.hasContributed[msg.sender] = true;
            pot.contributorCount += 1;
        }

        pot.contributions[msg.sender] += msg.value;
        pot.totalContributed += msg.value;

        emit Contributed(potId, msg.sender, msg.value, pot.totalContributed);
    }

    /// @notice Pays the full pot balance to the organizer once the target is met.
    /// @dev Only callable at or before the deadline; after expiry, refund is the only path.
    function release(uint256 potId)
        external
        potExists(potId)
        onlyOrganizer(potId)
        notReleased(potId)
    {
        Pot storage pot = pots[potId];
        if (pot.totalContributed < pot.targetAmount) revert TargetNotMet();
        if (block.timestamp > pot.deadline) revert DeadlinePassed();

        pot.released = true;
        uint256 amount = pot.totalContributed;

        (bool success, ) = pot.organizer.call{value: amount}("");
        if (!success) revert TransferFailed();

        emit Released(potId, pot.organizer, amount);
    }

    /// @notice Returns the caller's own contribution once the pot has expired unreleased.
    /// @dev Available after the deadline regardless of whether the target was met,
    ///      so an organizer who never releases cannot strand contributor funds.
    function claimRefund(uint256 potId)
        external
        potExists(potId)
        notReleased(potId)
    {
        Pot storage pot = pots[potId];
        if (block.timestamp <= pot.deadline) revert DeadlineNotReached();

        uint256 amount = pot.contributions[msg.sender];
        if (amount == 0) revert NoContribution();

        pot.contributions[msg.sender] = 0;

        (bool success, ) = msg.sender.call{value: amount}("");
        if (!success) revert TransferFailed();

        emit Refunded(potId, msg.sender, amount);
    }

    /// @notice Reads a pot's full state for the frontend tracker.
    function getPot(uint256 potId)
        external
        view
        potExists(potId)
        returns (
            address organizer,
            string memory title,
            string memory description,
            uint256 targetAmount,
            uint256 deadline,
            uint256 totalContributed,
            uint256 contributorCount,
            bool released
        )
    {
        Pot storage pot = pots[potId];
        return (
            pot.organizer,
            pot.title,
            pot.description,
            pot.targetAmount,
            pot.deadline,
            pot.totalContributed,
            pot.contributorCount,
            pot.released
        );
    }

    /// @notice Reads one address's contribution to a pot.
    function getContribution(uint256 potId, address contributor)
        external
        view
        potExists(potId)
        returns (uint256 amount)
    {
        return pots[potId].contributions[contributor];
    }
}
