# Migration Guide: Old User Model → New SF BANK Models

## 📋 Overview
Dokumen ini menjelaskan perbedaan antara user model lama (`userModel.js`) dan struktur baru SF BANK (`userModelNew.js` + relasi).

## 🔄 Key Changes

### User Model Structure

| Field | Old Model | New Model | Notes |
|-------|-----------|-----------|-------|
| **Primary Key** | `user_id` (VARCHAR UUID) | `id` (INT AUTO_INCREMENT) | Lebih efisien untuk relasi |
| **User Identifier** | `user_id` (PK) | `user_id` (UNIQUE) | Tetap unique tapi bukan PK |
| **Name Field** | `fullname` | `name` | Renamed untuk konsistensi |
| **Role Values** | `'admin', 'staff', 'auditor'` | `'Admin','R1','R2','R3','R4','R5'` | Alliance hierarchy roles |
| **Status Field** | `is_active` (BOOLEAN) | `status` (ENUM 'Active','Inactive') | More explicit |
| **Alliance Link** | ❌ Not exists | `alliance_id` (FK) | New foreign key |
| **Join Date** | ❌ Not exists | `joined_date` (DATE) | Track when user joined |
| **Phone** | ✅ Exists | ❌ Removed | Not needed for SF BANK |
| **Profile Picture** | ✅ Exists | ❌ Removed | Not in current scope |

## 🆕 New Tables (Not in Old Structure)

### 1. alliances
- Main table untuk alliance information
- Contains: name, tag, leader, members_count, description, bank info

### 2. alliance_resources
- Resource tracking per alliance
- Contains: food, wood, stone, gold, total_rss, weeks_donated

### 3. alliance_bank
- Bank details per alliance
- Contains: bank_id, bank_name

### 4. member_contributions
- Weekly contributions per member
- Contains: member_id, alliance_id, week, resources, total_rss

### 5. audit_logs
- Complete audit trail
- Contains: user_id, action, target_type, target_id, details, ip_address, user_agent

## 🔗 New Relationships

```
Old Structure:
└── User (standalone, no relations)

New Structure:
User
├── belongsTo Alliance
├── hasMany MemberContribution
└── hasMany AuditLog

Alliance
├── hasMany User
├── hasOne AllianceResource
├── hasOne AllianceBank
└── hasMany MemberContribution
```

## 📝 Code Migration Examples

### Creating User

**Old Way:**
```javascript
import { User } from './models/userModel.js';

const user = await User.create({
    fullname: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'staff',
    phone: '+1234567890',
    is_active: true
});
```

**New Way:**
```javascript
import { User, Alliance } from './models/index.js';

const user = await User.create({
    user_id: 'USR001',        // ← Custom game ID
    name: 'John Doe',         // ← Renamed from fullname
    email: 'john@example.com',
    password: 'password123',
    role: 'R5',               // ← New role system
    alliance_id: 1,           // ← New: alliance membership
    status: 'Active',         // ← Changed from is_active
    joined_date: new Date()   // ← New: track join date
});
```

### Checking User Status

**Old Way:**
```javascript
if (user.is_active) {
    // User is active
}
// or
if (user.isActive()) {
    // Using method
}
```

**New Way:**
```javascript
if (user.status === 'Active') {
    // User is active
}
// or
if (user.isActive()) {
    // Using method (works the same)
}
```

### Checking User Role

**Old Way:**
```javascript
if (user.role === 'admin') {
    // Admin operations
}
// or
if (user.hasRole('admin')) {
    // Using method
}
```

**New Way:**
```javascript
if (user.role === 'Admin') {
    // Admin operations
}
// or
if (user.hasRole('Admin')) {
    // Using method
}

// New: Check alliance roles
if (['Admin', 'R1', 'R2'].includes(user.role)) {
    // High-level roles
}
```

### Getting User with Relations

**Old Way:**
```javascript
// No relations available
const user = await User.findOne({ 
    where: { email: 'john@example.com' } 
});
```

**New Way:**
```javascript
// Get user with alliance and contributions
const user = await User.findOne({
    where: { email: 'john@example.com' },
    include: [
        { 
            model: Alliance, 
            as: 'alliance',
            include: [
                { model: AllianceResource, as: 'resources' }
            ]
        },
        { 
            model: MemberContribution, 
            as: 'contributions',
            limit: 10,
            order: [['week', 'DESC']]
        }
    ]
});

// Access related data
console.log(user.alliance.name);           // Alliance name
console.log(user.alliance.resources.food);  // Alliance food
console.log(user.contributions[0].total_rss); // Latest contribution
```

## 🛠️ Migration Steps

### Step 1: Backup Current Database
```bash
bash backup.sh
```

### Step 2: Install New Models
Models sudah dibuat di:
- `backend/models/userModelNew.js`
- `backend/models/allianceModel.js`
- `backend/models/allianceBankModel.js`
- `backend/models/memberContributionModel.js`
- `backend/models/auditLogModel.js`
- `backend/models/index.js` (dengan relasi)

### Step 3: Create New Tables
```bash
cd backend
node scripts/setupSFBankTables.js
```

### Step 4: Migrate Existing User Data (If Needed)
```javascript
// Create migration script: backend/scripts/migrateUsers.js
import { User as OldUser } from './models/userModel.js';
import User from './models/userModelNew.js';

const migrateUsers = async () => {
    const oldUsers = await OldUser.findAll();
    
    for (const oldUser of oldUsers) {
        await User.create({
            user_id: oldUser.user_id,
            name: oldUser.fullname,
            email: oldUser.email,
            password: oldUser.password, // Already hashed
            role: oldUser.role === 'admin' ? 'Admin' : 'R5',
            status: oldUser.is_active ? 'Active' : 'Inactive',
            alliance_id: null, // Assign manually later
            joined_date: oldUser.created_at
        });
    }
};
```

### Step 5: Update Controllers
```javascript
// Old import
import { User } from '../models/userModel.js';

// New import
import { User, Alliance, MemberContribution } from '../models/index.js';
```

### Step 6: Update Authentication Middleware
```javascript
// backend/middleware/AuthUser.js
// Update role checks:

// Old
if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied' });
}

// New
if (!['Admin', 'R1', 'R2'].includes(req.user.role)) {
    return res.status(403).json({ msg: 'Access denied' });
}
```

### Step 7: Update API Responses
```javascript
// Old response
res.json({
    user_id: user.user_id,
    fullname: user.fullname,
    email: user.email,
    role: user.role,
    is_active: user.is_active
});

// New response
res.json({
    id: user.id,
    user_id: user.user_id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    alliance: user.alliance ? {
        id: user.alliance.id,
        name: user.alliance.name,
        tag: user.alliance.tag
    } : null
});
```

## 🎯 Controller Migration Checklist

- [ ] Update imports to use `models/index.js`
- [ ] Change `fullname` → `name`
- [ ] Change `is_active` → `status`
- [ ] Update role checks for new role values
- [ ] Add alliance_id when creating users
- [ ] Include alliance relations in queries
- [ ] Add audit logging for admin actions
- [ ] Update validation schemas
- [ ] Test all endpoints

## 🔐 Authentication Updates

### Login Flow
```javascript
// backend/controllers/shared/authController.js

// Find user (works with both email and user_id)
const user = await User.findOne({
    where: { email },
    include: [{ 
        model: Alliance, 
        as: 'alliance',
        attributes: ['id', 'name', 'tag']
    }]
});

// Check status (updated)
if (user.status !== 'Active') {
    return res.status(403).json({ msg: 'Account is inactive' });
}

// Update last login
await user.updateLastLogin();

// Store in session (include alliance info)
req.session.user = {
    id: user.id,
    user_id: user.user_id,
    name: user.name,
    email: user.email,
    role: user.role,
    alliance_id: user.alliance_id,
    alliance_name: user.alliance?.name
};
```

## 📊 New Features Available

### 1. Alliance Management
```javascript
// Get alliance with all members and resources
const alliance = await Alliance.findOne({
    where: { id: 1 },
    include: [
        { model: User, as: 'members' },
        { model: AllianceResource, as: 'resources' },
        { model: AllianceBank, as: 'bank' }
    ]
});
```

### 2. Contribution Tracking
```javascript
// Record contribution
await MemberContribution.create({
    member_id: user.id,
    alliance_id: user.alliance_id,
    week: currentWeek,
    date: new Date(),
    food: 5000000,
    wood: 4000000,
    stone: 3000000,
    gold: 2000000,
    total_rss: 14000000
});
```

### 3. Audit Trail
```javascript
// Log admin action
await AuditLog.create({
    user_id: adminUser.id,
    action: 'UPDATE',
    target_type: 'user',
    target_id: targetUser.id,
    details: JSON.stringify(changes),
    ip_address: req.ip,
    user_agent: req.headers['user-agent']
});
```

## 🚨 Breaking Changes

1. **User ID**: Primary key changed from VARCHAR to INT
2. **Field Names**: `fullname` → `name`, `is_active` → `status`
3. **Role Values**: Changed from lowercase to alliance hierarchy
4. **Required Fields**: `user_id` is now required on creation
5. **Removed Fields**: `phone`, `profile_picture` (dapat ditambahkan kembali jika perlu)

## ✅ Testing New Models

```bash
# Setup new tables
node scripts/setupSFBankTables.js

# Seed test data
node scripts/seedSFBankData.js

# Start server
npm start

# Test endpoints with new structure
```

## 📚 Additional Documentation

- **Full Documentation**: `backend/models/MODELS_README.md`
- **Quick Start Guide**: `backend/models/QUICK_START.md`
- **Database Schema**: `database.txt`
- **Setup Scripts**: `backend/scripts/setupSFBankTables.js`
- **Seed Script**: `backend/scripts/seedSFBankData.js`

## 🤝 Need Help?

Refer to these files for examples:
1. `seedSFBankData.js` - Shows how to create all entities
2. `QUICK_START.md` - Common usage patterns
3. `MODELS_README.md` - Detailed API documentation

---

**Migration Status**: ✅ Models created and ready  
**Next Steps**: Update controllers and test endpoints  
**Rollback**: Use `bash rollback.sh` if needed
