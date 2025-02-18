import mysql from "mysql2/promise";
import {
  DB_NAME,
  DB_PORT,
  DB_PASSWORD,
  DB_USER,
  DB_HOST
} from './config.js'

const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER, 
  password: DB_PASSWORD, 
  database: DB_NAME, 
  port: DB_PORT, 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
