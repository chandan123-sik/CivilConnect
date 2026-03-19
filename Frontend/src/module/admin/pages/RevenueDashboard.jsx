import React, { useState, useEffect } from 'react';
import { getRevenueDashboard } from '../../../api/adminApi';
import { IndianRupee, TrendingUp, Trophy, Star } from 'lucide-react';

const RevenueDashboard = () => {
    const [filter, setFilter] = useState('month');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const fetchRevenue = async () => {
        setLoading(true);
        try {
            const res = await getRevenueDashboard(filter);
            setData(res.data || res);
        } catch (err) {
            console.error("Revenue fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRevenue();
    }, [filter]);

    if (loading && !data) return <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">Analyzing Financials...</div>;

    const stats = [
        { label: 'Total Revenue', value: `₹${data?.totalRevenue?.toLocaleString() || 0}`, sub: 'Successful Payments', icon: <IndianRupee size={22} color="#047857" strokeWidth={3} />, color: 'bg-emerald-50 text-emerald-600' },
        { label: 'Transactions', value: data?.totalTransactions || 0, sub: 'Volume of sales', icon: <TrendingUp size={22} color="#2563EB" />, color: 'bg-blue-50 text-blue-600' },
        { label: 'Best Plan', value: data?.planBreakdown[0]?.planName || 'N/A', sub: 'Top selling offering', icon: <Trophy size={22} color="#D97706" />, color: 'bg-amber-50 text-amber-600' },
        { label: 'Top Contributor', value: data?.topProvider?.fullName === 'N/A' || !data?.topProvider?.fullName ? 'N/A' : data.topProvider.fullName.slice(0, 15), sub: 'Highest spend provider', icon: <Star size={22} color="#4F46E5" />, color: 'bg-indigo-50 text-indigo-600' },
    ];

    return (
        <div className="max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-slate-900 text-4xl font-[1000] tracking-tighter mb-1">Revenue Dashboard</h1>
                    <p className="text-slate-500 text-sm font-medium">Financial overview and subscription performance analytics.</p>
                </div>
                {/* Filter Tabs */}
                <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
                    {['day', 'week', 'month'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-white text-emerald-600 shadow-md ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {f === 'day' ? 'Today' : f === 'week' ? 'This Week' : 'This Month'}
                        </button>
                    ))}
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((s, i) => (
                    <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500">
                        <div className={`w-12 h-12 rounded-2xl ${s.color} flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform`}>
                            {s.icon}
                        </div>
                        <p className="text-slate-800 text-2xl font-black tracking-tighter mb-1">{s.value}</p>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{s.label}</p>
                        <p className="text-[9px] text-slate-300 font-bold mt-2 italic">{s.sub}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Plan Performance */}
                <div className="lg:col-span-1 bg-white rounded-[40px] border border-slate-100 shadow-sm flex flex-col h-[500px] overflow-hidden">
                    <div className="p-8 pb-4 bg-white sticky top-0 z-10 border-b border-slate-50">
                        <h3 className="text-slate-900 font-black text-lg tracking-tight mb-1">Plan Performance</h3>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Revenue share by subscription type</p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-8 pt-6 space-y-8 custom-scrollbar">
                        {data?.planBreakdown && data.planBreakdown.length > 0 ? data.planBreakdown.map((p, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-center mb-2.5">
                                    <span className="text-slate-800 font-extrabold text-sm tracking-tight">{p.planName}</span>
                                    <span className="text-emerald-600 text-[11px] font-black">₹{p.revenue.toLocaleString()}</span>
                                </div>
                                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden p-0.5 border border-slate-100">
                                    <div 
                                        style={{ width: `${p.percentage}%` }}
                                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000"
                                    />
                                </div>
                                <div className="flex justify-between mt-2 px-1">
                                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{p.count} Subs</span>
                                    <span className="text-slate-300 text-[10px] font-black uppercase tracking-widest">{p.percentage}% Share</span>
                                </div>
                            </div>
                        )) : (
                            <div className="py-20 text-center text-slate-300 text-xs italic">No data for this period</div>
                        )}
                    </div>
                </div>

                {/* Revenue Chart (Pure CSS/SVG) */}
                <div className="lg:col-span-2 bg-[#0F172A] p-8 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col group">
                    <div className="absolute -top-20 -right-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]" />
                    <h3 className="text-white font-[1000] text-xl tracking-tight mb-1 relative z-10">Revenue Frequency</h3>
                    <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-10 relative z-10">Financial trend analysis</p>
                    
                    <div className="flex-1 overflow-x-auto custom-scrollbar pb-6 relative z-10">
                        <div className="flex items-end justify-between gap-3 min-w-[600px] h-[300px] px-2">
                        {data?.revenueTimeline && data.revenueTimeline.map((d, i) => {
                            const maxRev = Math.max(...data.revenueTimeline.map(t => t.revenue), 100);
                            const height = (d.revenue / maxRev) * 100;
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center group/bar">
                                    <div className="relative w-full flex justify-center items-end h-[240px]">
                                        <div 
                                            style={{ height: `${Math.max(2, height)}%` }}
                                            className="w-full max-w-[12px] bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-full transition-all duration-1000 hover:from-white hover:to-white group-hover/bar:scale-x-125"
                                        />
                                        <div className="absolute -top-8 bg-white text-slate-900 px-2 py-1 rounded-md text-[9px] font-black opacity-0 group-hover/bar:opacity-100 transition-opacity shadow-lg whitespace-nowrap">
                                            ₹{d.revenue}
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-white font-black uppercase mt-4 rotate-45 whitespace-nowrap group-hover/bar:text-emerald-400 transition-colors">{d.date.split('-').slice(1).join('/')}</span>
                                </div>
                            );
                        })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Transactions Table */}
            <div className="mt-10 bg-white border border-slate-100 rounded-[40px] shadow-sm overflow-hidden animate-in slide-in-from-bottom duration-700">
                <div className="p-8 border-b border-slate-50 bg-slate-50/20">
                    <h2 className="text-slate-900 font-[1000] text-xl tracking-tighter">Transaction Registry</h2>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Audit latest financial settlements</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-slate-50">
                                <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Provider</th>
                                <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Settlement ID</th>
                                <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Plan</th>
                                <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Method</th>
                                <th className="py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Settled Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {data?.recentTransactions && data.recentTransactions.length > 0 ? data.recentTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((t) => (
                                <tr key={t._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-5 px-8 font-extrabold text-sm text-slate-800">{t.providerId?.fullName || t.user || 'Guest User'}</td>
                                    <td className="py-5 px-6 font-mono text-xs text-slate-400">{t.transactionId}</td>
                                    <td className="py-5 px-6 text-[11px] font-black text-slate-500 uppercase tracking-widest">{t.planId?.name || 'Subscription'}</td>
                                    <td className="py-5 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{t.paymentMethod}</td>
                                    <td className="py-5 px-6 text-sm text-slate-600 font-medium">{new Date(t.createdAt).toLocaleDateString()}</td>
                                    <td className="py-5 px-8 text-right font-black text-slate-900">₹{t.amount}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="py-20 text-center text-slate-400 italic">No transactions found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {data?.recentTransactions && data.recentTransactions.length > itemsPerPage && (
                    <div className="px-8 py-5 border-t border-slate-50 bg-slate-50/10 flex items-center justify-between">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, data.recentTransactions.length)} - {Math.min(currentPage * itemsPerPage, data.recentTransactions.length)} of {data.recentTransactions.length}
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm'}`}
                            >
                                Prev
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(data.recentTransactions.length / itemsPerPage)))}
                                disabled={currentPage === Math.ceil(data.recentTransactions.length / itemsPerPage)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentPage === Math.ceil(data.recentTransactions.length / itemsPerPage) ? 'opacity-30 cursor-not-allowed' : 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700'}`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RevenueDashboard;
