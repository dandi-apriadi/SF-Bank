import React, { useState, useEffect } from "react";
import { FiSearch, FiEdit2, FiTrash2, FiX, FiCheck, FiMail, FiUser, FiShield, FiActivity } from "react-icons/fi";

function UserManagement() {
  // Dark mode detection
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Sample user data with admin role
  const [users, setUsers] = useState(() => {
    const arr = [];
    const roles = ["Member", "Officer", "Leader", "Admin"];
    const statuses = ["Active", "Inactive"];
    for (let i = 1; i <= 30; i++) {
      const joined = new Date();
      joined.setDate(joined.getDate() - Math.floor(Math.random() * 365));
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

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Filtered users
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
      closeEditPanel();
    }
  };

  // Helper functions
  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

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

  return (
    <div key={`user-mgmt-${isDarkMode}`} className="w-full h-full flex flex-col">
      <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 text-gray-800 dark:text-gray-100">
        
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            User Management
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Manage kingdom users - view details, edit roles, and track activity
          </p>
        </header>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Users */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold mt-1">{stats.total}</p>
              </div>
              <FiUser className="text-4xl text-blue-200" />
            </div>
          </div>

          {/* Active Users */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Active</p>
                <p className="text-3xl font-bold mt-1">{stats.active}</p>
              </div>
              <FiActivity className="text-4xl text-green-200" />
            </div>
          </div>

          {/* Admins */}
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4 shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Admins</p>
                <p className="text-3xl font-bold mt-1">{stats.admins}</p>
              </div>
              <FiShield className="text-4xl text-yellow-200" />
            </div>
          </div>

          {/* Leaders */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Leaders</p>
                <p className="text-3xl font-bold mt-1">{stats.leaders}</p>
              </div>
              <FiShield className="text-4xl text-purple-200" />
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg dark:shadow-2xl dark:shadow-slate-900/60 p-4 mb-6 border border-gray-100 dark:border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, ID, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                />
              </div>
            </div>

            {/* Role Filter */}
            <div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
              >
                <option value="All">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Leader">Leader</option>
                <option value="Officer">Officer</option>
                <option value="Member">Member</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* User Table */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg dark:shadow-2xl dark:shadow-slate-900/60 border border-gray-100 dark:border-slate-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-700/60">
                <tr className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-center">Role</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Power</th>
                  <th className="px-4 py-3 text-right">Kills</th>
                  <th className="px-4 py-3 text-center">Last Login</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700/50">
                {paginatedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    {/* User */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {user.user_id}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <FiMail className="text-gray-400" />
                        {user.email}
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>

                    {/* Power */}
                    <td className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                      {formatNumber(user.power)}
                    </td>

                    {/* Kills */}
                    <td className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                      {formatNumber(user.kills)}
                    </td>

                    {/* Last Login */}
                    <td className="px-4 py-3 text-center text-xs text-gray-600 dark:text-gray-400">
                      {formatDateTime(user.last_login)}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditPanel(user)}
                          className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/60 transition-colors"
                          title="Edit user"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="p-2 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors"
                          title="Delete user"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-slate-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
              >
                Prev
              </button>
              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Right Side Edit Panel */}
      {showEditPanel && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={closeEditPanel}
          />

          {/* Panel */}
          <div className="fixed top-0 right-0 h-full w-full sm:w-[500px] bg-white dark:bg-slate-800 shadow-2xl z-50 overflow-y-auto animate-slide-in-right">
            {/* Panel Header */}
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 shadow-lg z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Edit User</h2>
                  <p className="text-indigo-100 text-sm mt-1">
                    Update user information and settings
                  </p>
                </div>
                <button
                  onClick={closeEditPanel}
                  className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Panel Content */}
            <form onSubmit={submitEditForm} className="p-6 space-y-6">
              {/* User Info Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  User Information
                </h3>
                
                {/* Name */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                {/* Email */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              {/* Role & Status Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Role & Status
                </h3>

                {/* Role */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    User Role
                  </label>
                  <select
                    name="role"
                    value={editForm.role}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Member">Member</option>
                    <option value="Officer">Officer</option>
                    <option value="Leader">Leader</option>
                    <option value="Admin">Admin</option>
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Admin role has full access to all features
                  </p>
                </div>

                {/* Status */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Account Status
                  </label>
                  <select
                    name="status"
                    value={editForm.status}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Statistics Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Game Statistics
                </h3>

                {/* Power */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Power
                  </label>
                  <input
                    type="number"
                    name="power"
                    value={editForm.power}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Kills */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Kills
                  </label>
                  <input
                    type="number"
                    name="kills"
                    value={editForm.kills}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={closeEditPanel}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors shadow-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default UserManagement;
