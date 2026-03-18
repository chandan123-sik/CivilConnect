import React, { useState, useEffect } from 'react';
import { getPendingApprovals, updateApprovalStatus } from '../../../api/adminApi';
import { showToast } from '../../../components/Toast';

const ApprovalManagement = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const fetchApprovals = async () => {
        setLoading(true);
        try {
            const res = await getPendingApprovals();
            const data = res.data || res;
            setRequests(data);
        } catch (err) {
            console.error("Failed to fetch approvals:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApprovals();
    }, []);

    const handleAction = async (id, newStatus) => {
        try {
            const statusMap = {
                'Approved': 'approved',
                'Rejected': 'rejected',
                'On-Hold': 'pending'
            };
            const finalStatus = statusMap[newStatus] || newStatus.toLowerCase();
            
            await updateApprovalStatus(id, finalStatus);
            setSelectedRequest(null);
            fetchApprovals();
            showToast(`Provider ${finalStatus === 'approved' ? 'approved' : 'rejected'} successfully.`, 'success');
        } catch (err) {
            console.error("Update error:", err);
            showToast("Failed to update status.", "error");
        }
    };

    const filteredRequests = (requests || [])
        .filter(req => {
            const status = req.approvalStatus || 'pending';
            const matchesStatus = filterStatus === 'All' || status.toLowerCase() === filterStatus.toLowerCase();
            const matchesSearch = (req.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (req.category || '').toLowerCase().includes(searchQuery.toLowerCase());
            return matchesStatus && matchesSearch;
        })
        .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));

    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

    const getStatusColor = (status) => {
        const s = status?.toLowerCase();
        switch (s) {
            case 'approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            case 'pending': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `http://localhost:5000/${path.replace(/\\/g, '/')}`;
    };

    return (
        <div className="max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-slate-900 text-3xl font-[1000] tracking-tighter">Approval Gateway</h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">Verify and onboard experts to the platform.</p>
                </div>

                <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm gap-1 overflow-x-auto w-full md:w-auto">
                    {['All', 'Pending', 'Approved'].map(status => (
                        <button
                            key={status}
                            onClick={() => {
                                setFilterStatus(status);
                                setCurrentPage(1);
                            }}
                            className={`px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filterStatus === status ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'} `}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Search */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                <div className="lg:col-span-3 relative">
                    <input
                        type="text"
                        placeholder="Search by expert name..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-[22px] text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
                    />
                    <svg className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <div className="bg-emerald-600 rounded-[22px] p-4 flex items-center justify-between shadow-lg shadow-emerald-600/20">
                    <div className="text-white">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Total Pending</p>
                        <p className="text-2xl font-[1000] leading-none mt-1">{requests.filter(r => r.approvalStatus === 'pending').length}</p>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-100 rounded-[40px] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Expert Identity</th>
                                <th className="py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Service & Experience</th>
                                <th className="py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Selected Plan</th>
                                <th className="py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Security Status</th>
                                <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {paginatedRequests.map((req) => (
                                <tr key={req._id} className="hover:bg-slate-50/50 transition-all group">
                                    <td className="py-6 px-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-500 text-[11px] border border-slate-200 uppercase">
                                                {(req.fullName || 'U').split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="text-slate-900 font-extrabold text-[15px] tracking-tight">{req.fullName}</p>
                                                <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest">
                                                    ID: {req._id.slice(-6).toUpperCase()} | {req.lastTransactionId?.transactionId || 'NO-TXN'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6 px-6">
                                        <div className="flex flex-col">
                                            <span className="text-slate-800 font-bold text-sm mb-1">{req.category}</span>
                                            <span className="text-emerald-600 text-[10px] font-black uppercase tracking-widest">{req.experience || 0} Yrs Experience</span>
                                        </div>
                                    </td>
                                    <td className="py-6 px-6 text-sm font-black text-slate-500 uppercase tracking-widest">
                                        {req.subscriptionId?.name || 'Standard'}
                                    </td>
                                    <td className="py-6 px-6 text-center">
                                        <span className={`inline-flex px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] border ${getStatusColor(req.approvalStatus)}`}>
                                            {req.approvalStatus || 'pending'}
                                        </span>
                                    </td>
                                    <td className="py-6 px-8 text-right">
                                        <button
                                            onClick={() => setSelectedRequest(req)}
                                            className="px-5 py-2.5 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                                        >
                                            Review Case
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedRequest(null)} />
                    <div className="relative bg-white rounded-[32px] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-xl font-[1000] text-slate-900 tracking-tighter">Case Audit: {selectedRequest.fullName}</h2>
                            <button onClick={() => setSelectedRequest(null)} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <div className="p-6 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-4 bg-slate-50 rounded-2xl">
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Category</p>
                                    <p className="text-sm font-bold text-slate-900">{selectedRequest.category}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl">
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Tier</p>
                                    <p className="text-sm font-bold text-emerald-600">{selectedRequest.subscriptionId?.name || 'Standard'}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl">
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Payment ID</p>
                                    <p className="text-[10px] font-bold text-slate-900 break-all">{selectedRequest.lastTransactionId?.transactionId || 'N/A'}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl">
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Payment Method</p>
                                    <p className="text-[10px] font-bold text-slate-900 break-all">{selectedRequest.lastTransactionId?.paymentMethod || 'UPI'}</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                <p className="text-[10px] font-black text-slate-400 uppercase px-1">Verification Documents</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-200 relative">
                                        {selectedRequest.aadharImage ? (
                                            <img src={getImageUrl(selectedRequest.aadharImage)} className="w-full h-full object-cover" alt="Aadhar" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-[10px] font-bold text-slate-400">AADHAR MISSING</div>
                                        )}
                                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/50 text-white text-[8px] font-bold rounded">AADHAR</div>
                                    </div>
                                    <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-200 relative">
                                        {selectedRequest.policeVerifyImage ? (
                                            <img src={getImageUrl(selectedRequest.policeVerifyImage)} className="w-full h-full object-cover" alt="Police" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-[10px] font-bold text-slate-400">POLICE CERT MISSING</div>
                                        )}
                                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/50 text-white text-[8px] font-bold rounded">POLICE VERIFY</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 flex gap-3">
                            <button onClick={() => handleAction(selectedRequest._id, 'Rejected')} className="flex-1 py-3.5 bg-white border border-slate-200 text-red-600 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-red-50 hover:border-red-200 transition-all">Reject</button>
                            <button onClick={() => handleAction(selectedRequest._id, 'Approved')} className="flex-1 py-3.5 bg-emerald-600 text-white rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition-all">Approve</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApprovalManagement;
