import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UsersController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserAdminSeeder } from './user-admin.seeder';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // ¡ESTO ES CLAVE!
  ],
  controllers: [UsersController],
  providers: [UserService, UserAdminSeeder],
})
export class UserModule {}
