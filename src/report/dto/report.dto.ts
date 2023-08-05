import { Expose, Transform } from 'class-transformer';

export class ReportDto {
  @Expose()
  model: string;

  @Expose()
  make: string;

  @Expose()
  lat: number;

  @Expose()
  lng: number;

  @Expose()
  price: number;

  @Expose()
  year: number;

  @Expose()
  userId: number;

  @Expose()
  id: number;

  @Expose()
  approve: boolean;
}
