import React, { useState, useEffect } from 'react';
import { getProviderProfile, initiateSubscription } from '../../../api/providerApi';
import { getPlans } from '../../../api/publicApi';
import { showToast } from '../../../components/Toast';

const ProviderSubscription = () => {
    const [plans, setPlans] = useState([]);
    const [currentPlan, setCurrentPlan] = useState(null);
    const [expiry, setExpiry] = useState(null);
    const [loading, setLoading] = useState(true);
    const [approvalStatus, setApprovalStatus] = useState('none');
    const [showCheckout, setShowCheckout] = useState(null);
    const [paymentProcessing, setPaymentProcessing] = useState(false);

    const loadData = async () => {
        try {
            const [pRes, profileRes] = await Promise.all([getPlans(), getProviderProfile()]);
            const activePlans = pRes.data || pRes;
            const profile = profileRes.data || profileRes;
            
            setPlans(activePlans.filter(p => p.isActive !== false));
            setApprovalStatus(profile.approvalStatus || 'none');
            
            if (profile.subscriptionId) {
                const active = activePlans.find(p => p._id === (profile.subscriptionId._id || profile.subscriptionId));
                setCurrentPlan(active);
                setExpiry(profile.subscriptionExpiry);
            }

            // Sync latest database state to localStorage to instantly unlock the Navbar if an Admin approved them in the background
            const currentData = JSON.parse(localStorage.getItem('cc_provider_data') || '{}');
            const updatedData = { ...currentData, ...profile };
            if (profile.subscriptionExpiry) {
                updatedData.subscriptionExpiry = profile.subscriptionExpiry;
            }
            localStorage.setItem('cc_provider_data', JSON.stringify(updatedData));
        } catch (err) {
            console.error("Failed to load subscription data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDummyPayment = async (planId) => {
        setPaymentProcessing(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            const res = await initiateSubscription(planId);
            if (res) {
                const currentData = JSON.parse(localStorage.getItem('cc_provider_data') || '{}');
                const pData = res.provider || res.data?.provider || res.data || res;
                const updatedData = { ...currentData, ...pData };
                // Ensure subscription expiry is parsed
                if (pData.subscriptionExpiry) {
                    updatedData.subscriptionExpiry = pData.subscriptionExpiry;
                }
                localStorage.setItem('cc_provider_data', JSON.stringify(updatedData));

                setShowCheckout(null);
                await loadData();
                showToast(`Payment Successful! TXN: ${res.transactionId}`, 'success');
            }
        } catch (err) {
            showToast("Payment failed. Please try again.", 'error');
        } finally {
            setPaymentProcessing(false);
        }
    };

    const daysRemaining = expiry ? Math.ceil((new Date(expiry) - new Date()) / (1000 * 60 * 60 * 24)) : 0;
    const progress = daysRemaining > 0 ? (daysRemaining / 30) * 100 : 0;

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#FBFCFE]"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="min-h-full bg-[#FBFCFE] pb-24">
            <style>{`
                @keyframes bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
                @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-5px); } }
                @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-bob { animation: bob 2.5s ease-in-out infinite; }
                .animate-float { animation: float 4s ease-in-out infinite; }
                .animate-slow-spin { animation: spin 3s linear infinite; }
                .shimmer-bg::after {
                    content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
                    animation: shimmer 3s infinite;
                }
            `}</style>

            <div className="sticky top-0 z-[60] bg-gradient-to-br from-[#1E3A8A] to-indigo-900 px-6 pt-8 pb-6 shadow-xl rounded-b-[32px]">
                <h1 className="text-2xl font-[1000] text-white tracking-tight m-0">Business Plans</h1>
                <p className="text-blue-200/60 text-[11px] font-bold uppercase tracking-widest mt-0.5">Upgrade your visibility</p>
            </div>

            <div className="space-y-6 pt-5">
                <div className="mx-3 relative bg-[#1E3A8A] overflow-hidden group rounded-[32px] shadow-2xl shadow-blue-900/20 active:scale-[0.98] transition-all">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-[#1E3A8A] to-indigo-900 group-hover:scale-105 transition-transform duration-1000" />
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-400/20 rounded-full blur-[80px]" />
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]" />

                    <div className="relative z-10 px-6 py-6 shimmer-bg">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/20 animate-float shadow-lg">
                                <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5ZM19 19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V18H19V19Z" />
                                </svg>
                            </div>
                            <div className={`flex items-center gap-1.5 px-2.5 py-1 ${approvalStatus === 'approved' && daysRemaining > 0 ? 'bg-green-500/10 border-green-500/30' : approvalStatus === 'pending' ? 'bg-amber-500/10 border-amber-500/30' : 'bg-red-500/10 border-red-500/30'} rounded-lg border`}>
                                <div className={`w-1.5 h-1.5 ${approvalStatus === 'approved' && daysRemaining > 0 ? 'bg-green-400' : approvalStatus === 'pending' ? 'bg-amber-400' : 'bg-red-400'} rounded-full animate-pulse`} />
                                <span className={`${approvalStatus === 'approved' && daysRemaining > 0 ? 'text-green-400' : approvalStatus === 'pending' ? 'text-amber-400' : 'text-red-400'} text-[9px] font-black uppercase tracking-widest leading-none`}>
                                    {approvalStatus === 'approved' && daysRemaining > 0 ? 'Active' : approvalStatus === 'pending' ? 'Awaiting Approval' : 'Plan Expired / Inactive'}
                                </span>
                            </div>
                        </div>

                        {daysRemaining <= 0 && approvalStatus !== 'pending' && (
                            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-xl animate-bounce">
                                <p className="text-white text-[10px] font-black uppercase tracking-widest text-center">⚠️ Access Restricted: Please Renew Plan</p>
                            </div>
                        )}

                        <div className="mb-6">
                            <h2 className="text-white text-2xl font-[1000] tracking-tight leading-tight mb-1">
                                {currentPlan ? currentPlan.name : 'Free Trial / Expired'}
                            </h2>
                            <p className="text-blue-200/40 text-[10px] font-bold uppercase tracking-[0.2em]">
                                {currentPlan ? `${currentPlan.searchPriority} Search Priority` : 'Upgrade to get leads'}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 mb-5">
                            <div>
                                <p className="text-blue-200/50 text-[9px] font-black uppercase tracking-widest mb-1">Status</p>
                                <p className="text-white text-base font-[1000]">{approvalStatus === 'approved' ? 'Verified' : approvalStatus === 'pending' ? 'Pending' : 'Unpaid'}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-blue-200/50 text-[9px] font-black uppercase tracking-widest mb-1">Valid Until</p>
                                <p className="text-white text-base font-[1000]">
                                    {expiry ? new Date(expiry).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase() : 'N/A'}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-[10px] font-black text-white/50 uppercase tracking-widest">
                                <span>Cycle Progress</span>
                                <span className={daysRemaining < 5 ? 'text-red-400' : 'text-green-400'}>
                                    {approvalStatus === 'approved' ? `${daysRemaining} Days Remaining` : approvalStatus === 'pending' ? 'Awaiting Activation' : 'Expired'}
                                </span>
                            </div>
                            <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${approvalStatus === 'approved' ? (daysRemaining < 5 ? 'bg-red-500' : 'bg-green-500') : 'bg-slate-500/30'}`} style={{ width: approvalStatus === 'approved' ? `${Math.min(100, progress)}%` : '0%' }} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 space-y-6 flex-1 overflow-y-auto">
                    <div>
                        <h3 className="text-slate-900 font-black text-[15px] uppercase tracking-[0.2em] opacity-80 pl-1">Available Upgrades</h3>
                    </div>

                    {plans.map((plan, idx) => (
                        <div
                            key={plan._id}
                            className={`bg-white border-2 rounded-[32px] p-6 transition-all duration-500 relative group active:scale-[0.98]
                            ${plan.searchPriority === 'High' ? 'border-[#1E3A8A] shadow-xl shadow-blue-900/10' : 'border-slate-100/80'}`}
                        >
                             {plan.searchPriority === 'High' && (
                                <div className="absolute -top-3 right-6 bg-[#1E3A8A] text-white text-[9px] font-black px-4 py-1.5 rounded-full shadow-lg uppercase tracking-widest z-10">
                                    Top Choice
                                </div>
                            )}

                            <div className="flex items-center justify-between mb-6">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.searchPriority === 'High' ? 'from-slate-900 to-slate-800' : 'from-blue-500 to-indigo-600'} flex items-center justify-center shadow-xl`}>
                                    <svg className="w-7 h-7 text-white animate-bob" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-baseline justify-end gap-1">
                                        <span className="text-3xl font-[1000] text-slate-900 tracking-tighter">₹{plan.price}</span>
                                    </div>
                                    <p className="text-[#1E3A8A] text-[11px] font-black uppercase tracking-widest mt-1 bg-blue-50 px-2 py-0.5 rounded-md inline-block">{plan.durationDays} Days</p>
                                </div>
                            </div>

                            <h4 className="text-slate-900 font-[1000] text-xl mb-5 tracking-tight">{plan.name}</h4>

                            <div className="space-y-4 mb-8">
                                {plan.features.map((f, i) => (
                                    <div key={i} className="flex items-center gap-3.5 group/item">
                                        <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0">
                                            <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <span className="text-[14px] text-slate-600 font-bold tracking-tight">{f}</span>
                                    </div>
                                ))}
                            </div>

                            <button 
                                onClick={() => setShowCheckout(plan)}
                                disabled={approvalStatus === 'pending'}
                                className={`w-full py-4 rounded-xl text-[13px] font-black transition-all active:scale-95 uppercase tracking-[0.2em] shadow-lg disabled:opacity-50
                                ${plan.searchPriority === 'High' ? 'bg-[#1E3A8A] text-white' : 'bg-slate-900 text-white'}`}>
                                {approvalStatus === 'pending' ? 'Awaiting Activation' : `Upgrade To ${plan.name}`}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {showCheckout && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
                    <div className="w-full max-w-md bg-white rounded-t-[40px] sm:rounded-[40px] shadow-2xl overflow-hidden">
                        <div className="p-8">
                            <h3 className="text-2xl font-[1000] text-slate-900 tracking-tight">Secured Checkout</h3>
                            <div className="bg-slate-50 rounded-2xl p-6 my-6 border border-slate-100 flex justify-between items-center">
                                <span className="text-slate-500 font-bold text-sm">Total Payable</span>
                                <span className="text-indigo-600 font-[1000] text-2xl">₹{showCheckout.price}</span>
                            </div>
                            <div className="space-y-3">
                                <button onClick={() => handleDummyPayment(showCheckout._id)} disabled={paymentProcessing} className="w-full py-5 bg-[#1E3A8A] text-white rounded-[22px] font-black uppercase tracking-[0.2em] shadow-xl disabled:opacity-50">
                                    {paymentProcessing ? 'Processing Transaction...' : 'Pay with UPI'}
                                </button>
                                <button onClick={() => setShowCheckout(null)} className="w-full py-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">Cancel Payment</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProviderSubscription;
