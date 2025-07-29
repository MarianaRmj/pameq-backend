// src/users/user.mapper.ts
import { User } from './entities/user.entity';
import { UserResponseDto } from './dto/user-response.dto';

export function toUserResponseDto(user: User): UserResponseDto {
  return {
    id: user.id,
    nombre: user.nombre,
    email: user.email,
    rol: user.rol,
    sedeId: user.sede?.id ?? null,
    nombre_sede: user.sede?.nombre_sede ?? null, // ✅ AQUÍ estaba el error
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
}
