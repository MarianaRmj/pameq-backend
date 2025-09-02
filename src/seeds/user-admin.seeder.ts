import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Sede } from 'src/sedes/entities/sede.entity';

@Injectable()
export class UserAdminSeeder {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Sede)
    private readonly sedeRepository: Repository<Sede>,
  ) {}

  async run(): Promise<void> {
    const exists = await this.userRepository.findOne({
      where: { email: 'pameq2025@gmail.com' },
    });

    if (exists) return;

    // 👇 Buscar una sede (puede ser la primera, o por nombre específico)
    const sede = (await this.sedeRepository.find())[0]; // ✅ trae primera sede

    if (!sede) {
      throw new Error(
        '❌ No hay sedes registradas. Debes crear al menos una antes de insertar el usuario admin.',
      );
    }

    const hashedPassword = await bcrypt.hash('admin1234', 10);

    const admin = this.userRepository.create({
      nombre: 'Usuario Administrador',
      email: 'pameq2025@gmail.com',
      password: hashedPassword,
      rol: 'admin',
      sedeId: sede.id,
      institutionId: 1, // ✅ asegúrate que exista
    });

    await this.userRepository.save(admin);
    console.log('✅ Usuario administrador creado con sede:', sede.nombre_sede);
  }
}
