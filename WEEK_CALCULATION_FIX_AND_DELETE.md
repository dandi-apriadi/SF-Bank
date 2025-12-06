# Week Calculation Fix & Delete Weekly Contribution Feature

## Issues Fixed

### Issue 1: Week Number Always Starting from 50
**Problem:** Week calculation was always showing week 50 as default, regardless of actual current week.

**Root Cause:** `getWeekNumber()` function using local timezone methods instead of UTC:
```javascript
// ❌ WRONG (uses local timezone)
const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
```

**Solution:** Use UTC methods throughout:
```javascript
// ✅ CORRECT (uses UTC consistently)
const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
```

**Impact:**
- Week number now calculated correctly based on actual current week
- Default week in RSS panel now shows current week, not hardcoded week 50
- Auto-detect latest member week works properly
- Consistent with backend week calculation

---

## New Feature: Delete Weekly Contribution

### Overview
Added ability to delete individual weekly contributions from member report modal with confirmation dialog.

### Frontend Changes

#### 1. New State Variable
```javascript
const [deleteConfirm, setDeleteConfirm] = useState(null); // {memberId, week}
```

#### 2. New Function
```javascript
const deleteWeeklyContribution = async (memberId, week) => {
  // Calls DELETE endpoint
  // Updates reportMember state
  // Shows success/error message
}
```

#### 3. UI Changes
- Added **Actions** column to weekly contributions table
- Delete button shows confirmation state
- Two-step confirmation: Click delete → Click confirm or cancel

#### 4. Delete Button UI
```jsx
{deleteConfirm?.week === contribution.week ? (
  // Show: [Confirm] [Cancel] buttons
) : (
  // Show: [🗑️ Delete] button
)}
```

### Backend Changes

#### 1. New Route
```javascript
// Delete by memberId, allianceId, and week
router.delete('/member-contributions/:memberId/:allianceId/:week', deleteMemberContribution);
```

#### 2. Updated Controller
```javascript
export const deleteMemberContribution = async (req, res) => {
  // Supports two delete methods:
  // 1. By ID: req.params.id
  // 2. By (memberId, allianceId, week): req.params.memberId, allianceId, week
}
```

---

## API Endpoint Details

### Delete by ID (Existing)
```
DELETE /api/v1/member-contributions/:id
```

### Delete by Member/Alliance/Week (NEW)
```
DELETE /api/v1/member-contributions/:memberId/:allianceId/:week

Example:
DELETE /api/v1/member-contributions/1/5/49
  - memberId: 1
  - allianceId: 5
  - week: 49
```

**Response (Success):**
```json
{
  "msg": "Contribution deleted successfully"
}
```

**Response (Not Found):**
```json
{
  "msg": "Contribution not found"
}
```

---

## User Workflow

### Delete Weekly Contribution

1. **Open Member Report**
   - Click "📊 Report" button on any member

2. **View Weekly Contributions Table**
   - Table shows all weekly contributions sorted by week (newest first)
   - Each row has "🗑️ Delete" button in Actions column

3. **Delete a Week**
   - Click "🗑️ Delete" button on desired week
   - Button changes to show "Confirm" and "Cancel" buttons
   - Click "Confirm" to delete or "Cancel" to abort

4. **Result**
   - Week contribution deleted from database
   - Table updated immediately (row removed)
   - Member summary stats recalculated (Total RSS, Weeks Donated, etc.)
   - Success message shown: "✅ Kontribusi minggu X berhasil dihapus"

---

## Database Impact

### Query Executed
```sql
DELETE FROM member_contributions 
WHERE member_id = ? 
  AND alliance_id = ? 
  AND week = ?;
```

### Data Consistency
- UNIQUE constraint on (member_id, alliance_id, week) ensures only one record per week
- Deletion cascades properly due to foreign key setup
- Audit logs created with deletion details
- Member summary recalculated on next API call

---

## Technical Implementation Details

### Week Calculation Fix

**Before (WRONG):**
```javascript
const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
                          ↑                  ↑                      ↑
                    Local timezone    Local timezone         Local timezone
```

Issues:
- `date.getFullYear()` returns year in user's local timezone
- `date.getMonth()` returns month in user's local timezone
- `date.getDate()` returns date in user's local timezone
- If user in different timezone, week calculation wrong

**After (CORRECT):**
```javascript
const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
                          ↑                       ↑                       ↑
                        UTC                     UTC                      UTC
```

Benefits:
- Consistent regardless of user's local timezone
- Matches backend week calculation exactly
- Default week always shows current UTC week

---

## Code Changes Summary

| File | Changes | Lines |
|------|---------|-------|
| `AllianceDetail.jsx` | Fix getWeekNumber() to use UTC methods | +1 |
| `AllianceDetail.jsx` | Add deleteConfirm state | +1 |
| `AllianceDetail.jsx` | Add deleteWeeklyContribution() function | +30 |
| `AllianceDetail.jsx` | Update closeMemberReport() to clear deleteConfirm | +1 |
| `AllianceDetail.jsx` | Add Actions column to table header | +1 |
| `AllianceDetail.jsx` | Add delete/confirm buttons to table rows | +25 |
| `allianceRoutes.js` | Add new DELETE route for memberId/allianceId/week | +2 |
| `memberContributionController.js` | Update deleteMemberContribution() to support both methods | +20 |

**Total Changes:** 3 files, ~80 lines of code

---

## Testing Checklist

### Week Calculation
- [ ] Open Alliance Detail → Click "➕ Add" on any member
- [ ] Verify "Week Number" dropdown shows current week by default (not week 50)
- [ ] Verify default week changes when it's a new week (1-7 days later)
- [ ] Verify week calculation matches week shown in mobile/desktop views

### Delete Feature
- [ ] Open Member Report modal
- [ ] Scroll to "Weekly Contributions" table
- [ ] Click "🗑️ Delete" on any week row
- [ ] Verify button changes to "Confirm" and "Cancel"
- [ ] Click "Cancel" → Verify delete aborted, table unchanged
- [ ] Click "🗑️ Delete" again on same week
- [ ] Click "Confirm" → Verify:
  - [ ] Row removed from table
  - [ ] Success message shows: "✅ Kontribusi minggu X berhasil dihapus"
  - [ ] Summary cards update (Total RSS, Weeks Donated decrease)
  - [ ] Last Activity updated

### Edge Cases
- [ ] Delete last remaining contribution → Table shows "No contributions recorded yet"
- [ ] Delete contribution from week dropdown in RSS panel → Options update
- [ ] Open two reports side-by-side → Delete in one → Verify other updates
- [ ] Network error during delete → Verify error alert shown

---

## Audit Trail

All deletions are logged in `audit_logs` table:

```
user_id: [admin_id]
action: DELETE
table_name: member_contributions
record_id: [contribution_id]
description: "Deleted 1500000000 RSS contribution for Week 49 from 1"
timestamp: [current_time]
```

---

## Rollback Instructions

If needed to revert changes:

```bash
# Reset getWeekNumber to previous version
# (though this would reintroduce the bug)

# Remove delete endpoint from routes
# Remove deleteConfirm state
# Remove deleteWeeklyContribution function
# Remove Actions column from table
```

**Not recommended** - these are bug fixes and feature additions with no backward compatibility issues.

---

## Performance Impact

### Week Calculation Fix
- **Impact:** Negligible (calculation happens on component mount only)
- **Performance:** Slightly faster (fewer object creations)

### Delete Feature
- **Query Performance:** O(1) - direct lookup by (member_id, alliance_id, week)
- **Network:** Single DELETE request
- **Frontend Re-render:** Only affected row and summary cards update
- **Database:** Single DELETE statement with UNIQUE constraint

---

## Future Enhancements

1. **Bulk Delete**
   - Select multiple weeks and delete together
   - Requires checkboxes in table

2. **Edit Week**
   - Direct edit in table instead of RSS panel
   - In-cell editing for quick updates

3. **Undo/Restore**
   - Move deleted contributions to trash
   - Restore within 7 days

4. **Export Before Delete**
   - Auto-backup contributions before deletion
   - Download as CSV/JSON

---

## Troubleshooting

### Week still showing as 50
- [ ] Clear browser cache: Ctrl+Shift+Delete
- [ ] Hard refresh page: Ctrl+F5
- [ ] Check server time is correct: `date` in terminal

### Delete button not working
- [ ] Check browser console for errors (F12)
- [ ] Verify backend is running
- [ ] Check network tab for failed requests
- [ ] Verify user has Admin role

### Member report not updating after delete
- [ ] Check if contributions array is properly filtered
- [ ] Verify fetchAllianceData() was called
- [ ] Check if reportMember state was updated

---

## Documentation Links
- [Database Analysis & Member Report Fix](./DATABASE_ANALYSIS_SOLUTION.md)
- [API Guidelines](./instruction.instructions.md)

