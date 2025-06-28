import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

// Define the ABI for your contract
const ABI = [
  "function contribute() public payable",
  "function claimRefund() public",
  "function releaseFunds() public",
  "function goalAmount() public view returns (uint256)",
  "function totalContributed() public view returns (uint256)",
  "function contributions(address) public view returns (uint256)", // Get user contributions
  "function deadline() public view returns (uint256)",  // Get deadline
  "function goalReached() public view returns (bool)",  // Check if the goal is reached
  "event ContributionReceived(address indexed investor, uint256 amount)",
  "event RefundIssued(address indexed investor, uint256 amount)"
];

@Injectable()
export class InvestmentService {
  private provider: ethers.providers.JsonRpcProvider;
  private contract: ethers.Contract;

  constructor() {
    // Using the Infura project ID from the environment variables
    const infuraUrl = `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`;
    
    // Initialize the provider with the Infura URL from environment variables
    this.provider = new ethers.providers.JsonRpcProvider(infuraUrl);

    // Use the contract address from the environment variables
    const contractAddress = process.env.CONTRACT_ADDRESS;

    // Initialize the contract with ABI and provider
    this.contract = new ethers.Contract(contractAddress, ABI, this.provider);
  }

  // Contribute method
  async contribute(amount: string, userAddress: string) {
    try {
      const signer = await this.provider.getSigner(userAddress);
      const contractWithSigner = this.contract.connect(signer);
      const valueInWei = ethers.utils.parseEther(amount);
      const tx = await contractWithSigner.contribute({ value: valueInWei });
      await tx.wait();
      return tx;
    } catch (error) {
      console.error("Error occurred while contributing:", error);
      throw error;
    }
  }

  // Claim refund method
  async claimRefund(userAddress: string) {
    try {
      const signer = this.provider.getSigner(userAddress);
      const contractWithSigner = this.contract.connect(signer);
      const tx = await contractWithSigner.claimRefund();
      await tx.wait();
      return tx;
    } catch (error) {
      console.error("Error occurred while claiming refund:", error);
      throw error;
    }
  }

  // Release funds method
  async releaseFunds() {
    try {
      const adminAddress = process.env.ADMIN_ADDRESS; // Use the admin address from environment variables
      const signer = await this.provider.getSigner(adminAddress);
      const contractWithSigner = this.contract.connect(signer);
      const tx = await contractWithSigner.releaseFunds();
      await tx.wait();
      return tx;
    } catch (error) {
      console.error("Error occurred while releasing funds:", error);
      throw error;
    }
  }

  // Get the goal amount from the contract
  async getGoalAmount() {
    try {
      const goalAmount = await this.contract.goalAmount();
      return ethers.utils.formatUnits(goalAmount, 'ether');
    } catch (error) {
      console.error("Error occurred while fetching goal amount:", error);
      throw error;
    }
  }

  // Get the total amount contributed to the campaign
  async getTotalContributed() {
    try {
      const total = await this.contract.totalContributed();
      return ethers.utils.formatUnits(total, 'ether');
    } catch (error) {
      console.error("Error occurred while fetching total contributed:", error);
      throw error;
    }
  }

  // Get the contributions of a specific user
  async getUserContribution(userAddress: string) {
    try {
      const contribution = await this.contract.contributions(userAddress);
      return ethers.utils.formatUnits(contribution, 'ether');
    } catch (error) {
      console.error("Error occurred while fetching user contributions:", error);
      throw error;
    }
  }

  // Get campaign status (goal reached or not)
  async getCampaignStatus() {
    try {
      const goalReached = await this.contract.goalReached();
      return goalReached;
    } catch (error) {
      console.error("Error occurred while fetching campaign status:", error);
      throw error;
    }
  }

  // Get the remaining time before the campaign deadline
  async getRemainingTime() {
    try {
      const deadline = await this.contract.deadline();
      const remainingTime = deadline - Math.floor(Date.now() / 1000);  // Convert to seconds
      return remainingTime > 0 ? remainingTime : 0;  // Return 0 if deadline has passed
    } catch (error) {
      console.error("Error occurred while fetching remaining time:", error);
      throw error;
    }
  }
}
