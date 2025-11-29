import React from "react";
import SignIn from "views/auth/SignIn";
import Homepage from "views/auth/Homepage";
import NavbarSettings from "views/auth/NavbarSettings";
import About from "views/auth/About";
import Contact from "views/auth/Contact";
import Features from "views/auth/Features";
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
        isDefault: true, // Set as default route
    },
    
    // Authentication Routes
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
        component: <SignIn />, // Bisa dibuat komponen SignUp terpisah
        showInNavbar: true,
    },
    
    // Public Information Pages
    {
        name: "Tentang Kami",
        layout: "/auth",
        path: "about",
        icon: <MdInfo className="h-6 w-6" />,
        component: <About />,
        showInNavbar: true,
        description: "Pelajari lebih lanjut tentang Prima dan visi kami"
    },
    {
        name: "Fitur",
        layout: "/auth",
        path: "features",
        icon: <FaRocket className="h-6 w-6" />,
        component: <Features />, // Komponen untuk halaman fitur detail
        showInNavbar: true,
        description: "Jelajahi semua fitur unggulan Prima"
    },
    {
        name: "Harga",
        layout: "/auth",
        path: "pricing",
        icon: <MdAttachMoney className="h-6 w-6" />,
        component: <Homepage />, // Bisa scroll ke section pricing atau komponen terpisah
        showInNavbar: true,
        description: "Pilih paket yang sesuai dengan kebutuhan Anda"
    },
    {
        name: "Testimonial",
        layout: "/auth",
        path: "testimonials",
        icon: <FaQuoteLeft className="h-6 w-6" />,
        component: <Homepage />, // Bisa scroll ke section testimonial
        showInNavbar: false, // Tidak perlu di navbar, ada di homepage
        description: "Dengarkan pengalaman klien kami"
    },
    
    // Contact & Support
    {
        name: "Kontak",
        layout: "/auth",
        path: "contact",
        icon: <MdEmail className="h-6 w-6" />,
        component: <Contact />,
        showInNavbar: true,
        description: "Hubungi tim kami untuk bantuan dan konsultasi"
    },
    {
        name: "Bantuan",
        layout: "/auth",
        path: "help",
        icon: <FaQuestionCircle className="h-6 w-6" />,
        component: <Contact />, // Bisa dibuat komponen Help/FAQ terpisah
        showInNavbar: false,
        description: "Pusat bantuan dan FAQ"
    },
    
    // Blog & Resources (Optional)
    {
        name: "Blog",
        layout: "/auth",
        path: "blog",
        icon: <FaNewspaper className="h-6 w-6" />,
        component: <Homepage />, // Bisa dibuat komponen Blog terpisah
        showInNavbar: false,
        description: "Artikel dan insights terbaru"
    },
    {
        name: "Karier",
        layout: "/auth",
        path: "careers",
        icon: <MdBusiness className="h-6 w-6" />,
        component: <About />, // Bisa dibuat komponen Careers terpisah
        showInNavbar: false,
        description: "Bergabunglah dengan tim Prima"
    },
    
    // Legal Pages (Optional)
    {
        name: "Kebijakan Privasi",
        layout: "/auth",
        path: "privacy",
        icon: <MdSecurity className="h-6 w-6" />,
        component: <About />, // Bisa dibuat komponen Privacy terpisah
        showInNavbar: false,
        description: "Kebijakan privasi dan perlindungan data"
    },
    {
        name: "Syarat Layanan",
        layout: "/auth",
        path: "terms",
        icon: <MdArticle className="h-6 w-6" />,
        component: <About />, // Bisa dibuat komponen Terms terpisah
        showInNavbar: false,
        description: "Syarat dan ketentuan penggunaan"
    },
    
    // Demo & Trial
    {
        name: "Demo Produk",
        layout: "/auth",
        path: "demo",
        icon: <FaLightbulb className="h-6 w-6" />,
        component: <Homepage />, // Bisa trigger video modal atau halaman demo
        showInNavbar: false,
        description: "Lihat demo produk Prima"
    },
    
    // Settings/Configuration (for navbar customization, etc)
    {
        name: "Pengaturan Navbar",
        layout: "/auth",
        path: "navbar-settings",
        icon: <MdSettings className="h-6 w-6" />,
        component: <NavbarSettings />,
        showInNavbar: false, // Hidden utility route
        description: "Konfigurasi tampilan navbar"
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