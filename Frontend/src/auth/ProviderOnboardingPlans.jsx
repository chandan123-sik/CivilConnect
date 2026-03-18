import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPlans } from '../api/publicApi';
import { initiateSubscription, verifyPayment } from '../api/providerApi';
import { showToast } from '../components/Toast';

const ProviderOnboardingPlans = () => {
    const navigate = useNavigate();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCheckout, setShowCheckout] = useState(null);
    const [paymentProcessing, setPaymentProcessing] = useState(false);

    useEffect(() => {
        const loadPlans = async () => {
            try {
                const data = await getPlans();
                const activePlans = data.filter(p => p.isActive !== false);
                setPlans(activePlans);
            } catch (err) {
                console.error("Failed to load plans:", err);
            } finally {
                setLoading(false);
            }
        };
        loadPlans();
    }, []);

    const handleDummyPayment = async (planId) => {
        setPaymentProcessing(true);
        try {
            // 1. Initiate (Create Order)
            const orderRes = await initiateSubscription(planId);
            if (!orderRes || !orderRes.orderId) {
                console.error("Order initiation failed", orderRes);
                throw new Error(orderRes?.message || "Failed to initiate payment. Please try again.");
            }
            
            // 2. Since this is dummy onboarding, simulate verification
            const verifyRes = await verifyPayment({
                razorpay_order_id: orderRes.orderId,
                razorpay_payment_id: 'dummy_pay_' + Date.now(),
                razorpay_signature: 'dummy_sig_onboarding',
                planId: planId,
                isDummy: true 
            });

            if (verifyRes) {
                // The backend now returns the updated provider in 'provider' field
                const updatedProvider = verifyRes.provider || verifyRes;
                
                // Keep everything in sync
                const currentData = JSON.parse(localStorage.getItem('cc_provider_data') || '{}');
                const finalData = { ...currentData, ...updatedProvider };
                
                // IMPORTANT: Ensure isSubscriptionActive is true for the UI
                finalData.isSubscriptionActive = true; 
                
                localStorage.setItem('cc_provider_data', JSON.stringify(finalData));
                
                showToast(`Onboarding Successful! Welcome ${finalData.fullName || ''}`, 'success');
                navigate('/serviceprovider/home');
            }
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.message || err.message || "Payment failed. Please try again.";
            showToast(errorMsg, 'error');
        } finally {
            setPaymentProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FBFCFE] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FBFCFE] pb-12">
            <style>{`
                @keyframes bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-bob { animation: bob 2.5s ease-in-out infinite; }
                .animate-slow-spin { animation: spin 3s linear infinite; }
            `}</style>

            <div className="bg-gradient-to-br from-[#1E3A8A] to-indigo-900 px-8 pt-16 pb-12 rounded-b-[40px] shadow-2xl relative overflow-hidden text-center">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <h1 className="text-3xl font-[1000] text-white tracking-tight leading-tight mb-2">Final Step!</h1>
                <p className="text-blue-200/60 text-[11px] font-black uppercase tracking-[0.2em]">Select a plan to start receiving leads</p>
            </div>

            <div className="px-6 -mt-8 space-y-6">
                {plans.map((plan, idx) => (
                    <div
                        key={plan._id}
                        className={`bg-white border-2 rounded-[32px] p-6 transition-all duration-300 relative group active:scale-[0.98]
                        ${plan.searchPriority === 'High' ? 'border-[#1E3A8A] shadow-2xl shadow-blue-900/10' : 'border-slate-100'}`}
                    >
                        {plan.searchPriority === 'High' && (
                            <div className="absolute -top-3 right-8 bg-[#1E3A8A] text-white text-[9px] font-black px-4 py-1.5 rounded-full shadow-lg uppercase tracking-widest z-10">
                                Best Value
                            </div>
                        )}

                        <div className="flex items-center justify-between mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-[#1E3A8A] flex items-center justify-center shadow-xl">
                                <svg className="w-7 h-7 text-white animate-bob" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <div className="text-right">
                                <div className="flex items-baseline justify-end gap-1">
                                    <span className="text-3xl font-[1000] text-slate-900 tracking-tighter">₹{plan.price}</span>
                                </div>
                                <p className="text-[#1E3A8A] text-[10px] font-black uppercase tracking-widest mt-1 bg-blue-50 px-2 py-0.5 rounded-md inline-block">{plan.durationDays} Days</p>
                            </div>
                        </div>

                        <h4 className="text-slate-900 font-[1000] text-xl mb-5 tracking-tight">{plan.name}</h4>

                        <div className="space-y-4 mb-8">
                            {plan.features.map((f, i) => (
                                <div key={i} className="flex items-center gap-3.5 group/item">
                                    <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0">
                                        <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <span className="text-[13px] text-slate-600 font-bold tracking-tight">{f}</span>
                                </div>
                            ))}
                        </div>

                        <button onClick={() => setShowCheckout(plan)} className="w-full py-5 rounded-[22px] text-xs font-[1000] uppercase tracking-[0.3em] shadow-xl bg-slate-900 text-white">
                            Activate Plan
                        </button>
                    </div>
                ))}
            </div>

            {showCheckout && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
                    <div className="w-full max-w-md bg-white rounded-t-[40px] sm:rounded-[40px] shadow-2xl overflow-hidden">
                        <div className="p-8">
                            <h3 className="text-2xl font-[1000] text-slate-900 tracking-tight">Onboarding Pay</h3>
                            <div className="bg-slate-50 rounded-2xl p-6 my-6 border border-slate-100 flex justify-between items-center">
                                <span className="text-slate-500 font-bold text-sm">Amount Due</span>
                                <span className="text-indigo-600 font-[1000] text-2xl">₹{showCheckout.price}</span>
                            </div>
                            <button onClick={() => handleDummyPayment(showCheckout._id)} disabled={paymentProcessing} className="w-full py-5 bg-[#1E3A8A] text-white rounded-[22px] font-black uppercase tracking-[0.2em] shadow-xl disabled:opacity-50">
                                {paymentProcessing ? 'Processing...' : 'Pay with UPI'}
                            </button>
                            <button onClick={() => setShowCheckout(null)} className="w-full mt-4 text-slate-400 font-bold text-xs uppercase">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProviderOnboardingPlans;
