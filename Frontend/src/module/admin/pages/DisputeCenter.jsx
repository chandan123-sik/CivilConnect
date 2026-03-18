import React, { useState, useEffect } from 'react';
import { Search, Filter, Send, Flag, CheckCircle, Clock, ChevronRight, User, MapPin, Trash2 } from 'lucide-react';
import axiosInstance from '../../../api/axiosInstance';

const DisputeCenter = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All'); // All, Pending, Resolved
    const [searchQuery, setSearchQuery] = useState('');
    const [replyTexts, setReplyTexts] = useState({});
    const [message, setMessage] = useState({ text: '', type: '' });

    const showToast = (text, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    };

    const fetchReports = async () => {
        try {
            console.log("Fetching admin reports...");
            const res = await axiosInstance.get('/admin/reports');
            
            // The axiosInstance interceptor unwraps res.data or res.data.data
            // Let's handle all possibilities robustly
            let finalData = [];
            if (Array.isArray(res)) {
                finalData = res;
            } else if (res && Array.isArray(res.data)) {
                finalData = res.data;
            } else if (res && res.data && Array.isArray(res.data.data)) {
                finalData = res.data.data;
            }
            
            console.log("Reports fetched successfully:", finalData.length);
            setReports(finalData);
        } catch (error) {
            console.error('Failed to fetch reports', error);
            // Don't alert here, just log for debugging
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
        const interval = setInterval(fetchReports, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleReply = async (reportId) => {
        if (!replyTexts[reportId]?.trim()) return;
        try {
            await axiosInstance.patch(`/admin/reports/${reportId}/reply`, { reply: replyTexts[reportId] });
            setReplyTexts(prev => ({ ...prev, [reportId]: '' }));
            showToast('Resolution reply sent successfully!');
            fetchReports();
        } catch (error) {
            showToast('Failed to send reply', 'error');
        }
    };

    const handleDelete = async (reportId) => {
        try {
            await axiosInstance.delete(`/admin/reports/${reportId}`);
            showToast('Report deleted successfully!');
            fetchReports();
        } catch (error) {
            showToast('Failed to delete report', 'error');
        }
    };

    const filteredReports = reports.filter(rep => {
        const matchesFilter = filter === 'All' || rep.status === filter;
        const name = (rep.senderId?.fullName || rep.senderId?.businessName || '').toLowerCase();
        const msg = (rep.message || '').toLowerCase();
        const matchesSearch = name.includes(searchQuery.toLowerCase()) || msg.includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const stats = {
        total: reports.length,
        pending: reports.filter(r => r.status === 'Pending').length,
        resolved: reports.filter(r => r.status === 'Resolved').length
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-[1000] text-slate-900 tracking-tight">Report Management</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px] mt-1 opacity-70">
                        System Support & Dispute Resolution Center
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search reports..."
                            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 ring-indigo-500/10 outline-none w-64 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Reports', value: stats.total, icon: <Flag />, color: 'blue' },
                    { label: 'Pending Actions', value: stats.pending, icon: <Clock />, color: 'red' },
                    { label: 'Resolved Issues', value: stats.resolved, icon: <CheckCircle />, color: 'green' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5 group hover:shadow-md transition-all">
                        <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                            {React.cloneElement(stat.icon, { size: 24, strokeWidth: 2.5 })}
                        </div>
                        <div>
                            <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest">{stat.label}</p>
                            <p className="text-2xl font-[1000] text-slate-900 leading-tight mt-1">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Sidebar Layout */}
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[70vh]">
                {/* Tabs / Filters */}
                <div className="px-8 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div className="flex gap-2">
                        {['All', 'Pending', 'Resolved'].map(t => (                        
                            <button
                                key={t}
                                onClick={() => setFilter(t)}
                                className={`px-5 py-2 rounded-xl text-[13px] font-black uppercase tracking-wider transition-all ${
                                    filter === t ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    <div className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">
                        Showing {filteredReports.length} results
                    </div>
                </div>

                {/* Report List */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-6">
                    {loading ? (
                        <div className="text-center py-20 opacity-50 font-black uppercase tracking-widest text-sm">Loading reports...</div>
                    ) : filteredReports.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search size={32} className="text-slate-300" />
                            </div>
                            <p className="text-slate-500 font-bold">No reports found matching your criteria.</p>
                        </div>
                    ) : (
                        filteredReports.map(rep => (
                            <div key={rep._id} className={`group bg-white p-6 rounded-3xl border transition-all hover:shadow-xl relative ${rep.status === 'Pending' ? 'border-red-100 shadow-sm shadow-red-500/5' : 'border-slate-100'}`}>
                                <button 
                                    onClick={() => handleDelete(rep._id)}
                                    className="absolute top-4 right-4 p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    title="Delete Report"
                                >
                                    <Trash2 size={18} strokeWidth={2.5} />
                                </button>
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Left: Sender Info */}
                                    <div className="md:w-64 shrink-0 flex flex-col gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shadow-inner">
                                                <User size={18} />
                                            </div>
                                            <div>
                                                <h4 className="font-[1000] text-slate-900 text-sm">{rep.senderId?.fullName || rep.senderId?.businessName || 'Unknown User'}</h4>
                                                <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md ${rep.senderModel === 'User' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'}`}>
                                                    {rep.senderModel}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <MapPin size={14} />
                                                <span className="text-[11px] font-bold">{rep.senderId?.city || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <Clock size={14} />
                                                <span className="text-[11px] font-bold">{new Date(rep.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className={`mt-auto px-3 py-1.5 rounded-xl inline-flex items-center gap-2 w-fit ${rep.status === 'Pending' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${rep.status === 'Pending' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{rep.status}</span>
                                        </div>
                                    </div>

                                    {/* Right: Message & Action */}
                                    <div className="flex-1 border-t md:border-t-0 md:border-l border-slate-100 md:pl-8 pt-4 md:pt-0 flex flex-col">
                                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Issue Reported</p>
                                        <div className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100 text-slate-700 text-sm font-semibold leading-relaxed mb-6">
                                            {rep.message}
                                        </div>

                                        {rep.status === 'Pending' ? (
                                            <div className="mt-auto">
                                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2 px-1">Admin Resolution Reply</p>
                                                <div className="flex bg-white border border-slate-200 rounded-2xl overflow-hidden focus-within:ring-4 ring-indigo-500/10 transition-all border-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Type your resolution message here..."
                                                        className="flex-1 bg-transparent border-none outline-none px-5 py-4 text-sm font-bold text-slate-800 placeholder:text-slate-400"
                                                        value={replyTexts[rep._id] || ''}
                                                        onChange={e => setReplyTexts(prev => ({ ...prev, [rep._id]: e.target.value }))}
                                                        onKeyDown={e => e.key === 'Enter' && handleReply(rep._id)}
                                                    />
                                                    <button
                                                        onClick={() => handleReply(rep._id)}
                                                        disabled={!replyTexts[rep._id]?.trim()}
                                                        className={`px-6 flex items-center justify-center transition-all ${
                                                            replyTexts[rep._id]?.trim() 
                                                            ? 'bg-slate-900 text-white hover:bg-black active:scale-95' 
                                                            : 'bg-slate-50 text-slate-300 pointer-events-none'
                                                        }`}
                                                    >
                                                        <Send size={18} strokeWidth={2.5} />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mt-auto bg-green-50/50 p-5 rounded-3xl border border-green-100/50">
                                                <p className="text-green-600 text-[10px] font-black uppercase tracking-[0.2em] mb-2 px-1 flex items-center gap-2">
                                                    <CheckCircle size={12} /> Resolution Sent
                                                </p>
                                                <p className="text-slate-800 text-sm font-bold">{rep.reply}</p>
                                                <div className="mt-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest text-right">
                                                    Resolved on {new Date(rep.updatedAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Toast Notification */}
            {message.text && (
                <div style={{
                    position: 'fixed',
                    bottom: '24px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: message.type === 'error' ? '#EF4444' : '#10B981',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    zIndex: 1000,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                    {message.text}
                </div>
            )}

            <style>{`
                @keyframes slideUp {
                    from { transform: translate(-50%, 100%); }
                    to { transform: translate(-50%, 0); }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #E2E8F0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #CBD5E1;
                }
            `}</style>
        </div>
    );
};

export default DisputeCenter;
