import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGlobal } from './middleware/logger.middleware';
import { UserAdminSeeder } from './users/user-admin.seeder'; // Ajusta el path

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Ejecutar Seeder antes de levantar la app
  const seeder = app.get(UserAdminSeeder);
  await seeder.run();

  app.use(loggerGlobal);
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  });
  await app.listen(process.env.PORT || 3001);
}
bootstrap();
