import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AllianceDetail() {
  const { id } = useParams();
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

  // Listen to dark mode changes
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

  // Dummy alliance data (in real app, fetch from API using id)
  const [alliance, setAlliance] = useState(() => {
    const tags = ["SF-A", "SF-B", "SF-C", "SF-D", "SF-E"];
    const food = Math.floor(Math.random() * 50000000) + 10000000;
    const wood = Math.floor(Math.random() * 40000000) + 8000000;
    const stone = Math.floor(Math.random() * 35000000) + 7000000;
    const gold = Math.floor(Math.random() * 30000000) + 5000000;
    
    return {
      id: parseInt(id),
      name: `Alliance ${id}`,
      tag: tags[parseInt(id) % tags.length],
      leader: `Leader ${id}`,
      bank_id: `BNK-${1000 + parseInt(id)}`,
      bank_name: `Bank Alliance ${id}`,
      members_count: Math.floor(Math.random() * 50) + 10,
      food: food,
      wood: wood,
      stone: stone,
      gold: gold,
      total_rss: food + wood + stone + gold,
      weeks_donated: Math.floor(Math.random() * 100) + 1,
      description: "Strong alliance for kingdom growth and strategic cooperation",
    };
  });

  // Dummy members with RSS contributions
  const [members] = useState(() => {
    const arr = [];
    for (let i = 1; i <= alliance.members_count; i++) {
      const memberFood = Math.floor(Math.random() * 5000000) + 500000;
      const memberWood = Math.floor(Math.random() * 4000000) + 400000;
      const memberStone = Math.floor(Math.random() * 3500000) + 350000;
      const memberGold = Math.floor(Math.random() * 3000000) + 300000;
      
      arr.push({
        id: i,
        name: `Member ${i}`,
        governor_id: `GOV-${1000 + i}`,
        food: memberFood,
        wood: memberWood,
        stone: memberStone,
        gold: memberGold,
        total_rss: memberFood + memberWood + memberStone + memberGold,
        weeks_donated: Math.floor(Math.random() * 30) + 1,
        last_contribution: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }
    // Sort by total RSS descending
    return arr.sort((a, b) => b.total_rss - a.total_rss);
  });

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

  const formatNumber = (num) => {
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(1)}B`;
    }
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter members based on search
  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.governor_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMembers = filteredMembers.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Right panel state for adding RSS
  const [showRssPanel, setShowRssPanel] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [rssForm, setRssForm] = useState({
    food: "",
    wood: "",
    stone: "",
    gold: "",
    lastContributionDate: new Date().toISOString().split('T')[0],
  });

  const openRssPanel = (member) => {
    setSelectedMember(member);
    setRssForm({ food: "", wood: "", stone: "", gold: "", lastContributionDate: new Date().toISOString().split('T')[0] });
    setShowRssPanel(true);
  };

  const closeRssPanel = () => {
    setShowRssPanel(false);
    setSelectedMember(null);
    setRssForm({ food: "", wood: "", stone: "", gold: "", lastContributionDate: new Date().toISOString().split('T')[0] });
  };

  const handleRssInputChange = (e) => {
    const { name, value } = e.target;
    setRssForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitRssForm = (e) => {
    e.preventDefault();
    if (!rssForm.food && !rssForm.wood && !rssForm.stone && !rssForm.gold) {
      alert("Please enter at least one resource amount");
      return;
    }
    console.log("Submitted RSS for member:", selectedMember.name, rssForm);
    alert(`RSS added for ${selectedMember.name} on ${rssForm.lastContributionDate}`);
    closeRssPanel();
  };

  // Calculator state
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorType, setCalculatorType] = useState(""); // 'food', 'wood', 'stone', 'gold'
  const [calculatorTaxRate, setCalculatorTaxRate] = useState(""); // Single tax rate for all entries
  const [calculatorInput, setCalculatorInput] = useState("");
  const [calculatorEntries, setCalculatorEntries] = useState([]); // Array of {gross, tax, net}
  const [calculatorStep, setCalculatorStep] = useState("tax"); // 'tax' or 'entry'

  const openCalculator = (type) => {
    setCalculatorType(type);
    setCalculatorTaxRate("");
    setCalculatorInput("");
    setCalculatorEntries([]);
    setCalculatorStep("tax");
    setShowCalculator(true);
  };

  const closeCalculator = () => {
    setShowCalculator(false);
    setCalculatorType("");
    setCalculatorTaxRate("");
    setCalculatorInput("");
    setCalculatorEntries([]);
    setCalculatorStep("tax");
  };

  const setTaxRate = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!calculatorTaxRate || parseFloat(calculatorTaxRate) < 0 || parseFloat(calculatorTaxRate) > 100) {
        alert("Please enter a valid tax percentage (0-100)");
        return;
      }
      setCalculatorStep("entry");
    }
  };

  const calculateWithTaxRate = (grossAmount) => {
    const gross = parseFloat(grossAmount) || 0;
    const taxPercent = parseFloat(calculatorTaxRate) || 0;
    const tax = (gross * taxPercent) / 100;
    const net = gross - tax;
    return { gross, tax, net };
  };

  const addCalculatorEntry = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!calculatorInput || parseFloat(calculatorInput) <= 0) {
        alert("Please enter a valid gross amount");
        return;
      }
      const { gross, tax, net } = calculateWithTaxRate(calculatorInput);
      setCalculatorEntries((prev) => [...prev, { gross, tax, net }]);
      setCalculatorInput("");
    }
  };

  const removeCalculatorEntry = (index) => {
    setCalculatorEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const depositEntry = (index) => {
    const entry = calculatorEntries[index];
    if (!entry) return;
    
    // Add the net value to the RSS field
    setRssForm((prev) => ({
      ...prev,
      [calculatorType]: (parseFloat(prev[calculatorType] || 0) + entry.net).toString(),
    }));
    
    // Remove the entry after deposit
    setCalculatorEntries((prev) => prev.filter((_, i) => i !== index));
    
    // Show success message
    alert(`Successfully deposited ${formatNumber(entry.net)} to ${calculatorType}`);
  };

  const getTotalCalculation = () => {
    const totalGross = calculatorEntries.reduce((sum, entry) => sum + entry.gross, 0);
    const totalTax = calculatorEntries.reduce((sum, entry) => sum + entry.tax, 0);
    const totalNet = calculatorEntries.reduce((sum, entry) => sum + entry.net, 0);
    const avgTaxPercent = totalGross > 0 ? ((totalTax / totalGross) * 100).toFixed(2) : 0;
    return { totalGross, totalTax, totalNet, avgTaxPercent };
  };

  const submitCalculatorValue = () => {
    if (calculatorEntries.length === 0) {
      alert("Please add at least one entry");
      return;
    }
    const { totalNet } = getTotalCalculation();
    setRssForm((prev) => ({
      ...prev,
      [calculatorType]: (parseFloat(prev[calculatorType]) || 0 + totalNet).toString(),
    }));
    closeCalculator();
  };

  // Add member to alliance state
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [availableUsers, setAvailableUsers] = useState(() => {
    // Dummy users without alliance
    const arr = [];
    for (let i = 1; i <= 15; i++) {
      arr.push({
        id: i + 100,
        user_id: `${2000 + i}`,
        name: `Available User ${i}`,
        email: `availableuser${i}@kingdom.com`,
        alliance: null,
      });
    }
    return arr;
  });
  const [selectedUsersToAdd, setSelectedUsersToAdd] = useState([]);
  const [addMemberSearch, setAddMemberSearch] = useState("");

  const openAddMemberModal = () => {
    setShowAddMemberModal(true);
    setSelectedUsersToAdd([]);
    setAddMemberSearch("");
  };

  const closeAddMemberModal = () => {
    setShowAddMemberModal(false);
    setSelectedUsersToAdd([]);
    setAddMemberSearch("");
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsersToAdd((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const addSelectedMembers = () => {
    if (selectedUsersToAdd.length === 0) {
      alert("Please select at least one user");
      return;
    }
    // In real app, call API to add members to alliance
    console.log("Adding users to alliance:", selectedUsersToAdd);
    alert(`Successfully added ${selectedUsersToAdd.length} member(s) to ${alliance.name}`);
    // Remove added users from available list
    setAvailableUsers((prev) => prev.filter((u) => !selectedUsersToAdd.includes(u.id)));
    closeAddMemberModal();
  };

  const filteredAvailableUsers = availableUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(addMemberSearch.toLowerCase()) ||
      user.user_id.toLowerCase().includes(addMemberSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(addMemberSearch.toLowerCase())
  );

  // Edit alliance state
  const [showEditAllianceModal, setShowEditAllianceModal] = useState(false);
  const [editAllianceForm, setEditAllianceForm] = useState({
    name: "",
    leader: "",
    bank_id: "",
    bank_name: "",
    description: "",
  });

  const openEditAllianceModal = () => {
    setEditAllianceForm({
      name: alliance.name,
      leader: alliance.leader,
      bank_id: alliance.bank_id,
      bank_name: alliance.bank_name,
      description: alliance.description,
    });
    setShowEditAllianceModal(true);
  };

  const closeEditAllianceModal = () => {
    setShowEditAllianceModal(false);
    setEditAllianceForm({
      name: "",
      leader: "",
      bank_id: "",
      bank_name: "",
      description: "",
    });
  };

  const handleEditAllianceChange = (e) => {
    const { name, value } = e.target;
    setEditAllianceForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitEditAlliance = (e) => {
    e.preventDefault();
    if (!editAllianceForm.name.trim() || !editAllianceForm.leader.trim()) {
      alert("Alliance name and leader are required");
      return;
    }
    // Update alliance
    setAlliance((prev) => ({
      ...prev,
      name: editAllianceForm.name.trim(),
      leader: editAllianceForm.leader.trim(),
      bank_id: editAllianceForm.bank_id.trim(),
      bank_name: editAllianceForm.bank_name.trim(),
      description: editAllianceForm.description.trim(),
    }));
    alert(`Alliance details updated successfully`);
    closeEditAllianceModal();
  };

  return (
    <div key={`alliance-detail-${isDarkMode}`} className="w-full h-full flex flex-col">
      <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 text-gray-800 dark:text-gray-100">
        {/* Back button + Header */}
        <div className="mb-6">
          <button 
            onClick={() => navigate('/admin/alliance')}
            className="mb-4 flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Alliance List
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
                <span className="text-4xl">{getTypeIcon(alliance.tag)}</span>
                {alliance.name}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Alliance details, resources, and member contributions</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={openEditAllianceModal}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg shadow-md transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit Alliance
              </button>
              <button
                onClick={openAddMemberModal}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                </svg>
                Add Member
              </button>
            </div>
          </div>
        </div>

        {/* Alliance Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6" data-aos="fade-up">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg dark:shadow-2xl dark:shadow-slate-900/60 p-5 border border-gray-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Alliance Info</div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                {getTypeIcon(alliance.tag)} {alliance.tag}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Leader:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{alliance.leader}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Members:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{alliance.members_count}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Weeks:</span>
                <span className="font-semibold text-purple-600 dark:text-purple-400">{alliance.weeks_donated}/100</span>
              </div>
              {alliance.bank_id && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Bank ID:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{alliance.bank_id}</span>
                </div>
              )}
              {alliance.bank_name && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Bank Name:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{alliance.bank_name}</span>
                </div>
              )}
              {alliance.description && (
                <div className="pt-2 mt-2 border-t border-gray-200 dark:border-slate-700">
                  <p className="text-xs text-gray-600 dark:text-gray-400">{alliance.description}</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl shadow-lg dark:shadow-2xl dark:shadow-slate-900/60 p-5 border border-indigo-100 dark:border-indigo-800/50">
            <div className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-3">Total Alliance Resources</div>
            <div className="flex items-center justify-between">
              <div className="text-3xl sm:text-4xl font-bold text-indigo-700 dark:text-indigo-300">
                {formatNumber(alliance.total_rss)}
              </div>
              <div className="text-5xl">📦</div>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-4">
              <div className="bg-white/60 dark:bg-slate-800/60 rounded-lg p-2 text-center">
                <div className="text-xs text-gray-600 dark:text-gray-400">🌾 Food</div>
                <div className="text-sm font-bold text-green-600 dark:text-green-400 mt-1">{formatNumber(alliance.food)}</div>
              </div>
              <div className="bg-white/60 dark:bg-slate-800/60 rounded-lg p-2 text-center">
                <div className="text-xs text-gray-600 dark:text-gray-400">🪵 Wood</div>
                <div className="text-sm font-bold text-amber-600 dark:text-amber-400 mt-1">{formatNumber(alliance.wood)}</div>
              </div>
              <div className="bg-white/60 dark:bg-slate-800/60 rounded-lg p-2 text-center">
                <div className="text-xs text-gray-600 dark:text-gray-400">🪨 Stone</div>
                <div className="text-sm font-bold text-gray-600 dark:text-gray-400 mt-1">{formatNumber(alliance.stone)}</div>
              </div>
              <div className="bg-white/60 dark:bg-slate-800/60 rounded-lg p-2 text-center">
                <div className="text-xs text-gray-600 dark:text-gray-400">💰 Gold</div>
                <div className="text-sm font-bold text-yellow-600 dark:text-yellow-400 mt-1">{formatNumber(alliance.gold)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Members Contribution Table */}
        <div data-aos="fade-up" data-aos-delay="100" className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-2xl dark:shadow-slate-900/60 p-4 sm:p-6 border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Member Contributions</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Resources contributed to alliance bank</p>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {filteredMembers.length} of {members.length} members
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-5">
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              <input
                type="text"
                placeholder="Search member by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 dark:bg-slate-700/60 sticky top-0">
                <tr className="text-xs text-gray-600 dark:text-gray-300 font-semibold">
                  <th className="px-4 py-3 text-left">Rank</th>
                  <th className="px-4 py-3 text-left">Member</th>
                  <th className="px-4 py-3 text-center">🌾 Food</th>
                  <th className="px-4 py-3 text-center">🪵 Wood</th>
                  <th className="px-4 py-3 text-center">🪨 Stone</th>
                  <th className="px-4 py-3 text-center">💰 Gold</th>
                  <th className="px-4 py-3 text-center">📦 Total RSS</th>
                  <th className="px-4 py-3 text-center">📅 Weeks</th>
                  <th className="px-4 py-3 text-center">Last Contribution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700/50">
                {paginatedMembers.map((member, idx) => {
                  const globalIdx = startIndex + idx; // Calculate global index for rankings
                  return (
                  <tr key={member.id} onClick={() => openRssPanel(member)} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {globalIdx === 0 && <span className="text-xl">🥇</span>}
                        {globalIdx === 1 && <span className="text-xl">🥈</span>}
                        {globalIdx === 2 && <span className="text-xl">🥉</span>}
                        <span className="font-semibold text-gray-700 dark:text-gray-300">{globalIdx + 1}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-semibold text-sm">
                          {getInitials(member.name)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{member.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{member.governor_id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-green-600 dark:text-green-400">{formatNumber(member.food)}</td>
                    <td className="px-4 py-3 text-center font-semibold text-amber-600 dark:text-amber-400">{formatNumber(member.wood)}</td>
                    <td className="px-4 py-3 text-center font-semibold text-gray-600 dark:text-gray-400">{formatNumber(member.stone)}</td>
                    <td className="px-4 py-3 text-center font-semibold text-yellow-600 dark:text-yellow-400">{formatNumber(member.gold)}</td>
                    <td className="px-4 py-3 text-center font-bold text-indigo-600 dark:text-indigo-400">{formatNumber(member.total_rss)}</td>
                    <td className="px-4 py-3 text-center font-semibold text-purple-600 dark:text-purple-400">{member.weeks_donated}/100</td>
                    <td className="px-4 py-3 text-center text-xs text-gray-600 dark:text-gray-400">{formatDate(member.last_contribution)}</td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden space-y-3">
            {paginatedMembers.map((member, idx) => {
              const globalIdx = startIndex + idx;
              return (
              <div key={member.id} onClick={() => openRssPanel(member)} className="bg-gray-50 dark:bg-slate-700/60 rounded-xl p-4 border border-gray-100 dark:border-slate-600 cursor-pointer hover:shadow-md dark:hover:shadow-slate-900/40 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {globalIdx === 0 && <span className="text-xl">🥇</span>}
                    {globalIdx === 1 && <span className="text-xl">🥈</span>}
                    {globalIdx === 2 && <span className="text-xl">🥉</span>}
                    <span className="font-bold text-gray-700 dark:text-gray-300">#{globalIdx + 1}</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{formatDate(member.last_contribution)}</div>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-semibold">
                    {getInitials(member.name)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{member.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{member.governor_id}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
                    <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{formatNumber(member.total_rss)}</div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Weeks</div>
                    <div className="text-sm font-bold text-purple-600 dark:text-purple-400">{member.weeks_donated}</div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-2 text-center">
                    <div className="text-lg">🌾</div>
                    <div className="text-xs font-semibold text-green-600 dark:text-green-400">{formatNumber(member.food)}</div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-2 text-center">
                    <div className="text-lg">🪵</div>
                    <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">{formatNumber(member.wood)}</div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-2 text-center">
                    <div className="text-lg">🪨</div>
                    <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">{formatNumber(member.stone)}</div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-2 text-center">
                    <div className="text-lg">💰</div>
                    <div className="text-xs font-semibold text-yellow-600 dark:text-yellow-400">{formatNumber(member.gold)}</div>
                  </div>
                </div>
              </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between border-t border-gray-200 dark:border-slate-700 pt-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredMembers.length)} of {filteredMembers.length} members
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Previous
                </button>
                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        currentPage === i + 1
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side Panel for Adding RSS */}
        {showRssPanel && (
          <div className="fixed inset-0 z-40 bg-black bg-opacity-50 dark:bg-opacity-70" onClick={closeRssPanel} />
        )}
        <div
          className={`fixed right-0 top-0 h-full w-full sm:w-96 bg-white dark:bg-slate-800 shadow-2xl dark:shadow-slate-900/60 transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto ${
            showRssPanel ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {selectedMember && (
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-700 dark:to-blue-700 p-4 sm:p-6 text-white flex items-center justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold">Add RSS Contribution</h3>
                  <p className="text-sm opacity-90 mt-1">{selectedMember.name}</p>
                </div>
                <button
                  onClick={closeRssPanel}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 p-4 sm:p-6">
                {/* Member Info */}
                <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">Governor ID</div>
                      <div className="font-semibold text-gray-900 dark:text-white">{selectedMember.governor_id}</div>
                    </div>
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">Current Week</div>
                      <div className="font-semibold text-purple-600 dark:text-purple-400">{selectedMember.weeks_donated}/100</div>
                    </div>
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">Last Contribution</div>
                      <div className="font-semibold text-gray-900 dark:text-white text-xs">{formatDate(selectedMember.last_contribution)}</div>
                    </div>
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">Total Contributed</div>
                      <div className="font-semibold text-indigo-600 dark:text-indigo-400">{formatNumber(selectedMember.total_rss)}</div>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={submitRssForm} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      🌾 Food
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        name="food"
                        value={rssForm.food}
                        onChange={handleRssInputChange}
                        placeholder="Enter amount"
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
                      />
                      <button
                        type="button"
                        onClick={() => openCalculator("food")}
                        className="px-3 py-2 rounded-lg bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/60 transition-colors font-medium text-sm"
                        title="Open calculator"
                      >
                        🧮
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      🪵 Wood
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        name="wood"
                        value={rssForm.wood}
                        onChange={handleRssInputChange}
                        placeholder="Enter amount"
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400"
                      />
                      <button
                        type="button"
                        onClick={() => openCalculator("wood")}
                        className="px-3 py-2 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/60 transition-colors font-medium text-sm"
                        title="Open calculator"
                      >
                        🧮
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      🪨 Stone
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        name="stone"
                        value={rssForm.stone}
                        onChange={handleRssInputChange}
                        placeholder="Enter amount"
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => openCalculator("stone")}
                        className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-600/40 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600/60 transition-colors font-medium text-sm"
                        title="Open calculator"
                      >
                        🧮
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      💰 Gold
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        name="gold"
                        value={rssForm.gold}
                        onChange={handleRssInputChange}
                        placeholder="Enter amount"
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-400"
                      />
                      <button
                        type="button"
                        onClick={() => openCalculator("gold")}
                        className="px-3 py-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/60 transition-colors font-medium text-sm"
                        title="Open calculator"
                      >
                        🧮
                      </button>
                    </div>
                  </div>

                  {/* Summary */}
                  {(rssForm.food || rssForm.wood || rssForm.stone || rssForm.gold) && (
                    <div className="mt-6 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                      <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Summary</div>
                      <div className="space-y-2 text-sm">
                        {rssForm.food && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">🌾 Food:</span>
                            <span className="font-semibold text-green-600 dark:text-green-400">{formatNumber(parseInt(rssForm.food) || 0)}</span>
                          </div>
                        )}
                        {rssForm.wood && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">🪵 Wood:</span>
                            <span className="font-semibold text-amber-600 dark:text-amber-400">{formatNumber(parseInt(rssForm.wood) || 0)}</span>
                          </div>
                        )}
                        {rssForm.stone && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">🪨 Stone:</span>
                            <span className="font-semibold text-gray-600 dark:text-gray-400">{formatNumber(parseInt(rssForm.stone) || 0)}</span>
                          </div>
                        )}
                        {rssForm.gold && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">💰 Gold:</span>
                            <span className="font-semibold text-yellow-600 dark:text-yellow-400">{formatNumber(parseInt(rssForm.gold) || 0)}</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-slate-600 mt-2">
                          <span className="font-semibold text-gray-700 dark:text-gray-300">Total:</span>
                          <span className="font-bold text-indigo-600 dark:text-indigo-400">
                            {formatNumber(
                              (parseInt(rssForm.food) || 0) +
                              (parseInt(rssForm.wood) || 0) +
                              (parseInt(rssForm.stone) || 0) +
                              (parseInt(rssForm.gold) || 0)
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 border-t border-gray-200 dark:border-slate-700 p-4 sm:p-6 bg-white dark:bg-slate-800 flex gap-3">
                <button
                  onClick={closeRssPanel}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={submitRssForm}
                  className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 dark:bg-indigo-700 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors font-medium"
                >
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Calculator Modal */}
        {showCalculator && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl dark:shadow-slate-900/60 p-6 w-full max-w-2xl border border-gray-100 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {calculatorType === "food" && "🌾 Food Calculator"}
                  {calculatorType === "wood" && "🪵 Wood Calculator"}
                  {calculatorType === "stone" && "🪨 Stone Calculator"}
                  {calculatorType === "gold" && "💰 Gold Calculator"}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Step 1: Set tax amount • Step 2: Add gross amounts</p>
              </div>

              {/* Input Section */}
              <div className="mb-6 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg space-y-3">
                {/* Step 1: Tax Rate Input */}
                {calculatorStep === "tax" && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase">
                      Tax Percentage (%) - Applied to all entries
                    </label>
                    <input
                      type="number"
                      value={calculatorTaxRate}
                      onChange={(e) => setCalculatorTaxRate(e.target.value)}
                      onKeyDown={setTaxRate}
                      placeholder="0"
                      min="0"
                      max="100"
                      step="0.01"
                      autoFocus
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 font-semibold"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Enter value between 0-100 • Press Enter to proceed</p>
                  </div>
                )}

                {/* Step 2: Gross Amount Input */}
                {calculatorStep === "entry" && (
                  <div>
                    <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-900/40">
                      <p className="text-xs font-semibold text-blue-900 dark:text-blue-300">Tax Rate: {parseFloat(calculatorTaxRate).toFixed(2)}% of gross amount</p>
                    </div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase">
                      Gross Amount
                    </label>
                    <input
                      type="number"
                      value={calculatorInput}
                      onChange={(e) => setCalculatorInput(e.target.value)}
                      onKeyDown={addCalculatorEntry}
                      placeholder="0"
                      autoFocus
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 font-semibold"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Press Enter to add entry</p>

                    {/* Quick Preview */}
                    {calculatorInput && (() => {
                      const { gross, tax, net } = calculateWithTaxRate(calculatorInput);
                      const taxPercent = gross > 0 ? ((tax / gross) * 100).toFixed(2) : 0;
                      return (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-600 space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600 dark:text-gray-400">Net (Preview):</span>
                            <span className="font-semibold text-green-600 dark:text-green-400">{formatNumber(net)} ({taxPercent}%)</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* Entries Table */}
              {calculatorEntries.length > 0 && (
                <div className="mb-6 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 dark:bg-slate-700/60">
                      <tr className="text-xs text-gray-600 dark:text-gray-300 font-semibold">
                        <th className="px-3 py-2 text-left">No</th>
                        <th className="px-3 py-2 text-right">Gross</th>
                        <th className="px-3 py-2 text-right">Tax</th>
                        <th className="px-3 py-2 text-right">Net</th>
                        <th className="px-3 py-2 text-center">%</th>
                        <th className="px-3 py-2 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-slate-700/50">
                      {calculatorEntries.map((entry, idx) => {
                        const taxPercent = entry.gross > 0 ? ((entry.tax / entry.gross) * 100).toFixed(2) : 0;
                        return (
                          <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                            <td className="px-3 py-2 text-gray-700 dark:text-gray-400">{idx + 1}</td>
                            <td className="px-3 py-2 text-right font-semibold text-gray-900 dark:text-white">{formatNumber(entry.gross)}</td>
                            <td className="px-3 py-2 text-right font-semibold text-red-600 dark:text-red-400">-{formatNumber(entry.tax)}</td>
                            <td className="px-3 py-2 text-right font-bold text-green-600 dark:text-green-400">{formatNumber(entry.net)}</td>
                            <td className="px-3 py-2 text-center text-xs text-gray-600 dark:text-gray-400">{taxPercent}%</td>
                            <td className="px-3 py-2 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => depositEntry(idx)}
                                  className="p-1 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/20 rounded transition-colors"
                                  title="Deposit this entry"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => removeCalculatorEntry(idx)}
                                  className="p-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                                  title="Remove entry"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* Total Row */}
                  {(() => {
                    const { totalGross, totalTax, totalNet } = getTotalCalculation();
                    const avgTaxPercent = totalGross > 0 ? ((totalTax / totalGross) * 100).toFixed(2) : 0;
                    return (
                      <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                        <div className="grid grid-cols-5 gap-2 text-center text-sm">
                          <div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Gross</div>
                            <div className="font-bold text-gray-900 dark:text-white">{formatNumber(totalGross)}</div>
                          </div>
                          <div>
                            <div className="text-xs text-red-600 dark:text-red-400 mb-1">Total Tax</div>
                            <div className="font-bold text-red-600 dark:text-red-400">-{formatNumber(totalTax)}</div>
                          </div>
                          <div>
                            <div className="text-xs text-green-600 dark:text-green-400 mb-1">Total Net</div>
                            <div className="font-bold text-green-600 dark:text-green-400">{formatNumber(totalNet)}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Avg Tax %</div>
                            <div className="font-bold text-gray-900 dark:text-white">{avgTaxPercent}%</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Entries</div>
                            <div className="font-bold text-gray-900 dark:text-white">{calculatorEntries.length}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={closeCalculator}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={submitCalculatorValue}
                  disabled={calculatorEntries.length === 0}
                  className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 dark:bg-indigo-700 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Apply ({calculatorEntries.length})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Member Modal */}
        {showAddMemberModal && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
              onClick={closeAddMemberModal}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">Add Members to Alliance</h2>
                      <p className="text-indigo-100 text-sm mt-1">
                        Select users without alliance to join {alliance.name}
                      </p>
                    </div>
                    <button
                      onClick={closeAddMemberModal}
                      className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                  {/* Search Bar */}
                  <div className="mb-4">
                    <div className="relative">
                      <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                      <input
                        type="text"
                        placeholder="Search users by name, ID, or email..."
                        value={addMemberSearch}
                        onChange={(e) => setAddMemberSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Selected Count */}
                  {selectedUsersToAdd.length > 0 && (
                    <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
                      <p className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">
                        {selectedUsersToAdd.length} user(s) selected
                      </p>
                    </div>
                  )}

                  {/* Available Users List */}
                  <div className="space-y-2">
                    {filteredAvailableUsers.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p className="font-medium">No available users found</p>
                        <p className="text-sm mt-1">All users are already in an alliance</p>
                      </div>
                    ) : (
                      filteredAvailableUsers.map((user) => (
                        <div
                          key={user.id}
                          onClick={() => toggleUserSelection(user.id)}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedUsersToAdd.includes(user.id)
                              ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-500"
                              : "border-gray-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-slate-700"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/40 dark:to-indigo-800/40 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-sm">
                                {user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">{user.email}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-500">ID: {user.user_id}</div>
                              </div>
                            </div>
                            <div>
                              {selectedUsersToAdd.includes(user.id) ? (
                                <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              ) : (
                                <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-slate-600"></div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700">
                  <div className="flex gap-3">
                    <button
                      onClick={closeAddMemberModal}
                      className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addSelectedMembers}
                      disabled={selectedUsersToAdd.length === 0}
                      className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      Add {selectedUsersToAdd.length > 0 ? `(${selectedUsersToAdd.length})` : "Members"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Edit Alliance Modal */}
        {showEditAllianceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden mx-4"
              data-aos="zoom-in"
            >
              <form onSubmit={submitEditAlliance}>
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      Edit Alliance Details
                    </h3>
                    <button
                      type="button"
                      onClick={closeEditAllianceModal}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                  <div className="space-y-5">
                    <div>
                      <label htmlFor="edit-alliance-name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Alliance Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="edit-alliance-name"
                        name="name"
                        value={editAllianceForm.name}
                        onChange={handleEditAllianceChange}
                        required
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all"
                        placeholder="Enter alliance name"
                      />
                    </div>

                    <div>
                      <label htmlFor="edit-alliance-leader" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Alliance Leader <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="edit-alliance-leader"
                        name="leader"
                        value={editAllianceForm.leader}
                        onChange={handleEditAllianceChange}
                        required
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all"
                        placeholder="Enter leader name"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="edit-bank-id" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Bank ID
                        </label>
                        <input
                          type="text"
                          id="edit-bank-id"
                          name="bank_id"
                          value={editAllianceForm.bank_id}
                          onChange={handleEditAllianceChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all"
                          placeholder="e.g., BNK-1001"
                        />
                      </div>

                      <div>
                        <label htmlFor="edit-bank-name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Bank Name
                        </label>
                        <input
                          type="text"
                          id="edit-bank-name"
                          name="bank_name"
                          value={editAllianceForm.bank_name}
                          onChange={handleEditAllianceChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all"
                          placeholder="e.g., Bank Alliance 1"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="edit-alliance-description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        id="edit-alliance-description"
                        name="description"
                        value={editAllianceForm.description}
                        onChange={handleEditAllianceChange}
                        rows={4}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all resize-none"
                        placeholder="Enter alliance description"
                      />
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div className="text-sm text-blue-800 dark:text-blue-300">
                          <p className="font-semibold mb-1">Note:</p>
                          <p>Alliance tag and resource values are managed separately and cannot be edited here.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={closeEditAllianceModal}
                      className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors font-medium"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
