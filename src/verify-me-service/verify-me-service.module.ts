import { Module } from '@nestjs/common';
import { VerifyMeService } from './verify-me-service.service';
import { HttpModule } from '@nestjs/axios';


@Module({
  imports: [HttpModule], 
  providers: [VerifyMeService],
  exports: [VerifyMeService], 
})
export class VerifyMeServiceModule {}

