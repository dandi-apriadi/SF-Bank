import React, { useEffect, useState } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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

  const [members, setMembers] = useState([]);
  const [alliances, setAlliances] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rssViewMode, setRssViewMode] = useState('chart'); // 'chart' | 'table'
  const [selectedWeek, setSelectedWeek] = useState(null); // For interactive tooltip

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${API_BASE_URL}/api/v1/reports/summary`, {
          withCredentials: true,
        });
        setMembers(res.data?.members || []);
        setAlliances(res.data?.alliances || []);
        setDeposits(res.data?.deposits || []);
      } catch (err) {
        console.error('Fetch dashboard data error:', err);
        setError(err.response?.data?.msg || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // pagination for members table
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;
  const totalPages = Math.max(1, Math.ceil(members.length / PAGE_SIZE));
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

  const allianceTotals = alliances.reduce(
    (acc, a) => {
      acc.food += a.food || 0;
      acc.wood += a.wood || 0;
      acc.stone += a.stone || 0;
      acc.gold += a.gold || 0;
      acc.members += a.membersCount || 0;
      return acc;
    },
    { food: 0, wood: 0, stone: 0, gold: 0, members: 0 }
  );
  const allianceTotalResource = allianceTotals.food + allianceTotals.wood + allianceTotals.stone + allianceTotals.gold;
  const avgAllianceMembers = alliances.length ? Math.round(allianceTotals.members / alliances.length) : 0;
  const avgAllianceResource = alliances.length ? Math.round(allianceTotalResource / alliances.length) : 0;

  // Weekly RSS trend across all alliances/members
  const weeklyMap = deposits.reduce((acc, d) => {
    const week = parseInt(d.week) || 0;
    if (!week) return acc;
    if (!acc[week]) {
      acc[week] = { week, food: 0, wood: 0, stone: 0, gold: 0, total: 0 };
    }
    acc[week].food += d.food || 0;
    acc[week].wood += d.wood || 0;
    acc[week].stone += d.stone || 0;
    acc[week].gold += d.gold || 0;
    acc[week].total += (d.food || 0) + (d.wood || 0) + (d.stone || 0) + (d.gold || 0);
    return acc;
  }, {});
  const allWeeklyTotals = Object.values(weeklyMap).sort((a, b) => a.week - b.week);
  const MAX_WEEKS_DISPLAY = 30;
  // Limit to last 30 weeks for chart display
  const weeklyTotals = allWeeklyTotals.slice(-MAX_WEEKS_DISPLAY);
  const maxWeeklyTotal = weeklyTotals.reduce((max, w) => Math.max(max, w.total), 0) || 1;

  // Aggregate member totals from all deposits for top contributors table
  const memberTotalsMap = deposits.reduce((acc, d) => {
    const key = d.member_id || d.member || `member-${d.id}`;
    const name = d.member || 'Member';
    if (!acc[key]) {
      acc[key] = { name, food: 0, wood: 0, stone: 0, gold: 0, total: 0, alliance: d.alliance || '' };
    }
    acc[key].food += d.food || 0;
    acc[key].wood += d.wood || 0;
    acc[key].stone += d.stone || 0;
    acc[key].gold += d.gold || 0;
    acc[key].total += (d.food || 0) + (d.wood || 0) + (d.stone || 0) + (d.gold || 0);
    return acc;
  }, {});
  const topContributors = Object.values(memberTotalsMap)
    .sort((a, b) => b.total - a.total)
    .slice(0, 15);

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
    <div key={`dashboard-${isDarkMode}`} className="w-full min-h-full flex flex-col bg-slate-50 transition-colors duration-300" style={{backgroundColor: isDarkMode ? '#111c44' : '#f8fafc'}}>
      <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <header className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Overview of SF BANK system metrics — premium view</p>
        </header>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/40 dark:text-red-200">
          {error}
        </div>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Card: Members */}
        <div data-aos="fade-up" className="flex items-center gap-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-slate-900/40 p-4 sm:p-5 border border-gray-100 dark:border-slate-700 transition-colors duration-300">
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
        <div data-aos="fade-up" data-aos-delay="40" className="flex items-center gap-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-slate-900/40 p-4 sm:p-5 border border-gray-100 dark:border-slate-700 transition-colors duration-300">
          <div className="w-12 h-12 rounded-full bg-green-400 dark:bg-green-900/40 flex items-center justify-center text-green-700 dark:text-green-300 font-semibold">F</div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Food</div>
            <div className="text-xl font-bold text-gray-800 dark:text-white">{formatShort(totals.food)}</div>
            <div className="text-sm text-green-600 dark:text-green-400 mt-1">total collected</div>
          </div>
        </div>

        <div data-aos="fade-up" data-aos-delay="80" className="flex items-center gap-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-slate-900/40 p-4 sm:p-5 border border-gray-100 dark:border-slate-700 transition-colors duration-300">
          <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center text-yellow-700 dark:text-yellow-300 font-semibold">W</div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Wood</div>
            <div className="text-xl font-bold text-gray-800 dark:text-white">{formatShort(totals.wood)}</div>
            <div className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">total collected</div>
          </div>
        </div>

        <div data-aos="fade-up" data-aos-delay="120" className="flex items-center gap-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-slate-900/40 p-4 sm:p-5 border border-gray-100 dark:border-slate-700 transition-colors duration-300">
          <div className="w-12 h-12 rounded-full bg-green-500 dark:bg-green-900/40 flex items-center justify-center text-slate-700 dark:text-green-300 font-semibold">S</div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Stone</div>
            <div className="text-xl font-bold text-gray-800 dark:text-white">{formatShort(totals.stone)}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">total collected</div>
          </div>
        </div>

        <div data-aos="fade-up" data-aos-delay="160" className="flex items-center gap-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-slate-900/40 p-4 sm:p-5 border border-gray-100 dark:border-slate-700 transition-colors duration-300">
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-700 dark:text-amber-300 font-semibold">G</div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Gold</div>
            <div className="text-xl font-bold text-amber-600 dark:text-amber-400">{formatShort(totals.gold)}</div>
            <div className="text-sm text-amber-600 dark:text-amber-400 mt-1">total collected</div>
          </div>
        </div>

        {/* Weeks card with progress */}
        <div data-aos="fade-up" data-aos-delay="200" className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-slate-900/40 p-4 sm:p-5 border border-gray-100 dark:border-slate-700 transition-colors duration-300">
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

      <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-slate-900/40 p-4 border border-gray-100 dark:border-slate-700 transition-colors duration-300">
          <div className="text-xs text-gray-500 dark:text-gray-400">Alliances</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{alliances.length}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Active alliance groups</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-slate-900/40 p-4 border border-gray-100 dark:border-slate-700 transition-colors duration-300">
          <div className="text-xs text-gray-500 dark:text-gray-400">Total Alliance RSS</div>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">{formatShort(allianceTotalResource)}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Food + Wood + Stone + Gold</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-slate-900/40 p-4 border border-gray-100 dark:border-slate-700 transition-colors duration-300">
          <div className="text-xs text-gray-500 dark:text-gray-400">Avg Members / Alliance</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{avgAllianceMembers}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Resource avg per alliance: {formatShort(avgAllianceResource)}</div>
        </div>
      </section>

      {/* Weekly RSS trend + top contributors */}
      <section className="mt-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-slate-900/40 p-4 sm:p-5 border border-gray-100 dark:border-slate-700 transition-colors duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly RSS Trend</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total RSS diterima per minggu dari semua aliansi & anggota</p>
            </div>
            <div className="flex items-center gap-2 relative z-10">
              <button
                type="button"
                onClick={() => setRssViewMode('chart')}
                className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${rssViewMode === 'chart' ? 'bg-indigo-600 dark:bg-indigo-700 text-white border-indigo-600 dark:border-indigo-700 shadow-sm' : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600'}`}
              >Trend Chart</button>
              <button
                type="button"
                onClick={() => setRssViewMode('table')}
                className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${rssViewMode === 'table' ? 'bg-indigo-600 dark:bg-indigo-700 text-white border-indigo-600 dark:border-indigo-700 shadow-sm' : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600'}`}
              >Top Contributors</button>
            </div>
          </div>

          {weeklyTotals.length === 0 && rssViewMode === 'chart' && (
            <div className="text-sm text-gray-500 dark:text-gray-400">No contribution data recorded yet.</div>
          )}

          {rssViewMode === 'chart' && weeklyTotals.length > 0 && (
            <>
              <style>{`
                @keyframes fade-in {
                  from { opacity: 0; transform: translateY(-10px); }
                  to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                  animation: fade-in 0.3s ease-out;
                }
                g:hover .hover-label {
                  opacity: 1 !important;
                  transition: opacity 0.2s ease;
                }
              `}</style>
              
              <div className="space-y-4">
              {/* Stats Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-lg p-3 border border-indigo-200 dark:border-indigo-700/50">
                  <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">Total Weeks</div>
                  <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mt-1">{weeklyTotals.length}</div>
                  <div className="text-xs text-indigo-500 dark:text-indigo-400 mt-1">of {allWeeklyTotals.length} total</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-3 border border-green-200 dark:border-green-700/50">
                  <div className="text-xs text-green-600 dark:text-green-400 font-semibold">Peak Week</div>
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300 mt-1">{formatShort(maxWeeklyTotal)}</div>
                  <div className="text-xs text-green-500 dark:text-green-400 mt-1">highest RSS</div>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg p-3 border border-amber-200 dark:border-amber-700/50">
                  <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold">Average/Week</div>
                  <div className="text-2xl font-bold text-amber-700 dark:text-amber-300 mt-1">{formatShort(weeklyTotals.reduce((sum, w) => sum + w.total, 0) / weeklyTotals.length)}</div>
                  <div className="text-xs text-amber-500 dark:text-amber-400 mt-1">mean value</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-3 border border-purple-200 dark:border-purple-700/50">
                  <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold">Total RSS</div>
                  <div className="text-2xl font-bold text-purple-700 dark:text-purple-300 mt-1">{formatShort(weeklyTotals.reduce((sum, w) => sum + w.total, 0))}</div>
                  <div className="text-xs text-purple-500 dark:text-purple-400 mt-1">accumulated</div>
                </div>
              </div>

              {/* Interactive Tooltip Card */}
              {selectedWeek && (
                <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-pink-900/30 rounded-xl p-4 border-2 border-indigo-300 dark:border-indigo-600 shadow-lg relative animate-fade-in">
                  <button
                    onClick={() => setSelectedWeek(null)}
                    className="absolute top-2 right-2 p-1 rounded-lg bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 transition-colors"
                  >
                    <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-3 text-white shadow-lg">
                      <div className="text-xs font-semibold opacity-90">WEEK</div>
                      <div className="text-3xl font-bold">{selectedWeek.week}</div>
                    </div>
                    
                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-5 gap-3">
                      <div className="bg-white dark:bg-slate-800 rounded-lg p-2.5 border border-gray-200 dark:border-slate-700">
                        <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mb-1">TOTAL RSS</div>
                        <div className="text-lg font-bold text-indigo-700 dark:text-indigo-300">{formatShort(selectedWeek.total)}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {((selectedWeek.total / maxWeeklyTotal) * 100).toFixed(1)}% of peak
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-slate-800 rounded-lg p-2.5 border border-green-200 dark:border-green-700/50">
                        <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-semibold mb-1">
                          <span>🌾</span> FOOD
                        </div>
                        <div className="text-lg font-bold text-green-700 dark:text-green-300">{formatShort(selectedWeek.food)}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {((selectedWeek.food / selectedWeek.total) * 100).toFixed(1)}%
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-slate-800 rounded-lg p-2.5 border border-amber-200 dark:border-amber-700/50">
                        <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-semibold mb-1">
                          <span>🪵</span> WOOD
                        </div>
                        <div className="text-lg font-bold text-amber-700 dark:text-amber-300">{formatShort(selectedWeek.wood)}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {((selectedWeek.wood / selectedWeek.total) * 100).toFixed(1)}%
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-slate-800 rounded-lg p-2.5 border border-slate-200 dark:border-slate-700/50">
                        <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 font-semibold mb-1">
                          <span>⛰️</span> STONE
                        </div>
                        <div className="text-lg font-bold text-slate-700 dark:text-slate-300">{formatShort(selectedWeek.stone)}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {((selectedWeek.stone / selectedWeek.total) * 100).toFixed(1)}%
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-slate-800 rounded-lg p-2.5 border border-yellow-200 dark:border-yellow-700/50">
                        <div className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400 font-semibold mb-1">
                          <span>💰</span> GOLD
                        </div>
                        <div className="text-lg font-bold text-yellow-700 dark:text-yellow-300">{formatShort(selectedWeek.gold)}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {((selectedWeek.gold / selectedWeek.total) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="w-full overflow-x-auto">
                <div className="min-w-full h-96 pb-4 relative">
                  <svg viewBox="0 0 1000 450" className="w-full h-full" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Weekly RSS trend area chart">
                    <defs>
                      {/* Enhanced gradients with more colors */}
                      <linearGradient id="totalGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#818cf8" stopOpacity="0.5" />
                        <stop offset="50%" stopColor="#6366f1" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.05" />
                      </linearGradient>
                      <linearGradient id="foodLineGrad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#84cc16" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#65a30d" stopOpacity="0.05" />
                      </linearGradient>
                      <linearGradient id="woodLineGrad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#d97706" stopOpacity="0.05" />
                      </linearGradient>
                      <linearGradient id="stoneLineGrad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#64748b" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#475569" stopOpacity="0.05" />
                      </linearGradient>
                      <linearGradient id="goldLineGrad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.05" />
                      </linearGradient>
                      
                      {/* Enhanced drop shadow */}
                      <filter id="dropShadow">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                        <feOffset dx="0" dy="3" result="offsetblur"/>
                        <feComponentTransfer>
                          <feFuncA type="linear" slope="0.4"/>
                        </feComponentTransfer>
                        <feMerge>
                          <feMergeNode/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>

                      {/* Glow effect for points */}
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Background with subtle grid */}
                    <rect x="0" y="0" width="1000" height="450" fill={isDarkMode ? "rgba(15,23,42,0.3)" : "rgba(248,250,252,0.5)"} />

                    {/* Horizontal gridlines with labels */}
                    {[0, 25, 50, 75, 100].map((pct) => {
                      const y = 400 - (pct * 3.5);
                      const value = Math.round((maxWeeklyTotal * pct) / 100);
                      return (
                        <g key={pct}>
                          <line 
                            x1="60" 
                            x2="950" 
                            y1={y} 
                            y2={y} 
                            stroke={isDarkMode ? "rgba(148,163,184,0.08)" : "rgba(148,163,184,0.12)"} 
                            strokeWidth="1" 
                            strokeDasharray={pct === 0 ? "0" : "5,5"}
                          />
                          {pct > 0 && (
                            <text
                              x="50"
                              y={y + 4}
                              textAnchor="end"
                              fontSize="11"
                              fontWeight="500"
                              fill={isDarkMode ? "rgba(148,163,184,0.5)" : "rgba(100,116,139,0.6)"}
                            >
                              {formatShort(value)}
                            </text>
                          )}
                        </g>
                      );
                    })}

                    {/* Create smooth curved paths */}
                    {(() => {
                      const chartWidth = 890;
                      const chartHeight = 350;
                      const chartLeft = 60;
                      const chartBottom = 400;
                      const stepX = chartWidth / Math.max(weeklyTotals.length - 1, 1);
                      
                      // Catmull-Rom spline for smoother curves
                      const createSmoothPath = (values) => {
                        if (values.length === 0) return "";
                        
                        const points = values.map((val, i) => ({
                          x: chartLeft + i * stepX,
                          y: chartBottom - (val / maxWeeklyTotal * chartHeight)
                        }));
                        
                        if (points.length === 1) {
                          return `M ${points[0].x} ${points[0].y}`;
                        }
                        
                        // Build smooth curve using cardinal spline
                        let path = `M ${points[0].x} ${points[0].y}`;
                        
                        for (let i = 0; i < points.length - 1; i++) {
                          const p0 = points[Math.max(i - 1, 0)];
                          const p1 = points[i];
                          const p2 = points[i + 1];
                          const p3 = points[Math.min(i + 2, points.length - 1)];
                          
                          // Control points for cubic bezier
                          const tension = 0.3;
                          const cp1x = p1.x + (p2.x - p0.x) * tension;
                          const cp1y = p1.y + (p2.y - p0.y) * tension;
                          const cp2x = p2.x - (p3.x - p1.x) * tension;
                          const cp2y = p2.y - (p3.y - p1.y) * tension;
                          
                          path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
                        }
                        
                        return path;
                      };

                      const totalValues = weeklyTotals.map(w => w.total);
                      const foodValues = weeklyTotals.map(w => w.food);
                      const woodValues = weeklyTotals.map(w => w.wood);
                      const stoneValues = weeklyTotals.map(w => w.stone);
                      const goldValues = weeklyTotals.map(w => w.gold);

                      const totalPath = createSmoothPath(totalValues);
                      const foodPath = createSmoothPath(foodValues);
                      const woodPath = createSmoothPath(woodValues);
                      const stonePath = createSmoothPath(stoneValues);
                      const goldPath = createSmoothPath(goldValues);

                      // Create filled area path
                      const createAreaPath = (values) => {
                        if (values.length === 0) return "";
                        const linePath = createSmoothPath(values);
                        const firstX = chartLeft;
                        const lastX = chartLeft + (values.length - 1) * stepX;
                        return `${linePath} L ${lastX} ${chartBottom} L ${firstX} ${chartBottom} Z`;
                      };

                      return (
                        <>
                          {/* Area fills with enhanced gradients */}
                          <path
                            d={createAreaPath(totalValues)}
                            fill="url(#totalGradient)"
                            opacity="0.8"
                          />
                          
                          {/* Overlay individual resource areas (very subtle) */}
                          <path d={createAreaPath(foodValues)} fill="url(#foodLineGrad)" opacity="0.25" />
                          <path d={createAreaPath(woodValues)} fill="url(#woodLineGrad)" opacity="0.25" />
                          <path d={createAreaPath(stoneValues)} fill="url(#stoneLineGrad)" opacity="0.25" />
                          <path d={createAreaPath(goldValues)} fill="url(#goldLineGrad)" opacity="0.25" />

                          {/* Individual resource lines (dashed, thinner) */}
                          <path d={foodPath} fill="none" stroke="#84cc16" strokeWidth="1.5" opacity="0.5" strokeDasharray="4,3" />
                          <path d={woodPath} fill="none" stroke="#f59e0b" strokeWidth="1.5" opacity="0.5" strokeDasharray="4,3" />
                          <path d={stonePath} fill="none" stroke="#64748b" strokeWidth="1.5" opacity="0.5" strokeDasharray="4,3" />
                          <path d={goldPath} fill="none" stroke="#fbbf24" strokeWidth="1.5" opacity="0.5" strokeDasharray="4,3" />

                          {/* Main total line (bold with shadow) */}
                          <path
                            d={totalPath}
                            fill="none"
                            stroke="#6366f1"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            filter="url(#dropShadow)"
                          />

                          {/* Interactive data points with enhanced styling */}
                          {weeklyTotals.map((w, i) => {
                            const x = chartLeft + i * stepX;
                            const y = chartBottom - (w.total / maxWeeklyTotal * chartHeight);
                            const isHighPeak = w.total === maxWeeklyTotal;
                            const isSelected = selectedWeek?.week === w.week;
                            
                            return (
                              <g 
                                key={`point-${i}`} 
                                onClick={() => setSelectedWeek(w)}
                                style={{ cursor: 'pointer' }}
                                className="hover:opacity-100 transition-opacity"
                              >
                                {/* Selection ring */}
                                {isSelected && (
                                  <>
                                    <circle
                                      cx={x}
                                      cy={y}
                                      r="12"
                                      fill="none"
                                      stroke="#6366f1"
                                      strokeWidth="2"
                                      opacity="0.4"
                                    />
                                    <circle
                                      cx={x}
                                      cy={y}
                                      r="16"
                                      fill="none"
                                      stroke="#6366f1"
                                      strokeWidth="1.5"
                                      opacity="0.2"
                                    />
                                  </>
                                )}
                                
                                {/* Glow circle for emphasis */}
                                <circle
                                  cx={x}
                                  cy={y}
                                  r={isSelected ? "10" : isHighPeak ? "8" : "6"}
                                  fill={isSelected ? "#6366f1" : isHighPeak ? "#f59e0b" : "#6366f1"}
                                  opacity="0.2"
                                  filter="url(#glow)"
                                />
                                
                                {/* Main point */}
                                <circle
                                  cx={x}
                                  cy={y}
                                  r={isSelected ? "6" : isHighPeak ? "5" : "4"}
                                  fill={isSelected ? "#818cf8" : isHighPeak ? "#f59e0b" : "#6366f1"}
                                  stroke={isDarkMode ? "#1e293b" : "#ffffff"}
                                  strokeWidth="2.5"
                                  className="hover:r-7 transition-all"
                                  style={{ transition: 'all 0.2s ease' }}
                                />
                                
                                {/* Peak marker */}
                                {isHighPeak && !isSelected && (
                                  <>
                                    <circle cx={x} cy={y} r="10" fill="none" stroke="#f59e0b" strokeWidth="1.5" opacity="0.6" />
                                    <text
                                      x={x}
                                      y={y - 20}
                                      textAnchor="middle"
                                      fontSize="11"
                                      fontWeight="700"
                                      fill="#f59e0b"
                                    >
                                      ⭐ PEAK
                                    </text>
                                  </>
                                )}
                                
                                {/* Hover label */}
                                <text
                                  x={x}
                                  y={y - 15}
                                  textAnchor="middle"
                                  fontSize="10"
                                  fontWeight="600"
                                  fill={isDarkMode ? "#e2e8f0" : "#334155"}
                                  opacity="0"
                                  className="hover-label"
                                  style={{ pointerEvents: 'none' }}
                                >
                                  {formatShort(w.total)}
                                </text>
                              </g>
                            );
                          })}

                          {/* X-axis labels with alternating positioning */}
                          {weeklyTotals.map((w, i) => {
                            const x = chartLeft + i * stepX;
                            const showLabel = weeklyTotals.length <= 20 || i % Math.ceil(weeklyTotals.length / 20) === 0 || i === weeklyTotals.length - 1;
                            if (!showLabel) return null;
                            
                            return (
                              <g key={`xlabel-${i}`}>
                                <line x1={x} y1={chartBottom} x2={x} y2={chartBottom + 5} stroke={isDarkMode ? "rgba(148,163,184,0.3)" : "rgba(100,116,139,0.4)"} strokeWidth="1" />
                                <text
                                  x={x}
                                  y={chartBottom + 20}
                                  textAnchor="middle"
                                  fontSize="11"
                                  fontWeight="500"
                                  fill={isDarkMode ? "rgba(148,163,184,0.6)" : "rgba(100,116,139,0.7)"}
                                >
                                  W{w.week}
                                </text>
                              </g>
                            );
                          })}

                          {/* Axis lines */}
                          <line x1={chartLeft} y1={chartBottom} x2={chartLeft + chartWidth} y2={chartBottom} stroke={isDarkMode ? "rgba(148,163,184,0.3)" : "rgba(100,116,139,0.4)"} strokeWidth="2" />
                          <line x1={chartLeft} y1={50} x2={chartLeft} y2={chartBottom} stroke={isDarkMode ? "rgba(148,163,184,0.3)" : "rgba(100,116,139,0.4)"} strokeWidth="2" />
                        </>
                      );
                    })()}
                  </svg>
                </div>
              </div>

              {/* Enhanced Legend with mini indicators */}
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex flex-wrap items-center gap-6 text-xs">
                  <div className="flex items-center gap-2.5 text-gray-700 dark:text-gray-200 font-bold">
                    <div className="flex flex-col items-center gap-1">
                      <div className="h-1 w-10 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full shadow-sm"></div>
                      <div className="h-1 w-10 bg-indigo-200 dark:bg-indigo-800 rounded-full opacity-40"></div>
                    </div>
                    <span>Total RSS</span>
                  </div>
                  <span className="text-gray-300 dark:text-gray-600">|</span>
                  
                  {/* Resource legends */}
                  {[
                    { color: 'lime-500', name: 'Food', icon: '🌾' },
                    { color: 'amber-500', name: 'Wood', icon: '🪵' },
                    { color: 'slate-500', name: 'Stone', icon: '⛰️' },
                    { color: 'yellow-400', name: 'Gold', icon: '💰' }
                  ].map((resource, idx) => (
                    <span key={idx} className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors cursor-default">
                      <div className="flex items-center gap-1">
                        <span className="text-sm">{resource.icon}</span>
                        <div className={`h-2 w-8 bg-${resource.color} rounded-full opacity-60`} style={{
                          backgroundColor: resource.color === 'lime-500' ? '#84cc16' : 
                                         resource.color === 'amber-500' ? '#f59e0b' : 
                                         resource.color === 'slate-500' ? '#64748b' : '#fbbf24'
                        }}></div>
                      </div>
                      <span className="font-medium">{resource.name}</span>
                    </span>
                  ))}
                  
                  <span className="text-gray-300 dark:text-gray-600">•</span>
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Showing last {weeklyTotals.length} weeks • Peak: {formatShort(maxWeeklyTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
          )}

          {rssViewMode === 'table' && (
            <div className="mt-2 overflow-x-auto">
              {topContributors.length === 0 ? (
                <div className="text-sm text-gray-500 dark:text-gray-400">No contribution data recorded yet.</div>
              ) : (
                <table className="min-w-full table-fixed text-sm">
                  <thead className="bg-gray-100 dark:bg-slate-700/60">
                    <tr className="text-xs text-gray-600 dark:text-gray-300 font-semibold">
                      <th className="px-3 py-3 w-12 text-left">No</th>
                      <th className="px-3 py-3 text-left">Member</th>
                      <th className="px-3 py-3 text-left">Alliance</th>
                      <th className="px-3 py-3 text-right">Food</th>
                      <th className="px-3 py-3 text-right">Wood</th>
                      <th className="px-3 py-3 text-right">Stone</th>
                      <th className="px-3 py-3 text-right">Gold</th>
                      <th className="px-3 py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-slate-700 bg-white dark:bg-slate-800">
                    {topContributors.map((m, idx) => (
                      <tr key={`${m.name}-${idx}`} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                        <td className="px-3 py-3 text-gray-700 dark:text-gray-300 text-left">{idx + 1}</td>
                        <td className="px-3 py-3 text-gray-900 dark:text-gray-100 font-medium">{m.name}</td>
                        <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{m.alliance || '-'}</td>
                        <td className="px-3 py-3 text-right text-gray-700 dark:text-gray-300">{formatShort(m.food)}</td>
                        <td className="px-3 py-3 text-right text-gray-700 dark:text-gray-300">{formatShort(m.wood)}</td>
                        <td className="px-3 py-3 text-right text-gray-700 dark:text-gray-300">{formatShort(m.stone)}</td>
                        <td className="px-3 py-3 text-right text-amber-600 dark:text-amber-400">{formatShort(m.gold)}</td>
                        <td className="px-3 py-3 text-right font-semibold text-indigo-600 dark:text-indigo-300">{formatShort(m.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </section>

      </div>
    </div>
  );
}
