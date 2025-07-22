import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

type UserSafe = {
  id: number;
  email: string;
  nombre: string;
  rol: string;
  sede: number | null;
  // Puedes agregar más campos si los tienes en la entidad y quieres exponerlos
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
      select: ['id', 'email', 'nombre', 'password', 'rol'],
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...rest } = user;

      const safeUser: UserSafe = {
        id: rest.id,
        email: rest.email,
        nombre: rest.nombre,
        rol: rest.rol,
        sede: rest.sede?.id ?? null,
      };

      return safeUser;
    }

    return null;
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ token: string; usuario: UserSafe }> {
    const user = await this.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');
    const payload = { sub: user.id, email: user.email, rol: user.rol };
    return {
      token: this.jwtService.sign(payload),
      usuario: user,
    };
  }
}
