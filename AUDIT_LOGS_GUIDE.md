# 📋 Audit Logs Documentation

## Overview
Audit Logs adalah sistem untuk mencatat semua aktivitas admin dalam aplikasi SF Bank. Setiap kali ada operasi CREATE, UPDATE, atau DELETE pada data penting (users, alliances, banks, resources), aktivitas tersebut akan tercatat dengan detail user, timestamp, IP address, dan perubahan yang dilakukan.

## Fitur

### 1. **Track Semua Aktivitas Admin**
- ✅ User creation/update/deletion
- ✅ Alliance management (create, edit, delete)
- ✅ Bank operations
- ✅ Resource contributions (add, modify, remove)
- ✅ Member management

### 2. **Informasi Lengkap**
Setiap log mencatat:
- **User**: Siapa yang melakukan aksi
- **Action**: CREATE/UPDATE/DELETE
- **Target**: Data apa yang diubah
- **Details**: Perubahan spesifik
- **Timestamp**: Kapan aksi dilakukan
- **IP Address**: Dari mana user akses
- **User Agent**: Device/browser yang digunakan

### 3. **Filter & Search**
- Filter berdasarkan action (CREATE, UPDATE, DELETE)
- Filter berdasarkan target type (user, alliance, bank, resource)
- Filter berdasarkan user yang melakukan aksi
- Filter berdasarkan date range
- Search full-text pada user, email, target name, details

### 4. **Export & Reporting**
- Export ke CSV untuk audit trail
- Statistik real-time (total logs, creates, updates, deletes)
- Active users count
- Search history by specific resource

### 5. **Admin Dashboard**
Menu "Audit Logs" di admin panel menampilkan:
- Statistics cards (total, creates, updates, deletes, active users)
- Advanced filter panel
- Paginated log table (desktop & mobile)
- Detail modal untuk inspect setiap log
- CSV export functionality

---

## Implementation Guide

### Backend Integration

#### 1. Setup Database
```bash
cd backend
node scripts/setupAuditLogs.js
```

#### 2. Register Routes di Main Backend
Edit `backend/index.js` atau `backend/routes.js`:

```javascript
const auditLogRoutes = require("./routes/audit/auditLogRoutes");

// Add to routes
app.use("/api/v1/audit-logs", auditLogRoutes);
```

#### 3. Gunakan AuditLogger di Controllers

Import AuditLogger:
```javascript
const AuditLogger = require("../../utils/auditLogger");
```

**Contoh: Log User Creation**
```javascript
// Di UserManagementController.js
async createUser(req, res) {
  try {
    const userData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };

    // Create user di database...
    const [result] = await Database.query(
      `INSERT INTO users (name, email, role, ...) VALUES (?, ?, ?, ...)`,
      [userData.name, userData.email, userData.role, ...]
    );

    // Log the action
    await AuditLogger.logUserCreate(
      req.user.id,           // Admin yang membuat
      result.insertId,       // ID user baru
      userData,             // Data user
      req                   // Request object (untuk IP & user agent)
    );

    res.json({ success: true, id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
```

**Contoh: Log User Update**
```javascript
async updateUser(req, res) {
  try {
    const userId = req.params.id;
    const changes = {
      name: { old: oldUser.name, new: req.body.name },
      role: { old: oldUser.role, new: req.body.role },
    };

    // Update di database...
    await Database.query(
      `UPDATE users SET name = ?, role = ? WHERE id = ?`,
      [req.body.name, req.body.role, userId]
    );

    // Log the action
    await AuditLogger.logUserUpdate(
      req.user.id,
      userId,
      changes,
      req
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
```

**Contoh: Log User Deletion**
```javascript
async deleteUser(req, res) {
  try {
    const userId = req.params.id;
    
    // Get user data before deletion
    const [users] = await Database.query(
      `SELECT name, email FROM users WHERE id = ?`,
      [userId]
    );
    const userData = users[0];

    // Delete dari database...
    await Database.query(`DELETE FROM users WHERE id = ?`, [userId]);

    // Log the action
    await AuditLogger.logUserDelete(
      req.user.id,
      userId,
      userData,
      req
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
```

**Contoh: Log Alliance Creation**
```javascript
async createAlliance(req, res) {
  try {
    const allianceData = {
      name: req.body.name,
      tag: req.body.tag,
      leader: req.body.leader,
    };

    const [result] = await Database.query(
      `INSERT INTO alliances (name, tag, leader, ...) VALUES (?, ?, ?, ...)`,
      [allianceData.name, allianceData.tag, allianceData.leader, ...]
    );

    await AuditLogger.logAllianceCreate(
      req.user.id,
      result.insertId,
      allianceData,
      req
    );

    res.json({ success: true, id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
```

**Contoh: Log Resource Contribution**
```javascript
async addContribution(req, res) {
  try {
    const { memberId, allianceId, food, wood, stone, gold } = req.body;

    const [result] = await Database.query(
      `INSERT INTO member_contributions (...) VALUES (...)`,
      [memberId, allianceId, food, wood, stone, gold, ...]
    );

    await AuditLogger.logResourceContribution(
      req.user.id,
      memberId,
      allianceId,
      { food, wood, stone, gold },
      "CREATE",
      req
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
```

#### 4. API Endpoints

**Get All Audit Logs**
```
GET /api/v1/audit-logs?page=1&limit=15&action=CREATE&targetType=user&userId=1&dateFrom=2025-01-01&dateTo=2025-01-31&search=admin
```

**Get Specific Log Details**
```
GET /api/v1/audit-logs/:logId
```

**Get Statistics**
```
GET /api/v1/audit-logs/statistics
```

**Get User's Logs**
```
GET /api/v1/audit-logs/user/:userId?page=1&limit=15
```

**Get Resource Logs**
```
GET /api/v1/audit-logs/target/:targetType/:targetId
```

**Export to CSV**
```
GET /api/v1/audit-logs/export/csv?action=CREATE&targetType=alliance
```

**Delete Old Logs (Retention)**
```
POST /api/v1/audit-logs/delete-old
Body: { "daysOld": 90 }
```

### Frontend Integration

#### 1. Component Already Created
- File: `frontend/src/views/admin/AuditLogs.jsx`
- Sudah include: Filter, search, pagination, detail modal, export CSV

#### 2. Service Already Created
- File: `frontend/src/services/auditLogService.js`
- Methods untuk semua operasi audit logs

#### 3. Route Already Added
- File: `frontend/src/routes/routes-admin.js`
- Menu "Audit Logs" sudah di sidebar

#### 4. Integration ke Existing Controllers
Jika menggunakan audit logs di component lain:

```javascript
import { auditLogService } from "../services/auditLogService";

// Get logs
const logs = await auditLogService.getLogs({
  page: 1,
  limit: 15,
  action: "CREATE",
  targetType: "user",
});

// Get specific user's logs
const userLogs = await auditLogService.getLogsByUser(userId);

// Get resource logs
const resourceLogs = await auditLogService.getLogsByTarget("alliance", allianceId);

// Export
const csvBlob = await auditLogService.exportLogs({
  action: "UPDATE",
  targetType: "alliance",
});
```

---

## Database Schema

```sql
CREATE TABLE audit_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  action ENUM('CREATE', 'UPDATE', 'DELETE'),
  target_type ENUM('user', 'alliance', 'bank', 'resource'),
  target_id INT NOT NULL,
  details LONGTEXT,
  ip_address VARCHAR(45),
  user_agent VARCHAR(500),
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user (user_id),
  INDEX idx_action (action),
  INDEX idx_target (target_type, target_id),
  INDEX idx_timestamp (timestamp)
);
```

---

## Usage Examples

### Example 1: Track User Creation
Admin creates new user "Ahmad" → Logged:
```
User: Admin (id: 1)
Action: CREATE
Target: user #5
Details: Created user: Ahmad (Email: ahmad@kingdom.com, Role: R2)
Timestamp: 2025-01-15 10:30:45
IP: 192.168.1.100
```

### Example 2: Track Alliance Edit
Admin updates alliance name → Logged:
```
User: Manager One (id: 2)
Action: UPDATE
Target: alliance #3
Details: Updated alliance: name: Old Name -> New Name; leader: Old Leader -> New Leader
Timestamp: 2025-01-15 11:00:00
IP: 192.168.1.101
```

### Example 3: Track Resource Contribution
Member adds resources → Logged:
```
User: Admin (id: 1)
Action: CREATE
Target: resource #42
Details: Added contribution: food: 5000000, wood: 3000000, stone: 2000000, gold: 1000000
Timestamp: 2025-01-15 11:15:30
IP: 192.168.1.100
```

---

## Maintenance

### Cleanup Old Logs
Jalankan scheduled task untuk hapus logs lama (> 90 hari):

```javascript
// Di backend/scripts atau cron job
const AuditLogger = require("../utils/auditLogger");

setInterval(async () => {
  console.log("Running audit log cleanup...");
  
  // Delete logs older than 90 days
  await Database.query(
    `DELETE FROM audit_logs 
     WHERE timestamp < DATE_SUB(NOW(), INTERVAL 90 DAY)`
  );
  
  console.log("Audit log cleanup completed");
}, 24 * 60 * 60 * 1000); // Daily
```

### Query Examples

**Get all deletions today**
```sql
SELECT * FROM audit_logs 
WHERE action = 'DELETE' AND DATE(timestamp) = CURDATE()
ORDER BY timestamp DESC;
```

**Get all changes by specific user**
```sql
SELECT * FROM audit_logs 
WHERE user_id = 1 
ORDER BY timestamp DESC 
LIMIT 50;
```

**Get changes to specific alliance**
```sql
SELECT * FROM audit_logs 
WHERE target_type = 'alliance' AND target_id = 5
ORDER BY timestamp DESC;
```

**Count by action this week**
```sql
SELECT action, COUNT(*) as count
FROM audit_logs 
WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY action;
```

---

## Security Notes

1. ✅ Only Admin and R5 roles can view audit logs
2. ✅ IP address dan user agent tercatat untuk tracking
3. ✅ Audit logs tidak bisa didelete oleh non-admin
4. ✅ Semua perubahan tercatat lengkap dengan detail
5. ✅ Retention policy: logs otomatis dihapus setelah 90 hari

---

## Checklist Setup

- [ ] Run `node scripts/setupAuditLogs.js` untuk create table
- [ ] Register routes di backend index.js
- [ ] Import AuditLogger di setiap controller yang perlu logging
- [ ] Add logging calls di CreateUser, UpdateUser, DeleteUser, etc.
- [ ] Test audit log creation via admin panel
- [ ] Verify filters working correctly
- [ ] Test export CSV functionality
- [ ] Setup retention policy (optional)
