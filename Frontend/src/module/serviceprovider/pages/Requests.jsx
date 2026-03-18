import React, { useState, useEffect } from 'react';
import { getIncomingLeads, updateLeadStatus } from '../../../api/providerApi';

const ProviderRequests = () => {
    const [activeTab, setActiveTab] = useState('pending');
    const [selectedClient, setSelectedClient] = useState(null);
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const data = await getIncomingLeads();
            // Backend already sorts by createdAt: -1, but we can enforce it here
            const sorted = Array.isArray(data) ? data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];
            setLeads(sorted);
        } catch (err) {
            console.error("Failed to fetch leads:", err);
            setLeads([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, newStatus) => {
        try {
            await updateLeadStatus(id, newStatus);
            // Optimistically update local state
            setLeads(prev => prev.map(l => l._id === id ? { ...l, status: newStatus } : l));
            if (newStatus === 'accepted') {
                const acceptedLead = leads.find(l => l._id === id);
                if (acceptedLead) setSelectedClient({ ...acceptedLead, status: 'accepted' });
                setActiveTab('accepted');
            } else if (newStatus === 'rejected') {
                setActiveTab('rejected');
            }
            // Refresh from server
            setTimeout(fetchLeads, 300);
        } catch (err) {
            alert("Action failed: " + (err || "Unknown error"));
        }
    };

    // Helper: get display name safely
    const getClientName = (req) => req.clientName || req.userId?.fullName || 'Unknown Client';
    const getClientPhone = (req) => req.clientPhone || req.userId?.phone || 'N/A';
    const getClientCity = (req) => req.clientCity || req.userId?.city || req.location || 'N/A';
    const getServiceType = (req) => {
        const svc = req.serviceType || '';
        // Don't show 'provider' as service type — it's the default role string
        return (svc && svc.toLowerCase() !== 'provider') ? svc : req.projectType || 'General Service';
    };

    const filtered = leads.filter(r => {
        const matchesTab = r.status === activeTab;
        const name = getClientName(r).toLowerCase();
        const service = getServiceType(r).toLowerCase();
        const query = searchTerm.toLowerCase();
        const matchesSearch = name.includes(query) || service.includes(query);
        return matchesTab && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-10">
            {/* ── Fixed Header ── */}
            <div className="bg-gradient-to-br from-[#1E3A8A] to-indigo-900 px-6 pt-8 pb-4 sticky top-0 z-50 rounded-b-[32px] shadow-lg">
                <div className="pb-4">
                    <h1 className="text-2xl font-[1000] text-white tracking-tight m-0">Project Requests</h1>
                    <p className="text-blue-200/60 text-[13px] font-bold uppercase tracking-widest mt-0.5">Manage your incoming leads</p>
                </div>

                {/* Search Bar */}
                <div className="relative mb-4 group px-1">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none transition-transform group-focus-within:scale-110">
                        <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <input 
                        type="text"
                        placeholder="Search by client name or service..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-2xl py-3 pl-11 pr-4 text-white text-[13px] font-bold placeholder:text-blue-200/40 focus:outline-none focus:bg-white/20 focus:border-white/40 transition-all shadow-inner"
                    />
                </div>

                {/* Premium Tab Switcher */}
                <div className="flex bg-white/10 backdrop-blur-md p-1 rounded-xl border border-white/10 mb-2">
                    {['pending', 'accepted', 'rejected'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-2 px-2 rounded-lg text-[12px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === tab ? 'bg-white text-[#1E3A8A] shadow-md' : 'text-white/60 hover:text-white'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Leads Content ── */}
            <div className="p-6 pt-6 space-y-5">
                {loading ? (
                    <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest text-[11px]">Loading Leads...</div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 px-10 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-inner border border-slate-100">📭</div>
                        <h3 className="text-slate-900 font-extrabold text-[15px]">No {activeTab} leads</h3>
                        <p className="text-slate-400 text-[11px] mt-2 font-medium">New requests will appear here once they are submitted by clients.</p>
                    </div>
                ) : (
                    filtered.map(req => (
                        <div key={req._id} className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm transition-all duration-300 relative overflow-hidden group hover:shadow-md active:scale-[0.98]">
                            {/* Type & Date */}
                            <div className="flex justify-between items-start mb-4">
                                <span className="bg-slate-50 text-slate-500 text-[12px] font-black px-3 py-1 rounded-full border border-slate-100 uppercase tracking-widest shadow-sm">
                                    {req.projectType || 'Residential'}
                                </span>
                                <p className="text-slate-400 text-[12px] font-black uppercase tracking-widest">
                                    {new Date(req.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                </p>
                            </div>

                            {/* Client Info */}
                            <div className="mb-5">
                                <h3 className="text-slate-900 text-lg font-black tracking-tight mb-1">
                                    {getClientName(req)}
                                </h3>
                                <p className="text-slate-400 text-[13px] font-black uppercase tracking-widest flex items-center gap-2 mb-1">
                                    <span className="w-2.5 h-2.5 bg-blue-500 rounded-full flex-shrink-0" />
                                    {getClientCity(req)} • {getServiceType(req)}
                                </p>
                                {req.clientPhone && req.clientPhone !== 'N/A' && (
                                    <p className="text-slate-500 text-[12px] font-bold flex items-center gap-1 mb-2">
                                        📞 {getClientPhone(req)}
                                    </p>
                                )}
                                <p className="text-slate-600 text-[15px] font-medium leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-dashed border-slate-100">
                                    {req.description || 'No description provided.'}
                                </p>
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                                <div>
                                    <p className="text-slate-400 text-[12px] font-black uppercase tracking-widest mb-1">Budget Est.</p>
                                    <p className="text-[#1E3A8A] text-xl font-black tracking-tight">
                                        {req.budget && req.budget !== 'Negotiable' ? `₹${req.budget}` : req.budget || 'Negotiable'}
                                    </p>
                                </div>

                                {activeTab === 'pending' ? (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAction(req._id, 'rejected')}
                                            className="px-4 py-2.5 bg-red-50 text-red-500 rounded-xl text-[11px] font-black uppercase tracking-widest border border-red-100 active:scale-95 transition-all outline-none hover:bg-red-100"
                                        >
                                            Reject
                                        </button>
                                        <button
                                            onClick={() => handleAction(req._id, 'accepted')}
                                            className="px-5 py-2.5 bg-[#1E3A8A] text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-900/20 active:scale-95 transition-all outline-none hover:bg-indigo-800"
                                        >
                                            Accept
                                        </button>
                                    </div>
                                ) : activeTab === 'accepted' ? (
                                    <button
                                        onClick={() => setSelectedClient(req)}
                                        className="px-6 py-3 rounded-xl text-[12px] font-black uppercase tracking-widest shadow-md active:scale-95 transition-all outline-none bg-[#1E3A8A] text-white shadow-blue-900/20 hover:shadow-lg"
                                    >
                                        Contact Client
                                    </button>
                                ) : (
                                    <span className="px-4 py-2 bg-red-50 text-red-500 rounded-xl text-[11px] font-black uppercase tracking-widest border border-red-100">
                                        Rejected
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* ── Client Contact Modal ── */}
            {selectedClient && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-md p-4">
                    <div className="w-full max-w-[340px] bg-white rounded-[36px] p-8 shadow-2xl text-center relative overflow-hidden">
                        {/* Header */}
                        <div className="mb-6">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border-2 border-blue-100 shadow-inner overflow-hidden">
                                {selectedClient?.clientImage ? (
                                    <img src={selectedClient.clientImage} alt="Client" className="w-full h-full object-cover" />
                                ) : (
                                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(getClientName(selectedClient))}&background=EFF6FF&color=1E3A8A`} alt="Avatar" className="w-full h-full object-cover" />
                                )}
                            </div>
                            <h3 className="text-slate-900 font-[1000] text-xl tracking-tight mb-1">Client Contact</h3>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Verified Details</p>
                        </div>

                        <div className="space-y-3 mb-8 text-left">
                            {/* Name */}
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-slate-400 text-[8px] font-black uppercase tracking-[0.2em] mb-1">Client Name</p>
                                <p className="text-slate-900 font-black text-[16px]">
                                    {getClientName(selectedClient)}
                                </p>
                            </div>

                            {/* Phone */}
                            <a
                                href={`tel:${getClientPhone(selectedClient).replace(/\s+/g, '')}`}
                                className="block p-4 bg-blue-50 rounded-2xl border border-blue-100 hover:bg-blue-100 transition-colors group no-underline active:scale-[0.98]"
                            >
                                <p className="text-blue-500 text-[8px] font-black uppercase tracking-[0.2em] mb-1">Mobile Number (Tap to Call)</p>
                                <div className="flex items-center justify-between">
                                    <p className="text-[#1E3A8A] font-black text-[17px] m-0">
                                        {getClientPhone(selectedClient)}
                                    </p>
                                    <div className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-[10px] font-black shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                                        CALL NOW
                                    </div>
                                </div>
                            </a>

                            {/* Location */}
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-slate-400 text-[8px] font-black uppercase tracking-[0.2em] mb-1">Location / City</p>
                                <p className="text-slate-700 font-bold text-[14px]">
                                    {getClientCity(selectedClient)}
                                </p>
                            </div>

                            {/* Service */}
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-slate-400 text-[8px] font-black uppercase tracking-[0.2em] mb-1">Service Required</p>
                                <p className="text-slate-700 font-bold text-[14px]">
                                    {getServiceType(selectedClient)}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setSelectedClient(null)}
                            className="w-full py-4 bg-[#1E3A8A] text-white rounded-2xl text-[11px] font-[1000] uppercase tracking-widest shadow-xl shadow-blue-900/20 active:scale-95 transition-all outline-none"
                        >
                            Close Panel
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default ProviderRequests;
