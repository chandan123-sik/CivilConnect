import React, { useState, useEffect } from 'react';
import { getAllLeads } from '../../../api/adminApi';

const RequestMonitor = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [viewingRequest, setViewingRequest] = useState(null);
    const [isLive, setIsLive] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const data = await getAllLeads();
            setRequests(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Fetch requests error:", err);
            setRequests([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    // Helper: safe field getters from enriched backend response
    const getClientName = (req) => req.clientName || req.userId?.fullName || 'Unknown Client';
    const getClientCity = (req) => req.clientCity || req.userId?.city || req.location || 'N/A';
    const getProviderName = (req) => req.providerName || req.providerId?.fullName || 'Unassigned';
    const getServiceType = (req) => {
        const s = req.serviceType || '';
        return (s && s.toLowerCase() !== 'provider') ? s : (req.providerCategory || req.projectType || 'General Service');
    };
    const getBudget = (req) => {
        if (!req.budget || req.budget === 'Negotiable') return 'Open';
        return isNaN(req.budget) ? req.budget : `₹${req.budget}`;
    };

    // Filter Logic
    const filteredRequests = requests.filter(req => {
        const matchesSearch =
            getClientName(req).toLowerCase().includes(searchTerm.toLowerCase()) ||
            getServiceType(req).toLowerCase().includes(searchTerm.toLowerCase()) ||
            (req._id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            getProviderName(req).toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' ||
            (statusFilter === 'Pending' && req.status === 'pending') ||
            (statusFilter === 'Accepted' && req.status === 'accepted') ||
            (statusFilter === 'Completed' && req.status === 'completed');
        return matchesSearch && matchesStatus;
    });

    // Pagination
    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

    const getStatusBadgeStyle = (status) => {
        switch (status) {
            case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'accepted': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'rejected': return 'bg-red-50 text-red-600 border-red-100';
            case 'completed': return 'bg-blue-50 text-blue-600 border-blue-100';
            default: return 'bg-slate-50 text-slate-500 border-slate-100';
        }
    };

    const handleExport = () => {
        alert("Generating Weekly Request Report...");
    };

    return (
        <div className="max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">
            {/* ── Page Header ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-slate-900 text-3xl font-[1000] tracking-tighter mb-1">Request Monitor</h1>
                    <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest">Real-time Service Tracking & Oversight</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={handleExport} className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-slate-600 font-bold text-[12px] shadow-sm hover:shadow-md transition-all active:scale-95">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Weekly Report
                    </button>
                    <button onClick={() => setIsLive(!isLive)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[12px] shadow-lg transition-all active:scale-95 ${isLive ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-500/30' : 'bg-slate-200 text-slate-500 shadow-none'}`}>
                        Live Feed {isLive ? 'ON' : 'OFF'}
                    </button>
                </div>
            </div>

            {/* ── Quick Analytics ── */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                {[
                    { label: 'System Lead Vol.', value: requests.length, icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', color: 'text-emerald-500', bg: 'bg-emerald-50' },
                    { label: 'Pending Leads', value: requests.filter(r => r.status === 'pending').length, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-amber-500', bg: 'bg-amber-50' },
                    { label: 'Accepted Leads', value: requests.filter(r => r.status === 'accepted').length, icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', color: 'text-indigo-500', bg: 'bg-indigo-50' },
                    { label: 'Completed Leads', value: requests.filter(r => r.status === 'completed').length, icon: 'M5 13l4 4L19 7', color: 'text-blue-500', bg: 'bg-blue-50' },
                    { label: 'Rejected Leads', value: requests.filter(r => r.status === 'rejected').length, icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-red-500', bg: 'bg-red-50' }
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-emerald-200 transition-all">
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

            {/* ── Request Inventory ── */}
            <div className="bg-white border border-slate-100 shadow-sm rounded-[32px] overflow-hidden">
                {/* Filter Bar */}
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative w-full md:w-96">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Find by ID, Client or Provider..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-[13px] font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                        />
                    </div>
                    <div className="flex bg-slate-200/60 p-1.5 rounded-2xl gap-1">
                        {['All', 'Pending', 'Accepted', 'Completed'].map(status => (
                            <button
                                key={status}
                                onClick={() => { setStatusFilter(status); setCurrentPage(1); }}
                                className={`px-4 py-2 rounded-xl text-[12px] font-bold transition-all ${statusFilter === status ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-slate-50">
                                <th className="py-5 px-8 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Request Trace</th>
                                <th className="py-5 px-6 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Client Info</th>
                                <th className="py-5 px-6 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Service Pro</th>
                                <th className="py-5 px-6 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Budget</th>
                                <th className="py-5 px-6 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Status</th>
                                <th className="py-5 px-8 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 text-right">Oversight</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr><td colSpan="6" className="py-20 text-center text-slate-400 font-bold text-[12px] uppercase tracking-widest">Loading leads...</td></tr>
                            ) : paginatedRequests.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-20 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="text-4xl mb-3">📭</div>
                                            <p className="text-slate-500 font-bold">No requests found</p>
                                            <p className="text-slate-400 text-sm mt-1">Try adjusting your filters</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : paginatedRequests.map((req) => (
                                <tr key={req._id} className="hover:bg-slate-50/80 transition-all group">
                                    {/* Request ID + Date */}
                                    <td className="py-5 px-8">
                                        <div className="flex flex-col">
                                            <span className="text-emerald-600 font-extrabold text-xs mb-1 truncate w-28 block" title={req._id}>{req._id}</span>
                                            <span className="text-slate-400 text-[10px] font-bold">{new Date(req.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                        </div>
                                    </td>
                                    {/* Client Info — uses enriched clientName from backend */}
                                    <td className="py-5 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 font-black text-xs border border-indigo-100 uppercase shrink-0">
                                                {getClientName(req)[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-800 leading-none mb-1">{getClientName(req)}</p>
                                                <p className="text-[11px] font-bold text-slate-400">{getClientCity(req)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    {/* Service Provider — uses populated providerName */}
                                    <td className="py-5 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-black text-xs border border-emerald-100 uppercase shrink-0">
                                                {getProviderName(req)[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-800 leading-none mb-1">{getProviderName(req)}</p>
                                                <p className="text-[11px] font-bold text-slate-400">{getServiceType(req)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    {/* Budget */}
                                    <td className="py-5 px-6 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="text-slate-800 font-black text-sm">{getBudget(req)}</span>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{req.projectType || 'Residential'}</span>
                                        </div>
                                    </td>
                                    {/* Status */}
                                    <td className="py-5 px-6">
                                        <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border w-fit ${getStatusBadgeStyle(req.status)}`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    {/* Action */}
                                    <td className="py-5 px-8 text-right">
                                        <button
                                            onClick={() => setViewingRequest(req)}
                                            className="px-4 py-2 bg-slate-100 hover:bg-emerald-500 hover:text-white rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-500 transition-all shadow-sm active:scale-95"
                                        >
                                            Analyze
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="p-6 border-t border-slate-100 bg-white flex items-center justify-between">
                    <p className="text-[12px] font-medium text-slate-500">
                        Monitoring <span className="font-bold text-slate-900">{paginatedRequests.length}</span> of <span className="font-bold text-slate-900">{filteredRequests.length}</span> traces
                    </p>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}
                            className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-emerald-600 transition-all disabled:opacity-30">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        {[...Array(Math.max(totalPages, 1))].map((_, i) => (
                            <button key={i + 1} onClick={() => setCurrentPage(i + 1)}
                                className={`w-10 h-10 rounded-xl text-[13px] font-[1000] transition-all ${currentPage === i + 1 ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}>
                                {i + 1}
                            </button>
                        ))}
                        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0}
                            className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-emerald-600 transition-all disabled:opacity-30">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Oversight / Analyze Modal ── */}
            {viewingRequest && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setViewingRequest(null)} />

                    <div className="relative bg-white rounded-[40px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200">
                        {/* Status top band */}
                        <div className={`h-2 bg-gradient-to-r ${
                            viewingRequest.status === 'completed' ? 'from-blue-400 to-blue-600'
                            : viewingRequest.status === 'accepted' ? 'from-emerald-400 to-emerald-600'
                            : viewingRequest.status === 'rejected' ? 'from-red-400 to-red-600'
                            : 'from-amber-400 to-amber-600'
                        }`} />

                        {/* Fixed Header */}
                        <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-white">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="px-3 py-1 bg-slate-50 text-slate-400 rounded-lg text-[10px] font-black tracking-widest truncate max-w-[150px]" title={viewingRequest._id}>
                                        ID: {viewingRequest._id}
                                    </span>
                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase border ${getStatusBadgeStyle(viewingRequest.status)}`}>
                                        {viewingRequest.status}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-[1000] text-slate-900 tracking-tighter capitalize transition-all">
                                    {getServiceType(viewingRequest)}
                                </h2>
                                <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest mt-1 opacity-70">{viewingRequest.projectType || 'Residential'} Project</p>
                            </div>
                            <button onClick={() => setViewingRequest(null)} className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all active:scale-95">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Scrollable Body */}
                        <div className="max-h-[65vh] overflow-y-auto p-10 bg-slate-50/20 custom-scrollbar">
                            {/* Participant Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 mt-2">
                                {/* Client */}
                                <div className="p-6 bg-indigo-50/40 rounded-3xl border border-indigo-100/50 shadow-sm transition-all hover:bg-indigo-50 hover:shadow-md">
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4 opacity-80">Client (Origin)</p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-indigo-500 font-black text-xl border border-indigo-100 uppercase">
                                            {getClientName(viewingRequest)[0]}
                                        </div>
                                        <div>
                                            <p className="text-base font-black text-slate-800 leading-none mb-1.5">{getClientName(viewingRequest)}</p>
                                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">{getClientCity(viewingRequest)}</p>
                                            {viewingRequest.clientPhone && viewingRequest.clientPhone !== 'N/A' && (
                                                <p className="text-[11px] font-black text-slate-400 mt-2 flex items-center gap-1.5 bg-white w-fit px-2 py-1 rounded-lg shadow-xs border border-slate-100">
                                                    <span className="text-emerald-500">📞</span> {viewingRequest.clientPhone}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {/* Provider */}
                                <div className="p-6 bg-emerald-50/40 rounded-3xl border border-emerald-100/50 shadow-sm transition-all hover:bg-emerald-50 hover:shadow-md">
                                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4 opacity-80">Service Provider</p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-600 font-black text-xl border border-emerald-100 uppercase">
                                            {getProviderName(viewingRequest)[0]}
                                        </div>
                                        <div>
                                            <p className="text-base font-black text-slate-800 leading-none mb-1.5">{getProviderName(viewingRequest)}</p>
                                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">{getServiceType(viewingRequest)}</p>
                                            <p className={`text-[10px] font-black mt-2 w-fit px-2 py-1 rounded-lg shadow-xs border ${viewingRequest.status === 'accepted' ? 'text-emerald-600 bg-white border-emerald-100' : viewingRequest.status === 'rejected' ? 'text-red-500 bg-white border-red-100' : 'text-slate-400 bg-white border-slate-100'}`}>
                                                {viewingRequest.status === 'accepted' ? '✅ Linked' : viewingRequest.status === 'rejected' ? '❌ Denied' : '⏳ Waiting'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Request Details */}
                            <div className="bg-white rounded-3xl border border-slate-100 p-8 mb-8 shadow-sm">
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Lead Details
                                </p>
                                {viewingRequest.description && (
                                    <div className="relative mb-6">
                                        <p className="text-sm font-medium text-slate-600 bg-slate-50 p-4 rounded-2xl italic leading-relaxed border-l-4 border-emerald-500">
                                            "{viewingRequest.description}"
                                        </p>
                                    </div>
                                )}
                                <div className="grid grid-cols-2 gap-6 pt-2">
                                    <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Project Budget</p>
                                        <p className="text-xl font-black text-slate-800">{getBudget(viewingRequest)}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Created Date</p>
                                        <p className="text-sm font-bold text-slate-700">
                                            {new Date(viewingRequest.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Engagement Timeline */}
                            <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Engagement Timeline
                                </p>
                                <div className="space-y-6 relative ml-3">
                                    <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-slate-100 border-l border-dashed border-slate-300" />
                                    
                                    <div className="relative pl-10">
                                        <div className="absolute left-[-6px] top-1.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-white shadow-sm" />
                                        <div className="flex flex-col gap-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(viewingRequest.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                            <p className="text-[13px] font-bold text-slate-800">Request generated by <span className="text-indigo-600 font-extrabold">{getClientName(viewingRequest)}</span></p>
                                        </div>
                                    </div>

                                    {(viewingRequest.status === 'accepted' || viewingRequest.status === 'rejected') && (
                                        <div className="relative pl-10">
                                            <div className={`absolute left-[-6px] top-1.5 w-3.5 h-3.5 rounded-full ring-4 ring-white shadow-sm ${viewingRequest.status === 'accepted' ? 'bg-emerald-500' : 'bg-red-400'}`} />
                                            <div className="flex flex-col gap-1">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Response</p>
                                                <p className="text-[13px] font-bold text-slate-800">
                                                    Lead <span className={viewingRequest.status === 'accepted' ? 'text-emerald-500 font-black' : 'text-red-500 font-black'}>{viewingRequest.status}</span> by <span className="text-emerald-600 font-extrabold">{getProviderName(viewingRequest)}</span>
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {viewingRequest.status === 'completed' && (
                                        <div className="relative pl-10">
                                            <div className="absolute left-[-6px] top-1.5 w-3.5 h-3.5 rounded-full bg-blue-500 ring-4 ring-white shadow-[0_0_15px_rgba(59,130,246,0.4)]" />
                                            <div className="flex flex-col gap-1">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Job Closure</p>
                                                <p className="text-[13px] font-extrabold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100 w-fit">Service completed. Audit trail finalized.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Fixed Footer */}
                        <div className="px-10 py-8 bg-white border-t border-slate-50">
                            <button onClick={() => setViewingRequest(null)} className="w-full py-5 bg-gradient-to-r from-slate-800 to-slate-900 text-white hover:from-emerald-600 hover:to-emerald-700 rounded-[24px] font-black text-[12px] uppercase tracking-[0.25em] shadow-2xl shadow-slate-500/20 hover:shadow-emerald-500/30 transition-all active:scale-95 flex items-center justify-center gap-3 group">
                                <span className="opacity-70 group-hover:opacity-100">Dismiss Intelligence Trace</span>
                                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RequestMonitor;
