import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/entities/user.entity';

type UserSafe = {
  id: number;
  email: string;
  nombre: string;
  rol: string;
  sedeId: number | null;
  institutionId: number | null;
};

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserSafe | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['sede'],
      select: ['id', 'email', 'nombre', 'password', 'rol', 'institutionId'],
    });

    if (!user || !user.password) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    const { id, nombre, rol, sede, institutionId: instId } = user;

    const safeUser: UserSafe = {
      id,
      email,
      nombre,
      rol,
      sedeId: sede?.id ?? null,
      institutionId: instId ?? null,
    };

    return safeUser;
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ token: string; usuario: UserSafe }> {
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      institutionId: user.institutionId,
      rol: user.rol,
    };

    return {
      token: this.jwtService.sign(payload),
      usuario: user,
    };
  }
}
