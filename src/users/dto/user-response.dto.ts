export class UserResponseDto {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  sede_id: number | null;
  created_at: Date;
  updated_at: Date;
}
