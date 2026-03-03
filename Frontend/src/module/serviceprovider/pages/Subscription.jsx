import React from 'react';

const plans = [
    { id: 'monthly', name: 'Standard Monthly', price: '₹499', duration: '30 Days', features: ['Public Profile Listing', 'Unlimted Leads', 'Search Priority: Low'], color: 'from-blue-500 to-indigo-600' },
    { id: 'quarterly', name: 'Quarterly Pro', price: '₹1,299', duration: '90 Days', features: ['Public Profile Listing', 'Unlimted Leads', 'Search Priority: Medium', 'Priority Support'], color: 'from-sky-500 to-blue-600' },
    { id: 'yearly', name: 'Annual Elite', price: '₹4,499', duration: '365 Days', featured: true, features: ['Public Profile Listing', 'Unlimted Leads', 'Search Priority: High', 'Portfolio Management', 'Save 20% Annual'], color: 'from-slate-900 to-slate-800' },
];

const ProviderSubscription = () => {
    return (
        <div className="min-h-full bg-[#FBFCFE] pb-10">
            {/* ── Modern Header ── */}
            <div className="bg-white pt-16 px-6 pb-6 border-b border-slate-100 z-30 sticky top-0 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                <h1 className="text-2xl font-[900] text-slate-900 tracking-tight m-0">Business Plan</h1>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Manage Visibility & Features</p>
            </div>

            <div className="px-6 space-y-6 pt-6">
                {/* Active Plan Glassmorphic Card */}
                <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[32px] p-8 shadow-2xl shadow-blue-500/20 overflow-hidden group">
                    {/* Background effects */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-150 transition-transform duration-700" />

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full border border-white/20 uppercase tracking-widest">Active Plan</span>
                            <div className="text-right">
                                <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest leading-none mb-1">Status</p>
                                <p className="text-white text-xs font-black">GOOD STANDING</p>
                            </div>
                        </div>

                        <h2 className="text-white text-2xl font-black mb-6 tracking-tight">Standard Monthly Professional</h2>

                        <div className="grid grid-cols-2 gap-8 py-6 border-t border-white/10">
                            <div>
                                <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1.5">Expires On</p>
                                <p className="text-white text-[15px] font-[900] tracking-tight">15 MAR, 2025</p>
                            </div>
                            <div>
                                <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1.5">Remaining</p>
                                <p className="text-sky-300 text-[15px] font-[900] tracking-tight">05 Days</p>
                            </div>
                        </div>

                        {/* Dynamic Progress Indicator */}
                        <div className="space-y-2 mt-2">
                            <div className="flex justify-between items-center text-[11px] font-bold text-white/60">
                                <span>Usage period</span>
                                <span>85% Spent</span>
                            </div>
                            <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden border border-white/5">
                                <div className="h-full bg-white rounded-full w-[85%] shadow-[0_0_15px_rgba(255,255,255,0.4)]" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4 pb-2">
                    <h3 className="text-slate-900 font-[900] text-lg tracking-tight px-1">Available Plans</h3>
                </div>

                {plans.map(plan => (
                    <div key={plan.id} className={`bg-white border-2 rounded-[32px] p-7 transition-all duration-300 relative group
            ${plan.featured ? 'border-blue-500 shadow-xl shadow-blue-500/5' : 'border-slate-100 hover:border-slate-200 shadow-sm'}`}>

                        {plan.featured && (
                            <div className="absolute top-0 right-8 -translate-y-1/2 bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg shadow-blue-500/20 uppercase tracking-widest">
                                Recommended
                            </div>
                        )}

                        <div className="flex justify-between items-start mb-6">
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-black text-slate-900 tracking-tight">{plan.price}</p>
                                <p className="text-slate-400 text-xs font-bold leading-none mt-1">{plan.duration}</p>
                            </div>
                        </div>

                        <h4 className="text-slate-900 font-black text-lg mb-4">{plan.name}</h4>

                        <div className="space-y-3 mb-8">
                            {plan.features.map((f, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                                        <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <span className="text-[13px] text-slate-600 font-medium">{f}</span>
                                </div>
                            ))}
                        </div>

                        <button className={`w-full py-4 rounded-2xl text-[14px] font-black transition-all duration-300 active:scale-95 outline-none
              ${plan.featured ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30' : 'bg-slate-900 text-white border border-slate-900'}`}>
                            Complete Upgrade
                        </button>
                    </div>
                ))}

                <div className="py-8">
                    <button className="w-full flex items-center justify-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-slate-600 transition-colors">
                        View Payment Invoices
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProviderSubscription;
