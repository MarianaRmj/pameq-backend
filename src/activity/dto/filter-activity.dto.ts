import { IsOptional, IsInt, IsISO8601, IsIn } from 'class-validator';

export class FilterActivityDto {
  @IsOptional() @IsInt() institutionId?: number;
  @IsOptional() @IsInt() sedeId?: number;
  @IsOptional() @IsInt() cicloId?: number;
  @IsOptional()
  @IsIn(['programada', 'en_proceso', 'finalizada', 'cancelada'])
  estado?: 'programada' | 'en_proceso' | 'finalizada' | 'cancelada';
  @IsOptional() @IsISO8601() from?: string;
  @IsOptional() @IsISO8601() to?: string;
}
