# SF BANK Database Reset Guide

## Problem
Old `users` table structure conflicts with new SF BANK models that require `alliance_id` foreign key.

## Solution Options

### Option 1: Automatic Backup (Recommended for First Time)
The setup script will automatically rename old `users` table to `users_backup` and create new structure.

**Steps:**
```bash
cd backend
node index.js
```

The server will:
1. Detect old users table
2. Rename it to users_backup
3. Create new tables with correct structure

### Option 2: Manual Drop and Recreate (Clean Start)
If you want a completely fresh start without old data:

```bash
cd backend
node scripts/dropSFBankTables.js
# Type "YES" when prompted
# Then run setup:
node scripts/setupSFBankTables.js
```

### Option 3: Keep Old Data and Migrate
If you want to preserve old user data:

```bash
cd backend
# First backup
node scripts/dropSFBankTables.js  # This will backup first
# Then create migration script (to be implemented)
node scripts/migrateUsersData.js
```

## What's Different in New Structure?

**Old users table:**
- Primary key: `user_id` (VARCHAR UUID)
- Fields: fullname, email, password, role, is_active
- Roles: admin, staff, auditor
- No alliance relationship

**New users table:**
- Primary key: `id` (INT AUTO_INCREMENT)
- Fields: id, user_id, name, email, password, role, alliance_id, status, joined_date
- Roles: Admin, R1, R2, R3, R4, R5
- Has foreign key to alliances table

## Current Error Explanation

```
Key column 'alliance_id' doesn't exist in table
```

This happens because:
1. Old `users` table exists without `alliance_id` column
2. New User model tries to create index on `alliance_id`
3. Sequelize can't create index for non-existent column

## Quick Fix (Choose One)

### A. Let Server Handle It (Easiest)
```bash
# Just restart the server
cd backend
npm start
```
Server will auto-rename old table and create new structure.

### B. Manual Clean Start
```bash
# Drop old table manually in MySQL
mysql -u your_user -p your_database
DROP TABLE users;
exit;

# Then start server
npm start
```

### C. Use Drop Script
```bash
cd backend
node scripts/dropSFBankTables.js
# Type: YES
# Then start server
npm start
```

## After Reset

1. **Seed Sample Data:**
   ```bash
   node scripts/seedSFBankData.js
   ```
   
2. **Test Credentials:**
   - Admin: `admin@kingdom3946.com` / `admin123`
   - R1: `r1@kingdom3946.com` / `r1pass123`
   - Member: `member1@kingdom3946.com` / `member123`

3. **Verify Tables:**
   ```sql
   SHOW TABLES;
   DESC users;
   DESC alliances;
   ```

## Backup Location

If auto-backup happened:
- Old data: `users_backup` table
- Can restore if needed: `RENAME TABLE users_backup TO users;`

## Next Steps

After fixing:
1. ✅ Tables created with correct structure
2. ✅ Foreign keys working
3. ✅ Seed sample data
4. 🔄 Update controllers to use new structure
5. 🔄 Update authentication for new roles
6. 🔄 Test all endpoints

---

**Last Updated:** December 6, 2025
