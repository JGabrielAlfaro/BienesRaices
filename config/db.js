import { Sequelize } from "sequelize";
import { config } from 'dotenv';

config({ path: '.env' });

const db = new Sequelize(process.env.DB_NOMBRE, process.env.DB_USER, process.env.DB_PASS ?? '', {
    host:  process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql', 
    define: {
        timestamps: true
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    // operatorsAliases: false
});

// Verificar la conexión a la base de datos
try {
    await db.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
} catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
}

export default db;