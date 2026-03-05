import React, { useState } from 'react';

// Initial mock data based on mockData.js structure
const initialMaterials = [
    { id: 'MAT-101', name: 'Cement (OPC 53 Grade)', category: 'Basic', price: '420', unit: 'per bag (50kg)', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&q=80', status: 'Active' },
    { id: 'MAT-102', name: 'TMT Steel Rods (12mm)', category: 'Steel', price: '58', unit: 'per kg', image: 'https://images.unsplash.com/photo-1533000758416-64197e447b93?w=400&q=80', status: 'Active' },
    { id: 'MAT-103', name: 'Premium Red Bricks', category: 'Masonry', price: '9', unit: 'per piece', image: 'https://images.unsplash.com/photo-1590069230005-db3937392662?w=400&q=80', status: 'Active' },
    { id: 'MAT-104', name: 'Coarse River Sand', category: 'Basic', price: '55', unit: 'per cft', image: 'https://images.unsplash.com/photo-1544911835-33054664fe6a?w=400&q=80', status: 'Active' },
    { id: 'MAT-105', name: 'AAC Blocks', category: 'Masonry', price: '45', unit: 'per block', image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=400&q=80', status: 'Pending' },
    { id: 'MAT-106', name: 'Anti-skid Tiles', category: 'Flooring', price: '42', unit: 'per sqft', image: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=400&q=80', status: 'Active' },
];

const categories = ['All', 'Basic', 'Steel', 'Masonry', 'Flooring', 'Plumbing', 'Electrical', 'Finishing', 'Wood'];

const MaterialsCatalog = () => {
    const [materials, setMaterials] = useState(initialMaterials);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');

    // UI States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Basic',
        price: '',
        unit: '',
        image: '',
        status: 'Active'
    });

    const filteredMaterials = materials.filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCat = categoryFilter === 'All' || m.category === categoryFilter;
        return matchesSearch && matchesCat;
    });

    const handleOpenModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({ ...item });
        } else {
            setEditingItem(null);
            setFormData({ name: '', category: 'Basic', price: '', unit: '', image: '', status: 'Active' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingItem) {
            setMaterials(materials.map(m => m.id === editingItem.id ? { ...formData } : m));
        } else {
            const newItem = {
                ...formData,
                id: `MAT-${Math.floor(Math.random() * 900) + 100}`
            };
            setMaterials([newItem, ...materials]);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to remove this material from catalog?')) {
            setMaterials(materials.filter(m => m.id !== id));
        }
    };

    const handleExport = () => {
        const headers = ["ID", "Name", "Category", "Price", "Unit", "Status"];
        const rows = filteredMaterials.map(m => [m.id, `"${m.name}"`, m.category, m.price, m.unit, m.status]);
        const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", "Material_Catalog.csv");
        link.click();
    };

    return (
        <div className="max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-slate-900 text-3xl font-[1000] tracking-tighter mb-1">Materials Catalog</h1>
                    <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest">Manage Reference Prices for Users</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={handleExport} className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-slate-600 font-bold text-[12px] shadow-sm hover:shadow-md hover:text-slate-900 transition-all active:scale-95">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Export CSV
                    </button>
                    <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-700 text-white px-5 py-2.5 rounded-xl font-bold text-[12px] shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all active:scale-95">
                        <svg className="w-4 h-4 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                        Add Material
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Total Items', value: materials.length, icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', color: 'text-emerald-500', bg: 'bg-emerald-50' },
                    { label: 'Active Items', value: materials.filter(m => m.status === 'Active').length, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-green-500', bg: 'bg-green-50' },
                    { label: 'Price Updates', value: '12', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', color: 'text-teal-500', bg: 'bg-teal-50' },
                    { label: 'Categories', value: categories.length - 1, icon: 'M4 6h16M4 10h16M4 14h16M4 18h16', color: 'text-emerald-600', bg: 'bg-emerald-50' }
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                            <svg className={`w-6 h-6 ${stat.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} /></svg>
                        </div>
                        <div>
                            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-0.5">{stat.label}</p>
                            <p className="text-slate-800 text-2xl font-black tracking-tight">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Toolbar & Table */}
            <div className="bg-white border border-slate-100 shadow-sm rounded-3xl overflow-hidden flex flex-col">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Search */}
                    <div className="relative w-full lg:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search materials by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                        />
                    </div>

                    {/* Filter */}
                    <div className="flex items-center gap-3">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Category:</span>
                        <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto">
                            {['All', 'Basic', 'Steel', 'Masonry'].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setCategoryFilter(cat)}
                                    className={`px-4 py-1.5 rounded-lg text-[12px] font-bold whitespace-nowrap transition-all ${categoryFilter === cat ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'} `}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-slate-100">
                                <th className="py-4 px-6 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 whitespace-nowrap">Material</th>
                                <th className="py-4 px-6 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 whitespace-nowrap">Category</th>
                                <th className="py-4 px-6 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 whitespace-nowrap">Price & Unit</th>
                                <th className="py-4 px-6 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 whitespace-nowrap">Status</th>
                                <th className="py-4 px-6 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 text-right whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredMaterials.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="text-[14px] font-extrabold text-slate-900 mb-[2px]">{item.name}</p>
                                                <p className="text-[11px] font-bold text-slate-400 font-mono tracking-tighter">{item.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-[13px] font-bold text-slate-700">{item.category}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex flex-col">
                                            <span className="text-[14px] font-black text-emerald-600">₹{item.price}</span>
                                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">{item.unit}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider border ${item.status === 'Active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleOpenModal(item)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="Edit">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                            </button>
                                            <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredMaterials.length === 0 && (
                        <div className="py-20 text-center text-slate-400 font-bold">No materials found.</div>
                    )}
                </div>
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-black text-slate-800 tracking-tight">{editingItem ? 'Edit Material' : 'Add New Material'}</h2>
                                <p className="text-[12px] text-slate-400 font-medium">Configure reference market rates.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 transition-colors flex items-center justify-center">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 bg-slate-50/50 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Material Name</label>
                                    <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="e.g. UltraTech Cement" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Category</label>
                                    <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-[13px] font-bold text-slate-700">
                                        {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Status</label>
                                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-[13px] font-bold text-slate-700">
                                        <option value="Active">Active</option>
                                        <option value="Pending">Pending</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Price (₹)</label>
                                    <input required type="text" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-[13px] font-medium" placeholder="450" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Unit</label>
                                    <input required type="text" value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-[13px] font-medium" placeholder="per bag" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Image URL</label>
                                    <input type="text" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-[13px] font-medium" placeholder="https://..." />
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-[13px] text-slate-500 hover:bg-slate-100">Cancel</button>
                                <button type="submit" className="px-6 py-2.5 rounded-xl font-bold text-[13px] text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20">
                                    {editingItem ? 'Save Changes' : 'Create Entry'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MaterialsCatalog;
