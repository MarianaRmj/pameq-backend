export class CreateUserDto {
  nombre: string;
  email: string;
  password: string;
  rol: string;
  sedeId?: number;
}
