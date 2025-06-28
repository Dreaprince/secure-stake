import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerifyMeServiceModule } from 'src/verify-me-service/verify-me-service.module'; // Import VerifyMeServiceModule
import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    VerifyMeServiceModule, 
  ],
  controllers: [UserController],
  providers: [UserService], 
})
export class UserModule {}


