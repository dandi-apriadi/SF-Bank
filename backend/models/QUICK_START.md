# SF BANK Models - Quick Start Guide

## 📋 Overview
Semua models telah dibuat berdasarkan struktur database di `database.txt`. Models ini sudah mencakup:
- ✅ Semua field sesuai spesifikasi
- ✅ Field `created_at` dan `updated_at` di semua table
- ✅ Relasi antar table yang benar
- ✅ Indexes untuk performa query
- ✅ Validasi data
- ✅ Password hashing (Argon2)
- ✅ Audit trail support

## 📁 File Structure
```
backend/models/
├── index.js                      # Central import dengan semua relasi
├── userModelNew.js               # Model User baru (sesuai database.txt)
├── allianceModel.js              # Alliance & AllianceResource models
├── allianceBankModel.js          # AllianceBank model
├── memberContributionModel.js    # MemberContribution model
├── auditLogModel.js              # AuditLog model
├── userModel.js                  # User model lama (preserved)
└── MODELS_README.md              # Dokumentasi lengkap
```

## 🚀 Setup Database

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Configure Environment
Edit `.env` file:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=sf_bank
```

### Step 3: Create Tables
```bash
node scripts/setupSFBankTables.js
```

### Step 4: Seed Sample Data (Optional)
```bash
node scripts/seedSFBankData.js
```

## 📊 Database Tables Created

1. **alliances** - Alliance information
2. **alliance_resources** - Alliance resource tracking
3. **alliance_bank** - Alliance bank details
4. **users** - User accounts with roles
5. **member_contributions** - Weekly member contributions
6. **audit_logs** - Activity audit trail

## 🔗 Relationships

```
┌─────────────────┐
│    Alliance     │──┐
└─────────────────┘  │
         ▲           │ hasOne
         │           ▼
         │    ┌──────────────────┐
         │    │ AllianceResource │
         │    └──────────────────┘
         │
         │           ┌──────────────┐
         └───────────│ AllianceBank │
         │   hasOne  └──────────────┘
         │
         │ hasMany
         │
    ┌────┴────┐
    │  User   │
    └─────────┘
         │
         │ hasMany
         ▼
┌────────────────────┐
│MemberContribution  │
└────────────────────┘

    ┌────────┐
    │  User  │
    └────────┘
         │
         │ hasMany
         ▼
    ┌──────────┐
    │AuditLog  │
    └──────────┘
```

## 💻 Usage Examples

### Import Models
```javascript
import { 
    User, 
    Alliance, 
    AllianceResource, 
    AllianceBank,
    MemberContribution, 
    AuditLog 
} from './models/index.js';
```

### Create Alliance with Resources
```javascript
// Create alliance
const alliance = await Alliance.create({
    name: 'Kingdom 3946',
    tag: 'K3946',
    leader: 'King Arthur',
    description: 'The legendary kingdom',
    bank_id: 'BANK001',
    bank_name: 'Kingdom Treasury'
});

// Create resources for alliance
await AllianceResource.create({
    alliance_id: alliance.id,
    food: 50000000,
    wood: 40000000,
    stone: 35000000,
    gold: 25000000,
    total_rss: 150000000,
    weeks_donated: 12
});
```

### Create User
```javascript
const user = await User.create({
    user_id: 'USR001',
    name: 'John Doe',
    email: 'john@kingdom3946.com',
    password: 'securepassword',  // Auto-hashed with Argon2
    role: 'R5',
    alliance_id: alliance.id,
    status: 'Active',
    joined_date: new Date()
});
```

### Query with Associations
```javascript
// Get user with alliance
const user = await User.findOne({
    where: { email: 'john@kingdom3946.com' },
    include: [{
        model: Alliance,
        as: 'alliance',
        include: [{
            model: AllianceResource,
            as: 'resources'
        }]
    }]
});

// Get alliance with all members
const alliance = await Alliance.findOne({
    where: { id: 1 },
    include: [
        { model: User, as: 'members' },
        { model: AllianceResource, as: 'resources' },
        { model: AllianceBank, as: 'bank' }
    ]
});
```

### Record Member Contribution
```javascript
const contribution = await MemberContribution.create({
    member_id: user.id,
    alliance_id: alliance.id,
    week: 48,
    date: new Date(),
    food: 5000000,
    wood: 4000000,
    stone: 3000000,
    gold: 2000000,
    total_rss: 14000000,
    last_contribution: new Date()
});
```

### Log Admin Action (Audit Trail)
```javascript
await AuditLog.create({
    user_id: adminUser.id,
    action: 'UPDATE',
    target_type: 'alliance',
    target_id: alliance.id,
    details: JSON.stringify({
        field: 'members_count',
        old_value: 10,
        new_value: 11,
        reason: 'New member joined'
    }),
    ip_address: req.ip,
    user_agent: req.headers['user-agent'],
    timestamp: new Date()
});
```

### Find Top Contributors (Leaderboard)
```javascript
const topContributors = await MemberContribution.findAll({
    where: { week: 48 },
    include: [{
        model: User,
        as: 'member',
        attributes: ['name', 'user_id', 'role']
    }],
    order: [['total_rss', 'DESC']],
    limit: 10
});
```

### Get User's Contribution History
```javascript
const history = await MemberContribution.findAll({
    where: { member_id: user.id },
    order: [['week', 'DESC']],
    limit: 10
});
```

### Get Audit Logs (Admin Activity)
```javascript
const logs = await AuditLog.findAll({
    where: { 
        action: 'DELETE',
        target_type: 'user'
    },
    include: [{
        model: User,
        as: 'user',
        attributes: ['name', 'email', 'role']
    }],
    order: [['timestamp', 'DESC']],
    limit: 50
});
```

## 🔐 Security Features

### Password Hashing
```javascript
// Passwords are automatically hashed on create/update
const user = await User.create({
    email: 'test@example.com',
    password: 'plaintext'  // ← Plain text
});
// user.password is now hashed with Argon2

// Password is hidden in JSON responses
console.log(user.toJSON());  // password field excluded
```

### Role-Based Access
```javascript
// Check user role
if (user.hasRole('Admin')) {
    // Admin-only operations
}

// Check if user is active
if (user.isActive()) {
    // Allow access
}
```

## 📝 Model Methods

### User Model
```javascript
// Instance methods
user.toJSON()              // Remove password from response
user.hasRole('Admin')      // Check if user has role
user.isActive()            // Check if user is active
await user.updateLastLogin() // Update last_login timestamp

// Static methods
await User.findByEmail(email)
await User.findByUserId(user_id)
await User.findActiveUsers()
await User.findByRole('Admin')
await User.findByAlliance(alliance_id)
```

## 🎯 Best Practices

### 1. Always Use Transactions for Multiple Operations
```javascript
const transaction = await db.transaction();
try {
    const alliance = await Alliance.create({...}, { transaction });
    await AllianceResource.create({...}, { transaction });
    await transaction.commit();
} catch (error) {
    await transaction.rollback();
    throw error;
}
```

### 2. Include Associations When Needed
```javascript
// Good - fetch related data in one query
const user = await User.findOne({
    where: { id: 1 },
    include: [{ model: Alliance, as: 'alliance' }]
});

// Bad - multiple queries (N+1 problem)
const user = await User.findOne({ where: { id: 1 } });
const alliance = await Alliance.findOne({ where: { id: user.alliance_id } });
```

### 3. Use Indexes for Better Performance
All models already include proper indexes:
- Unique indexes on email, user_id
- Foreign key indexes
- Composite indexes where needed

### 4. Log All Admin Actions
```javascript
// After any admin operation
await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE',
    target_type: 'user',
    target_id: targetUser.id,
    details: JSON.stringify(changes),
    ip_address: req.ip,
    user_agent: req.headers['user-agent']
});
```

## 🐛 Troubleshooting

### Issue: Tables not created
**Solution:** Check database connection in `.env` and run:
```bash
node scripts/setupSFBankTables.js
```

### Issue: Foreign key constraint fails
**Solution:** Tables must be created in order. Use the setup script which handles dependencies.

### Issue: Password not hashing
**Solution:** Models include hooks for auto-hashing. Make sure you're importing from `models/index.js`.

### Issue: Association not found
**Solution:** Import models from `models/index.js` (not individual files) to get all associations.

## 📚 Additional Resources

- See `MODELS_README.md` for detailed documentation
- See `database.txt` for original schema design
- Check `backend/scripts/` for more utility scripts

## 🎉 Quick Test

```bash
# Setup tables
node scripts/setupSFBankTables.js

# Seed sample data
node scripts/seedSFBankData.js

# Start server
npm start

# Test credentials:
# Admin: admin@kingdom3946.com / admin123
# R1: r1@kingdom3946.com / r1pass123
# R2: r2@kingdom3946.com / r2pass123
# Member: member1@kingdom3946.com / member123
```

---

**Created:** December 6, 2025  
**Models Version:** 1.0.0  
**Database:** SF BANK (Kingdom 3946 Alliance Management System)
