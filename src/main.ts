import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import rateLimit from 'express-rate-limit';
import * as bodyParser from 'body-parser';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(rateLimit({ // Apply rate limiting
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  }));

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    disableErrorMessages: process.env.NODE_ENV === 'production',
  }));
  //app.setGlobalPrefix('mm-request-api/v1');
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.useStaticAssets(join(__dirname, '..', 'views/public'));


  app.setViewEngine('ejs');



  // Increase body size limit
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // app.use(multer().any());

  const config = new DocumentBuilder()
    .setTitle('Secure Stake API Documentation')
    .setDescription('Secure Stake')
    .setVersion('1.0')
    .addTag('api')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'token',  
        in: 'header',
        description: 'Enter your API token',
      },
      'auth-token', 
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/stake-api-docs', app, document);

  await app.listen(process.env.PORT || 3280);
  console.log('HTTP server is running.');
}

bootstrap();



