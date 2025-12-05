# AuthController Update Summary

## Changes Made (December 6, 2025)

### Issue
Login error: `Unknown column 'fullname' in 'field list'`

**Root Cause:** AuthController was using old User model (`userModel.js`) with `fullname` field, but database table has new structure with `name` field.

### Fixes Applied

#### 1. Updated Model Import
**Old:**
```javascript
const { User } = await import("../../models/userModel.js");
```

**New:**
```javascript
const { User } = await import("../../models/index.js");
```

#### 2. Updated Field Names
| Old Field | New Field | Usage |
|-----------|-----------|-------|
| `fullname` | `name` | User's name |
| `user_id` (PK) | `id` (PK) | Primary key for session |
| `is_active` | `status` | Account status |
| `phone` | ❌ Removed | Not in SF BANK structure |
| `profile_picture` | ❌ Removed | Not in SF BANK structure |
| ❌ Not exists | `alliance_id` | Alliance membership |
| ❌ Not exists | `joined_date` | Join date |

#### 3. Updated Session Handling
**Old:**
```javascript
req.session.user_id = newUser.user_id; // Using user_id (VARCHAR)
```

**New:**
```javascript
req.session.user_id = user.id; // Using id (INT) as primary key
```

#### 4. Updated Register Endpoint
**Old Request Body:**
```json
{
  "fullname": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "staff",
  "phone": "+123456789"
}
```

**New Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "R5",
  "user_id": "USR001",
  "alliance_id": 1
}
```

#### 5. Updated Me Endpoint Attributes
**Old:**
```javascript
attributes: ['user_id', 'fullname', 'email', 'role', 'phone', 'profile_picture']
```

**New:**
```javascript
attributes: ['id', 'user_id', 'name', 'email', 'role', 'alliance_id', 'status', 'joined_date']
```

### API Changes

#### Login (POST `/api/shared/login`)
**Request:** (No changes)
```json
{
  "email": "admin@gmail.com",
  "password": "your_password"
}
```

**Response:** (Updated structure)
```json
{
  "msg": "Login successful",
  "user": {
    "id": 1,
    "user_id": "ADM001",
    "name": "Administrator",
    "email": "admin@gmail.com",
    "role": "Admin",
    "alliance_id": null,
    "status": "Active",
    "joined_date": "2025-12-06",
    "last_login": null
  }
}
```

#### Register (POST `/api/shared/register`)
**Request:** (Updated)
```json
{
  "name": "New User",
  "email": "user@example.com",
  "password": "password123",
  "role": "R5",
  "user_id": "USR002",
  "alliance_id": 1
}
```

#### Me (GET `/api/shared/me`)
**Response:** (Updated structure)
```json
{
  "id": 1,
  "user_id": "ADM001",
  "name": "Administrator",
  "email": "admin@gmail.com",
  "role": "Admin",
  "alliance_id": null,
  "status": "Active",
  "joined_date": "2025-12-06",
  "created_at": "2025-12-06T10:00:00.000Z",
  "updated_at": "2025-12-06T10:00:00.000Z"
}
```

### Testing

#### Test Admin Login
```bash
curl -X POST http://localhost:5000/api/shared/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@gmail.com",
    "password": "admin123"
  }'
```

#### Test Session
```bash
curl -X GET http://localhost:5000/api/shared/me \
  -H "Cookie: iot.session.id=YOUR_SESSION_COOKIE"
```

### Database Structure
```sql
-- New users table structure
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  password VARCHAR(255),
  role ENUM('Admin', 'R1', 'R2', 'R3', 'R4', 'R5') DEFAULT 'R5',
  alliance_id INT,
  status ENUM('Active', 'Inactive') DEFAULT 'Active',
  joined_date DATE,
  last_login DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (alliance_id) REFERENCES alliances(id)
);
```

### Migration Notes

1. **Old controllers** still importing `userModel.js` will fail
2. **Session data** uses `id` (INT) instead of `user_id` (VARCHAR)
3. **Role values** changed from `staff/admin/auditor` to `Admin/R1/R2/R3/R4/R5`
4. **Status field** changed from boolean `is_active` to enum `status`

### Next Steps

✅ AuthController updated  
⬜ Update other controllers to use new models  
⬜ Update middleware/AuthUser.js  
⬜ Update userManagementController.js  
⬜ Test all auth endpoints  
⬜ Update frontend API calls  

---

**Status:** ✅ Fixed  
**Date:** December 6, 2025  
**Files Modified:** `backend/controllers/shared/authController.js`
