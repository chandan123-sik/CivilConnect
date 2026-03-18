import React, { useState, useEffect } from 'react';
import { createMaterial, updateMaterial, deleteMaterial, getAllOrders, updateOrderStatus } from '../../../api/adminApi';
import { getMaterials } from '../../../api/publicApi';

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

// Default brands helper for new materials
const DEFAULT_BRANDS = [
    { id: 'b1', name: 'UltraTech Cement', price: 420, quality: 'Premium' },
    { id: 'b2', name: 'ACC Gold', price: 455, quality: 'High Strength' }
];

const MaterialsCatalog = () => {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [viewMode, setViewMode] = useState('catalog'); // 'catalog' or 'requests'
    const [materialRequests, setMaterialRequests] = useState([]);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [processingOrderId, setProcessingOrderId] = useState(null);
    const [deliveryTimeInput, setDeliveryTimeInput] = useState('');

    const loadMaterials = async () => {
        setLoading(true);
        try {
            const res = await getMaterials();
            setMaterials(res);
        } catch (err) {
            console.error("Failed to fetch materials:", err);
        } finally {
            setLoading(false);
        }
    };

    const loadOrders = async () => {
        try {
            const res = await getAllOrders();
            setMaterialRequests(res);
        } catch (err) {
            console.error("Failed to fetch orders:", err);
        }
    };

    const handleUpdateOrderStatus = async (orderId, status, deliveryTime = null) => {
        try {
            await updateOrderStatus(orderId, { status, deliveryTime });
            loadOrders();
            // Clear inputs
            setProcessingOrderId(null);
            setDeliveryTimeInput('');
        } catch (err) {
            alert("Failed to update order status");
        }
    };

    // UI States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Basic',
        price: '',
        unit: '',
        image: '',
        status: 'Active',
        brands: []
    });

    const [newBrand, setNewBrand] = useState({ name: '', price: '', quality: '' });

    const handleAddBrand = () => {
        if (!newBrand.name || !newBrand.price) return;
        setFormData({
            ...formData,
            brands: [...formData.brands, { ...newBrand, id: `br-${Date.now()}` }]
        });
        setNewBrand({ name: '', price: '', quality: '' });
    };

    const handleRemoveBrand = (id) => {
        setFormData({
            ...formData,
            brands: formData.brands.filter(b => b.id !== id)
        });
    };

    const filteredMaterials = materials.filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCat = categoryFilter === 'All' || m.category === categoryFilter;
        return matchesSearch && matchesCat;
    });

    const handleForceSync = () => {
        loadMaterials();
        loadOrders();
    };

    useEffect(() => {
        loadMaterials();
        loadOrders();
    }, []);

    const handleOpenModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({ ...item, brands: item.brands || [] });
        } else {
            setEditingItem(null);
            setFormData({ name: '', category: 'Basic', price: '', unit: '', image: '', status: 'Active', brands: [] });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'brands') {
                    data.append(key, JSON.stringify(formData[key]));
                } else if (formData[key] instanceof File) {
                    data.append(key, formData[key]);
                } else if (formData[key] !== null && formData[key] !== undefined) {
                    data.append(key, formData[key]);
                }
            });

            if (editingItem) {
                await updateMaterial(editingItem._id, data);
            } else {
                await createMaterial(data);
            }
            loadMaterials();
            setIsModalOpen(false);
        } catch (err) {
            alert(err || "Failed to save material");
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this material from catalog?')) {
            try {
                await deleteMaterial(id);
                loadMaterials();
            } catch (err) {
                alert("Delete failed");
            }
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-slate-900 text-4xl font-[1000] tracking-tighter mb-1">Materials Catalog</h1>
                    <p className="text-slate-500 text-sm font-medium italic">Manage global materials, brands and incoming orders.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleForceSync}
                        className="px-4 py-2.5 bg-white border border-slate-200 text-slate-400 hover:text-emerald-600 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        Refresh
                    </button>
                    <button onClick={() => setViewMode(viewMode === 'catalog' ? 'requests' : 'catalog')} className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg ${viewMode === 'requests' ? 'bg-indigo-600 text-white shadow-indigo-500/20' : 'bg-white border border-slate-200 text-slate-400'}`}>
                        {viewMode === 'catalog' ? `Requests (${materialRequests.filter(r => r.status === 'pending').length})` : 'Back to Catalog'}
                    </button>
                    <button onClick={handleExport} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-400 hover:border-emerald-500 hover:text-emerald-600 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all">CSV</button>
                    <button onClick={() => handleOpenModal()} className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 active:scale-95">Add Material</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                    { label: 'Total Items', value: materials.length, icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', color: 'text-emerald-500', bg: 'bg-emerald-50' },
                    { label: 'Active Items', value: materials.filter(m => m.status === 'Active').length, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-green-500', bg: 'bg-green-50' },
                    { label: 'Categories', value: new Set(materials.map(m => m.category)).size, icon: 'M4 6h16M4 10h16M4 14h16M4 18h16', color: 'text-emerald-600', bg: 'bg-emerald-50' }
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
                    {viewMode === 'catalog' ? (
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
                                    <tr key={item._id || item.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="text-[14px] font-extrabold text-slate-900 mb-[2px]">{item.name}</p>
                                                    <p className="text-[11px] font-bold text-slate-400 font-mono tracking-tighter">{item._id}</p>
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
                                                <button onClick={() => handleDelete(item._id || item.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50">
                            {materialRequests.length === 0 ? (
                                <div className="col-span-full py-20 text-center text-slate-400 font-bold">No material booking requests yet.</div>
                            ) : (
                                materialRequests.map((req) => (
                                    <div key={req._id} className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm relative group overflow-hidden">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-sm font-black uppercase">
                                                    {req.userName[0]}
                                                </div>
                                                <div>
                                                    <h3 className="text-[14px] font-black text-slate-900 leading-tight">{req.userName}</h3>
                                                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                                                        {req.userPhone || 'No Phone'} • <span className="text-emerald-500">{req.userAddress || 'Address N/A'}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${req.status === 'pending' ? 'bg-amber-100 text-amber-600 border-amber-200' : req.status === 'accepted' ? 'bg-emerald-100 text-emerald-600 border-emerald-200' : 'bg-red-100 text-red-600 border-red-200'}`}>
                                                {req.status}
                                            </span>
                                        </div>

                                        <div className="p-4 bg-slate-50 rounded-2xl mb-6">
                                            <div className="flex justify-between items-center mb-2">
                                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Requested Items</p>
                                                <p className="text-[13px] font-black text-indigo-600">₹{req.totalPrice}</p>
                                            </div>
                                            <h4 className="text-[15px] font-black text-slate-800">{req.brand}</h4>
                                            <p className="text-[11px] font-bold text-slate-500">{req.materialName} — {req.quantity} {req.unit}</p>
                                        </div>

                                        {req.status === 'pending' && (
                                            <div className="flex gap-3">
                                                {processingOrderId === req._id ? (
                                                    <div className="w-full flex gap-2 animate-in slide-in-from-bottom-2">
                                                        <input
                                                            type="text"
                                                            placeholder="Del. Time (e.g. 2 days)"
                                                            value={deliveryTimeInput}
                                                            onChange={(e) => setDeliveryTimeInput(e.target.value)}
                                                            className="flex-1 px-4 py-2.5 bg-white border-2 border-emerald-500 rounded-xl text-[12px] font-bold outline-none ring-4 ring-emerald-500/10"
                                                        />
                                                        <button
                                                            onClick={() => handleUpdateOrderStatus(req._id, 'accepted', deliveryTimeInput)}
                                                            className="px-6 bg-emerald-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
                                                        >
                                                            Send
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <button onClick={() => handleUpdateOrderStatus(req._id, 'rejected')} className="flex-1 py-2.5 bg-white border border-red-100 text-red-500 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-red-50 transition-all active:scale-95">Reject</button>
                                                        <button onClick={() => setProcessingOrderId(req._id)} className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-emerald-600/20 active:scale-95 transition-all">Accept Order</button>
                                                    </>
                                                )}
                                            </div>
                                        )}

                                        {req.status === 'accepted' && (
                                            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                                <p className="text-[11px] font-black uppercase tracking-widest">Confirmed: Delivery in {req.deliveryTime}</p>
                                            </div>
                                        )}

                                        {req.status === 'rejected' && (
                                            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                                                <p className="text-[11px] font-black uppercase tracking-widest">Order Rejected</p>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="relative bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
                        {/* Fixed Header */}
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
                            <div>
                                <h2 className="text-xl font-black text-slate-800 tracking-tight">{editingItem ? 'Edit Material' : 'Add New Material'}</h2>
                                <p className="text-[12px] text-slate-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis">Configure reference market rates.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 transition-colors flex items-center justify-center">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Scrollable Body */}
                        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-6 bg-slate-50/50">
                            <form id="materialForm" onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Material Name</label>
                                        <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 bg-white border-2 border-slate-100 rounded-xl text-[13px] font-bold text-slate-700 outline-none focus:border-emerald-500 transition-all" placeholder="e.g. UltraTech Cement" />
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
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Material Image</label>
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden flex-shrink-0">
                                                {formData.image ? (
                                                    <img src={typeof formData.image === 'string' ? formData.image : URL.createObjectURL(formData.image)} className="w-full h-full object-cover" alt="Preview" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="relative flex-1">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                />
                                                <div className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-[13px] font-bold text-slate-500 flex items-center justify-between">
                                                    <span>{formData.image?.name || 'Choose Image...'}</span>
                                                    <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Brand Management Section */}
                                    <div className="col-span-2 pt-2">
                                        <div className="flex items-center justify-between mb-3">
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Brand Lineup</label>
                                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{formData.brands.length} Brands Added</span>
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            {formData.brands.map(brand => (
                                                <div key={brand.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-xs font-black text-slate-400">B</div>
                                                        <div>
                                                            <p className="text-[12px] font-black text-slate-800">{brand.name}</p>
                                                            <p className="text-[10px] font-bold text-slate-400">{brand.quality}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <p className="text-[12px] font-black text-emerald-600">₹{brand.price}</p>
                                                        <button type="button" onClick={() => handleRemoveBrand(brand.id)} className="p-1.5 text-slate-300 hover:text-red-500 transition-colors">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="p-4 bg-white border-2 border-dashed border-slate-200 rounded-2xl">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Add Custom Brand</p>
                                            <div className="grid grid-cols-2 gap-3 mb-3">
                                                <input type="text" placeholder="Brand Name" value={newBrand.name} onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs" />
                                                <input type="text" placeholder="Price (₹)" value={newBrand.price} onChange={(e) => setNewBrand({ ...newBrand, price: e.target.value })} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs" />
                                                <input type="text" placeholder="Tag (e.g. Premium)" value={newBrand.quality} onChange={(e) => setNewBrand({ ...newBrand, quality: e.target.value })} className="col-span-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs" />
                                            </div>
                                            <button type="button" onClick={handleAddBrand} className="w-full py-2 bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-all">Add to List</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-white">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-3 rounded-xl font-black text-[11px] text-slate-400 uppercase tracking-widest hover:bg-slate-100">Cancel</button>
                            <button type="submit" form="materialForm" className="px-8 py-3 rounded-xl font-black text-[11px] text-white bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-500/20 uppercase tracking-widest active:scale-95 transition-all">
                                {editingItem ? 'Save Changes' : 'Create Entry'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MaterialsCatalog;
