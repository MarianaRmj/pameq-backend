import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Institution } from 'src/institutions/entities/institution.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserAdminSeeder {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Institution)
    private readonly institutionRepo: Repository<Institution>,
  ) {}

  async run() {
    // Paso 1: Buscar institución ya creada
    const institution = await this.institutionRepo.findOne({
      where: { nit: '900123456-7' }, // El mismo NIT usado en el otro seeder
    });

    if (!institution) {
      console.error(
        '❌ Institución no encontrada. Asegúrate de ejecutar el seeder de instituciones primero.',
      );
      return;
    }

    // Paso 2: Verificar si ya existe un usuario admin con ese correo
    const existing = await this.userRepo.findOne({
      where: { email: 'pameq2025@gmail.com' },
    });

    if (existing) {
      console.log('⚠️  El usuario administrador ya existe.');
      return;
    }

    // Paso 3: Crear usuario admin
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const adminUser = this.userRepo.create({
      nombre: 'Usuario Administrador',
      email: 'pameq2025@gmail.com',
      password: hashedPassword,
      rol: 'admin',
      institutionId: institution.id,
    });

    await this.userRepo.save(adminUser);

    console.log(`✅ Usuario administrador creado con ID: ${adminUser.id}`);
  }
}
