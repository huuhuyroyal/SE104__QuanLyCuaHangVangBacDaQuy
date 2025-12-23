import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const SQL_FILE = path.resolve(process.cwd(), 'src', 'sql', 'data.sql');

const run = async () => {
  try {
    const sql = fs.readFileSync(SQL_FILE, 'utf8');
    const host = process.env.MYSQL_HOST || '127.0.0.1';
    const user = process.env.MYSQL_USER || 'root';
    const password = process.env.MYSQL_PASSWORD || '';

    console.log(`Connecting to MySQL ${host} as ${user} ...`);
    const conn = await mysql.createConnection({ host, user, password, multipleStatements: true });

    console.log('Running SQL script... (this may take a while)');
    await conn.query(sql);
    console.log('Database initialization completed.');
    await conn.end();
  } catch (error) {
    console.error('Failed to initialize DB:', error.message);
    process.exit(1);
  }
};

run();
