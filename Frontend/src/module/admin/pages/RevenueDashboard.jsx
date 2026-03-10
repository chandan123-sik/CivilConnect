import React, { useState } from 'react';

const initialTransactions = [
    { id: 'TXN-9821', source: 'Standard Monthly', provider: 'Rajesh Kumar', amount: '₹499', type: 'Subscription', date: '05 Mar 2026', status: 'Success' },
    { id: 'TXN-9822', source: 'Lead Fee (Elite)', provider: 'Amit Sharma', amount: '₹150', type: 'Service Fee', date: '05 Mar 2026', status: 'Success' },
    { id: 'TXN-9823', source: 'Annual Elite', provider: 'Anjali Mehta', amount: '₹4,499', type: 'Subscription', date: '04 Mar 2026', status: 'Success' },
    { id: 'TXN-9824', source: 'Quarterly Pro', provider: 'Suresh Patil', amount: '₹1,299', type: 'Subscription', date: '04 Mar 2026', status: 'Blocked' },
    { id: 'TXN-9825', source: 'Lead Fee (Pro)', provider: 'Vikram Singh', amount: '₹150', type: 'Service Fee', date: '04 Mar 2026', status: 'Success' },
    { id: 'TXN-9826', source: 'Lead Fee (Elite)', provider: 'Kunal Sikarwar', amount: '₹150', type: 'Service Fee', date: '03 Mar 2026', status: 'Success' },
    { id: 'TXN-9827', source: 'Quarterly Pro', provider: 'Priya Verma', amount: '₹1,299', type: 'Subscription', date: '03 Mar 2026', status: 'Success' },
    { id: 'TXN-9828', source: 'Standard Monthly', provider: 'Rahul Desai', amount: '₹499', type: 'Subscription', date: '02 Mar 2026', status: 'Success' },
    { id: 'TXN-9829', source: 'Lead Fee (Pro)', provider: 'Sneha Patel', amount: '₹150', type: 'Service Fee', date: '02 Mar 2026', status: 'Success' },
    { id: 'TXN-9830', source: 'Annual Elite', provider: 'Vikram Singh', amount: '₹4,499', type: 'Subscription', date: '01 Mar 2026', status: 'Success' },
    { id: 'TXN-9831', source: 'Lead Fee (Elite)', provider: 'Neha Gupta', amount: '₹150', type: 'Service Fee', date: '01 Mar 2026', status: 'Success' },
    { id: 'TXN-9832', source: 'Quarterly Pro', provider: 'Amit Sharma', amount: '₹1,299', type: 'Subscription', date: '28 Feb 2026', status: 'Success' },
];

const revenueByRange = {
    Day: { earnings: '₹18,400', transactions: 45, average: '₹408', growth: '+12%' },
    Week: { earnings: '₹1,25,000', transactions: 310, average: '₹403', growth: '+8%' },
    Month: { earnings: '₹5,40,000', transactions: 1240, average: '₹435', growth: '+15%' },
    Year: { earnings: '₹64,80,000', transactions: 14880, average: '₹435', growth: '+22%' }
};

const RevenueDashboard = () => {
    const [timeRange, setTimeRange] = useState('Month');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Filter Logic
    const filteredTransactions = initialTransactions.filter(txn =>
        txn.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination Logic
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">
            {/* ── Header & Switcher ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-slate-900 text-3xl font-[1000] tracking-tighter">Revenue Reports</h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">Track your platform's financial growth and performance.</p>
                </div>

                <div className="flex bg-emerald-50 p-1.5 rounded-2xl border border-emerald-100 shadow-sm">
                    {['Day', 'Week', 'Month', 'Year'].map(range => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-6 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all ${timeRange === range ? 'bg-emerald-600 text-white shadow-md' : 'text-emerald-700 hover:bg-emerald-100/50'} `}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Key Numbers ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {[
                    { label: 'Total Earnings', value: revenueByRange[timeRange].earnings, icon: '💰', sub: `${revenueByRange[timeRange].growth} from last period`, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Total Transactions', value: revenueByRange[timeRange].transactions, icon: '📊', sub: 'Successful payments', color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Average Per Order', value: revenueByRange[timeRange].average, icon: '💎', sub: 'Average deal value', color: 'text-amber-600', bg: 'bg-amber-50' }
                ].map((item, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm group hover:border-emerald-200 transition-all">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center text-2xl shadow-inner`}>
                                {item.icon}
                            </div>
                            <span className={`text-[11px] font-black px-3 py-1 rounded-full ${item.color === 'text-emerald-600' ? 'bg-emerald-100' : 'bg-slate-100'} ${item.color}`}>
                                {item.label.split(' ')[0]}
                            </span>
                        </div>
                        <h3 className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] mb-1">{item.label}</h3>
                        <p className="text-slate-900 text-4xl font-[1000] tracking-tighter mb-2">{item.value}</p>
                        <p className="text-slate-400 text-xs font-bold italic">{item.sub}</p>
                    </div>
                ))}
            </div>

            {/* ── Monthly Performance Summary ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                    <h2 className="text-slate-900 font-[1000] text-xl tracking-tight mb-8 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                        Monthly Earning Trends
                    </h2>

                    <div className="h-64 flex items-end justify-between gap-4 pt-10 px-2">
                        {[
                            { month: 'Oct', val: 40 }, { month: 'Nov', val: 70 },
                            { month: 'Dec', val: 60 }, { month: 'Jan', val: 90 },
                            { month: 'Feb', val: 80 }, { month: 'Mar', val: 100 }
                        ].map((d, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                                <div
                                    style={{ height: `${d.val}%` }}
                                    className="w-full max-w-[40px] bg-emerald-100 group-hover:bg-emerald-500 rounded-2xl transition-all duration-300 relative"
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-emerald-600 opacity-0 group-hover:opacity-100 transition-all">
                                        {d.val}%
                                    </div>
                                </div>
                                <span className={`text-[10px] font-black tracking-widest uppercase transition-colors ${d.month === 'Mar' ? 'text-emerald-600' : 'text-slate-400'}`}>
                                    {d.month}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                    <h2 className="text-slate-900 font-[1000] text-xl tracking-tight mb-8 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
                        Where Revenue Comes From
                    </h2>

                    <div className="space-y-8">
                        {[
                            { category: 'Monthly Plans', percent: 65, color: 'bg-emerald-500' },
                            { category: 'Yearly Subscriptions', percent: 25, color: 'bg-blue-500' },
                            { category: 'Provider Lead Fees', percent: 10, color: 'bg-amber-500' }
                        ].map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-center mb-2 px-1">
                                    <span className="text-slate-700 font-bold text-sm tracking-tight">{item.category}</span>
                                    <span className="text-slate-900 font-black text-sm">{item.percent}%</span>
                                </div>
                                <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5 shadow-inner">
                                    <div
                                        style={{ width: `${item.percent}%` }}
                                        className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Transaction List ── */}
            <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-slate-900 font-[1000] text-xl tracking-tight">Recent Payment History</h2>
                        <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest">A list of the very latest transactions</p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-80">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1); // Reset to first page on search
                            }}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-inner"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left order-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Transaction</th>
                                <th className="py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Provider</th>
                                <th className="py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                <th className="py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                                <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {paginatedTransactions.length > 0 ? (
                                paginatedTransactions.map((txn) => (
                                    <tr key={txn.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="py-6 px-8">
                                            <div className="flex flex-col">
                                                <span className="text-slate-900 font-bold text-[14px]">{txn.source}</span>
                                                <span className="text-slate-400 text-[10px] uppercase font-black tracking-wider">{txn.id}</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-6">
                                            <span className="text-slate-700 font-bold text-sm">{txn.provider}</span>
                                        </td>
                                        <td className="py-6 px-6">
                                            <span className="text-slate-500 font-bold text-xs uppercase">{txn.date}</span>
                                        </td>
                                        <td className="py-6 px-6">
                                            <span className="text-slate-900 font-black text-lg tracking-tighter">{txn.amount}</span>
                                        </td>
                                        <td className="py-6 px-8 text-right">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${txn.status === 'Success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                                                {txn.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                                        No transactions found matching "{searchTerm}"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="p-6 border-t border-slate-50 bg-white flex items-center justify-between">
                    <p className="text-[12px] font-medium text-slate-500">
                        Showing <span className="font-bold text-slate-900">{paginatedTransactions.length}</span> of <span className="font-bold text-slate-900">{filteredTransactions.length}</span> entries
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-emerald-600 transition-all disabled:opacity-30 disabled:hover:text-slate-400"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-10 h-10 rounded-xl text-[13px] font-[1000] transition-all ${currentPage === i + 1 ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'} `}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-emerald-600 transition-all disabled:opacity-30 disabled:hover:text-slate-400"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RevenueDashboard;
