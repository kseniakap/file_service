import dotenv from 'dotenv';
import { Client, DatabaseError } from 'pg';

dotenv.config();

async function createDatabase() {
  const {
    DB_USERNAME,
    DB_PASSWORD,
    DB_DATABASE,
    DB_HOST,
    DB_PORT,
    DB_DIALECT,
  } = process.env;

  const client = new Client({
    user: DB_USERNAME,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: Number(DB_PORT),
    database: DB_DIALECT,
  });

  await client.connect();

  await client
    .query(`CREATE DATABASE "${DB_DATABASE}";`)
    .then(() => {
      console.info(`База данных "${DB_DATABASE}" успешно создана`);
    })
    .catch((err: DatabaseError) => {
      // @NOTE: 42P04 - ошибка дублирования БД. Наиболее вероятная ошибка при создании БД, из-за чего расписана более явно
      // https://www.postgresql.org/docs/8.2/errcodes-appendix.html
      if (err.code === '42P04') {
        throw new Error(
          `База данных с таким названием: ${DB_DATABASE}, уже существует. Поменяйте название в переменных окружения.`,
        );
      }
      throw err;
    });
  await client.end();
}

createDatabase();
