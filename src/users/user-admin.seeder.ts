import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import * as bcrypt from 'bcryptjs'; // Usar bcryptjs, que ya tienes instalado

@Injectable()
export class UserAdminSeeder {
  constructor(private readonly userService: UserService) {}

  async run() {
    const email = 'pameq2025@gmail.com';

    // Cambia esto si tu método es 'findByEmail', 'getByEmail', etc.
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      console.log('El usuario administrador ya existe.');
      return;
    }

    const hashedPassword = await bcrypt.hash('Admin_123', 10);

    await this.userService.createUser({
      nombre: 'Usuario Administrador',
      email,
      password: hashedPassword,
      rol: 'admin',
      sede_id: 1,
    });

    console.log('✅ Usuario administrador creado correctamente.');
  }
}
