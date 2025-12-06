# Delete Weekly Contribution - Visual Guide

## Feature Overview

### Before Delete Feature
```
Member Report Modal
┌─────────────────────────────────────────────────┐
│ 📊 Member Report                           [X]   │
│ diablo (233223)                                  │
├─────────────────────────────────────────────────┤
│                                                  │
│ Summary Cards:                                   │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────┐│
│ │Total RSS │ │ Weeks    │ │Contrib   │ │Last  ││
│ │ 5.6B     │ │ Donated 4│ │ Count 4  │ │Yest. ││
│ └──────────┘ └──────────┘ └──────────┘ └──────┘│
│                                                  │
│ Resource Breakdown:                              │
│ 🌾 Food: 3.6M   🪵 Wood: 0                     │
│ 🪨 Stone: 5.6B  💰 Gold: 0                     │
│                                                  │
│ Weekly Contributions:                            │
│ ┌─────┬──────────┬────────┬───────┬────────┬────┐
│ │Week │ 🌾 Food  │ 🪵Wood │ Total │ Date   │    │
│ ├─────┼──────────┼────────┼───────┼────────┼────┤
│ │ W49 │1200000   │   0    │ 2.2B  │12-05   │    │
│ │ W48 │ 800000   │   0    │ 1.5B  │11-28   │    │
│ └─────┴──────────┴────────┴───────┴────────┴────┘
│                                                  │
│ [Close Report]                                   │
└─────────────────────────────────────────────────┘
```

### After Delete Feature
```
Member Report Modal
┌──────────────────────────────────────────────────────────┐
│ 📊 Member Report                                    [X]   │
│ diablo (233223)                                           │
├──────────────────────────────────────────────────────────┤
│                                                           │
│ Summary Cards: (Updated when deleting)                    │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────┐         │
│ │Total RSS │ │ Weeks    │ │Contrib   │ │Last  │         │
│ │ 5.6B     │ │ Donated 4│ │ Count 4  │ │Yest. │         │
│ └──────────┘ └──────────┘ └──────────┘ └──────┘         │
│                                                           │
│ Resource Breakdown: (Recalculated after delete)           │
│ 🌾 Food: 3.6M   🪵 Wood: 0                              │
│ 🪨 Stone: 5.6B  💰 Gold: 0                              │
│                                                           │
│ Weekly Contributions:                                     │
│ ┌─────┬──────────┬────────┬───────┬────────┬─────────────┐
│ │Week │ 🌾 Food  │ 🪵Wood │ Total │ Date   │ Actions ← NEW│
│ ├─────┼──────────┼────────┼───────┼────────┼─────────────┤
│ │ W49 │1200000   │   0    │ 2.2B  │12-05   │[🗑️ Delete]  │
│ │ W48 │ 800000   │   0    │ 1.5B  │11-28   │[🗑️ Delete]  │
│ │ W47 │2600000   │   0    │ 3.1B  │11-21   │[🗑️ Delete]  │
│ └─────┴──────────┴────────┴───────┴────────┴─────────────┘
│                                                           │
│ [Close Report]                                            │
└──────────────────────────────────────────────────────────┘
```

---

## Delete Workflow - Step by Step

### Step 1: Open Member Report
```
Alliance Detail View
├─ Members Table
│  ├─ Name: diablo
│  ├─ Governor ID: 233223
│  ├─ Button: [📊 Report] ← Click here
│  └─ Button: [➕ Add]
```

### Step 2: Member Report Opens
```
┌──────────────────────────────────┐
│ 📊 Member Report                 │
│ diablo (233223)              [X] │
├──────────────────────────────────┤
│                                  │
│ (View summary and resources)     │
│                                  │
│ Weekly Contributions:            │
│ ┌────────────────────────────────┐
│ │ [Scroll to see table]           │
│ └────────────────────────────────┘
```

### Step 3: Find Week to Delete
```
Weekly Contributions Table:

┌─────┬──────────┬──────┬───────┬──────────────────┐
│Week │ 🌾 Food  │ 🪨S  │ Date  │ Actions          │
├─────┼──────────┼──────┼───────┼──────────────────┤
│ W49 │1200000   │2000B │12-05  │[🗑️ Delete]      │ ← Click
│ W48 │ 800000   │1500B │11-28  │[🗑️ Delete]      │
│ W47 │2600000   │3100B │11-21  │[🗑️ Delete]      │
└─────┴──────────┴──────┴───────┴──────────────────┘
```

### Step 4a: Confirm Delete (Click Delete)
```
After clicking [🗑️ Delete] on W49:

┌─────┬──────────┬──────┬───────┬────────────────────────┐
│Week │ 🌾 Food  │ 🪨S  │ Date  │ Actions                │
├─────┼──────────┼──────┼───────┼────────────────────────┤
│ W49 │1200000   │2000B │12-05  │[✅ Confirm] [❌ Cancel]│ ← Confirm!
│ W48 │ 800000   │1500B │11-28  │[🗑️ Delete]            │
│ W47 │2600000   │3100B │11-21  │[🗑️ Delete]            │
└─────┴──────────┴──────┴───────┴────────────────────────┘
```

### Step 4b: Confirm Deletion
```
After clicking [✅ Confirm]:

✅ Alert: "Kontribusi minggu 49 berhasil dihapus"

┌─────┬──────────┬──────┬───────┬──────────────────┐
│Week │ 🌾 Food  │ 🪨S  │ Date  │ Actions          │
├─────┼──────────┼──────┼───────┼──────────────────┤
│ W48 │ 800000   │1500B │11-28  │[🗑️ Delete]      │ ← W49 removed!
│ W47 │2600000   │3100B │11-21  │[🗑️ Delete]      │
└─────┴──────────┴──────┴───────┴──────────────────┘

Summary Updated:
┌──────────────┬──────────────┬──────────────┐
│ Total RSS    │ Weeks Donated│ Contributions│
│ 4.3B (↓)     │ 3 (↓)        │ 3 (↓)        │
└──────────────┴──────────────┴──────────────┘
```

### Step 4c: Cancel Delete (Click Cancel)
```
After clicking [❌ Cancel]:

Week stays in table:

┌─────┬──────────┬──────┬───────┬──────────────────┐
│Week │ 🌾 Food  │ 🪨S  │ Date  │ Actions          │
├─────┼──────────┼──────┼───────┼──────────────────┤
│ W49 │1200000   │2000B │12-05  │[🗑️ Delete]      │ ← Still there
│ W48 │ 800000   │1500B │11-28  │[🗑️ Delete]      │
│ W47 │2600000   │3100B │11-21  │[🗑️ Delete]      │
└─────┴──────────┴──────┴───────┴──────────────────┘

No changes to data.
```

---

## Button States

### State 1: Initial (Ready to Delete)
```
┌──────────────────────────┐
│ 🗑️ Delete                 │
└──────────────────────────┘
Background: Light red (red-100 / dark:red-900/40)
Text: Red text (red-600 / dark:red-400)
Hover: Darker red (red-200 / dark:red-900/60)
```

### State 2: Confirmation (User Clicked Delete)
```
┌──────────────┐ ┌──────────────┐
│ ✅ Confirm   │ │ ❌ Cancel    │
└──────────────┘ └──────────────┘
Left:  Green-500 → Green-600 on hover
Right: Gray-400 → Gray-500 on hover
```

---

## Data Flow Diagram

```
User clicks "🗑️ Delete"
        ↓
deleteConfirm state = {memberId: X, week: Y}
        ↓
Button changes to Confirm/Cancel
        ↓
┌─────────────────────────────────────────────┐
│ User clicks Confirm         OR    User clicks Cancel
├─────────────────────────────────────────────┤
│         ↓                                ↓   │
│ DELETE API Call            Cancel (no action)│
│         ↓                                ↓   │
│ /api/v1/member-contributions  deleteConfirm = null
│ /:memberId/:allianceId/:week    │            │
│         ↓                        │            │
│ Backend deletes record           │            │
│         ↓                        │            │
│ ✅ Success response              │            │
│         ↓                        │            │
│ Show alert: "✅ Berhasil"        │            │
│         ↓                        │            │
│ fetchAllianceData() - refresh    │            │
│         ↓                        │            │
│ Update reportMember state        │            │
│ (filter out deleted week)        │            │
│         ↓                        │            │
│ Table re-renders without week    │            │
│ Summary cards recalculate        │            │
│ (totals decrease)                │            │
└─────────────────────────────────────────────┘
```

---

## Mobile View (Responsive)

### Normal Width (>768px)
```
┌──────────┬──────────┬─────────┬──────────┐
│ Week     │ Food     │ Stone   │ Actions  │
├──────────┼──────────┼─────────┼──────────┤
│ W49      │1200000   │ 2000B   │[🗑️ Delete]
└──────────┴──────────┴─────────┴──────────┘
```

### Small Width (<768px)
```
Table scrolls horizontally
[←scroll→]
┌──────────┬──────────┬──────────┐
│ Week     │ Food     │ Actions  │
├──────────┼──────────┼──────────┤
│ W49      │1200000   │[🗑️ Delete]
└──────────┴──────────┴──────────┘

Stone and other columns visible on scroll
```

---

## Error Handling

### Case 1: Contribution Not Found
```
User deletes week that already deleted
        ↓
Backend: 404 Not Found
        ↓
Error Alert: "Gagal menghapus kontribusi"
        ↓
Table stays same
deleteConfirm = null (button reset)
```

### Case 2: Network Error
```
DELETE request fails
        ↓
Error Alert: "Gagal menghapus kontribusi"
        ↓
deleteConfirm = null (button reset)
        ↓
Table unchanged (delete not executed)
```

### Case 3: Delete Last Contribution
```
Table only has 1 week entry
        ↓
User deletes it
        ↓
✅ Success
        ↓
Table becomes empty
        ↓
Shows: "No contributions recorded yet"
        ↓
Summary cards update:
- Total RSS: 0
- Weeks Donated: 0
- Contributions: 0
```

---

## State Management

### Before Delete
```javascript
reportMember = {
  id: 1,
  name: "diablo",
  contributions: [
    { week: 49, food: 1200000, ... },
    { week: 48, food: 800000, ... },
    { week: 47, food: 2600000, ... }
  ]
}

deleteConfirm = null
```

### During Delete Confirmation
```javascript
deleteConfirm = {
  memberId: 1,
  week: 49
}

// Button changes to [Confirm] [Cancel]
```

### After Delete Confirmation
```javascript
reportMember = {
  id: 1,
  name: "diablo",
  contributions: [
    // Week 49 removed! ✅
    { week: 48, food: 800000, ... },
    { week: 47, food: 2600000, ... }
  ]
}

deleteConfirm = null // Reset

// Summary cards recalculate:
// - Total RSS: 3.4B (was 5.6B)
// - Weeks Donated: 2 (was 3)
```

---

## Testing Scenarios

### Scenario 1: Normal Delete
```
1. Open report → Has 4 weeks
2. Delete week 49 → Confirm
3. ✅ Result: 3 weeks remain, summary updated
```

### Scenario 2: Cancel Delete
```
1. Open report → Has 4 weeks
2. Delete week 49 → Cancel
3. ✅ Result: Still 4 weeks, no changes
```

### Scenario 3: Delete Multiple
```
1. Open report → Has 4 weeks
2. Delete week 49 → Confirm ✅ (3 left)
3. Delete week 48 → Confirm ✅ (2 left)
4. Delete week 47 → Confirm ✅ (1 left)
5. ✅ Result: Only week 46 remains
```

### Scenario 4: Delete All
```
1. Open report → Has 4 weeks
2. Delete all 4 weeks
3. ✅ Result: Empty state, "No contributions yet"
```

---

## Color Scheme

| Element | Light Mode | Dark Mode |
|---------|-----------|-----------|
| Delete Button | red-100 bg, red-600 text | red-900/40 bg, red-400 text |
| Delete Hover | red-200 bg | red-900/60 bg |
| Confirm Button | green-500 bg | green-500 bg |
| Cancel Button | gray-400 bg | gray-400 bg |
| Table Row | - | slate-700/50 hover |
| Alert Success | green-600 text | green-400 text |
| Alert Error | red-600 text | red-400 text |

