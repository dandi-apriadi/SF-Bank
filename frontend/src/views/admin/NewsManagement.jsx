import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function NewsManagement() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    AOS.init({ once: true, duration: 600 });
  }, []);

  // Listen to dark mode changes with more reliable detection
  useEffect(() => {
    // Check immediately in case dark mode was already set
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };

    // Initial check
    checkDarkMode();

    // Create a more robust observer
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'],
      subtree: false
    });

    // Also listen for storage changes (in case dark mode is set from another tab/window)
    const handleStorageChange = (e) => {
      if (e.key === 'darkMode') {
        checkDarkMode();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      observer.disconnect();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div key={`news-mgmt-${isDarkMode}`} className="w-full h-full flex flex-col">
    <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
      <header className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">News Management</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Create and manage news items displayed in the app</p>
      </header>

      <div data-aos="fade-up" className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <input className="flex-1 p-2 border rounded" placeholder="Title" />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
        </div>

        <div className="mt-4 text-sm text-gray-600">Existing posts:</div>
        <ul className="mt-2 space-y-2">
          <li className="p-2 bg-gray-50 rounded">System maintenance on 2025-12-01</li>
          <li className="p-2 bg-gray-50 rounded">New import feature deployed</li>
        </ul>
      </div>
      </div>
    </div>
  );
}
