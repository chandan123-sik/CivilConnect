import React, { useState, useEffect, useMemo } from 'react';
import { ShieldCheck, Star, AlertCircle, UserCircle, Camera, Plus, X, ChevronRight, Upload } from 'lucide-react';
import { getProviderProfile, updateProviderProfile, submitFeedback, submitReport } from '../../../api/providerApi';
import { getPolicy } from '../../../api/publicApi';
import axiosInstance from '../../../api/axiosInstance';
import { showToast } from '../../../components/Toast';

const ProviderProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showReport, setShowReport] = useState(false);
    const [showResolution, setShowResolution] = useState(false);
    const [reports, setReports] = useState([]);
    const [reportText, setReportText] = useState('');
    const [reportSuccess, setReportSuccess] = useState(false);

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        exp: '',
        city: '',
        address: '',
        bio: '',
        pricing: '',
        specialities: '',
        rating: '',
        profileImg: null,
        aadharImg: null,
        policeImg: null,
        workImg: null,
        workDesc: ''
    });
    const [previews, setPreviews] = useState({
        profile: null,
        aadhar: null,
        police: null,
        work: null
    });
    const [isAddWorkOpen, setIsAddWorkOpen] = useState(false);
    const [showPolicy, setShowPolicy] = useState(false);
    const [showRate, setShowRate] = useState(false);
    const [rating, setRating] = useState(0);

    const [cmsData, setCmsData] = useState({
        policyPoints: [
            { id: 1, title: 'Data Collection', desc: 'CivilConnect collects information to facilitate connections between clients and civil engineering experts.' },
            { id: 2, title: 'Verified Experts', desc: 'All service providers undergo a verification process. We share your request details with selected experts.' },
            { id: 3, title: 'Secure Communication', desc: 'Your contact details are protected. Direct messaging is used only for project-related coordination.' },
            { id: 4, title: 'Payment Reference', desc: 'Pricing shown in materials and services are reference rates and subject to market fluctuations.' }
        ],
        ratingTitle: 'Enjoying CivilConnect?',
        ratingDesc: 'Your feedback helps us provide better experts.'
    });

    const [gallery, setGallery] = useState(() => {
        const savedWork = localStorage.getItem('provider_work_image');
        const savedDesc = localStorage.getItem('provider_work_desc');
        return savedWork ? [{ img: savedWork, desc: savedDesc || 'Project Milestone' }] : [];
    });

    const [newWorkImg, setNewWorkImg] = useState(null);
    const [newWorkDesc, setNewWorkDesc] = useState('');

    const specialtiesList = useMemo(() => {
        if (!profile?.specialities) return [];
        return Array.isArray(profile.specialities) ? profile.specialities.filter(s => s && s.trim()) : [];
    }, [profile]);

    useEffect(() => {
        const load = async () => {
            await Promise.all([fetchProfile(), fetchCMS()]);
        };
        load();
    }, []);

    const fetchCMS = async () => {
        try {
            const policy = await getPolicy();
            if (policy && Array.isArray(policy) && policy.length > 0) {
                setCmsData(prev => ({ ...prev, policyPoints: policy }));
            }
        } catch (err) {
            console.error("Failed to fetch CMS/Policy:", err);
        }
    };

    const fetchProfile = async () => {
        try {
            const [data, reps] = await Promise.all([getProviderProfile(), axiosInstance.get('/provider/report')]);
            if (!data) return;
            setProfile(data);
            
            // Robust parsing for Resolution Center reports
            let reportsData = [];
            if (Array.isArray(reps)) {
                reportsData = reps;
            } else if (reps?.data && Array.isArray(reps.data)) {
                reportsData = reps.data;
            } else if (reps?.data?.data && Array.isArray(reps.data.data)) {
                reportsData = reps.data.data;
            }
            setReports(reportsData);

            setFormData({
                name: data.fullName || '',
                role: data.category || '',
                exp: data.experience || '',
                city: data.city || '',
                address: data.address || '',
                bio: data.about || '',
                pricing: data.pricing || '',
                specialities: Array.isArray(data.specialities) ? data.specialities.join(', ') : '',
                rating: data.rating || '4.5',
                profileImg: null,
                aadharImg: null,
                policeImg: null,
                workImg: null,
                workDesc: data.recentWorkDesc || ''
            });
            setPreviews({
                profile: data.profileImage || null,
                aadhar: data.aadharImage || null,
                police: data.policeVerifyImage || null,
                work: data.workImage || null
            });

            // Keep localStorage in sync so ProviderNavbar/SubscriptionGuard knows the real status
            const localData = JSON.parse(localStorage.getItem('cc_provider_data') || '{}');
            const cleanData = data.provider || data;
            const updated = { ...localData, ...cleanData };
            localStorage.setItem('cc_provider_data', JSON.stringify(updated));

        } catch (err) {
            console.error("Failed to fetch profile:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRateSubmit = async () => {
        try {
            await submitFeedback({ stars: rating });
            showToast("Thanks for your rating! 🌟", 'success');
            setShowRate(false);
            setRating(0);
        } catch (err) {
            showToast("Failed to submit rating", 'error');
        }
    };

    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = async () => {
        try {
            const data = new FormData();
            data.append('fullName', formData.name);
            data.append('experience', formData.exp);
            data.append('city', formData.city);
            data.append('address', formData.address);
            data.append('about', formData.bio);
            data.append('pricing', formData.pricing);
            data.append('recentWorkDesc', formData.workDesc);
            
            const specArr = (typeof formData.specialities === 'string' ? formData.specialities.split(',') : (Array.isArray(formData.specialities) ? formData.specialities : [])).map(s => s.trim()).filter(s => s);
            data.append('specialities', specArr.join(','));

            if (formData.profileImg) data.append('profileImage', formData.profileImg);
            if (formData.aadharImg) data.append('aadharImage', formData.aadharImg);
            if (formData.policeImg) data.append('policeVerifyImage', formData.policeImg);
            if (formData.workImg) data.append('workImage', formData.workImg);

            await updateProviderProfile(data);
            await fetchProfile();
            setIsEditOpen(false);
            showToast("Profile updated successfully", 'success');
        } catch (err) {
            showToast("Failed to update profile", 'error');
        }
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, [`${type}Img`]: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => ({ ...prev, [type]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddWorkImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewWorkImg(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveNewWork = () => {
        if (newWorkImg && newWorkDesc) {
            setGallery(prev => [{ img: newWorkImg, desc: newWorkDesc }, ...prev]);
            setIsAddWorkOpen(false);
            setNewWorkImg(null);
            setNewWorkDesc('');
        }
    };


    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-10">
            {/* ── Sticky Header ── */}
            <div className="bg-gradient-to-br from-[#1E3A8A] to-indigo-900 px-4 pt-8 pb-6 rounded-b-[32px] shadow-lg sticky top-0 z-50 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-[1000] text-white tracking-tight m-0">Expert Profile</h1>
                    <p className="text-blue-200/80 text-[15px] font-bold tracking-wide mt-0.5">Manage professional details</p>
                </div>
            </div>

            <div className="px-6 pt-4 space-y-4">
                {/* ── Profile Hero ── */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col items-center">
                    <div className="relative mb-4">
                        <div className="w-24 h-24 rounded-[28px] bg-slate-100 border-2 border-white shadow-md overflow-hidden ring-4 ring-slate-50 flex items-center justify-center">
                            {profile?.profileImage ? (
                                <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                            ) : (
                                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.fullName || 'Provider')}&background=1E3A8A&color=fff&size=200`} alt="Profile" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                            )}
                        </div>
                        {profile?.isApproved && (
                            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-xl border-4 border-white flex items-center justify-center text-white shadow-lg">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                            </div>
                        )}
                    </div>

                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">{profile?.fullName}</h2>
                    <p className="text-slate-500 text-[15px] font-bold tracking-tight mt-1">{profile?.category}</p>
                    <p className="text-slate-400 text-[12px] font-bold mt-1 uppercase tracking-widest">{profile?.address}, {profile?.city}</p>

                    <div className="mt-4 flex gap-2">
                        {profile?.isApproved && (
                            <div className="bg-blue-50 text-[#1E3A8A] text-[13px] font-bold px-4 py-1.5 rounded-full border border-blue-100 shadow-sm flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                Verified Expert
                            </div>
                        )}
                        <div className="bg-amber-50 text-amber-600 text-[13px] font-bold px-4 py-1.5 rounded-full border border-amber-100 shadow-sm">⭐ {(profile?.rating ?? 4.5).toFixed(1)} Rating</div>
                    </div>
                </div>

                {/* ── Info Stats Strip ── */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-3 border border-slate-100 text-center shadow-sm">
                        <p className="text-slate-500 text-[12px] font-bold tracking-tight mb-0.5 opacity-80 uppercase">Experience</p>
                        <p className="text-slate-900 font-[1000] text-[16px]">{profile?.experience ?? 0} Years</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-slate-100 text-center shadow-sm">
                        <p className="text-slate-500 text-[12px] font-bold tracking-tight mb-0.5 opacity-80 uppercase">Base Price</p>
                        <p className="text-slate-900 font-[1000] text-[16px]">{profile?.pricing || '₹0'}</p>
                    </div>
                </div>

                {/* ── Biography ── */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-slate-900 font-extrabold text-[16px]">Professional Bio</h3>
                    </div>
                    <p className="text-slate-600 text-[14px] leading-relaxed font-medium">{profile?.about}</p>
                </div>

                {/* ── Skills Section ── */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <h3 className="text-slate-900 font-extrabold text-[16px] mb-3">Core Specialities</h3>
                    <div className="flex flex-wrap gap-2">
                        {specialtiesList.map(skill => (
                            <span key={skill} className="bg-[#F8FAFC] text-slate-600 text-[11px] font-black px-3 py-2 rounded-xl border border-slate-100 uppercase tracking-tight">
                                {skill.trim()}
                            </span>
                        ))}
                    </div>
                </div>

                {/* ── Identity Verification ── */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <h3 className="text-slate-900 font-extrabold text-[15px] mb-4">Identity Verification</h3>
                    <div className="flex flex-col gap-3">
                        <div className="bg-[#F0FDF4] p-3 rounded-xl border border-[#DCFCE7] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                                    <ShieldCheck size={16} />
                                </div>
                                <p className="text-slate-700 text-[13px] font-bold">Aadhar Card Status</p>
                            </div>
                            <span className={`font-black text-[10px] uppercase tracking-wider bg-white/50 px-2 py-1 rounded-md ${profile?.approvalStatus === 'approved' ? 'text-[#15803D]' : 'text-amber-600'}`}>
                                {profile?.approvalStatus === 'approved' ? '✓ Verified' : '● Pending'}
                            </span>
                        </div>
                        <div className="bg-[#F0FDF4] p-3 rounded-xl border border-[#DCFCE7] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                                    <ShieldCheck size={16} />
                                </div>
                                <p className="text-slate-700 text-[13px] font-bold">Police Verification</p>
                            </div>
                            <span className={`font-black text-[10px] uppercase tracking-wider bg-white/50 px-2 py-1 rounded-md ${profile?.approvalStatus === 'approved' ? 'text-[#15803D]' : 'text-amber-600'}`}>
                                {profile?.approvalStatus === 'approved' ? '✓ Verified' : '● Pending'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Portfolio ── */}
                <div>
                    <div className="flex justify-between items-center mb-4 px-1">
                        <h3 className="text-slate-900 font-extrabold text-[15px]">Recent Work Gallery</h3>
                        <button onClick={() => setIsAddWorkOpen(true)} className="text-blue-600 font-black text-[11px] uppercase tracking-wider active:scale-95 transition-all p-1">+ Add New</button>
                    </div>

                    {profile?.workImage ? (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-200/50 shadow-sm group active:scale-[0.98] transition-all cursor-pointer relative">
                                <img
                                    src={profile.workImage}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    alt="Work"
                                    loading="lazy"
                                    decoding="async"
                                />
                                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                                    <p className="text-white text-[9px] font-[1000] uppercase tracking-widest line-clamp-2 leading-relaxed drop-shadow-md">Recent Project Highlight</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white border-2 border-dashed border-slate-100 p-8 rounded-[32px] text-center">
                            <div className="text-3xl mb-2 opacity-30">📸</div>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-relaxed px-4">Your gallery is empty.<br />Upload your best projects to win client trust.</p>
                        </div>
                    )}
                </div>

                {/* ── Support & Settings ── */}
                <div className="space-y-2 mt-[-8px]">
                    <p className="text-slate-400 text-[10px] font-[1000] uppercase tracking-[0.2em] px-1">Account & Support</p>
                    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                        <button
                            onClick={() => setIsEditOpen(true)}
                            className="w-full p-4 flex items-center justify-between active:bg-slate-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1E3A8A]">
                                    <UserCircle size={18} />
                                </div>
                                <span className="text-slate-700 font-extrabold text-[15px]">Edit Profile & Professional Info</span>
                            </div>
                            <span className="text-slate-300 text-xl font-light">›</span>
                        </button>
                        <hr className="border-slate-50 mx-4" />
                        <button
                            onClick={() => setShowPolicy(true)}
                            className="w-full p-4 flex items-center justify-between active:bg-slate-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#1E3A8A]">
                                    <ShieldCheck size={18} />
                                </div>
                                <span className="text-slate-700 font-extrabold text-[15px]">Safety & Privacy Policy</span>
                            </div>
                            <span className="text-slate-300 text-xl font-light">›</span>
                        </button>
                        <hr className="border-slate-50 mx-4" />
                        <button
                            onClick={() => setShowResolution(true)}
                            className="w-full p-4 flex items-center justify-between active:bg-slate-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                                    <ShieldCheck size={18} />
                                </div>
                                <span className="text-slate-700 font-extrabold text-[15px]">Resolution Center</span>
                            </div>
                            <span className="text-slate-300 text-xl font-light">›</span>
                        </button>
                        <hr className="border-slate-50 mx-4" />
                        <button
                            onClick={() => setShowRate(true)}
                            className="w-full p-4 flex items-center justify-between active:bg-slate-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                                    <Star size={18} />
                                </div>
                                <span className="text-slate-700 font-extrabold text-[15px]">Rate CivilConnect App</span>
                            </div>
                            <span className="text-slate-300 text-xl font-light">›</span>
                        </button>
                        <hr className="border-slate-50 mx-4" />
                        <button
                            onClick={() => setShowReport(true)}
                            className="w-full p-4 flex items-center justify-between active:bg-slate-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
                                    <AlertCircle size={18} />
                                </div>
                                <span className="text-slate-700 font-extrabold text-[15px]">Report an Issue</span>
                            </div>
                            <span className="text-slate-300 text-xl font-light">›</span>
                        </button>
                    </div>
                </div>

                {/* ── Account Actions ── */}
                <button
                    onClick={() => { 
                        localStorage.removeItem('cc_provider_token');
                        localStorage.removeItem('cc_provider_data');
                        localStorage.removeItem('cc_current_role');
                        localStorage.removeItem('cc_temp_token');
                        localStorage.removeItem('profile_complete');
                        localStorage.removeItem('cc_provider_category');
                        localStorage.removeItem('role_category');
                        window.location.href = '/'; 
                    }}
                    className="w-full py-4.5 rounded-xl bg-red-50 text-red-600 font-black text-[13px] uppercase tracking-[0.2em] border border-red-100 active:scale-95 transition-all outline-none shadow-sm mb-2"
                >
                    Sign Out Account
                </button>
                <p className="text-center text-slate-400 text-[10px] font-black uppercase tracking-widest opacity-60">Version 2.0.4 Premium</p>
            </div>

            {/* ── Full Profile Edit Bottom Sheet ── */}
            {isEditOpen && (
                <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/40 backdrop-blur-sm p-0">
                    <div className="w-full max-w-lg bg-white rounded-t-[40px] shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col max-h-[95vh] overflow-hidden">
                        {/* Fixed Header */}
                        <div className="flex justify-between items-center p-6 border-b border-slate-50 bg-white z-10 shrink-0">
                            <div>
                                <h3 className="text-slate-900 font-[1000] text-xl tracking-tight m-0">Professional Biography</h3>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1 opacity-70">Expert Profile Management</p>
                            </div>
                            <button onClick={() => setIsEditOpen(false)} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all active:scale-95">
                                <X size={20} strokeWidth={3} />
                            </button>
                        </div>

                        {/* Scrollable Body */}
                        <div className="flex-1 overflow-y-auto p-5 bg-slate-50/20 custom-scrollbar space-y-4 min-h-0">
                            
                            {/* Profile Image Section */}
                            <div className="flex items-center gap-5 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm mb-2">
                                <div className="relative shrink-0">
                                    <div className="w-20 h-20 rounded-[28px] bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                                        {previews.profile ? (
                                            <img src={previews.profile} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <Camera className="w-6 h-6 text-slate-400" />
                                        )}
                                    </div>
                                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={e => handleFileChange(e, 'profile')} />
                                    <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#1E3A8A] rounded-lg flex items-center justify-center text-white shadow-lg border-2 border-white pointer-events-none">
                                        <Plus size={16} strokeWidth={3} />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-slate-800 font-extrabold text-[15px] mb-1">Profile Photo</h4>
                                    <p className="text-slate-400 text-[11px] font-bold">Recommended: Square portrait</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {/* Basic Info */}
                                <div className="p-4 bg-white rounded-[24px] border border-slate-100 shadow-sm">
                                    <label className="text-slate-400 text-[9px] font-[1000] uppercase tracking-[0.2em] block mb-2 px-1">Professional Full Name</label>
                                    <input
                                        type="text" name="name" value={formData.name} onChange={handleInput}
                                        className="w-full bg-slate-50/50 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 border-2 border-transparent focus:border-[#1E3A8A] transition-all outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-4 bg-white rounded-[24px] border border-slate-100 shadow-sm">
                                        <label className="text-slate-400 text-[9px] font-[1000] uppercase tracking-[0.2em] block mb-2 px-1">Exp (Yrs)</label>
                                        <input
                                            type="number" name="exp" value={formData.exp} onChange={handleInput}
                                            className="w-full bg-slate-50/50 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 border-2 border-transparent focus:border-[#1E3A8A] transition-all outline-none"
                                        />
                                    </div>
                                    <div className="p-4 bg-white rounded-[24px] border border-slate-100 shadow-sm">
                                        <label className="text-slate-400 text-[9px] font-[1000] uppercase tracking-[0.2em] block mb-2 px-1">Base Price</label>
                                        <input
                                            type="text" name="pricing" value={formData.pricing} onChange={handleInput}
                                            className="w-full bg-slate-50/50 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 border-2 border-transparent focus:border-[#1E3A8A] transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-4 bg-white rounded-[24px] border border-slate-100 shadow-sm">
                                        <label className="text-slate-400 text-[9px] font-[1000] uppercase tracking-[0.2em] block mb-2 px-1">Service City</label>
                                        <input
                                            type="text" name="city" value={formData.city} onChange={handleInput}
                                            className="w-full bg-slate-50/50 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 border-2 border-transparent focus:border-[#1E3A8A] transition-all outline-none"
                                        />
                                    </div>
                                    <div className="p-4 bg-white rounded-[24px] border border-slate-100 shadow-sm">
                                        <label className="text-slate-400 text-[9px] font-[1000] uppercase tracking-[0.2em] block mb-2 px-1">Area Label</label>
                                        <input
                                            type="text" name="address" value={formData.address} onChange={handleInput}
                                            className="w-full bg-slate-50/50 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 border-2 border-transparent focus:border-[#1E3A8A] transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="p-4 bg-white rounded-[24px] border border-slate-100 shadow-sm">
                                    <label className="text-slate-400 text-[9px] font-[1000] uppercase tracking-[0.2em] block mb-2 px-1">Professional Bio</label>
                                    <textarea
                                        name="bio" value={formData.bio} onChange={handleInput}
                                        className="w-full h-24 bg-slate-50/50 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 border-2 border-transparent focus:border-[#1E3A8A] transition-all outline-none resize-none leading-relaxed"
                                    />
                                </div>

                                {/* Specialities */}
                                <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                                    <label className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] block mb-4">Manage Specialities</label>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {(typeof formData.specialities === 'string' ? formData.specialities.split(',') : (Array.isArray(formData.specialities) ? formData.specialities : [])).filter(s => s && s.trim()).map((skill, idx) => (
                                            <span key={idx} className="bg-indigo-50/50 text-[#1E3A8A] text-[10px] font-black px-4 py-2.5 rounded-xl border border-indigo-100 uppercase tracking-tight flex items-center gap-2 shadow-sm">
                                                {skill.trim()}
                                                <button onClick={() => {
                                                    const currentList = typeof formData.specialities === 'string' ? formData.specialities.split(',') : (Array.isArray(formData.specialities) ? formData.specialities : []);
                                                    const newSpecs = currentList.filter(s => s && s.trim()).filter((_, i) => i !== idx).join(', ');
                                                    setFormData(prev => ({ ...prev, specialities: newSpecs }));
                                                }} className="hover:text-red-500 transition-colors">
                                                    <X size={14} strokeWidth={3} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text" id="newSpecialityModal" placeholder="Add (e.g. Tiling)..."
                                            className="w-full border-2 border-slate-50 bg-slate-50/50 rounded-2xl p-4 text-sm font-bold text-slate-900 outline-none focus:border-[#1E3A8A] transition-all"
                                        />
                                        <button
                                            onClick={() => {
                                                const input = document.getElementById('newSpecialityModal');
                                                const val = input.value.trim();
                                                if (val) {
                                                    const current = formData.specialities ? formData.specialities.split(',').map(s => s.trim()) : [];
                                                    current.push(val);
                                                    setFormData(prev => ({ ...prev, specialities: current.join(', ') }));
                                                    input.value = '';
                                                }
                                            }}
                                            className="bg-[#1E3A8A] text-white px-8 rounded-2xl font-[1000] text-sm uppercase transition-all shadow-lg active:scale-95"
                                        >+</button>
                                    </div>
                                </div>

                                {/* Identity Verification Documents */}
                                <div className="space-y-3">
                                    <label className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] block px-1">Identity Verification Documents</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="relative aspect-[16/10] bg-white rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-2 overflow-hidden group">
                                            {previews.aadhar ? (
                                                <img src={previews.aadhar} className="w-full h-full object-cover rounded-lg" />
                                            ) : (
                                                <>
                                                    <ShieldCheck className="w-6 h-6 text-slate-300 mb-1" />
                                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-center">Update Aadhar Card</p>
                                                </>
                                            )}
                                            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileChange(e, 'aadhar')} />
                                        </div>
                                        <div className="relative aspect-[16/10] bg-white rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-2 overflow-hidden group">
                                            {previews.police ? (
                                                <img src={previews.police} className="w-full h-full object-cover rounded-lg" />
                                            ) : (
                                                <>
                                                    <ShieldCheck className="w-6 h-6 text-slate-300 mb-1" />
                                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-center">Police Verification</p>
                                                </>
                                            )}
                                            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileChange(e, 'police')} />
                                        </div>
                                    </div>
                                </div>

                                {/* Showcase Project */}
                                <div className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4">
                                    <label className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] block">Showcase Recent Project</label>
                                    <div className="relative aspect-video bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
                                        {previews.work ? (
                                            <img src={previews.work} className="w-full h-full object-cover" />
                                        ) : (
                                            <Upload className="w-8 h-8 text-slate-300" />
                                        )}
                                        <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileChange(e, 'work')} />
                                    </div>
                                    <textarea
                                        name="workDesc" value={formData.workDesc} onChange={handleInput}
                                        placeholder="Brief project description..."
                                        className="w-full border-2 border-slate-50 bg-slate-50/50 rounded-2xl p-4 text-xs font-bold text-slate-900 outline-none focus:border-[#1E3A8A] resize-none h-20"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Fixed Footer */}
                        <div className="p-6 border-t border-slate-50 bg-white shrink-0">
                            <button
                                onClick={handleSaveProfile}
                                className="w-full py-4.5 bg-slate-900 text-white rounded-2xl text-[11px] font-[1000] uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all"
                            >
                                Update Professional Info
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* ── Add New Work Bottom Sheet ── */}
            {isAddWorkOpen && (
                <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md bg-white rounded-[40px] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-slate-900 font-[1000] text-xl tracking-tight m-0">Add Custom Work</h3>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Upload to your gallery</p>
                            </div>
                            <button onClick={() => setIsAddWorkOpen(false)} className="text-slate-400 p-2 hover:bg-slate-50 rounded-full active:scale-90 transition-transform">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="relative group">
                                <div className="w-full h-44 rounded-[32px] bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden transition-all duration-300 focus-within:border-[#1E3A8A]">
                                    {newWorkImg ? (
                                        <img src={newWorkImg} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center">
                                            <div className="text-3xl mb-2">📸</div>
                                            <p className="text-[12px] font-black mt-1.5 uppercase tracking-tighter text-slate-400">Tap to Upload Image</p>
                                        </div>
                                    )}
                                </div>
                                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleAddWorkImage} />
                            </div>

                            <div>
                                <label className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] block mb-2 px-1">Project Milestone Name</label>
                                <input
                                    type="text" value={newWorkDesc} onChange={(e) => setNewWorkDesc(e.target.value)}
                                    placeholder="e.g. Dream Home Renovation"
                                    className="w-full border-2 border-slate-50 bg-slate-50/50 rounded-2xl p-4 text-sm font-bold text-slate-900 outline-none focus:border-[#1E3A8A]"
                                />
                            </div>

                            <button
                                onClick={handleSaveNewWork}
                                disabled={!newWorkImg || !newWorkDesc}
                                className="w-full py-5 bg-[#1E3A8A] text-white rounded-2xl text-[12px] font-[1000] uppercase tracking-[0.2em] shadow-xl shadow-blue-900/20 active:scale-95 transition-all mt-4 disabled:opacity-50 disabled:active:scale-100"
                            >
                                Upload to Gallery
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* ── Privacy Policy Page Overlay ── */}
            {showPolicy && (
                <div className="fixed inset-0 z-[1000] bg-white overflow-y-auto animate-in fade-in duration-300">
                    <div className="p-6">
                        <div className="flex items-center gap-4 mb-10">
                            <button
                                onClick={() => setShowPolicy(false)}
                                className="bg-slate-50 text-slate-900 w-11 h-11 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm active:scale-90 transition-transform text-2xl"
                            >
                                ‹
                            </button>
                            <h3 className="text-slate-900 font-[1000] text-xl tracking-tight m-0">Privacy Policy</h3>
                        </div>

                        <div className="space-y-8 font-['Inter',sans-serif] text-slate-600 leading-relaxed">
                            {cmsData.policyPoints.map((point, idx) => (
                                <div key={point.id} className="animate-in slide-in-from-bottom-[10px] duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                                    <h4 className="text-slate-900 font-extrabold text-[17px] mb-2">{point.id}. {point.title}</h4>
                                    <p className="text-[15px]">{point.desc}</p>
                                </div>
                            ))}
                        </div>


                        <div className="mt-12 p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest text-center">Last Updated: March 2026</p>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Rate App Modal ── */}
            {showRate && (
                <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md bg-white rounded-[40px] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-slate-900 font-[1000] text-xl tracking-tight m-0">{cmsData.ratingTitle}</h3>
                            <button onClick={() => setShowRate(false)} className="text-slate-400 p-2 hover:bg-slate-50 rounded-full active:scale-90 transition-transform">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <p className="text-slate-500 text-[14px] font-bold text-center mb-6">{cmsData.ratingDesc}</p>


                        <div className="flex justify-center gap-4 mb-8">
                            {[1, 2, 3, 4, 5].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setRating(prev => prev === s ? s - 1 : s)}
                                    className="text-4xl active:scale-90 transition-transform"
                                >
                                    {s <= rating ? '⭐' : '☆'}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleRateSubmit}
                            disabled={rating === 0}
                            className={`w-full py-5 rounded-2xl text-[12px] font-[1000] uppercase tracking-[0.2em] shadow-xl transition-all ${rating > 0 ? 'bg-[#1E3A8A] text-white shadow-blue-900/20' : 'bg-slate-100 text-slate-300 outline-none'}`}
                        >
                            Submit Application Review
                        </button>
                        <button onClick={() => setShowRate(false)} className="w-full mt-4 text-slate-400 font-black text-[11px] uppercase tracking-widest text-center">Later</button>
                    </div>
                </div>
            )}

            {/* ── Report Issue Modal ── */}
            {showReport && (
                <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setShowReport(false)}>
                    <div className="w-full max-w-[380px] bg-white rounded-t-[40px] p-8 shadow-2xl relative" onClick={e => e.stopPropagation()} style={{ animation: 'slideInRight 0.3s ease-out' }}>
                        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />
                        
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-500 shadow-inner">
                                <AlertCircle size={24} />
                            </div>
                            <div>
                                <h3 className="text-slate-900 font-[1000] text-[18px]">Report an Issue</h3>
                                <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest mt-0.5">Let us know what's wrong</p>
                            </div>
                        </div>

                        {reportSuccess ? (
                            <div className="py-12 text-center animate-in fade-in zoom-in duration-300">
                                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-sm border border-emerald-100">✓</div>
                                <h3 className="text-xl font-[1000] text-slate-900 mb-2 uppercase tracking-tight">Report Sent!</h3>
                                <p className="text-slate-500 text-sm font-medium">Our support team will review your issue and reach out to you shortly.</p>
                            </div>
                        ) : (
                            <>
                                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-6 shadow-inner">
                                    <textarea
                                        value={reportText}
                                        onChange={(e) => setReportText(e.target.value)}
                                        placeholder="Describe your issue with the app..."
                                        className="w-full bg-transparent border-none outline-none resize-none text-[14px] text-slate-800 font-medium placeholder:text-slate-400 min-h-[120px]"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowReport(false)}
                                        className="flex-1 py-4 bg-slate-100 rounded-2xl text-[12px] font-[1000] uppercase tracking-widest text-slate-500 hover:bg-slate-200 transition-all font-black outline-none"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (!reportText.trim()) return;
                                            try {
                                                await submitReport({ message: reportText });
                                                setReportSuccess(true);
                                                setReportText('');
                                                setTimeout(() => {
                                                    setReportSuccess(false);
                                                    setShowReport(false);
                                                }, 2500);
                                            } catch (err) {
                                                console.error(err);
                                            }
                                        }}
                                        disabled={!reportText.trim()}
                                        className={`flex-1 py-4 rounded-2xl text-[12px] font-[1000] uppercase tracking-widest transition-all outline-none ${reportText.trim() ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 active:scale-95' : 'bg-slate-100 text-slate-300'}`}
                                    >
                                        Send Report
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Resolution Center Modal */}
            {showResolution && (
                <div style={{ position: 'fixed', inset: 0, background: '#fff', zIndex: 1000, overflowY: 'auto', animation: 'slideUp 0.3s ease-out' }}>
                    <div style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
                            <button onClick={() => setShowResolution(false)} style={{ border: 'none', background: '#F3F4F6', width: '40px', height: '40px', borderRadius: '12px', fontSize: '20px' }}>‹</button>
                            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: '800' }}>Resolution Center</h3>
                        </div>

                        {reports.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                                <div style={{ fontSize: '48px', marginBottom: 16 }}>🛡️</div>
                                <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#1F2937', marginBottom: 8 }}>All Clear!</h4>
                                <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: 1.5 }}>You haven't filed any reports yet. Our support team is here if you ever face issues.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {reports.map(rep => (
                                    <div key={rep._id} style={{ 
                                        padding: '20px', 
                                        borderRadius: '24px', 
                                        background: '#fff', 
                                        border: '1px solid #F1F5F9',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                            <span style={{ 
                                                fontSize: '10px', 
                                                fontWeight: '900', 
                                                textTransform: 'uppercase', 
                                                padding: '4px 10px', 
                                                borderRadius: '8px',
                                                background: rep.status === 'Resolved' ? '#DCFCE7' : '#FEF9C3',
                                                color: rep.status === 'Resolved' ? '#15803D' : '#854D0E'
                                            }}>
                                                {rep.status}
                                            </span>
                                            <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600' }}>
                                                {new Date(rep.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                            </span>
                                        </div>
                                        <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#1F2937', fontWeight: '600', lineHeight: 1.5 }}>
                                            {rep.message}
                                        </p>
                                        
                                        {rep.reply && (
                                            <div style={{ 
                                                marginTop: 12, 
                                                padding: '16px', 
                                                background: '#F0F9FF', 
                                                borderRadius: '16px', 
                                                border: '1px solid #E0F2FE' 
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                                    <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#1E3A8A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '900' }}>A</div>
                                                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#1E3A8A', textTransform: 'uppercase' }}>Admin Reply</span>
                                                </div>
                                                <p style={{ margin: 0, fontSize: '13px', color: '#1E3A8A', fontWeight: '500', lineHeight: 1.5 }}>
                                                    {rep.reply}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
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

                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }

                .animate-in {
                    animation-fill-mode: both;
                    animation-duration: 300ms;
                }

                .slide-in-from-bottom {
                    animation-name: slideInBottom;
                }

                @keyframes slideInBottom {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default ProviderProfile;
