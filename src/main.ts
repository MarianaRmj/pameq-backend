import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGlobal } from './middleware/logger.middleware';
import { UserAdminSeeder } from './users/seeders/user-admin.seeder';
import { InstitutionSedeSeeder } from './users/seeders/institution-sede.seeder';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  app.use(loggerGlobal);

  await app.init();
  const institutionSeeder = app.get(InstitutionSedeSeeder);
  await institutionSeeder.run();

  const seeder = app.get(UserAdminSeeder);
  await seeder.run();

  await app.listen(process.env.PORT || 3001);
}
bootstrap();
