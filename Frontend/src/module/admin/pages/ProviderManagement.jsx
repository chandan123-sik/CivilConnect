import React, { useState, useEffect } from 'react';
import { getAllProviders, updateProviderStatus, deleteProvider } from '../../../api/adminApi';
import { showToast } from '../../../components/Toast';

// Dummy data removed for real API integration

const ProviderManagement = () => {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('');

    const fetchProviders = async () => {
        setLoading(true);
        try {
            const data = await getAllProviders();
            setProviders(data);
        } catch (err) {
            console.error("Fetch providers error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProviders();
    }, []);

    // UI States
    const [isAddProviderModalOpen, setIsAddProviderModalOpen] = useState(false);
    const [viewingProvider, setViewingProvider] = useState(null);
    const [newProviderForm, setNewProviderForm] = useState({
        name: '',
        category: '',
        email: '',
        phone: '',
        status: 'Pending',
        subscription: 'Basic'
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Custom UI Patterns
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, name: '' });

    // Filter Logic
    const filteredProviders = providers
        .filter(provider => {
            const matchesSearch = (provider.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (provider.phone || '').includes(searchTerm);
            const matchesStatus = statusFilter === 'All' || 
                                 (statusFilter === 'Active' && provider.isActive) ||
                                 (statusFilter === 'Suspended' && !provider.isActive) ||
                                 (statusFilter === 'Pending' && provider.approvalStatus === 'pending');
            const matchesCategory = (provider.category || '').toLowerCase().includes(categoryFilter.toLowerCase());
            return matchesSearch && matchesStatus && matchesCategory;
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination Logic
    const totalPages = Math.ceil(filteredProviders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedProviders = filteredProviders.slice(startIndex, startIndex + itemsPerPage);

    const getStatusStyle = (provider) => {
        if (!provider) return 'bg-slate-100 text-slate-600 border-slate-200';
        if (provider.approvalStatus === 'pending') return 'bg-amber-100 text-amber-700 border-amber-200';
        if (!provider.isActive) return 'bg-red-100 text-red-700 border-red-200';
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    };

    const getSubscriptionStyle = (plan) => {
        switch (plan) {
            case 'Premium': return 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white border-transparent';
            case 'Pro': return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-transparent';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    const handleToggleStatus = async (providerId, currentStatus) => {
        try {
            await updateProviderStatus(providerId, !currentStatus);
            showToast(`Provider ${currentStatus ? 'Suspended' : 'Activated'} Successfully`, 'success');
            fetchProviders();
        } catch (err) {
            showToast("Status update failed", "error");
        }
    };

    const handleDeleteProvider = (item) => {
        setDeleteConfirm({ show: true, id: item._id, name: item.fullName });
    };

    const confirmDelete = async () => {
        if (!deleteConfirm.id) return;
        try {
            await deleteProvider(deleteConfirm.id);
            showToast("Provider deleted permanently", 'success');
            setDeleteConfirm({ show: false, id: null, name: '' });
            fetchProviders();
        } catch (err) {
            showToast("Failed to delete provider", 'error');
        }
    };

    const handleExportCSV = () => {
        const headers = ["ID", "Name", "Category", "Phone", "Email", "Join Date", "Status", "Subscription", "Rating", "Completed Jobs"];
        const rows = filteredProviders.map(p => [
            p.id, `"${p.name}"`, `"${p.category}"`, `"${p.phone}"`, `"${p.email}"`,
            `"${p.joinDate}"`, p.status, p.subscription, p.rating, p.completedJobs
        ]);

        const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `CivilConnect_Providers_Export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleAddProviderSubmit = (e) => {
        e.preventDefault();
        const newId = `PRV-${Math.floor(Math.random() * 9000) + 1000}`;
        const initials = newProviderForm.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

        const newProvider = {
            id: newId,
            ...newProviderForm,
            joinDate: 'Just now',
            rating: 0,
            completedJobs: 0,
            avatar: initials || 'P',
            panCard: 'PENDING',
            aadhar: 'PENDING'
        };

        setProviders([newProvider, ...providers]);
        setIsAddProviderModalOpen(false);
        setNewProviderForm({ name: '', category: '', email: '', phone: '', status: 'Pending', subscription: 'Basic' });
    };

    return (
        <div className="max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">
            {/* ── Page Header ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-slate-900 text-3xl font-[1000] tracking-tighter mb-1">Service Providers</h1>
                    <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest">Manage Professionals & Businesses</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={handleExportCSV} className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-slate-600 font-bold text-[12px] shadow-sm hover:shadow-md hover:text-slate-900 transition-all active:scale-95">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Export CSV
                    </button>
                    <button onClick={() => setIsAddProviderModalOpen(true)} className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-700 text-white px-5 py-2.5 rounded-xl font-bold text-[12px] shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all active:scale-95">
                        <svg className="w-4 h-4 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                        Add Provider
                    </button>
                </div>
            </div>

            {/* ── Metric Cards ── */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Total Providers', value: providers.length, icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: 'text-emerald-500', bg: 'bg-emerald-50' },
                    { label: 'Pending Approvals', value: providers.filter(p => p.approvalStatus === 'pending').length, icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', color: 'text-green-500', bg: 'bg-green-50' },
                    { label: 'Active Subs', value: providers.filter(p => p.subscriptionId).length, icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z', color: 'text-teal-500', bg: 'bg-teal-50' },
                    { label: 'Avg Rating', value: '4.6', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z', color: 'text-amber-500', bg: 'bg-amber-50' }
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

            {/* ── Main Data View ── */}
            <div className="bg-white border border-slate-100 shadow-sm rounded-3xl overflow-hidden flex flex-col">
                {/* Toolbar */}
                <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Search */}
                    <div className="relative w-full lg:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search providers, business name..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                        />
                    </div>

                    {/* Filters Wrapper */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        {/* Category Input */}
                        <div className="flex items-center gap-3">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest hidden sm:block">Category:</span>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="e.g. Architect..."
                                    value={categoryFilter}
                                    onChange={(e) => {
                                        setCategoryFilter(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-[12px] font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Status Pills */}
                        <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto w-full sm:w-auto">
                            {['All', 'Active', 'Pending', 'Suspended'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => {
                                        setStatusFilter(status);
                                        setCurrentPage(1);
                                    }}
                                    className={`px-4 py-1.5 rounded-lg text-[12px] font-bold whitespace-nowrap transition-all ${statusFilter === status ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'} `}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-slate-100">
                                <th className="py-4 px-6 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 whitespace-nowrap">Provider Info</th>
                                <th className="py-4 px-6 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 whitespace-nowrap">Category & Plan</th>
                                <th className="py-4 px-6 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 whitespace-nowrap">Status</th>
                                <th className="py-4 px-6 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 whitespace-nowrap">Performance</th>
                                <th className="py-4 px-6 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 text-right whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {paginatedProviders.length > 0 ? (
                                paginatedProviders.map((provider) => (
                                        <tr key={provider._id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center text-slate-500 font-black text-sm shrink-0 shadow-sm">
                                                    {provider.profileImage ? (
                                                        <img src={provider.profileImage} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        (provider.fullName || 'P').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-[14px] font-extrabold text-slate-900 mb-[2px]">{provider.fullName}</p>
                                                    <p className="text-[12px] font-medium text-slate-500">{provider.phone}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col items-start gap-1.5">
                                                <span className="text-[13px] font-bold text-slate-700">{provider.category}</span>
                                                <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-md border ${getSubscriptionStyle(provider.subscriptionId ? 'Premium' : 'Basic')}`}>
                                                    {provider.subscriptionId ? 'Premium' : 'Basic'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(provider)}`}>
                                                {provider.approvalStatus === 'pending' ? 'Pending' : provider.isActive ? 'Active' : 'Suspended'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1 text-amber-500">
                                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                                    <span className="text-[12px] font-bold text-slate-700">{provider.avgRating || 'New'}</span>
                                                </div>
                                                <p className="text-[11px] font-bold text-slate-400">{provider.jobsDone || 0} Jobs Done</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => setViewingProvider(provider)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="View Details">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                </button>
                                                <button onClick={() => handleToggleStatus(provider._id, provider.isActive)} className={`p-2 rounded-lg transition-colors ${provider.isActive ? 'text-slate-400 hover:text-amber-500 hover:bg-amber-50' : 'text-slate-400 hover:text-green-500 hover:bg-green-50'}`} title={provider.isActive ? "Suspend" : "Activate"}>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                                </button>
                                                <button onClick={() => handleDeleteProvider(provider)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Provider">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="5" className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No providers found matching your filters.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="p-6 border-t border-slate-100 bg-white flex items-center justify-between">
                    <p className="text-[12px] font-medium text-slate-500">
                        Showing <span className="font-bold text-slate-900">{paginatedProviders.length}</span> of <span className="font-bold text-slate-900">{filteredProviders.length}</span> providers
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-emerald-600 transition-all disabled:opacity-30 disabled:hover:text-slate-400"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-10 h-10 rounded-xl text-[13px] font-[1000] transition-all ${currentPage === i + 1 ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'} `}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-emerald-600 transition-all disabled:opacity-30 disabled:hover:text-slate-400"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* ── View Profile Modal ── */}
            {viewingProvider && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setViewingProvider(null)}></div>
                    <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Header Band — color based on real status */}
                        <div className={`h-24 ${
                            viewingProvider.approvalStatus === 'pending'
                                ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                                : viewingProvider.isActive
                                    ? 'bg-gradient-to-r from-emerald-600 to-teal-700'
                                    : 'bg-gradient-to-r from-slate-400 to-slate-600'
                        }`}></div>

                        <div className="px-6 pb-6 relative">
                            <div className="flex justify-between items-end -mt-10 mb-4">
                                {/* Avatar — initials from fullName */}
                                <div className="w-20 h-20 rounded-2xl bg-white p-1.5 shadow-lg">
                                    {viewingProvider.profileImage ? (
                                        <img src={viewingProvider.profileImage} className="w-full h-full rounded-xl object-cover" alt="Provider" />
                                    ) : (
                                        <div className="w-full h-full rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-black text-xl border border-slate-200">
                                            {(viewingProvider.fullName || 'P').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(viewingProvider)}`}>
                                    {viewingProvider.approvalStatus === 'pending' ? 'Pending' : viewingProvider.isActive ? 'Active' : 'Suspended'}
                                </span>
                            </div>

                            <div className="mb-4">
                                <h3 className="text-xl font-black text-slate-800">{viewingProvider.fullName}</h3>
                                <p className="text-[12px] font-bold text-slate-400 mt-0.5">{viewingProvider.city || 'Location N/A'}</p>
                            </div>

                            <div className="space-y-3">
                                {/* Category & Experience */}
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Category / Trade</p>
                                        <p className="text-[14px] font-bold text-slate-700">{viewingProvider.category || 'N/A'}</p>
                                        {viewingProvider.subCategory && (
                                            <p className="text-[11px] text-slate-400 mt-0.5">{viewingProvider.subCategory}</p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Experience</p>
                                        <p className="text-[16px] font-black text-emerald-600">{viewingProvider.experience || 0}+ yrs</p>
                                    </div>
                                </div>

                                {/* Subscription Plan */}
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Subscription Plan</p>
                                    <p className="text-[13px] font-bold text-slate-700">
                                        {viewingProvider.subscriptionId ? '✅ Active Plan' : '❌ No Active Plan'}
                                    </p>
                                </div>

                                {/* About */}
                                {viewingProvider.about && (
                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">About</p>
                                        <p className="text-[12px] text-slate-600 leading-relaxed">{viewingProvider.about}</p>
                                    </div>
                                )}

                                {/* Contact */}
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Contact</p>
                                    <p className="text-[13px] font-semibold text-slate-700">{viewingProvider.phone || 'N/A'}</p>
                                </div>

                                {/* Approval Status */}
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Approval Status</p>
                                    <p className="text-[13px] font-bold text-slate-700 capitalize">{viewingProvider.approvalStatus || 'N/A'}</p>
                                </div>
                            </div>

                            <button onClick={() => setViewingProvider(null)} className="w-full mt-6 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-[13px] transition-colors">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Add Provider Modal ── */}
            {isAddProviderModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsAddProviderModalOpen(false)}></div>
                    <div className="relative bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-black text-slate-800 tracking-tight">Onboard Service Provider</h2>
                                <p className="text-[12px] text-slate-400 font-medium mt-1">Add a new business profile to the marketplace.</p>
                            </div>
                            <button onClick={() => setIsAddProviderModalOpen(false)} className="w-8 h-8 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 transition-colors flex items-center justify-center">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleAddProviderSubmit} className="p-6 bg-slate-50/50 flex flex-col gap-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Full Name / Firm Name</label>
                                    <input required type="text" value={newProviderForm.name} onChange={(e) => setNewProviderForm({ ...newProviderForm, name: e.target.value })} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="e.g. John Smith or Acme Build" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Category</label>
                                    <input required type="text" value={newProviderForm.category} onChange={(e) => setNewProviderForm({ ...newProviderForm, category: e.target.value })} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="e.g. Plumber, Architect" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Phone Number</label>
                                    <input required type="tel" value={newProviderForm.phone} onChange={(e) => setNewProviderForm({ ...newProviderForm, phone: e.target.value })} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="+91 XXXXX XXXXX" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Business Email</label>
                                    <input required type="email" value={newProviderForm.email} onChange={(e) => setNewProviderForm({ ...newProviderForm, email: e.target.value })} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="contact@example.com" />
                                </div>
                            </div>
                            <div className="pt-2 flex justify-end gap-3 mt-2">
                                <button type="button" onClick={() => setIsAddProviderModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-[13px] text-slate-500 hover:bg-slate-200/50">Cancel</button>
                                <button type="submit" className="px-6 py-2.5 rounded-xl font-bold text-[13px] text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20">Onboard Provider</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Custom Delete Confirmation Modal */}
            {deleteConfirm.show && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-[40px] w-full max-w-sm p-8 shadow-2xl border border-slate-100 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
                        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
                            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight mb-2">Delete Provider?</h2>
                        <p className="text-[13px] text-slate-500 font-medium leading-relaxed mb-8 italic text-center px-4">
                            Are you sure you want to permanently remove <span className="text-red-600 font-black not-italic">"{deleteConfirm.name}"</span>? This action is irreversible.
                        </p>
                        <div className="flex w-full gap-3">
                            <button onClick={() => setDeleteConfirm({ show: false, id: null, name: '' })} className="flex-1 py-4 bg-slate-100 text-slate-400 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">No, Cancel</button>
                            <button onClick={confirmDelete} className="flex-1 py-4 bg-red-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-red-700 shadow-lg shadow-red-500/20 active:scale-95 transition-all">Yes, Remove</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProviderManagement;
