import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import argon2 from "argon2";

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
        unique: true,
        comment: 'Unique user identifier (game ID or custom ID)'
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [2, 100]
        },
        comment: 'User name'
    },
    email: {
        type: DataTypes.STRING(191),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        },
        comment: 'Email address for login'
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Hashed password using Argon2'
    },
    role: {
        type: DataTypes.ENUM('Admin', 'R1', 'R2', 'R3', 'R4', 'R5'),
        allowNull: false,
        defaultValue: 'R5',
        comment: 'User role in alliance hierarchy'
    },
    alliance_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'alliances',
            key: 'id'
        },
        comment: 'Foreign key to alliances table'
    },
    status: {
        type: DataTypes.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active',
        comment: 'User account status'
    },
    joined_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: 'Date when user joined alliance'
    },
    last_login: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last login timestamp'
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
            fields: ['role']
        },
        {
            fields: ['alliance_id']
        },
        {
            fields: ['status']
        }
    ],
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                const hashedPassword = await argon2.hash(user.password, {
                    type: argon2.argon2id,
                    memoryCost: 65536,
                    timeCost: 3,
                    parallelism: 4
                });
                user.password = hashedPassword;
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password') && user.password) {
                const hashedPassword = await argon2.hash(user.password, {
                    type: argon2.argon2id,
                    memoryCost: 65536,
                    timeCost: 3,
                    parallelism: 4
                });
                user.password = hashedPassword;
            }
        },
        afterCreate: (user) => {
            delete user.dataValues.password;
        },
        afterUpdate: (user) => {
            delete user.dataValues.password;
        }
    }
});

// Instance methods
User.prototype.toJSON = function() {
    const values = { ...this.get() };
    delete values.password;
    return values;
};

User.prototype.hasRole = function(role) {
    return this.role === role;
};

User.prototype.isActive = function() {
    return this.status === 'Active';
};

User.prototype.updateLastLogin = async function() {
    this.last_login = new Date();
    await this.save();
};

// Static methods
User.findByEmail = function(email) {
    return this.findOne({ where: { email } });
};

User.findByUserId = function(user_id) {
    return this.findOne({ where: { user_id } });
};

User.findActiveUsers = function() {
    return this.findAll({ where: { status: 'Active' } });
};

User.findByRole = function(role) {
    return this.findAll({ where: { role } });
};

User.findByAlliance = function(alliance_id) {
    return this.findAll({ where: { alliance_id } });
};

export default User;
