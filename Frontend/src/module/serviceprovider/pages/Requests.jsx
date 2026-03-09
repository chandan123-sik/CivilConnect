import React, { useState } from 'react';

const ProviderRequests = () => {
    const [activeTab, setActiveTab] = useState('pending');
    const [selectedClient, setSelectedClient] = useState(null);
    const [leads, setLeads] = React.useState(() => {
        const savedLeads = JSON.parse(localStorage.getItem('cc_leads') || '[]');
        const initialMock = [
            { id: 1, type: '🏠 Residential', client: 'Amit Patel', phone: '+91 98765 43210', loc: 'Pune', status: 'pending', service: 'Wall Painting (Full Flat)', desc: 'Need professional painting for a 3BHK apartment including ceiling work.', price: '₹12,400', date: 'Just now' },
            { id: 2, type: '🏢 Commercial', client: 'Vikram Singh', phone: '+91 88888 77777', loc: 'Mumbai', status: 'pending', service: 'Office Wiring Upgrade', desc: 'Rewiring of the main server room and installation of 12 new power points.', price: '₹45,000', date: '2h ago' },
            { id: 3, type: '🏠 Residential', client: 'Sneha Rao', phone: '+91 77777 66666', loc: 'Pune', status: 'accepted', service: 'Kitchen Renovation', desc: 'Complete modular kitchen setup with chimney installation.', price: '₹85,000', date: 'Yesterday' },
        ];
        return [...savedLeads, ...initialMock];
    });

    const handleAction = (id, newStatus) => {
        const updatedLeads = leads.map(l => l.id === id ? { ...l, status: newStatus } : l);
        setLeads(updatedLeads);

        // Sync back to localStorage for real leads
        const realLeads = updatedLeads.filter(l => typeof l.id === 'number' && l.id > 10); // Assume mock IDs are < 10
        localStorage.setItem('cc_leads', JSON.stringify(realLeads));
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
                                    <span className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_8_rgba(59,130,246,0.5)]" /> {req.loc} • {req.service}
                                </p>
                                <p className="text-slate-600 text-[15px] font-medium leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-dashed border-slate-100">
                                    {req.desc}
                                </p>
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-50 pt-5">
                                <div>
                                    <p className="text-slate-400 text-[12px] font-black uppercase tracking-widest mb-1.5">Budget Est.</p>
                                    <p className="text-[#1E3A8A] text-xl font-black tracking-tight">{req.price}</p>
                                </div>

                                {activeTab === 'pending' ? (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAction(req.id, 'rejected')}
                                            className="px-4 py-2.5 bg-red-50 text-red-500 rounded-xl text-[11px] font-black uppercase tracking-widest border border-red-100 active:scale-95 transition-all outline-none hover:bg-red-100"
                                        >
                                            Reject
                                        </button>
                                        <button
                                            onClick={() => handleAction(req.id, 'accepted')}
                                            className="px-5 py-2.5 bg-[#1E3A8A] text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-900/20 active:scale-95 transition-all outline-none hover:bg-indigo-800"
                                        >
                                            Accept
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => activeTab === 'accepted' && setSelectedClient(req)}
                                        className={`px-7 py-3.5 rounded-xl text-[12px] font-black uppercase tracking-widest shadow-md active:scale-95 transition-all outline-none ${activeTab === 'accepted' ? 'bg-[#1E3A8A] text-white shadow-blue-900/20 hover:shadow-lg' : 'bg-slate-100 text-slate-400 shadow-none border border-slate-100'}`}
                                    >
                                        {activeTab === 'accepted' ? 'Contact Client' : 'Rejected'}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* ── Refined Client Contact Modal ── */}
            {selectedClient && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="w-full max-w-[340px] bg-white rounded-[40px] p-8 shadow-2xl animate-in slide-in-from-bottom-12 duration-500 ease-out text-center relative overflow-hidden">

                        <div className="mb-6">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border-2 border-blue-50/50 shadow-inner">
                                📱
                            </div>
                            <h3 className="text-slate-900 font-[1000] text-xl tracking-tighter mb-1 uppercase tracking-tight">Client Contact</h3>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest opacity-60">Verified Details</p>
                        </div>

                        <div className="space-y-4 mb-8 text-left">
                            <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                <p className="text-slate-400 text-[8px] font-black uppercase tracking-[0.2em] mb-1">Name</p>
                                <p className="text-slate-900 font-black text-[15px]">{selectedClient.client}</p>
                            </div>

                            <a
                                href={`tel:${selectedClient.phone.replace(/\s+/g, '')}`}
                                className="block p-4 bg-blue-50/80 rounded-2xl border border-blue-100 hover:bg-blue-100 transition-colors group no-underline active:scale-[0.98]"
                            >
                                <p className="text-blue-500 text-[8px] font-black uppercase tracking-[0.2em] mb-1">Mobile Number (Tap to Call)</p>
                                <div className="flex items-center justify-between">
                                    <p className="text-[#1E3A8A] font-black text-[17px] m-0">{selectedClient.phone}</p>
                                    <div className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-[10px] font-black shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                                        CALL NOW
                                    </div>
                                </div>
                            </a>
                        </div>

                        <button
                            onClick={() => setSelectedClient(null)}
                            className="w-full py-4.5 bg-[#1E3A8A] text-white rounded-2xl text-[11px] font-[1000] uppercase tracking-widest shadow-xl shadow-blue-900/20 active:scale-95 transition-all outline-none"
                        >
                            Close Panel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProviderRequests;
