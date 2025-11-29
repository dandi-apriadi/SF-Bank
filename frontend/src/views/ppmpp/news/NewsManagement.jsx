import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { FiFileText, FiPlus, FiEdit2, FiTrash2, FiSearch, FiTag, FiEye, FiX, FiUpload, FiLoader, FiImage, FiCheckCircle, FiSave, FiDownload, FiCopy, FiShare2, FiFilter, FiGrid, FiList, FiRefreshCw, FiPaperclip, FiAlertCircle, FiClock, FiCalendar, FiUser, FiDatabase, FiSettings, FiStar, FiHeart, FiMessageSquare, FiArchive, FiMoreHorizontal, FiZap } from 'react-icons/fi';
import Card from 'components/card';
import Button from 'components/button/Button';
import { newsService } from 'services/newsService';

const NewsManagement = () => {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageZoom, setImageZoom] = useState(1);
  
  // Modern features
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [isDragOver, setIsDragOver] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  // Enhanced state for professional features
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [category, setCategory] = useState('all');
  const [author, setAuthor] = useState('all');
  // Removed showStats related UI (Trending & Activity Section)
  const [compactMode, setCompactMode] = useState(false);
  const [quickActions, setQuickActions] = useState(false);

  // Removed analytics dummy state (now derived directly from fetched data)
  
  // Enhanced form data state with more metadata
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    status: 'draft',
    category: 'announcement',
    tags: [],
    priority: 'normal',
    publishAt: '',
    seoTitle: '',
    seoDescription: '',
    allowComments: true,
    featured: false
  });
  
  const fileInputRef = useRef(null);
  const autoSaveRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Centralized base URL for images/endpoints (avoid trailing slash duplication)
  const API_BASE = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

  // Toast notification system
  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  }, []);

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (!editingId || !formData.title.trim()) return;
    
    try {
      setAutoSaveStatus('saving');
      const slug = formData.slug || formData.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const newsData = { ...formData, slug };
      await newsService.updateNewsPost(editingId, newsData, selectedImage);
      setAutoSaveStatus('saved');
      setTimeout(() => setAutoSaveStatus(''), 2000);
    } catch (err) {
      setAutoSaveStatus('error');
      setTimeout(() => setAutoSaveStatus(''), 2000);
    }
  }, [editingId, formData, selectedImage]);

  // Debounced search
  const debouncedSearch = useCallback((searchTerm) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      setSearch(searchTerm);
    }, 300);
  }, []);

  useEffect(() => {
    // Load without animations
    loadNewsItems();
  }, []);

  // Enhanced keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Escape key handling
      if (event.key === 'Escape') {
        if (showImageModal) {
          closeImageModal();
        } else if (showDetailModal) {
          closeDetailModal();
        } else if (showForm) {
          setShowForm(false);
          resetForm();
        }
        return;
      }

      // Ctrl+S for save (prevent browser save)
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        if (showForm && formData.title.trim()) {
          document.querySelector('form')?.requestSubmit();
        }
        return;
      }

      // Ctrl+N for new post
      if (event.ctrlKey && event.key === 'n') {
        event.preventDefault();
        resetForm();
        setShowForm(true);
        return;
      }

      // Ctrl+R for refresh
      if (event.ctrlKey && event.key === 'r') {
        event.preventDefault();
        loadNewsItems();
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showImageModal, showDetailModal, showForm, formData.title]);

  // Auto-save timer
  useEffect(() => {
    if (showForm && editingId && formData.title.trim()) {
      if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
      autoSaveRef.current = setTimeout(autoSave, 2000);
    }
    return () => {
      if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
    };
  }, [showForm, editingId, formData, autoSave]);

  const loadNewsItems = async (showSuccessToast = false) => {
    try {
      setLoading(true);
      setError('');
      const response = await newsService.getNewsPosts({ limit: 100 });
      const items = Array.isArray(response) ? response : (response?.data || []);
      setNewsItems(items);

      // Removed dummy analytics calculations and random values

      if (showSuccessToast) {
        showToast('Data berita berhasil dimuat', 'success');
      }
    } catch (err) {
      if (err?.message && /401|unauthorized|login/i.test(err.message)) {
        setError('Sesi Anda berakhir. Silakan login kembali.');
        showToast('Sesi berakhir. Login ulang diperlukan', 'error');
      } else {
        setError('Gagal memuat data berita. ' + err.message);
        showToast('Gagal memuat data berita', 'error');
      }
      console.error('Error loading news:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      status: 'draft',
      category: 'announcement',
      tags: [],
      priority: 'normal',
      publishAt: '',
      seoTitle: '',
      seoDescription: '',
      allowComments: true,
      featured: false
    });
    setEditingId(null);
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      setLoading(true);
      setError('');
      
      // Generate slug from title if not provided
      const slug = formData.slug || formData.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const newsData = {
        ...formData,
        slug
      };

      if (editingId) {
        await newsService.updateNewsPost(editingId, newsData, selectedImage);
        showToast('Berita berhasil diperbarui', 'success');
      } else {
        await newsService.createNewsPost(newsData, selectedImage);
        showToast('Berita berhasil dibuat', 'success');
      }
      
      await loadNewsItems(false); // Don't show success toast for reload
      resetForm();
      setShowForm(false);
    } catch (err) {
      if (err?.message && /401|unauthorized|login/i.test(err.message)) {
        setError('Tidak dapat menyimpan. Sesi login berakhir. Silakan login ulang.');
        showToast('Sesi login berakhir', 'error');
      } else {
        setError('Gagal menyimpan berita. ' + err.message);
        showToast('Gagal menyimpan berita', 'error');
      }
      console.error('Error saving news:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.news_id || item.id);
    setFormData({
      title: item.title || '',
      slug: item.slug || '',
      content: item.content || '',
      excerpt: item.excerpt || '',
      status: item.status || 'draft',
      category: item.category || 'announcement',
      tags: item.tags || [],
      priority: item.priority || 'normal',
      publishAt: item.publishAt || '',
      seoTitle: item.seoTitle || '',
      seoDescription: item.seoDescription || '',
      allowComments: item.allowComments !== false,
      featured: item.featured || false
    });

    // Set image preview if featured image exists
    const imageUrl = item.featured_image;
    if (imageUrl) {
      const fullImageUrl = buildImageUrl(imageUrl);
      setImagePreview(fullImageUrl);
      // Set selectedImage to null since we're editing existing image
      setSelectedImage(null);
    } else {
      // Clear preview if no image
      setImagePreview(null);
      setSelectedImage(null);
    }

    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (typeof window !== 'undefined' && window.confirm('Hapus berita ini?')) {
      try {
        setLoading(true);
        setError('');
        await newsService.deleteNewsPost(id);
        await loadNewsItems(false);
        showToast('Berita berhasil dihapus', 'success');
      } catch (err) {
        if (err?.message && /401|unauthorized|login/i.test(err.message)) {
          setError('Tidak dapat menghapus. Sesi login berakhir. Silakan login ulang.');
          showToast('Sesi login berakhir', 'error');
        } else {
          setError('Gagal menghapus berita. ' + err.message);
          showToast('Gagal menghapus berita', 'error');
        }
        console.error('Error deleting news:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePublish = async (id) => {
    try {
      setLoading(true);
      setError('');
      await newsService.publishNewsPost(id);
      await loadNewsItems(false);
      showToast('Berita berhasil dipublikasikan', 'success');
    } catch (err) {
      if (err?.message && /401|unauthorized|login/i.test(err.message)) {
        setError('Tidak dapat mempublikasikan. Sesi login berakhir. Silakan login ulang.');
        showToast('Sesi login berakhir', 'error');
      } else {
        setError('Gagal mempublikasikan berita. ' + err.message);
        showToast('Gagal mempublikasikan berita', 'error');
      }
      console.error('Error publishing news:', err);
    } finally {
      setLoading(false);
    }
  };

  // Bulk actions
  const handleSelectAll = () => {
    if (selectedItems.size === filtered.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filtered.map(item => item.news_id || item.id)));
    }
  };

  const handleSelectItem = (id) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) return;
    
    if (typeof window !== 'undefined' && window.confirm(`Hapus ${selectedItems.size} berita yang dipilih?`)) {
      try {
        setLoading(true);
        const deletePromises = Array.from(selectedItems).map(id => newsService.deleteNewsPost(id));
        await Promise.all(deletePromises);
        await loadNewsItems(false);
        setSelectedItems(new Set());
        showToast(`${selectedItems.size} berita berhasil dihapus`, 'success');
      } catch (err) {
        showToast('Gagal menghapus berita', 'error');
        console.error('Error bulk deleting:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Professional Analytics Dashboard Component
  // Removed StatsCard / QuickStatsPanel / TrendingNews components

  // Enhanced filtering with more options
  const filtered = useMemo(() => {
    return newsItems.filter(n => {
      const matchesSearch = n.title?.toLowerCase().includes(search.toLowerCase()) ||
                           n.slug?.toLowerCase().includes(search.toLowerCase()) ||
                           n.content?.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filterStatus === 'all' || n.status === filterStatus;
      const matchesCategory = category === 'all' || n.category === category;
      const matchesAuthor = author === 'all' || n.author_id === author;

      // Date range filter
      const matchesDate = (() => {
        if (!dateRange.start && !dateRange.end) return true;
        const itemDate = new Date(n.created_at);
        const startDate = dateRange.start ? new Date(dateRange.start) : null;
        const endDate = dateRange.end ? new Date(dateRange.end) : null;

        if (startDate && endDate) {
          return itemDate >= startDate && itemDate <= endDate;
        } else if (startDate) {
          return itemDate >= startDate;
        } else if (endDate) {
          return itemDate <= endDate;
        }
        return true;
      })();

      return matchesSearch && matchesFilter && matchesCategory && matchesAuthor && matchesDate;
    }).sort((a, b) => {
      const aValue = a[sortBy] || '';
      const bValue = b[sortBy] || '';

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [newsItems, search, filterStatus, category, author, dateRange, sortBy, sortOrder]);

  // Enhanced Skeleton loading component with more realistic patterns
  const SkeletonRow = () => (
    <tr className="border-t border-gray-100">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
            <div className="w-32 h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="w-24 h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
      </td>
      <td className="px-4 py-4">
        <div className="w-20 h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
      </td>
      <td className="px-4 py-4">
        <div className="w-16 h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
      </td>
      <td className="px-4 py-4">
        <div className="flex gap-2 justify-end">
          <div className="w-8 h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
          <div className="w-8 h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
          <div className="w-8 h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
        </div>
      </td>
    </tr>
  );

  // Modern Loading Spinner Component
  const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12'
    };

    return (
      <div className="flex items-center justify-center gap-3">
        <div className={`relative ${sizeClasses[size]}`}>
          <div className="absolute inset-0 rounded-full border-2 border-blue-100"></div>
          <div className="absolute inset-0 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
        </div>
        {text && <span className="text-sm text-gray-600 animate-pulse">{text}</span>}
      </div>
    );
  };

  // Enhanced Grid Skeleton
  const GridSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="w-full h-48 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded flex-1 mr-2 bg-[length:200%_100%] animate-shimmer"></div>
              <div className="w-4 h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded bg-[length:200%_100%] animate-shimmer"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded bg-[length:200%_100%] animate-shimmer"></div>
              <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-3/4 bg-[length:200%_100%] animate-shimmer"></div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-20 bg-[length:200%_100%] animate-shimmer"></div>
              <div className="flex gap-1">
                <div className="w-8 h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg bg-[length:200%_100%] animate-shimmer"></div>
                <div className="w-8 h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg bg-[length:200%_100%] animate-shimmer"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Toast component
  const ToastNotification = () => {
    if (!toast.show) return null;

    const bgColor = toast.type === 'success' ? 'bg-green-500' : 
                   toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500';

    return (
      <div className={`fixed top-4 right-4 z-50 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ${toast.show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
        <div className="flex items-center gap-2">
          {toast.type === 'success' && <FiCheckCircle />}
          {toast.type === 'error' && <FiX />}
          {toast.type === 'info' && <FiLoader />}
          <span>{toast.message}</span>
        </div>
      </div>
    );
  };

  const statusBadge = (status) => {
    const map = {
      published: 'bg-green-100 text-green-700',
      draft: 'bg-amber-100 text-amber-700',
      archived: 'bg-gray-100 text-gray-600'
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${map[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Tipe file tidak didukung. Gunakan JPEG, PNG, GIF, atau WEBP.');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Ukuran file terlalu besar. Maksimal 5MB.');
        return;
      }

      setSelectedImage(file);
      setError('');

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    showToast('Gambar dihapus', 'info');
  };

  // Drag & Drop handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      if (imageFile.size > 5 * 1024 * 1024) {
        showToast('Ukuran file terlalu besar (maksimal 5MB)', 'error');
        return;
      }
      
      setSelectedImage(imageFile);
      
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(imageFile);
      
      showToast('Gambar berhasil ditambahkan', 'success');
    } else if (files.length > 0) {
      showToast('File harus berupa gambar', 'error');
    }
  }, [showToast]);

  // Grid view render - Enhanced for Mobile
  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {filtered.map((item) => (
        <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group card-hover touch-manipulation">
          <div className="relative">
            {item.featured_image ? (
              <img
                src={buildImageUrl(item.featured_image)}
                alt={item.title}
                className="w-full h-40 sm:h-48 object-cover cursor-pointer group-hover:scale-105 transition-transform duration-300"
                onClick={() => openImageModal(buildImageUrl(item.featured_image), item.title)}
                onError={handleImageError}
              />
            ) : (
              <div className="w-full h-40 sm:h-48 bg-gray-100 flex items-center justify-center">
                <FiImage className="h-12 w-12 text-gray-400" />
              </div>
            )}
            <div className="absolute top-3 right-3">
              <span className={`px-2 py-1 text-xs font-medium rounded-full backdrop-blur-sm ${
                item.status === 'published' ? 'bg-green-100/90 text-green-800' :
                item.status === 'draft' ? 'bg-yellow-100/90 text-yellow-800' :
                'bg-gray-100/90 text-gray-800'
              }`}>
                {item.status === 'published' ? 'Published' :
                 item.status === 'draft' ? 'Draft' : 'Archived'}
              </span>
            </div>
            {/* Mobile-friendly selection checkbox */}
            <div className="absolute top-3 left-3">
              <input
                type="checkbox"
                checked={selectedItems.has(item.id)}
                onChange={() => handleSelectItem(item.id)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 touch-manipulation bg-white/90 backdrop-blur-sm"
              />
            </div>
          </div>

          <div className="p-4">
            <div className="mb-3">
              <h3 className="font-medium text-gray-900 text-base leading-tight mb-2">
                {item.title}
              </h3>
            </div>

            <p className="text-sm text-gray-600 mb-4 leading-relaxed" style={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {item.content}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <FiCalendar className="h-3 w-3" />
                <span>{new Date(item.createdAt).toLocaleDateString('id-ID')}</span>
              </div>
              {item.news_attachments && item.news_attachments.length > 0 && (
                <div className="flex items-center gap-1">
                  <FiPaperclip className="h-3 w-3" />
                  <span>{item.news_attachments.length}</span>
                </div>
              )}
            </div>

            {/* Mobile-optimized action buttons */}
            <div className="flex flex-col gap-2">
              <Button
                variant="secondary"
                size="sm"
                outlined
                onClick={() => viewNewsItem(item)}
                className="w-full touch-manipulation py-3"
              >
                <FiEye className="mr-2" />
                Lihat Detail
              </Button>
              <div className="flex gap-2">
                <button
                  onClick={() => editNewsItem(item)}
                  className="flex-1 p-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors touch-manipulation flex items-center justify-center gap-2 text-sm font-medium"
                  title="Edit"
                >
                  <FiEdit2 className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                {item.status === 'draft' && (
                  <button
                    onClick={() => handlePublish(item.news_id || item.id)}
                    className="flex-1 p-3 text-green-600 hover:bg-green-50 rounded-lg transition-colors touch-manipulation flex items-center justify-center gap-2 text-sm font-medium"
                    title="Publikasikan"
                  >
                    <FiCheckCircle className="h-4 w-4" />
                    <span>Publish</span>
                  </button>
                )}
                <button
                  onClick={() => deleteNewsItem(item.id)}
                  className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors touch-manipulation"
                  title="Hapus"
                >
                  <FiTrash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const openImageModal = (imageUrl, title) => {
    setModalImage({ url: imageUrl, title });
    setShowImageModal(true);
  };

  // Additional functions for grid view
  const viewNewsItem = useCallback((item) => {
    openDetailModal(item);
  }, []);

  const editNewsItem = useCallback((item) => {
    handleEdit(item);
  }, []);

  const deleteNewsItem = useCallback((id) => {
    handleDelete(id);
  }, []);

  // Image error handler
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://via.placeholder.com/120x80?text=No+Image';
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setModalImage(null);
    setImageZoom(1);
  };

  const openDetailModal = (item) => {
    setSelectedNews(item);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedNews(null);
  };

  // Normalize image URL from backend (handles missing leading slash, duplicate slashes)
  const buildImageUrl = (rawPath) => {
    if (!rawPath) return '';
    // If already absolute (http/https), return as-is
    if (/^https?:\/\//i.test(rawPath)) return rawPath;
    const cleaned = ('/' + rawPath).replace(/\\/g, '/').replace(/\/+/g, '/');
    return `${API_BASE}${cleaned.startsWith('/') ? cleaned : '/' + cleaned}`;
  };

  return (
    <>
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-slide-down {
          animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite linear;
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .animate-bounce-in {
          animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(-20px);
          }
          50% {
            opacity: 1;
            transform: scale(1.05) translateY(0);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-slide-up {
          animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-scale-in {
          animation: scaleIn 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .glass-effect {
          backdrop-filter: blur(16px) saturate(180%);
          background-color: rgba(255, 255, 255, 0.75);
          border: 1px solid rgba(209, 213, 219, 0.3);
        }

        .gradient-border {
          position: relative;
          background: linear-gradient(white, white) padding-box,
                      linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4) border-box;
          border: 2px solid transparent;
        }

        .loading-dots {
          display: inline-flex;
          gap: 2px;
        }

        .loading-dots span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: currentColor;
          animation: loading-dots 1.4s infinite ease-in-out both;
        }

        .loading-dots span:nth-child(1) { animation-delay: -0.32s; }
        .loading-dots span:nth-child(2) { animation-delay: -0.16s; }
        .loading-dots span:nth-child(3) { animation-delay: 0s; }

        @keyframes loading-dots {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-hover:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
      `}</style>
      
      <div className="mt-3 grid grid-cols-1 gap-5">
      <ToastNotification />
      
  <div className="w-full">
        <div className="mb-6 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div>
            <h2 className="text-2xl xl:text-3xl font-bold text-gray-800 dark:text-white flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg w-fit">
                <FiFileText className="text-blue-600 h-5 w-5 xl:h-6 xl:w-6" />
              </div>
              <span>Manajemen Berita</span>
              {autoSaveStatus && (
                <span className={`text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1 w-fit ${
                  autoSaveStatus === 'saved' ? 'bg-green-100 text-green-700' :
                  autoSaveStatus === 'saving' ? 'bg-blue-100 text-blue-700 animate-pulse' :
                  'bg-red-100 text-red-700'
                }`}>
                  {autoSaveStatus === 'saved' && <><FiCheckCircle className="h-3 w-3" />Tersimpan</>}
                  {autoSaveStatus === 'saving' && <><FiLoader className="h-3 w-3 animate-spin" />Menyimpan...</>}
                  {autoSaveStatus === 'error' && <><FiX className="h-3 w-3" />Error</>}
                </span>
              )}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <span>Kelola pengumuman, panduan, dan informasi akademik institusi.</span>
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-gray-100 rounded font-mono hidden sm:inline">Ctrl+N</kbd>
                  <span className="sm:hidden text-gray-500">Tap</span>
                  <span>Tambah baru</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-gray-100 rounded font-mono hidden sm:inline">Ctrl+R</kbd>
                  <span className="sm:hidden text-gray-500">Pull to</span>
                  <span>Refresh</span>
                </div>
              </div>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center gap-2">
              {/* Removed toggle for statistics section */}
              <button
                onClick={() => setCompactMode(!compactMode)}
                className={`p-3 rounded-xl transition-colors touch-manipulation ${
                  compactMode ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Mode kompak"
              >
                <FiSettings className="h-4 w-4" />
              </button>
              <Button
                variant="secondary"
                size="sm"
                outlined
                onClick={() => loadNewsItems(true)}
                disabled={loading}
                title="Refresh data"
                className="touch-manipulation"
              >
                <FiRefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline ml-2">Refresh</span>
              </Button>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => { resetForm(); setShowForm(true); }}
              disabled={loading}
              title="Tambah berita baru"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 touch-manipulation flex-1 sm:flex-none"
            >
              {loading ? <FiLoader className="animate-spin h-4 w-4" /> : <FiPlus className="h-4 w-4" />}
              <span className="ml-2">Tambah Berita</span>
            </Button>
          </div>
        </div>

        {/* Statistik / Trending / Aktivitas section removed as requested */}
        
        {/* Error alert section removed as per request (previously showed session ended message). 
            Errors are still surfaced via toast notifications. */}
      </div>

  <Card extra="p-6">
        <div className="mb-6 space-y-4">
          {/* Enhanced Search and Filters - Mobile Optimized */}
          <div className="flex flex-col gap-4">
            {/* Search - Full width on mobile */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                onChange={e => debouncedSearch(e.target.value)}
                placeholder="Cari judul, slug, atau konten..."
                className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200 bg-white shadow-sm touch-manipulation"
              />
            </div>

            {/* Advanced Filters - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {/* Status Filter */}
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3 pr-10 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm w-full touch-manipulation"
                >
                  <option value="all">Semua Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
                <FiFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3 pr-10 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm w-full touch-manipulation"
                >
                  <option value="all">Semua Kategori</option>
                  <option value="announcement">Pengumuman</option>
                  <option value="news">Berita</option>
                  <option value="event">Event</option>
                  <option value="academic">Akademik</option>
                </select>
                <FiTag className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
              </div>

              {/* Date Range - Stacks on mobile */}
              <div className="col-span-1 sm:col-span-2 lg:col-span-2 flex flex-col sm:flex-row gap-2">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="border border-gray-300 rounded-xl px-3 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm flex-1 touch-manipulation"
                  placeholder="Dari tanggal"
                />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="border border-gray-300 rounded-xl px-3 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm flex-1 touch-manipulation"
                  placeholder="Sampai tanggal"
                />
              </div>

              {/* Sort Controls */}
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-xl px-3 py-3 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm flex-1 touch-manipulation"
                >
                  <option value="created_at">Tanggal</option>
                  <option value="title">Judul</option>
                  <option value="status">Status</option>
                  <option value="views">Tampilan</option>
                </select>
                <button
                  onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                  className={`px-3 py-3 rounded-xl border transition-colors touch-manipulation min-w-[48px] ${
                    sortOrder === 'asc'
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                  }`}
                  title={`Urutan: ${sortOrder === 'asc' ? 'A-Z / Lama-Baru' : 'Z-A / Baru-Lama'}`}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>

              {/* Clear Filters - Full width on mobile */}
              {(search || filterStatus !== 'all' || category !== 'all' || dateRange.start || dateRange.end) && (
                <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                  <button
                    onClick={() => {
                      setSearch('');
                      setFilterStatus('all');
                      setCategory('all');
                      setDateRange({ start: '', end: '' });
                      setSortBy('created_at');
                      setSortOrder('desc');
                    }}
                    className="w-full px-4 py-3 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl border border-red-200 transition-colors touch-manipulation"
                  >
                    <FiX className="h-4 w-4 inline mr-1" />
                    Clear
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Actions and Stats Row - Mobile Optimized */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Bulk Actions */}
            {selectedItems.size > 0 && (
              <div className="flex items-center gap-3 bg-blue-50 text-blue-700 px-4 py-3 rounded-xl border border-blue-200 order-2 sm:order-1">
                <span className="text-sm font-medium">{selectedItems.size} dipilih</span>
                <div className="flex gap-1">
                  <button
                    onClick={handleBulkDelete}
                    className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors touch-manipulation"
                    title="Hapus yang dipilih"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                  <button
                    className="text-green-600 hover:text-green-700 p-2 rounded-lg hover:bg-green-50 transition-colors touch-manipulation"
                    title="Publikasikan yang dipilih"
                  >
                    <FiCheckCircle className="h-4 w-4" />
                  </button>
                  <button
                    className="text-gray-600 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation"
                    title="Arsipkan yang dipilih"
                  >
                    <FiArchive className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between sm:justify-end gap-4 order-1 sm:order-2">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-3 rounded-lg transition-colors touch-manipulation ${
                    viewMode === 'table'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  title="Tampilan tabel"
                >
                  <FiList className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-lg transition-colors touch-manipulation ${
                    viewMode === 'grid'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  title="Tampilan grid"
                >
                  <FiGrid className="h-4 w-4" />
                </button>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-600 bg-gray-50 px-4 py-3 rounded-xl">
                <div className="flex items-center gap-2">
                  <FiDatabase className="h-4 w-4" />
                  <span className="font-medium">{filtered.length}</span>
                  <span className="hidden sm:inline">hasil</span>
                </div>
                {loading && (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="sm" text="" />
                    <span className="hidden sm:inline">Loading...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* News List - Toggle between Table and Grid View */}
        {viewMode === 'table' ? (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            {/* Mobile-optimized table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[640px]">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="text-left px-4 py-3 w-12">
                    <input
                      type="checkbox"
                      checked={selectedItems.size === filtered.length && filtered.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors"
                    />
                  </th>
                  <th className="text-left px-4 py-3 font-semibold">Judul</th>
                  <th className="text-left px-4 py-3 font-semibold">Slug</th>
                  <th className="text-left px-4 py-3 font-semibold">Tanggal</th>
                  <th className="text-left px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 w-32"></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  // Skeleton loading
                  Array.from({ length: 5 }).map((_, index) => <SkeletonRow key={index} />)
                ) : (
                  filtered.map(item => (
                    <tr key={item.news_id || item.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors group">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(item.news_id || item.id)}
                          onChange={() => handleSelectItem(item.news_id || item.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors"
                        />
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">
                        <div className="flex items-center gap-3">
                          {item.featured_image ? (
                            <div className="relative group/image">
                              <img
                                src={buildImageUrl(item.featured_image)}
                                alt={item.title}
                                className="w-12 h-8 object-cover rounded cursor-pointer hover:opacity-80 transition-all duration-200 hover:scale-105"
                                onClick={() => openImageModal(buildImageUrl(item.featured_image), item.title)}
                                title="Klik untuk memperbesar gambar"
                                onError={(e)=>{e.target.onerror=null;e.target.src='https://via.placeholder.com/120x80?text=Img';}}
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover/image:bg-opacity-20 rounded transition-all duration-200 flex items-center justify-center">
                                <FiEye className="text-white opacity-0 group-hover/image:opacity-100 transition-opacity w-3 h-3" />
                              </div>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover/image:opacity-100 transition-opacity whitespace-nowrap z-10">
                                Klik untuk lihat gambar
                              </div>
                            </div>
                          ) : (
                            <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center" title="Tidak ada gambar">
                              <FiImage className="text-gray-400 w-4 h-4" />
                            </div>
                          )}
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <FiFileText className="text-gray-400 flex-shrink-0" /> 
                            <span className="truncate">{item.title}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        <div className="flex items-center gap-1">
                          <FiTag className="text-gray-400" />
                          <span className="truncate max-w-32">{item.slug}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{formatDate(item.created_at)}</td>
                      <td className="px-4 py-3">{statusBadge(item.status)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => openDetailModal(item)}
                            className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors"
                            title="Lihat Detail"
                            disabled={loading}
                          >
                            <FiEye className="h-4 w-4" />
                          </button>
                          {item.status === 'draft' && (
                            <button 
                              onClick={() => handlePublish(item.news_id || item.id)}
                              className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 transition-colors"
                              title="Publikasikan"
                              disabled={loading}
                            >
                              <FiCheckCircle className="h-4 w-4" />
                            </button>
                          )}
                          <button 
                            onClick={() => handleEdit(item)} 
                            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                            disabled={loading}
                          >
                            <FiEdit2 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(item.news_id || item.id)} 
                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors"
                            disabled={loading}
                            title="Hapus"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
                
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <FiFileText className="h-12 w-12 text-gray-300" />
                        <p className="text-lg font-medium">
                          {search || filterStatus !== 'all' ? 'Tidak ada berita ditemukan' : 'Belum ada berita'}
                        </p>
                        <p className="text-sm">
                          {search || filterStatus !== 'all' ? 'Coba ubah filter atau kata kunci pencarian' : 'Mulai dengan menambahkan berita pertama Anda'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            </div>
          </div>
        ) : (
          // Grid View - Enhanced for Mobile
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            {loading ? (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <GridSkeleton />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="flex flex-col items-center gap-4">
                  <FiImage className="h-16 w-16 text-gray-300" />
                  <div>
                    <p className="text-lg font-medium mb-2">
                      {search || filterStatus !== 'all' ? 'Tidak ada berita ditemukan' : 'Belum ada berita'}
                    </p>
                    <p className="text-sm">
                      {search || filterStatus !== 'all' ? 'Coba ubah filter atau kata kunci pencarian' : 'Mulai dengan menambahkan berita pertama Anda'}
                    </p>
                  </div>
                  {!search && filterStatus === 'all' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setShowForm(true)}
                    >
                      <FiPlus className="mr-2" />
                      Tambah Berita Pertama
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              renderGridView()
            )}
          </div>
        )}
      </Card>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full relative mt-10 animate-fade-in border border-gray-200">
            <button
              onClick={() => { setShowForm(false); resetForm(); }}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all duration-200 z-10"
              title="Tutup (ESC)"
            >
              <FiX className="h-5 w-5" />
            </button>

            {/* Enhanced Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${
                    editingId ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    {editingId ? (
                      <FiEdit2 className="text-blue-600 h-6 w-6" />
                    ) : (
                      <FiPlus className="text-green-600 h-6 w-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {editingId ? 'Edit Berita' : 'Tambah Berita Baru'}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {editingId
                        ? 'Perbarui informasi berita yang sudah ada'
                        : 'Buat berita atau pengumuman baru untuk dipublikasikan'
                      }
                    </p>
                  </div>
                </div>
                {editingId && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        autoSaveStatus === 'saved' ? 'bg-green-500' :
                        autoSaveStatus === 'saving' ? 'bg-blue-500 animate-pulse' :
                        'bg-gray-300'
                      }`}></div>
                      <span className="text-gray-600">
                        {autoSaveStatus === 'saved' ? 'Tersimpan otomatis' :
                         autoSaveStatus === 'saving' ? 'Menyimpan...' :
                         'Auto-save aktif'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-8">
                {/* Basic Information Section */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FiFileText className="text-blue-600" />
                    Informasi Dasar
                  </h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Judul Berita *
                      </label>
                      <input
                        value={formData.title}
                        onChange={e => setFormData(f => ({ ...f, title: e.target.value }))}
                        className="w-full rounded-xl border border-gray-300 px-4 py-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-all duration-200 font-medium"
                        placeholder="Masukkan judul berita yang menarik dan informatif..."
                        required
                        disabled={loading}
                      />
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <FiZap className="h-3 w-3" />
                        Judul yang baik akan menarik lebih banyak pembaca
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Slug URL
                      </label>
                      <input
                        value={formData.slug}
                        onChange={e => setFormData(f => ({ ...f, slug: e.target.value }))}
                        className="w-full rounded-xl border border-gray-300 px-4 py-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200 font-mono"
                        placeholder="url-friendly-slug"
                        disabled={loading}
                      />
                      <p className="text-xs text-gray-500 mt-2">Kosongkan untuk generate otomatis</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Kategori
                      </label>
                      <select
                        value={formData.category}
                        onChange={e => setFormData(f => ({ ...f, category: e.target.value }))}
                        className="w-full rounded-xl border border-gray-300 px-4 py-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                        disabled={loading}
                      >
                        <option value="announcement">Pengumuman</option>
                        <option value="news">Berita</option>
                        <option value="event">Event</option>
                        <option value="academic">Akademik</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Ringkasan/Excerpt
                    </label>
                    <textarea
                      rows={3}
                      value={formData.excerpt}
                      onChange={e => setFormData(f => ({ ...f, excerpt: e.target.value }))}
                      className="w-full rounded-xl border border-gray-300 px-4 py-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200 resize-none"
                      placeholder="Ringkasan singkat yang akan muncul di daftar berita..."
                      disabled={loading}
                    />
                    <p className="text-xs text-gray-500 mt-2 flex justify-between">
                      <span>Optimal 120-160 karakter untuk SEO</span>
                      <span className={`${
                        formData.excerpt.length > 160 ? 'text-red-500' :
                        formData.excerpt.length > 120 ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {formData.excerpt.length}/160
                      </span>
                    </p>
                  </div>
                </div>

                {/* Status and Publishing Section */}
                <div className="bg-blue-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FiSettings className="text-blue-600" />
                    Pengaturan Publikasi
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Status Publikasi
                      </label>
                      <select
                        value={formData.status}
                        onChange={e => setFormData(f => ({ ...f, status: e.target.value }))}
                        className="w-full rounded-xl border border-gray-300 px-4 py-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                        disabled={loading}
                      >
                        <option value="draft">Draft - Belum dipublikasikan</option>
                        <option value="published">Published - Dapat dilihat publik</option>
                        <option value="archived">Archived - Diarsipkan</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Prioritas
                      </label>
                      <select
                        value={formData.priority}
                        onChange={e => setFormData(f => ({ ...f, priority: e.target.value }))}
                        className="w-full rounded-xl border border-gray-300 px-4 py-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                        disabled={loading}
                      >
                        <option value="low">Rendah</option>
                        <option value="normal">Normal</option>
                        <option value="high">Tinggi</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Publikasi Terjadwal
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.publishAt}
                        onChange={e => setFormData(f => ({ ...f, publishAt: e.target.value }))}
                        className="w-full rounded-xl border border-gray-300 px-4 py-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={e => setFormData(f => ({ ...f, featured: e.target.checked }))}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        disabled={loading}
                      />
                      <span className="text-sm font-medium text-gray-700">Berita Unggulan</span>
                      <FiStar className="h-4 w-4 text-yellow-500" />
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.allowComments}
                        onChange={e => setFormData(f => ({ ...f, allowComments: e.target.checked }))}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        disabled={loading}
                      />
                      <span className="text-sm font-medium text-gray-700">Izinkan Komentar</span>
                      <FiMessageSquare className="h-4 w-4 text-blue-500" />
                    </label>
                  </div>
                </div>

                {/* Enhanced Image Upload with Drag & Drop */}
                <div className="bg-green-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FiImage className="text-green-600" />
                    Media & Gambar
                  </h4>
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 transition-all duration-200 ${
                      isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {imagePreview ? (
                      <div className="space-y-6">
                        <div className="relative inline-block group">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-48 h-36 object-cover rounded-xl border shadow-lg cursor-pointer hover:opacity-90 transition-all duration-200 hover:scale-105"
                            onClick={() => openImageModal(imagePreview, 'Preview Gambar')}
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                            disabled={loading}
                            title="Hapus gambar"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-xl transition-all duration-200 flex items-center justify-center">
                            <FiEye className="text-white opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8" />
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            outlined
                            onClick={() => fileInputRef.current?.click()}
                            disabled={loading}
                          >
                            <FiUpload className="mr-2" />
                            Ganti Gambar
                          </Button>
                          <div className="text-sm text-gray-600">
                            <p className="font-medium">Tips:</p>
                            <p>• Gunakan gambar berkualitas tinggi (min. 800x600px)</p>
                            <p>• Format JPEG/PNG untuk hasil terbaik</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="mb-6">
                          <FiUpload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                          <div className="space-y-2">
                            <p className="text-xl font-semibold text-gray-700">
                              Drag & drop gambar di sini
                            </p>
                            <p className="text-sm text-gray-500">
                              atau klik untuk memilih dari komputer Anda
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={loading}
                          className="mb-4"
                        >
                          <FiImage className="mr-2" />
                          Pilih Gambar
                        </Button>
                        <div className="text-xs text-gray-500 space-y-1">
                          <p>📋 Format yang didukung: JPEG, PNG, GIF, WEBP</p>
                          <p>📏 Ukuran maksimal: 5MB</p>
                          <p>🎯 Resolusi optimal: 1200x800px (rasio 3:2)</p>
                        </div>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Enhanced Content Editor */}
                <div className="bg-purple-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FiEdit2 className="text-purple-600" />
                    Konten Berita
                  </h4>
                  <div className="space-y-4">
                    <textarea
                      rows={12}
                      value={formData.content}
                      onChange={e => setFormData(f => ({ ...f, content: e.target.value }))}
                      className="w-full rounded-xl border border-gray-300 px-4 py-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200 resize-none font-mono leading-relaxed"
                      placeholder="Tulis konten berita atau pengumuman di sini...\n\nTips untuk konten yang baik:\n• Gunakan paragraf pendek (3-4 kalimat)\n• Sertakan informasi penting di awal\n• Gunakan bullet points untuk daftar\n• Periksa ejaan dan tata bahasa"
                      disabled={loading}
                    />
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{formData.content.length}</span>
                          <span>karakter</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{formData.content.split(/\s+/).filter(word => word.length > 0).length}</span>
                          <span>kata</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">~{Math.ceil(formData.content.split(/\s+/).filter(word => word.length > 0).length / 200)}</span>
                          <span>menit baca</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPreview(!showPreview)}
                        className={`text-xs px-3 py-2 rounded-lg transition-colors ${
                          showPreview
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {showPreview ? 'Sembunyikan Preview' : 'Tampilkan Preview'}
                      </button>
                    </div>
                    {showPreview && formData.content && (
                      <div className="mt-6 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                          <FiEye className="h-4 w-4 text-gray-500" />
                          <h5 className="text-sm font-semibold text-gray-700">Preview Konten</h5>
                        </div>
                        <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                          {formData.content}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* SEO Section */}
                <div className="bg-yellow-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FiZap className="text-yellow-600" />
                    SEO & Metadata
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        SEO Title
                      </label>
                      <input
                        value={formData.seoTitle}
                        onChange={e => setFormData(f => ({ ...f, seoTitle: e.target.value }))}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                        placeholder="Judul untuk search engine (opsional)"
                        disabled={loading}
                      />
                      <p className="text-xs text-gray-500 mt-1">Kosongkan untuk menggunakan judul berita</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Meta Description
                      </label>
                      <textarea
                        rows={3}
                        value={formData.seoDescription}
                        onChange={e => setFormData(f => ({ ...f, seoDescription: e.target.value }))}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200 resize-none"
                        placeholder="Deskripsi untuk search engine (150-160 karakter)"
                        disabled={loading}
                      />
                      <p className="text-xs text-gray-500 mt-1 flex justify-between">
                        <span>Deskripsi yang muncul di hasil pencarian Google</span>
                        <span className={`${
                          formData.seoDescription.length > 160 ? 'text-red-500' :
                          formData.seoDescription.length > 150 ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {formData.seoDescription.length}/160
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Form Footer */}
              <div className="bg-gray-50 rounded-xl p-6 border-t border-gray-200">
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FiSave className="h-4 w-4" />
                      <span>Ctrl+S untuk simpan cepat</span>
                    </div>
                    {editingId && (
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          autoSaveStatus === 'saved' ? 'bg-green-500' :
                          autoSaveStatus === 'saving' ? 'bg-blue-500 animate-pulse' :
                          'bg-gray-300'
                        }`}></div>
                        <span>
                          {autoSaveStatus === 'saved' ? 'Tersimpan otomatis' :
                           autoSaveStatus === 'saving' ? 'Menyimpan...' :
                           'Auto-save aktif'}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs">
                      <FiClock className="h-3 w-3" />
                      <span>{new Date().toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      outlined
                      onClick={() => { setShowForm(false); resetForm(); }}
                      disabled={loading}
                      className="min-w-[100px]"
                    >
                      <FiX className="mr-2" />
                      Batal
                    </Button>
                    {editingId && formData.status === 'draft' && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={async () => {
                          setFormData(f => ({ ...f, status: 'published' }));
                          setTimeout(() => {
                            document.querySelector('form')?.requestSubmit();
                          }, 100);
                        }}
                        disabled={loading || !formData.title.trim()}
                        className="min-w-[140px] bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                      >
                        <FiCheckCircle className="mr-2" />
                        Publikasikan
                      </Button>
                    )}
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      disabled={loading || !formData.title.trim()}
                      className="min-w-[140px] bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    >
                      {loading ? (
                        <>
                          <FiLoader className="animate-spin mr-2" />
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <FiSave className="mr-2" />
                          {editingId ? 'Simpan Perubahan' : 'Simpan Draft'}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* News Detail Modal */}
      {showDetailModal && selectedNews && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full p-6 relative mt-10 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={closeDetailModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-10"
            >
              <FiX className="w-6 h-6" />
            </button>
            
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-2xl font-bold text-gray-800">{selectedNews.title}</h3>
                {statusBadge(selectedNews.status)}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <FiTag />
                  {selectedNews.slug}
                </span>
                <span>
                  {formatDate(selectedNews.created_at)}
                </span>
                <span>
                  Oleh: {selectedNews.User?.fullname || 'Admin'}
                </span>
              </div>
            </div>

            {/* Featured Image */}
            {selectedNews.featured_image && (
              <div className="mb-6">
                <img
                  src={buildImageUrl(selectedNews.featured_image)}
                  alt={selectedNews.title}
                  className="w-full max-h-64 object-cover rounded-lg shadow-md cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => openImageModal(buildImageUrl(selectedNews.featured_image), selectedNews.title)}
                  onError={(e)=>{e.target.onerror=null;e.target.src='https://via.placeholder.com/600x240?text=No+Image';}}
                />
                <p className="text-xs text-gray-500 mt-2 text-center">Klik gambar untuk memperbesar</p>
              </div>
            )}

            {/* Content */}
            <div className="prose max-w-none">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Konten Berita:</h4>
                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {selectedNews.content}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-between items-center pt-4 border-t">
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    closeDetailModal();
                    handleEdit(selectedNews);
                  }}
                >
                  <FiEdit2 className="mr-2" />
                  Edit Berita
                </Button>
                {selectedNews.status === 'draft' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      closeDetailModal();
                      handlePublish(selectedNews.news_id || selectedNews.id);
                    }}
                  >
                    <FiCheckCircle className="mr-2" />
                    Publikasikan
                  </Button>
                )}
              </div>
              <Button
                variant="secondary"
                size="sm"
                outlined
                onClick={closeDetailModal}
              >
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {showImageModal && modalImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={closeImageModal}>
          <div className="relative max-w-5xl max-h-[95vh] bg-white rounded-xl overflow-hidden shadow-2xl">
            <button 
              onClick={closeImageModal}
              className="absolute top-4 right-4 z-10 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
              title="Tutup (ESC)"
            >
              <FiX className="w-5 h-5" />
            </button>
            
            {/* Zoom Controls */}
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <button
                onClick={() => setImageZoom(prev => Math.min(prev + 0.25, 3))}
                className="bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                title="Perbesar"
                disabled={imageZoom >= 3}
              >
                <span className="text-lg font-bold">+</span>
              </button>
              <button
                onClick={() => setImageZoom(prev => Math.max(prev - 0.25, 0.5))}
                className="bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                title="Perkecil"
                disabled={imageZoom <= 0.5}
              >
                <span className="text-lg font-bold">-</span>
              </button>
              <button
                onClick={() => setImageZoom(1)}
                className="bg-black/50 text-white rounded px-3 py-2 hover:bg-black/70 transition-colors text-sm"
                title="Reset ukuran"
              >
                {Math.round(imageZoom * 100)}%
              </button>
            </div>
            
            <div className="p-6 pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FiImage className="text-blue-600" />
                Preview Gambar Berita
              </h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{modalImage.title}</p>
            </div>
            
            <div className="p-6 flex justify-center bg-gray-50 min-h-[300px] relative overflow-auto">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-500">Memuat gambar...</p>
                  </div>
                </div>
              )}
              <img 
                src={modalImage.url}
                alt={modalImage.title}
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-lg transition-transform duration-200"
                onClick={(e) => e.stopPropagation()}
                onLoad={() => setImageLoading(false)}
                onLoadStart={() => setImageLoading(true)}
                style={{ 
                  display: imageLoading ? 'none' : 'block',
                  transform: `scale(${imageZoom})`,
                  transformOrigin: 'center'
                }}
              />
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t">
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  <div className="flex items-center gap-2 mb-1">
                    <span>URL Gambar:</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(modalImage.url)}
                      className="text-blue-600 hover:text-blue-700 underline"
                      title="Salin URL gambar"
                    >
                      Salin
                    </button>
                  </div>
                  <code className="text-xs bg-gray-200 px-2 py-1 rounded block truncate max-w-xs">
                    {modalImage.url}
                  </code>
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-gray-200 rounded font-mono">ESC</kbd>
                  <span>untuk menutup</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default NewsManagement;
