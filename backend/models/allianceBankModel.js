import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const AllianceBank = db.define('alliance_bank', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    alliance_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'alliances',
            key: 'id'
        },
        comment: 'Foreign key to alliances table'
    },
    bank_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: 'Unique bank identifier'
    },
    bank_name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Bank name'
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
    updatedAt: 'updated_at',
    indexes: [
        {
            fields: ['alliance_id']
        },
        {
            unique: true,
            fields: ['bank_id']
        }
    ]
});

export default AllianceBank;
