import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import Navbar from "components/navbar";
import Sidebar from "components/sidebar";
import Footer from "components/footer/Footer";
import routes from "../../routes/routes-admin.js";
import ErrorBoundary from 'components/ui/ErrorBoundary';
import { fetchInstitutionMetrics } from 'store/slices/institutionSlice';
import { getMe } from "store/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";

export default function Admin(props) {
  const { ...rest } = props;
  const location = useLocation();
  const [open, setOpen] = React.useState(() => (typeof window !== 'undefined' ? window.innerWidth >= 1200 : true));
  const [currentRoute, setCurrentRoute] = React.useState("Main Dashboard");
  const { isError, user } = useSelector((state => state.auth));
  const [page, setPage] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });
  const appName = process.env.REACT_APP_APP_NAME || 'Sacred Bank';

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const institution = useSelector(s=>s.institution);
  useEffect(() => { dispatch(getMe()); }, [dispatch]);
  useEffect(()=>{ if(!institution.data && !institution.isLoading) dispatch(fetchInstitutionMetrics()); }, [institution, dispatch]);

  useEffect(() => {
    const currentPath = location.pathname.split("/").pop();
    const currentRoute = routes.find(
      (route) => route.layout === "/admin" && route.path === currentPath
    );

    if (currentRoute) {
      setPage(currentRoute.name);
      document.title = currentRoute.name;
    }
  }, [location.pathname]);

  useEffect(() => {
    if (isError) {
      console.log("Error fetching user data", isError);
      navigate("/auth/sign-in");
    }
  }, [isError, navigate]);

  // Guard: hanya role admin yang boleh akses layout ini
  useEffect(() => {
    if (user && user.role && user.role !== 'admin') {
      navigate('/auth/sign-in');
    }
  }, [user, navigate]);

  useEffect(() => {
    const handleResize = () => {
      window.innerWidth < 1200 ? setOpen(false) : setOpen(true);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    getActiveRoute(routes);
  }, [location.pathname]);

  // Listen to dark mode changes
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };

    // Initial check
    checkDarkMode();

    // Create observer for dark mode changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'],
      subtree: false
    });

    return () => observer.disconnect();
  }, []);

  const getActiveRoute = (routes) => {
    let activeRoute = "Main Dashboard";
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(
          routes[i].layout + "/" + routes[i].path
        ) !== -1
      ) {
        setCurrentRoute(routes[i].name);
        return routes[i].name; // Return route name immediately
      }
    }
    return activeRoute;
  };

  const getActiveNavbar = (routes) => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(routes[i].layout + "/" + routes[i].path) !== -1
      ) {
        return routes[i].secondary || false;
      }
    }
    return activeNavbar;
  };

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route path={`/${prop.path}`} element={prop.component} key={key} />
        );
      }
      return null;
    });
  };

  document.documentElement.dir = "ltr";

  return (
    <div key={`admin-layout-${isDarkMode}`} className="flex h-screen w-screen bg-slate-50 transition-colors duration-300" style={{backgroundColor: isDarkMode ? '#111c44' : '#f8fafc'}}>
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="h-screen w-full transition-colors duration-300 flex flex-col" style={{backgroundColor: isDarkMode ? '#111c44' : '#f8fafc'}}>
        <main
          className="h-screen flex flex-col flex-1 transition-all xl:ml-[313px]"
          style={{backgroundColor: isDarkMode ? '#111c44' : '#f8fafc'}}
        >
          <Navbar
            onOpenSidenav={() => setOpen(true)}
            logoText={appName}
            brandText={currentRoute}
            secondary={getActiveNavbar(routes)}
            {...rest}
          />
          <div className="flex-1 flex flex-col overflow-y-auto transition-colors duration-300" style={{backgroundColor: isDarkMode ? '#111c44' : '#f8fafc'}}>
            <ErrorBoundary>
              <div className="flex-1 w-full">
                <Routes>
                  {getRoutes(routes)}
                  <Route
                    path="/"
                    element={<Navigate to="/admin/dashboard" replace />}
                  />
                </Routes>
              </div>
            </ErrorBoundary>
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}

