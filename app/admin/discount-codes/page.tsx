'use client';

import { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiPercent, FiCalendar, FiToggleLeft, FiToggleRight, FiCopy, FiCheck } from 'react-icons/fi';

interface DiscountCode {
  id: string;
  code: string;
  percentage: number;
  active: boolean;
  expiresAt: string | null;
  maxUses: number | null;
  currentUses: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminDiscountCodesPage() {
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCode, setEditingCode] = useState<DiscountCode | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    percentage: 10,
    expiresAt: '',
    maxUses: '',
    active: true,
  });

  useEffect(() => {
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    try {
      const response = await fetch('/api/admin/discount-codes');
      if (response.ok) {
        const data = await response.json();
        setCodes(data);
      }
    } catch (error) {
      console.error('Error fetching discount codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingCode
        ? `/api/admin/discount-codes/${editingCode.id}`
        : '/api/admin/discount-codes';
      
      const method = editingCode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
          expiresAt: formData.expiresAt || null,
        }),
      });

      if (response.ok) {
        await fetchCodes();
        setShowModal(false);
        resetForm();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save discount code');
      }
    } catch (error) {
      console.error('Error saving discount code:', error);
      alert('Failed to save discount code');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this discount code?')) return;

    try {
      const response = await fetch(`/api/admin/discount-codes/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchCodes();
      }
    } catch (error) {
      console.error('Error deleting discount code:', error);
    }
  };

  const handleToggleActive = async (code: DiscountCode) => {
    try {
      const response = await fetch(`/api/admin/discount-codes/${code.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...code, active: !code.active }),
      });

      if (response.ok) {
        await fetchCodes();
      }
    } catch (error) {
      console.error('Error toggling discount code:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      percentage: 10,
      expiresAt: '',
      maxUses: '',
      active: true,
    });
    setEditingCode(null);
  };

  const handleEdit = (code: DiscountCode) => {
    setEditingCode(code);
    setFormData({
      code: code.code,
      percentage: code.percentage,
      expiresAt: code.expiresAt ? new Date(code.expiresAt).toISOString().split('T')[0] : '',
      maxUses: code.maxUses?.toString() || '',
      active: code.active,
    });
    setShowModal(true);
  };

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, code });
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No expiration';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const isExpired = (dateString: string | null) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Discount Codes</h1>
          <p className="text-text-secondary mt-2">Create and manage promotional discount codes</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus size={20} />
          Create Code
        </button>
      </div>

      {/* Discount Codes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {codes.length === 0 ? (
          <div className="col-span-full bg-background-secondary rounded-lg p-12 text-center">
            <FiPercent className="mx-auto text-5xl text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No discount codes yet</h3>
            <p className="text-text-secondary mb-6">Create your first discount code to start offering promotions</p>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <FiPlus />
              Create First Code
            </button>
          </div>
        ) : (
          codes.map((code) => (
            <div
              key={code.id}
              className={`bg-background-secondary rounded-lg border transition ${
                code.active && !isExpired(code.expiresAt)
                  ? 'border-green-500/30'
                  : 'border-gray-800'
              }`}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <code className="text-2xl font-bold text-white bg-gray-800 px-3 py-1 rounded">
                        {code.code}
                      </code>
                      <button
                        onClick={() => copyToClipboard(code.code)}
                        className="text-gray-400 hover:text-white transition"
                      >
                        {copiedCode === code.code ? (
                          <FiCheck className="text-green-500" />
                        ) : (
                          <FiCopy size={18} />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-accent">{code.percentage}%</span>
                      <span className="text-text-secondary">OFF</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleActive(code)}
                    className={`p-2 rounded-lg transition ${
                      code.active
                        ? 'text-green-500 hover:bg-green-500/10'
                        : 'text-gray-500 hover:bg-gray-800'
                    }`}
                  >
                    {code.active ? <FiToggleRight size={28} /> : <FiToggleLeft size={28} />}
                  </button>
                </div>

                {/* Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <FiCalendar className="text-gray-400" />
                    <span className={`${isExpired(code.expiresAt) ? 'text-red-500' : 'text-text-secondary'}`}>
                      {isExpired(code.expiresAt) ? 'Expired: ' : 'Expires: '}
                      {formatDate(code.expiresAt)}
                    </span>
                  </div>
                  
                  {code.maxUses && (
                    <div className="text-sm text-text-secondary">
                      Usage: {code.currentUses} / {code.maxUses}
                      <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                        <div
                          className="bg-accent h-2 rounded-full transition-all"
                          style={{
                            width: `${Math.min((code.currentUses / code.maxUses) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {!code.maxUses && (
                    <div className="text-sm text-text-secondary">
                      Used: {code.currentUses} times
                    </div>
                  )}
                </div>

                {/* Status Badge */}
                <div className="mb-4">
                  {isExpired(code.expiresAt) ? (
                    <span className="inline-block bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-xs font-semibold">
                      Expired
                    </span>
                  ) : code.active ? (
                    <span className="inline-block bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-xs font-semibold">
                      Active
                    </span>
                  ) : (
                    <span className="inline-block bg-gray-500/10 text-gray-500 px-3 py-1 rounded-full text-xs font-semibold">
                      Inactive
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(code)}
                    className="flex-1 btn-secondary text-sm py-2"
                  >
                    <FiEdit2 className="inline mr-1" size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(code.id)}
                    className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background-secondary rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingCode ? 'Edit Discount Code' : 'Create Discount Code'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Code */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Discount Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    required
                    className="flex-1 bg-background text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="e.g., SUMMER2024"
                  />
                  <button
                    type="button"
                    onClick={generateRandomCode}
                    className="btn-secondary whitespace-nowrap"
                  >
                    Generate
                  </button>
                </div>
              </div>

              {/* Percentage */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Discount Percentage (1-100)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.percentage}
                    onChange={(e) => setFormData({ ...formData, percentage: parseInt(e.target.value) || 0 })}
                    required
                    className="flex-1 bg-background text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <span className="text-white font-bold">%</span>
                </div>
              </div>

              {/* Expiration Date */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Expiration Date (Optional)
                </label>
                <input
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-background text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              {/* Max Uses */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Maximum Uses (Optional)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.maxUses}
                  onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                  className="w-full bg-background text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Unlimited if not set"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between">
                <label className="text-white font-semibold">Active</label>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, active: !formData.active })}
                  className={`p-2 rounded-lg transition ${
                    formData.active
                      ? 'text-green-500 hover:bg-green-500/10'
                      : 'text-gray-500 hover:bg-gray-800'
                  }`}
                >
                  {formData.active ? <FiToggleRight size={32} /> : <FiToggleLeft size={32} />}
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  {editingCode ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
