import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Dashboard() {
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

  // Sample member data — 50 dummy members for pagination demo
  const [members] = useState(() => {
    const arr = [];
    for (let i = 1; i <= 50; i++) {
      arr.push({
        id: i,
        name: `Member ${i}`,
        food: 10000000 + i * 150000,
        wood: 8000000 + i * 120000,
        stone: 2000000 + i * 80000,
        gold: 500000 + i * 50000,
        weeksPaid: Math.min(100, (i * 3) % 101),
      });
    }
    return arr;
  });

  // pagination for members table
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;
  const totalPages = Math.ceil(members.length / PAGE_SIZE);
  const pagedMembers = members.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totals = members.reduce(
    (acc, m) => {
      acc.members += 1;
      acc.food += m.food || 0;
      acc.wood += m.wood || 0;
      acc.stone += m.stone || 0;
      acc.gold += m.gold || 0;
      acc.weeks += m.weeksPaid || 0;
      return acc;
    },
    { members: 0, food: 0, wood: 0, stone: 0, gold: 0, weeks: 0 }
  );

  // Format numbers using Indonesian thousands separator.
  // Example: 10000000 -> "10.000.000"
  const formatToMillions = (n) => {
    if (n === null || n === undefined) return "-";
    const num = Number(n) || 0;
    return num.toLocaleString("id-ID");
  };

  // Short formatter for indicators: use M for millions, B for billions
  // Examples: 1200000 -> 1.2M, 2500000000 -> 2.5B
  const formatShort = (n) => {
    if (n === null || n === undefined) return "-";
    const num = Number(n) || 0;
    const abs = Math.abs(num);
    const trim = (v) => {
      // remove trailing zeroes from fixed representation
      const s = v.toFixed(2);
      return s.replace(/\.0+$|(?<=\.[0-9]*?)0+$/g, "").replace(/\.$/, "");
    };
    if (abs >= 1e9) {
      return `${trim(num / 1e9)}B`;
    }
    if (abs >= 1e6) {
      return `${trim(num / 1e6)}M`;
    }
    return num.toLocaleString("id-ID");
  };

  // Total weeks baseline (e.g. program has 100 weeks)
  const TOTAL_WEEKS = 100;

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const avgWeeks = totals.members ? Math.round(totals.weeks / totals.members) : 0;
  const weeksProgress = Math.min(100, Math.round((avgWeeks / TOTAL_WEEKS) * 100));

  return (
    <div key={`dashboard-${isDarkMode}`} className="w-full h-full flex flex-col">
      <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <header className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Overview of SF BANK system metrics — premium view</p>
        </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Card: Members */}
        <div data-aos="fade-up" className="flex items-center gap-4 bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-slate-900/60 p-4 sm:p-5 border border-gray-100 dark:border-slate-700 transition-colors duration-300">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-lg font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M16 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM8 11c1.657 0 3-1.343 3-3S9.657 5 8 5 5 6.343 5 8s1.343 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05C16.9 13.68 18 14.78 18 16.5V19h6v-2.5C24 14.17 19.33 13 17 13z" />
              {/* fallback simple people icon if path above unsupported */}
            </svg>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Total Members</div>
            <div className="text-2xl font-bold text-gray-800 dark:text-white">{formatShort(totals.members)}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Active contributors</div>
          </div>
        </div>

        {/* resource cards */}
        <div data-aos="fade-up" data-aos-delay="40" className="flex items-center gap-4 bg-white dark:bg-slate-800 rounded-2xl shadow dark:shadow-slate-900/60 p-4 sm:p-5 border border-gray-100 dark:border-slate-700 transition-colors duration-300">
          <div className="w-12 h-12 rounded-full bg-green-400 dark:bg-green-900/40 flex items-center justify-center text-green-700 dark:text-green-300 font-semibold">F</div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Food</div>
            <div className="text-xl font-bold text-gray-800 dark:text-white">{formatShort(totals.food)}</div>
            <div className="text-sm text-green-600 dark:text-green-400 mt-1">total collected</div>
          </div>
        </div>

        <div data-aos="fade-up" data-aos-delay="80" className="flex items-center gap-4 bg-white dark:bg-slate-800 rounded-2xl shadow dark:shadow-slate-900/60 p-4 sm:p-5 border border-gray-100 dark:border-slate-700 transition-colors duration-300">
          <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center text-yellow-700 dark:text-yellow-300 font-semibold">W</div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Wood</div>
            <div className="text-xl font-bold text-gray-800 dark:text-white">{formatShort(totals.wood)}</div>
            <div className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">total collected</div>
          </div>
        </div>

        <div data-aos="fade-up" data-aos-delay="120" className="flex items-center gap-4 bg-white dark:bg-slate-800 rounded-2xl shadow dark:shadow-slate-900/60 p-4 sm:p-5 border border-gray-100 dark:border-slate-700 transition-colors duration-300">
          <div className="w-12 h-12 rounded-full bg-green-500 dark:bg-green-900/40 flex items-center justify-center text-slate-700 dark:text-green-300 font-semibold">S</div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Stone</div>
            <div className="text-xl font-bold text-gray-800 dark:text-white">{formatShort(totals.stone)}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">total collected</div>
          </div>
        </div>

        <div data-aos="fade-up" data-aos-delay="160" className="flex items-center gap-4 bg-white dark:bg-slate-800 rounded-2xl shadow dark:shadow-slate-900/60 p-4 sm:p-5 border border-gray-100 dark:border-slate-700 transition-colors duration-300">
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-700 dark:text-amber-300 font-semibold">G</div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Gold</div>
            <div className="text-xl font-bold text-amber-600 dark:text-amber-400">{formatShort(totals.gold)}</div>
            <div className="text-sm text-amber-600 dark:text-amber-400 mt-1">total collected</div>
          </div>
        </div>

        {/* Weeks card with progress */}
        <div data-aos="fade-up" data-aos-delay="200" className="bg-white dark:bg-slate-800 rounded-2xl shadow dark:shadow-slate-900/60 p-4 sm:p-5 border border-gray-100 dark:border-slate-700 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-400 dark:text-gray-500">Weeks (avg per member)</div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">{avgWeeks}/{TOTAL_WEEKS}</div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{weeksProgress}%</div>
          </div>
          <div className="mt-3 bg-gray-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
            <div className="bg-amber-400 h-2" style={{ width: `${weeksProgress}%` }} />
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">Total weeks across members: <span className="text-amber-600 dark:text-amber-400 font-medium">{totals.weeks}</span></div>
        </div>
      </section>

      <section className="mt-6">
        <div data-aos="fade-up" className="bg-white dark:bg-slate-800 rounded-2xl shadow dark:shadow-slate-900/60 p-4 border border-gray-100 dark:border-slate-700 transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Member Contributions</h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">Showing {members.length} members</div>
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full table-fixed text-sm">
              <thead className="bg-gray-100 dark:bg-slate-700/60 sticky top-0">
                <tr className="text-xs text-gray-600 dark:text-gray-300 font-semibold">
                  <th className="px-2 py-3 w-12 text-center">No</th>
                  <th className="px-4 py-3 text-left">Member</th>
                  <th className="px-4 py-3">Food</th>
                  <th className="px-4 py-3">Wood</th>
                  <th className="px-4 py-3">Stone</th>
                  <th className="px-4 py-3">Gold</th>
                  <th className="px-4 py-3">Weeks</th>
                  <th className="px-4 py-3">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700/50 bg-white dark:bg-slate-800">
                  {pagedMembers.map((m, idx) => (
                    <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors duration-150">
                      <td className="px-2 py-3 text-gray-700 dark:text-gray-400 w-12 text-center">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                      <td className="px-4 py-3 flex items-center">
                        <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 flex items-center justify-center mr-3 font-semibold">
                          {getInitials(m.name)}
                        </div>
                        <div className="font-medium text-gray-800 dark:text-gray-200">{m.name}</div>
                      </td>
                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-400">{formatShort(m.food)}</td>
                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-400">{formatShort(m.wood)}</td>
                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-400">{formatShort(m.stone)}</td>
                    <td className="px-4 py-3 text-center text-amber-600 dark:text-amber-400">{formatShort(m.gold)}</td>
                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-400">{(m.weeksPaid || 0)}/{TOTAL_WEEKS}</td>
                    <td className="px-4 py-3 text-right font-semibold text-amber-600 dark:text-amber-400">{formatShort((m.food || 0) + (m.wood || 0) + (m.stone || 0) + (m.gold || 0))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile list */}
          <div className="sm:hidden space-y-3">
            {pagedMembers.map((m, idx) => (
              <div key={m.id} className="bg-gray-50 dark:bg-slate-700/60 rounded-xl p-3 shadow-sm dark:shadow-md dark:shadow-slate-900/40 border border-gray-100 dark:border-slate-600 transition-colors duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-3 text-xs text-gray-500 dark:text-gray-400">No. {(page - 1) * PAGE_SIZE + idx + 1}</div>
                    <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 flex items-center justify-center mr-3 font-semibold">{getInitials(m.name)}</div>
                    <div>
                      <div className="font-medium text-gray-800 dark:text-gray-200">{m.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Weeks: {(m.weeksPaid || 0)}/{TOTAL_WEEKS}</div>
                    </div>
                  </div>
                  <div className="text-right font-semibold text-amber-600 dark:text-amber-400">{formatShort((m.food || 0) + (m.wood || 0) + (m.stone || 0) + (m.gold || 0))}</div>
                </div>
                <div className="mt-3 grid grid-cols-4 gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <div className="text-center">
                    <div className="text-amber-600 dark:text-amber-400 font-semibold">{formatToMillions(m.food)}</div>
                    <div>Food</div>
                  </div>
                  <div className="text-center">
                    <div className="text-yellow-600 dark:text-yellow-400 font-semibold">{formatToMillions(m.wood)}</div>
                    <div>Wood</div>
                  </div>
                  <div className="text-center">
                    <div className="text-slate-700 dark:text-slate-300 font-semibold">{formatToMillions(m.stone)}</div>
                    <div>Stone</div>
                  </div>
                  <div className="text-center">
                    <div className="text-amber-700 dark:text-amber-400 font-semibold">{formatToMillions(m.gold)}</div>
                    <div>Gold</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination controls */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">Showing {pagedMembers.length} of {members.length} members</div>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-2 rounded-lg border bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-slate-700 transition-colors text-sm font-medium">Prev</button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors duration-200 ${page === i + 1 ? 'bg-indigo-600 dark:bg-indigo-700 text-white border-indigo-600 dark:border-indigo-700 shadow-md dark:shadow-indigo-900/30' : 'bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600'}`}>{i + 1}</button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-2 rounded-lg border bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-slate-700 transition-colors text-sm font-medium">Next</button>
            </div>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
