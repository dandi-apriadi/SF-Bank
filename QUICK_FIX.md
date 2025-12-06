# 🚀 Quick Start - Fix "No Database Selected" Error

## Problem
```
Error: No database selected
code: 'ER_NO_DB_ERROR'
errno: 1046
```

## Solution (VPS)

### Option 1: Automated Fix (Recommended)
```bash
cd /var/www/sf/backend
chmod +x ../fix_database_seeding.sh
bash ../fix_database_seeding.sh
```

### Option 2: Manual Fix
```bash
cd /var/www/sf/backend

# Step 1: Check config
node scripts/checkDatabaseConfig.js

# Step 2: Create database
node scripts/createDatabase.js

# Step 3: Setup tables
node scripts/databaseSetup.js

# Step 4: Run seeding (choose one)
node scripts/seedFullBankData.js          # Original (fixed)
node scripts/seedFullBankDataRobust.js    # More robust
```

## Files Modified/Created

### Modified:
- ✅ `backend/scripts/seedFullBankData.js` - Added database existence check & explicit USE command

### New Files:
- ✅ `backend/scripts/seedFullBankDataRobust.js` - Robust version with better error handling
- ✅ `backend/scripts/checkDatabaseConfig.js` - Diagnostic tool
- ✅ `fix_database_seeding.sh` - Automated fix script
- ✅ `SEEDING_TROUBLESHOOTING.md` - Complete troubleshooting guide
- ✅ `QUICK_FIX.md` - This file

## Changes Made

### `seedFullBankData.js` now includes:
1. **Import mysql2** for direct connection
2. **ensureDatabaseExists()** function - Creates database if not exists
3. **Explicit `USE database`** command before operations

```javascript
// New function added
const ensureDatabaseExists = async () => {
    let connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS
    });
    
    const dbName = process.env.DB_NAME || 'prima';
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await connection.end();
    return dbName;
};

// In seedFullBankData():
const dbName = await ensureDatabaseExists();
await db.authenticate();
await db.query(`USE \`${dbName}\``);
```

## Verification

After successful seeding:
```bash
mysql -u root -p

USE prima;
SELECT COUNT(*) FROM alliances;      -- Should be 5
SELECT COUNT(*) FROM users;          -- Should be 500
SELECT COUNT(*) FROM member_contributions;  -- Should be 25000
```

## Need Help?
Read: `SEEDING_TROUBLESHOOTING.md`
