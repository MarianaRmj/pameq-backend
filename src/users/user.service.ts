import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Sede } from 'src/sedes/entities/sede.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Sede)
    private readonly sedesRepository: Repository<Sede>,
  ) {}

  private ensureInstitutionId(institutionId?: number) {
    if (institutionId == null || Number.isNaN(Number(institutionId))) {
      throw new BadRequestException(
        'Falta el encabezado x-institution-id (número válido) para operar.',
      );
    }
    return Number(institutionId);
  }

  async createUser(
    dto: CreateUserDto,
    institutionIdHeader?: number,
  ): Promise<User> {
    const institutionId = this.ensureInstitutionId(institutionIdHeader);

    // Validar sede obligatoria
    const sede = await this.sedesRepository.findOne({
      where: { id: dto.sedeId },
    });
    if (!sede) {
      throw new NotFoundException(`Sede con ID ${dto.sedeId} no encontrada`);
    }

    const nuevoUsuario = this.usersRepository.create({
      nombre: dto.nombre,
      email: dto.email,
      password: dto.password,
      rol: dto.rol,
      institutionId, // del header
      sedeId: dto.sedeId,
      sede,
    });

    await this.usersRepository.save(nuevoUsuario);

    return this.usersRepository.findOne({
      where: { id: nuevoUsuario.id, institutionId },
      relations: ['sede'],
    }) as Promise<User>;
  }

  async findAllByInstitution(
    institutionIdHeader?: number,
    page = 1,
    limit = 10,
  ) {
    const institutionId = this.ensureInstitutionId(institutionIdHeader);

    const [users, total] = await this.usersRepository.findAndCount({
      where: { institutionId },
      relations: ['sede'],
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'DESC' },
    });

    return {
      users,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOneInInstitution(
    id: number,
    institutionIdHeader?: number,
  ): Promise<User | null> {
    const institutionId = this.ensureInstitutionId(institutionIdHeader);

    return this.usersRepository.findOne({
      where: { id, institutionId },
      relations: ['sede'],
    });
  }

  async updateUserInInstitution(
    id: number,
    dto: UpdateUserDto,
    institutionIdHeader?: number,
  ): Promise<User> {
    const institutionId = this.ensureInstitutionId(institutionIdHeader);

    const usuario = await this.usersRepository.findOne({
      where: { id, institutionId },
      relations: ['sede'],
    });
    if (!usuario)
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);

    if (dto.sedeId !== undefined) {
      const sede = await this.sedesRepository.findOne({
        where: { id: dto.sedeId },
      });
      if (!sede)
        throw new NotFoundException(`Sede con ID ${dto.sedeId} no encontrada`);
      usuario.sede = sede;
      usuario.sedeId = sede.id;
    }

    if (dto.nombre !== undefined) usuario.nombre = dto.nombre;
    if (dto.email !== undefined) usuario.email = dto.email;
    if (dto.rol !== undefined) usuario.rol = dto.rol;
    if (dto.password !== undefined) usuario.password = dto.password;

    await this.usersRepository.save(usuario);

    return this.findOneInInstitution(id, institutionId) as Promise<User>;
  }

  async removeInInstitution(
    id: number,
    institutionIdHeader?: number,
  ): Promise<void> {
    const institutionId = this.ensureInstitutionId(institutionIdHeader);
    const user = await this.usersRepository.findOne({
      where: { id, institutionId },
    });
    if (!user)
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    await this.usersRepository.remove(user);
  }
}
