import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class BaseQualitativaDto {
  @IsInt()
  @Min(1)
  autoevaluacionId: number;
}

export class AddItemDto extends BaseQualitativaDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}

export class UpdateItemDto extends BaseQualitativaDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  index?: number;

  @IsOptional()
  @IsString()
  oldValue?: string;

  @IsString()
  @IsNotEmpty()
  text: string;
}

export class RemoveItemDto extends BaseQualitativaDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  index?: number;

  @IsOptional()
  @IsString()
  value?: string;
}
