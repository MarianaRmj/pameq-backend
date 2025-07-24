import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGlobal } from './middleware/logger.middleware';
import { SeedModule } from './seeders/seed.module';
import { UserAdminSeeder } from './seeders/user-admin.seeder';
import { InstitutionSedeSeeder } from './seeders/institution-sede.seeder';
import { CycleSeeder } from './seeders/ciclo.seeder';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  app.use(loggerGlobal);
  await app.init();

  const seedModule = app.select(SeedModule);

  const institutionSeeder = seedModule.get(InstitutionSedeSeeder);
  await institutionSeeder.run(); // ✅ Primero instituciones y sedes

  const cycleSeeder = seedModule.get(CycleSeeder);
  await cycleSeeder.run(); // ✅ Luego ciclos con sedes existentes

  const userSeeder = seedModule.get(UserAdminSeeder);
  await userSeeder.run(); // ✅ Luego usuario

  await app.listen(process.env.PORT || 3001);
}
bootstrap();
