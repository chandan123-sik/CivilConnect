import React from 'react';

const plans = [
    { id: 'monthly', name: 'Standard Monthly', price: '₹499', duration: '30 Days', features: ['Public Profile Listing', 'Unlimted Leads', 'Search Priority: Low'], color: 'from-blue-500 to-indigo-600' },
    { id: 'quarterly', name: 'Quarterly Pro', price: '₹1,299', duration: '90 Days', features: ['Public Profile Listing', 'Unlimted Leads', 'Search Priority: Medium', 'Priority Support'], color: 'from-sky-500 to-blue-600' },
    { id: 'yearly', name: 'Annual Elite', price: '₹4,499', duration: '365 Days', featured: true, features: ['Public Profile Listing', 'Unlimted Leads', 'Search Priority: High', 'Portfolio Management', 'Save 20% Annual'], color: 'from-slate-900 to-slate-800' },
];

const ProviderSubscription = () => {
    return (
        <div className="min-h-full bg-[#FBFCFE] pb-4">
            {/* ── CSS Animations ── */}
            <style>{`
                @keyframes bob {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-6px); }
                }
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-5px); }
                    100% { transform: translateY(0px); }
                }
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-bob { animation: bob 2.5s ease-in-out infinite; }
                .animate-float { animation: float 4s ease-in-out infinite; }
                .shimmer-bg::after {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
                    animation: shimmer 3s infinite;
                }
            `}</style>

            {/* ── Modern Sticky Header ── */}
            <div className="sticky top-0 z-[60] bg-gradient-to-br from-[#1E3A8A] to-indigo-900 px-6 pt-12 pb-6 shadow-xl rounded-b-[32px]">
                <h1 className="text-2xl font-[1000] text-white tracking-tight m-0">Business Plans</h1>
                <p className="text-blue-200/60 text-[11px] font-bold uppercase tracking-widest mt-0.5">Upgrade your visibility</p>
            </div>

            <div className="space-y-6 pt-5">
                {/* ── Active Plan: Compact Premium Card ── */}
                <div className="mx-3 relative bg-[#1E3A8A] overflow-hidden group rounded-[32px] shadow-2xl shadow-blue-900/20 active:scale-[0.98] transition-all">
                    {/* Animated Background Gradients */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-[#1E3A8A] to-indigo-900 group-hover:scale-105 transition-transform duration-1000" />
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-400/20 rounded-full blur-[80px]" />
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]" />

                    <div className="relative z-10 px-6 py-6 shimmer-bg">
                        <div className="flex justify-between items-start mb-4">
                            <div className="px-3.5 py-1.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl">
                                <span className="text-white text-[9px] font-black uppercase tracking-[0.25em] leading-none">Your Plan</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 border border-green-500/30 rounded-lg">
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                <span className="text-green-400 text-[9px] font-black uppercase tracking-widest leading-none">Active</span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-white text-2xl font-[1000] tracking-tight leading-tight mb-1">Professional Pro</h2>
                            <p className="text-blue-200/40 text-[10px] font-bold uppercase tracking-[0.2em]">Highest Search Priority</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                            <div>
                                <p className="text-blue-200/50 text-[9px] font-black uppercase tracking-widest mb-1">Renewal</p>
                                <p className="text-white text-base font-[1000]">15 MAR</p>
                            </div>
                            <div className="text-right">
                                <p className="text-blue-200/50 text-[9px] font-black uppercase tracking-widest mb-1">Remaining</p>
                                <p className="text-sky-300 text-base font-[1000]">05 Days</p>
                            </div>
                        </div>

                        {/* Usage Progress */}
                        <div className="mt-5 space-y-2">
                            <div className="flex justify-between items-center text-[10px] font-black text-white/50 uppercase tracking-widest">
                                <span>Cycle</span>
                                <span>85% Spent</span>
                            </div>
                            <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-blue-400 to-white rounded-full w-[85%]" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 space-y-6">
                    <div>
                        <h3 className="text-slate-900 font-black text-[15px] uppercase tracking-[0.2em] opacity-80 pl-1">Available Upgrades</h3>
                    </div>

                    {plans.map((plan, idx) => (
                        <div
                            key={plan.id}
                            style={{ animationDelay: `${idx * 150}ms` }}
                            className={`animate-in slide-in-from-bottom-5 fade-in duration-700 fill-mode-both bg-white border-2 rounded-2xl p-6 transition-all duration-300 relative group active:scale-[0.97]
                            ${plan.featured ? 'border-[#1E3A8A] shadow-2xl shadow-blue-900/10 scale-102' : 'border-slate-100 hover:border-slate-200 shadow-sm'}`}
                        >
                            {plan.featured && (
                                <div className="absolute -top-3 right-6 bg-[#1E3A8A] text-white text-[9px] font-black px-4 py-1.5 rounded-full shadow-lg uppercase tracking-widest z-10">
                                    Top Choice
                                </div>
                            )}

                            <div className="flex items-center justify-between mb-6">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center shadow-xl transition-all duration-500 shadow-inner`}>
                                    <svg className="w-7 h-7 text-white animate-bob" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-baseline justify-end gap-1">
                                        <span className="text-3xl font-[1000] text-slate-900 tracking-tighter">{plan.price}</span>
                                        <span className="text-slate-400 text-[10px] font-black">/INC GST</span>
                                    </div>
                                    <p className="text-[#1E3A8A] text-[11px] font-black uppercase tracking-widest mt-1 bg-blue-50 px-2 py-0.5 rounded-md inline-block">{plan.duration}</p>
                                </div>
                            </div>

                            <h4 className="text-slate-900 font-[1000] text-xl mb-5 tracking-tight">{plan.name}</h4>

                            <div className="space-y-4 mb-8">
                                {plan.features.map((f, i) => (
                                    <div key={i} className="flex items-center gap-3.5 group/item">
                                        <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0 shadow-sm group-hover/item:bg-blue-600 group-hover/item:border-blue-600 transition-colors">
                                            <svg className="w-3.5 h-3.5 text-blue-600 group-hover/item:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <span className="text-[14px] text-slate-600 font-bold tracking-tight">{f}</span>
                                    </div>
                                ))}
                            </div>

                            <button className={`w-full py-3.5 rounded-xl text-[13px] font-black transition-all duration-300 active:scale-95 outline-none uppercase tracking-[0.2em] shadow-lg
                                ${plan.featured ? 'bg-[#1E3A8A] hover:bg-indigo-800 text-white shadow-blue-900/30' : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20'}`}>
                                Upgrade To {plan.id === 'yearly' ? 'Annual' : 'Pro'}
                            </button>
                        </div>
                    ))}

                    <div className="pb-8 text-center pt-4">
                        <button className="flex items-center justify-center gap-3 text-slate-400 text-[11px] font-[1000] uppercase tracking-[0.3em] hover:text-[#1E3A8A] transition-all py-4 active:scale-95 group mx-auto border-b border-transparent hover:border-blue-200">
                            Account Billing History
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProviderSubscription;
