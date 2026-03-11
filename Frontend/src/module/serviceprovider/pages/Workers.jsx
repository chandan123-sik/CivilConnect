import React, { useState, useEffect } from 'react';
import { MoreVertical, UserPlus, Phone, MapPin, Trash2, Edit2, ShieldAlert, X, Bell } from 'lucide-react';

const Workers = () => {
    const [workers, setWorkers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const [editingWorker, setEditingWorker] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        gender: 'Male',
        city: '',
        location: '',
        phone: '',
        image: ''
    });

    // Load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('cc_provider_workers');
        if (saved) setWorkers(JSON.parse(saved));
        else {
            // Seed with dummy if empty
            const dummy = [
                { id: 1, name: 'Umesh', phone: '98798798796', gender: 'Male', city: 'Pune', location: 'Hinjewadi', image: '', status: 'active' },
                { id: 2, name: 'Dinesh', phone: '9789879897', gender: 'Male', city: 'Pune', location: 'Wakad', image: '', status: 'active' },
                { id: 3, name: 'Mukesh', phone: '9898989898', gender: 'Male', city: 'Pune', location: 'Baner', image: '', status: 'active' },
            ];
            setWorkers(dummy);
            localStorage.setItem('cc_provider_workers', JSON.stringify(dummy));
        }
    }, []);

    const saveToLocal = (newList) => {
        setWorkers(newList);
        localStorage.setItem('cc_provider_workers', JSON.stringify(newList));
    };

    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setFormData(prev => ({ ...prev, image: reader.result }));
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingWorker) {
            const newList = workers.map(w => w.id === editingWorker.id ? { ...w, ...formData } : w);
            saveToLocal(newList);
        } else {
            const newWorker = {
                id: Date.now(),
                ...formData,
                status: 'active'
            };
            saveToLocal([newWorker, ...workers]);
        }
        closeModal();
    };

    const openModal = (worker = null) => {
        if (worker) {
            setEditingWorker(worker);
            setFormData({ ...worker });
        } else {
            setEditingWorker(null);
            setFormData({ name: '', gender: 'Male', city: '', location: '', phone: '', image: '' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingWorker(null);
    };

    const handleDelete = (id) => {
        const newList = workers.filter(w => w.id !== id);
        saveToLocal(newList);
        setActiveMenu(null);
    };

    const handleBlock = (id) => {
        const newList = workers.map(w => w.id === id ? { ...w, status: w.status === 'blocked' ? 'active' : 'blocked' } : w);
        saveToLocal(newList);
        setActiveMenu(null);
    };

    return (
        <div className="min-h-screen bg-slate-50 relative pb-24 font-sans">
            {/* ── Premium Sticky Header ── */}
            <div className="bg-gradient-to-br from-[#1E3A8A] to-indigo-900 px-4 pt-8 pb-6 rounded-b-[32px] shadow-lg sticky top-0 z-50 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-[1000] text-white tracking-tight m-0">Manage Labor & Staff</h1>
                    <p className="text-blue-200/80 text-[15px] font-bold tracking-wide mt-0.5 uppercase">My Professional Workforce</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="bg-white/10 backdrop-blur-md text-white p-2.5 rounded-xl border border-white/20 shadow-sm active:scale-90 transition-transform flex items-center justify-center shrink-0"
                >
                    <UserPlus size={24} />
                </button>
            </div>

            {/* ── Worker List ── */}
            <div className="px-5 pt-4 space-y-4">
                <div className="flex items-center justify-between mb-4 pt-2 px-1">
                    <h2 className="text-[#1E293B] font-[1000] text-[18px] m-0 tracking-tight">Workers ({workers.length})</h2>
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-blue-50/80 flex items-center justify-center text-[#3B82F6]">
                            <Bell size={20} className="fill-current" />
                        </div>
                        <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></div>
                    </div>
                </div>

                {workers.map((worker) => (
                    <div
                        key={worker.id}
                        className={`bg-white rounded-[24px] p-4 shadow-[0_4px_15px_rgba(0,0,0,0.02)] border-[1.5px] ${worker.status === 'blocked' ? 'border-red-100 bg-red-50/20' : 'border-[#F1F5F9]'} transition-all flex items-center gap-4 relative`}
                    >
                        {/* Avatar */}
                        <div className="w-[56px] h-[56px] rounded-[20px] bg-[#F8FAFC] flex flex-col items-center justify-center overflow-hidden shrink-0 border border-slate-100 relative">
                            {worker.image ? (
                                <img src={worker.image} className="w-full h-full object-cover absolute inset-0" alt={worker.name} />
                            ) : (
                                <span className={`text-[20px] font-[1000] ${worker.status === 'blocked' ? 'text-red-400' : 'text-[#2C3B8D]'}`}>
                                    {worker.name.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0 pl-1">
                            <div className="flex items-center gap-2">
                                <h3 className={`font-[1000] text-[17px] tracking-tight truncate ${worker.status === 'blocked' ? 'text-red-900 line-through opacity-50' : 'text-[#0F172A]'}`}>
                                    {worker.name}
                                </h3>
                                {worker.status === 'blocked' && (
                                    <span className="bg-red-500 text-white text-[9px] font-[1000] px-2 py-0.5 rounded-md uppercase tracking-widest">Blocked</span>
                                )}
                            </div>
                            <div className="flex flex-col mt-1.5 gap-1.5">
                                <div className="flex items-center gap-2 text-[#64748B]">
                                    <Phone size={13} className="text-[#3B82F6] flex-shrink-0" />
                                    <p className="text-[13px] font-[800] text-[#475569]">{worker.phone}</p>
                                </div>
                                <div className="flex items-center gap-2 text-[#94A3B8]">
                                    <MapPin size={13} className="flex-shrink-0" />
                                    <p className="text-[12px] font-[700] truncate">{worker.location}, {worker.city}</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setActiveMenu(activeMenu === worker.id ? null : worker.id)}
                                className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors outline-none"
                            >
                                <MoreVertical size={20} />
                            </button>

                            {activeMenu === worker.id && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(null)} />
                                    <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-xl shadow-xl border border-slate-100 z-50 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                        <button
                                            onClick={() => { openModal(worker); setActiveMenu(null); }}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 text-[12px] font-bold hover:bg-slate-50 transition-colors"
                                        >
                                            <Edit2 size={14} className="text-blue-500" /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleBlock(worker.id)}
                                            className={`w-full flex items-center gap-2 px-3 py-2 text-[12px] font-bold hover:bg-slate-50 transition-colors ${worker.status === 'blocked' ? 'text-green-600' : 'text-amber-600'}`}
                                        >
                                            <ShieldAlert size={14} /> {worker.status === 'blocked' ? 'Unblock' : 'Block'}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(worker.id)}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-red-600 text-[12px] font-bold hover:bg-slate-50 transition-colors"
                                        >
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>



            {/* ── Form Modal (Full Screen on Mobile) ── */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white sm:bg-slate-900/50 sm:p-4 sm:backdrop-blur-sm overflow-hidden">
                    <div className="w-full h-full sm:h-auto sm:max-w-md bg-white sm:rounded-[40px] p-6 sm:p-8 sm:shadow-2xl overflow-y-auto animate-in slide-in-from-bottom duration-300">
                        <div className="flex justify-between items-center mb-8 sticky top-0 bg-white z-10 py-2 sm:py-0">
                            <div>
                                <h3 className="text-slate-900 font-[1000] text-2xl tracking-tight m-0">{editingWorker ? 'Edit Worker' : 'Register New Worker'}</h3>
                                <p className="text-slate-400 text-[11px] font-[1000] uppercase tracking-widest mt-1.5">Enter professional staff details</p>
                            </div>
                            <button onClick={closeModal} className="text-slate-500 bg-slate-50 p-2.5 hover:bg-slate-100 rounded-2xl active:scale-90 transition-transform">
                                <X size={24} strokeWidth={3} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Profile Image Upload */}
                            <div className="flex flex-col items-center mb-6">
                                <div className="relative group">
                                    <div className="w-28 h-28 rounded-[36px] bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:border-[#1E3A8A] relative">
                                        {formData.image ? (
                                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover absolute inset-0" />
                                        ) : (
                                            <div className="text-center text-slate-400">
                                                <UserPlus size={28} className="mx-auto" />
                                                <p className="text-[10px] font-[1000] uppercase mt-2">Upload Photo</p>
                                            </div>
                                        )}
                                    </div>
                                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
                                </div>
                            </div>

                            <div>
                                <label className="text-slate-500 text-[11px] font-[1000] uppercase tracking-widest block mb-2 px-1">Full Name</label>
                                <input
                                    type="text" name="name" required value={formData.name} onChange={handleInput}
                                    className="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl p-4 text-[16px] font-[800] text-slate-900 outline-none focus:border-[#1E3A8A] focus:bg-white transition-colors"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-slate-500 text-[11px] font-[1000] uppercase tracking-widest block mb-2 px-1">Gender</label>
                                    <select
                                        name="gender" value={formData.gender} onChange={handleInput}
                                        className="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl p-4 text-[16px] font-[800] text-slate-900 outline-none focus:border-[#1E3A8A] focus:bg-white transition-colors appearance-none"
                                    >
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-slate-500 text-[11px] font-[1000] uppercase tracking-widest block mb-2 px-1">Phone Number</label>
                                    <input
                                        type="tel" name="phone" required value={formData.phone} onChange={handleInput} maxLength={10}
                                        className="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl p-4 text-[16px] font-[800] text-slate-900 outline-none focus:border-[#1E3A8A] focus:bg-white transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-slate-500 text-[11px] font-[1000] uppercase tracking-widest block mb-2 px-1">City</label>
                                    <input
                                        type="text" name="city" required value={formData.city} onChange={handleInput}
                                        className="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl p-4 text-[16px] font-[800] text-slate-900 outline-none focus:border-[#1E3A8A] focus:bg-white transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-slate-500 text-[11px] font-[1000] uppercase tracking-widest block mb-2 px-1">Location / Area</label>
                                    <input
                                        type="text" name="location" required value={formData.location} onChange={handleInput}
                                        className="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl p-4 text-[16px] font-[800] text-slate-900 outline-none focus:border-[#1E3A8A] focus:bg-white transition-colors"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-5 bg-[#1E3A8A] text-white rounded-[24px] text-[16px] font-[1000] uppercase tracking-widest shadow-xl shadow-blue-900/20 active:scale-95 transition-all mt-6"
                            >
                                {editingWorker ? 'Update Details' : 'Register Worker'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Workers;
