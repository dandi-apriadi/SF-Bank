import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import routes from "../../routes/routes-auth.js";
import { useEffect, useState } from "react";
import Navbar from "../../components/navbarhome/index.jsx";

const FULL_WIDTH_PAGES = [
  'Home',           // Landing Page
  'KvK',            // Kingdom vs Kingdom
  'Events',         // Kingdom Events
  'Giveaway',       // Giveaways
  'Forms',          // Registration Forms
  'Donation',       // Donation System
  'About',          // About Kingdom
  'YouTube',        // Video Gallery
  'Blog',           // Articles & Guides
  'Laws',           // Kingdom Rules
  'Sign In',        // Authentication
  'Sign Up',        // Registration
  'Navbar Settings' // Dev Settings
];

export default function Auth() {
  const [page, setPage] = useState("");
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname.split("/").pop();
    const currentRoute = routes.find(
      (route) => route.layout === "/auth" && route.path === currentPath
    );

    if (currentRoute) {
      setPage(currentRoute.name);
      document.title = currentRoute.name + " - Kingdom 3946 | Rise of Kingdoms Community";
    }
  }, [location.pathname]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/auth") {
        return (
          <Route path={`/${prop.path}`} element={prop.component} key={key} />
        );
      } else {
        return null;
      }
    });
  };

  document.documentElement.dir = "ltr";
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-[#0a0e27] dark:via-[#0f1332] dark:to-[#0a0e27] transition-colors duration-300">
      {/* Kingdom 3946 Navbar */}
      <Navbar />
      
      {/* Main Content Area with Modern Background */}
      <div className="relative min-h-screen w-full">
        {/* Neon Blue Glow Effects - Dark Mode Only */}
        <div className="fixed inset-0 pointer-events-none dark:block hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-[32rem] h-[32rem] bg-cyan-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Modern Striped Pattern Overlay */}
        <div className="fixed inset-0 opacity-[0.15] dark:opacity-[0.15] pointer-events-none" 
             style={{
               backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, currentColor 10px, currentColor 11px)',
               color: 'rgb(203, 213, 225)'
             }}>
        </div>
        
        {/* Dark Mode Striped Pattern (Pure White) */}
        <div className="fixed inset-0 opacity-0 dark:opacity-[0.18] pointer-events-none transition-opacity duration-300" 
             style={{
               backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, currentColor 10px, currentColor 11px)',
               color: 'rgb(255, 255, 255)'
             }}>
        </div>
        
        {/* Subtle Grid Pattern */}
        <div className="fixed inset-0 opacity-5 dark:opacity-[0.03] pointer-events-none" 
             style={{
               backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23C5A059" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
             }}>
        </div>
        
        <main className="relative z-10 min-h-screen">
          <div className={`${FULL_WIDTH_PAGES.includes(page) ? "w-full min-h-screen" : "pt-20"}`}>
            <div className={`
              ${FULL_WIDTH_PAGES.includes(page)
                ? "w-full min-h-screen p-0 m-0 max-w-none"
                : "mx-auto flex min-h-full w-full flex-col justify-start pt-12 md:max-w-[75%] lg:max-w-[1013px] lg:px-8 xl:max-w-[1383px] xl:px-0"
              }
            `}>
              <div className={`mb-auto flex flex-col ${!FULL_WIDTH_PAGES.includes(page) ? "px-5 md:px-8 lg:px-0" : ""}`}>
                <Routes>
                  {getRoutes(routes)}
                  <Route
                    path="/"
                    element={<Navigate to="/auth/homepage" replace />}
                  />
                  <Route 
                    path="*" 
                    element={<Navigate to="/auth/homepage" replace />} 
                  />
                </Routes>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

