# SF BANK Frontend-Backend Integration Guide

## Overview
This document details the complete integration between the SF BANK React frontend and Node.js/Express backend for user management functionality.

---

## Architecture

### Frontend
- **Framework:** React with Tailwind CSS
- **Service Layer:** `/frontend/src/services/userService.js` - Centralized API client
- **Component:** `/frontend/src/views/admin/UserManagement.jsx` - Admin UI for user CRUD operations
- **API Base URL:** `http://localhost:5000` (configurable via REACT_APP_API_BASE_URL)

### Backend
- **Framework:** Node.js + Express
- **ORM:** Sequelize v6+ with MySQL database
- **Models:** User, Alliance, AuditLog
- **Routes:** `/api/v1/users` - RESTful user management endpoints
- **Middleware:** Authentication (JWT/Session) + Role-based Authorization
- **Port:** `5000` (default)

---

## Database Models

### User Model (`/backend/models/userModelNew.js`)
```javascript
{
  id: INTEGER (Primary Key, Auto-increment)
  user_id: STRING (Unique) - e.g., "ADM001", "R1_001"
  name: STRING
  email: STRING (Unique)
  password: STRING (Argon2 hashed)
  role: ENUM ['Admin', 'R1', 'R2', 'R3', 'R4', 'R5']
  status: ENUM ['Active', 'Inactive']
  alliance_id: INTEGER (Foreign Key to Alliance)
  last_login: DATETIME
  createdAt: DATETIME
  updatedAt: DATETIME
}
```

### Relationships
- User → Alliance (Many-to-One)
- User → AuditLog (One-to-Many)

---

## API Endpoints

### Base Path
All endpoints are prefixed with `/api/v1/users`

### Endpoints

#### 1. Get All Users (with pagination & filters)
```
GET /api/v1/users
Query Parameters:
  - page: number (default: 1)
  - limit: number (default: 10)
  - role: string (All | Admin | R1-R5)
  - status: string (All | Active | Inactive)
  - alliance_id: number

Response:
{
  "success": true,
  "data": [...users],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10
  }
}
```

#### 2. Get User by ID
```
GET /api/v1/users/:id
Response:
{
  "success": true,
  "data": { user object }
}
```

#### 3. Create New User
```
POST /api/v1/users
Body:
{
  "user_id": "ADM002",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "R1",
  "alliance_id": 1 (optional)
}

Response:
{
  "success": true,
  "message": "User created successfully",
  "data": { created user object }
}
```

#### 4. Update User
```
PUT /api/v1/users/:id
Body:
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "alliance_id": 2
}
```

#### 5. Update User Role
```
PUT /api/v1/users/:id/role
Body:
{
  "role": "R2"
}
```

#### 6. Change User Status
```
PUT /api/v1/users/:id/status
Body:
{
  "status": "Active" | "Inactive"
}
```

#### 7. Reset User Password
```
PUT /api/v1/users/:id/password
Body:
{
  "newPassword": "NewPassword123!"
}
```

#### 8. Delete User
```
DELETE /api/v1/users/:id
```

#### 9. Search Users
```
GET /api/v1/users/search
Query Parameters:
  - query: string (minimum 2 characters)
  - role: string (optional)
  - alliance_id: number (optional)
  - page: number (default: 1)
  - limit: number (default: 10)
```

#### 10. Get Users by Role
```
GET /api/v1/users/role/:role
Query Parameters:
  - page: number (default: 1)
  - limit: number (default: 10)
```

#### 11. Get User Statistics
```
GET /api/v1/users/stats
Response:
{
  "success": true,
  "data": {
    "totalUsers": 50,
    "activeUsers": 45,
    "inactiveUsers": 5,
    "inactivePercentage": "10.00",
    "byRole": {
      "Admin": 5,
      "R1": 15,
      "R2": 10,
      "R3": 12,
      "R4": 5,
      "R5": 3
    }
  }
}
```

---

## Frontend Integration

### API Service (`userService.js`)
The service provides 12 methods for API interaction:

```javascript
import userService from '../services/userService';

// Get all users
const users = await userService.getAllUsers({ page: 1, limit: 10 });

// Search users
const results = await userService.searchUsers('john', { role: 'R1' });

// Get user stats
const stats = await userService.getUserStats();

// Create user
await userService.createUser({ user_id: 'R1_001', name: 'John', email: 'john@email.com', role: 'R1' });

// Update user
await userService.updateUser(userId, { name: 'John Doe' });

// Update role
await userService.updateUserRole(userId, 'R2');

// Change status
await userService.changeUserStatus(userId, 'Inactive');

// Reset password
await userService.resetUserPassword(userId, 'NewPassword123!');

// Delete user
await userService.deleteUser(userId);
```

### Component Integration (`UserManagement.jsx`)

The component implements:
- ✅ Loading states with spinner
- ✅ Error handling with retry
- ✅ Search/filter functionality
- ✅ Pagination
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Role-based color coding
- ✅ Edit panel with form validation
- ✅ Create panel for new users
- ✅ Action buttons (Edit, Delete, Status toggle)

#### Component Features:
```jsx
// State Management
- users: array of user objects
- loading: boolean
- error: error message or null
- searchQuery: search input
- roleFilter: role filter selection
- currentPage: pagination
- pageSize: items per page

// Async Functions
- fetchUsers(): Load users from backend
- submitEditForm(): Update user
- submitCreateForm(): Create new user
- deleteUser(): Delete user
- openEditPanel(): Show edit form
- closeEditPanel(): Hide edit form

// UI Sections
- Statistics Cards: Total, Active, Inactive, By Role
- Search & Filter: Dynamic filtering
- User Table: Sortable, paginated user list
- Edit Panel: Slide-in form for editing
- Create Panel: Slide-in form for creating new users
```

---

## Authentication Flow

### Session-Based Authentication
1. User logs in via `/api/shared/auth/login`
2. Backend creates session with user object
3. Session stored in database via SequelizeStore
4. Cookie sent to client with session ID
5. For protected routes, middleware verifies:
   - Session exists
   - User in database
   - User has 'Active' status
   - User has required role

### Protected Route Example
```javascript
// In route file:
router.use(authenticate); // Verify logged in
router.use(authorize(['Admin'])); // Verify Admin role
router.get('/', userManagementController.getAllUsers);

// In controller:
// req.user contains the authenticated user object
console.log(req.user.id, req.user.role);
```

---

## Audit Logging

All admin actions are logged automatically via `auditLogger.js`:

### Logged Actions
- CREATE: User creation
- UPDATE: User information, role, status, password
- DELETE: User deletion

### Audit Log Schema
```javascript
{
  user_id: INTEGER (Admin who performed action)
  action: ENUM ['CREATE', 'UPDATE', 'DELETE']
  target_type: ENUM ['user', 'alliance', 'bank', 'resource']
  target_id: INTEGER (ID of modified record)
  details: LONGTEXT (JSON of changes)
  ip_address: STRING
  user_agent: STRING
  createdAt: DATETIME
}
```

### Example Audit Entry
```javascript
{
  user_id: 1,
  action: 'CREATE',
  target_type: 'user',
  target_id: 42,
  details: JSON.stringify({
    user_id: 'R1_001',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'R1',
    message: 'New user created'
  }),
  ip_address: '192.168.1.100',
  user_agent: 'Mozilla/5.0...'
}
```

---

## Error Handling

### Frontend Error Display
- Red alert box with error message
- "Try again" button to retry the operation
- Loading state disabled during errors

### Backend Error Responses
```javascript
// Validation error
{
  "success": false,
  "message": "Missing required fields: user_id, name, email, role",
  "error": "..."
}

// Conflict error
{
  "success": false,
  "message": "User ID already exists"
}

// Not found error
{
  "success": false,
  "message": "User not found"
}

// Server error
{
  "success": false,
  "message": "Failed to fetch users",
  "error": "Internal server error"
}
```

---

## Testing Checklist

### Setup
- [ ] Backend running on `localhost:5000`
- [ ] Frontend running on `localhost:3001`
- [ ] Database tables created
- [ ] Admin user exists
- [ ] CORS configured correctly

### Frontend Tests
- [ ] Users load on component mount
- [ ] Search filter works with 2+ characters
- [ ] Role filter shows correct users
- [ ] Pagination loads correct page
- [ ] Edit panel opens with user data
- [ ] Update user saves changes
- [ ] Create panel opens with empty form
- [ ] Create user adds to list
- [ ] Delete button shows confirmation
- [ ] Status toggle works
- [ ] Error messages display on failure

### Backend Tests
- [ ] GET /api/v1/users returns paginated list
- [ ] POST /api/v1/users creates user with audit log
- [ ] PUT /api/v1/users/:id updates user
- [ ] DELETE /api/v1/users/:id deletes user with audit log
- [ ] Unauthorized requests rejected (401/403)
- [ ] Invalid data rejected with validation error
- [ ] Duplicate user_id/email rejected (409)
- [ ] Search finds users by name/email/user_id
- [ ] Statistics calculate correctly
- [ ] Password reset works with hashing

### Integration Tests
- [ ] Login → Navigate to UserManagement → See users
- [ ] Create user → Verify in database → Appears in list
- [ ] Edit user → Verify changes in database
- [ ] Delete user → Verify removed from list and database
- [ ] Check audit log for all actions

---

## Environment Configuration

### Backend (.env)
```
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=kingdom3946
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:3001
SESS_SECRET=your_session_secret
SESSION_TABLE_NAME=Sessions
SESSION_MAX_AGE=86400000
SESSION_CLEANUP_INTERVAL=900000
```

### Frontend (.env.local)
```
REACT_APP_API_BASE_URL=http://localhost:5000
REACT_APP_API_URL=http://localhost:5000
REACT_APP_NAME=Kingdom 3946
```

---

## File Structure

```
backend/
├── config/
│   └── Database.js
├── controllers/
│   └── administrator/
│       └── userManagementController.js
├── middleware/
│   └── AuthUser.js
├── models/
│   ├── index.js (exports all models with associations)
│   ├── userModelNew.js
│   ├── allianceModel.js
│   ├── allianceBankModel.js
│   ├── memberContributionModel.js
│   └── auditLogModel.js
├── routes/
│   └── administrator/
│       └── userManagementRoutes.js
├── utils/
│   └── auditLogger.js
└── index.js

frontend/
├── src/
│   ├── services/
│   │   └── userService.js
│   └── views/
│       └── admin/
│           └── UserManagement.jsx
```

---

## Troubleshooting

### Issue: "User not authenticated" error
**Solution:** Ensure user is logged in and session is valid. Check browser cookies.

### Issue: "Cannot read property 'id' of undefined"
**Solution:** Backend may not be running or models not initialized. Check server logs.

### Issue: CORS errors
**Solution:** Verify `CLIENT_ORIGIN` in backend .env matches frontend URL.

### Issue: Passwords not hashing
**Solution:** Check Argon2 package installed. Run `npm install argon2`.

### Issue: Audit log not recording
**Solution:** Verify AuditLog model imported in models/index.js and middleware properly attached.

---

## Performance Optimization

### Frontend
- ✅ Pagination limits data per load
- ✅ Search debouncing (add if needed)
- ✅ Loading states prevent duplicate requests

### Backend
- ✅ Database indexes on user_id, email, role, status
- ✅ Selective attributes exclude passwords
- ✅ Proper pagination with LIMIT/OFFSET
- ✅ Connection pooling via Sequelize

---

## Security Considerations

### Implemented
- ✅ Role-based access control (RBAC)
- ✅ Password hashing with Argon2
- ✅ Session-based authentication
- ✅ CORS protection
- ✅ Audit logging for all admin actions
- ✅ Input validation on all endpoints

### Recommended
- [ ] Add rate limiting
- [ ] Add request timeout
- [ ] Add SQL injection prevention (use Sequelize params)
- [ ] Add XSS prevention headers
- [ ] Add HTTPS in production

---

## Support & Maintenance

### Regular Tasks
1. Monitor audit logs for suspicious activities
2. Clean up old sessions via `session_cleanup.sh`
3. Backup database regularly
4. Update dependencies monthly

### Emergency Procedures
- If database corrupted: Run `backend/scripts/dropSFBankTables.js` then `databaseSetup.js`
- If session issues: Clear Sessions table
- If user locked out: Use admin panel to reset status/password

---

## API Reference Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/v1/users | Admin | List all users |
| GET | /api/v1/users/:id | Admin | Get specific user |
| GET | /api/v1/users/stats | Admin | User statistics |
| GET | /api/v1/users/search | Admin | Search users |
| GET | /api/v1/users/role/:role | Admin | Get users by role |
| POST | /api/v1/users | Admin | Create user |
| PUT | /api/v1/users/:id | Admin | Update user |
| PUT | /api/v1/users/:id/role | Admin | Change role |
| PUT | /api/v1/users/:id/status | Admin | Change status |
| PUT | /api/v1/users/:id/password | Admin | Reset password |
| DELETE | /api/v1/users/:id | Admin | Delete user |

---

**Last Updated:** January 2024
**Version:** 1.0
**Status:** Production Ready
