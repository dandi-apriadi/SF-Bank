import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function UserManagement() {
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

  // dummy users with admin role
  const [users, setUsers] = useState(() => {
    const arr = [];
    const roles = ["Member", "Officer", "Leader", "Admin"];
    const statuses = ["Active", "Inactive"];
    for (let i = 1; i <= 30; i++) {
      const joined = new Date(2023, i % 12, ((i * 3) % 28) + 1);
      arr.push({
        id: i,
        user_id: `USR-${1000 + i}`,
        name: `User ${i}`,
        email: `user${i}@kingdom.com`,
        role: roles[i % roles.length],
        status: i % 7 === 0 ? "Inactive" : "Active",
        joined_date: joined.toISOString().slice(0, 10),
        last_login: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        power: Math.floor(Math.random() * 50000000) + 10000000,
        kills: Math.floor(Math.random() * 10000000) + 1000000,
      });
    }
    return arr.sort((a, b) => b.power - a.power);
  });

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.user_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = roleFilter === "All" || user.role === roleFilter;
    const matchStatus = statusFilter === "All" || user.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to page 1 when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter, statusFilter]);

  // Right panel state for editing user
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "Member",
    status: "Active",
    power: "",
    kills: "",
  });

  const openEditPanel = (user) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      power: user.power.toString(),
      kills: user.kills.toString(),
    });
    setShowEditPanel(true);
  };

  const closeEditPanel = () => {
    setShowEditPanel(false);
    setSelectedUser(null);
    setEditForm({
      name: "",
      email: "",
      role: "Member",
      status: "Active",
      power: "",
      kills: "",
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitEditForm = (e) => {
    e.preventDefault();
    if (!editForm.name.trim() || !editForm.email.trim()) {
      alert("Please fill in all required fields");
      return;
    }
    
    // Update user
    setUsers(prev => prev.map(u => 
      u.id === selectedUser.id 
        ? {
            ...u,
            name: editForm.name.trim(),
            email: editForm.email.trim(),
            role: editForm.role,
            status: editForm.status,
            power: parseInt(editForm.power) || 0,
            kills: parseInt(editForm.kills) || 0,
          }
        : u
    ));
    
    alert(`User ${editForm.name} updated successfully!`);
    closeEditPanel();
  };

  // Delete user
  const deleteUser = (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setUsers(prev => prev.filter(u => u.id !== userId));
    alert("User deleted successfully!");
    if (showEditPanel && selectedUser?.id === userId) {

        // Helper functions
        const formatDate = (dateStr) => {
          const date = new Date(dateStr);
          return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
        };

        const formatDateTime = (dateStr) => {
          const date = new Date(dateStr);
          return date.toLocaleString("en-US", { 
            year: "numeric", 
            month: "short", 
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          });
        };

        const getRoleBadgeColor = (role) => {
          switch (role) {
            case "Admin":
              return "bg-yellow-500 text-white";
            case "Leader":
              return "bg-purple-500 text-white";
            case "Officer":
              return "bg-blue-500 text-white";
            default:
              return "bg-gray-500 text-white";
          }
        };

        const getStatusBadgeColor = (status) => {
          return status === "Active" 
            ? "bg-green-500 text-white" 
            : "bg-red-500 text-white";
        };

        // Calculate statistics
        const stats = {
          total: users.length,
          active: users.filter(u => u.status === "Active").length,
          inactive: users.filter(u => u.status === "Inactive").length,
          admins: users.filter(u => u.role === "Admin").length,
          leaders: users.filter(u => u.role === "Leader").length,
          officers: users.filter(u => u.role === "Officer").length,
          members: users.filter(u => u.role === "Member").length,
        };
      closeEditPanel();
    }
  };

  // Add Member modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [roleInput, setRoleInput] = useState("R1");
  const [joinedDateInput, setJoinedDateInput] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });
  const [notesInput, setNotesInput] = useState("");

  const openAddModal = () => {
    setNameInput("");
    setRoleInput("R1");
    setNotesInput("");
    setJoinedDateInput(() => {
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    });
    setShowAddModal(true);
  };
  const closeAddModal = () => setShowAddModal(false);

  const addMember = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return alert("Please enter a member name.");
    const maxId = members.length ? Math.max(...members.map((m) => m.id)) : 0;
    const newMember = {
      id: maxId + 1,
      external_id: `MBR-${1000 + maxId + 1}`,
      name: nameInput.trim(),
      role: roleInput,
      joined_date: joinedDateInput,
      notes: notesInput.trim(),
    };
    setMembers((prev) => [newMember, ...prev]);
    setShowAddModal(false);
    setPage(1);
  };

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  const formatDate = (d) => {
    if (!d) return "-";
    try {
      const dt = new Date(d);
      return dt.toLocaleDateString("id-ID");
    } catch {
      return d;
    }
  };

  return (
    <div key={`user-mgmt-${isDarkMode}`} className="w-full h-full flex flex-col">
    <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 text-gray-800 dark:text-gray-100">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">User Management</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Manage members — add, view, and inspect member details</p>
        </div>
        <div>
          <button 
            onClick={openAddModal} 
            className="bg-indigo-600 dark:bg-indigo-700 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-md dark:shadow-slate-900/50 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Member
          </button>
        </div>
      </header>

      <div data-aos="fade-up" className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-2xl dark:shadow-slate-900/60 p-4 border border-gray-100 dark:border-slate-700 transition-all duration-300">
        <div className="hidden sm:block overflow-x-auto rounded-lg">
          <table className="w-full table-fixed text-sm">
            <thead className="bg-gray-100 dark:bg-slate-700/60 sticky top-0">
              <tr className="text-xs text-gray-600 dark:text-gray-300 font-semibold">
                <th className="px-2 py-3 w-12 text-center">No</th>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700/50 bg-white dark:bg-slate-800">
              {pagedMembers.map((m, idx) => (
                <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors duration-150">
                  <td className="px-2 py-3 text-gray-700 dark:text-gray-400 w-12 text-center font-medium">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-mono text-xs bg-gray-50 dark:bg-slate-900/30 rounded">{m.external_id}</td>
                  <td className="px-4 py-3 flex items-center">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 flex items-center justify-center mr-3 font-semibold text-sm">{getInitials(m.name)}</div>
                    <div>
                      <div className="font-medium text-gray-800 dark:text-gray-200">{m.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Member since {formatDate(m.joined_date)}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 inline-block">
                      {m.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-400">{formatDate(m.joined_date)}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-400">{m.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile list */}
        <div className="sm:hidden space-y-3">
          {pagedMembers.map((m, idx) => (
            <div key={m.id} className="bg-gray-50 dark:bg-slate-700/60 rounded-xl p-4 shadow-sm dark:shadow-md dark:shadow-slate-900/40 border border-gray-100 dark:border-slate-600 hover:shadow-md dark:hover:shadow-slate-900/60 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1 gap-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">No. {(page - 1) * PAGE_SIZE + idx + 1}</div>
                  <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-semibold text-sm">{getInitials(m.name)}</div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 dark:text-gray-200">{m.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{m.role} • {formatDate(m.joined_date)}</div>
                  </div>
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-400 pl-13">{m.notes || '—'}</div>
            </div>
          ))}
        </div>

        {/* Pagination controls */}
        <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-200 dark:border-slate-700">
          <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Showing {pagedMembers.length} of {members.length} members</div>
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

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 dark:bg-black/60 backdrop-blur-sm">
          <div className="absolute inset-0 bg-black/40 dark:bg-black/50" onClick={closeAddModal} aria-hidden="true" />
          <div role="dialog" aria-modal="true" className="relative z-50 w-full max-w-2xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl dark:shadow-2xl dark:shadow-slate-900/60 overflow-hidden border border-gray-100 dark:border-slate-700">
              <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-white to-gray-50 dark:from-slate-800 dark:to-slate-800/95">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Add Member</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Create a new member record</p>
                </div>
                <button onClick={closeAddModal} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors" aria-label="Close modal">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              <form onSubmit={addMember} className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    value={nameInput} 
                    onChange={(e) => setNameInput(e.target.value)} 
                    className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white p-2.5 text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all" 
                    placeholder="Enter member name"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Role</label>
                  <select 
                    value={roleInput} 
                    onChange={(e) => setRoleInput(e.target.value)} 
                    className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                  >
                    <option value="R1">R1</option>
                    <option value="R2">R2</option>
                    <option value="R3">R3</option>
                    <option value="R4">R4</option>
                    <option value="R5">R5</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Joined Date</label>
                  <input 
                    type="date" 
                    value={joinedDateInput} 
                    onChange={(e) => setJoinedDateInput(e.target.value)} 
                    className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all" 
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Notes</label>
                  <input 
                    type="text" 
                    value={notesInput} 
                    onChange={(e) => setNotesInput(e.target.value)} 
                    className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white p-2.5 text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all" 
                    placeholder="Add any notes"
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
                    Add Member
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
