---
applyTo: '**'
---

# Development Instructions — MySQL Migration (SF BANK)

Ringkasan: file ini disesuaikan untuk merefleksikan rencana migrasi dari penyimpanan CSV ke MySQL (lihat `plan.txt` di root projek). Instruksi berisi pedoman konfigurasi database, skema awal, migrasi, import CSV, dan opsi pengembangan (docker, backup).

**Core Goals:**
- Migrasi data anggota dan setoran dari CSV ke MySQL.
- Menyediakan `members` dan `deposits` melalui migration dan model.
- Sediakan skrip import CSV dengan opsi `--dry-run` dan logging error.

**Pendekatan dan Tooling (Rekomendasi):**
- ORM: `sequelize` + `sequelize-cli` (migrasi, seeders). Alternatif: `knex` + `objection.js`.
- MySQL client: `mysql2`.
- Koneksi: gunakan connection pooling dan env vars.

**Lokasi file penting:**
- Konfigurasi DB: `backend/config/database.js` (atau `.ts`).
- Migration: `backend/migrations/` (hasil dari `sequelize-cli`).
- Models: `backend/models/`.
- Seeders: `backend/seeders/`.
- Import script: `backend/scripts/import_csv_to_mysql.js`.
- Docker compose (dev): `docker-compose.yml` (di repo root atau `backend/`).

**Environment variables yang harus tersedia:**
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_POOL_MAX`, `DB_POOL_MIN`.

**Skema Awal (ringkasan):**
- `members`: `id`, `external_id` (optional), `name`, `role`, `joined_date`, `notes`, timestamps.
- `deposits`: `id`, `deposit_uuid` (optional), `week` (TINYINT, 1..100), `member_id` (FK), `amount`, `date_entered`, `entered_by`, `note`, timestamps.
- Index: `deposits(member_id)`, `deposits(week)`, `members(external_id)` bila digunakan.

**Validasi & Integritas:**
- Validasi range `week` (1..100) di aplikasi + DB constraint jika memungkinkan.
- Gunakan transaksi saat melakukan operasi multi-step (mis. batch import).

**Migrasi & Seed (contoh commands):**
```pwsh
cd backend
npm install sequelize sequelize-cli mysql2
npx sequelize-cli init
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

Tambahkan script `package.json` di `backend` untuk mempermudah: `migrate`, `seed`.

**Import CSV → MySQL**
- Letakkan script di `backend/scripts/import_csv_to_mysql.js`.
- Fitur minimal: parse CSV, validasi per-baris, batch insert dalam transaksi, `--dry-run`, log ke `import_errors.log`.

**Docker (dev) — rekomendasi singkat**
- Sediakan `docker-compose.yml` berisi service `db` (MySQL:8), named volume untuk persistensi, dan environment vars contoh.

**Backup**
- Skrip lokal: `scripts/backup_mysql.sh` (atau `.ps1` untuk Windows) yang menjalankan `mysqldump`/`mysqlpump`.

**API perubahan (high level)**
- Ganti operasi CSV/file I/O di controller dengan model/ORM queries.
- Endpoints minimal:
  - `GET /api/v1/members`
  - `POST /api/v1/members`
  - `PUT /api/v1/members/:id`
  - `DELETE /api/v1/members/:id`
  - `GET /api/v1/deposits?week=..&from=..&to=..`
  - `POST /api/v1/deposits`
  - `PUT /api/v1/deposits/:id`

**Roadmap (singkat)**
1. Buat `backend/config/database.js` dan tambahkan scripts `migrate`/`seed` (0.5 hari).
2. Setup `sequelize` + `sequelize-cli` + konfigurasi CLI (0.5 hari).
3. Tulis migrations untuk `members` dan `deposits` + jalankan di dev (0.5 hari).
4. Implement model layer dan fungsi CRUD (1 hari).
5. Migrasi controller: ganti CSV I/O dengan ORM (1 hari).
6. Buat import script CSV→MySQL dengan `--dry-run` (0.5 hari).
7. Tambah seed data, tests sederhana, dan dokumentasi (0.5 hari).

**Acceptance Criteria**
- Migration membuat tabel `members` dan `deposits`.
- API CRUD untuk anggota dan setoran terhubung ke MySQL.
- Import CSV dapat memindahkan data lama ke MySQL dengan logging dan opsi dry-run.
- Laporan rentang minggu dapat dihasilkan dari query MySQL.

**Next Steps — pilih aksi yang Anda mau saya lakukan sekarang**
- **[A]** Buat file `backend/config/database.js` dan skeleton konfigurasi `sequelize` + `package.json` script `migrate`/`seed`.
- **[B]** Tulis migration dan model untuk `members` dan `deposits` + jalankan migrations di lingkungan dev (membutuhkan DB akses atau docker).
- **[C]** Buat script `backend/scripts/import_csv_to_mysql.js` dengan opsi `--dry-run`.
- **[D]** Buat contoh `docker-compose.yml` untuk MySQL development.

Referensi: lihat `plan.txt` di root projek untuk deskripsi detil dan estimasi waktu.

---

- **Visitasi**: External evaluation/site visit by accreditation team
- **Kriteria Akreditasi**: Accreditation criteria (numbered standards)
- **Borang**: Accreditation forms and documentation
- **Eviden**: Evidence/supporting documents for accreditation
- **Mutu Akademik**: Academic quality management

## API Guidelines

### Frontend API Integration
- **MANDATORY**: Use environment variable for base URL
- **Format**: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/endpoint`
- **Service Layer**: Create centralized API service
- **Example**: 
  ```typescript
  // services/api.ts
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  
  export const apiClient = {
    get: (endpoint: string) => fetch(`${API_BASE_URL}/api/v1${endpoint}`),
    post: (endpoint: string, data: any) => fetch(`${API_BASE_URL}/api/v1${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
  };
  
  // Usage in components
  import { apiClient } from '../services/api';
  const users = await apiClient.get('/users');
  ```

### Backend API Structure
- **Base Path**: All API endpoints must start with `/api/v1/`
- **Role-Based Routes**: Organize by user roles
  ```
  /api/v1/auth/          # Authentication
  /api/v1/customers/     # Customer endpoints (profiles, KYC)
  /api/v1/accounts/      # Bank account endpoints (create, balances)
  /api/v1/transactions/  # Transaction endpoints (deposits, transfers)
  /api/v1/admin/         # Admin / management endpoints
  ```
- **RESTful**: Follow REST conventions
- **Authentication**: JWT-based with role checking middleware
- **Error Handling**: Consistent JSON error responses

- **Business Context**: This project is a banking/financial application (SF BANK). Adjust data, UX, and compliance items accordingly.
- **Compliance Notes**: Ensure handling of PII follows local regulations; add logging, consent, and data-retention policies as needed.
- **Audit & Evidence**: Keep migration logs, import error logs, and DB migration history for audit and rollback purposes.
- **Testing**: Jest for unit tests, Cypress for E2E

### Dummy Data Requirements
- **Comprehensive**: Cover all user scenarios
- **Realistic**: Use Indonesian academic context
- **Consistent**: Maintain data relationships
- **Variety**: Include different states (completed, pending, error)

### Component Development
- **Functional Components**: Use React functional components with hooks
- **Props Interface**: Define TypeScript interfaces for all props
- **Default Props**: Provide sensible defaults
<!-- - **Error Boundaries**: Implement error handling -->

### Form Handling
- **Validation**: Client-side and server-side validation
- **Loading States**: Show loading indicators
- **Error Messages**: Clear, actionable error messages
- **Auto-save**: Implement for long forms

## Image Guidelines
- **Image Source**: Use Unsplash.com for high-quality stock images
- **Academic Context**: Choose images related to education, university, academic quality, modern campus
- **Image Optimization**: Use Next.js Image component with proper sizing
- **Alt Text**: Provide descriptive alt text for accessibility
- **Responsive Images**: Use appropriate sizes for different breakpoints
- **Loading**: Implement progressive loading and blur placeholders

## Security Guidelines
- **Input Validation**: Sanitize all user inputs
- **CORS**: Configure properly for production
- **Rate Limiting**: Implement API rate limiting
- **SQL Injection**: Use parameterized queries
- **XSS Protection**: Implement content security policies

## Performance Guidelines
- **Image Optimization**: Use Next.js Image component
- **Code Splitting**: Implement dynamic imports
- **Caching**: Implement appropriate caching strategies
- **Bundle Size**: Monitor and optimize bundle size
- **Core Web Vitals**: Maintain good performance metrics

## File Naming Conventions
- **Components**: PascalCase (e.g., `UserDashboard.tsx`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useAuth.ts`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Pages**: kebab-case (e.g., `user-profile.tsx`)
- **API Routes**: kebab-case (e.g., `user-management.ts`)

## Documentation Requirements
- **JSDoc**: Document all functions and classes
- **README**: Maintain updated setup instructions
- **API Docs**: Document all endpoints
- **Component Stories**: Storybook for UI components

## Environment Configuration
```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=SF BANK

# Backend (.env)
NODE_ENV=development
PORT=5000
DB_CONNECTION_STRING=your_db_connection
JWT_SECRET=your_jwt_secret
```

Remember: Always prioritize user experience, code maintainability, and scalability in all development decisions.