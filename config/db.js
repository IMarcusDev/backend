import mysql from "mysql2/promise";

// Configuración de la conexión a la base de datos en InfinityFree
const pool = mysql.createPool({
  host: "sql312.infinityfree.com", // Host de InfinityFree
  user: "if0_38347125", // Usuario de la base de datos
  password: "LVsN1qbiqWM", // Contraseña (⚠️ Mejor usar variables de entorno en producción)
  database: "if0_38347125_consultorio_db", // Nombre correcto de la base de datos
  port: 3306, // Puerto de MySQL en InfinityFree
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
