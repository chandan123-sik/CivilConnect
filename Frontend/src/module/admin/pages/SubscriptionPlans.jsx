import React, { useState } from 'react';

// Style mapping for premium plan accents
const planStyles = {
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', accent: 'bg-emerald-500' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', accent: 'bg-blue-500' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100', accent: 'bg-indigo-500' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', accent: 'bg-amber-500' },
};

const initialPlans = [
    { id: 'p-001', name: 'Standard Monthly', price: 499, duration: 30, tag: 'Monthly', features: ['Public Profile Listing', 'Search Priority: Low', 'Basic Leads Access'], status: 'Active', subscribers: 125, color: 'emerald' },
    { id: 'p-002', name: 'Quarterly Pro', price: 1299, duration: 90, tag: 'Quarterly', features: ['Public Profile Listing', 'Search Priority: Medium', 'Priority Support', 'Advanced Analytics'], status: 'Active', subscribers: 84, color: 'blue' },
    { id: 'p-003', name: 'Annual Elite', price: 4499, duration: 365, tag: 'Yearly', features: ['Public Profile Listing', 'Search Priority: High', 'Portfolio Management', 'Verified Badge', '24/7 Support'], status: 'Active', subscribers: 42, color: 'indigo' },
];

const initialSubscribers = [
    { id: 'sub-1', provider: 'Rajesh Kumar', plan: 'Annual Elite', startDate: '2025-05-10', endDate: '2026-05-09', status: 'Active', revenue: '₹4,499' },
    { id: 'sub-2', provider: 'Amit Sharma', plan: 'Quarterly Pro', startDate: '2026-01-01', endDate: '2026-03-31', status: 'Expiring Soon', revenue: '₹1,299' },
    { id: 'sub-3', provider: 'Anjali Mehta', plan: 'Standard Monthly', startDate: '2026-02-15', endDate: '2026-03-14', status: 'Active', revenue: '₹499' },
    { id: 'sub-4', provider: 'Suresh Patil', plan: 'Annual Elite', startDate: '2025-08-20', endDate: '2026-08-19', status: 'Active', revenue: '₹4,499' },
    { id: 'sub-5', provider: 'Vikram Singh', plan: 'Quarterly Pro', startDate: '2025-12-10', endDate: '2026-03-09', status: 'Expiring Soon', revenue: '₹1,299' },
];

const SubscriptionPlans = () => {
    const [plans, setPlans] = useState(initialPlans);
    const [subscribers, setSubscribers] = useState(initialSubscribers);
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({ name: '', price: '', duration: 30, tag: 'Monthly', features: '', color: 'emerald' });

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
            duration: plan.duration,
            tag: plan.tag,
            color: plan.color,
            features: plan.features.join(', ')
        });
        setIsPlanModalOpen(true);
    };

    const handleSavePlan = (e) => {
        e.preventDefault();

        // Validation: Positive values only
        if (formData.price <= 0 || formData.duration <= 0) {
            alert("Price and Duration must be positive numbers.");
            return;
        }

        const updatedPlan = {
            ...editingPlan,
            name: formData.name,
            price: Number(formData.price),
            duration: Number(formData.duration),
            tag: formData.tag,
            color: formData.color,
            features: formData.features.split(',').map(f => f.trim())
        };

        if (editingPlan) {
            setPlans(plans.map(p => p.id === editingPlan.id ? updatedPlan : p));
        } else {
            setPlans([...plans, { ...updatedPlan, id: `p-00${plans.length + 1}`, status: 'Active', subscribers: 0 }]);
        }
        setIsPlanModalOpen(false);
    };

    const togglePlanStatus = (id) => {
        setPlans(plans.map(p => p.id === id ? { ...p, status: p.status === 'Active' ? 'Inactive' : 'Active' } : p));
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
                        onClick={() => { setEditingPlan(null); setFormData({ name: '', price: '', duration: 30, tag: 'Monthly', features: '', color: 'emerald' }); setIsPlanModalOpen(true); }}
                        className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-[12px] shadow-lg shadow-emerald-500/30 active:scale-95 transition-all outline-none"
                    >
                        Create New Offering
                    </button>
                </div>
            </div>

            {/* ── Metrics Grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Active Subs', value: plans.reduce((acc, p) => acc + p.subscribers, 0), icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', color: planStyles.emerald },
                    { label: 'Annual Revenue', value: '₹12.4L', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: planStyles.indigo },
                    { label: 'Expiring (7D)', value: 12, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: planStyles.amber },
                    { label: 'Growth Rate', value: '+14.5%', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', color: planStyles.emerald },
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
                            <div key={plan.id} className={`bg-white border-2 rounded-[32px] p-8 relative overflow-hidden group hover:shadow-2xl transition-all duration-500 ${isInactive ? 'opacity-60 grayscale-[0.5] border-slate-100' : `${style.border} border-opacity-50`}`}>
                                {/* Decorative BG */}
                                <div className={`absolute top-0 right-0 w-32 h-32 ${style.accent} opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700`} />

                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex gap-2">
                                        <span className={`px-3 py-1 ${style.bg} ${style.text} text-[9px] font-black uppercase tracking-widest rounded-md border ${style.border}`}>
                                            {plan.tag}
                                        </span>
                                        {isInactive && <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest rounded-md border border-slate-200">Deactivated</span>}
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => togglePlanStatus(plan.id)} className={`p-2 rounded-lg transition-colors ${isInactive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`} title={isInactive ? "Activate Plan" : "Deactivate Plan"}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={isInactive ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" : "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"} /></svg>
                                        </button>
                                        <button onClick={() => handleOpenEdit(plan)} className="p-2 bg-slate-50 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-lg transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <h3 className="text-slate-800 font-[1000] text-2xl tracking-tighter mb-2">{plan.name}</h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className={`text-3xl font-black ${isInactive ? 'text-slate-400' : 'text-slate-900'}`}>₹{plan.price}</span>
                                        <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">/ {plan.duration} Days</span>
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

                                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Active Seats</p>
                                        <p className="text-slate-800 font-black text-lg">{plan.subscribers}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Revenue Forecast</p>
                                        <p className={`${style.text} font-black text-lg`}>₹{Math.floor((plan.subscribers * plan.price) / 1000)}k</p>
                                    </div>
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
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsPlanModalOpen(false)} />
                    <div className="relative bg-white rounded-[48px] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Modal Progress/Accent Line */}
                        <div className={`h-2 bg-gradient-to-r ${planStyles[formData.color].accent.replace('bg-', 'from-').replace('500', '400')} to-indigo-600`} />

                        <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-[1000] text-slate-900 tracking-tighter">{editingPlan ? 'Refine Package' : 'New Market Offering'}</h2>
                                <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Subscription Engineering Parameters</p>
                            </div>
                            <button onClick={() => setIsPlanModalOpen(false)} className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <form onSubmit={handleSavePlan} className="p-10 space-y-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Offering Identity</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-5 py-4.5 bg-slate-50 border-2 border-slate-50 rounded-2xl text-[14px] font-bold text-slate-800 placeholder:text-slate-300 focus:border-emerald-500 focus:bg-white outline-none transition-all shadow-inner"
                                        placeholder="e.g. Pro Construction Annual"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Unit Pricing (₹)</label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full px-5 py-4.5 bg-slate-50 border-2 border-slate-50 rounded-2xl text-[14px] font-bold text-slate-800 focus:border-emerald-500 focus:bg-white outline-none transition-all shadow-inner"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Identity Color</label>
                                        <div className="flex gap-2.5 pt-1.5">
                                            {['emerald', 'blue', 'indigo', 'amber'].map(color => (
                                                <button
                                                    key={color}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, color })}
                                                    className={`w-10 h-10 rounded-full border-4 transition-all ${formData.color === color ? 'border-slate-800 scale-110 shadow-lg' : 'border-transparent hover:scale-105'} ${planStyles[color].accent}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Validity (Days)</label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.duration}
                                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                            className="w-full px-5 py-4.5 bg-slate-50 border-2 border-slate-50 rounded-2xl text-[14px] font-bold text-slate-800 focus:border-emerald-500 focus:outline-none focus:bg-white transition-all shadow-inner"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Cycle Tag</label>
                                        <select
                                            value={formData.tag}
                                            onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                                            className="w-full px-5 py-4.5 bg-slate-50 border-2 border-slate-50 rounded-2xl text-[14px] font-bold text-slate-800 focus:border-emerald-500 focus:bg-white outline-none transition-all shadow-inner cursor-pointer"
                                        >
                                            <option value="Monthly">Monthly Cycle</option>
                                            <option value="Quarterly">Quarterly Cycle</option>
                                            <option value="Yearly">Annual Cycle</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Feature Sets (Comma Separated)</label>
                                    <textarea
                                        value={formData.features}
                                        onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                        className="w-full px-5 py-5 bg-slate-50 border-2 border-slate-50 rounded-[32px] text-[14px] font-bold text-slate-800 min-h-[140px] focus:border-emerald-500 focus:bg-white outline-none transition-all resize-none shadow-inner"
                                        placeholder="e.g. Premium ID, Verification Badge, Priority Leads..."
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-[24px] font-black text-[13px] uppercase tracking-[0.3em] shadow-2xl shadow-slate-900/30 hover:shadow-emerald-500/20 active:scale-[0.98] transition-all mt-4"
                            >
                                {editingPlan ? 'Confirm Package Refinement' : 'Deploy Offering To Market'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubscriptionPlans;
