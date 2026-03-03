import React, { useState } from 'react';

const ProviderProfile = () => {
    const [profile, setProfile] = useState({
        name: 'Ramesh Sharma',
        role: 'Main Civil Contractor',
        exp: '12 Years',
        loc: 'Pune, MH',
        bio: 'Specializing in residential and industrial construction management. Delivering quality engineering since 2012.'
    });
    const [isEditBioOpen, setIsEditBioOpen] = useState(false);
    const [tempBio, setTempBio] = useState(profile.bio);

    const handleSaveBio = () => {
        setProfile(prev => ({ ...prev, bio: tempBio }));
        setIsEditBioOpen(false);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-10">
            {/* ── Sticky Header ── */}
            <div className="bg-gradient-to-br from-[#1E3A8A] to-indigo-900 px-6 pt-12 pb-6 rounded-b-[32px] shadow-lg sticky top-0 z-50 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-[1000] text-white tracking-tight m-0">Expert Profile</h1>
                    <p className="text-blue-200/60 text-[11px] font-bold uppercase tracking-widest mt-0.5">Manage professional details</p>
                </div>
                <button className="bg-white/10 backdrop-blur-md text-white p-2.5 rounded-xl border border-white/20 shadow-sm active:scale-90 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </button>
            </div>

            <div className="px-6 pt-5 space-y-6">
                {/* ── Profile Hero ── */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center">
                    <div className="relative mb-4">
                        <div className="w-24 h-24 rounded-[28px] bg-slate-100 border-2 border-white shadow-md overflow-hidden ring-4 ring-slate-50">
                            <img src="https://ui-avatars.com/api/?name=Ramesh+Sharma&background=1E3A8A&color=fff&size=200" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-xl border-4 border-white flex items-center justify-center text-white shadow-lg">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                        </div>
                    </div>

                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">{profile.name}</h2>
                    <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] mt-1">{profile.role}</p>

                    <div className="mt-4 flex gap-2">
                        <div className="bg-blue-50 text-[#1E3A8A] text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-blue-100 shadow-sm">Verified Expert</div>
                    </div>
                </div>

                {/* ── Info Stats Strip ── */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4 border border-slate-100 text-center shadow-sm">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1.5">Experience</p>
                        <p className="text-slate-900 font-[1000] text-base">{profile.exp}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-slate-100 text-center shadow-sm">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1.5">Base Price</p>
                        <p className="text-slate-900 font-[1000] text-base">₹800/Visit</p>
                    </div>
                </div>

                {/* ── Biography ── */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-slate-900 font-extrabold text-[15px]">Biography</h3>
                        <button
                            onClick={() => { setTempBio(profile.bio); setIsEditBioOpen(true); }}
                            className="text-[#1E3A8A] text-[11px] font-black uppercase tracking-widest hover:underline"
                        >
                            Edit
                        </button>
                    </div>
                    <p className="text-slate-500 text-[14px] leading-relaxed font-medium">{profile.bio}</p>
                </div>

                {/* ── Skills Section ── */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h3 className="text-slate-900 font-extrabold text-[15px] mb-4">Core Skills</h3>
                    <div className="flex flex-wrap gap-2.5">
                        {['Residential Const.', 'RCC Work', 'Structural Design', 'Site Mgmt'].map(skill => (
                            <span key={skill} className="bg-slate-50 text-slate-600 text-[10px] font-black px-3.5 py-2 rounded-xl border border-slate-100 shadow-sm uppercase tracking-tight">
                                {skill}
                            </span>
                        ))}
                        <button className="text-[#1E3A8A] text-[11px] font-black px-4 py-2 border border-blue-100 rounded-xl bg-blue-50/30 active:scale-95 transition-all">+ Add</button>
                    </div>
                </div>

                {/* ── Portfolio ── */}
                <div>
                    <div className="flex justify-between items-center mb-4 px-1">
                        <h3 className="text-slate-900 font-extrabold text-[15px]">Work Portfolio</h3>
                        <button className="text-blue-600 font-black text-[11px] uppercase tracking-wider">+ Upload New</button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            'https://images.unsplash.com/photo-1541913057-259c00b10288?w=400&h=400&fit=crop',
                            'https://images.unsplash.com/photo-1503387762-592dee58c460?w=400&h=400&fit=crop',
                            'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?w=400&h=400&fit=crop',
                            'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=400&h=400&fit=crop'
                        ].map((img, i) => (
                            <div key={i} className="aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-200/50 shadow-sm group active:scale-[0.98] transition-all cursor-pointer">
                                <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Work" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Account Actions ── */}
                <button
                    onClick={() => { localStorage.clear(); window.location.href = '/'; }}
                    className="w-full py-4.5 rounded-xl bg-red-50 text-red-600 font-black text-[13px] uppercase tracking-[0.2em] border border-red-100 active:scale-95 transition-all outline-none shadow-sm mb-4"
                >
                    Sign Out Account
                </button>
            </div>

            {/* ── Edit Bio Bottom Sheet ── */}
            {isEditBioOpen && (
                <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md bg-white rounded-3xl p-7 shadow-2xl animate-in slide-in-from-bottom duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-slate-900 font-[1000] text-xl tracking-tight m-0">Edit Biography</h3>
                            <button onClick={() => setIsEditBioOpen(false)} className="text-slate-400 p-2 hover:bg-slate-50 rounded-full active:scale-90 transition-transform">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <textarea
                            className="w-full h-40 bg-slate-50 border border-slate-100 rounded-2xl p-5 text-slate-700 text-[15px] focus:outline-none focus:ring-4 focus:ring-blue-500/10 mb-6 font-medium leading-relaxed resize-none transition-all"
                            value={tempBio}
                            onChange={(e) => setTempBio(e.target.value)}
                            placeholder="Write about your professional background, past projects, and expertise..."
                        />
                        <button
                            onClick={handleSaveBio}
                            className="w-full py-4.5 bg-[#1E3A8A] text-white rounded-xl text-[14px] font-[1000] uppercase tracking-widest shadow-xl shadow-blue-900/20 active:scale-95 transition-all"
                        >
                            Save Biography
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProviderProfile;
