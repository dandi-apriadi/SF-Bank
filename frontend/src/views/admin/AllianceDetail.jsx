import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

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

  // State for alliance data
  const [alliance, setAlliance] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch alliance data
  const fetchAllianceData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [allianceRes, membersRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/v1/alliances/${id}`, { withCredentials: true }),
        axios.get(`${API_BASE_URL}/api/v1/alliances/${id}/members`, { withCredentials: true })
      ]);

      setAlliance(allianceRes.data);
      setMembers(membersRes.data);
    } catch (err) {
      console.error("Fetch alliance data error:", err);
      setError(err.response?.data?.msg || "Failed to load alliance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAllianceData();
    }
  }, [id]);

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

  const getUtcToday = () => {
    const now = new Date();
    const utcDate = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    return utcDate.toISOString().split('T')[0];
  };

  const getWeekNumber = (date) => {
    // Fix: Use UTC to ensure consistent week calculation
    const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };

  const getCurrentWeek = () => {
    return getWeekNumber(new Date());
  };

  // Right panel state for adding RSS
  const [showRssPanel, setShowRssPanel] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showMemberReport, setShowMemberReport] = useState(false);
  const [reportMember, setReportMember] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // {memberId, week} for confirmation
  const [rssForm, setRssForm] = useState({
    food: "",
    wood: "",
    stone: "",
    gold: "",
    lastContributionDate: getUtcToday(),
    week: getCurrentWeek(),
  });

  const openRssPanel = async (member) => {
    setSelectedMember(member);

    // Collect existing weeks as numbers
    const existingWeeks = member.contributions
      ? member.contributions.map((c) => parseInt(c.week)).filter(Boolean)
      : [];

    // Determine the first missing week in sequence (enforce no skipping)
    const sortedWeeks = [...existingWeeks].sort((a, b) => a - b);
    let expectedWeek = 1;
    for (const wk of sortedWeeks) {
      if (wk === expectedWeek) {
        expectedWeek += 1;
      } else if (wk > expectedWeek) {
        break; // found a gap
      }
    }

    // Set default form with today's UTC date and the next required week
    setRssForm({
      food: "",
      wood: "",
      stone: "",
      gold: "",
      lastContributionDate: getUtcToday(), // Auto-set to today UTC
      week: expectedWeek,
      existingWeeks,
    });
    setShowRssPanel(true);
  };

  const closeRssPanel = () => {
    setShowRssPanel(false);
    setSelectedMember(null);
    setRssForm({ food: "", wood: "", stone: "", gold: "", lastContributionDate: getUtcToday(), week: getCurrentWeek(), existingWeeks: [] });
  };

  const openMemberReport = (member) => {
    setReportMember(member);
    setShowMemberReport(true);
  };

  const closeMemberReport = () => {
    setShowMemberReport(false);
    setReportMember(null);
    setDeleteConfirm(null);
  };

  const deleteWeeklyContribution = async (memberId, week) => {
    try {
      // Call backend to delete
      await axios.delete(
        `${API_BASE_URL}/api/v1/member-contributions/${memberId}/${alliance.id}/${week}`,
        { withCredentials: true }
      );
      
      // Show success alert
      alert(`✅ Week ${week} contribution deleted successfully`);
      
      // Refresh data
      await fetchAllianceData();
      
      // If deleting from report modal, update reportMember
      if (reportMember) {
        const updatedContributions = reportMember.contributions.filter(c => c.week !== week);
        setReportMember((prev) => ({
          ...prev,
          contributions: updatedContributions
        }));
      }
      
      // Clear delete confirmation
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Delete contribution error:', err);
      alert(err.response?.data?.msg || 'Failed to delete contribution');
    }
  };

  const handleRssInputChange = (e) => {
    const { name, value } = e.target;
    
    // If changing week, auto-load existing data if available
    if (name === 'week' && value) {
      const selectedWeek = parseInt(value);
      const existingContribution = selectedMember.contributions?.find(c => c.week === selectedWeek);
      
      if (existingContribution) {
        // Load existing data for this week
        setRssForm((prev) => ({
          ...prev,
          [name]: value,
          food: existingContribution.food?.toString() || "",
          wood: existingContribution.wood?.toString() || "",
          stone: existingContribution.stone?.toString() || "",
          gold: existingContribution.gold?.toString() || "",
        }));
        return;
      }
    }
    
    // Normal input change
    setRssForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitRssForm = async (e) => {
    e.preventDefault();
    
    // Validate week selection
    if (!rssForm.week) {
      alert('Please select a week first');
      return;
    }
    
    if (!rssForm.food && !rssForm.wood && !rssForm.stone && !rssForm.gold) {
      alert("Please enter at least one resource amount");
      return;
    }

    if (!selectedMember) {
      alert("No member selected");
      return;
    }

    if (!rssForm.week || rssForm.week < 1 || rssForm.week > 100) {
      alert("Please select a valid week (1-100)");
      return;
    }

    try {
      // Check if this is an update or create
      const selectedWeek = parseInt(rssForm.week);
      const existingWeeks = (rssForm.existingWeeks || []).map((w) => parseInt(w)).filter(Boolean);
      const isExistingWeek = existingWeeks.includes(selectedWeek);

      // Enforce no skipping weeks when creating a new week
      if (!isExistingWeek) {
        const sorted = [...new Set(existingWeeks)].sort((a, b) => a - b);
        let expected = 1;
        for (const wk of sorted) {
          if (wk === expected) {
            expected += 1;
          } else if (wk > expected) {
            break; // gap found
          }
        }

        if (selectedWeek !== expected) {
          alert(`You must fill Week ${expected} before adding Week ${selectedWeek}`);
          return;
        }
      }
      
      // Create contribution record for the member
      await axios.post(
        `${API_BASE_URL}/api/v1/member-contributions`,
        {
          member_id: selectedMember.member_id || selectedMember.id,
          alliance_id: id,
          date: rssForm.lastContributionDate,
          week: selectedWeek,
          food: parseInt(rssForm.food) || 0,
          wood: parseInt(rssForm.wood) || 0,
          stone: parseInt(rssForm.stone) || 0,
          gold: parseInt(rssForm.gold) || 0,
        },
        { withCredentials: true }
      );

      const actionText = isExistingWeek ? 'updated' : 'added';
      alert(`RSS contribution ${actionText} for ${selectedMember.name} in Week ${rssForm.week}`);
      // Refresh data and close panel
      await fetchAllianceData();
      closeRssPanel();
    } catch (err) {
      console.error("Submit RSS form error:", err);
      alert(err.response?.data?.msg || "Failed to add RSS contribution");
    }
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
  const [availableUsers, setAvailableUsers] = useState([]);
  const [availableUsersLoading, setAvailableUsersLoading] = useState(false);
  const [selectedUsersToAdd, setSelectedUsersToAdd] = useState([]);
  const [addMemberSearch, setAddMemberSearch] = useState("");

  const openAddMemberModal = async () => {
    try {
      setAvailableUsersLoading(true);
      setSelectedUsersToAdd([]);
      setAddMemberSearch("");
      
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/alliances/${id}/available-users`,
        { withCredentials: true }
      );
      
      setAvailableUsers(response.data || []);
      setShowAddMemberModal(true);
    } catch (err) {
      console.error("Fetch available users error:", err);
      alert(err.response?.data?.msg || "Failed to load available users");
    } finally {
      setAvailableUsersLoading(false);
    }
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

  const addSelectedMembers = async () => {
    if (selectedUsersToAdd.length === 0) {
      alert("Please select at least one user");
      return;
    }
    
    try {
      await axios.post(
        `${API_BASE_URL}/api/v1/alliances/${id}/members`,
        { member_ids: selectedUsersToAdd },
        { withCredentials: true }
      );
      
      alert(`Successfully added ${selectedUsersToAdd.length} member(s) to ${alliance.name}`);
      // Refresh alliance data and close modal
      await fetchAllianceData();
      closeAddMemberModal();
    } catch (err) {
      console.error("Add members error:", err);
      alert(err.response?.data?.msg || "Failed to add members to alliance");
    }
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

  const submitEditAlliance = async (e) => {
    e.preventDefault();
    if (!editAllianceForm.name.trim() || !editAllianceForm.leader.trim()) {
      alert("Alliance name and leader are required");
      return;
    }

    try {
      await axios.put(
        `${API_BASE_URL}/api/v1/alliances/${id}`,
        {
          name: editAllianceForm.name.trim(),
          tag: editAllianceForm.tag?.trim() || null,
          leader: editAllianceForm.leader.trim(),
          description: editAllianceForm.description?.trim() || null
        },
        { withCredentials: true }
      );

      alert("Alliance details updated successfully");
      closeEditAllianceModal();
      await fetchAllianceData();
    } catch (err) {
      console.error("Update alliance error:", err);
      alert(err.response?.data?.msg || "Failed to update alliance");
    }
  };

// Loading and error states
if (loading) {
  return (
    <div className="w-full min-h-full flex items-center justify-center bg-slate-50 dark:bg-navy-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading alliance details...</p>
      </div>
    </div>
  );
}

if (error || !alliance) {
  return (
    <div className="w-full min-h-full flex items-center justify-center bg-slate-50 dark:bg-navy-900">
      <div className="text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Alliance</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error || "Alliance not found"}</p>
        <button 
          onClick={() => navigate('/admin/alliance')}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Back to Alliance List
        </button>
      </div>
    </div>
  );
}

return (
    <div key={`alliance-detail-${isDarkMode}`} className="w-full min-h-full flex flex-col bg-slate-50 transition-colors duration-300" style={{backgroundColor: isDarkMode ? '#111c44' : '#f8fafc'}}>
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
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Alliance details, resources, and member contributions overview</p>
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
                  <th className="px-4 py-3 text-center">Actions</th>
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
                    <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openMemberReport(member)}
                          className="px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors"
                          title="View member report"
                        >
                          📊 Report
                        </button>
                        <button
                          onClick={() => openRssPanel(member)}
                          className="px-3 py-1 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/60 transition-colors"
                          title="Add/edit contribution"
                        >
                          ➕ Add
                        </button>
                      </div>
                    </td>
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
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openMemberReport(member);
                    }}
                    className="px-3 py-2 text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors"
                  >
                    📊 Report
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openRssPanel(member);
                    }}
                    className="px-3 py-2 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/60 transition-colors"
                  >
                    ➕ Add
                  </button>
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
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={submitRssForm} className="space-y-4">
                  {/* Week and Date Selection */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        📅 Week Number (Can Edit Previous Weeks)
                      </label>
                      <select
                        name="week"
                        value={rssForm.week}
                        onChange={handleRssInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
                      >
                        <option value="">Select Week</option>
                        {[...Array(100)].map((_, i) => {
                          const weekNum = i + 1;
                          const isExisting = rssForm.existingWeeks && rssForm.existingWeeks.includes(weekNum);
                          return (
                            <option key={weekNum} value={weekNum}>
                              Week {weekNum} {isExisting ? '(Existing - Edit)' : ''}
                            </option>
                          );
                        })}
                      </select>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Select a new week or edit previous week data</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        📆 Contribution Date (Auto: Today UTC)
                      </label>
                      <input
                        type="date"
                        name="lastContributionDate"
                        value={rssForm.lastContributionDate}
                        disabled
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-100 dark:bg-slate-700/50 text-gray-900 dark:text-white cursor-not-allowed opacity-75"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Auto-set to today (UTC)</p>
                    </div>
                  </div>

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
                  {availableUsersLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                      <p className="text-gray-600 dark:text-gray-400">Loading available users...</p>
                    </div>
                  ) : (
                    <>
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
                    </>
                  )}
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

        {/* Member Report Modal */}
        {showMemberReport && reportMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-y-auto py-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl dark:shadow-slate-900/60 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-700 dark:to-cyan-700 p-6 text-white flex items-center justify-between z-10">
                <div>
                  <h2 className="text-2xl font-bold">Member Report</h2>
                  <p className="text-sm opacity-90 mt-1">{reportMember.name} ({reportMember.governor_id})</p>
                </div>
                <button
                  onClick={closeMemberReport}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/40 dark:to-indigo-800/40 rounded-xl p-4 border border-indigo-200 dark:border-indigo-700">
                    <div className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold mb-1">Total RSS</div>
                    <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">{formatNumber(reportMember.total_rss)}</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/40 dark:to-purple-800/40 rounded-xl p-4 border border-purple-200 dark:border-purple-700">
                    <div className="text-sm text-purple-600 dark:text-purple-400 font-semibold mb-1">Weeks Donated</div>
                    <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{reportMember.weeks_donated}</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
                    <div className="text-sm text-blue-600 dark:text-blue-400 font-semibold mb-1">Contributions</div>
                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{reportMember.contributions?.length || 0}</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/40 dark:to-green-800/40 rounded-xl p-4 border border-green-200 dark:border-green-700">
                    <div className="text-sm text-green-600 dark:text-green-400 font-semibold mb-1">Last Activity</div>
                    <div className="text-xs font-bold text-green-700 dark:text-green-300 line-clamp-2">{formatDate(reportMember.last_contribution)}</div>
                  </div>
                </div>

                {/* Resource Breakdown */}
                <div className="bg-gray-50 dark:bg-slate-700/30 rounded-xl p-4 border border-gray-200 dark:border-slate-600">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Resource Breakdown</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-3 text-center border border-gray-200 dark:border-slate-600">
                      <div className="text-2xl mb-1">🌾</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Food</div>
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">{formatNumber(reportMember.food)}</div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-3 text-center border border-gray-200 dark:border-slate-600">
                      <div className="text-2xl mb-1">🪵</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Wood</div>
                      <div className="text-lg font-bold text-amber-600 dark:text-amber-400">{formatNumber(reportMember.wood)}</div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-3 text-center border border-gray-200 dark:border-slate-600">
                      <div className="text-2xl mb-1">🪨</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Stone</div>
                      <div className="text-lg font-bold text-gray-600 dark:text-gray-400">{formatNumber(reportMember.stone)}</div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-3 text-center border border-gray-200 dark:border-slate-600">
                      <div className="text-2xl mb-1">💰</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Gold</div>
                      <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{formatNumber(reportMember.gold)}</div>
                    </div>
                  </div>
                </div>

                {/* Weekly Contributions Table */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Weekly Contributions</h3>
                  {reportMember.contributions && reportMember.contributions.length > 0 ? (
                    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-slate-600">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100 dark:bg-slate-700/60 sticky top-0">
                          <tr className="text-xs text-gray-600 dark:text-gray-300 font-semibold">
                            <th className="px-4 py-3 text-center">Week</th>
                            <th className="px-4 py-3 text-center">🌾 Food</th>
                            <th className="px-4 py-3 text-center">🪵 Wood</th>
                            <th className="px-4 py-3 text-center">🪨 Stone</th>
                            <th className="px-4 py-3 text-center">💰 Gold</th>
                            <th className="px-4 py-3 text-center">📦 Total</th>
                            <th className="px-4 py-3 text-center">📅 Date</th>
                            <th className="px-4 py-3 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-700/50">
                          {reportMember.contributions
                            .sort((a, b) => b.week - a.week)
                            .map((contribution) => (
                              <tr key={contribution.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                <td className="px-4 py-3 text-center font-bold text-purple-600 dark:text-purple-400">W{contribution.week}</td>
                                <td className="px-4 py-3 text-center text-green-600 dark:text-green-400 font-semibold">{formatNumber(contribution.food)}</td>
                                <td className="px-4 py-3 text-center text-amber-600 dark:text-amber-400 font-semibold">{formatNumber(contribution.wood)}</td>
                                <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-400 font-semibold">{formatNumber(contribution.stone)}</td>
                                <td className="px-4 py-3 text-center text-yellow-600 dark:text-yellow-400 font-semibold">{formatNumber(contribution.gold)}</td>
                                <td className="px-4 py-3 text-center text-indigo-600 dark:text-indigo-400 font-bold">{formatNumber(contribution.food + contribution.wood + contribution.stone + contribution.gold)}</td>
                                <td className="px-4 py-3 text-center text-xs text-gray-600 dark:text-gray-400">{formatDate(contribution.date)}</td>
                                <td className="px-4 py-3 text-center">
                                  {deleteConfirm?.week === contribution.week && deleteConfirm?.memberId === reportMember.member_id ? (
                                    <div className="flex gap-1 justify-center items-center">
                                      <button
                                        onClick={() => deleteWeeklyContribution(reportMember.member_id, contribution.week)}
                                        className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                      >
                                        Confirm
                                      </button>
                                      <button
                                        onClick={() => setDeleteConfirm(null)}
                                        className="px-2 py-1 text-xs bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => setDeleteConfirm({ memberId: reportMember.member_id, week: contribution.week })}
                                      className="px-3 py-1 text-xs bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors font-medium"
                                      title="Delete this week's contribution"
                                    >
                                      🗑️ Delete
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-center">
                      <p className="text-yellow-800 dark:text-yellow-300">No contributions recorded yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700">
                <button
                  onClick={closeMemberReport}
                  className="w-full px-4 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors font-medium"
                >
                  Close Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
