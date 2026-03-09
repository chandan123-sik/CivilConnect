import React, { useState } from 'react';
import { Image, Plus, Trash2, Edit2, Layout, Smartphone, Home as HomeIcon, ChevronRight, X, Upload } from 'lucide-react';

const BannerManagement = () => {
    const [activeTab, setActiveTab] = useState('get-started');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);

    // Initial States with LocalStorage support
    const [getStartedBanners, setGetStartedBanners] = useState(() => {
        const saved = localStorage.getItem('cc_get_started_banners');
        return saved ? JSON.parse(saved) : [
            { id: 1, title: "Let's get started", desc: "Build your dream project with verified experts and quality materials today.", img: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format" },
            { id: 2, title: "Manage Everything", desc: "From labor tracking to material audits, manage your site directly with ease.", img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format" },
        ];
    });

    const [homeBanners, setHomeBanners] = useState(() => {
        const saved = localStorage.getItem('cc_home_banners');
        return saved ? JSON.parse(saved) : [
            { id: 1, title: 'Premium Construction Materials', desc: 'Get daily updated rates for cement, steel and more.', img: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80' },
            { id: 2, title: 'Verified Expert Manpower', desc: 'Directly connect with top-rated contractors & engineers.', img: 'https://images.unsplash.com/photo-1503387762-592dea58ef21?w=800&q=80' }
        ];
    });

    // Persist to localStorage whenever state changes
    React.useEffect(() => {
        localStorage.setItem('cc_get_started_banners', JSON.stringify(getStartedBanners));
    }, [getStartedBanners]);

    React.useEffect(() => {
        localStorage.setItem('cc_home_banners', JSON.stringify(homeBanners));
    }, [homeBanners]);

    const [formData, setFormData] = useState({ title: '', desc: '', img: '' });

    const handleOpenModal = (banner = null) => {
        if (banner) {
            setEditingBanner(banner);
            setFormData({ title: banner.title, desc: banner.desc, img: banner.img });
        } else {
            setEditingBanner(null);
            setFormData({ title: '', desc: '', img: '' });
        }
        setIsModalOpen(true);
    };

    const handleSave = () => {
        const targetList = activeTab === 'get-started' ? getStartedBanners : homeBanners;
        const setTargetList = activeTab === 'get-started' ? setGetStartedBanners : setHomeBanners;

        if (editingBanner) {
            setTargetList(targetList.map(b => b.id === editingBanner.id ? { ...b, ...formData } : b));
        } else {
            const newBanner = { id: Date.now(), ...formData };
            setTargetList([...targetList, newBanner]);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        const setTargetList = activeTab === 'get-started' ? setGetStartedBanners : setHomeBanners;
        setTargetList(prev => prev.filter(b => b.id !== id));
    };

    const currentBanners = activeTab === 'get-started' ? getStartedBanners : homeBanners;

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-[1000] text-slate-900 tracking-tight mb-2">Banner Management</h1>
                    <p className="text-slate-500 font-medium">Customize the visual experience for your users across the platform.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2.5 bg-green-500 hover:bg-green-600 text-white px-6 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-green-500/20 active:scale-95"
                >
                    <Plus size={20} strokeWidth={3} />
                    Create New Banner
                </button>
            </div>

            {/* ── Tabs ── */}
            <div className="flex p-1.5 bg-slate-100 rounded-2xl w-fit border border-slate-200 shadow-sm">
                <button
                    onClick={() => setActiveTab('get-started')}
                    className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'get-started' ? 'bg-white text-green-600 shadow-md ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
                >
                    <Smartphone size={18} />
                    Get Started (Onboarding)
                </button>
                <button
                    onClick={() => setActiveTab('home')}
                    className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'home' ? 'bg-white text-green-600 shadow-md ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
                >
                    <HomeIcon size={18} />
                    User Home Dashboard
                </button>
            </div>

            {/* ── Banner Grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentBanners.map((banner) => (
                    <div key={banner.id} className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-green-500/30 transition-all duration-500 flex flex-col">
                        <div className="relative h-48 overflow-hidden bg-slate-100">
                            <img src={banner.img} alt={banner.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                                <span className="px-2 py-1 bg-green-500 text-white text-[9px] font-black uppercase tracking-wider rounded-md">Published</span>
                            </div>
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button
                                    onClick={() => handleOpenModal(banner)}
                                    className="p-2.5 bg-white/95 backdrop-blur-md rounded-xl text-slate-700 hover:text-green-600 hover:bg-white shadow-lg transition-all active:scale-95"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(banner.id)}
                                    className="p-2.5 bg-white/95 backdrop-blur-md rounded-xl text-slate-700 hover:text-red-500 hover:bg-white shadow-lg transition-all active:scale-95"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <h3 className="text-lg font-black text-slate-900 mb-2 line-clamp-1">{banner.title}</h3>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6 line-clamp-2">{banner.desc}</p>
                            <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    Seq: {banner.id.toString().slice(-4)}
                                </div>
                                <div className="flex items-center gap-1 text-green-600 font-bold text-xs cursor-pointer hover:translate-x-1 transition-all">
                                    Configure
                                    <ChevronRight size={14} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* ── Add Card ── */}
                <div
                    onClick={() => handleOpenModal()}
                    className="rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 min-h-[300px] hover:bg-slate-50 hover:border-green-500/50 transition-all cursor-pointer group"
                >
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                        <Plus size={28} className="text-slate-400 group-hover:text-green-600" />
                    </div>
                    <p className="text-slate-900 font-black mb-1">Add Dynamic Banner</p>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Upload image and details</p>
                </div>
            </div>

            {/* ── Modal Overlay ── */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in transition-all">
                    <div className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl border border-slate-200/50 animate-in slide-in-from-bottom-8 duration-500">
                        {/* Modal Header */}
                        <div className="p-8 pb-0 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-50 text-green-600 rounded-xl">
                                    <Plus size={20} />
                                </div>
                                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                                    {editingBanner ? 'Edit Banner' : 'Create New Banner'}
                                </h2>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Banner Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., Premium Cement Quality"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 font-bold text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Description</label>
                                <textarea
                                    rows="3"
                                    value={formData.desc}
                                    onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                                    placeholder="What should the sub-text say?"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 font-bold text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all resize-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Image URL</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formData.img}
                                        onChange={(e) => setFormData({ ...formData, img: e.target.value })}
                                        placeholder="Paste high-res Unsplash link"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 pl-12 text-slate-900 font-bold text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                                    />
                                    <div className="absolute inset-y-0 left-4 flex items-center text-slate-400">
                                        <Upload size={18} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-8 pt-0 flex gap-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 px-4 py-4 rounded-2xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all active:scale-[0.98]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!formData.title || !formData.img}
                                className="flex-1 px-4 py-4 rounded-2xl bg-green-500 text-white font-black hover:bg-green-600 shadow-xl shadow-green-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
                            >
                                {editingBanner ? 'Apply Changes' : 'Confirm & Publish'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* ── Preview Info ── */}
            <div className="bg-green-50 rounded-3xl p-6 border border-green-100 flex items-start gap-4 mt-8">
                <div className="p-3 bg-green-500 rounded-2xl text-white">
                    <Layout size={20} />
                </div>
                <div>
                    <h4 className="text-green-900 font-black text-sm uppercase tracking-wider mb-1">Platform-Wide Sync</h4>
                    <p className="text-green-700/80 text-sm font-medium leading-relaxed max-w-2xl">
                        Changes to these banners are reflected in real-time across the User Home Dashboard and Initial Onboarding.
                        Ensure high-resolution images (at least 1200px wide) for the best visual premium experience.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BannerManagement;
