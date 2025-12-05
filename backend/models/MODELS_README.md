# SF BANK Models Documentation

## Overview
File ini menjelaskan struktur semua models yang telah dibuat untuk database SF BANK berdasarkan `database.txt`.

## Models Created

### 1. User Model (`userModelNew.js`)
**Table:** `users`

**Fields:**
- `id` (PK, INT, AUTO_INCREMENT)
- `user_id` (VARCHAR, UNIQUE) - Unique identifier for game/app
- `name` (VARCHAR) - User's name
- `email` (VARCHAR, UNIQUE) - Email for login
- `password` (VARCHAR) - Hashed password with Argon2
- `role` (ENUM: 'Admin','R1','R2','R3','R4','R5') - User role hierarchy
- `alliance_id` (FK to alliances.id) - Alliance membership
- `status` (ENUM: 'Active','Inactive') - Account status
- `joined_date` (DATE) - When user joined alliance
- `last_login` (DATETIME) - Last login timestamp
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Relationships:**
- `belongsTo` Alliance (alliance_id → alliances.id)
- `hasMany` MemberContribution (contributions)
- `hasMany` AuditLog (audit_logs)

**Methods:**
- `toJSON()` - Remove password from response
- `hasRole(role)` - Check if user has specific role
- `isActive()` - Check if user status is Active
- `updateLastLogin()` - Update last_login timestamp
- `findByEmail(email)` - Static: Find user by email
- `findByUserId(user_id)` - Static: Find user by user_id
- `findActiveUsers()` - Static: Find all active users
- `findByRole(role)` - Static: Find users by role
- `findByAlliance(alliance_id)` - Static: Find users by alliance

---

### 2. Alliance Model (`allianceModel.js`)
**Table:** `alliances`

**Fields:**
- `id` (PK, INT, AUTO_INCREMENT)
- `name` (VARCHAR, UNIQUE) - Alliance name
- `tag` (VARCHAR) - Alliance tag/abbreviation
- `leader` (VARCHAR) - Alliance leader name
- `members_count` (INT) - Total members count
- `description` (TEXT) - Alliance description
- `bank_id` (VARCHAR, UNIQUE, nullable) - Bank identifier
- `bank_name` (VARCHAR, nullable) - Bank name
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Relationships:**
- `hasOne` AllianceResource (resources)
- `hasOne` AllianceBank (bank)
- `hasMany` User (members)
- `hasMany` MemberContribution (contributions)

---

### 3. Alliance Resource Model (`allianceModel.js`)
**Table:** `alliance_resources`

**Fields:**
- `id` (PK, INT, AUTO_INCREMENT)
- `alliance_id` (FK to alliances.id)
- `food` (BIGINT) - Food resources
- `wood` (BIGINT) - Wood resources
- `stone` (BIGINT) - Stone resources
- `gold` (BIGINT) - Gold resources
- `total_rss` (BIGINT) - Total resources (sum)
- `weeks_donated` (INT) - Number of weeks with donations
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Relationships:**
- `belongsTo` Alliance (alliance_id → alliances.id)

**Note:** Alliance and AllianceResource are exported together from `allianceModel.js` because they have a direct 1-to-1 relationship.

---

### 4. Alliance Bank Model (`allianceBankModel.js`)
**Table:** `alliance_bank`

**Fields:**
- `id` (PK, INT, AUTO_INCREMENT)
- `alliance_id` (FK to alliances.id)
- `bank_id` (VARCHAR, UNIQUE) - Bank identifier
- `bank_name` (VARCHAR) - Bank name
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Relationships:**
- `belongsTo` Alliance (alliance_id → alliances.id)

---

### 5. Member Contribution Model (`memberContributionModel.js`)
**Table:** `member_contributions`

**Fields:**
- `id` (PK, INT, AUTO_INCREMENT)
- `member_id` (FK to users.id)
- `alliance_id` (FK to alliances.id)
- `week` (INT) - Week number of the year
- `date` (DATE) - Date of contribution
- `food` (BIGINT) - Food contribution
- `wood` (BIGINT) - Wood contribution
- `stone` (BIGINT) - Stone contribution
- `gold` (BIGINT) - Gold contribution
- `total_rss` (BIGINT) - Total resources contributed
- `last_contribution` (DATETIME) - Last contribution timestamp
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Relationships:**
- `belongsTo` User (member_id → users.id)
- `belongsTo` Alliance (alliance_id → alliances.id)

**Indexes:**
- Unique composite index on (member_id, alliance_id, week) to prevent duplicate weekly contributions

---

### 6. Audit Log Model (`auditLogModel.js`)
**Table:** `audit_logs`

**Fields:**
- `id` (PK, INT, AUTO_INCREMENT)
- `user_id` (FK to users.id, nullable)
- `action` (ENUM: 'CREATE','UPDATE','DELETE') - Type of action
- `target_type` (ENUM: 'user','alliance','bank','resource') - Type of target entity
- `target_id` (INT) - ID of target entity
- `details` (TEXT LONG) - Detailed change information (JSON recommended)
- `ip_address` (VARCHAR 45) - User's IP address (IPv4/IPv6)
- `user_agent` (VARCHAR 500) - Browser/client info
- `timestamp` (DATETIME) - When action occurred
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Relationships:**
- `belongsTo` User (user_id → users.id)

**Purpose:** Track all admin activities for accountability and audit trail.

---

## Model Index (`index.js`)
Central file that imports all models and defines their associations.

**Exported Models:**
```javascript
{
  User,
  Alliance,
  AllianceResource,
  AllianceBank,
  MemberContribution,
  AuditLog
}
```

## Database Relationships Summary

```
User (users)
  ├── belongsTo Alliance (alliance_id)
  ├── hasMany MemberContribution (member_id)
  └── hasMany AuditLog (user_id)

Alliance (alliances)
  ├── hasOne AllianceResource (alliance_id)
  ├── hasOne AllianceBank (alliance_id)
  ├── hasMany User (alliance_id)
  └── hasMany MemberContribution (alliance_id)

AllianceResource (alliance_resources)
  └── belongsTo Alliance (alliance_id)

AllianceBank (alliance_bank)
  └── belongsTo Alliance (alliance_id)

MemberContribution (member_contributions)
  ├── belongsTo User (member_id)
  └── belongsTo Alliance (alliance_id)

AuditLog (audit_logs)
  └── belongsTo User (user_id)
```

## Usage Examples

### Import Models
```javascript
import { User, Alliance, AllianceResource, MemberContribution, AuditLog } from './models/index.js';
```

### Query with Associations
```javascript
// Get user with alliance
const user = await User.findOne({
  where: { user_id: '12345' },
  include: [{ model: Alliance, as: 'alliance' }]
});

// Get alliance with all members and resources
const alliance = await Alliance.findOne({
  where: { id: 1 },
  include: [
    { model: User, as: 'members' },
    { model: AllianceResource, as: 'resources' },
    { model: AllianceBank, as: 'bank' }
  ]
});

// Get member contributions with user and alliance
const contributions = await MemberContribution.findAll({
  where: { week: 48 },
  include: [
    { model: User, as: 'member' },
    { model: Alliance, as: 'alliance' }
  ]
});
```

## Migration Notes

### Old vs New User Model
- **Old:** Used `user_id` as primary key (VARCHAR with UUID)
- **New:** Uses `id` as primary key (INT AUTO_INCREMENT), `user_id` as unique identifier
- **Old:** Role enum: `'admin', 'staff', 'auditor'`
- **New:** Role enum: `'Admin','R1','R2','R3','R4','R5'` (alliance hierarchy)
- **Old:** `is_active` (BOOLEAN)
- **New:** `status` (ENUM: 'Active','Inactive')
- **Old:** `fullname` field
- **New:** `name` field
- **New:** Added `alliance_id` foreign key
- **New:** Added `joined_date` field

### Important
The old `userModel.js` is preserved. The new user model is in `userModelNew.js` and is imported in `models/index.js`. To switch completely, you may need to update controllers and authentication logic.

## Timestamps
All models include:
- `created_at` - Auto-set on creation (TIMESTAMP DEFAULT NOW)
- `updated_at` - Auto-updated on modification (TIMESTAMP DEFAULT NOW ON UPDATE NOW)

Sequelize handles these automatically with:
```javascript
timestamps: true,
createdAt: 'created_at',
updatedAt: 'updated_at'
```

## Security Features
- **Password Hashing:** Argon2 with secure parameters (memoryCost: 65536, timeCost: 3)
- **Auto-hide Password:** `toJSON()` method removes password from responses
- **Audit Trail:** All admin actions logged in `audit_logs` table
- **IP Tracking:** Audit logs capture IP address and user agent

## Next Steps
1. Update `backend/index.js` to import new models (✅ Done)
2. Create database migration scripts
3. Update controllers to use new models
4. Update authentication middleware for new user structure
5. Test all associations and queries
6. Create seed data for testing
