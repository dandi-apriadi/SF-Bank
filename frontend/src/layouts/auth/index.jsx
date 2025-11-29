import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import routes from "../../routes/routes-auth.js";
import { useEffect, useState } from "react";

const FULL_WIDTH_PAGES = [
  'Beranda', 
  'Masuk', 
  'Daftar', 
  'Tentang Kami', 
  'Fitur', 
  'Harga', 
  'Testimonial', 
  'Kontak', 
  'Bantuan', 
  'Blog', 
  'Karier', 
  'Kebijakan Privasi', 
  'Syarat Layanan', 
  'Demo Produk', 
  'Pengaturan Navbar'
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
      document.title = currentRoute.name + " - PRIMA | Platform Integrasi Manajemen Mutu Akademik";
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
    <div>
      <div className="relative float-right h-full min-h-screen w-full bg-white">
        <main className="mx-auto min-h-screen relative z-10">
          <div className={`relative ${FULL_WIDTH_PAGES.includes(page) ? "w-full h-screen" : ""}`}>
            <div className={`
              ${FULL_WIDTH_PAGES.includes(page)
                ? "w-full h-full p-0 m-0 max-w-none"
                : "mx-auto flex min-h-full w-full flex-col justify-start pt-12 md:max-w-[75%] lg:max-w-[1013px] lg:px-8 lg:pt-0 xl:min-h-[100vh] xl:max-w-[1383px] xl:px-0 xl:pl-[70px]"
              }
            `}>
              <div className={`mb-auto flex flex-col ${!FULL_WIDTH_PAGES.includes(page) ? "pl-5 pr-5 md:pr-0 md:pl-12 lg:max-w-[48%] lg:pl-0 xl:max-w-full" : ""}`}>
                <Routes>
                  {getRoutes(routes)}
                  <Route
                    path="/"
                    element={<Navigate to="/auth/sign-in" replace />}
                  />
                  <Route 
                    path="*" 
                    element={<Navigate to="/auth/sign-in" replace />} 
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

