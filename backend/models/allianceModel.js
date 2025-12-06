import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Alliance = db.define('alliances', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [2, 100]
        },
        comment: 'Alliance name'
    },
    tag: {
        type: DataTypes.STRING(10),
        allowNull: true,
        comment: 'Alliance tag/abbreviation'
    },
    leader: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Alliance leader name'
    },
    members_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Total members in alliance'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Alliance description'
    },
    bank_id: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Bank identifier for alliance'
    },
    bank_name: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Bank name for alliance'
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
            unique: true,
            fields: ['name']
        },
        {
            unique: true,
            fields: ['bank_id']
        }
    ]
});

const AllianceResource = db.define('alliance_resources', {
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
    food: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
        comment: 'Food resources'
    },
    wood: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
        comment: 'Wood resources'
    },
    stone: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
        comment: 'Stone resources'
    },
    gold: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
        comment: 'Gold resources'
    },
    total_rss: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
        comment: 'Total resources (sum of all resources)'
    },
    weeks_donated: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of weeks donations recorded'
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
        }
    ]
});

// Define associations
Alliance.hasOne(AllianceResource, {
    foreignKey: 'alliance_id',
    as: 'resources',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

AllianceResource.belongsTo(Alliance, {
    foreignKey: 'alliance_id',
    as: 'alliance'
});

export { Alliance, AllianceResource };
