# Member Detail Report Feature Guide

## Overview
Fitur **Member Detail Report** memungkinkan admin untuk melihat laporan lengkap setiap member termasuk:
- Summary kontribusi (total RSS, jumlah minggu, kontribusi terakhir)
- Breakdown resource (food, wood, stone, gold)
- Tabel detail kontribusi per minggu
- Informasi tanggal dan minggu setiap kontribusi

## Cara Mengakses

### Desktop View
1. Buka halaman **Alliance Detail**
2. Scroll ke **Member Contributions** section
3. Di bagian Actions, klik tombol **📊 Report** pada member yang ingin dilihat
4. Modal report akan terbuka dengan detail lengkap

### Mobile View
1. Buka halaman **Alliance Detail**
2. Scroll ke **Member Contributions** section
3. Pada member card, klik tombol **📊 Report** di bagian bawah
4. Modal report akan terbuka dengan detail lengkap

## Interface Components

### Report Header
```
┌─────────────────────────────────────────────────────┐
│ Member Report                                       │ X
│ [Member Name] ([Governor ID])                       │
└─────────────────────────────────────────────────────┘
```

### Summary Cards (4 Cards)
```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Total RSS    │  │Weeks Donated │  │Contributions │  │Last Activity │
│   45,000     │  │      12      │  │      12      │  │ Dec 1, 2025  │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

### Resource Breakdown (4 Cards)
```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│      🌾      │  │      🪵      │  │      🪨      │  │      💰      │
│ Food         │  │ Wood         │  │ Stone        │  │ Gold         │
│  15,000      │  │  12,000      │  │   8,000      │  │   10,000     │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

### Weekly Contributions Table
```
┌─────┬─────────┬─────────┬─────────┬─────────┬─────────┬──────────────┐
│Week │   Food  │  Wood   │  Stone  │  Gold   │  Total  │ Date         │
├─────┼─────────┼─────────┼─────────┼─────────┼─────────┼──────────────┤
│ W12 │  2,000  │  1,500  │  1,000  │  1,500  │  6,000  │ Dec 1, 2025  │
│ W11 │  1,800  │  1,300  │    900  │  1,200  │  5,200  │ Nov 28, 2025 │
│ W10 │  2,100  │  1,600  │  1,100  │  1,300  │  6,100  │ Nov 21, 2025 │
└─────┴─────────┴─────────┴─────────┴─────────┴─────────┴──────────────┘
```

## Data Displayed

### Summary Section
- **Total RSS**: Total resource yang sudah dikontribusi
- **Weeks Donated**: Jumlah minggu member sudah kontribusi
- **Contributions**: Total record kontribusi di database
- **Last Activity**: Tanggal kontribusi terakhir

### Resource Breakdown
- **Food (🌾)**: Total food yang dikontribusi
- **Wood (🪵)**: Total wood yang dikontribusi
- **Stone (🪨)**: Total stone yang dikontribusi
- **Gold (💰)**: Total gold yang dikontribusi

### Weekly Detail Table (Sorted by Week DESC)
- **Week**: Nomor minggu (W1-W53)
- **Food**: Food yang dikontribusi minggu itu
- **Wood**: Wood yang dikontribusi minggu itu
- **Stone**: Stone yang dikontribusi minggu itu
- **Gold**: Gold yang dikontribusi minggu itu
- **Total**: Total resource minggu itu (Food + Wood + Stone + Gold)
- **Date**: Tanggal saat kontribusi disubmit

## Frontend Implementation

### State Management
```javascript
const [showMemberReport, setShowMemberReport] = useState(false);
const [reportMember, setReportMember] = useState(null);
```

### Functions
```javascript
// Open member report
const openMemberReport = (member) => {
  setReportMember(member);
  setShowMemberReport(true);
};

// Close member report
const closeMemberReport = () => {
  setShowMemberReport(false);
  setReportMember(null);
};
```

### Data Structure
Report menggunakan data dari `reportMember` yang sudah include:
```javascript
{
  id,
  name,
  governor_id,
  total_rss,
  food,
  wood,
  stone,
  gold,
  weeks_donated,
  last_contribution,
  contributions: [
    {
      id,
      member_id,
      alliance_id,
      week,
      date,
      food,
      wood,
      stone,
      gold
    },
    ...
  ]
}
```

## Features

✅ **Real-time Data Display** - Menampilkan data terbaru dari database
✅ **Weekly Breakdown** - Detail kontribusi per minggu
✅ **Resource Summary** - Ringkasan resource dalam berbagai format
✅ **Date Tracking** - Melihat kapan setiap kontribusi disubmit
✅ **Responsive Design** - Bekerja baik di desktop dan mobile
✅ **Dark Mode Support** - Full support untuk dark theme
✅ **Sorted by Week** - Kontribusi ditampilkan dari week terbaru

## Styling

### Colors
- **Summary Cards**: Gradient indigo, purple, blue, green
- **Resource Icons**: Food (green), Wood (amber), Stone (gray), Gold (yellow)
- **Buttons**: Blue untuk report, indigo untuk add/edit
- **Text**: Gray untuk label, colored untuk values

### Responsive Breakpoints
- **Mobile**: Full width cards, 1 column for resource breakdown
- **Tablet/Desktop**: Grid layout 2-4 columns

## Empty States

### No Contributions
Jika member belum punya kontribusi, akan ditampilkan:
```
No contributions recorded yet
```

## Navigation

### From Report Modal
- **Close Report**: Tombol di footer untuk close modal
- **X Button**: Di header untuk close modal

### Back to Main
Report menggunakan overlay modal, jadi navigasi otomatis kembali ke Member Contributions section ketika close.

## Performance Considerations

- **Data Loading**: Sudah di-load saat fetchAllianceData() di awal
- **Sorting**: Week diurutkan descending (terbaru dulu) di client-side
- **Re-render**: Hanya render ketika `showMemberReport` atau `reportMember` berubah

## Future Enhancements

Potential features untuk fase berikutnya:
- [ ] Export report ke PDF
- [ ] Grafik kontribusi per minggu
- [ ] Perbandingan dengan rata-rata alliance
- [ ] Alert untuk member dengan kontribusi konsisten tinggi
- [ ] Download weekly summary as CSV
- [ ] Print report functionality
- [ ] Historical year-over-year comparison

## Testing Checklist

- [ ] Click "Report" button di desktop member row
- [ ] Click "Report" button di mobile member card
- [ ] Verify all summary cards display correct data
- [ ] Verify resource breakdown shows correct totals
- [ ] Verify weekly table shows all contributions sorted by week DESC
- [ ] Click close button atau X icon
- [ ] Verify modal closes properly
- [ ] Verify data updates setelah add contribution
- [ ] Test dengan member yang no contributions
- [ ] Test responsive layout di berbagai screen sizes
- [ ] Verify dark mode display
- [ ] Check date format consistency

## Notes

- Report data diambil dari `reportMember` state yang sudah full-loaded dengan contributions array
- Tidak perlu API call tambahan untuk report (sudah di-cache dari fetchAllianceData)
- Sorting di-handle di frontend dengan `contributions.sort((a, b) => b.week - a.week)`
- Total calculation di-done realtime: `food + wood + stone + gold`

---
Last Updated: December 6, 2025
