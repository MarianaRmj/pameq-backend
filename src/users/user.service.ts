import { Injectable, NotFoundException } from '@nestjs/common';
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

  async createUser(dto: CreateUserDto): Promise<User> {
    let sede: Sede | null = null;

    if (dto.sedeId) {
      sede = await this.sedesRepository.findOne({ where: { id: dto.sedeId } });
      if (!sede) {
        throw new NotFoundException(`Sede con ID ${dto.sedeId} no encontrada`);
      }
    }

    const nuevoUsuario = this.usersRepository.create({
      nombre: dto.nombre,
      email: dto.email,
      password: dto.password,
      rol: dto.rol,
      ...(sede && { sede }), // solo agrega sede si existe
    });

    await this.usersRepository.save(nuevoUsuario);

    const savedUser = await this.usersRepository.findOne({
      where: { id: nuevoUsuario.id },
      relations: ['sede'],
    });

    if (!savedUser) {
      throw new NotFoundException(
        `Usuario con ID ${nuevoUsuario.id} no encontrado`,
      );
    }

    return savedUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['sede'],
    });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({ relations: ['sede'] });
  }

  async findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id }, relations: ['sede'] });
  }

  async updateUser(id: number, dto: UpdateUserDto): Promise<User> {
    const usuario = await this.usersRepository.findOne({
      where: { id },
      relations: ['sede'],
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    if (dto.sedeId) {
      const sede = await this.sedesRepository.findOne({
        where: { id: dto.sedeId },
      });

      if (!sede) {
        throw new NotFoundException(`Sede con ID ${dto.sedeId} no encontrada`);
      }

      usuario.sede = sede;
    }

    if (dto.nombre !== undefined) usuario.nombre = dto.nombre;
    if (dto.email !== undefined) usuario.email = dto.email;
    if (dto.rol !== undefined) usuario.rol = dto.rol;
    if (dto.password !== undefined) usuario.password = dto.password;

    return this.usersRepository.save(usuario);
  }

  async remove(id: number): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user)
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    await this.usersRepository.remove(user);
  }
}
