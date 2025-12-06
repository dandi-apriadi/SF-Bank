# SF BANK User Management - Quick Start Testing Guide

## Prerequisites
- Node.js v14+ installed
- MySQL database running
- Backend and Frontend installed

## 1. Backend Setup

### Start Backend Server
```bash
cd backend
npm install
# Setup database
node scripts/databaseSetup.js
# Start server
npm start
# or
node index.js
```

Expected output:
```
🚀 Server running on port 5000 | Env: development | CORS: http://localhost:3001
Database connection has been established successfully.
Database initialized successfully.
```

### Verify Backend is Running
```bash
curl http://localhost:5000/health
```

---

## 2. Frontend Setup

### Start Frontend
```bash
cd frontend
npm install
npm start
```

Expected: App opens at `http://localhost:3001`

---

## 3. Login to Admin Panel

1. Open browser to `http://localhost:3001`
2. Navigate to Login page
3. Use credentials:
   - **Email:** admin@gmail.com
   - **Password:** Admin123! (or the password you inserted)

---

## 4. Test User Management

### Location
Admin Panel → User Management (menu)

### Test Scenarios

#### 1. View Users ✓
- [ ] Page loads with loading spinner
- [ ] Users table displays
- [ ] Pagination shows 10 users per page
- [ ] Statistics show correct counts

#### 2. Search Users ✓
- [ ] Type in search box (minimum 2 chars)
- [ ] Table filters by name/email/user_id
- [ ] Search with special chars works
- [ ] Empty search shows all users

#### 3. Filter by Role ✓
- [ ] Select "All Roles" shows all users
- [ ] Select "Admin" shows only Admin users
- [ ] Select "R1", "R2", etc. filters correctly
- [ ] Combine search + filter works

#### 4. Pagination ✓
- [ ] Previous/Next buttons work
- [ ] Go to page 2, 3, etc.
- [ ] Disabled buttons on first/last page
- [ ] Page counter updates

#### 5. Create User ✓
- [ ] Click "Create New User" button
- [ ] Form opens on right panel
- [ ] Fill in fields:
  - User ID: R1_001
  - Name: Test User
  - Email: test@example.com
  - Role: R1
- [ ] Click "Create User"
- [ ] Success message appears
- [ ] User added to table

#### 6. Edit User ✓
- [ ] Click user row to open edit panel
- [ ] Edit panel shows current values
- [ ] Change name and save
- [ ] Updated values appear in table
- [ ] Changes reflected in database

#### 7. Change User Role ✓
- [ ] Edit user panel
- [ ] Change role from R1 to R2
- [ ] Save changes
- [ ] Role updated in table
- [ ] Audit log recorded

#### 8. Change User Status ✓
- [ ] Edit user panel
- [ ] Change status Active → Inactive
- [ ] Save changes
- [ ] Status badge updates color
- [ ] Inactive user grayed out

#### 9. Delete User ✓
- [ ] Click delete icon on user row
- [ ] Confirmation dialog appears
- [ ] Click "Delete" to confirm
- [ ] User removed from table
- [ ] User no longer in database

#### 10. Error Handling ✓
- [ ] Try duplicate user_id → Error shown
- [ ] Try invalid email format → Error shown
- [ ] Try missing required fields → Error shown
- [ ] Network error → Red error box with retry button

---

## 5. Database Verification

### Check Users Table
```bash
mysql -u root -p -e "SELECT id, user_id, name, email, role, status FROM kingdom3946.users;"
```

Expected output:
```
+----+---------+---------------+-----------------------+-------+--------+
| id | user_id | name          | email                 | role  | status |
+----+---------+---------------+-----------------------+-------+--------+
|  1 | ADM001  | Administrator | admin@gmail.com       | Admin | Active |
|  2 | R1_001  | Test User     | test@example.com      | R1    | Active |
|  3 | R1_002  | Another User  | another@example.com   | R2    | Active |
+----+---------+---------------+-----------------------+-------+--------+
```

### Check Audit Log
```bash
mysql -u root -p -e "SELECT user_id, action, target_type, target_id, created_at FROM kingdom3946.audit_logs ORDER BY created_at DESC LIMIT 10;"
```

Expected: Shows all CREATE, UPDATE, DELETE actions

---

## 6. API Testing

### Using cURL

#### Get All Users
```bash
curl -X GET "http://localhost:5000/api/v1/users?page=1&limit=10" \
  -H "Content-Type: application/json" \
  -c cookies.txt
```

#### Create User
```bash
curl -X POST "http://localhost:5000/api/v1/users" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "user_id": "R1_TEST",
    "name": "API Test User",
    "email": "apitest@example.com",
    "role": "R1"
  }'
```

#### Update User Role
```bash
curl -X PUT "http://localhost:5000/api/v1/users/2/role" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"role": "R2"}'
```

#### Delete User
```bash
curl -X DELETE "http://localhost:5000/api/v1/users/2" \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

### Using Postman

1. Import collection from backend docs
2. Set Base URL: `http://localhost:5000`
3. Login first to get session cookie
4. Test each endpoint

---

## 7. Troubleshooting

### Issue: "Cannot GET /api/v1/users"
**Solution:** Ensure backend running on port 5000 and user management routes loaded

### Issue: "401 Unauthorized"
**Solution:** Log in first, ensure session cookie valid

### Issue: "Users not loading"
**Check:**
- Frontend console for errors (F12)
- Backend console for error logs
- Network tab in DevTools to see API response
- CORS configuration in .env

### Issue: Database connection error
**Solution:**
```bash
# Check MySQL running
sudo service mysql status

# Reset database
node backend/scripts/dropSFBankTables.js
node backend/scripts/databaseSetup.js
node backend/scripts/seedSFBankData.js
```

### Issue: "node: not found"
**Solution:** Ensure Node.js installed: `node --version`

---

## 8. Performance Testing

### Load Users with Pagination
- [ ] Load page 1 (10 users) - Fast
- [ ] Load page 10 (100 users) - Reasonable
- [ ] Search 50 users - Sub-second

### Memory Usage
- [ ] Check memory before/after operations
- [ ] No memory leaks on repeated operations

### CPU Usage
- [ ] Search doesn't spike CPU
- [ ] Pagination doesn't spike CPU

---

## 9. Security Testing

### Test Role-Based Access
- [ ] Regular user cannot access /api/v1/users
- [ ] Only Admin can create/edit/delete users
- [ ] R1-R5 users see limited permissions

### Test Session Security
- [ ] Session expires after max age
- [ ] Closing browser clears session
- [ ] Invalid session rejected

### Test Input Validation
- [ ] SQL injection attempts rejected
- [ ] XSS attempts sanitized
- [ ] Invalid data types rejected

---

## 10. Final Checklist

### Frontend ✓
- [ ] Component loads without errors
- [ ] All CRUD operations work
- [ ] Search/filter functional
- [ ] Pagination working
- [ ] Error handling displays errors
- [ ] Loading states show spinners
- [ ] Responsive design mobile-friendly

### Backend ✓
- [ ] All 11 endpoints respond correctly
- [ ] Authentication middleware working
- [ ] Authorization checks role
- [ ] Audit logging records actions
- [ ] Error responses consistent format
- [ ] Database transactions atomic
- [ ] No SQL injection vulnerabilities

### Database ✓
- [ ] Tables created with correct schema
- [ ] Foreign keys enforced
- [ ] Indexes created for performance
- [ ] Data persists correctly
- [ ] Audit log records all changes

### Integration ✓
- [ ] Frontend → Backend communication working
- [ ] Session/cookies managed correctly
- [ ] Error handling end-to-end
- [ ] Performance acceptable

---

## Test Data

### Admin User (Pre-seeded)
```
User ID: ADM001
Name: Administrator
Email: admin@gmail.com
Password: Admin123! (Argon2 hashed)
Role: Admin
Status: Active
```

### Sample Users (Create for testing)
```
1. User ID: R1_001, Name: Officer One, Email: r1_001@example.com, Role: R1
2. User ID: R1_002, Name: Officer Two, Email: r1_002@example.com, Role: R1
3. User ID: R2_001, Name: Officer Three, Email: r2_001@example.com, Role: R2
4. User ID: R3_001, Name: Officer Four, Email: r3_001@example.com, Role: R3
5. User ID: R4_001, Name: Officer Five, Email: r4_001@example.com, Role: R4
```

---

## Success Criteria

All tests passed when:
1. ✅ Users load from database correctly
2. ✅ Search/filter working with live updates
3. ✅ Create user adds to database
4. ✅ Edit user updates database
5. ✅ Delete user removes from database
6. ✅ All actions logged in audit_logs
7. ✅ Error messages display correctly
8. ✅ Pagination navigates through records
9. ✅ Statistics calculate accurately
10. ✅ Role-based access enforced
11. ✅ Performance acceptable (< 1s per operation)
12. ✅ No errors in console (frontend or backend)

---

## Next Steps

Once all tests pass:
1. Deploy to staging environment
2. Perform UAT with business users
3. Security audit review
4. Performance profiling with production data
5. Deploy to production

---

**Last Updated:** January 2024
**Version:** 1.0
**Status:** Ready for Testing
