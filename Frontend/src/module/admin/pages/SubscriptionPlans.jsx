import React, { useState, useEffect } from 'react';
import { getPlans, createPlan, updatePlan, deletePlan, getAllProviders } from '../../../api/adminApi';

// Style mapping for premium plan accents
const planStyles = {
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', accent: 'bg-emerald-500' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', accent: 'bg-blue-500' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100', accent: 'bg-indigo-500' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', accent: 'bg-amber-500' },
};

// Dummy data replaced by backend integration

const SubscriptionPlans = () => {
    const [plans, setPlans] = useState([]);
    const [subscribers, setSubscribers] = useState([]);
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({ name: '', price: '', durationDays: 30, tag: 'Monthly', features: '', color: 'emerald' });

    const fetchData = async () => {
        try {
            const [plansData, providersData] = await Promise.all([
                getPlans(),
                getAllProviders()
            ]);
            
            // Map subscribers
            const activeSubs = providersData
                .filter(p => p.subscriptionId)
                .map(p => {
                    const matchedPlan = plansData.find(pl => pl._id === p.subscriptionId);
                    return {
                        id: p._id,
                        provider: p.fullName,
                        plan: matchedPlan ? matchedPlan.name : 'Unknown',
                        endDate: p.subscriptionExpiry || new Date(),
                        status: p.subscriptionExpiry && new Date(p.subscriptionExpiry) > new Date() ? 'Active' : 'Expired',
                        revenue: `₹${matchedPlan ? matchedPlan.price : 0}`
                    };
                });
                
            // Update plan subscribers count
            const mappedPlans = plansData.map(plan => {
                const subCount = providersData.filter(p => p.subscriptionId === plan._id).length;
                return { ...plan, subscribers: subCount };
            });

            setPlans(mappedPlans);
            setSubscribers(activeSubs);
        } catch (err) {
            console.error("Fetch plans error:", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Calculates days remaining with current date (Simulated)
    const getDaysRemaining = (endDate) => {
        const end = new Date(endDate);
        const diff = end - new Date('2026-03-05');
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days > 0 ? days : 0;
    };

    const handleOpenEdit = (plan) => {
        setEditingPlan(plan);
        setFormData({
            name: plan.name,
            price: plan.price,
            durationDays: plan.durationDays || plan.duration || 30,
            tag: plan.tag || 'Monthly',
            color: plan.color || 'emerald',
            features: plan.features.join(', ')
        });
        setIsPlanModalOpen(true);
    };

    const handleSavePlan = async (e) => {
        e.preventDefault();

        // Validation: Positive values only
        if (formData.price <= 0 || formData.durationDays <= 0) {
            alert("Price and Duration must be positive numbers.");
            return;
        }

        const payload = {
            name: formData.name,
            price: Number(formData.price),
            durationDays: Number(formData.durationDays),
            tag: formData.tag,
            color: formData.color,
            features: formData.features.split(',').map(f => f.trim())
        };

        try {
            if (editingPlan) {
                await updatePlan(editingPlan._id, payload);
            } else {
                await createPlan(payload);
            }
            fetchData();
            setIsPlanModalOpen(false);
        } catch (err) {
            alert("Failed to save plan.");
        }
    };

    const togglePlanStatus = async (id, currentStatus) => {
        try {
            await updatePlan(id, { isActive: !currentStatus });
            fetchData();
        } catch (err) {
            alert("Failed to update status");
        }
    };

    const handleDeletePlan = async (id) => {
        if (!window.confirm("Are you sure you want to delete this plan?")) return;
        try {
            await deletePlan(id);
            fetchData();
        } catch (err) {
            alert("Failed to delete plan");
        }
    };

    const filteredSubscribers = subscribers.filter(s =>
        s.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.plan.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">
            {/* ── Page Header ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-slate-900 text-3xl font-[1000] tracking-tighter mb-1">Business Subscriptions</h1>
                    <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest">Pricing Control & Revenue Oversight</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => { setEditingPlan(null); setFormData({ name: '', price: '', durationDays: 30, tag: 'Monthly', features: '', color: 'emerald' }); setIsPlanModalOpen(true); }}
                        className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-[12px] shadow-lg shadow-emerald-500/30 active:scale-95 transition-all outline-none"
                    >
                        Create New Offering
                    </button>
                </div>
            </div>

            {/* ── Metrics Grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                    { label: 'Active Subs', value: plans.reduce((acc, p) => acc + p.subscribers, 0), icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', color: planStyles.emerald },
                    { label: 'Expiring (7D)', value: subscribers.filter(s => {
                        const days = Math.ceil((new Date(s.endDate) - new Date()) / (1000 * 60 * 60 * 24));
                        return days > 0 && days <= 7;
                    }).length, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: planStyles.amber },
                    { label: 'Growth Rate', value: `+${subscribers.length}`, icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', color: planStyles.emerald },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4 group">
                        <div className={`w-12 h-12 rounded-xl ${stat.color.bg} flex items-center justify-center shrink-0`}>
                            <svg className={`w-6 h-6 ${stat.color.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={stat.icon} /></svg>
                        </div>
                        <div>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-0.5">{stat.label}</p>
                            <p className="text-slate-800 text-2xl font-black tracking-tighter">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Plan Catalog ── */}
            <div className="mb-12">
                <div className="flex items-center gap-2 mb-6 ml-1">
                    <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                    <h2 className="text-slate-900 font-extrabold text-xl tracking-tight">Active Plan Configurations</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map((plan) => {
                        const style = planStyles[plan.color] || planStyles.emerald;
                        const isInactive = plan.status === 'Inactive';

                        return (
                            <div key={plan._id} className={`bg-white border-2 rounded-[32px] p-8 relative overflow-hidden group hover:shadow-2xl transition-all duration-500 ${isInactive ? 'opacity-60 grayscale-[0.5] border-slate-100' : `${style.border} border-opacity-50`}`}>
                                {/* Decorative BG */}
                                <div className={`absolute top-0 right-0 w-32 h-32 ${style.accent} opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700`} />

                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex gap-2">
                                        <span className={`px-3 py-1 ${style.bg} ${style.text} text-[9px] font-black uppercase tracking-widest rounded-md border ${style.border}`}>
                                            {plan.tag}
                                        </span>
                                        {isInactive && <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest rounded-md border border-slate-200">Deactivated</span>}
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => togglePlanStatus(plan._id, plan.isActive)} className={`p-2 rounded-lg transition-colors ${isInactive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`} title={isInactive ? "Activate Plan" : "Deactivate Plan"}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={isInactive ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" : "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"} /></svg>
                                        </button>
                                        <button onClick={() => handleOpenEdit(plan)} className="p-2 bg-slate-50 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-lg transition-colors" title="Edit Plan">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        </button>
                                        <button onClick={() => handleDeletePlan(plan._id)} className="p-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors" title="Delete Plan">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <h3 className="text-slate-800 font-[1000] text-2xl tracking-tighter mb-2">{plan.name}</h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className={`text-3xl font-black ${isInactive ? 'text-slate-400' : 'text-slate-900'}`}>₹{plan.price}</span>
                                        <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">/ {plan.durationDays} Days</span>
                                    </div>
                                </div>

                                <div className="space-y-3.5 mb-8">
                                    {plan.features.slice(0, 3).map((f, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-full ${style.bg} flex items-center justify-center border ${style.border} shrink-0`}>
                                                <svg className={`w-3 h-3 ${style.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <span className="text-[13px] text-slate-600 font-bold leading-tight">{f}</span>
                                        </div>
                                    ))}
                                    {plan.features.length > 3 && <p className="text-[11px] text-slate-400 font-bold pl-8">+ {plan.features.length - 3} more luxury perks</p>}
                                </div>

                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── Subscriber Inventory ── */}
            <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm">
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/20">
                    <div>
                        <h2 className="text-slate-900 font-[1000] text-2xl tracking-tighter">Plan Integrity Search</h2>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Audit individual provider subscription health</p>
                    </div>
                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Find provider, plan or status..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-[13px] font-bold text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
                        />
                        <svg className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {filteredSubscribers.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white border-b border-slate-50">
                                    <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Service Provider</th>
                                    <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Plan</th>
                                    <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Renewal Date</th>
                                    <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Validity Left</th>
                                    <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">System Status</th>
                                    <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Revenue Contrib.</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredSubscribers.map((sub) => {
                                    const days = getDaysRemaining(sub.endDate);
                                    let barColor = 'bg-emerald-500';
                                    if (days < 7) barColor = 'bg-red-500 animate-pulse';
                                    else if (days < 15) barColor = 'bg-amber-400';

                                    return (
                                        <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="py-5 px-8 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-500 text-xs border border-slate-200 uppercase ring-4 ring-white shadow-sm">
                                                        {sub.provider.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <p className="text-sm font-black text-slate-800">{sub.provider}</p>
                                                </div>
                                            </td>
                                            <td className="py-5 px-6">
                                                <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-md">{sub.plan}</span>
                                            </td>
                                            <td className="py-5 px-6">
                                                <p className="text-sm font-black text-slate-700">{new Date(sub.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                            </td>
                                            <td className="py-5 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden shrink-0">
                                                        <div
                                                            className={`h-full rounded-full transition-all duration-1000 ${barColor}`}
                                                            style={{ width: `${Math.min(100, (days / 30) * 100)}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-[11px] font-black text-slate-800 tabular-nums">{days} Days</span>
                                                </div>
                                            </td>
                                            <td className="py-5 px-6">
                                                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${sub.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                                    {sub.status}
                                                </span>
                                            </td>
                                            <td className="py-5 px-8 text-right">
                                                <p className="text-sm font-black text-slate-800 tabular-nums">{sub.revenue}</p>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <div className="py-24 flex flex-col items-center justify-center text-center px-10">
                            <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center text-4xl mb-4 shadow-inner border border-slate-100">🚫</div>
                            <h3 className="text-slate-900 font-black text-lg">No Matching Records</h3>
                            <p className="text-slate-400 text-sm font-bold mt-2 max-w-sm">We couldn't find any provider or plan matching "{searchTerm}". Please check your search parameters.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Configuration Modal ── */}
            {isPlanModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsPlanModalOpen(false)} />
                    <div className="relative bg-white rounded-[32px] w-full max-w-xl shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
                        {/* Modal Progress/Accent Line */}
                        <div className={`h-1.5 shrink-0 bg-gradient-to-r ${planStyles[formData.color].accent.replace('bg-', 'from-').replace('500', '400')} to-indigo-600 rounded-t-[32px]`} />

                        {/* Header */}
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between shrink-0">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{editingPlan ? 'Refine Package' : 'New Market Offering'}</h2>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Subscription Engineering Parameters</p>
                            </div>
                            <button onClick={() => setIsPlanModalOpen(false)} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            <form id="planForm" onSubmit={handleSavePlan} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 px-1">Offering Identity</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-50 rounded-xl text-[13px] font-bold text-slate-800 placeholder:text-slate-300 focus:border-emerald-500 focus:bg-white outline-none transition-all"
                                        placeholder="e.g. Pro Construction Annual"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 px-1">Unit Pricing (₹)</label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-50 rounded-xl text-[13px] font-bold text-slate-800 focus:border-emerald-500 focus:bg-white outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 px-1">Identity Color</label>
                                        <div className="flex gap-2 pt-1">
                                            {['emerald', 'blue', 'indigo', 'amber'].map(color => (
                                                <button
                                                    key={color}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, color })}
                                                    className={`w-8 h-8 rounded-full border-2 transition-all ${formData.color === color ? 'border-slate-800 scale-110 shadow-md' : 'border-transparent hover:scale-105'} ${planStyles[color].accent}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 px-1">Validity (Days)</label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.durationDays}
                                            onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
                                            className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-50 rounded-xl text-[13px] font-bold text-slate-800 focus:border-emerald-500 focus:outline-none focus:bg-white transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 px-1">Cycle Tag</label>
                                        <select
                                            value={formData.tag}
                                            onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                                            className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-50 rounded-xl text-[13px] font-bold text-slate-800 focus:border-emerald-500 focus:bg-white outline-none transition-all cursor-pointer"
                                        >
                                            <option value="Monthly">Monthly Cycle</option>
                                            <option value="Quarterly">Quarterly Cycle</option>
                                            <option value="Yearly">Annual Cycle</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 px-1">Feature Sets (Comma Separated)</label>
                                    <textarea
                                        value={formData.features}
                                        onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                        className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-[13px] font-bold text-slate-800 min-h-[120px] focus:border-emerald-500 focus:bg-white outline-none transition-all resize-none"
                                        placeholder="e.g. Premium ID, Verification Badge, Priority Leads..."
                                    />
                                </div>
                            </form>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 border-t border-slate-50 bg-slate-50/30 flex items-center justify-end gap-4 shrink-0 px-8">
                            <button
                                type="button"
                                onClick={() => setIsPlanModalOpen(false)}
                                className="px-6 py-2.5 text-slate-400 hover:text-slate-600 text-[11px] font-black uppercase tracking-widest transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="planForm"
                                className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all outline-none"
                            >
                                {editingPlan ? 'Update Plan' : 'Create Entry'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubscriptionPlans;
