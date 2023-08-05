import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class FilterReportDto {
  @IsString()
  @IsOptional()
  model: string;

  @IsString()
  @IsOptional()
  make: string;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsLatitude()
  lat: number;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsLongitude()
  lng: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  year: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  price: number;
}
