// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config;
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(morgan('combined'));

  const config = new DocumentBuilder()
    .setTitle('Gibchain bot API')
    .setDescription('The Gibchain bot API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);
  console.log(`------SERVER STARTED ON PORT ${process.env.PORT}------`);
  await app.listen(process.env.PORT);
}
bootstrap();
