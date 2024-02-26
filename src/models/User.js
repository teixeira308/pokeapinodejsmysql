import { DataTypes } from 'sequelize';
import database from '../infra/database.js';

const User = database.define('user', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    profileImage: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    profileImage: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

await User.sync();

export default User;
