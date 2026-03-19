import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit3, Trash2, X, ChevronRight, Layers, Layout, Grid, MoreVertical } from 'lucide-react';
import { getCategories } from '../../../api/publicApi';
import { createCategory, updateCategory, deleteCategory } from '../../../api/adminApi';
import { showToast } from '../../../components/Toast';


const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ label: '', icon: null, status: 'Active', subCategories: [] });
    const [subCategoryInput, setSubCategoryInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [expandedCategoryId, setExpandedCategoryId] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        setLoading(true);
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (err) {
            console.error("Failed to load categories:", err);
        } finally {
            setLoading(false);
        }
    };

    // Deep Search Filter Logic (Main Category + Sub-categories)
    const filteredCategories = categories.filter(cat => {
        const query = searchTerm.toLowerCase();
        const matchesMain = cat.label.toLowerCase().includes(query);
        const matchesSub = cat.subCategories?.some(sub =>
            sub.toLowerCase().includes(query)
        );
        return matchesMain || matchesSub;
    });

    const handleOpenAdd = () => {
        setEditingCategory(null);
        setFormData({ label: '', icon: null, status: 'Active', subCategories: [] });
        setSubCategoryInput('');
        setIsModalOpen(true);
    };

    const handleOpenEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            label: category.label,
            icon: category.icon, // This could be a string (emoji/URL)
            status: category.status,
            subCategories: category.subCategories || []
        });
        setSubCategoryInput('');
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            const data = new FormData();
            data.append('label', formData.label);
            data.append('status', formData.status);
            data.append('subCategories', JSON.stringify(formData.subCategories));
            if (formData.icon instanceof File) {
                data.append('icon', formData.icon);
            } else if (typeof formData.icon === 'string') {
                data.append('icon', formData.icon); // For emoji or existing URL
            }

            if (editingCategory) {
                await updateCategory(editingCategory._id, data);
                showToast("Category updated successfully");
            } else {
                await createCategory(data);
                showToast("Category created successfully");
            }
            loadCategories();
            setIsModalOpen(false);
        } catch (err) {
            showToast(err || "Failed to save category", "error");
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDelete = (id) => {
        setDeleteConfirm({ show: true, id });
    };

    const confirmDelete = async () => {
        if (!deleteConfirm.id) return;
        try {
            await deleteCategory(deleteConfirm.id);
            showToast("Category deleted successfully");
            setDeleteConfirm({ show: false, id: null });
            loadCategories();
        } catch (err) {
            showToast(err || "Failed to delete category", "error");
        }
    };

    return (
        <div className="max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">
            {/* ── Page Header ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-slate-900 text-3xl font-[1000] tracking-tighter mb-1">Category Options</h1>
                    <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest">Manage Service Classifications</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleOpenAdd}
                        className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-[12px] shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all active:scale-95"
                    >
                        <svg className="w-4 h-4 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                        Add New Category
                    </button>
                </div>
            </div>

            {/* ── Metric Cards ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                    { label: 'Total Categories', value: categories.length, icon: 'M4 6h16M4 10h16M4 14h16M4 18h16', color: 'text-emerald-500', bg: 'bg-emerald-50' },
                    { label: 'Active Services', value: categories.filter(c => c.status === 'Active').length, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-blue-500', bg: 'bg-blue-50' },
                    { label: 'Top Category', value: 'Labour', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', color: 'text-orange-500', bg: 'bg-orange-50' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4 group">
                        <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                            <svg className={`w-6 h-6 ${stat.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} />
                            </svg>
                        </div>
                        <div>
                            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-0.5">{stat.label}</p>
                            <p className="text-slate-800 text-2xl font-black tracking-tight">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Toolbar ── */}
            <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search category name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-[13px] font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* ── Categories Grid ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredCategories.map((cat, idx) => (
                    <div
                        key={cat._id}
                        style={{ animationDelay: `${idx * 50}ms` }}
                        onClick={() => setExpandedCategoryId(expandedCategoryId === cat._id ? null : cat._id)}
                        className={`bg-white border rounded-[32px] p-6 shadow-sm hover:shadow-xl transition-all duration-300 group animate-in slide-in-from-bottom-5 fade-in fill-mode-both cursor-pointer ${expandedCategoryId === cat._id ? 'border-emerald-500 ring-4 ring-emerald-500/5' : 'border-slate-100 hover:-translate-y-1'}`}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={`w-14 h-14 rounded-2xl ${cat.color} flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform duration-500 bg-opacity-50`}>
                                {cat.icon && typeof cat.icon === 'string' && cat.icon.startsWith('http') ? (
                                    <img src={cat.icon} className="w-full h-full object-contain" alt={cat.label} />
                                ) : (cat.icon || '📂')}
                            </div>
                            <div className="flex gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleOpenEdit(cat); }}
                                    className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(cat._id); }}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        </div>

                        <h3 className="text-slate-900 font-extrabold text-lg mb-1 tracking-tight">{cat.label}</h3>

                        {/* Sub-categories indicator */}
                        <div className="flex items-center gap-2 mt-2">
                            <div className="flex -space-x-1.5 overflow-hidden">
                                {cat.subCategories?.slice(0, 3).map((_, i) => (
                                    <div key={i} className="inline-block h-3 w-3 rounded-full ring-2 ring-white bg-slate-200" />
                                ))}
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                {(() => {
                                    const subCats = cat.subCategories || [];
                                    const flattened = subCats.flatMap(sub => {
                                        try {
                                            if (typeof sub === 'string' && sub.startsWith('[') && sub.endsWith(']')) return JSON.parse(sub);
                                            return sub;
                                        } catch (e) { return sub; }
                                    });
                                    return flattened.length;
                                })()} Specializations
                            </span>
                        </div>

                        {/* Expanded Sub-categories List */}
                        {expandedCategoryId === cat._id && (
                            <div className="mt-6 pt-6 border-t border-slate-50 flex flex-wrap gap-2 animate-in slide-in-from-top-2 duration-300">
                                {(() => {
                                    const subCats = cat.subCategories || [];
                                    const flattened = subCats.flatMap(sub => {
                                        try {
                                            if (typeof sub === 'string' && sub.startsWith('[') && sub.endsWith(']')) return JSON.parse(sub);
                                            return sub;
                                        } catch (e) { return sub; }
                                    });

                                    if (flattened.length === 0) return <p className="text-[10px] text-slate-400 italic">No specializations defined</p>;

                                    return flattened.map((sub, i) => (
                                        <span key={i} className="px-2 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-black text-slate-600 uppercase tracking-tight">
                                            {sub}
                                        </span>
                                    ));
                                })()}
                            </div>
                        )}

                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Active Providers</p>
                                <p className="text-slate-800 font-black text-sm">{cat.activeProviders}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${cat.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                {cat.status}
                            </span>
                        </div>
                    </div>
                ))}

                {/* Blank Add Card */}
                <button
                    onClick={handleOpenAdd}
                    className="border-2 border-dashed border-slate-200 rounded-[32px] p-6 flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-emerald-300 hover:text-emerald-500 hover:bg-emerald-50/30 transition-all group min-h-[220px]"
                >
                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-current flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    </div>
                    <span className="font-bold text-[13px] uppercase tracking-widest">Add New Category</span>
                </button>
            </div>

            {/* ── Category Modal ── */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white rounded-[40px] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
                        {/* Fixed Header */}
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white">
                            <div>
                                <h2 className="text-2xl font-black text-slate-800 tracking-tight">{editingCategory ? 'Edit Category' : 'New Category'}</h2>
                                <p className="text-[12px] text-slate-400 font-medium mt-1">Configure service category details and appearance.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Scrollable Body */}
                        <div className="max-h-[60vh] overflow-y-auto p-8 bg-slate-50/30">
                            <form id="categoryForm" onSubmit={handleSubmit} className="flex flex-col gap-6">
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Display Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.label}
                                            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                            className="w-full px-5 py-4 bg-white border-2 border-slate-100 rounded-2xl text-[14px] font-bold text-slate-800 placeholder:text-slate-300 focus:border-emerald-500 outline-none transition-all shadow-sm"
                                            placeholder="e.g. Interior Designer"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1 px-1">Sub-categories Specialization</label>
                                        <div className="space-y-3">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={subCategoryInput}
                                                    onChange={(e) => setSubCategoryInput(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            if (subCategoryInput.trim()) {
                                                                setFormData({ ...formData, subCategories: [...formData.subCategories, subCategoryInput.trim()] });
                                                                setSubCategoryInput('');
                                                            }
                                                        }
                                                    }}
                                                    placeholder="Add sub-category..."
                                                    className="flex-1 px-5 py-3 bg-white border border-slate-200 rounded-xl text-[13px] font-bold focus:border-emerald-500 outline-none transition-all shadow-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (subCategoryInput.trim()) {
                                                            setFormData({ ...formData, subCategories: [...formData.subCategories, subCategoryInput.trim()] });
                                                            setSubCategoryInput('');
                                                        }
                                                    }}
                                                    className="px-4 py-3 bg-slate-900 text-white rounded-xl font-bold text-[12px] active:scale-95 transition-all"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap gap-2 min-h-[40px] p-4 bg-white border border-dashed border-slate-200 rounded-2xl">
                                                {(() => {
                                                    const subCats = formData.subCategories || [];
                                                    const flattened = subCats.flatMap(sub => {
                                                        try {
                                                            if (typeof sub === 'string' && sub.startsWith('[') && sub.endsWith(']')) return JSON.parse(sub);
                                                            return sub;
                                                        } catch (e) { return sub; }
                                                    });
                                                    
                                                    if (flattened.length === 0) return <p className="text-[11px] text-slate-400 italic">No sub-categories added yet.</p>;

                                                    return flattened.map((sub, i) => (
                                                        <div key={i} className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-[12px] font-bold text-slate-700 shadow-sm transition-all hover:border-red-200 hover:text-red-500 group">
                                                            {sub}
                                                            <button
                                                                type="button"
                                                                onClick={() => setFormData({ ...formData, subCategories: flattened.filter((_, idx) => idx !== i) })}
                                                                className="text-slate-300 group-hover:text-red-400 transition-colors"
                                                            >
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                                                            </button>
                                                        </div>
                                                    ));
                                                })()}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">Category Icon (Upload Photo or Pick Emoji)</label>
                                            <div className="flex flex-col gap-4">
                                                <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                                    <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-3xl overflow-hidden shadow-inner">
                                                        {formData.icon ? (
                                                            typeof formData.icon === 'string' ? (formData.icon.startsWith('http') ? <img src={formData.icon} className="w-full h-full object-contain" /> : formData.icon) : <img src={URL.createObjectURL(formData.icon)} className="w-full h-full object-contain" />
                                                        ) : <Grid size={24} className="text-slate-200" />}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="relative">
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => setFormData({ ...formData, icon: e.target.files[0] })}
                                                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                            />
                                                            <div className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 font-bold text-[11px] uppercase tracking-wider flex items-center justify-between shadow-sm">
                                                                <span>{formData.icon instanceof File ? formData.icon.name : 'Upload Icon'}</span>
                                                                <Layout size={14} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 overflow-x-auto scrollbar-hide shadow-sm mt-1">
                                                    {['🏗️', '⚙️', '📐', '🔧', '⚡', '👷', '🚛', '🩹', '🎨', '🏠', '🚜'].map(emoji => (
                                                        <button
                                                            key={emoji}
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, icon: emoji })}
                                                            className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center text-xl bg-white border-2 transition-all active:scale-95 shadow-sm ${formData.icon === emoji ? 'border-emerald-500 bg-emerald-50' : 'border-slate-50 hover:border-emerald-200'}`}
                                                        >
                                                            {emoji}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Platform Status</label>
                                            <select
                                                value={formData.status}
                                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                                className="w-full px-5 py-4 bg-white border-2 border-slate-100 rounded-2xl text-[14px] font-bold text-slate-800 focus:border-emerald-500 outline-none transition-all cursor-pointer appearance-none shadow-sm"
                                            >
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                                <option value="Pending Review">Pending Review</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Fixed Footer */}
                        <div className="p-8 border-t border-slate-100 flex justify-end bg-white">
                            <button
                                type="submit"
                                form="categoryForm"
                                className="w-full py-5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-[20px] font-black text-[13px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/40 active:scale-95 transition-all"
                            >
                                {editingCategory ? 'Update Category' : 'Create Category Listing'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Delete Confirmation Modal */}
            {deleteConfirm.show && (
                <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-[40px] w-full max-w-sm p-8 shadow-2xl border border-slate-100 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
                        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
                            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight mb-2">Delete Category?</h2>
                        <p className="text-[13px] text-slate-500 font-medium leading-relaxed mb-8 italic text-center px-4">
                            Are you sure you want to remove this service category? This action is permanent.
                        </p>
                        <div className="flex w-full gap-3">
                            <button onClick={() => setDeleteConfirm({ show: false, id: null })} className="flex-1 py-4 bg-slate-100 text-slate-400 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">No, Cancel</button>
                            <button onClick={confirmDelete} className="flex-1 py-4 bg-red-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-red-700 shadow-lg shadow-red-500/20 active:scale-95 transition-all">Yes, Remove</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryManagement;
