// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Importing ReentrancyGuard from OpenZeppelin
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract InvestmentCampaign is ReentrancyGuard {

    address public developer;
    address public admin;
    uint256 public goalAmount;
    uint256 public totalContributed;
    uint256 public deadline;
    bool public goalReached;
    mapping(address => uint256) public contributions;
    bool public paused;

    uint256 public lastRefundTime; // To prevent repeated refund calls within the same block

    // Events for front-end interaction
    event ContributionReceived(address investor, uint256 amount);
    event GoalAchieved(uint256 totalAmount);
    event RefundIssued(address investor, uint256 amount);
    event ContractPaused(address admin);
    event ContractResumed(address admin);

    // Modifier to ensure contract is not paused
    modifier notPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    // Modifier to ensure only admin can call certain functions
    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    // Constructor to initialize the contract
    constructor(uint256 _goalAmount, uint256 _deadline) {
        developer = msg.sender;
        admin = msg.sender;
        goalAmount = _goalAmount;
        deadline = _deadline;
        goalReached = false;
        totalContributed = 0;
        paused = false;
        lastRefundTime = 0; // Initialize last refund time
    }

    // Function to allow users to contribute to the campaign
    function contribute() public payable notPaused {
        require(block.timestamp < deadline, "Campaign deadline passed");
        require(msg.value > 0, "Contribution must be greater than 0");
        require(msg.sender != address(0), "Invalid sender address"); // Ensure valid sender

        // Ensure contribution does not exceed the remaining goal amount
        uint256 remainingGoal = goalAmount - totalContributed;
        require(msg.value <= remainingGoal, "Contribution exceeds remaining goal amount");

        contributions[msg.sender] += msg.value;
        totalContributed += msg.value;
        emit ContributionReceived(msg.sender, msg.value);

        // Check if the goal is reached
        if (totalContributed >= goalAmount && !goalReached) {
            goalReached = true;
            emit GoalAchieved(totalContributed);
        }
    }

    // Function to refund contributors if the goal is not met by the deadline
    // Using nonReentrant modifier to prevent reentrancy attacks
    function claimRefund() public nonReentrant notPaused {
        require(block.timestamp > deadline, "Campaign deadline has not passed");
        require(totalContributed < goalAmount, "Goal has been met, no refund");
        require(msg.sender != address(0), "Invalid sender address"); // Ensure valid sender

        uint256 contributedAmount = contributions[msg.sender];
        require(contributedAmount > 0, "No contributions to refund");

        // Ensure a minimum time interval between claims to prevent multiple calls in the same block
        require(block.timestamp > lastRefundTime + 1 minutes, "Refund claim cooldown period not passed");

        // Updates the state before transferring funds
        contributions[msg.sender] = 0;

        // Transfer funds after state update to prevent reentrancy
        payable(msg.sender).transfer(contributedAmount);
        emit RefundIssued(msg.sender, contributedAmount);

        // Update last refund time
        lastRefundTime = block.timestamp;
    }

    // Function to release funds to the developer if the goal is met
    // Using nonReentrant modifier to prevent reentrancy attacks
    function releaseFunds() public nonReentrant notPaused onlyAdmin {
        require(block.timestamp > deadline, "Campaign deadline has not passed");
        require(goalReached, "Goal not reached, cannot release funds");

        // Updates the state before transferring funds
        uint256 amount = totalContributed;
        totalContributed = 0;

        // Transfer funds after state update to prevent reentrancy
        payable(developer).transfer(amount);
    }

    // Function to pause the contract (only callable by admin)
    function pauseContract() public onlyAdmin {
        paused = true;
        emit ContractPaused(admin);
    }

    // Function to resume the contract (only callable by admin)
    function resumeContract() public onlyAdmin {
        paused = false;
        emit ContractResumed(admin);
    }
}