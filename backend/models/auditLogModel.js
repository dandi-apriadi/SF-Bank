import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const AuditLog = db.define('audit_logs', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        },
        comment: 'User who performed the action'
    },
    action: {
        type: DataTypes.ENUM('CREATE', 'UPDATE', 'DELETE'),
        allowNull: false,
        comment: 'Type of action performed'
    },
    target_type: {
        type: DataTypes.ENUM('user', 'alliance', 'bank', 'resource'),
        allowNull: false,
        comment: 'Type of target entity'
    },
    target_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'ID of the target entity'
    },
    details: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
        comment: 'Detailed information about the change (JSON format recommended)'
    },
    ip_address: {
        type: DataTypes.STRING(45),
        allowNull: true,
        comment: 'IP address of the user (IPv4 or IPv6)'
    },
    user_agent: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'Browser/client information'
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        comment: 'When the action occurred'
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
            fields: ['user_id']
        },
        {
            fields: ['target_type', 'target_id']
        }
    ]
});

export default AuditLog;
