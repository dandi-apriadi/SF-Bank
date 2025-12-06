import React, { useState, useEffect } from "react";
import { FiSearch, FiEdit2, FiTrash2, FiX, FiCheck, FiMail, FiUser, FiShield, FiActivity, FiLoader } from "react-icons/fi";
import userService from "../../services/userService.js";

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

  // State management
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Edit/Create panels
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "R1", password: "" });
  const [editLoading, setEditLoading] = useState(false);

  const [showCreatePanel, setShowCreatePanel] = useState(false);
  const [createForm, setCreateForm] = useState({ user_id: "", name: "", email: "", role: "R1", password: "" });
  const [createLoading, setCreateLoading] = useState(false);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getAllUsers({ 
        page: currentPage, 
        limit: itemsPerPage,
        role: roleFilter !== "All" ? roleFilter : null 
      });
      
      if (response.data) {
        setUsers(response.data);
      } else {
        setUsers(response || []);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // Filtered users
  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.user_id.toString().includes(searchQuery) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = roleFilter === "All" || user.role === roleFilter;
    return matchSearch && matchRole;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to page 1 when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter]);

  const openEditPanel = (user) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setShowEditPanel(true);
  };

  const openCreatePanel = () => {
    setCreateForm({ user_id: "", name: "", email: "", role: "R1" });
    setShowCreatePanel(true);
  };

  const closeEditPanel = () => {
    setShowEditPanel(false);
    setSelectedUser(null);
    setEditForm({ name: "", email: "", role: "R1", password: "" });
  };

  const closeCreatePanel = () => {
    setShowCreatePanel(false);
    setCreateForm({ user_id: "", name: "", email: "", role: "R1", password: "" });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateInputChange = (e) => {
    const { name, value } = e.target;
    setCreateForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitEditForm = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim() || !editForm.email.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setEditLoading(true);
      const updateData = {
        name: editForm.name.trim(),
        email: editForm.email.trim(),
        role: editForm.role,
      };
      
      // Only include password if it's provided
      if (editForm.password && editForm.password.trim()) {
        updateData.password = editForm.password.trim();
      }
      
      const response = await userService.updateUser(selectedUser.id, updateData);

      // Refresh data from server to ensure sync with database
      await fetchUsers();

      alert(`User ${editForm.name} updated successfully!`);
      closeEditPanel();
    } catch (err) {
      console.error('Error updating user:', err);
      alert(`Error updating user: ${err.message}`);
    } finally {
      setEditLoading(false);
    }
  };

  const submitCreateForm = async (e) => {
    e.preventDefault();
    if (!createForm.user_id.trim() || !createForm.name.trim() || !createForm.email.trim() || !createForm.password.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setCreateLoading(true);
      const response = await userService.createUser({
        user_id: createForm.user_id.trim(),
        name: createForm.name.trim(),
        email: createForm.email.trim(),
        role: createForm.role,
        password: createForm.password.trim(),
        status: 'Active',
        joined_date: new Date().toISOString().slice(0, 10),
      });

      // Add new user to local state
      setUsers((prev) => [response.data || response, ...prev]);
      alert(`User ${createForm.name} created successfully!`);
      closeCreatePanel();
      setCurrentPage(1);
    } catch (err) {
      console.error('Error creating user:', err);
      alert(`Error creating user: ${err.message}`);
    } finally {
      setCreateLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    // Find user to check role
    const userToDelete = users.find(u => u.id === userId);
    
    if (userToDelete?.role === 'Admin') {
      alert("Cannot delete Admin users. This is a security restriction.");
      return;
    }
    
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await userService.deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
      alert("User deleted successfully!");
      if (showEditPanel && selectedUser?.id === userId) {
        closeEditPanel();
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      alert(`Error deleting user: ${err.message}`);
    }
  };

  // Helper functions
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "-";
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
      case "R1":
        return "bg-red-500 text-white";
      case "R2":
        return "bg-orange-500 text-white";
      case "R3":
        return "bg-green-500 text-white";
      case "R4":
        return "bg-blue-500 text-white";
      case "R5":
        return "bg-purple-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Calculate statistics
  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === "Admin").length,
    r1: users.filter(u => u.role === "R1").length,
    r5: users.filter(u => u.role === "R5").length,
    active: users.filter(u => u.status === "Active").length,
  };

  return (
    <div key={`user-mgmt-${isDarkMode}`} className="w-full min-h-full flex flex-col bg-slate-50 transition-colors duration-300" style={{backgroundColor: isDarkMode ? '#111c44' : '#f8fafc'}}>
      <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 text-gray-800 dark:text-gray-100">
        
        {/* Header */}
        <header className="mb-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              User Management
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Manage kingdom users - view details, edit roles, and track activity
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => openCreatePanel()}
              className="bg-indigo-600 dark:bg-indigo-700 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-md dark:shadow-slate-900/50 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add User
            </button>
          </div>
        </header>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Users */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold mt-1">{loading ? '-' : stats.total}</p>
              </div>
              <FiUser className="text-4xl text-blue-200" />
            </div>
          </div>

          {/* Admins */}
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4 shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Admins</p>
                <p className="text-3xl font-bold mt-1">{loading ? '-' : stats.admins}</p>
              </div>
              <FiShield className="text-4xl text-yellow-200" />
            </div>
          </div>

          {/* R1 */}
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">R1</p>
                <p className="text-3xl font-bold mt-1">{loading ? '-' : stats.r1}</p>
              </div>
              <FiShield className="text-4xl text-red-200" />
            </div>
          </div>

          {/* Active Users */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Active</p>
                <p className="text-3xl font-bold mt-1">{loading ? '-' : stats.active}</p>
              </div>
              <FiActivity className="text-4xl text-green-200" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">Error: {error}</p>
            <button onClick={fetchUsers} className="mt-2 underline text-sm">Try again</button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <FiLoader className="animate-spin text-4xl text-indigo-600 dark:text-indigo-400" />
            <p className="ml-3 text-gray-600 dark:text-gray-300">Loading users...</p>
          </div>
        ) : (
          <>
            {/* Search and Filter */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg dark:shadow-2xl dark:shadow-slate-900/60 p-4 mb-6 border border-gray-100 dark:border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <option value="R5">R5</option>
                <option value="R4">R4</option>
                <option value="R3">R3</option>
                <option value="R2">R2</option>
                <option value="R1">R1</option>
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
                  <th className="px-4 py-3 text-center">Last Login</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700/50">
                {paginatedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                    onClick={() => openEditPanel(user)}
                  >
                    {/* User */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {user.user_id}
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

                    {/* Last Login */}
                    <td className="px-4 py-3 text-center text-xs text-gray-600 dark:text-gray-400">
                      {formatDateTime(user.last_login)}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); openEditPanel(user); }}
                          className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/60 transition-colors"
                          title="Edit user"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteUser(user.id); }}
                          disabled={user.role === 'Admin'}
                          className={`p-2 rounded-lg transition-colors ${
                            user.role === 'Admin'
                              ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50'
                              : 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/60'
                          }`}
                          title={user.role === 'Admin' ? 'Cannot delete Admin users' : 'Delete user'}
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
          </>
        )}

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
                
                {/* User ID (read-only) */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    User ID
                  </label>
                  <div className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-600 dark:text-gray-400 font-mono">
                    {selectedUser?.user_id}
                  </div>
                </div>

                {/* Alliance (read-only) */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Alliance
                  </label>
                  <div className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-600 dark:text-gray-400">
                    {selectedUser?.alliance?.name || selectedUser?.alliance || "-"}
                  </div>
                </div>

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

                {/* Password */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    New Password (leave empty to keep current)
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={editForm.password}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter new password (optional)"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Leave blank to keep the current password
                  </p>
                </div>
              </div>

              {/* Role Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Role
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
                    <option value="Admin">Admin</option>
                    <option value="R5">R5</option>
                    <option value="R4">R4</option>
                    <option value="R3">R3</option>
                    <option value="R2">R2</option>
                    <option value="R1">R1</option>
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Admin role has full access to all features
                  </p>
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

      {/* Right Side Create Panel */}
      {showCreatePanel && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={closeCreatePanel}
          />

          <div className="fixed top-0 right-0 h-full w-full sm:w-[500px] bg-white dark:bg-slate-800 shadow-2xl z-50 overflow-y-auto animate-slide-in-right">
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 shadow-lg z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Add User</h2>
                  <p className="text-indigo-100 text-sm mt-1">Create a new user record</p>
                </div>
                <button
                  onClick={closeCreatePanel}
                  className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={submitCreateForm} className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Information</h3>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">User ID *</label>
                  <input
                    type="number"
                    name="user_id"
                    value={createForm.user_id}
                    onChange={handleCreateInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., 2001"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={createForm.name}
                    onChange={handleCreateInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={createForm.email}
                    onChange={handleCreateInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={createForm.password}
                    onChange={handleCreateInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter initial password"
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Minimum 8 characters recommended
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Role</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">User Role</label>
                  <select
                    name="role"
                    value={createForm.role}
                    onChange={handleCreateInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Admin">Admin</option>
                    <option value="R5">R5</option>
                    <option value="R4">R4</option>
                    <option value="R3">R3</option>
                    <option value="R2">R2</option>
                    <option value="R1">R1</option>
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Admin role has full access to all features</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={closeCreatePanel}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors shadow-lg"
                >
                  Create User
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
