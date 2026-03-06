import React, { useState } from 'react';

const ProviderRequests = () => {
    const [activeTab, setActiveTab] = useState('pending');
    const [leads, setLeads] = useState([
        { id: 1, type: '🏠 Residential', client: 'Amit Patel', loc: 'Pune', status: 'pending', service: 'Wall Painting (Full Flat)', desc: 'Need professional painting for a 3BHK apartment including ceiling work.', price: '₹12,400', date: 'Just now' },
        { id: 2, type: '🏢 Commercial', client: 'Vikram Singh', loc: 'Mumbai', status: 'pending', service: 'Office Wiring Upgrade', desc: 'Rewiring of the main server room and installation of 12 new power points.', price: '₹45,000', date: '2h ago' },
        { id: 3, type: '🏠 Residential', client: 'Sneha Rao', loc: 'Pune', status: 'accepted', service: 'Kitchen Renovation', desc: 'Complete modular kitchen setup with chimney installation.', price: '₹85,000', date: 'Yesterday' },
    ]);

    const handleAction = (id, newStatus) => {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
    };

    const filtered = leads.filter(r => r.status === activeTab);

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-10">
            {/* ── Fixed Header ── */}
            <div className="bg-gradient-to-br from-[#1E3A8A] to-indigo-900 px-6 pt-8 pb-4 sticky top-0 z-50 rounded-b-[32px] shadow-lg">
                <div className="pb-4">
                    <h1 className="text-2xl font-[1000] text-white tracking-tight m-0">Project Requests</h1>
                    <p className="text-blue-200/60 text-[13px] font-bold uppercase tracking-widest mt-0.5">Manage your incoming leads</p>
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
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 px-10 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-inner border border-slate-100">📭</div>
                        <h3 className="text-slate-900 font-extrabold text-[15px]">No {activeTab} leads</h3>
                        <p className="text-slate-400 text-[11px] mt-2 font-medium">New requests will appear here once they are submitted by clients.</p>
                    </div>
                ) : (
                    filtered.map(req => (
                        <div key={req.id} className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm transition-all duration-300 relative overflow-hidden group hover:shadow-md cursor-pointer active:scale-[0.98]">
                            {/* Type & Date */}
                            <div className="flex justify-between items-start mb-4">
                                <span className="bg-slate-50 text-slate-500 text-[12px] font-black px-3 py-1 rounded-full border border-slate-100 uppercase tracking-widest shadow-sm">{req.type}</span>
                                <p className="text-slate-400 text-[12px] font-black uppercase tracking-widest">{req.date}</p>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-slate-900 text-lg font-black tracking-tight mb-1">{req.client}</h3>
                                <p className="text-slate-400 text-[14px] font-black uppercase tracking-widest flex items-center gap-2 mb-3">
                                    <span className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" /> {req.loc} • {req.service}
                                </p>
                                <p className="text-slate-600 text-[15px] font-medium leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-dashed border-slate-100">
                                    {req.desc}
                                </p>
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-50 pt-5">
                                <div>
                                    <p className="text-slate-400 text-[12px] font-black uppercase tracking-widest mb-1.5">Budget Est.</p>
                                    <p className="text-[#1E3A8A] text-2xl font-black tracking-tight">{req.price}</p>
                                </div>

                                {activeTab === 'pending' ? (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAction(req.id, 'rejected')}
                                            className="px-5 py-3 bg-red-50 text-red-500 rounded-xl text-[13px] font-black uppercase tracking-widest border border-red-100 active:scale-95 transition-all outline-none hover:bg-red-100"
                                        >
                                            Reject
                                        </button>
                                        <button
                                            onClick={() => handleAction(req.id, 'accepted')}
                                            className="px-6 py-3 bg-[#1E3A8A] text-white rounded-xl text-[13px] font-black uppercase tracking-widest shadow-lg shadow-blue-900/20 active:scale-95 transition-all outline-none hover:bg-indigo-800"
                                        >
                                            Accept
                                        </button>
                                    </div>
                                ) : (
                                    <button className={`px-7 py-3.5 rounded-xl text-[12px] font-black uppercase tracking-widest shadow-md active:scale-95 transition-all outline-none ${activeTab === 'accepted' ? 'bg-[#1E3A8A] text-white shadow-blue-900/20 hover:shadow-lg' : 'bg-slate-100 text-slate-400 shadow-none border border-slate-100'}`}>
                                        {activeTab === 'accepted' ? 'Contact Client' : 'Rejected'}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProviderRequests;
