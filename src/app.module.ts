import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { config as dotenvConfig } from 'dotenv';
import cors from 'cors';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { InvestmentModule } from './investment/investment.module'
import { VerifyMeServiceModule } from './verify-me-service/verify-me-service.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';


dotenvConfig();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User],
      synchronize: true
    }),
    UserModule,
    InvestmentModule,
    VerifyMeServiceModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cors())
      .forRoutes('*');
  }
}



