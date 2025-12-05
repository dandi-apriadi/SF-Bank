import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Alliance() {
  const navigate = useNavigate();
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    AOS.init({ once: true, duration: 550 });
  }, []);

  // Listen to dark mode changes with more reliable detection
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'],
      subtree: false
    });

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

  // Dummy alliance data
  const [alliances, setAlliances] = useState(() => {
    const arr = [];
    const tags = ["SF-A", "SF-B", "SF-C", "SF-D", "SF-E"];
    
    for (let i = 1; i <= 20; i++) {
      const food = Math.floor(Math.random() * 50000000) + 10000000;
      const wood = Math.floor(Math.random() * 40000000) + 8000000;
      const stone = Math.floor(Math.random() * 35000000) + 7000000;
      const gold = Math.floor(Math.random() * 30000000) + 5000000;
      arr.push({
        id: i,
        name: `Alliance ${i}`,
        tag: tags[i % tags.length],
        leader: `Leader ${i}`,
        members_count: Math.floor(Math.random() * 50) + 10,
        food: food,
        wood: wood,
        stone: stone,
        gold: gold,
        total_rss: food + wood + stone + gold,
        weeks_donated: Math.floor(Math.random() * 100) + 1,
        description: i % 3 === 0 ? "Strong alliance for kingdom growth" : "",
      });
    }
    return arr;
  });

  // Pagination
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;
  const totalPages = Math.max(1, Math.ceil(alliances.length / PAGE_SIZE));
  const pagedAlliances = alliances.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Add Alliance modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAlliance, setSelectedAlliance] = useState(null);
  const [nameInput, setNameInput] = useState("");
  const [tagInput, setTagInput] = useState("SF-A");
  const [leaderInput, setLeaderInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [foodInput, setFoodInput] = useState("");
  const [woodInput, setWoodInput] = useState("");
  const [stoneInput, setStoneInput] = useState("");
  const [goldInput, setGoldInput] = useState("");

  const openAddModal = () => {
    setNameInput("");
    setTagInput("SF-A");
    setLeaderInput("");
    setDescriptionInput("");
    setFoodInput("");
    setWoodInput("");
    setStoneInput("");
    setGoldInput("");
    setShowAddModal(true);
  };
  const closeAddModal = () => setShowAddModal(false);

  const openDetailPage = (alliance) => {
    navigate(`/admin/alliance/${alliance.id}`);
  };

  const openEditModal = (alliance) => {
    setSelectedAlliance(alliance);
    setNameInput(alliance.name);
    setTagInput(alliance.tag);
    setLeaderInput(alliance.leader);
    setDescriptionInput(alliance.description || "");
    setFoodInput(alliance.food.toString());
    setWoodInput(alliance.wood.toString());
    setStoneInput(alliance.stone.toString());
    setGoldInput(alliance.gold.toString());
    setShowEditModal(true);
  };
  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedAlliance(null);
    setNameInput("");
    setTagInput("SF-A");
    setLeaderInput("");
    setDescriptionInput("");
    setFoodInput("");
    setWoodInput("");
    setStoneInput("");
    setGoldInput("");
  };

  const addAlliance = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return alert("Please enter an alliance name.");
    if (!leaderInput.trim()) return alert("Please enter a leader name.");
    
    const food = parseInt(foodInput) || 0;
    const wood = parseInt(woodInput) || 0;
    const stone = parseInt(stoneInput) || 0;
    const gold = parseInt(goldInput) || 0;
    
    const maxId = alliances.length ? Math.max(...alliances.map((a) => a.id)) : 0;
    const newAlliance = {
      id: maxId + 1,
      name: nameInput.trim(),
      tag: tagInput,
      leader: leaderInput.trim(),
      members_count: 0,
      food: food,
      wood: wood,
      stone: stone,
      gold: gold,
      total_rss: food + wood + stone + gold,
      description: descriptionInput.trim(),
    };
    setAlliances((prev) => [newAlliance, ...prev]);
    setShowAddModal(false);
    setPage(1);
  };

  const updateAlliance = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return alert("Please enter an alliance name.");
    if (!leaderInput.trim()) return alert("Please enter a leader name.");
    
    // RSS fields are disabled in edit, so we don't update them
    setAlliances((prev) =>
      prev.map((a) =>
        a.id === selectedAlliance.id
          ? {
              ...a,
              name: nameInput.trim(),
              tag: tagInput,
              leader: leaderInput.trim(),
              description: descriptionInput.trim(),
              // Keep existing RSS values
            }
          : a
      )
    );
    setShowEditModal(false);
    setSelectedAlliance(null);
  };

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const getTypeIcon = (tag) => {
    switch (tag) {
      case "SF-A":
        return "🛡️";
      case "SF-B":
        return "⚔️";
      case "SF-C":
        return "🏰";
      case "SF-D":
        return "👑";
      case "SF-E":
        return "⭐";
      default:
        return "🏛️";
    }
  };

  return (
    <div key={`alliance-${isDarkMode}`} className="w-full min-h-full flex flex-col bg-slate-50 transition-colors duration-300" style={{backgroundColor: isDarkMode ? '#111c44' : '#f8fafc'}}>
      <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 text-gray-800 dark:text-gray-100">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Alliance Management</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Manage kingdom alliances — add, view, and coordinate partnerships</p>
          </div>
          <div>
            <button 
              onClick={openAddModal} 
              className="bg-indigo-600 dark:bg-indigo-700 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-md dark:shadow-slate-900/50 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Alliance
            </button>
          </div>
        </header>

        <div data-aos="fade-up" className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-2xl dark:shadow-slate-900/60 p-4 border border-gray-100 dark:border-slate-700 transition-all duration-300">
          <div className="hidden sm:block overflow-x-auto rounded-lg">
            <table className="w-full table-fixed text-sm">
              <thead className="bg-gray-100 dark:bg-slate-700/60 sticky top-0">
                <tr className="text-xs text-gray-600 dark:text-gray-300 font-semibold">
                  <th className="px-2 py-3 w-12 text-center">No</th>
                  <th className="px-4 py-3 text-left">Alliance</th>
                  <th className="px-4 py-3">Tag</th>
                  <th className="px-4 py-3">Members</th>
                  <th className="px-4 py-3">🌾 Food</th>
                  <th className="px-4 py-3">🪵 Wood</th>
                  <th className="px-4 py-3">🪨 Stone</th>
                  <th className="px-4 py-3">💰 Gold</th>
                  <th className="px-4 py-3">📦 Total RSS</th>
                  <th className="px-4 py-3">📅 Weeks</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700/50 bg-white dark:bg-slate-800">
                {pagedAlliances.map((a, idx) => (
                  <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors duration-150">
                    <td className="px-2 py-3 text-gray-700 dark:text-gray-400 w-12 text-center font-medium">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                    <td className="px-4 py-3 flex items-center">
                      <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 flex items-center justify-center mr-3 font-semibold text-sm">{getInitials(a.name)}</div>
                      <div>
                        <div className="font-medium text-gray-800 dark:text-gray-200">{a.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Led by {a.leader}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                        <span>{getTypeIcon(a.tag)}</span>
                        <span>{a.tag}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-400">{a.members_count}</td>
                    <td className="px-4 py-3 text-center text-green-600 dark:text-green-400 font-semibold">{formatNumber(a.food)}</td>
                    <td className="px-4 py-3 text-center text-amber-600 dark:text-amber-400 font-semibold">{formatNumber(a.wood)}</td>
                    <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-400 font-semibold">{formatNumber(a.stone)}</td>
                    <td className="px-4 py-3 text-center text-yellow-600 dark:text-yellow-400 font-semibold">{formatNumber(a.gold)}</td>
                    <td className="px-4 py-3 text-center text-indigo-600 dark:text-indigo-400 font-bold">{formatNumber(a.total_rss)}</td>
                    <td className="px-4 py-3 text-center text-purple-600 dark:text-purple-400 font-semibold">{a.weeks_donated}/100</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openDetailPage(a)}
                          className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors"
                          title="View Details"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button
                          onClick={() => openEditModal(a)}
                          className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/60 transition-colors"
                          title="Edit Alliance"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile list */}
          <div className="sm:hidden space-y-3">
            {pagedAlliances.map((a, idx) => (
              <div key={a.id} className="bg-gray-50 dark:bg-slate-700/60 rounded-xl p-4 shadow-sm dark:shadow-md dark:shadow-slate-900/40 border border-gray-100 dark:border-slate-600 hover:shadow-md dark:hover:shadow-slate-900/60 transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">No. {(page - 1) * PAGE_SIZE + idx + 1}</div>
                    <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-semibold text-sm">{getInitials(a.name)}</div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 dark:text-gray-200">{a.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{a.leader}</div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                    {getTypeIcon(a.tag)} {a.tag}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                  <div className="text-center p-2 bg-white dark:bg-slate-800 rounded-lg">
                    <div className="text-gray-500 dark:text-gray-400">Members</div>
                    <div className="font-semibold text-gray-800 dark:text-gray-200 mt-1">{a.members_count}</div>
                  </div>
                  <div className="text-center p-2 bg-white dark:bg-slate-800 rounded-lg">
                    <div className="text-gray-500 dark:text-gray-400">📦 Total</div>
                    <div className="font-bold text-indigo-600 dark:text-indigo-400 mt-1">{formatNumber(a.total_rss)}</div>
                  </div>
                  <div className="text-center p-2 bg-white dark:bg-slate-800 rounded-lg">
                    <div className="text-gray-500 dark:text-gray-400">📅 Weeks</div>
                    <div className="font-semibold text-purple-600 dark:text-purple-400 mt-1">{a.weeks_donated}/100</div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="text-center p-2 bg-white dark:bg-slate-800 rounded-lg">
                    <div className="text-gray-500 dark:text-gray-400">🌾</div>
                    <div className="font-semibold text-green-600 dark:text-green-400 mt-1">{formatNumber(a.food)}</div>
                  </div>
                  <div className="text-center p-2 bg-white dark:bg-slate-800 rounded-lg">
                    <div className="text-gray-500 dark:text-gray-400">🪵</div>
                    <div className="font-semibold text-amber-600 dark:text-amber-400 mt-1">{formatNumber(a.wood)}</div>
                  </div>
                  <div className="text-center p-2 bg-white dark:bg-slate-800 rounded-lg">
                    <div className="text-gray-500 dark:text-gray-400">🪨</div>
                    <div className="font-semibold text-gray-600 dark:text-gray-400 mt-1">{formatNumber(a.stone)}</div>
                  </div>
                  <div className="text-center p-2 bg-white dark:bg-slate-800 rounded-lg">
                    <div className="text-gray-500 dark:text-gray-400">💰</div>
                    <div className="font-semibold text-yellow-600 dark:text-yellow-400 mt-1">{formatNumber(a.gold)}</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-end gap-2 pt-3 border-t border-gray-200 dark:border-slate-700">
                  <button
                    onClick={() => openDetailPage(a)}
                    className="px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors text-xs font-medium flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    Detail
                  </button>
                  <button
                    onClick={() => openEditModal(a)}
                    className="px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/60 transition-colors text-xs font-medium flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination controls */}
          <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-200 dark:border-slate-700">
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Showing {pagedAlliances.length} of {alliances.length} alliances</div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setPage((p) => Math.max(1, p - 1))} 
                disabled={page === 1} 
                className="px-3 py-2 rounded-lg border bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-slate-700 transition-colors text-sm font-medium"
              >
                Prev
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setPage(i + 1)} 
                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors duration-200 ${
                      page === i + 1 
                        ? 'bg-indigo-600 dark:bg-indigo-700 text-white border-indigo-600 dark:border-indigo-700 shadow-md dark:shadow-indigo-900/30' 
                        : 'bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))} 
                disabled={page === totalPages} 
                className="px-3 py-2 rounded-lg border bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-slate-700 transition-colors text-sm font-medium"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Add Alliance Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 dark:bg-black/60 backdrop-blur-sm">
            <div className="absolute inset-0 bg-black/40 dark:bg-black/50" onClick={closeAddModal} aria-hidden="true" />
            <div role="dialog" aria-modal="true" className="relative z-50 w-full max-w-2xl mx-auto">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl dark:shadow-2xl dark:shadow-slate-900/60 overflow-hidden border border-gray-100 dark:border-slate-700">
                <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-white to-gray-50 dark:from-slate-800 dark:to-slate-800/95">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Add Alliance</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Create a new alliance partnership</p>
                  </div>
                  <button onClick={closeAddModal} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors" aria-label="Close modal">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={addAlliance} className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Alliance Name</label>
                    <input 
                      type="text" 
                      value={nameInput} 
                      onChange={(e) => setNameInput(e.target.value)} 
                      className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white p-2.5 text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all" 
                      placeholder="Enter alliance name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tag</label>
                    <select 
                      value={tagInput} 
                      onChange={(e) => setTagInput(e.target.value)} 
                      className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                    >
                      <option value="SF-A">🛡️ SF-A</option>
                      <option value="SF-B">⚔️ SF-B</option>
                      <option value="SF-C">🏰 SF-C</option>
                      <option value="SF-D">👑 SF-D</option>
                      <option value="SF-E">⭐ SF-E</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Leader Name</label>
                    <input 
                      type="text" 
                      value={leaderInput} 
                      onChange={(e) => setLeaderInput(e.target.value)} 
                      className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white p-2.5 text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all" 
                      placeholder="Enter leader name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</label>
                    <input 
                      type="text" 
                      value={descriptionInput} 
                      onChange={(e) => setDescriptionInput(e.target.value)} 
                      className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white p-2.5 text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all" 
                      placeholder="Add description (optional)"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">🌾 Food</label>
                    <input 
                      type="number" 
                      value={foodInput} 
                      onChange={(e) => setFoodInput(e.target.value)} 
                      className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white p-2.5 text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all" 
                      placeholder="Enter food amount"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">🪵 Wood</label>
                    <input 
                      type="number" 
                      value={woodInput} 
                      onChange={(e) => setWoodInput(e.target.value)} 
                      className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white p-2.5 text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all" 
                      placeholder="Enter wood amount"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">🪨 Stone</label>
                    <input 
                      type="number" 
                      value={stoneInput} 
                      onChange={(e) => setStoneInput(e.target.value)} 
                      className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white p-2.5 text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all" 
                      placeholder="Enter stone amount"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">💰 Gold</label>
                    <input 
                      type="number" 
                      value={goldInput} 
                      onChange={(e) => setGoldInput(e.target.value)} 
                      className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white p-2.5 text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all" 
                      placeholder="Enter gold amount"
                    />
                  </div>

                  <div className="md:col-span-2 flex items-center justify-end gap-3 pt-4 sm:pt-5 border-t border-gray-200 dark:border-slate-700">
                    <button 
                      type="button" 
                      onClick={closeAddModal} 
                      className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2.5 rounded-lg bg-indigo-600 dark:bg-indigo-700 text-white text-sm font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors shadow-md dark:shadow-indigo-900/30"
                    >
                      Add Alliance
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Alliance Modal */}
        {showEditModal && selectedAlliance && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 dark:bg-black/60 backdrop-blur-sm">
            <div className="absolute inset-0 bg-black/40 dark:bg-black/50" onClick={closeEditModal} aria-hidden="true" />
            <div role="dialog" aria-modal="true" className="relative z-50 w-full max-w-2xl mx-auto">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl dark:shadow-2xl dark:shadow-slate-900/60 overflow-hidden border border-gray-100 dark:border-slate-700">
                <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-800/95">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Edit Alliance</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Update alliance information</p>
                  </div>
                  <button onClick={closeEditModal} className="p-2 rounded-full hover:bg-white/50 dark:hover:bg-slate-700 transition-colors" aria-label="Close modal">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={updateAlliance} className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Alliance Name</label>
                    <input 
                      type="text" 
                      value={nameInput} 
                      onChange={(e) => setNameInput(e.target.value)} 
                      className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white p-2.5 text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent transition-all" 
                      placeholder="Enter alliance name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tag</label>
                    <select 
                      value={tagInput} 
                      onChange={(e) => setTagInput(e.target.value)} 
                      className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent transition-all"
                    >
                      <option value="SF-A">🛡️ SF-A</option>
                      <option value="SF-B">⚔️ SF-B</option>
                      <option value="SF-C">🏰 SF-C</option>
                      <option value="SF-D">👑 SF-D</option>
                      <option value="SF-E">⭐ SF-E</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Leader Name</label>
                    <input 
                      type="text" 
                      value={leaderInput} 
                      onChange={(e) => setLeaderInput(e.target.value)} 
                      className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white p-2.5 text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent transition-all" 
                      placeholder="Enter leader name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</label>
                    <input 
                      type="text" 
                      value={descriptionInput} 
                      onChange={(e) => setDescriptionInput(e.target.value)} 
                      className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white p-2.5 text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent transition-all" 
                      placeholder="Add description (optional)"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">🌾 Food</label>
                    <input 
                      type="number" 
                      value={foodInput} 
                      disabled
                      className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-900/40 text-gray-600 dark:text-gray-400 p-2.5 text-sm cursor-not-allowed" 
                      placeholder="Enter food amount"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Resource amounts cannot be edited directly</p>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">🪵 Wood</label>
                    <input 
                      type="number" 
                      value={woodInput} 
                      disabled
                      className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-900/40 text-gray-600 dark:text-gray-400 p-2.5 text-sm cursor-not-allowed" 
                      placeholder="Enter wood amount"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">🪨 Stone</label>
                    <input 
                      type="number" 
                      value={stoneInput} 
                      disabled
                      className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-900/40 text-gray-600 dark:text-gray-400 p-2.5 text-sm cursor-not-allowed" 
                      placeholder="Enter stone amount"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">💰 Gold</label>
                    <input 
                      type="number" 
                      value={goldInput} 
                      disabled
                      className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-900/40 text-gray-600 dark:text-gray-400 p-2.5 text-sm cursor-not-allowed" 
                      placeholder="Enter gold amount"
                    />
                  </div>

                  <div className="md:col-span-2 flex items-center justify-end gap-3 pt-4 sm:pt-5 border-t border-gray-200 dark:border-slate-700">
                    <button 
                      type="button" 
                      onClick={closeEditModal} 
                      className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2.5 rounded-lg bg-amber-600 dark:bg-amber-700 text-white text-sm font-medium hover:bg-amber-700 dark:hover:bg-amber-600 transition-colors shadow-md dark:shadow-amber-900/30"
                    >
                      Update Alliance
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
