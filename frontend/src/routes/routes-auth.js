import React from "react";
import SignIn from "views/auth/SignIn";
import Homepage from "views/auth/Homepage";
import NavbarSettings from "views/auth/NavbarSettings";
import About from "views/auth/About";
import Contact from "views/auth/Contact";
import Features from "views/auth/Features";
import Members from "views/members/Members";
import Deposits from "views/deposits/Deposits";
import Reports from "views/reports/Reports";
// Icon Imports
import {
    MdLock,
    MdSettings,
    MdHome,
    MdInfo,
    MdEmail,
    MdStarRate,
    MdPersonAdd,
    MdFeatures,
    MdAttachMoney,
    MdRateReview,
    MdArticle,
    MdSupport,
    MdSecurity,
    MdBusiness,
} from "react-icons/md";
import { 
    FaRocket, 
    FaUsers, 
    FaChartLine,
    FaDollarSign,
    FaQuoteLeft,
    FaNewspaper,
    FaQuestionCircle,
    FaLightbulb
} from "react-icons/fa";

const routes = [
    // Landing Page - Main entry point
    {
        name: "Beranda",
        layout: "/auth",
        path: "homepage",
        icon: <MdHome className="h-6 w-6" />,
        component: <Homepage />,
        showInNavbar: true,
        isDefault: true,
    },

    // Authentication
    {
        name: "Masuk",
        layout: "/auth",
        path: "sign-in",
        icon: <MdLock className="h-6 w-6" />,
        component: <SignIn />,
        showInNavbar: true,
    },
    {
        name: "Daftar",
        layout: "/auth",
        path: "sign-up",
        icon: <MdPersonAdd className="h-6 w-6" />,
        component: <SignIn />,
        showInNavbar: false,
    },

    // Project-specific sections (SF BANK / PRIMA)
    {
        name: "Anggota",
        layout: "/auth",
        path: "members",
        icon: <FaUsers className="h-6 w-6" />,
        component: <Members />,
        showInNavbar: true,
        description: "Daftar anggota / pemain dan informasi profil",
    },
    {
        name: "Setoran",
        layout: "/auth",
        path: "deposits",
        icon: <FaDollarSign className="h-6 w-6" />,
        component: <Deposits />,
        showInNavbar: true,
        description: "Input dan laporan setoran mingguan",
    },
    
    {
        name: "Laporan",
        layout: "/auth",
        path: "reports",
        icon: <FaChartLine className="h-6 w-6" />,
        component: <Reports />,
        showInNavbar: true,
        description: "Laporan per minggu dan rentang minggu",
    },

    // Public / About / Docs
    {
        name: "Tentang",
        layout: "/auth",
        path: "about",
        icon: <MdInfo className="h-6 w-6" />,
        component: <About />,
        showInNavbar: true,
        description: "Tentang proyek dan panduan singkat",
    },
    // Documentation removed per request
    {
        name: "Kontak",
        layout: "/auth",
        path: "contact",
        icon: <MdEmail className="h-6 w-6" />,
        component: <Contact />,
        showInNavbar: true,
        description: "Hubungi pengembang / tim support",
    },

    // Utility / Dev
    {
        name: "Pengaturan Navbar",
        layout: "/auth",
        path: "navbar-settings",
        icon: <MdSettings className="h-6 w-6" />,
        component: <NavbarSettings />,
        showInNavbar: false,
        description: "Konfigurasi tampilan navbar (dev)",
    },
];

// Helper functions untuk filtering routes
export const getNavbarRoutes = () => {
    return routes.filter(route => route.showInNavbar === true);
};

export const getMainRoutes = () => {
    return routes.filter(route => ['homepage', 'about', 'features', 'pricing', 'contact'].includes(route.path));
};

export const getAuthRoutes = () => {
    return routes.filter(route => ['sign-in', 'sign-up'].includes(route.path));
};

export const getDefaultRoute = () => {
    return routes.find(route => route.isDefault === true) || routes[0];
};

export const getRouteByPath = (path) => {
    return routes.find(route => route.path === path);
};

// Export semua routes untuk layout dan router configuration
export default routes;