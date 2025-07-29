export class UserResponseDto {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  sedeId: number | null;
  nombre_sede?: string | null;
  created_at: Date;
  updated_at: Date;
}
