import React from "react";
import {
  FiHome,
  FiUsers,
  FiDollarSign,
  FiUpload,
  FiBarChart2,
  FiFileText,
  FiActivity,
} from "react-icons/fi";
import { GiCastle } from "react-icons/gi";

// Admin views (SacredBank)
import Dashboard from "views/admin/Dashboard";
import Reports from "views/admin/Reports";
import UserManagement from "views/admin/UserManagement";
import Alliance from "views/admin/Alliance";
import AllianceDetail from "views/admin/AllianceDetail";
import AuditLogs from "views/admin/AuditLogs";

// Routes aligned with SacredBank plan
const routes = [
  {
    name: "Dashboard",
    layout: "/admin",
    path: "dashboard",
    icon: <FiHome className="h-6 w-6" />,
    component: <Dashboard />,
  },


  {
    name: "Reports",
    layout: "/admin",
    path: "reports",
    icon: <FiBarChart2 className="h-6 w-6" />,
    component: <Reports />,
  },

  {
    name: "User Management",
    layout: "/admin",
    path: "users",
    icon: <FiUsers className="h-6 w-6" />,
    component: <UserManagement />,
  },

  {
    name: "Alliance",
    layout: "/admin",
    path: "alliance",
    icon: <GiCastle className="h-6 w-6" />,
    component: <Alliance />,
  },

  {
    name: "Alliance Detail",
    layout: "/admin",
    path: "alliance/:id",
    component: <AllianceDetail />,
    invisible: true, // Don't show in sidebar
  },

  {
    name: "Audit Logs",
    layout: "/admin",
    path: "audit-logs",
    icon: <FiActivity className="h-6 w-6" />,
    component: <AuditLogs />,
  },
];

export default routes;