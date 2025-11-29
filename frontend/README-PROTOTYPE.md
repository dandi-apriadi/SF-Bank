## PRIMA Frontend Prototype (Mock Mode)

Fokus: Menyediakan kerangka UI & state manajemen terpusat dengan data dummy tanpa backend.

### Mode Mock
Aktif otomatis jika variabel `REACT_APP_API_BASE_URL` tidak di-set atau set `REACT_APP_USE_MOCK=true`.

```
REACT_APP_USE_MOCK=true
```

### Slices yang tersedia
- authSlice (mock user & login)
- accreditationSlice (kriteria & ringkasan)
- evidenceSlice (daftar eviden + totals)
- progressSlice (agregasi progres)
- gapSlice (analisis gap per kriteria)
- notificationSlice (notifikasi dummy)
- institutionSlice (agregasi metrik institusi: totals, kualitas, alerts)
- projectionSlice (proyeksi skor & grade akreditasi)
- themeSlice (mode terang/gelap dengan persist localStorage)

### Hook Orkestrasi
`useLoadDashboardData` memuat berurutan: accreditation -> evidence -> progress.

### Komponen Reusable Baru
- `components/ui/Card.jsx`
- `components/ui/Skeleton.jsx`
- `components/ui/CriteriaList.jsx`
- `components/ui/EvidenceItem.jsx`
- `components/ui/NotificationCenter.jsx`
- `components/ui/ErrorBoundary.jsx`
- `components/ui/LoadingOverlay.jsx`

### Rencana Lanjutan
1. Konsolidasi dashboard pimpinan & ppmpp menggunakan slice agregat.
2. Tambah global error/loading boundary.
3. Ekstraksi design tokens Tailwind (warna, spacing, shadow).
4. Implementasi dark mode toggle konsisten.
5. Integrasi kalkulasi proyeksi skor akreditasi.
 6. Global notification center di navbar (DONE - komponen dasar dibuat, perlu integrasi layout).
7. Integrasi ErrorBoundary & LoadingOverlay di layout (DONE untuk koordinator, pimpinan, ppmpp).

### Prinsip Desain
Semua warna mengikuti guideline (blue, slate, green, amber, red, gray). Tidak ada kelas emerald.

### Migrasi Tailwind Bertahap
Legacy CSS akan dipangkas saat komponen di-porting ke utilitas Tailwind penuh.

### Catatan
Jangan gunakan data ini untuk produksi. Ganti dengan panggilan API & normalisasi data begitu backend siap.

### Update Terbaru
- Penambahan `institutionSlice` untuk metrik pimpinan & PPMPP.
- Refactor `DirectorDashboard` & `UnitDashboard` agar menggunakan global state.
- Penambahan `NotificationCenter` komponen (dropdown notifikasi global).
- Penambahan `projectionSlice` + badge proyeksi di KaprodiDashboard.
- Tambah ErrorBoundary & LoadingOverlay di layout peran utama.
- Integrasi dark mode toggle (ThemeToggle + themeSlice).
- Peningkatan pusat notifikasi (mark all, reload, clear) + navbar dynamic badge.
 - Penambahan halaman `NotificationsPage` bersama untuk semua peran (`/koordinator/notifications`, `/ppmpp/notifications`, `/pimpinan/notifications`) dengan filter prioritas, status, pencarian & ringkasan.

### Next Minor Tasks (Prioritas Cepat)
1. Ekstrak design tokens (warna semantik: primary, surface, border, danger, warning) ke satu file mapping + mungkin plugin Tailwind kecil.
2. Refactor sisa dashboard Kaprodi agar tidak pakai objek lokal gabungan (gunakan selector terpisah untuk PPEPP & performance).
3. Tambahkan pagination sederhana (virtual slice) untuk notifikasi bila >50.
4. Tambah unit test dasar untuk selector proyeksi & progress agar stabil sebelum algoritma lanjut.
5. Tandai notifikasi prioritas tinggi dengan animasi subtle (ring pulse) menggunakan util kelas opsional.
