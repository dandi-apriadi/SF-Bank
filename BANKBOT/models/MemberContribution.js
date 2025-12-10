import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const MemberContribution = db.define('member_contributions', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    member_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    alliance_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    week: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    food: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
    },
    wood: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
    },
    stone: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
    },
    gold: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
    },
    total_rss: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
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

export default MemberContribution;
