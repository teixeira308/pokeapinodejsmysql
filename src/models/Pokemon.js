import { DataTypes } from 'sequelize';
import database from '../infra/database.js';

const Pokemon = database.define('pokemon', {
    nationalId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    firstAttribute: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    secondAttribute: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    megaEvolution: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

await Pokemon.sync();

export default Pokemon;
