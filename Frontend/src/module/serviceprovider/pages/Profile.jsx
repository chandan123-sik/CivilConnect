import React from 'react';

const ProviderProfile = () => {
    const profile = { name: 'Ramesh Sharma', role: 'Main Civil Contractor', exp: '12 Years', loc: 'Pune, MH', bio: 'Specializing in residential and industrial construction management. Delivering quality engineering since 2012.' };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24">
            {/* ── Profile Hero Section ── */}
            <div className="bg-white px-6 pt-20 pb-12 rounded-b-[50px] shadow-sm flex flex-col items-center relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-40 bg-slate-50 opacity-50 block" />

                <div className="relative z-10 mb-6">
                    <div className="w-32 h-32 rounded-[45px] bg-white p-1.5 shadow-2xl shadow-slate-200 border-2 border-slate-50 rotate-3 group overflow-hidden">
                        <div className="w-full h-full rounded-[40px] bg-slate-100 overflow-hidden -rotate-3 transition-transform duration-500 hover:scale-110">
                            <img src="https://ui-avatars.com/api/?name=Ramesh+Sharma&background=1E3A8A&color=fff&size=128" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-12 h-12 bg-[#1E3A8A] rounded-[22px] border-4 border-white flex items-center justify-center shadow-lg shadow-blue-900/20">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                    </div>
                </div>

                <h1 className="text-2xl font-[1000] text-slate-900 tracking-tighter text-center">{profile.name}</h1>
                <div className="mt-3 flex gap-2">
                    <span className="bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-blue-100 shadow-sm">{profile.role}</span>
                </div>
            </div>

            {/* ── Content ── */}
            <div className="px-6 space-y-8 mt-10">
                {/* Info Stats Row */}
                <div className="flex bg-white rounded-[40px] p-8 shadow-sm justify-around items-center border border-slate-50">
                    <div className="text-center">
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">EXP</p>
                        <p className="text-slate-900 font-black text-lg">{profile.exp}</p>
                    </div>
                    <div className="w-px h-10 bg-slate-100" />
                    <div className="text-center">
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">LOC</p>
                        <p className="text-slate-900 font-black text-lg">{profile.loc}</p>
                    </div>
                </div>

                {/* Professional Summary */}
                <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-50">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-slate-900 font-extrabold text-lg tracking-tight">Biography</h3>
                        <button className="text-[#1E3A8A] text-xs font-black uppercase tracking-widest">Edit</button>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">{profile.bio}</p>
                </div>

                {/* Portfolio Mini Grid */}
                <div>
                    <div className="flex justify-between items-center mb-6 px-2">
                        <h3 className="text-slate-900 font-black text-lg tracking-tight">Project Portfolio</h3>
                        <button className="text-blue-600 font-bold text-xs">+ Add New</button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="aspect-square bg-slate-100 rounded-[35px] overflow-hidden border border-slate-200/50 shadow-inner group relative cursor-pointer">
                                <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                </div>
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 00-2 2z" /></svg>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="pt-4">
                    <button
                        onClick={() => { localStorage.clear(); window.location.href = '/'; }}
                        className="w-full py-5 rounded-[30px] bg-red-50 text-red-600 font-black text-sm uppercase tracking-[0.1em] border border-red-100 shadow-sm active:scale-95 transition-all outline-none"
                    >
                        Sign Out Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProviderProfile;
