# 🔧 SF BANK Database Seeding Troubleshooting Guide

## Error: "No database selected" (ER_NO_DB_ERROR)

### Penyebab:
Database connection tidak memilih database dengan benar, biasanya karena:
1. Database belum dibuat
2. Environment variable `DB_NAME` tidak terset dengan benar
3. File `.env` tidak terbaca di VPS
4. Connection pool tidak mencantumkan database

---

## ✅ SOLUSI LANGKAH PER LANGKAH

### **Langkah 1: Check Environment Variables di VPS**

```bash
# Di VPS, masuk ke folder backend
cd /var/www/sf/backend

# Check apakah file .env ada
ls -la .env

# Lihat isi .env (tanpa menampilkan password)
cat .env | grep DB_
```

**Expected output:**
```
DB_HOST=localhost
DB_USER=your_db_user
DB_PASS=your_password
DB_NAME=prima
```

**Jika .env tidak ada atau kosong:**
```bash
# Copy dari .env.example atau buat baru
nano .env
```

Isi dengan:
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=prima
DB_PORT=3306

# Pool settings
DB_POOL_MAX=5
DB_POOL_MIN=0
DB_POOL_ACQUIRE=30000
DB_POOL_IDLE=10000
```

---

### **Langkah 2: Check Database Configuration**

Jalankan script checker yang sudah saya buat:

```bash
cd /var/www/sf/backend
node scripts/checkDatabaseConfig.js
```

Script ini akan:
- ✅ Validate environment variables
- ✅ Test MySQL connection
- ✅ Check if database exists (create if not)
- ✅ List existing tables
- ✅ Verify connection with database selected

---

### **Langkah 3: Create Database (jika belum ada)**

```bash
node scripts/createDatabase.js
```

**Atau manual via MySQL:**
```bash
mysql -u root -p
```

```sql
CREATE DATABASE IF NOT EXISTS prima;
USE prima;
SHOW TABLES;
EXIT;
```

---

### **Langkah 4: Setup Database Tables**

```bash
node scripts/databaseSetup.js
```

Ini akan create semua tables yang dibutuhkan:
- alliances
- users
- member_contributions
- alliance_resources
- alliance_bank
- audit_logs

---

### **Langkah 5: Run Seeding**

#### **Option A: Original Script (sudah diperbaiki)**
```bash
node scripts/seedFullBankData.js
```

#### **Option B: Robust Script (recommended untuk VPS)**
```bash
node scripts/seedFullBankDataRobust.js
```

Robust script punya kelebihan:
- ✅ Auto-check dan create database jika belum ada
- ✅ Explicit `USE database` command
- ✅ Better error handling

---

## 🐛 DEBUGGING TIPS

### Check MySQL Service Status
```bash
# Ubuntu/Debian
sudo systemctl status mysql

# CentOS/RHEL
sudo systemctl status mysqld

# Start if not running
sudo systemctl start mysql
```

### Check MySQL Connection Manually
```bash
mysql -h localhost -u root -p
```

Jika berhasil login, test:
```sql
SHOW DATABASES;
USE prima;
SHOW TABLES;
```

### Check Node.js Environment
```bash
# Test if .env terbaca
node -e "require('dotenv').config(); console.log('DB_NAME:', process.env.DB_NAME);"
```

Expected output: `DB_NAME: prima`

### Check File Permissions
```bash
# Pastikan file .env readable
chmod 644 /var/www/sf/backend/.env

# Check ownership
ls -la /var/www/sf/backend/.env
```

---

## 📋 QUICK FIX COMMANDS

Jalankan ini di VPS secara berurutan:

```bash
# 1. Masuk ke folder backend
cd /var/www/sf/backend

# 2. Check config
node scripts/checkDatabaseConfig.js

# 3. Create database (jika belum)
node scripts/createDatabase.js

# 4. Setup tables
node scripts/databaseSetup.js

# 5. Run seeding (robust version)
node scripts/seedFullBankDataRobust.js
```

---

## ⚠️ COMMON ISSUES

### Issue: "Access denied for user"
**Solution:** Check username/password di `.env`

### Issue: "Can't connect to MySQL server"
**Solution:** 
```bash
sudo systemctl start mysql
sudo systemctl enable mysql  # Auto-start on boot
```

### Issue: "Table doesn't exist"
**Solution:** Run `node scripts/databaseSetup.js` terlebih dahulu

### Issue: ".env not found"
**Solution:** 
```bash
cp .env.example .env
nano .env  # Edit dengan kredensial yang benar
```

---

## 🎯 VERIFICATION

Setelah seeding berhasil, verify data:

```bash
mysql -u root -p prima
```

```sql
-- Check alliances
SELECT * FROM alliances;

-- Check users count
SELECT COUNT(*) FROM users;

-- Check contributions count
SELECT COUNT(*) FROM member_contributions;

-- Check sample data
SELECT 
    u.name, 
    a.name as alliance,
    COUNT(mc.id) as total_contributions
FROM users u
JOIN alliances a ON u.alliance_id = a.id
LEFT JOIN member_contributions mc ON u.id = mc.member_id
GROUP BY u.id
LIMIT 10;
```

Expected results:
- ✅ 5 alliances (Sacred, Forces, Dawn, Reborn, Mistic)
- ✅ 500 users (100 per alliance)
- ✅ 25,000 contributions (50 weeks × 500 members)

---

## 📞 STILL HAVING ISSUES?

1. Check logs: `/var/www/sf/backend/logs/`
2. Enable Sequelize logging: Set `SEQUELIZE_LOGGING=true` di `.env`
3. Run with debug:
   ```bash
   NODE_ENV=development node scripts/seedFullBankDataRobust.js
   ```

---

## 🚀 FILES CREATED

Saya sudah membuat 3 file baru untuk membantu:

1. **`scripts/checkDatabaseConfig.js`** - Check semua konfigurasi database
2. **`scripts/seedFullBankDataRobust.js`** - Seeding script dengan better error handling
3. **`SEEDING_TROUBLESHOOTING.md`** - Dokumentasi ini

---

**Good luck! 🍀**
