import React, { useState } from 'react';

const dummyUsers = [
    {
        id: 'USR-8921',
        name: 'Amit Sharma',
        phone: '+91 98765 43210',
        email: 'amit.sharma@gmail.com',
        joinDate: '15 Oct, 2023',
        status: 'Active',
        totalRequests: 12,
        lastActive: '2 hrs ago',
        avatar: 'AS'
    },
    {
        id: 'USR-8922',
        name: 'Priya Verma',
        phone: '+91 87654 32109',
        email: 'priya.v88@outlook.com',
        joinDate: '28 Nov, 2023',
        status: 'Active',
        totalRequests: 5,
        lastActive: '1 day ago',
        avatar: 'PV'
    },
    {
        id: 'USR-8923',
        name: 'Rahul Desai',
        phone: '+91 76543 21098',
        email: 'rahul.desai_client@yahoo.com',
        joinDate: '02 Jan, 2024',
        status: 'Suspended',
        totalRequests: 24,
        lastActive: '5 days ago',
        avatar: 'RD'
    },
    {
        id: 'USR-8924',
        name: 'Sneha Patel',
        phone: '+91 65432 10987',
        email: 'sneha.patel.home@xyz.com',
        joinDate: '14 Feb, 2024',
        status: 'Active',
        totalRequests: 2,
        lastActive: 'Just now',
        avatar: 'SP'
    },
    {
        id: 'USR-8925',
        name: 'Vikram Singh',
        phone: '+91 99887 76655',
        email: 'vikram.singh.build@gmail.com',
        joinDate: '10 Mar, 2024',
        status: 'Blocked',
        totalRequests: 0,
        lastActive: '1 month ago',
        avatar: 'VS'
    },
    {
        id: 'USR-8926',
        name: 'Neha Gupta',
        phone: '+91 88776 65544',
        email: 'neha.g_design@gmail.com',
        joinDate: '22 Mar, 2024',
        status: 'Active',
        totalRequests: 8,
        lastActive: '3 hrs ago',
        avatar: 'NG'
    }
];

const UserManagement = () => {
    const [users, setUsers] = useState(dummyUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    // Filter Logic
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.phone.includes(searchTerm) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'Suspended':
                return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Blocked':
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [viewingUser, setViewingUser] = useState(null);
    const [newUserForm, setNewUserForm] = useState({
        name: '',
        email: '',
        phone: '',
        status: 'Active'
    });

    const handleToggleStatus = (userId, newStatus) => {
        setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    };

    const handleExportCSV = () => {
        // Simple CSV generation from filteredUsers data
        const headers = ["ID", "Name", "Phone", "Email", "Join Date", "Status", "Total Requests", "Last Active"];
        const rows = filteredUsers.map(u => [
            u.id,
            `"${u.name}"`,
            `"${u.phone}"`,
            `"${u.email}"`,
            `"${u.joinDate}"`,
            u.status,
            u.totalRequests,
            `"${u.lastActive}"`
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `CivilConnect_Users_Export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleAddUserSubmit = (e) => {
        e.preventDefault();
        // In a real app, this would hit a backend API.
        const newId = `USR-${Math.floor(Math.random() * 9000) + 1000}`;
        const initials = newUserForm.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

        const newUser = {
            id: newId,
            name: newUserForm.name,
            phone: newUserForm.phone,
            email: newUserForm.email,
            joinDate: 'Just now',
            status: newUserForm.status,
            totalRequests: 0,
            lastActive: 'Online',
            avatar: initials || 'U'
        };

        setUsers([newUser, ...users]);
        setIsAddUserModalOpen(false);
        setNewUserForm({ name: '', email: '', phone: '', status: 'Active' });
    };

    return (
        <div className="max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">
            {/* ── Page Header ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-slate-900 text-3xl font-[1000] tracking-tighter mb-1">User Options</h1>
                    <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest">Manage Client Accounts & Activity</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-slate-600 font-bold text-[12px] shadow-sm hover:shadow-md hover:text-slate-900 transition-all active:scale-95"
                    >
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Export CSV
                    </button>
                    <button
                        onClick={() => setIsAddUserModalOpen(true)}
                        className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2.5 rounded-xl font-bold text-[12px] shadow-lg shadow-green-500/30 hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all active:scale-95"
                    >
                        <svg className="w-4 h-4 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                        Add New User
                    </button>
                </div>
            </div>

            {/* ── Metric Cards ── */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Total Clients', value: '1,248', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', color: 'text-blue-500', bg: 'bg-blue-50' },
                    { label: 'Active Today', value: '342', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', color: 'text-green-500', bg: 'bg-green-50' },
                    { label: 'New This Month', value: '+128', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-purple-500', bg: 'bg-purple-50' },
                    { label: 'Suspended Accts', value: '14', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', color: 'text-amber-500', bg: 'bg-amber-50' }
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4 relative overflow-hidden group">
                        <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                            <svg className={`w-6 h-6 ${stat.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} />
                            </svg>
                        </div>
                        <div>
                            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-0.5">{stat.label}</p>
                            <p className="text-slate-800 text-2xl font-black tracking-tight">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Main Data View ── */}
            <div className="bg-white border border-slate-100 shadow-sm rounded-3xl overflow-hidden flex flex-col">
                {/* Toolbar */}
                <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Search */}
                    <div className="relative w-full sm:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name, email, or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-3">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest hidden sm:block">Filter By:</span>
                        <div className="flex bg-slate-100 p-1 rounded-xl">
                            {['All', 'Active', 'Suspended', 'Blocked'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-4 py-1.5 rounded-lg text-[12px] font-bold transition-all ${statusFilter === status ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'} `}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-slate-100">
                                <th className="py-4 px-6 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 whitespace-nowrap">Client Details</th>
                                <th className="py-4 px-6 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 whitespace-nowrap">Contact Info</th>
                                <th className="py-4 px-6 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 whitespace-nowrap">Status</th>
                                <th className="py-4 px-6 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 whitespace-nowrap">Activity Logs</th>
                                <th className="py-4 px-6 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 text-right whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-sm shrink-0 shadow-sm">
                                                    {user.avatar}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 mb-0.5">{user.name}</p>
                                                    <p className="text-[11px] font-medium text-slate-400">ID: {user.id} • Joined {user.joinDate}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col gap-1">
                                                <p className="text-[13px] font-semibold text-slate-700">{user.phone}</p>
                                                <p className="text-[12px] text-slate-500">{user.email}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(user.status)}`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col gap-1">
                                                <p className="text-[13px] font-bold text-slate-700">{user.totalRequests} Requests</p>
                                                <p className="text-[11px] font-medium text-slate-400">Active: {user.lastActive}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {/* Action: View details */}
                                                <button onClick={() => setViewingUser(user)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="View Profile">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                </button>
                                                {/* Action: Suspend/Lock */}
                                                {user.status !== 'Blocked' && (
                                                    <button onClick={() => handleToggleStatus(user.id, user.status === 'Suspended' ? 'Active' : 'Suspended')} className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors" title={user.status === 'Suspended' ? "Unsuspend User" : "Suspend User"}>
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                                    </button>
                                                )}
                                                {/* Action: Block/Ban */}
                                                {user.status !== 'Blocked' ? (
                                                    <button onClick={() => handleToggleStatus(user.id, 'Blocked')} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Block User">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                                                    </button>
                                                ) : (
                                                    <button onClick={() => handleToggleStatus(user.id, 'Active')} className="p-2 text-slate-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors" title="Unblock User">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <svg className="w-12 h-12 text-slate-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                            <p className="text-slate-500 font-bold">No users found matching your filters.</p>
                                            <p className="text-slate-400 text-sm mt-1">Try adjusting your search query or status filter.</p>
                                            <button
                                                onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}
                                                className="mt-4 text-[13px] font-bold text-green-600 hover:text-green-700 transition-colors"
                                            >
                                                Clear all filters
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-between">
                    <p className="text-[12px] font-medium text-slate-500">
                        Showing <span className="font-bold text-slate-800">{filteredUsers.length}</span> out of <span className="font-bold text-slate-800">1,248</span> clients
                    </p>
                    <div className="flex items-center gap-1">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors disabled:opacity-50" disabled>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-50 text-green-600 font-bold text-[13px]">1</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 font-bold text-[13px] transition-colors">2</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 font-bold text-[13px] transition-colors">3</button>
                        <span className="text-slate-400 text-[13px] px-1">...</span>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 font-bold text-[13px] transition-colors">12</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Add User Modal ── */}
            {isAddUserModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        onClick={() => setIsAddUserModalOpen(false)}
                    ></div>

                    {/* Modal Content */}
                    <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 sm:p-8 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-black text-slate-800 tracking-tight">Add New Client</h2>
                                <p className="text-[12px] text-slate-400 font-medium mt-1">Manually onboard a new client onto the platform.</p>
                            </div>
                            <button
                                onClick={() => setIsAddUserModalOpen(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <form onSubmit={handleAddUserSubmit} className="p-6 sm:p-8 flex flex-col gap-6 bg-slate-50/50">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={newUserForm.name}
                                        onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-[14px] font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm"
                                        placeholder="e.g. John Doe"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        required
                                        value={newUserForm.phone}
                                        onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-[14px] font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm"
                                        placeholder="+91 XXXXX XXXXX"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            value={newUserForm.email}
                                            onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-[14px] font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Initial Status</label>
                                        <select
                                            value={newUserForm.status}
                                            onChange={(e) => setNewUserForm({ ...newUserForm, status: e.target.value })}
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-[14px] font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm cursor-pointer"
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Suspended">Suspended</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAddUserModalOpen(false)}
                                    className="px-5 py-2.5 rounded-xl font-bold text-[13px] text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 rounded-xl font-bold text-[13px] text-white bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/20 transition-all active:scale-95"
                                >
                                    Create User Account
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── View Profile Modal ── */}
            {viewingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        onClick={() => setViewingUser(null)}
                    ></div>

                    <div className="relative bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Header Banner */}
                        <div className={`h-24 ${viewingUser.status === 'Active' ? 'bg-gradient-to-r from-green-500 to-green-600' : viewingUser.status === 'Suspended' ? 'bg-gradient-to-r from-amber-500 to-amber-600' : 'bg-gradient-to-r from-red-500 to-red-600'}`}></div>

                        {/* Profile Info */}
                        <div className="px-6 pb-6 relative">
                            {/* Avatar pushing up into banner */}
                            <div className="flex justify-between items-end -mt-10 mb-4">
                                <div className="w-20 h-20 rounded-2xl bg-white p-1.5 shadow-lg">
                                    <div className="w-full h-full rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-2xl border border-slate-200">
                                        {viewingUser.avatar}
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(viewingUser.status)} bg-opacity-100`}>
                                    {viewingUser.status}
                                </span>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-xl font-black text-slate-800">{viewingUser.name}</h3>
                                <p className="text-[12px] font-bold text-slate-400">Client ID: {viewingUser.id}</p>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Contact Information</p>
                                    <p className="text-[13px] font-semibold text-slate-700 mb-0.5">{viewingUser.phone}</p>
                                    <p className="text-[13px] text-slate-500">{viewingUser.email}</p>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Platform Activity</p>
                                        <p className="text-[18px] font-black text-slate-800">{viewingUser.totalRequests}</p>
                                        <p className="text-[11px] font-medium text-slate-500">Service Requests</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Seen</p>
                                        <p className="text-[13px] font-bold text-slate-700 mt-1">{viewingUser.lastActive}</p>
                                        <p className="text-[11px] font-medium text-slate-500">Joined: {viewingUser.joinDate}</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setViewingUser(null)}
                                className="w-full mt-6 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-[13px] transition-colors"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
