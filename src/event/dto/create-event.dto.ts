export class CreateEventDto {
  title: string;
  description?: string;
  start: Date;
  end: Date;
  type?: string;
  userId: number;
  cicloId?: number;
}
