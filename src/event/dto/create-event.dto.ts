export class CreateEventDto {
  titulo: string;
  descripcion?: string;
  inicio: Date | string;
  fin: Date | string;
  tipo?: string; // 'manual' | 'actividad' | 'reunion' | 'ciclo'
  userId: number;
  cicloId?: number;
}
