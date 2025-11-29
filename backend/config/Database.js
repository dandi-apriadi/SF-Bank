import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
dotenv.config();

// Control Sequelize SQL logging verbosity via env (default: off)
const loggingOption = process.env.SEQUELIZE_LOGGING === 'true' ? console.log : false;
const benchmarkOption = process.env.SEQUELIZE_BENCHMARK === 'true';

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: loggingOption,
    benchmark: benchmarkOption,
    pool: {
        max: parseInt(process.env.DB_POOL_MAX || '5', 10),
        min: parseInt(process.env.DB_POOL_MIN || '0', 10),
        acquire: parseInt(process.env.DB_POOL_ACQUIRE || '30000', 10),
        idle: parseInt(process.env.DB_POOL_IDLE || '10000', 10)
    }
});

export default db;