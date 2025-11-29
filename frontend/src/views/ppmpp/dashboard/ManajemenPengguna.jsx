import React, { useState } from "react";
import Card from "components/card";
import { FiUsers, FiPlus, FiEdit, FiTrash2, FiSearch, FiFilter, FiUserCheck, FiUserX } from "react-icons/fi";

const ManajemenPengguna = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Dummy data untuk users
  const users = [
    {
      id: 1,
      name: "Dr. Ahmad Fauzi",
      email: "ahmad.fauzi@university.ac.id",
      role: "koordinator",
      studyProgram: "Informatika",
      faculty: "Teknik",
      status: "active",
      lastLogin: "2025-08-09",
      avatar: "/img/avatars/avatar1.png"
    },
    {
      id: 2,
      name: "Prof. Dr. Indira Sari",
      email: "indira.sari@university.ac.id",
      role: "pimpinan",
      studyProgram: "-",
      faculty: "Rektorat",
      status: "active",
      lastLogin: "2025-08-08",
      avatar: "/img/avatars/avatar2.png"
    },
  // Dosen user removed
    {
      id: 4,
      name: "Muhammad Rizki",
      email: "muhammad.rizki@university.ac.id",
      role: "ppmpp",
      studyProgram: "-",
      faculty: "LPPM",
      status: "active",
      lastLogin: "2025-08-09",
      avatar: "/img/avatars/avatar4.png"
    },
  // Dosen user removed
  ];

  const roles = [
    { value: "all", label: "Semua Role" },
    { value: "pimpinan", label: "Pimpinan Institusi" },
    { value: "ppmpp", label: "Unit PPMPP" },
    { value: "koordinator", label: "Koordinator Prodi" },
  // Dosen role removed
  ];

  const statuses = [
    { value: "all", label: "Semua Status" },
    { value: "active", label: "Aktif" },
    { value: "inactive", label: "Tidak Aktif" }
  ];

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    const matchesStatus = selectedStatus === "all" || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleLabel = (role) => {
    const roleMap = {
      "pimpinan": "Pimpinan Institusi",
      "ppmpp": "Unit PPMPP",
      "koordinator": "Koordinator Prodi",
  // dosen removed
    };
    return roleMap[role] || role;
  };

  const getRoleColor = (role) => {
    const colorMap = {
      "pimpinan": "bg-purple-100 text-purple-800",
      "ppmpp": "bg-blue-100 text-blue-800",
      "koordinator": "bg-green-100 text-green-800",
  // dosen removed
    };
    return colorMap[role] || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status) => {
    return status === "active" 
      ? "bg-green-100 text-green-800" 
      : "bg-red-100 text-red-800";
  };

  const userStats = {
    total: users.length,
    active: users.filter(u => u.status === "active").length,
    inactive: users.filter(u => u.status === "inactive").length,
    byRole: {
      pimpinan: users.filter(u => u.role === "pimpinan").length,
      ppmpp: users.filter(u => u.role === "ppmpp").length,
      koordinator: users.filter(u => u.role === "koordinator").length,
  // dosen removed
    }
  };

  return (
    <div className="mt-3">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-700 dark:text-white mb-2">
          Manajemen Pengguna
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Kelola akun pengguna, role, dan akses sistem PRIMA
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card extra="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Total Pengguna</p>
              <p className="text-2xl font-bold text-navy-700 dark:text-white">{userStats.total}</p>
            </div>
            <FiUsers className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        
        <Card extra="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Pengguna Aktif</p>
              <p className="text-2xl font-bold text-green-600">{userStats.active}</p>
            </div>
            <FiUserCheck className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        
        <Card extra="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Tidak Aktif</p>
              <p className="text-2xl font-bold text-red-600">{userStats.inactive}</p>
            </div>
            <FiUserX className="w-8 h-8 text-red-600" />
          </div>
        </Card>
        
        <Card extra="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Koordinator</p>
              <p className="text-2xl font-bold text-purple-600">{userStats.byRole.koordinator}</p>
            </div>
            <FiUsers className="w-8 h-8 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card extra="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama atau email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Role Filter */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {roles.map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
            
            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
          
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <FiPlus className="w-4 h-4" />
            Tambah Pengguna
          </button>
        </div>
      </Card>

      {/* Users Table */}
      <Card extra="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-navy-700 dark:text-white">
            Daftar Pengguna ({filteredUsers.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3">Pengguna</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Program Studi</th>
                <th className="px-6 py-3">Fakultas</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Login Terakhir</th>
                <th className="px-6 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    {user.studyProgram}
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    {user.faculty}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status === "active" ? "Aktif" : "Tidak Aktif"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <FiUsers className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Tidak ada pengguna yang sesuai dengan filter
            </p>
          </div>
        )}
      </Card>

      {/* Role Distribution */}
      <div className="mt-6">
        <Card extra="p-6">
          <h3 className="text-lg font-semibold text-navy-700 dark:text-white mb-4">
            Distribusi Role Pengguna
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{userStats.byRole.pimpinan}</p>
              <p className="text-sm text-gray-600">Pimpinan</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{userStats.byRole.ppmpp}</p>
              <p className="text-sm text-gray-600">PPMPP</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{userStats.byRole.koordinator}</p>
              <p className="text-sm text-gray-600">Koordinator</p>
            </div>
            {/* Dosen distribution removed */}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ManajemenPengguna;
