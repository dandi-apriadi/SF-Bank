# Week Editing & Correction Feature Guide

## Overview
Sistem kontribusi RSS sekarang mendukung **editing data minggu sebelumnya** bahkan ketika sudah tiba minggu berikutnya. Ini memungkinkan koreksi data yang salah atau perubahan data retrospektif.

## Cara Kerja

### 1. **Auto-Detect Last Contribution**
- Ketika admin membuka RSS panel untuk member tertentu
- Sistem otomatis mencari **week terakhir** yang sudah ada kontribusi
- Default week selection adalah **week berikutnya** (last week + 1)

### 2. **Week Selection Flexibility**
- Admin bisa memilih **week berapapun** (1-53)
- Week yang **sudah ada** akan ditandai dengan teks "(Sudah Ada - Edit)"
- Contoh: Week 5 (Sudah Ada - Edit) - berarti sudah ada data di week ini

### 3. **Auto-Load Existing Data**
- Ketika admin memilih week yang **sudah ada**
- Sistem otomatis **load data lama** ke dalam form
- Admin bisa melihat dan mengubah data yang ada

### 4. **Create vs Update**
- **Create**: Jika week dipilih yang belum punya data → Insert baru
- **Update**: Jika week dipilih yang sudah punya data → Update/overwrite data lama

### 5. **Backend Upsert Logic**
Backend menggunakan `findOrCreate` dengan kombinasi:
```javascript
where: {
  member_id,
  alliance_id,
  week: weekNumber,  // Unique constraint
}
```

Ini memastikan:
- Tidak ada duplikasi kontribusi untuk week yang sama
- Data lama otomatis ter-replace dengan data baru
- Atau di-create jika belum ada

## Use Cases

### Case 1: Tambah Data Week Baru
1. Buka RSS Panel untuk Member
2. Form otomatis show Week 6 (jika last contribution adalah Week 5)
3. Input resources (food, wood, stone, gold)
4. Submit → Data ditambahkan untuk Week 6

### Case 2: Koreksi Data Week Lama
1. Buka RSS Panel untuk Member
2. **Select Week 3** (yang mana sudah ada data)
3. Form otomatis load data lama Week 3
4. Update nilai resources
5. Submit → Data Week 3 diperbaharui

### Case 3: Edit Data di Week Tengah (Complex Scenario)
- Week sekarang adalah Week 10
- Member punya kontribusi: Week 1, 3, 5, 7, 9
- Admin ingin edit Week 5 karena data salah
1. Open RSS Panel
2. Select Week 5
3. Form shows existing Week 5 data
4. Update data
5. Submit → Week 5 diperbaharui

## Frontend Implementation

### State Management
```javascript
rssForm = {
  food: "",
  wood: "",
  stone: "",
  gold: "",
  lastContributionDate: "2025-12-06",  // Auto UTC today
  week: 6,  // Auto next week
  existingWeeks: [1, 3, 5, 7, 9],  // Track existing weeks
}
```

### Week Dropdown Display
```jsx
<option value="5">
  Week 5 (Sudah Ada - Edit)  // Indicates this week has existing data
</option>
```

### Auto-Load Data Logic
```javascript
const handleRssInputChange = (e) => {
  if (name === 'week' && value) {
    const selectedWeek = parseInt(value);
    const existingContribution = selectedMember.contributions?.find(c => c.week === selectedWeek);
    
    if (existingContribution) {
      // Auto-load existing data
      setRssForm(prev => ({
        ...prev,
        food: existingContribution.food?.toString() || "",
        wood: existingContribution.wood?.toString() || "",
        stone: existingContribution.stone?.toString() || "",
        gold: existingContribution.gold?.toString() || "",
      }));
      return;
    }
  }
  // Normal input change
};
```

## Backend Implementation

### Upsert Logic (memberContributionController.js)
```javascript
const [contribution, created] = await MemberContribution.findOrCreate({
  where: {
    member_id,
    alliance_id,
    week: weekNumber,  // Composite unique key
  },
  defaults: { ... },
});

if (!created) {
  // Update existing record
  await contribution.update({ ... });
}
```

## Key Features

✅ **Automatic Week Detection** - Default ke next week setelah last contribution
✅ **Visual Indicator** - Week yang sudah ada ditandai "(Sudah Ada - Edit)"
✅ **Auto-Load Data** - Pilih week lama → data otomatis ter-load
✅ **Prevent Duplicates** - Unique constraint pada (member_id, alliance_id, week)
✅ **Create/Update Flexibility** - Bisa insert baru atau update existing
✅ **UTC Date Handling** - Contribution date otomatis set ke today UTC
✅ **Audit Logging** - Semua actions tercatat di audit_logs

## Validation Rules

| Field | Rule | Behavior |
|-------|------|----------|
| Week | 1-53 | Required, must be valid |
| Date | Must be valid date | Auto-set to today UTC |
| Resources | At least 1 required | Error if all empty |
| Member | Must exist in alliance | Auto-verify |

## Admin Feedback

### Success Messages
- **New Entry**: "RSS contribution ditambahkan untuk [Name] di Week [X]"
- **Update Entry**: "RSS contribution diperbaharui untuk [Name] di Week [X]"

### Error Messages
- "Pilih minggu terlebih dahulu"
- "Please enter at least one resource amount"
- "Please select a valid week (1-53)"

## Testing Checklist

- [ ] Add new week contribution (Week 10 when last is Week 9)
- [ ] Edit week that already exists (Week 5)
- [ ] Verify auto-load data works
- [ ] Check week dropdown shows "(Sudah Ada - Edit)"
- [ ] Verify alert shows "ditambahkan" for new
- [ ] Verify alert shows "diperbaharui" for update
- [ ] Check database shows only 1 record per week
- [ ] Verify audit log records the action
- [ ] Test with multiple members

## Notes

- **Week boundaries**: ISO 8601 format (Week 1-53 per year)
- **Date field**: Read-only, always set to today (UTC)
- **No duplicate prevention needed**: DB handles via unique constraint
- **Rollback support**: If data incorrect, just re-edit and submit
- **History tracking**: Audit logs show all changes with timestamps

---
Last Updated: December 6, 2025
