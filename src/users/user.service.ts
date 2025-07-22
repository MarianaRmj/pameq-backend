import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Sede } from 'src/sedes/entities/sede.entity';

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

    return await this.usersRepository.save(nuevoUsuario);
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
}
