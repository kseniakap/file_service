import dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenv.config();

const DATABASE_CONFIG: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  migrations: [__dirname + '/../db/migrations/*.{ts,js}'],
  synchronize: false,
};

export const dataSource = new DataSource(DATABASE_CONFIG);
