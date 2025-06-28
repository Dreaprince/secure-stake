import { Controller, Post, Body, Get } from '@nestjs/common';
import { InvestmentService } from './investment.service';

@Controller('investment')
export class InvestmentController {
  constructor(private readonly investmentService: InvestmentService) { }


  @Post('contribute')
  async contribute(@Body() body: { amount: string; userAddress: string }) {
    try {
      return await this.investmentService.contribute(body.amount, body.userAddress);
    } catch (error) {
      throw error;
    }
  }

  @Post('claim-refund')
  async claimRefund(@Body() body: { userAddress: string }) {
    try {
      return await this.investmentService.claimRefund(body.userAddress);
    } catch (error) {
      throw error;
    }
  }

  @Post('release-funds')
  async releaseFunds() {
    try {
      return await this.investmentService.releaseFunds();
    } catch (error) {
      throw error;
    } 
  }

  @Get('goal')
  async getGoalAmount() {
    try {
      return await this.investmentService.getGoalAmount();
    } catch (error) {
      throw error;
    }
  }

  @Get('contributed')
  async getTotalContributed() {
    try {
      return await this.investmentService.getTotalContributed();
    } catch (error) {
      throw error;
    }
  }


  @Get('user-contribution')
  async getUserContribution(@Body() body: { userAddress: string }) {
    try {
      return await this.investmentService.getUserContribution(body.userAddress);
    } catch (error) {
      throw error;
    }
  }

  
  @Get('campaign-status')
  async getCampaignStatus() {
    try {
      return await this.investmentService.getCampaignStatus();
    } catch (error) {
      throw error;
    }
  }

  @Get('remaining-time')
  async getRemainingTime() {
    try {
      return await this.investmentService.getRemainingTime();
    } catch (error) {
      throw error;
    }
  }
}
