# PIMPINAN (DIREKTUR) Module - Simplified Structure

## Overview
Struktur menu untuk role Pimpinan Institusi telah disederhanakan sesuai dengan kebutuhan inti sistem PRIMA dan fokus pada pengambilan keputusan strategis serta oversight mutu akademik.

## Menu Structure

### 1. Dashboard Eksekutif
- **File**: `dashboard/DirectorDashboard.jsx`
- **Fungsi**: KPI institusional, overview strategis, indikator kinerja utama, summary mutu akademik

### 2. Indikator Mutu
- **Main File**: `quality-indicators/QualityIndicators.jsx`
- **Sub-menu**:
  - `quality-indicators/AcademicQuality.jsx` - Indikator mutu akademik institusional
  - `quality-indicators/AccreditationStatus.jsx` - Status akreditasi program studi dan institusi

### 3. Laporan Eksekutif
- **Main File**: `reports/ExecutiveReports.jsx`
- **Sub-menu**:
  - `reports/AutomatedReports.jsx` - Laporan otomatis dan terjadwal untuk pimpinan

### 4. Ikhtisar Institusi
- **Main File**: `institutional/InstitutionalOverview.jsx`
- **Sub-menu**:
  - `institutional/UniversityPerformance.jsx` - Kinerja universitas secara keseluruhan
  - `institutional/StudyProgramStatus.jsx` - Status dan ranking program studi

## Files & Folders Removed
Folder dan file berikut telah dihapus karena terlalu teknis atau detail untuk level pimpinan:

### Folders Completely Removed:
- `decision-making/` - Decision support, data visualizations, trend analysis, comparative analysis, predictive analytics
- `monitoring/` - Real-time monitoring, alerts & notifications, action tracking

### Individual Files Removed:
- `quality-indicators/PerformanceMetrics.jsx` - Terlalu detail untuk level eksekutif
- `quality-indicators/ComplianceTracking.jsx` - Terlalu teknis untuk overview pimpinan
- `reports/CustomReports.jsx` - Pimpinan cukup akses laporan standard
- `reports/ReportScheduler.jsx` - Fitur scheduling diintegrasikan ke AutomatedReports
- `reports/ReportAnalytics.jsx` - Analytics terintegrasi di dashboard utama
- `institutional/ResourceAllocation.jsx` - Terlalu detail untuk overview eksekutif
- `institutional/StrategicPlanning.jsx` - Planning tools diintegrasikan ke dashboard

## Key Principles Applied:
1. **Executive Focus**: Menu disesuaikan untuk level strategis, bukan operasional
2. **Strategic Overview**: Fokus pada indikator tingkat tinggi dan pengambilan keputusan
3. **Simplified Reporting**: Hanya laporan eksekutif dan otomatis yang relevan
4. **Quality Focus**: Prioritas pada mutu akademik dan status akreditasi
5. **Indonesian Context**: Terminologi dalam Bahasa Indonesia untuk konteks lokal

## Route Configuration:
The simplified routes are configured in `routes/routes-pimpinan.js` with:
- 4 main menu items (Dashboard Eksekutif, Indikator Mutu, Laporan Eksekutif, Ikhtisar Institusi)
- 5 sub-menu items total
- Focus on strategic decision support and institutional oversight

## Target Users:
- Rektor/Direktur
- Wakil Rektor
- Dekan
- Senior leadership team

## Key Features for Leadership:
- **Strategic KPIs**: Overall institutional performance indicators
- **Accreditation Oversight**: University-wide accreditation status and progress
- **Executive Reporting**: Automated reports for strategic decision making
- **Institutional Performance**: Cross-program performance comparison
- **Quality Assurance**: High-level quality indicators and compliance status
