// SF BANK Models Index - All models with associations
import User from './userModelNew.js';
import { Alliance, AllianceResource } from './allianceModel.js';
import AllianceBank from './allianceBankModel.js';
import MemberContribution from './memberContributionModel.js';
import AuditLog from './auditLogModel.js';

// ==========================================
// Define all associations between models
// ==========================================

// User <-> Alliance (Many-to-One)
User.belongsTo(Alliance, {
    foreignKey: 'alliance_id',
    as: 'alliance',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
});

Alliance.hasMany(User, {
    foreignKey: 'alliance_id',
    as: 'members',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
});

// Alliance <-> AllianceBank (One-to-One)
Alliance.hasOne(AllianceBank, {
    foreignKey: 'alliance_id',
    as: 'bank',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

AllianceBank.belongsTo(Alliance, {
    foreignKey: 'alliance_id',
    as: 'alliance'
});

// MemberContribution <-> User (Many-to-One)
MemberContribution.belongsTo(User, {
    foreignKey: 'member_id',
    as: 'member',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

User.hasMany(MemberContribution, {
    foreignKey: 'member_id',
    as: 'contributions',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

// MemberContribution <-> Alliance (Many-to-One)
MemberContribution.belongsTo(Alliance, {
    foreignKey: 'alliance_id',
    as: 'alliance',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Alliance.hasMany(MemberContribution, {
    foreignKey: 'alliance_id',
    as: 'contributions',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

// AuditLog <-> User (Many-to-One)
AuditLog.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
});

User.hasMany(AuditLog, {
    foreignKey: 'user_id',
    as: 'audit_logs',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
});

// Export all models
export {
    User,
    Alliance,
    AllianceResource,
    AllianceBank,
    MemberContribution,
    AuditLog
};
