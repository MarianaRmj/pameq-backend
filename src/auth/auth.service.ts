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
  sede_id: number | null;
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
      select: ['id', 'email', 'nombre', 'password', 'rol', 'sede_id'],
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result as UserSafe;
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
