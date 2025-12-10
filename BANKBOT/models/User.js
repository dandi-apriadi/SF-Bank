import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const User = db.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
    },
    role: {
        type: DataTypes.ENUM('Admin', 'R4', 'R5', 'Member', 'Guest'),
        allowNull: false,
        defaultValue: 'Member'
    },
    alliance_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'alliances',
            key: 'id'
        }
    },
    status: {
        type: DataTypes.ENUM('Active', 'Inactive', 'Suspended'),
        allowNull: false,
        defaultValue: 'Active'
    },
    joined_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    last_login: {
        type: DataTypes.DATE,
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

export default User;
