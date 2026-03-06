import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CompleteProfile = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        city: '',
        area: '',
        gender: '',
        profileImage: null,
    });
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');

    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, profileImage: file }));
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        if (!formData.fullName.trim() || !formData.email.trim() || !formData.city.trim() || !formData.area.trim() || !formData.gender) {
            setError('Please fill all mandatory fields');
            return;
        }

        // Save profile info to localStorage
        localStorage.setItem('user_name', formData.fullName.trim());
        localStorage.setItem('user_email', formData.email.trim());
        localStorage.setItem('user_city', formData.city.trim());
        localStorage.setItem('user_area', formData.area.trim());
        localStorage.setItem('user_gender', formData.gender);
        if (preview) {
            localStorage.setItem('user_profile_image', preview);
        }
        localStorage.setItem('profile_complete', 'true');
        localStorage.setItem('role', 'user');
        localStorage.setItem('last_user_role', 'user');

        // Redirect to user panel
        navigate('/user/home');
    };

    return (
        <div className="min-h-screen bg-[#FBFCFE] pb-12">
            {/* Header */}
            <div className="bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] px-8 pt-16 pb-8 rounded-b-[40px] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                    <h1 className="text-3xl font-[1000] text-white tracking-tight leading-tight mb-2">Complete Your Profile</h1>
                    <p className="text-purple-100/60 text-[11px] font-black uppercase tracking-[0.2em]">Build your digital identity</p>
                </div>
            </div>

            <div className="px-6 -mt-10">
                <div className="bg-white rounded-[40px] p-8 shadow-xl border border-slate-100">
                    {/* Profile Image Section */}
                    <div className="flex flex-col items-center mb-10">
                        <div className="relative group">
                            <div className="w-28 h-28 rounded-[38px] bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:border-[#7C3AED] shadow-inner">
                                {preview ? (
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center">
                                        <div className="text-2xl mb-1">📸</div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-tight">Add Photo</p>
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            />
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#7C3AED] rounded-2xl flex items-center justify-center text-white shadow-lg border-4 border-white">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Name Input */}
                        <div>
                            <label className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] block mb-2 px-1">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInput}
                                placeholder="Enter your full name"
                                className="w-full border-2 border-slate-50 bg-slate-50/50 rounded-2xl p-4 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:border-[#7C3AED] focus:bg-white outline-none transition-all duration-300 shadow-sm"
                            />
                        </div>

                        {/* Email Input */}
                        <div>
                            <label className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] block mb-2 px-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInput}
                                placeholder="example@email.com"
                                className="w-full border-2 border-slate-50 bg-slate-50/50 rounded-2xl p-4 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:border-[#7C3AED] focus:bg-white outline-none transition-all duration-300 shadow-sm"
                            />
                        </div>

                        {/* Location Group */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] block mb-2 px-1">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInput}
                                    placeholder="e.g. Pune"
                                    className="w-full border-2 border-slate-50 bg-slate-50/50 rounded-2xl p-4 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:border-[#7C3AED] focus:bg-white outline-none transition-all duration-300 shadow-sm"
                                />
                            </div>
                            <div>
                                <label className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] block mb-2 px-1">Area</label>
                                <input
                                    type="text"
                                    name="area"
                                    value={formData.area}
                                    onChange={handleInput}
                                    placeholder="Locality"
                                    className="w-full border-2 border-slate-50 bg-slate-50/50 rounded-2xl p-4 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:border-[#7C3AED] focus:bg-white outline-none transition-all duration-300 shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Gender Selection */}
                        <div>
                            <label className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] block mb-4 px-1">Gender</label>
                            <div className="grid grid-cols-3 gap-3">
                                {['Male', 'Female', 'Other'].map(g => (
                                    <button
                                        key={g}
                                        onClick={() => setFormData(prev => ({ ...prev, gender: g }))}
                                        className={`py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest border-2 transition-all duration-300 ${formData.gender === g ? 'bg-[#7C3AED] border-[#7C3AED] text-white shadow-lg shadow-purple-900/20' : 'bg-slate-50/50 border-slate-50 text-slate-400 hover:border-slate-100'}`}
                                    >
                                        {g}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {error && (
                            <p className="text-red-500 text-center font-black text-[10px] uppercase tracking-widest pt-4">{error}</p>
                        )}

                        <div className="pt-6">
                            <button
                                onClick={handleSubmit}
                                className="w-full bg-[#7C3AED] text-white py-5 rounded-[24px] text-xs font-[1000] uppercase tracking-[0.3em] shadow-2xl shadow-purple-900/30 active:scale-95 transition-all outline-none"
                            >
                                Complete Registration
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompleteProfile;
