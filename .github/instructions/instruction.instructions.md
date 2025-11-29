---
applyTo: '**'
---

# PRIMA (Platform Integrasi Manajemen Mutu Akademik) - Development Guidelines

## Project Overview
PRIMA is a comprehensive web application for academic quality management and accreditation processes. T- **Performance benchmarking against other institutions

## Specific Features Implementation

### Public Landing Page
- **Information Section**: About PRIMA, features overview, development team
- **Multi-role Login**: Separate login buttons/sections for each user role
- **Contact Information**: Support and contact details
- **Professional Design**: Academic-focused imagery from Unsplash

### Data Integration Features
- **PDDIKTI Integration**: Connect with feeder PDDIKTI for data synchronization
- **SIM Akademik Integration**: Connect with academic information systems
- **Spreadsheet Import**: Support for internal data from Excel/CSV files
- **Data Reconciliation**: Automatic checking and validation of data consistency

### Accreditation Simulation
- **Estimation Calculator**: Calculate projected final accreditation scores
- **Gap Analysis**: Identify areas needing improvement
- **Progress Tracking**: Monitor completion status of accreditation criteria
- **Scenario Modeling**: Test different improvement scenarios
- **Accreditation Score Prediction**: Advanced scoring algorithm for final accreditation estimation

### Document Management Features
- **Version Control**: Track document revisions and changes
- **Auto-tagging**: Automatically assign documents to accreditation criteria
- **Template System**: Pre-built templates for common documents
- **Export Functionality**: Generate Word/PDF exports with proper formatting

### Notification System
- **Role-based Notifications**: Targeted alerts for each user type
- **Task Reminders**: Automated reminders for pending tasks
- **Progress Alerts**: Notifications for milestone completion
- **System Announcements**: Institution-wide communication

### Analytics & Reporting
- **Real-time Dashboards**: Live data visualization for all roles
- **Custom Reports**: User-defined report generation
- **Heatmap Visualizations**: Problem area identification
- **Trend Analysis**: Historical data tracking and forecastinge system supports multi-role access for Lecturers, Study Program Coordinators, PPMPP Units, and Institutional Leaders.

## Tech Stack
- **Frontend**: Next.js with TypeScript
- **Styling**: TailwindCSS + AOS (Animate On Scroll)
- **Backend**: Node.js/Express with TypeScript
 - **Database**: MySQL (recommended: 8.x). Use a managed MySQL for production or a local Docker Compose MySQL for development.

## Database Guidelines (MySQL)

- **Storage Choice**: Use MySQL for core application data (members, deposits, audit logs). Avoid storing primary data in CSV files for production.
- **ORM / Migrations**: Use `sequelize` + `sequelize-cli` (or `knex` + `objection.js`) to manage models, migrations, and seeders. Keep migration files under `backend/migrations/` and seeders under `backend/seeders/`.
- **Configuration**: Add `backend/config/database.js` that reads these environment variables:
  - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_POOL_MAX`, `DB_POOL_MIN`
- **Schema**: Start with `members` and `deposits` tables (see project plan). Enforce foreign keys and sensible indexes (`deposits.member_id`, `deposits.week`).
- **Import & Migration from CSV**: Provide a script `backend/scripts/import_csv_to_mysql.js` to import legacy CSV data into MySQL with `--dry-run` and per-row error logging.
- **Dev Environment**: Provide `docker-compose.yml` with a `db` service (MySQL) and a named volume for persistence. Document how to start and connect.
- **Backup & Recovery**: Schedule `mysqldump` or `mysqlpump` tasks for backups; include a local helper script `scripts/backup_mysql.sh` for developers.
- **Security & Ops**: Use parameterized queries, limit DB user privileges, and document migration/rollback procedures. Monitor slow queries and use connection pooling.


## Design Guidelines

### UI/UX Standards
- **Professional & Modern**: Follow industry-standard design principles
- **Responsive Design**: Mobile-first approach using TailwindCSS breakpoints
- **Accessibility**: WCAG 2.1 AA compliance
- **Color Scheme**: Use professional blues, grays, and neutral tones
- **Typography**: Clean, readable fonts with proper hierarchy

### TailwindCSS Guidelines
- **MANDATORY**: Use TailwindCSS for ALL styling
- **FORBIDDEN**: Never use `emerald` color classes
- **Preferred Colors**: 
  - Primary: `blue-600`, `blue-700`, `blue-800`
  - Secondary: `slate-600`, `slate-700`, `slate-800`
  - Success: `green-600`, `green-700`
  - Warning: `amber-500`, `amber-600`
  - Error: `red-600`, `red-700`
  - Neutral: `gray-100` to `gray-900`
- **Spacing**: Use consistent spacing scale (4, 8, 12, 16, 20, 24, 32, 48, 64)
- **Components**: Create reusable component classes when patterns repeat

### Animation Standards
- **MANDATORY**: Use AOS library for scroll animations
- **Performance**: Keep animations smooth and purposeful
- **Types**: Fade, slide, zoom effects for content reveal
- **Duration**: 300-800ms for optimal UX
- **Easing**: Use natural easing functions

## Code Structure

### Frontend Architecture (Role-Based)
```
frontend/src/
├── components/
│   ├── ui/           # Reusable UI components (Button, Card, Modal)
│   ├── layout/       # Layout components (Navbar, Sidebar, Footer)
│   ├── forms/        # Form components (DocumentUpload, EvaluationForm, CriteriaForm)
│   ├── dashboard/    # Dashboard components (StatsCard, ProgressChart, KPIWidget)
│   ├── accreditation/# Accreditation specific components (CriteriaEditor, EvidenceManager)
│   └── analytics/    # Analytics and visualization components (GapAnalysis, Heatmap)
├── pages/            # Role-specific pages
│   ├── public/       # Landing page and public information
│   ├── dosen/        # Lecturer pages
│   │   ├── dashboard/      # Learning indicators, notifications
│   │   ├── documents/      # RPS upload, document management
│   │   ├── evaluation/     # Self-evaluation forms
│   │   └── training/       # Video tutorials, FAQ
│   ├── koordinator/  # Coordinator pages
│   │   ├── dashboard/      # PPEPP progress, study program overview
│   │   ├── accreditation/  # Criteria management, LED templates
│   │   ├── evidence/       # Evidence management and tagging
│   │   ├── analytics/      # Gap analysis, performance metrics
│   │   └── users/          # Limited user management
│   ├── ppmpp/        # PPMPP unit pages (renamed from 'unit')
│   │   ├── dashboard/      # University-wide overview
│   │   ├── validation/     # Document validation workflows
│   │   ├── instruments/    # Accreditation instrument management
│   │   ├── follow-up/      # Action tracking and monitoring
│   │   ├── analytics/      # Institutional analytics and heatmaps
│   │   └── admin/          # System administration
│   └── pimpinan/     # Leadership pages
│       ├── dashboard/      # Executive dashboard, KPIs
│       ├── reports/        # Automated report generation
│       └── analytics/      # Strategic decision support
├── services/         # API service layer with base URL from env
├── hooks/            # Custom React hooks (useAuth, useApi, useDashboard, useAccreditation)
├── stores/           # Redux slices (auth, documents, dashboard, accreditation, analytics)
├── types/            # TypeScript interfaces (User, Document, API, Accreditation, Evidence)
├── utils/            # Utility functions (formatters, validators, exporters)
└── styles/           # TailwindCSS styles with AOS animations
```

### Backend Architecture (Role-Based API)
```
backend/
├── controllers/      # Role-based controllers
│   ├── auth/         # Authentication controllers
│   ├── dosen/        # Lecturer controllers
│   │   ├── dashboardController.js    # Learning indicators, notifications
│   │   ├── documentsController.js    # RPS, document management
│   │   ├── evaluationController.js   # Self-evaluation forms
│   │   └── trainingController.js     # Tutorial access
│   ├── koordinator/  # Coordinator controllers
│   │   ├── dashboardController.js    # PPEPP monitoring
│   │   ├── accreditationController.js # Criteria management
│   │   ├── evidenceController.js     # Evidence management
│   │   ├── analyticsController.js    # Gap analysis
│   │   └── usersController.js        # Limited user management
│   ├── ppmpp/        # PPMPP controllers
│   │   ├── dashboardController.js    # University-wide overview
│   │   ├── validationController.js   # Document validation
│   │   ├── instrumentsController.js  # Accreditation instruments
│   │   ├── followUpController.js     # Action tracking
│   │   ├── analyticsController.js    # Institutional analytics
│   │   └── adminController.js        # System administration
│   └── pimpinan/     # Leadership controllers
│       ├── dashboardController.js    # Executive dashboard
│       ├── reportsController.js      # Automated reports
│       └── analyticsController.js    # Decision support
├── routes/
│   └── api/v1/       # Versioned API routes (/api/v1/*)
│       ├── auth/     # Authentication routes
│       ├── dosen/    # Lecturer endpoints
│       ├── koordinator/ # Coordinator endpoints
│       ├── ppmpp/    # PPMPP unit endpoints
│       └── pimpinan/ # Leadership endpoints
├── services/         # Business logic layer
│   ├── accreditationService.js  # Accreditation business logic
│   ├── evidenceService.js       # Evidence management
│   ├── analyticsService.js      # Analytics calculations
│   ├── reportService.js         # Report generation
│   └── integrationService.js    # PDDIKTI integration
├── middleware/       # Auth, role-check, validation middleware
├── models/           # Database models
│   ├── User.js              # User model with roles
│   ├── Document.js          # Document management
│   ├── Accreditation.js     # Accreditation criteria
│   ├── Evidence.js          # Evidence linking
│   ├── Evaluation.js        # Self-evaluation data
│   ├── FollowUp.js          # Action tracking
│   └── Report.js            # Generated reports
├── utils/            # Helper functions and constants
└── config/           # Database and application configuration
```

## User Roles & Features

### 1. Dosen (Lecturer)
**Dashboard Features:**
- Learning indicators summary
- Task notifications for accreditation (e.g., "Upload RPS for Even Semester")
- Quick access to pending evaluations

**Document Management:**
- Upload documents: RPS (Semester Learning Plan), self-evaluation forms
- Auto-tagging to accreditation criteria
- Document version control and history

**Self-Evaluation:**
- Course-level self-evaluation forms
- Progress tracking for evaluation completion
- Integration with accreditation standards

**Training & Guidance:**
- Access to video tutorials
- Interactive FAQ system
- Best practices and guidelines library

### 2. Koordinator Prodi (Study Program Coordinator)
**Dashboard Features:**
- PPEPP cycle progress monitoring for each course and lecturer in the study program
- Study program self-evaluation summary reports
- Alert system for incomplete accreditation criteria

**Accreditation Management:**
- **Criteria/Standards Module**: Dedicated pages for each accreditation criterion (Criteria 1, 2, etc.)
  - Narrative input forms for each criterion
  - Document upload and evidence linking
  - Progress tracking per criterion
- **Evidence Management**: Upload, tag, and track quality and accreditation documents
- **Interactive LED Templates**: Fill out forms directly in the application with auto-save and export to Word/PDF
- **Accreditation Preparation Monitoring**: Progress bars and notifications for incomplete criteria
- **Data Reconciliation**: Check synchronization between internal data and PDDIKTI

**Analytics & Reports:**
- Gap analysis features for accreditation readiness
- PPEPP monitoring per course and lecturer
- Performance metrics and quality indicators

**User Management (Limited):**
- Manage lecturer roles within the study program
- Assign evaluation tasks and responsibilities

### 3. Unit PPMPP (Quality Assurance Unit)
**Dashboard Features:**
- University-wide dashboard covering all departments/study programs
- Quality evaluation implementation statistics per study program
- Institution-level quality metrics and trends

**Document Validation & Management:**
- **Document Validation Workflows**: Checklist features to ensure all evidence and narratives are complete
- **Accreditation Instrument Management**: Set instrument types (BAN-PT, LAM) at application setup
- **Revision History & Tracking**: View LED/Form editing history and track changes
- Document approval and rejection workflows

**Follow-up Action Management:**
- Store and monitor improvements from reviewer recommendations after visitation
- Action item tracking and completion status
- Follow-up scheduling and reminder system

**Analytics & Visualization:**
- Quality achievement graphs and heatmaps of problematic study programs
- Institutional performance dashboards
- Trend analysis and predictive insights

**System Administration:**
- Manage all user accounts across the university
- System configuration and settings management
- Data backup and security monitoring

### 4. Pimpinan Institusi (Institutional Leadership)
**Executive Dashboard:**
- Overall institutional quality indicators
- Achievement graphs, violations, and gap analysis
- Key performance indicators (KPI) summary
- Strategic decision support visualizations

**Automated Reporting:**
- Download validated LED/Form reports automatically
- Executive summary reports generation
- Custom report builder for specific metrics

**Decision Support:**
- Data visualization focused on strategic decision-making
- Comparative analysis across study programs
- Budget allocation recommendations based on quality metrics
- Performance benchmarking against other institutions

## Indonesian Academic Context & Terminology

### Key Terms & Acronyms
- **PRIMA**: Platform Integrasi Manajemen Mutu Akademik
- **PPMPP**: Penjaminan, Pengendalian, dan Peningkatan Mutu Perguruan Tinggi (Quality Assurance Unit)
- **PPEPP**: Penetapan, Pelaksanaan, Evaluasi, Pengendalian, dan Peningkatan (Quality cycle)
- **RPS**: Rencana Pembelajaran Semester (Semester Learning Plan)
- **LED**: Laporan Evaluasi Diri (Self-Evaluation Report)
- **BAN-PT**: Badan Akreditasi Nasional Perguruan Tinggi
- **LAM**: Lembaga Akreditasi Mandiri
- **PDDIKTI**: Pangkalan Data Pendidikan Tinggi
- **NIP**: Nomor Induk Pegawai (Employee ID)
- **NIDN**: Nomor Induk Dosen Nasional (National Lecturer ID)

### Academic Structure Context
- **Dosen**: University lecturers responsible for teaching and research
- **Koordinator Prodi**: Study Program Coordinators managing academic programs
- **Prodi**: Program Studi (Study Program/Academic Program)
- **Fakultas**: Faculty (academic division)
- **Universitas**: University (institutional level)

### Quality Assurance Process
- **Akreditasi**: Accreditation process for quality certification
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
  /api/v1/dosen/         # Lecturer endpoints
  /api/v1/koordinator/   # Coordinator endpoints
  /api/v1/ppmpp/         # PPMPP unit endpoints
  /api/v1/pimpinan/      # Leadership endpoints
  ```
- **RESTful**: Follow REST conventions
- **Authentication**: JWT-based with role checking middleware
- **Error Handling**: Consistent JSON error responses

## Development Standards

### Code Quality
- **TypeScript**: Strict mode enabled
- **ESLint**: Follow configured rules
- **Prettier**: Auto-formatting enabled
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
- **Error Boundaries**: Implement error handling

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
NEXT_PUBLIC_APP_NAME=PRIMA

# Backend (.env)
NODE_ENV=development
PORT=5000
DB_CONNECTION_STRING=your_db_connection
JWT_SECRET=your_jwt_secret
```

Remember: Always prioritize user experience, code maintainability, and scalability in all development decisions.