export class UserResponseDto {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  sedeId: number | null;
  sedeNombre?: string;
  created_at: Date;
  updated_at: Date;
}
