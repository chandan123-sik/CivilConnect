import React from 'react';
import { useNavigate } from 'react-router-dom';

const plans = [
    { id: 'monthly', name: 'Standard Monthly', price: '₹499', duration: '30 Days', features: ['Public Profile Listing', 'Unlimted Leads', 'Search Priority: Low'], color: 'from-blue-500 to-indigo-600' },
    { id: 'quarterly', name: 'Quarterly Pro', price: '₹1,299', duration: '90 Days', features: ['Public Profile Listing', 'Unlimted Leads', 'Search Priority: Medium', 'Priority Support'], color: 'from-sky-500 to-blue-600' },
    { id: 'yearly', name: 'Annual Elite', price: '₹4,499', duration: '365 Days', featured: true, features: ['Public Profile Listing', 'Unlimted Leads', 'Search Priority: High', 'Portfolio Management', 'Save 20% Annual'], color: 'from-slate-900 to-slate-800' },
];

const ProviderOnboardingPlans = () => {
    const navigate = useNavigate();

    const handlePlanSelect = (planId) => {
        localStorage.setItem('onboarding_plan_id', planId);
        // Completed onboarding, go to panel (where they will wait for approval)
        navigate('/serviceprovider/home');
    };

    return (
        <div className="min-h-screen bg-[#FBFCFE] pb-12">
            <style>{`
                @keyframes bob {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-6px); }
                }
                .animate-bob { animation: bob 2.5s ease-in-out infinite; }
            `}</style>

            <div className="bg-gradient-to-br from-[#1E3A8A] to-indigo-900 px-8 pt-16 pb-12 rounded-b-[40px] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                    <h1 className="text-3xl font-[1000] text-white tracking-tight leading-tight mb-2">Grow Your Business</h1>
                    <p className="text-blue-200/60 text-[11px] font-black uppercase tracking-[0.2em]">Unlock unlimited project leads</p>
                </div>
            </div>

            <div className="px-6 -mt-8 space-y-6">
                {plans.map((plan, idx) => (
                    <div
                        key={plan.id}
                        style={{ animationDelay: `${idx * 150}ms` }}
                        className={`animate-in slide-in-from-bottom-5 fade-in duration-700 fill-mode-both bg-white border-2 rounded-[32px] p-6 transition-all duration-300 relative group active:scale-[0.98]
                        ${plan.featured ? 'border-[#1E3A8A] shadow-2xl shadow-blue-900/10' : 'border-slate-100'}`}
                    >
                        {plan.featured && (
                            <div className="absolute -top-3 right-8 bg-[#1E3A8A] text-white text-[9px] font-black px-4 py-1.5 rounded-full shadow-lg uppercase tracking-widest z-10">
                                Recommended
                            </div>
                        )}

                        <div className="flex items-center justify-between mb-6">
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center shadow-xl`}>
                                <svg className="w-7 h-7 text-white animate-bob" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <div className="text-right">
                                <div className="flex items-baseline justify-end gap-1">
                                    <span className="text-3xl font-[1000] text-slate-900 tracking-tighter">{plan.price}</span>
                                    <span className="text-slate-400 text-[10px] font-black">/GST</span>
                                </div>
                                <p className="text-[#1E3A8A] text-[10px] font-black uppercase tracking-widest mt-1 bg-blue-50 px-2 py-0.5 rounded-md inline-block">{plan.duration}</p>
                            </div>
                        </div>

                        <h4 className="text-slate-900 font-[1000] text-xl mb-5 tracking-tight">{plan.name}</h4>

                        <div className="space-y-4 mb-8">
                            {plan.features.map((f, i) => (
                                <div key={i} className="flex items-center gap-3.5 group/item">
                                    <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0">
                                        <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <span className="text-[13px] text-slate-600 font-bold tracking-tight">{f}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => handlePlanSelect(plan.id)}
                            className={`w-full py-5 rounded-[22px] text-xs font-[1000] uppercase tracking-[0.3em] shadow-xl active:scale-95 transition-all outline-none
                            ${plan.featured ? 'bg-[#1E3A8A] text-white shadow-blue-900/30' : 'bg-slate-900 text-white shadow-slate-900/20'}`}
                        >
                            Choose This Plan
                        </button>
                    </div>
                ))}

                <div className="pt-4 text-center">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] px-10 leading-relaxed">
                        Prices are inclusive of all taxes. Cancel anytime from your panel.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProviderOnboardingPlans;
