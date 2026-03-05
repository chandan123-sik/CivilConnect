import React, { useState } from 'react';

const initialCategories = [
    { id: 'cat-001', label: 'Contractor', icon: '🏗️', color: 'bg-emerald-50', text: 'text-emerald-600', activeProviders: 45, status: 'Active' },
    { id: 'cat-002', label: 'Engineer', icon: '⚙️', color: 'bg-blue-50', text: 'text-blue-600', activeProviders: 28, status: 'Active' },
    { id: 'cat-003', label: 'Architect', icon: '📐', color: 'bg-indigo-50', text: 'text-indigo-600', activeProviders: 15, status: 'Active' },
    { id: 'cat-004', label: 'Plumber', icon: '🔧', color: 'bg-cyan-50', text: 'text-cyan-600', activeProviders: 32, status: 'Pending Review' },
    { id: 'cat-005', label: 'Electrician', icon: '⚡', color: 'bg-amber-50', text: 'text-amber-600', activeProviders: 24, status: 'Active' },
    { id: 'cat-006', label: 'Labour', icon: '👷', color: 'bg-orange-50', text: 'text-orange-600', activeProviders: 120, status: 'Active' },
    { id: 'cat-007', label: 'Vehicle Provider', icon: '🚛', color: 'bg-slate-50', text: 'text-slate-600', activeProviders: 18, status: 'Inactive' },
];

const CategoryManagement = () => {
    const [categories, setCategories] = useState(initialCategories);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ label: '', icon: '📂', status: 'Active' });

    // Filter Logic
    const filteredCategories = categories.filter(cat =>
        cat.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenAdd = () => {
        setEditingCategory(null);
        setFormData({ label: '', icon: '📂', status: 'Active' });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (category) => {
        setEditingCategory(category);
        setFormData({ label: category.label, icon: category.icon, status: category.status });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingCategory) {
            setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, ...formData } : c));
        } else {
            const newCat = {
                id: `cat-${Math.floor(Math.random() * 900) + 100}`,
                ...formData,
                activeProviders: 0,
                color: 'bg-emerald-50',
                text: 'text-emerald-600'
            };
            setCategories([newCat, ...categories]);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to remove this category?')) {
            setCategories(categories.filter(c => c.id !== id));
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
                        key={cat.id}
                        style={{ animationDelay: `${idx * 50}ms` }}
                        className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group animate-in slide-in-from-bottom-5 fade-in fill-mode-both"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={`w-14 h-14 rounded-2xl ${cat.color} flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform duration-500 bg-opacity-50`}>
                                {cat.icon}
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleOpenEdit(cat)}
                                    className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                </button>
                                <button
                                    onClick={() => handleDelete(cat.id)}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        </div>

                        <h3 className="text-slate-900 font-extrabold text-lg mb-1 tracking-tight">{cat.label}</h3>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
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
                    <div className="relative bg-white rounded-[40px] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-black text-slate-800 tracking-tight">{editingCategory ? 'Edit Category' : 'New Category'}</h2>
                                <p className="text-[12px] text-slate-400 font-medium mt-1">Configure service category details and appearance.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-6">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Display Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.label}
                                        onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                        className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-[14px] font-bold text-slate-800 placeholder:text-slate-300 focus:border-emerald-500 focus:bg-white outline-none transition-all"
                                        placeholder="e.g. Interior Designer"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Representative Icon</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                maxLength={2}
                                                value={formData.icon}
                                                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                                className="w-20 px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-xl text-center focus:border-emerald-500 focus:bg-white outline-none transition-all"
                                            />
                                            <div className="flex-1 flex items-center gap-2 overflow-x-auto py-1 scrollbar-hide">
                                                {['🏗️', '⚙️', '📐', '🔧', '⚡', '👷', '🚛'].map(emoji => (
                                                    <button
                                                        key={emoji}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, icon: emoji })}
                                                        className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-lg active:scale-95 transition-all ${formData.icon === emoji ? 'bg-emerald-100 ring-2 ring-emerald-500' : 'bg-slate-50 hover:bg-slate-100'}`}
                                                    >
                                                        {emoji}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Platform Status</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-[14px] font-bold text-slate-800 focus:border-emerald-500 focus:bg-white outline-none transition-all cursor-pointer appearance-none"
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                            <option value="Pending Review">Pending Review</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl font-black text-[13px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/40 active:scale-95 transition-all mt-4"
                            >
                                {editingCategory ? 'Update Category' : 'Create Category Listing'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryManagement;
