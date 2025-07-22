import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UsersController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserAdminSeeder } from './seeders/user-admin.seeder';
import { Sede } from 'src/sedes/entities/sede.entity';
import { Institution } from 'src/institutions/entities/institution.entity';
import { InstitutionSedeSeeder } from './seeders/institution-sede.seeder';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Sede, Institution]), // ¡ESTO ES CLAVE!
  ],
  controllers: [UsersController],
  providers: [UserService, UserAdminSeeder, InstitutionSedeSeeder],
})
export class UserModule {}
