import React, { useState } from 'react';

const initialRequests = [
    {
        id: 'REQ-4521',
        user: { name: 'Amit Patel', phone: '+91 98765 43210', avatar: 'AP' },
        provider: { name: 'Mr. Rajesh Kumar', role: 'Civil Contractor', avatar: 'RK' },
        category: 'Contractor',
        service: 'Wall Painting & Ceiling',
        price: '₹12,400',
        date: '02 Mar, 2026 14:30',
        status: 'Pending',
        urgency: 'Medium'
    },
    {
        id: 'REQ-4522',
        user: { name: 'Sneha Rao', phone: '+91 87654 32109', avatar: 'SR' },
        provider: { name: 'Anjali Mehta', role: 'Civil Engineer', avatar: 'AM' },
        category: 'Engineer',
        service: 'Structural Stability Audit',
        price: '₹5,500',
        date: '02 Mar, 2026 11:15',
        status: 'Accepted',
        urgency: 'High'
    },
    {
        id: 'REQ-4523',
        user: { name: 'Vikram Singh', phone: '+91 76543 21098', avatar: 'VS' },
        provider: { name: 'Amit Sharma', role: 'Plumber', avatar: 'AS' },
        category: 'Plumber',
        service: 'Full Bathroom Fitting',
        price: '₹18,000',
        date: '01 Mar, 2026 16:45',
        status: 'Rejected',
        urgency: 'Low'
    },
    {
        id: 'REQ-4524',
        user: { name: 'Priya Verma', phone: '+91 65432 10987', avatar: 'PV' },
        provider: { name: 'Suresh Patil', role: 'Interior Contractor', avatar: 'SP' },
        category: 'Contractor',
        service: 'Modular Kitchen Setup',
        price: '₹85,000',
        date: '01 Mar, 2026 09:20',
        status: 'Completed',
        urgency: 'High'
    },
    {
        id: 'REQ-4525',
        user: { name: 'Rahul Desai', phone: '+91 99887 76655', avatar: 'RD' },
        provider: { name: 'Raju Waghmare', role: 'Electrician', avatar: 'RW' },
        category: 'Electrician',
        service: 'Commercial Wiring Fix',
        price: '₹2,500',
        date: '28 Feb, 2026 18:30',
        status: 'Accepted',
        urgency: 'Medium'
    },
];

const RequestMonitor = () => {
    const [requests, setRequests] = useState(initialRequests);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [viewingRequest, setViewingRequest] = useState(null);
    const [isLive, setIsLive] = useState(true);

    // Filter Logic
    const filteredRequests = requests.filter(req => {
        const matchesSearch =
            req.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'Accepted': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Rejected': return 'bg-red-50 text-red-600 border-red-100';
            case 'Completed': return 'bg-blue-50 text-blue-600 border-blue-100';
            default: return 'bg-slate-50 text-slate-500 border-slate-100';
        }
    };

    const getUrgencyColor = (urgency) => {
        switch (urgency) {
            case 'High': return 'text-red-500';
            case 'Medium': return 'text-amber-500';
            case 'Low': return 'text-emerald-500';
            default: return 'text-slate-400';
        }
    };

    const handleUpdateStatus = (id, newStatus) => {
        setRequests(requests.map(r => r.id === id ? { ...r, status: newStatus } : r));
        setViewingRequest(null);
    };

    const handleExport = () => {
        alert("Generating Weekly Request Report... The CSV file will be ready in a moment.");
    };

    const handleContactLog = () => {
        alert("Opening Secure Chat History Log for this engagement...");
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
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-slate-600 font-bold text-[12px] shadow-sm hover:shadow-md transition-all active:scale-95"
                    >
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Weekly Report
                    </button>
                    <button
                        onClick={() => setIsLive(!isLive)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[12px] shadow-lg transition-all active:scale-95 ${isLive ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-500/30' : 'bg-slate-200 text-slate-500 shadow-none'}`}
                    >
                        Live Feed {isLive ? 'ON' : 'OFF'}
                    </button>
                </div>
            </div>

            {/* ── Quick Analytics ── */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'System Lead Vol.', value: requests.length, icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', color: 'text-emerald-500', bg: 'bg-emerald-50' },
                    { label: 'Unchecked Leads', value: requests.filter(r => r.status === 'Pending').length, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-amber-500', bg: 'bg-amber-50' },
                    { label: 'Conversion Rate', value: '72%', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', color: 'text-blue-500', bg: 'bg-blue-50' },
                    { label: 'Active Escrow', value: '₹2.4L', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-indigo-500', bg: 'bg-indigo-50' }
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
                {/* Custom Filters Bar */}
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative w-full md:w-96">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Find by ID, Client or Expert..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-[13px] font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                        />
                    </div>

                    <div className="flex bg-slate-200/60 p-1.5 rounded-2xl gap-1">
                        {['All', 'Pending', 'Accepted', 'Completed'].map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 rounded-xl text-[12px] font-bold transition-all ${statusFilter === status ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'} `}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Modern List View */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-slate-50">
                                <th className="py-5 px-8 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Request Trace</th>
                                <th className="py-5 px-6 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Client Info</th>
                                <th className="py-5 px-6 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Service Pro</th>
                                <th className="py-5 px-6 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Escrow Value</th>
                                <th className="py-5 px-6 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Trace Status</th>
                                <th className="py-5 px-8 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 text-right">Oversight</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredRequests.map((req, idx) => (
                                <tr key={req.id} className="hover:bg-slate-50/80 transition-all group">
                                    <td className="py-5 px-8">
                                        <div className="flex flex-col">
                                            <span className="text-emerald-600 font-extrabold text-sm mb-1">{req.id}</span>
                                            <span className="text-slate-400 text-[10px] font-bold">{req.date}</span>
                                        </div>
                                    </td>
                                    <td className="py-5 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 font-black text-xs border border-indigo-100">
                                                {req.user.avatar}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-800 leading-none mb-1">{req.user.name}</p>
                                                <p className="text-[11px] font-bold text-slate-400">{req.user.phone}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-black text-xs border border-emerald-100">
                                                {req.provider.avatar}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-800 leading-none mb-1">{req.provider.name}</p>
                                                <p className="text-[11px] font-bold text-slate-400">{req.provider.role}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5 px-6 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="text-slate-800 font-black text-sm">{req.price}</span>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Budget Locked</span>
                                        </div>
                                    </td>
                                    <td className="py-5 px-6">
                                        <div className="flex flex-col gap-1.5">
                                            <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border w-fit ${getStatusStyle(req.status)}`}>
                                                {req.status}
                                            </span>
                                            <div className="flex items-center gap-1.5 ml-1">
                                                <div className={`w-1.5 h-1.5 rounded-full ${req.urgency === 'High' ? 'bg-red-500' : req.urgency === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                                                <span className={`text-[9px] font-bold uppercase tracking-widest ${getUrgencyColor(req.urgency)}`}>{req.urgency} Priority</span>
                                            </div>
                                        </div>
                                    </td>
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
            </div>

            {/* ── Oversight Modal ── */}
            {viewingRequest && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setViewingRequest(null)} />

                    <div className="relative bg-white rounded-[40px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Status Banner */}
                        <div className={`h-3 bg-gradient-to-r ${viewingRequest.status === 'Completed' ? 'from-emerald-400 to-emerald-600' : viewingRequest.status === 'Rejected' ? 'from-red-400 to-red-600' : 'from-amber-400 to-amber-600'}`} />

                        <div className="p-10">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black tracking-widest uppercase">ID: {viewingRequest.id}</span>
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase border ${getStatusStyle(viewingRequest.status)}`}>{viewingRequest.status}</span>
                                    </div>
                                    <h2 className="text-3xl font-[1000] text-slate-900 tracking-tighter capitalize">{viewingRequest.service}</h2>
                                    <p className="text-slate-400 font-bold text-sm mt-1">{viewingRequest.category} Service Stream</p>
                                </div>
                                <button onClick={() => setViewingRequest(null)} className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            {/* Participant Cards */}
                            <div className="grid grid-cols-2 gap-6 mb-10">
                                <div className="p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100/50">
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Origin Participant (Client)</p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-indigo-500 font-black text-xl border border-indigo-100">
                                            {viewingRequest.user.avatar}
                                        </div>
                                        <div>
                                            <p className="text-lg font-black text-slate-800 leading-none mb-1">{viewingRequest.user.name}</p>
                                            <p className="text-xs font-bold text-slate-500">{viewingRequest.user.phone}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100/50">
                                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4">Target Participant (Expert)</p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-600 font-black text-xl border border-emerald-100">
                                            {viewingRequest.provider.avatar}
                                        </div>
                                        <div>
                                            <p className="text-lg font-black text-slate-800 leading-none mb-1">{viewingRequest.provider.name}</p>
                                            <p className="text-xs font-bold text-slate-500">{viewingRequest.provider.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline Trace */}
                            <div className="mb-10">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-1">Engagement Timeline</p>
                                <div className="space-y-6 relative ml-4">
                                    <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-slate-100 border-l border-dashed border-slate-300" />

                                    <div className="relative pl-8">
                                        <div className="absolute left-[-5px] top-1.5 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-white" />
                                        <p className="text-[11px] font-black text-slate-400 leading-none uppercase tracking-widest mb-1">Dec 02 • 14:15</p>
                                        <p className="text-sm font-bold text-slate-800">Request broadcasted by {viewingRequest.user.name.split(' ')[0]}</p>
                                    </div>

                                    {viewingRequest.status !== 'Pending' && (
                                        <div className="relative pl-8">
                                            <div className="absolute left-[-5px] top-1.5 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-white" />
                                            <p className="text-[11px] font-black text-slate-400 leading-none uppercase tracking-widest mb-1">Dec 02 • 15:45</p>
                                            <p className="text-sm font-bold text-slate-800">Lead acknowledged by {viewingRequest.provider.name.split(' ')[0]}</p>
                                        </div>
                                    )}

                                    {viewingRequest.status === 'Completed' && (
                                        <div className="relative pl-8">
                                            <div className="absolute left-[-5px] top-1.5 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-white shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
                                            <p className="text-[11px] font-black text-slate-400 leading-none uppercase tracking-widest mb-1">Dec 04 • 11:20</p>
                                            <p className="text-sm font-extrabold text-blue-600">Verification complete. Payout released from escrow.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Admin Controls */}
                            <div className="flex gap-4 pt-6 mt-6 border-t border-slate-100">
                                <button
                                    onClick={handleContactLog}
                                    className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all"
                                >
                                    Contact Log
                                </button>
                                {viewingRequest.status === 'Pending' && (
                                    <button
                                        onClick={() => handleUpdateStatus(viewingRequest.id, 'Rejected')}
                                        className="flex-1 py-4 bg-red-50 text-red-500 hover:bg-red-100 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all"
                                    >
                                        Force Cancel
                                    </button>
                                )}
                                <button
                                    onClick={() => setViewingRequest(null)}
                                    className="flex-[2] py-4 bg-emerald-600 text-white hover:bg-emerald-700 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/30 transition-all active:scale-95"
                                >
                                    Dismiss Trace
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RequestMonitor;
