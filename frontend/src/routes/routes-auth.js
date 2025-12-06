import React from "react";
import SignIn from "views/auth/SignIn";
import Homepage from "views/auth/Homepage";
import NavbarSettings from "views/auth/NavbarSettings";
import About from "views/auth/About";
import Contact from "views/auth/Contact";
import Laws from "views/auth/Laws";
import Forms from "views/auth/Forms";
import JoinKingdom from "views/auth/JoinKingdom";
import Giveaway from "views/auth/Giveaway";
import KvK from "views/auth/KvK";
import Bank from "views/auth/Bank";
import Donation from "views/auth/Donation";
// Sacred3946 Icon Imports
import {
    MdLock,
    MdSettings,
    MdPersonAdd,
    MdEvent,
    MdGavel,
} from "react-icons/md";
import { 
    GiCastle,
    GiCrossedSwords,
    GiScrollUnfurled,
    GiCrown,
    GiTwoCoins,
} from "react-icons/gi";
import {
    FiGift,
    FiYoutube,
    FiBookOpen,
    FiHeart,
} from "react-icons/fi";

const routes = [
    // 1. Landing Page - Main entry point (Homepage dengan hero banner medieval)
    {
        name: "Home",
        layout: "/auth",
        path: "homepage",
        icon: <GiCastle className="h-6 w-6" />,
        component: <Homepage />,
        showInNavbar: true,
        isDefault: true,
        description: "Sacred3946 Homepage",
    },

    // 2. KvK (Kingdom vs Kingdom)
    {
        name: "KvK",
        layout: "/auth",
        path: "kvk",
        icon: <GiCrossedSwords className="h-6 w-6" />,
        component: <KvK />,
        showInNavbar: true,
        description: "Kingdom vs Kingdom battles",
    },

    // 3. Bank (Kingdom treasury and donations)
    {
        name: "Bank",
        layout: "/auth",
        path: "bank",
        icon: <GiTwoCoins className="h-6 w-6" />,
        component: <Bank />,
        showInNavbar: true,
        description: "Kingdom treasury and donation management",
    },

    // 4. Event (Kalender event, rules, registration)
    {
        name: "Events",
        layout: "/auth",
        path: "events",
        icon: <MdEvent className="h-6 w-6" />,
        component: <Homepage />, // Temporary
        showInNavbar: true,
        description: "Kingdom events and tournaments",
    },

    // 5. Giveaway (Active giveaways, participation forms)
    {
        name: "Giveaway",
        layout: "/auth",
        path: "giveaway",
        icon: <FiGift className="h-6 w-6" />,
        component: <Giveaway />,
        showInNavbar: true,
        description: "Active giveaways and rewards",
    },

    // 6. Form (Member registration, alliance application)
    {
        name: "Forms",
        layout: "/auth",
        path: "forms",
        icon: <GiScrollUnfurled className="h-6 w-6" />,
        component: <Forms />,
        showInNavbar: true,
        description: "Registration and application forms",
    },

    // 7. Join Kingdom (Dedicated join/CTA page)
    {
        name: "Join Kingdom",
        layout: "/auth",
        path: "join-kingdom",
        icon: <GiScrollUnfurled className="h-6 w-6" />,
        component: <JoinKingdom />,
        showInNavbar: true,
        description: "Join Sacred3946 alliance",
    },

    // 6. Donation (Info sistem donasi, leaderboard)
    {
        name: "Donation",
        layout: "/auth",
        path: "donation",
        icon: <GiTwoCoins className="h-6 w-6" />,
        component: <Donation />,
        showInNavbar: true,
        description: "Donation system and leaderboard",
    },

    // 7. About Kingdom (History, organization, rules)
    {
        name: "About",
        layout: "/auth",
        path: "about",
        icon: <GiCrown className="h-6 w-6" />,
        component: <About />,
        showInNavbar: true,
        description: "About Sacred3946",
    },

    // 8. YouTube (Video gallery, tutorials, battle highlights)
    {
        name: "YouTube",
        layout: "/auth",
        path: "youtube",
        icon: <FiYoutube className="h-6 w-6" />,
        component: <Homepage />, // Temporary
        showInNavbar: true,
        description: "Video gallery and tutorials",
    },

    // 9. Blog (Articles, strategy guides, community stories)
    {
        name: "Blog",
        layout: "/auth",
        path: "blog",
        icon: <FiBookOpen className="h-6 w-6" />,
        component: <Homepage />, // Temporary
        showInNavbar: true,
        description: "Articles and strategy guides",
    },

    // 10. Laws (Aturan kingdom, code of conduct, FAQs)
    {
        name: "Laws",
        layout: "/auth",
        path: "laws",
        icon: <MdGavel className="h-6 w-6" />,
        component: <Laws />,
        showInNavbar: true,
        description: "Kingdom rules and regulations",
    },

    // Authentication
    {
        name: "Sign In",
        layout: "/auth",
        path: "sign-in",
        icon: <MdLock className="h-6 w-6" />,
        component: <SignIn />,
        showInNavbar: false,
    },
    {
        name: "Sign Up",
        layout: "/auth",
        path: "sign-up",
        icon: <MdPersonAdd className="h-6 w-6" />,
        component: <SignIn />,
        showInNavbar: false,
    },

    // Utility / Dev
    {
        name: "Navbar Settings",
        layout: "/auth",
        path: "navbar-settings",
        icon: <MdSettings className="h-6 w-6" />,
        component: <NavbarSettings />,
        showInNavbar: false,
        description: "Navbar configuration (dev)",
    },
];

// Helper functions untuk filtering routes
export const getNavbarRoutes = () => {
    return routes.filter(route => route.showInNavbar === true);
};

export const getMainRoutes = () => {
    return routes.filter(route => ['homepage', 'kvk', 'events', 'about'].includes(route.path));
};

export const getAuthRoutes = () => {
    return routes.filter(route => ['sign-in', 'sign-up'].includes(route.path));
};

export const getKingdomRoutes = () => {
    return routes.filter(route => ['kvk', 'events', 'giveaway', 'donation', 'forms', 'join-kingdom', 'youtube', 'blog', 'laws'].includes(route.path));
};

export const getDefaultRoute = () => {
    return routes.find(route => route.isDefault === true) || routes[0];
};

export const getRouteByPath = (path) => {
    return routes.find(route => route.path === path);
};

// Export semua routes untuk layout dan router configuration
export default routes;