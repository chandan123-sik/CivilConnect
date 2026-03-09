import React, { useState } from 'react';

const initialRequests = [
    {
        id: 'APP-1001',
        providerName: 'Rajesh Kumar',
        category: 'Civil Engineering',
        plan: 'Annual Elite',
        date: '2026-03-05',
        status: 'Pending',
        documents: ['Aadhar Card', 'Degree Certificate', 'Business License'],
        experience: '8 Years',
        location: 'Mumbai, Maharashtra',
        mobile: '+91 98765 43210'
    },
    {
        id: 'APP-1002',
        providerName: 'Amit Sharma',
        category: 'Home Painting',
        plan: 'Standard Monthly',
        date: '2026-03-06',
        status: 'On-Hold',
        documents: ['PAN Card', 'Work Portfolio'],
        experience: '5 Years',
        location: 'Delhi, NCR',
        mobile: '+91 87654 32109'
    },
    {
        id: 'APP-1003',
        providerName: 'Anjali Mehta',
        category: 'Interior Design',
        plan: 'Quarterly Pro',
        date: '2026-03-04',
        status: 'Pending',
        documents: ['Aadhar Card', 'GST Certificate', 'Portfolio PDF'],
        experience: '12 Years',
        location: 'Bangalore, Karnataka',
        mobile: '+91 76543 21098'
    },
    {
        id: 'APP-1004',
        providerName: 'Vikram Singh',
        category: 'Electrical Works',
        plan: 'Standard Monthly',
        date: '2026-03-06',
        status: 'Pending',
        documents: ['ITI Certificate', 'Aadhar Card'],
        experience: '4 Years',
        location: 'Jaipur, Rajasthan',
        mobile: '+91 65432 10987'
    }
];

const ApprovalManagement = () => {
    const [requests, setRequests] = useState(initialRequests);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const handleAction = (id, newStatus) => {
        setRequests(requests.map(req => req.id === id ? { ...req, status: newStatus } : req));
        setSelectedRequest(null);
    };

    const filteredRequests = requests.filter(req => {
        const matchesStatus = filterStatus === 'All' || req.status === filterStatus;
        const matchesSearch = req.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            req.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
            case 'On-Hold': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-blue-100 text-blue-700 border-blue-200';
        }
    };

    return (
        <div className="max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">
            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-slate-900 text-3xl font-[1000] tracking-tighter">Approval Gateway</h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">Verify and onboard experts to the platform.</p>
                </div>

                <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm gap-1">
                    {['All', 'Pending', 'On-Hold', 'Approved'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${filterStatus === status ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'} `}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Search & Metrics ── */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                <div className="lg:col-span-3 relative">
                    <input
                        type="text"
                        placeholder="Search by expert name or category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-[22px] text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
                    />
                    <svg className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <div className="bg-emerald-600 rounded-[22px] p-4 flex items-center justify-between shadow-lg shadow-emerald-600/20">
                    <div className="text-white">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Total Pending</p>
                        <p className="text-2xl font-[1000] leading-none mt-1">{requests.filter(r => r.status === 'Pending').length}</p>
                    </div>
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                </div>
            </div>

            {/* ── Request Inventory ── */}
            <div className="bg-white border border-slate-100 rounded-[40px] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left order-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Expert Identity</th>
                                <th className="py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Service & Experience</th>
                                <th className="py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Selected Plan</th>
                                <th className="py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Application Date</th>
                                <th className="py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Security Status</th>
                                <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredRequests.map((req) => (
                                <tr key={req.id} className="hover:bg-slate-50/50 transition-all group">
                                    <td className="py-6 px-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-500 text-[11px] border border-slate-200 uppercase">
                                                {req.providerName.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="text-slate-900 font-extrabold text-[15px] tracking-tight">{req.providerName}</p>
                                                <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest">{req.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6 px-6">
                                        <div className="flex flex-col">
                                            <span className="text-slate-800 font-bold text-sm mb-1">{req.category}</span>
                                            <span className="text-emerald-600 text-[10px] font-black uppercase tracking-widest">{req.experience} Experience</span>
                                        </div>
                                    </td>
                                    <td className="py-6 px-6 text-sm font-black text-slate-500 uppercase tracking-widest">
                                        {req.plan}
                                    </td>
                                    <td className="py-6 px-6">
                                        <p className="text-slate-500 text-xs font-bold whitespace-nowrap">{new Date(req.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                    </td>
                                    <td className="py-6 px-6 text-center">
                                        <span className={`inline-flex px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] border ${getStatusColor(req.status)}`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="py-6 px-8 text-right">
                                        <button
                                            onClick={() => setSelectedRequest(req)}
                                            className="px-5 py-2.5 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                                        >
                                            Review Case
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Review Modal ── */}
            {selectedRequest && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedRequest(null)} />
                    <div className="relative bg-white rounded-[40px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Modal Header */}
                        <div className="p-7 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
                            <div>
                                <h2 className="text-xl font-[1000] text-slate-900 tracking-tighter leading-none">Case Audit: {selectedRequest.providerName}</h2>
                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1.5">Verification workflow for internal onboarding</p>
                            </div>
                            <button onClick={() => setSelectedRequest(null)} className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="p-7 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div>
                                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-3">Professional Bio</p>
                                    <div className="space-y-3.5">
                                        <div>
                                            <p className="text-[10px] text-slate-500 font-bold mb-0.5">Field of Expertise</p>
                                            <p className="text-[13px] font-black text-slate-900">{selectedRequest.category}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-500 font-bold mb-0.5">Operating Location</p>
                                            <p className="text-[13px] font-black text-slate-900">{selectedRequest.location}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-500 font-bold mb-0.5">Experience Level</p>
                                            <p className="text-[13px] font-black text-emerald-600">{selectedRequest.experience}</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-3">Onboarding Choice</p>
                                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="text-[10px] text-slate-500 font-bold mb-0.5 uppercase tracking-widest">Subscription Tier</p>
                                        <p className="text-lg font-[1000] text-slate-900 mb-1.5">{selectedRequest.plan}</p>
                                        <div className="flex items-center gap-2 text-emerald-600 font-bold text-[9px] uppercase">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                            Payment Authorized
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Verification Documents Section */}
                            <div className="mb-8">
                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-4">Identity & Legal Documents</p>
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Aadhar Display */}
                                    <div className="group cursor-default">
                                        <div className="aspect-[16/10] bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center group-hover:border-emerald-500 transition-all overflow-hidden relative">
                                            {localStorage.getItem('provider_aadhar_image') ? (
                                                <img
                                                    src={localStorage.getItem('provider_aadhar_image')}
                                                    alt="Aadhar"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-[8px] font-black text-slate-400 uppercase">Aadhar Missing</span>
                                            )}
                                            <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[7px] font-black px-1.5 py-0.5 rounded shadow">AADHAR</div>
                                        </div>
                                    </div>

                                    {/* Police Verification Display */}
                                    <div className="group cursor-default">
                                        <div className="aspect-[16/10] bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center group-hover:border-blue-500 transition-all overflow-hidden relative">
                                            {localStorage.getItem('provider_police_verify_image') ? (
                                                <img
                                                    src={localStorage.getItem('provider_police_verify_image')}
                                                    alt="Police Verify"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-[8px] font-black text-slate-400 uppercase">Police Cert Missing</span>
                                            )}
                                            <div className="absolute top-2 left-2 bg-blue-600 text-white text-[7px] font-black px-1.5 py-0.5 rounded shadow">POLICE VERIFY</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Internal Audit Notes */}
                            <div>
                                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Internal Reviewer Notes</label>
                                <textarea
                                    className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-50 rounded-2xl text-[12px] font-bold text-slate-800 h-20 focus:border-emerald-500 focus:bg-white outline-none transition-all resize-none"
                                    placeholder="Add notes for team reference..."
                                />
                            </div>
                        </div>

                        {/* Modal Footer Actions */}
                        <div className="p-7 bg-slate-50 border-t border-slate-100 grid grid-cols-3 gap-3">
                            <button
                                onClick={() => handleAction(selectedRequest.id, 'On-Hold')}
                                className="py-3.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:border-amber-400 hover:text-amber-600 transition-all shadow-sm active:scale-95"
                            >
                                On-Hold
                            </button>
                            <button
                                onClick={() => handleAction(selectedRequest.id, 'Rejected')}
                                className="py-3.5 bg-red-50 border border-red-100 text-red-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95"
                            >
                                Reject
                            </button>
                            <button
                                onClick={() => handleAction(selectedRequest.id, 'Approved')}
                                className="py-3.5 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95"
                            >
                                Approve
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApprovalManagement;
