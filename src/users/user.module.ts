import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Sede } from 'src/sedes/entities/sede.entity';
import { Institution } from 'src/institutions/entities/institution.entity';
// (Opcional) seeders si los usas
import { UserAdminSeeder } from '../seeds/user-admin.seeder';
import { InstitutionSedeSeeder } from '../seeds/institution-sede.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([User, Sede, Institution])],
  controllers: [UsersController],
  providers: [UserService, UserAdminSeeder, InstitutionSedeSeeder],
  exports: [UserService],
})
export class UserModule {}
