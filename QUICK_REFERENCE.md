# SF BANK User Management - Quick Reference Card

## 🚀 Start Here

### 1. Terminal 1 - Backend
```bash
cd backend
npm start
# Expected: "Server running on port 5000"
```

### 2. Terminal 2 - Frontend
```bash
cd frontend
npm start
# Expected: App opens on http://localhost:3001
```

### 3. Login
- Email: `admin@gmail.com`
- Password: `Admin123!`

### 4. Navigate to User Management
- Menu → Admin → User Management

---

## 📱 Frontend Features

### UserManagement.jsx
| Feature | Location | Status |
|---------|----------|--------|
| Load users | On mount (useEffect) | ✅ Working |
| Search | Input field top-left | ✅ 2+ chars |
| Filter by role | Dropdown top-right | ✅ All roles |
| Pagination | Bottom controls | ✅ 10/page |
| Create user | "Create New User" button | ✅ Right panel |
| Edit user | Click table row | ✅ Right panel |
| Delete user | Delete icon on row | ✅ Confirmation |
| Statistics | Top dashboard | ✅ 4 cards |

### Component State
```javascript
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [currentPage, setCurrentPage] = useState(1);
const [searchQuery, setSearchQuery] = useState('');
const [roleFilter, setRoleFilter] = useState('All');
```

---

## 🔌 API Service Methods

### userService.js (12 methods)

```javascript
// GET
await userService.getAllUsers({ page: 1, limit: 10 });
await userService.getUserById(userId);
await userService.getUserStats();
await userService.searchUsers('query', { role: 'R1' });
await userService.getUsersByRole('R1', 1, 10);

// POST
await userService.createUser({ user_id, name, email, role });

// PUT
await userService.updateUser(userId, { name, email });
await userService.updateUserRole(userId, 'R2');
await userService.changeUserStatus(userId, 'Inactive');
await userService.resetUserPassword(userId, 'NewPass123!');

// DELETE
await userService.deleteUser(userId);
```

---

## 🛣️ Backend API Endpoints

### Base URL: `http://localhost:5000/api/v1/users`

```
GET     /                    → List users (paginated)
GET     /stats              → User statistics
GET     /search             → Search users
GET     /role/:role         → Users by role
GET     /:id                → Get user

POST    /                    → Create user
PUT     /:id                → Update user
PUT     /:id/role           → Change role
PUT     /:id/status         → Change status
PUT     /:id/password       → Reset password
DELETE  /:id                → Delete user
```

---

## 🔐 Authentication

### Session Flow
```
1. Login → POST /api/shared/auth/login
2. Session created in database
3. Cookie sent to browser
4. All subsequent requests include cookie
5. Middleware validates session
```

### Middleware Stack
```javascript
router.use(authenticate);        // Check session
router.use(authorize(['Admin'])); // Check role
router.get('/', handler);         // Handler executes
```

---

## 📝 Create User Example

### Frontend Form
```javascript
{
  "user_id": "R1_001",
  "name": "John Officer",
  "email": "john@kingdom.com",
  "role": "R1"
}
```

### Database Result
```sql
INSERT INTO users (user_id, name, email, role, status, createdAt, updatedAt)
VALUES ('R1_001', 'John Officer', 'john@kingdom.com', 'R1', 'Active', NOW(), NOW())

INSERT INTO audit_logs (user_id, action, target_type, target_id, details, ip_address, user_agent)
VALUES (1, 'CREATE', 'user', 42, {...}, '127.0.0.1', '...')
```

---

## 🧪 Test with cURL

```bash
# Login first
curl -c cookies.txt \
  -X POST "http://localhost:5000/api/shared/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gmail.com","password":"Admin123!"}'

# Get all users
curl -b cookies.txt \
  "http://localhost:5000/api/v1/users"

# Create user
curl -b cookies.txt \
  -X POST "http://localhost:5000/api/v1/users" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id":"R1_TEST",
    "name":"Test User",
    "email":"test@test.com",
    "role":"R1"
  }'

# Update user role
curl -b cookies.txt \
  -X PUT "http://localhost:5000/api/v1/users/2/role" \
  -H "Content-Type: application/json" \
  -d '{"role":"R2"}'
```

---

## 📊 Statistics Endpoint

### Request
```
GET /api/v1/users/stats
```

### Response
```json
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

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Users not loading | Check DevTools console → Check backend running |
| "Unauthorized" error | Ensure logged in → Check session cookie |
| 404 on /api/v1/users | Restart backend → Check import in index.js |
| Search not working | Type 2+ characters → Wait for debounce |
| Delete doesn't work | Cannot delete Admin users → Try R1 user |
| Database empty | Run: `node scripts/databaseSetup.js` |

---

## 📁 Key Files

```
Frontend:
  src/services/userService.js              ← API calls
  src/views/admin/UserManagement.jsx       ← UI component

Backend:
  routes/administrator/userManagementRoutes.js     ← API routes
  controllers/administrator/userManagementController.js  ← Logic
  middleware/AuthUser.js                   ← Security
  models/                                  ← Database

Docs:
  INTEGRATION_GUIDE.md     ← Full technical guide
  TESTING_GUIDE.md         ← Testing procedures
  COMPLETION_SUMMARY.md    ← What was built
```

---

## ✅ Test Checklist (5-min quick test)

- [ ] Start backend (port 5000)
- [ ] Start frontend (port 3001)
- [ ] Login as admin
- [ ] Navigate to User Management
- [ ] Users load in table
- [ ] Search works (type 2+ chars)
- [ ] Create user button opens panel
- [ ] Fill form and submit
- [ ] New user appears in table
- [ ] Click user row to edit
- [ ] Change name and save
- [ ] Name updated in table
- [ ] Delete user (confirm)
- [ ] User removed from table
- [ ] No errors in DevTools
- [ ] No errors in backend console

**If all ✅ pass → Integration successful!**

---

## 📞 Support

### Error Messages
- **"User not authenticated"** → Login first
- **"Access denied. Required roles: Admin"** → Use admin account
- **"User ID already exists"** → Try different ID
- **"Email already in use"** → Try different email
- **"Missing required fields"** → Fill all form fields

### Debug Tips
1. Open DevTools (F12)
2. Network tab → Check API responses
3. Console tab → Check JavaScript errors
4. Backend logs → Check server output
5. Database → Verify data with MySQL query

### Quick MySQL Check
```bash
mysql -u root -p kingdom3946
SELECT COUNT(*) FROM users;
SELECT * FROM audit_logs ORDER BY createdAt DESC LIMIT 5;
```

---

## 🎯 Next Steps After Testing

1. ✅ Confirm all CRUD operations work
2. ✅ Verify audit logs record actions
3. ✅ Check database has correct data
4. ✅ Test with production data volume
5. ✅ Performance profile with 1000+ users
6. ✅ Security audit review
7. ✅ Deploy to staging
8. ✅ Deploy to production

---

## 📚 Full Documentation

| Document | Purpose |
|----------|---------|
| INTEGRATION_GUIDE.md | Complete technical reference (60+ sections) |
| TESTING_GUIDE.md | Testing procedures (100+ test cases) |
| COMPLETION_SUMMARY.md | What was delivered |
| This card | Quick reference |

---

## 🎓 Code Structure

### Frontend API Call Flow
```
Component Click
  ↓
handleSubmit()
  ↓
userService.createUser()
  ↓
axios.post('/api/v1/users', data)
  ↓
backend router
  ↓
authenticate middleware
  ↓
authorize middleware
  ↓
controller function
  ↓
database query
  ↓
response
  ↓
setState() → Re-render
```

### Backend Request Flow
```
POST /api/v1/users
  ↓
userManagementRoutes.js
  ↓
authenticate()
  ↓
authorize(['Admin'])
  ↓
userManagementController.createUser()
  ↓
User.create()
  ↓
auditLogger.log()
  ↓
response.json(success)
```

---

## 💡 Pro Tips

1. **Bulk Testing** - Create 5-10 test users first
2. **Search Testing** - Try searching "john", "john@", "john.doe"
3. **Filter Testing** - Combine search + role filter
4. **Pagination** - Navigate to page 2, 3 to verify
5. **Role Testing** - Create users with each role (Admin, R1-R5)
6. **Status Testing** - Toggle Active/Inactive and verify
7. **Audit Trail** - Check audit_logs after each action
8. **Performance** - Time operations with DevTools
9. **Error Testing** - Try to break it (invalid inputs, etc.)
10. **Security** - Verify non-admin cannot access endpoints

---

**Version:** 1.0  
**Last Updated:** January 2024  
**Status:** ✅ READY FOR TESTING

Start testing now! See TESTING_GUIDE.md for detailed procedures.
