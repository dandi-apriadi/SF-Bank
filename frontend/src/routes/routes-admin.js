import React from "react";
import {
  FiHome,
  FiCheckCircle,
  FiAward,
  FiTarget,
  FiUsers,
  FiFileText
} from "react-icons/fi";

// Main Dashboard Components
import UnitDashboard from "views/ppmpp/dashboard/UnitDashboard";

// Document Validation Components
import DocumentValidation from "views/ppmpp/validation/DocumentValidation";

// Accreditation Instrument Management Components
import AccreditationInstruments from "views/ppmpp/accreditation/AccreditationInstruments";

// Follow-up Action Tracking Components
import ActionTracking from "views/ppmpp/tracking/ActionTracking";

// Quality Assurance Components
import QualityAssurance from "views/ppmpp/quality/QualityAssurance";
// News Management Component
import NewsManagement from "views/ppmpp/news/NewsManagement";
// User Management Component
import UserManagement from "views/ppmpp/users/UserManagement";

const routes = [
  // ============================================
  // UNIVERSITY-WIDE DASHBOARD (dengan semua analitik dan overview terintegrasi)
  // ============================================
  {
    name: "Dashboard Universitas",
    layout: "/ppmpp",
    path: "dashboard",
    icon: <FiHome className="h-6 w-6" />,
    component: <UnitDashboard />,
  },
  
  // ============================================
  // DOCUMENT VALIDATION (semua validasi dalam satu menu)
  // ============================================
  {
    name: "Validasi Dokumen",
    layout: "/ppmpp",
    path: "validation",
    icon: <FiCheckCircle className="h-6 w-6" />,
    component: <DocumentValidation />,
  },
  
  // ============================================
  // ACCREDITATION INSTRUMENTS (semua instrumen dalam satu menu)
  // ============================================
  {
    name: "Instrumen Akreditasi",
    layout: "/ppmpp",
    path: "accreditation",
    icon: <FiAward className="h-6 w-6" />,
    component: <AccreditationInstruments />,
  },
  
  // ============================================
  // ACTION TRACKING (semua tracking dalam satu menu)
  // ============================================
  {
    name: "Pelacakan Tindakan",
    layout: "/ppmpp",
    path: "tracking",
    icon: <FiTarget className="h-6 w-6" />,
    component: <ActionTracking />,
  },
  
  // ============================================
  // QUALITY ASSURANCE (semua QA dalam satu menu)
  // ============================================
  {
    name: "Jaminan Mutu",
    layout: "/ppmpp",
    path: "quality",
    icon: <FiCheckCircle className="h-6 w-6" />,
    component: <QualityAssurance />,
  },
  
  // ============================================
  // NEWS MANAGEMENT (manajemen berita & pengumuman)
  // ============================================
  {
    name: "Manajemen Berita",
    layout: "/ppmpp",
    path: "news",
    icon: <FiFileText className="h-6 w-6" />,
    component: <NewsManagement />,
  },
  // ============================================
  // USER MANAGEMENT (kelola akun & peran)
  // ============================================
  {
    name: "Manajemen User",
    layout: "/ppmpp",
    path: "users",
    icon: <FiUsers className="h-6 w-6" />,
    component: <UserManagement />,
  },
];

export default routes;