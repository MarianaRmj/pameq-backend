// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'], // Pon aquí el puerto de tu Next.js (por defecto 3000)
    credentials: true,
  });
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
