import { Sequelize } from "sequelize";
import { config } from 'dotenv';

config({ path: '.env' });

// Determinar el entorno actual (puede ser a través de una variable de entorno NODE_ENV)
const env = process.env.NODE_ENV || 'desarrollo';

// Cargar las variables de entorno según el entorno actual
if (env === 'desarrollo') {
    config({ path: '.env.desarrollo' });
} else if (env === 'produccion') {
    config({ path: '.env.produccion' });
}

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