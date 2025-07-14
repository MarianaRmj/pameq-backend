import { config as dotenvconfig } from 'dotenv';
import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvconfig({ path: `.env.${process.env.NODE_ENV || 'development'}` });
dotenvconfig(); // fallback para .env por si acaso

const isDev = process.env.NODE_ENV === 'development';

const config: DataSourceOptions = process.env.DATABASE_URL
  ? {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: isDev, // Solo true en dev
      entities: [isDev ? 'src/**/*.entity.ts' : 'dist/**/*.entity.js'],
      migrations: [
        isDev ? 'src/migrations/*{.ts,.js}' : 'dist/migrations/*{.ts,.js}',
      ],
      dropSchema: isDev, // Solo true en dev
    }
  : {
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: +process.env.DB_PORT! || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      entities: [isDev ? 'src/**/*.entity.ts' : 'dist/**/*.entity.js'],
      migrations: [
        isDev ? 'src/migrations/*{.ts,.js}' : 'dist/migrations/*{.ts,.js}',
      ],
      dropSchema: isDev,
    };

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config);
