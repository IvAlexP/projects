import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { ConfigService } from '@nestjs/config/dist/config.service';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const backendPort = configService.get<number>('BACKEND_PORT') || 3000;
  const frontendPort = configService.get<number>('VITE_PORT') || 5173;
  const baseUrl = configService.get<string>('BASE_URL') || 'http://localhost';
  const frontendUrl = `${baseUrl}:${frontendPort}`;

  app.use(cookieParser());

  app.enableCors({
    // later: origin: [frontendUrl, 'file://', 'app://.'],
    origin: frontendUrl,
    methods: 'GET,POST,PUT,DELETE,PATCH',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    stopAtFirstError: true // only returns the first failed validation message
  }));

  await app.listen(backendPort, '0.0.0.0'); // listen to all network interfaces
}

bootstrap();
