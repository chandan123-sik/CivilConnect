import React, { useState } from 'react';

const ProviderRequests = () => {
    const [activeTab, setActiveTab] = useState('pending');

    const requests = [
        { id: 1, type: '🏠 Residential', client: 'Amit Patel', loc: 'Pune', status: 'pending', service: 'Wall Painting (Full Flat)', price: '₹12,400', date: 'Just now' },
        { id: 2, type: '🏢 Commercial', client: 'Vikram Singh', loc: 'Mumbai', status: 'pending', service: 'Office Wiring Upgrade', price: '₹45,000', date: '2h ago' },
        { id: 3, type: '🏠 Residential', client: 'Sneha Rao', loc: 'Pune', status: 'accepted', service: 'Kitchen Renovation', price: '₹85,000', date: 'Yesterday' },
    ];

    const filtered = requests.filter(r => r.status === activeTab);

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24">
            {/* ── Fixed Header ── */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 pt-14 pb-8 sticky top-0 z-30 space-y-6">
                <div>
                    <h1 className="text-2xl font-[1000] text-slate-900 tracking-tighter m-0">Project Leads</h1>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Manage incoming inquiries</p>
                </div>

                {/* Premium Tab Switcher */}
                <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                    {['pending', 'accepted', 'rejected'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-3 px-2 rounded-[14px] text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeTab === tab ? 'bg-white text-[#1E3A8A] shadow-md shadow-blue-900/5 ring-1 ring-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Leads Content ── */}
            <div className="p-6 space-y-5">
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 px-10 text-center">
                        <div className="w-20 h-20 bg-slate-100 rounded-[40px] flex items-center justify-center text-4xl mb-6 shadow-inner">📭</div>
                        <h3 className="text-slate-900 font-black text-lg">No {activeTab} leads</h3>
                        <p className="text-slate-400 text-sm mt-2 leading-relaxed font-medium">When clients request your service, they will appear here.</p>
                    </div>
                ) : (
                    filtered.map(req => (
                        <div key={req.id} className="bg-white border border-slate-100 rounded-[35px] p-7 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500 relative overflow-hidden group">
                            {/* Type Badge */}
                            <div className="flex justify-between items-start mb-6">
                                <span className="bg-slate-50 text-slate-500 text-[10px] font-black px-4 py-1.5 rounded-full border border-slate-100 uppercase tracking-widest">{req.type}</span>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{req.date}</p>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-slate-900 text-xl font-extrabold tracking-tight mb-1">{req.client}</h3>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> {req.loc} • {req.service}
                                </p>
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-50 pt-6">
                                <div>
                                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest leading-none mb-1.5">Starting From</p>
                                    <p className="text-[#1E3A8A] text-xl font-black tracking-tight">{req.price}</p>
                                </div>

                                {activeTab === 'pending' ? (
                                    <div className="flex gap-2">
                                        <button className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20 active:scale-90 transition-all outline-none">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                                        </button>
                                        <button className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 border border-slate-100 active:scale-90 transition-all outline-none">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                ) : (
                                    <button className="bg-[#1E3A8A] text-white px-8 py-3.5 rounded-2xl text-[13px] font-black shadow-lg shadow-blue-900/20 active:scale-95 transition-all outline-none">
                                        Contact Client
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
