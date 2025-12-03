import React from "react";
import {
  FiHome,
  FiUsers,
  FiDollarSign,
  FiUpload,
  FiBarChart2,
  FiFileText,
  FiSettings,
} from "react-icons/fi";

// Admin views (SF BANK)
import Dashboard from "views/admin/Dashboard";
import Deposits from "views/admin/Deposits";
import Reports from "views/admin/Reports";
import UserManagement from "views/admin/UserManagement";
import Settings from "views/admin/Settings";

// Routes aligned with SF BANK plan
const routes = [
  {
    name: "Dashboard",
    layout: "/admin",
    path: "dashboard",
    icon: <FiHome className="h-6 w-6" />,
    component: <Dashboard />,
  },


  {
    name: "Deposits",
    layout: "/admin",
    path: "deposits",
    icon: <FiDollarSign className="h-6 w-6" />,
    component: <Deposits />,
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
    name: "Settings",
    layout: "/admin",
    path: "settings",
    icon: <FiSettings className="h-6 w-6" />,
    component: <Settings />,
  },
];

export default routes;