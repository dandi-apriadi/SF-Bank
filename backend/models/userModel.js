import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import argon2 from "argon2";

const { DataTypes } = Sequelize;


const User = db.define('users', {
    user_id: {
        type: DataTypes.STRING,
        defaultValue: () => uuidv4(),
        primaryKey: true,
        allowNull: false,
        comment: 'Unique identifier for user'
    },
    fullname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [2, 100]
        },
        comment: 'Full name of the user'
    },
    role: {
        type: DataTypes.ENUM('koordinator', 'unit', 'pimpinan'),
        allowNull: false,
        defaultValue: 'koordinator',
        comment: 'User role: koordinator (Study Program Coordinator), unit (PPMPP Unit), pimpinan (Institutional Leadership)'
    },
    gender: {
        type: DataTypes.ENUM('male', 'female'),
        allowNull: true,
        validate: {
            isIn: [['male', 'female']]
        },
        comment: 'Gender of the user'
    },
    email: {
        type: DataTypes.STRING(191),
        allowNull: false,
        validate: {
            isEmail: true
        },
        comment: 'Email address for login and communication'
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        },
        comment: 'Hashed password using Argon2'
    },
    nip: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: 'NIP (Nomor Induk Pegawai) for academic staff identification'
    },
    // nidn removed with dosen role elimination
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
            is: /^[\+]?[0-9\s\-\(\)]+$/
        },
        comment: 'Phone number for contact'
    },
    department: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Department or faculty affiliation'
    },
    study_program: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Study program for coordinators'
    },
    // Foreign key to study_programs table (added to support association)
    study_program_id: {
        type: DataTypes.STRING(36),
        allowNull: true,
        comment: 'FK ke study_programs.study_program_id'
    },
    position: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Academic position or job title'
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
        comment: 'Account active status'
    },
    last_login: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last login timestamp'
    },
    profile_picture: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'URL or path to profile picture'
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        comment: 'Record creation timestamp',
        get() {
            return moment(this.getDataValue('created_at')).format('D MMMM, YYYY, h:mm A');
        }
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        comment: 'Record last update timestamp',
        get() {
            return moment(this.getDataValue('updated_at')).format('D MMMM, YYYY, h:mm A');
        }
    },
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            unique: true,
            fields: ['email']
        },
        {
            unique: true,
            fields: ['nip'],
            where: {
                nip: {
                    [Sequelize.Op.ne]: null
                }
            }
        },
        {
            fields: ['role']
        },
        {
            fields: ['is_active']
        },
        {
            fields: ['study_program_id']
        }
    ],
    hooks: {
        /**
         * Hash password before creating user
         */
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
        /**
         * Hash password before updating user if password changed
         */
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                const hashedPassword = await argon2.hash(user.password, {
                    type: argon2.argon2id,
                    memoryCost: 65536,
                    timeCost: 3,
                    parallelism: 4
                });
                user.password = hashedPassword;
            }
        },
        /**
         * Remove password from response after creation
         */
        afterCreate: (user) => {
            delete user.dataValues.password;
        },
        /**
         * Remove password from response after update
         */
        afterUpdate: (user) => {
            delete user.dataValues.password;
        },
        /**
         * Remove password from response after find operations
         * Note: Only remove password for toJSON, keep it for authentication
         */
        afterFind: (result) => {
            // Don't automatically remove password field - let controllers handle it
            // This allows authentication to work properly
            return result;
        }
    }
});

/**
 * Instance methods for User model
 */
User.prototype.toJSON = function() {
    const values = { ...this.get() };
    delete values.password;
    return values;
};

/**
 * Check if user has specific role
 * @param {string} role - Role to check
 * @returns {boolean}
 */
User.prototype.hasRole = function(role) {
    return this.role === role;
};

/**
 * Check if user is active
 * @returns {boolean}
 */
User.prototype.isActive = function() {
    return this.is_active === true;
};

/**
 * Update last login timestamp
 */
User.prototype.updateLastLogin = async function() {
    this.last_login = new Date();
    await this.save();
};

/**
 * Static methods for User model
 */
User.findByEmail = function(email) {
    return this.findOne({ where: { email } });
};

User.findByNIP = function(nip) {
    return this.findOne({ where: { nip } });
};

User.findActiveUsers = function() {
    return this.findAll({ where: { is_active: true } });
};

User.findByRole = function(role) {
    return this.findAll({ where: { role } });
};

// Export User model
export { User };
