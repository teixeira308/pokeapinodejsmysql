import env from '../config/config.js';
import { Sequelize } from 'sequelize';

const database = new Sequelize(
    env.DATABASE_NAME,
    env.DATABASE_USER,
    env.DATABASE_PASS,
    {
        host: env.DATABASE_HOST,
        dialect: 'mysql',
        logging: false,
    }
);

export default database;
