import React, { useEffect, useState } from 'react';
import { FiSearch, FiRefreshCw, FiUserPlus, FiEdit2, FiTrash2, FiUser, FiMail, FiShield } from 'react-icons/fi';
import { UserService } from '../../../services/userService';

const initialForm = { fullname: '', email: '', role: 'koordinator', password: '' };

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // No animations: ensure immediate render
  }, []);

  const load = async () => {
    setLoading(true); 
    setError('');
    const controller = new AbortController();
    
    try {
      const data = await UserService.getUsers(controller.signal);
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      if (e.name !== 'AbortError') {
        setError(e.message || 'Gagal memuat data user');
      }
    } finally {
      setLoading(false);
    }
    
    return () => controller.abort();
  };

  useEffect(() => { load(); }, []);

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return (
      u.fullname?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    );
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); 
    setError('');
    
    // Client-side validation
    if (!form.fullname.trim()) {
      setError('Nama lengkap harus diisi');
      setSaving(false);
      return;
    }
    
    if (!form.email.trim()) {
      setError('Email harus diisi');
      setSaving(false);
      return;
    }
    
    if (!editingId && !form.password.trim()) {
      setError('Password harus diisi');
      setSaving(false);
      return;
    }
    
    if (form.password.trim() && form.password.length < 8) {
      setError('Password harus minimal 8 karakter');
      setSaving(false);
      return;
    }
    
    try {
      if (editingId) {
        // For editing, don't send password if it's empty
        const { password, ...rest } = form;
        const updateData = password && password.trim() !== '' ? form : rest;
        await UserService.updateUser(editingId, updateData);
      } else {
        await UserService.createUser(form);
      }
      
      setForm(initialForm);
      setEditingId(null);
      setShowForm(false);
      await load();
    } catch (e) {
      setError(e.message || 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (u) => {
    setEditingId(u.user_id);
    setForm({ fullname: u.fullname || '', email: u.email || '', role: u.role || 'koordinator', password: '' });
    setShowForm(true);
  };

  const startAdd = () => {
    setEditingId(null);
    setForm(initialForm);
    setShowForm(true);
  };

  const cancelForm = () => {
    setEditingId(null);
    setForm(initialForm);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus user ini?')) return;
    
    try {
      await UserService.deleteUser(id);
      await load();
    } catch (e) {
      setError(e.message || 'Gagal menghapus user');
    }
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'koordinator': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'unit': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'pimpinan': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'koordinator': return <FiUser className="w-3 h-3" />;
      case 'unit': return <FiShield className="w-3 h-3" />;
      case 'pimpinan': return <FiUser className="w-3 h-3" />;
      default: return <FiUser className="w-3 h-3" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
  <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
              Manajemen User
            </h1>
            <p className="text-slate-600">Kelola pengguna sistem PRIMA dengan mudah dan efisien</p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <button 
              onClick={load} 
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-sm transition-all duration-200"
            >
              <FiRefreshCw className="w-4 h-4" /> Reload
            </button>
            <button 
              onClick={startAdd}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <FiUserPlus className="w-4 h-4" /> Tambah User
            </button>
          </div>
        </div>

        {/* Search Section */}
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 text-slate-700 placeholder-slate-400 transition-all duration-200"
              placeholder="Cari berdasarkan nama, email, atau role..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-2xl font-bold text-slate-800">
                  {editingId ? 'Edit User' : 'Tambah User Baru'}
                </h2>
                <p className="text-slate-600 mt-1">
                  {editingId ? 'Perbarui informasi pengguna' : 'Isi formulir untuk menambah pengguna baru'}
                </p>
              </div>
              
              <form onSubmit={onSubmit} className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      <FiUser className="inline w-4 h-4 mr-2" />
                      Nama Lengkap
                    </label>
                    <input 
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-slate-50" 
                      value={form.fullname} 
                      onChange={e=>setForm(f=>({...f, fullname:e.target.value}))} 
                      required 
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      <FiMail className="inline w-4 h-4 mr-2" />
                      Email
                    </label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-slate-50" 
                      value={form.email} 
                      onChange={e=>setForm(f=>({...f, email:e.target.value}))} 
                      required 
                      placeholder="contoh@email.com"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      <FiShield className="inline w-4 h-4 mr-2" />
                      Role
                    </label>
                    <select 
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-slate-50" 
                      value={form.role} 
                      onChange={e=>setForm(f=>({...f, role:e.target.value}))}
                    >
                      <option value="koordinator">Koordinator Prodi</option>
                      <option value="unit">Unit PPMPP</option>
                      <option value="pimpinan">Pimpinan Institusi</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Password {editingId && <span className="text-slate-400 font-normal">(kosongkan jika tidak diubah)</span>}
                    </label>
                    <input 
                      type="password" 
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-slate-50" 
                      value={form.password} 
                      onChange={e=>setForm(f=>({...f, password:e.target.value}))} 
                      placeholder={editingId ? "Biarkan kosong jika tidak diubah" : "Masukkan password"} 
                      {...(editingId?{}:{required:true})} 
                    />
                    {!editingId && (
                      <p className="text-xs text-slate-500 mt-1">Password harus minimal 8 karakter</p>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                  <button 
                    type="button" 
                    onClick={cancelForm}
                    className="px-6 py-3 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all duration-200 font-medium"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    disabled={saving} 
                    className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {editingId ? 'Memperbarui...' : 'Menambahkan...'}
                      </>
                    ) : (
                      <>
                        {editingId ? <FiEdit2 className="w-4 h-4" /> : <FiUserPlus className="w-4 h-4" />}
                        {editingId ? 'Update User' : 'Tambah User'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Users Table */}
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">Daftar Pengguna</h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {filtered.length} pengguna
              </span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">PENGGUNA</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">ROLE</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">STATUS</th>
                  <th className="text-right py-4 px-6 font-semibold text-slate-700 text-sm">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={4} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-slate-500 font-medium">Memuat data pengguna...</p>
                      </div>
                    </td>
                  </tr>
                )}
                
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                          <FiUser className="w-8 h-8 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-slate-600 font-medium">Tidak ada pengguna ditemukan</p>
                          <p className="text-slate-400 text-sm">Coba ubah kata kunci pencarian atau tambah pengguna baru</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
                
                {filtered.map((u, index) => (
                  <tr 
                    key={u.user_id} 
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors duration-200"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {u.fullname?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{u.fullname}</p>
                          <p className="text-slate-500 text-sm flex items-center gap-1">
                            <FiMail className="w-3 h-3" />
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${getRoleColor(u.role)}`}>
                        {getRoleIcon(u.role)}
                        {u.role === 'koordinator' ? 'Koordinator Prodi' : 
                         u.role === 'unit' ? 'Unit PPMPP' : 
                         u.role === 'pimpinan' ? 'Pimpinan Institusi' : u.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        u.is_active 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${u.is_active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        {u.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => startEdit(u)} 
                          className="p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200 transition-all duration-200 group" 
                          title="Edit pengguna"
                        >
                          <FiEdit2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                        </button>
                        <button 
                          onClick={() => handleDelete(u.user_id)} 
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-all duration-200 group" 
                          title="Hapus pengguna"
                        >
                          <FiTrash2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
