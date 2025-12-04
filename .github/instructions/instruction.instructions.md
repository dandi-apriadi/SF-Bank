---
applyTo: '**'
---

# Development Instructions — Kingdom 3946 Web Application

Ringkasan: file ini berisi pedoman pengembangan aplikasi web Kingdom 3946 dengan tema medieval strategy game. Aplikasi ini mencakup sistem manajemen kingdom, KvK (Kingdom vs Kingdom), event management, donation tracking, dan fitur komunitas lainnya.

**Core Goals:**
- Membangun platform web untuk Kingdom 3946 dengan tema medieval/megah
- Menyediakan fitur admin untuk manajemen kingdom (users, events, KvK, donations, dll)
- Menyediakan fitur publik untuk member dan pengunjung
- Implementasi sistem role-based access control (RBAC)
- Mobile-first approach (90% pengguna akses via mobile)

**Pendekatan dan Tooling (Rekomendasi):**
- Database: MySQL dengan connection pooling
- Backend: Node.js + Express
- Frontend: React + Tailwind CSS
- Notification: Discord Webhook integration
- File Upload: Multer untuk media management
- Authentication: JWT-based dengan role-based access control

**Lokasi file penting:**
- Konfigurasi DB: `backend/config/Database.js`
- Controllers: `backend/controllers/` (organized by feature)
- Models: `backend/models/`
- Routes: `backend/routes/`
- Middleware: `backend/middleware/AuthUser.js`
- Scripts: `backend/scripts/` (setup, seeding, migrations)
- Frontend Components: `frontend/src/components/`
- Frontend Services: `frontend/src/services/`

**Environment variables yang harus tersedia:**
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `JWT_SECRET`, `JWT_EXPIRES_IN`
- `DISCORD_WEBHOOK_URL` (untuk notifikasi aplikasi)
- `NODE_ENV`, `PORT`
- `NEXT_PUBLIC_API_URL` (frontend)

**Database Schema (Kingdom 3946):**
- `users`: User accounts dengan role-based access (admin, member, visitor)
- `events`: Kingdom events dengan jadwal, rules, rewards
- `kvk`: Kingdom vs Kingdom battles, scores, rankings
- `donations`: Tracking donasi member dengan leaderboard
- `kdp`: Kingdom Defense Points tracking
- `blacklist`: Database pemain bermasalah
- `gallery`: Media uploads (photos, videos)
- `blog`: Artikel dan news posts
- `forms`: Dynamic forms dengan submissions
- `audit_logs`: Activity logging untuk admin actions

**Validasi & Integritas:**
- Validasi input di aplikasi dengan error handling yang jelas
- Gunakan transaksi untuk operasi multi-step
- Audit trail: semua aksi admin harus tercatat (who, what, when)
- Role-based access control pada setiap endpoint

**Database Setup (contoh commands):**
```pwsh
cd backend
npm install
node scripts/createDatabase.js
node scripts/databaseSetup.js
node scripts/seed_polman_data.js
```

**Discord Integration**
- Setup webhook untuk notifikasi real-time
- Trigger notifikasi untuk: aplikasi member baru, KvK results, event registrations
- Format pesan dengan embed untuk tampilan menarik

**Backup & Maintenance**
- Script backup: `backup.sh` dan `rollback.sh` di root
- Session cleanup: `backend/scripts/session_cleanup.sh`
- Health monitoring: `backend/scripts/system_health_check.js`

**API Structure (Kingdom 3946)**
- Auth & User Management:
  - `POST /api/v1/auth/login`
  - `POST /api/v1/auth/register`
  - `GET /api/v1/users`
  - `PUT /api/v1/users/:id`
  - `DELETE /api/v1/users/:id`

- KvK Management:
  - `GET /api/v1/kvk` (list KvK battles)
  - `POST /api/v1/kvk` (create new KvK)
  - `PUT /api/v1/kvk/:id/scores`
  - `GET /api/v1/kvk/:id/rankings`

- Event Management:
  - `GET /api/v1/events`
  - `POST /api/v1/events`
  - `POST /api/v1/events/:id/register`
  - `GET /api/v1/events/:id/participants`

- Donation & KDP:
  - `GET /api/v1/donations`
  - `POST /api/v1/donations`
  - `GET /api/v1/donations/leaderboard`
  - `POST /api/v1/kdp` (input KDP data)
  - `GET /api/v1/kdp/history`

- Content Management:
  - `GET /api/v1/blog`
  - `POST /api/v1/blog`
  - `GET /api/v1/gallery`
  - `POST /api/v1/gallery/upload`
  - `GET /api/v1/forms`
  - `POST /api/v1/forms/:id/submit`

**Development Roadmap**
1. Setup theme & styling dengan medieval design system (1 hari)
2. Implement authentication & role-based access control (1 hari)
3. Build admin dashboard dengan 10 fitur management (3 hari)
4. Build public pages dengan 10 fitur pengunjung (3 hari)
5. Discord webhook integration untuk notifikasi (0.5 hari)
6. Mobile optimization & responsive design (1 hari)
7. Testing & bug fixing (1 hari)

**Acceptance Criteria**
- Theme medieval teraplikasi dengan color scheme sesuai plan.txt
- 10 fitur admin fully functional (User, Bank, Event, Gallery, Form, KvK, Donation, Blog, Blacklist, KDP)
- 10 fitur publik accessible (Landing, KvK, Event, Giveaway, Form, Donation, About, YouTube, Blog, Laws)
- Discord webhook mengirim notifikasi untuk event penting
- Mobile-first responsive design
- Role-based access control berfungsi dengan baik
- Audit trail mencatat semua admin actions

Referensi: lihat `plan.txt` di root projek untuk struktur menu lengkap.

---

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
- **Feature-Based Routes**: Organize by kingdom features
  ```
  /api/v1/auth/          # Authentication & authorization
  /api/v1/users/         # User management (admin only)
  /api/v1/kvk/           # Kingdom vs Kingdom battles
  /api/v1/events/        # Event management
  /api/v1/donations/     # Donation tracking
  /api/v1/kdp/           # Kingdom Defense Points
  /api/v1/blog/          # Blog & news
  /api/v1/gallery/       # Media gallery
  /api/v1/forms/         # Dynamic forms
  /api/v1/blacklist/     # Blacklist management (admin only)
  /api/v1/giveaway/      # Giveaway management
  ```
- **RESTful**: Follow REST conventions
- **Authentication**: JWT-based with role checking middleware (admin, member, visitor)
- **Error Handling**: Consistent JSON error responses
- **Discord Integration**: Webhook notifications for key events

- **Business Context**: This project is a Kingdom 3946 community management application for Rise of Kingdoms game. Focus on gaming community features, leaderboards, and social engagement.
- **Audit Trail**: All admin actions must be logged (who, what, when) for accountability
- **Role-Based Access**: Strict permission checking on all admin endpoints
- **Testing**: Jest for unit tests, Cypress for E2E

## Security Guidelines
- **Input Validation**: Sanitize all user inputs
- **CORS**: Configure properly for production
- **Rate Limiting**: Implement API rate limiting
- **SQL Injection**: Use parameterized queries
- **XSS Protection**: Implement content security policies

## Performance Guidelines
- **Code Splitting**: Implement dynamic imports
- **Caching**: Implement appropriate caching strategies
- **Bundle Size**: Monitor and optimize bundle size

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
REACT_APP_API_URL=http://localhost:5000
REACT_APP_NAME=Kingdom 3946
REACT_APP_DISCORD_INVITE=your_discord_invite_link

# Backend (.env)
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=kingdom3946
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
DISCORD_WEBHOOK_URL=your_webhook_url
```

## Kingdom 3946 Specific Features

### Admin Features (10 Fitur Admin)
1. **User Management**: CRUD users, role assignment, activity logs
2. **Bank Management**: Sistem perbankan kingdom (opsional untuk donasi)
3. **Event Management**: Create, schedule, manage kingdom events
4. **Gallery Management**: Upload, organize media (photos, videos)
5. **Form Management**: Form builder, submissions, export data
6. **KvK Management**: Kingdom vs Kingdom schedules, scores, rankings
7. **Donation Management**: Track donations, leaderboard, history
8. **Blog Management**: Articles, news, categories, SEO
9. **Blacklist Manager**: Database pemain bermasalah, appeal system
10. **Input Data KDP**: Manual KDP entry, import, validation, history

### Public Features (10 Fitur Pengunjung)
1. **Landing Page**: Homepage
2. **KvK**: Jadwal, live scores, historical results, hall of fame
3. **Event**: Kalender event, rules, registration, winners
4. **Giveaway**: Active giveaways, participation forms, winners
5. **Form**: Member registration, alliance application, feedback
6. **Donation**: Info sistem donasi, leaderboard, progress
7. **About Kingdom**: History, organization, rules, vision/mission
8. **YouTube**: Video gallery, tutorials, battle highlights
9. **Blog**: Articles, strategy guides, community stories
10. **Laws**: Aturan kingdom, code of conduct, punishments, FAQs

### Discord Integration
- **Webhook Notifications**: Auto-notify Discord channel untuk:
  - Aplikasi member baru
  - KvK results update
  - Event registrations
  - New giveaway winners
  - Important announcements
- **Format**: Use Discord embeds dengan colors sesuai theme (gold, red)

Remember: Always prioritize mobile user experience (90% pemain via HP) and ensure role-based security in all development decisions.