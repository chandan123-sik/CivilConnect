import React, { useState } from 'react';

const ProviderProfile = () => {
    const [profile, setProfile] = useState({
        name: localStorage.getItem('provider_name') || 'Ramesh Sharma',
        role: localStorage.getItem('provider_category') || 'Main Civil Contractor',
        exp: localStorage.getItem('provider_experience') || '12',
        loc: 'Pune, MH',
        bio: localStorage.getItem('provider_about') || 'Specializing in residential and industrial construction management. Delivering quality engineering since 2012.',
        pricing: localStorage.getItem('provider_pricing') || '₹800/Visit',
        specialities: localStorage.getItem('provider_specialities') || 'Residential Const., RCC Work, Structural Design, Site Mgmt',
        rating: localStorage.getItem('provider_rating') || '4.8',
        hasPlan: !!localStorage.getItem('onboarding_plan_id'),
        profileImg: localStorage.getItem('provider_profile_image')
    });

    const [gallery, setGallery] = useState(() => {
        const savedWork = localStorage.getItem('provider_work_image');
        const savedDesc = localStorage.getItem('provider_work_desc');
        if (savedWork) {
            return [{ img: savedWork, desc: savedDesc || 'Project Milestone' }];
        }
        return []; // Start with empty gallery if no work is uploaded yet
    });

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [formData, setFormData] = useState({ ...profile });

    // Add Work State
    const [isAddWorkOpen, setIsAddWorkOpen] = useState(false);
    const [newWorkImg, setNewWorkImg] = useState(null);
    const [newWorkDesc, setNewWorkDesc] = useState('');

    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = () => {
        setProfile({ ...formData });
        localStorage.setItem('provider_name', formData.name);
        localStorage.setItem('provider_experience', formData.exp);
        localStorage.setItem('provider_about', formData.bio);
        localStorage.setItem('provider_pricing', formData.pricing);
        localStorage.setItem('provider_specialities', formData.specialities);
        localStorage.setItem('provider_rating', formData.rating);
        setIsEditOpen(false);
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

    const specialtiesList = profile.specialities.split(',').filter(s => s.trim());

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-10">
            {/* ── Sticky Header ── */}
            <div className="bg-gradient-to-br from-[#1E3A8A] to-indigo-900 px-4 pt-8 pb-6 rounded-b-[32px] shadow-lg sticky top-0 z-50 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-[1000] text-white tracking-tight m-0">Expert Profile</h1>
                    <p className="text-blue-200/80 text-[15px] font-bold tracking-wide mt-0.5">Manage professional details</p>
                </div>
                <button
                    onClick={() => { setFormData({ ...profile }); setIsEditOpen(true); }}
                    className="bg-white/10 backdrop-blur-md text-white p-2.5 rounded-xl border border-white/20 shadow-sm active:scale-90 transition-transform"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
            </div>

            <div className="px-6 pt-5 space-y-6">
                {/* ── Profile Hero ── */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center">
                    <div className="relative mb-4">
                        <div className="w-24 h-24 rounded-[28px] bg-slate-100 border-2 border-white shadow-md overflow-hidden ring-4 ring-slate-50 flex items-center justify-center">
                            {profile.profileImg ? (
                                <img src={profile.profileImg} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=1E3A8A&color=fff&size=200`} alt="Profile" className="w-full h-full object-cover" />
                            )}
                        </div>
                        {profile.hasPlan && (
                            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-xl border-4 border-white flex items-center justify-center text-white shadow-lg">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                            </div>
                        )}
                    </div>

                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">{profile.name}</h2>
                    <p className="text-slate-500 text-[15px] font-bold tracking-tight mt-1">{profile.role}</p>

                    <div className="mt-4 flex gap-2">
                        {profile.hasPlan && (
                            <div className="bg-blue-50 text-[#1E3A8A] text-[13px] font-bold px-4 py-1.5 rounded-full border border-blue-100 shadow-sm flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                Verified Expert
                            </div>
                        )}
                        <div className="bg-amber-50 text-amber-600 text-[13px] font-bold px-4 py-1.5 rounded-full border border-amber-100 shadow-sm">⭐ {profile.rating} Rating</div>
                    </div>
                </div>

                {/* ── Info Stats Strip ── */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4 border border-slate-100 text-center shadow-sm">
                        <p className="text-slate-500 text-[14px] font-bold tracking-tight mb-1 content-center opacity-80">Experience</p>
                        <p className="text-slate-900 font-[1000] text-lg">{profile.exp} Years</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-slate-100 text-center shadow-sm">
                        <p className="text-slate-500 text-[14px] font-bold tracking-tight mb-1 content-center opacity-80">Base Price</p>
                        <p className="text-slate-900 font-[1000] text-lg">{profile.pricing}</p>
                    </div>
                </div>

                {/* ── Biography ── */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-slate-900 font-extrabold text-[18px]">Professional Bio</h3>
                    </div>
                    <p className="text-slate-600 text-[15.5px] leading-relaxed font-medium">{profile.bio}</p>
                </div>

                {/* ── Skills Section ── */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h3 className="text-slate-900 font-extrabold text-[18px] mb-4">Core Specialities</h3>
                    <div className="flex flex-wrap gap-2">
                        {specialtiesList.map(skill => (
                            <span key={skill} className="bg-[#F8FAFC] text-slate-600 text-[12px] font-black px-3.5 py-2.5 rounded-xl border-2 border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] uppercase tracking-tight">
                                {skill.trim()}
                            </span>
                        ))}
                    </div>
                </div>

                {/* ── Portfolio ── */}
                <div>
                    <div className="flex justify-between items-center mb-4 px-1">
                        <h3 className="text-slate-900 font-extrabold text-[15px]">Recent Work Gallery</h3>
                        <button onClick={() => setIsAddWorkOpen(true)} className="text-blue-600 font-black text-[11px] uppercase tracking-wider active:scale-95 transition-all p-1">+ Add New</button>
                    </div>

                    {gallery.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4">
                            {gallery.map((item, idx) => (
                                <div key={idx} className="aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-200/50 shadow-sm group active:scale-[0.98] transition-all cursor-pointer relative">
                                    <img src={item.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Work" />
                                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                                        <p className="text-white text-[9px] font-[1000] uppercase tracking-widest line-clamp-2 leading-relaxed drop-shadow-md">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white border-2 border-dashed border-slate-100 p-8 rounded-[32px] text-center">
                            <div className="text-3xl mb-2 opacity-30">📸</div>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-relaxed px-4">Your gallery is empty.<br />Upload your best projects to win client trust.</p>
                        </div>
                    )}
                </div>

                {/* ── Account Actions ── */}
                <button
                    onClick={() => { localStorage.clear(); window.location.href = '/'; }}
                    className="w-full py-4.5 rounded-xl bg-red-50 text-red-600 font-black text-[13px] uppercase tracking-[0.2em] border border-red-100 active:scale-95 transition-all outline-none shadow-sm mb-4"
                >
                    Sign Out Account
                </button>
            </div>

            {/* ── Full Profile Edit Bottom Sheet ── */}
            {isEditOpen && (
                <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md bg-white rounded-[40px] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-slate-900 font-[1000] text-xl tracking-tight m-0">Edit Professional Bio</h3>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Keep your info up to date</p>
                            </div>
                            <button onClick={() => setIsEditOpen(false)} className="text-slate-400 p-2 hover:bg-slate-50 rounded-full active:scale-90 transition-transform">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] block mb-2 px-1">Expert Name</label>
                                <input
                                    type="text" name="name" value={formData.name} onChange={handleInput}
                                    className="w-full border-2 border-slate-50 bg-slate-50/50 rounded-2xl p-4 text-sm font-bold text-slate-900 outline-none focus:border-[#1E3A8A]"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="col-span-1">
                                    <label className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] block mb-2 px-1">Exp (Yrs)</label>
                                    <input
                                        type="number" name="exp" value={formData.exp} onChange={handleInput}
                                        className="w-full border-2 border-slate-50 bg-slate-50/50 rounded-2xl p-4 text-sm font-bold text-slate-900 outline-none focus:border-[#1E3A8A]"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] block mb-2 px-1">Price</label>
                                    <input
                                        type="text" name="pricing" value={formData.pricing} onChange={handleInput}
                                        className="w-full border-2 border-slate-50 bg-slate-50/50 rounded-2xl p-4 text-sm font-bold text-slate-900 outline-none focus:border-[#1E3A8A]"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] block mb-2 px-1">Rating</label>
                                    <input
                                        type="text" name="rating" value={formData.rating} onChange={handleInput}
                                        className="w-full border-2 border-slate-50 bg-slate-50/50 rounded-2xl p-4 text-sm font-bold text-slate-900 outline-none focus:border-[#1E3A8A]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] block mb-2 px-1">About Bio</label>
                                <textarea
                                    name="bio" value={formData.bio} onChange={handleInput}
                                    className="w-full h-32 border-2 border-slate-50 bg-slate-50/50 rounded-2xl p-4 text-sm font-bold text-slate-900 outline-none focus:border-[#1E3A8A] resize-none"
                                />
                            </div>

                            <div>
                                <label className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] block mb-2 px-1">Manage Specialities</label>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {formData.specialities.split(',').filter(s => s.trim()).map((skill, idx) => (
                                        <span key={idx} className="bg-slate-50 text-slate-600 text-[10px] font-black px-3.5 py-2 rounded-xl border-2 border-slate-100 uppercase tracking-tight flex items-center gap-1.5 shadow-sm">
                                            {skill.trim()}
                                            <button onClick={() => {
                                                const newSpecs = formData.specialities.split(',').filter(s => s.trim()).filter((_, i) => i !== idx).join(', ');
                                                setFormData(prev => ({ ...prev, specialities: newSpecs }));
                                            }} className="text-slate-400 hover:text-red-500 bg-white rounded-full w-4 h-4 flex flex-col items-center justify-center -mr-1 shadow-sm leading-none pt-0.5 ml-1">×</button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text" id="newSpeciality" placeholder="Type and hit Add..."
                                        className="w-full border-2 border-slate-50 bg-slate-50/50 rounded-2xl p-4 text-sm font-bold text-slate-900 outline-none focus:border-[#1E3A8A]"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                const val = e.target.value.trim();
                                                if (val) {
                                                    const current = formData.specialities.split(',').filter(s => s.trim());
                                                    current.push(val);
                                                    setFormData(prev => ({ ...prev, specialities: current.join(', ') }));
                                                    e.target.value = '';
                                                }
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={(e) => {
                                            const input = document.getElementById('newSpeciality');
                                            const val = input.value.trim();
                                            if (val) {
                                                const current = formData.specialities.split(',').filter(s => s.trim());
                                                current.push(val);
                                                setFormData(prev => ({ ...prev, specialities: current.join(', ') }));
                                                input.value = '';
                                            }
                                        }}
                                        className="bg-[#1E3A8A] text-white px-6 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-lg"
                                    >Add</button>
                                </div>
                            </div>

                            <button
                                onClick={handleSaveProfile}
                                className="w-full py-5 bg-[#1E3A8A] text-white rounded-2xl text-[12px] font-[1000] uppercase tracking-[0.2em] shadow-xl shadow-blue-900/20 active:scale-95 transition-all mt-4"
                            >
                                Save Professional Details
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
        </div>
    );
};

export default ProviderProfile;
