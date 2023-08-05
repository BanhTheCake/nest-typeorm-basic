import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config({
  path: '.env.development',
});

const configService = new ConfigService();

export default new DataSource({
  type: 'sqlite',
  database: configService.getOrThrow('DB_NAME'),
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['migrations/*.ts'],
});
