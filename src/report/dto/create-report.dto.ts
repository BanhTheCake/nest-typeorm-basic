import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';
import {} from 'class-transformer';

export class CreateReportDto {
  @IsString()
  model: string;

  @IsString()
  make: string;

  @IsLatitude()
  lat: number;

  @IsLongitude()
  lng: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(1990)
  @Max(new Date().getFullYear())
  year: number;
}
