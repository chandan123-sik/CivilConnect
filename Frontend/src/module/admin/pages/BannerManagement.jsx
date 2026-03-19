import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X, Smartphone, Home as HomeIcon, Layout, ImageIcon, Link as LinkIcon, RotateCcw, Edit2, ChevronRight } from 'lucide-react';
import { getBanners } from '../../../api/publicApi';
import { getAllBanners, createBanner, updateBanner, deleteBanner } from '../../../api/adminApi';
import { showToast } from '../../../components/Toast';


const BannerManagement = () => {
    const [activeTab, setActiveTab] = useState('home');
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [formData, setFormData] = useState({ title: '', desc: '', image: null, link: '', position: 'home' });
    const [submitLoading, setSubmitLoading] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });

    useEffect(() => {
        loadBanners();
    }, [activeTab]);

    const loadBanners = async () => {
        setLoading(true);
        try {
            const data = await getAllBanners(activeTab); // activeTab is 'home' or 'get-started' matching Banner type enum
            setBanners(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to load banners:", err);
            setBanners([]);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (banner = null) => {
        if (banner) {
            setEditingBanner(banner);
            setFormData({
                title: banner.title,
                desc: banner.description || '', // Banner model uses 'description'
                image: banner.image,
                link: banner.link || '',
                position: banner.type || activeTab // Banner model uses 'type'
            });
        } else {
            setEditingBanner(null);
            setFormData({ title: '', desc: '', image: null, link: '', position: activeTab });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.desc); // Banner model field is 'description'
            data.append('link', formData.link || '');
            data.append('type', activeTab); // Banner model field is 'type' (enum: 'home', 'get-started')

            if (formData.image instanceof File) {
                data.append('image', formData.image);
            }
            // If editing and image unchanged (string URL), don't re-upload - backend keeps existing


            if (editingBanner) {
                await updateBanner(editingBanner._id, data);
                showToast("Banner updated successfully");
            } else {
                await createBanner(data);
                showToast("Banner created successfully");
            }
            loadBanners();
            setIsModalOpen(false);
        } catch (err) {
            showToast(err.message || "Failed to save banner", "error");
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDelete = (id) => {
        setDeleteConfirm({ show: true, id });
    };

    const confirmDelete = async () => {
        if (!deleteConfirm.id) return;
        try {
            await deleteBanner(deleteConfirm.id);
            showToast("Banner deleted successfully");
            setDeleteConfirm({ show: false, id: null });
            loadBanners();
        } catch (err) {
            showToast(err.message || "Failed to delete banner", "error");
        }
    };

    const currentBanners = banners;

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-[1000] text-slate-900 tracking-tight mb-2">Banner Management</h1>
                    <p className="text-slate-500 font-medium">Customize the visual experience for your users across the platform.</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={loadBanners}
                        className="flex items-center gap-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 px-6 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-slate-200/20 active:scale-95"
                    >
                        <RotateCcw size={20} strokeWidth={3} />
                        Refresh
                    </button>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2.5 bg-green-500 hover:bg-green-600 text-white px-6 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-green-500/20 active:scale-95"
                    >
                        <Plus size={20} strokeWidth={3} />
                        Create New Banner
                    </button>
                </div>
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
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col animate-pulse">
                            <div className="relative h-48 overflow-hidden bg-slate-100"></div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-slate-200 rounded w-full mb-6"></div>
                                <div className="h-4 bg-slate-200 rounded w-1/2 mt-auto pt-4 border-t border-slate-50"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentBanners.map((banner) => (
                        <div key={banner._id} className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-green-500/30 transition-all duration-500 flex flex-col">
                            <div className="relative h-48 overflow-hidden bg-slate-100">
                                <img src={banner.image} alt={banner.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
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
                                        onClick={() => handleDelete(banner._id)}
                                        className="p-2.5 bg-white/95 backdrop-blur-md rounded-xl text-slate-700 hover:text-red-500 hover:bg-white shadow-lg transition-all active:scale-95"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-lg font-black text-slate-900 mb-2 line-clamp-1">{banner.title}</h3>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6 line-clamp-2">{banner.description}</p>
                                <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                                    {banner.link && (
                                        <a href={banner.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 rounded-lg text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:bg-blue-200 transition-colors">
                                            <LinkIcon size={12} /> Link
                                        </a>
                                    )}
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
            )}

            {/* ── Modal Overlay ── */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in transition-all">
                    <form onSubmit={handleSubmit} className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl border border-slate-200/50 animate-in slide-in-from-bottom-8 duration-500">
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
                                type="button"
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
                                    required
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
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Banner Image</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden flex items-center justify-center text-slate-300">
                                        {formData.image ? (
                                            <img src={typeof formData.image === 'string' ? formData.image : URL.createObjectURL(formData.image)} className="w-full h-full object-cover" alt="Banner Preview" />
                                        ) : <ImageIcon size={32} />}
                                    </div>
                                    <div className="flex-1 relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        />
                                        <div className="w-full pl-5 pr-4 py-4 bg-slate-50 border-none ring-1 ring-slate-100 rounded-2xl flex items-center justify-between text-xs font-bold text-slate-400">
                                            <span>{formData.image instanceof File ? formData.image.name : (formData.image ? 'Existing Image' : 'Upload Resource')}</span>
                                            <Layout size={18} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Link (Optional)</label>
                                <div className="relative">
                                    <input
                                        type="url"
                                        value={formData.link}
                                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                        placeholder="e.g., https://yourwebsite.com/promo"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 pl-12 text-slate-900 font-bold text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                                    />
                                    <div className="absolute inset-y-0 left-4 flex items-center text-slate-400">
                                        <LinkIcon size={18} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-8 pt-0 flex gap-4">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 px-4 py-4 rounded-2xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all active:scale-[0.98]"
                                disabled={submitLoading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitLoading || !formData.title || !formData.desc || !formData.image}
                                className="flex-1 px-4 py-4 rounded-2xl bg-green-500 text-white font-black hover:bg-green-600 shadow-xl shadow-green-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
                            >
                                {editingBanner ? 'Apply Changes' : 'Confirm & Publish'}
                            </button>
                        </div>
                    </form>
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

            {/* Custom Delete Confirmation Modal */}
            {deleteConfirm.show && (
                <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-[40px] w-full max-w-sm p-8 shadow-2xl border border-slate-100 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
                        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
                            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight mb-2">Delete Banner?</h2>
                        <p className="text-[13px] text-slate-500 font-medium leading-relaxed mb-8 italic text-center px-4">
                            Are you sure you want to remove this promotional banner? This action is permanent.
                        </p>
                        <div className="flex w-full gap-3">
                            <button onClick={() => setDeleteConfirm({ show: false, id: null })} className="flex-1 py-4 bg-slate-100 text-slate-400 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">No, Cancel</button>
                            <button onClick={confirmDelete} className="flex-1 py-4 bg-red-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-red-700 shadow-lg shadow-red-500/20 active:scale-95 transition-all">Yes, Remove</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BannerManagement;
