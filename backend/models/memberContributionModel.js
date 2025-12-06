import { Sequelize } from "sequelize";
import db from "../config/Database.js";

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
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        comment: 'Foreign key to users table'
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
    week: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Week number of the year'
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: 'Date of contribution'
    },
    food: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
        comment: 'Food contribution'
    },
    wood: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
        comment: 'Wood contribution'
    },
    stone: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
        comment: 'Stone contribution'
    },
    gold: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
        comment: 'Gold contribution'
    },
    total_rss: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
        comment: 'Total resources contributed (sum of all resources)'
    },
    last_contribution: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last contribution timestamp'
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
            fields: ['member_id']
        },
        {
            fields: ['alliance_id']
        },
        {
            unique: true,
            fields: ['member_id', 'alliance_id', 'week']
        }
    ]
});

export default MemberContribution;
