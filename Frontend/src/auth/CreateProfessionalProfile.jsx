import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateProfessionalProfile = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        experience: '', // Years
        rating: '4.8', // Initial dummy rating
        about: '',
        specialities: '', // Tags (comma separated)
        pricing: '',
        recentWorkDesc: '',
    });
    const [profileImage, setProfileImage] = useState(null);
    const [workImage, setWorkImage] = useState(null);
    const [error, setError] = useState('');

    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleImageUpload = (e, target) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (target === 'profile') setProfileImage(reader.result);
                else setWorkImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        if (!formData.fullName.trim() || !formData.experience.trim() || !formData.about.trim() || !formData.pricing.trim() || !profileImage) {
            setError('Please fill all mandatory fields and upload a profile photo');
            return;
        }

        // Save professional profile info
        localStorage.setItem('provider_name', formData.fullName.trim());
        localStorage.setItem('provider_experience', formData.experience.trim());
        localStorage.setItem('provider_rating', formData.rating);
        localStorage.setItem('provider_about', formData.about.trim());
        localStorage.setItem('provider_specialities', formData.specialities.trim());
        localStorage.setItem('provider_pricing', formData.pricing.trim());
        localStorage.setItem('provider_work_desc', formData.recentWorkDesc.trim());
        if (workImage) localStorage.setItem('provider_work_image', workImage);
        if (profileImage) localStorage.setItem('provider_profile_image', profileImage);

        localStorage.setItem('profile_complete', 'true');
        localStorage.setItem('role', 'provider');
        localStorage.setItem('last_user_role', 'provider');
        localStorage.setItem('access_token', 'dummy_provider_token');

        // After profile, Go to Plans
        navigate('/auth/provider-plans');
    };

    return (
        <div className="min-h-screen bg-[#FBFCFE] pb-12">
            {/* Header */}
            <div className="bg-gradient-to-br from-[#1E3A8A] to-indigo-900 px-8 pt-10 pb-10 rounded-b-[40px] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                    <h1 className="text-3xl font-[1000] text-white tracking-tight leading-tight mb-2">Professional Profile</h1>
                    <p className="text-blue-200/80 text-[13px] font-bold tracking-wide">Build your business portfolio</p>
                </div>
            </div>

            <div className="px-3 -mt-10">
                <div className="bg-white rounded-[32px] px-4 py-6 shadow-xl border border-slate-100 flex flex-col items-center">
                    {/* Profile Image */}
                    <div className="relative group mb-6">
                        <div className="w-28 h-28 rounded-[38px] bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:border-[#1E3A8A] shadow-inner">
                            {profileImage ? (
                                <img src={profileImage} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center p-2">
                                    <svg className="w-8 h-8 mx-auto mb-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <p className="text-[10px] text-slate-600 font-bold tracking-widest leading-tight">Professional Photo</p>
                                </div>
                            )}
                        </div>
                        <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleImageUpload(e, 'profile')} />
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#1E3A8A] rounded-xl flex items-center justify-center text-white shadow-lg border-4 border-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                        </div>
                    </div>

                    <div className="space-y-4 w-full">
                        {/* Name Input */}
                        <div>
                            <label className="text-slate-700 text-[13px] font-bold block mb-1.5 px-1">Professional Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInput}
                                placeholder="Enter your business name"
                                className="w-full border-2 border-slate-50 bg-slate-50/50 rounded-2xl p-4 text-sm font-bold text-slate-900 placeholder:text-slate-500 focus:border-[#1E3A8A] focus:bg-white outline-none transition-all shadow-sm"
                            />
                        </div>

                        {/* Experience, Price, and Rating */}
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="text-slate-700 text-[13px] font-bold block mb-1.5 px-1">Exp (Y)</label>
                                <input
                                    type="number"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleInput}
                                    placeholder="e.g. 5"
                                    className="w-full border-2 border-slate-50 bg-slate-50/50 rounded-2xl p-4 text-sm font-bold text-slate-900 placeholder:text-slate-500 focus:border-[#1E3A8A] focus:bg-white outline-none transition-all shadow-sm"
                                />
                            </div>
                            <div>
                                <label className="text-slate-700 text-[13px] font-bold block mb-1.5 px-1">Price</label>
                                <input
                                    type="text"
                                    name="pricing"
                                    value={formData.pricing}
                                    onChange={handleInput}
                                    placeholder="₹500/hr"
                                    className="w-full border-2 border-slate-50 bg-slate-50/50 rounded-2xl p-4 text-sm font-bold text-slate-900 placeholder:text-slate-500 focus:border-[#1E3A8A] focus:bg-white outline-none transition-all shadow-sm"
                                />
                            </div>
                            <div>
                                <label className="text-slate-700 text-[13px] font-bold block mb-1.5 px-1">Rating</label>
                                <input
                                    type="text"
                                    name="rating"
                                    value={formData.rating}
                                    onChange={handleInput}
                                    placeholder="4.9"
                                    className="w-full border-2 border-slate-50 bg-slate-50/50 rounded-2xl p-4 text-sm font-bold text-slate-900 placeholder:text-slate-500 focus:border-[#1E3A8A] focus:bg-white outline-none transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        {/* About */}
                        <div>
                            <label className="text-slate-700 text-[13px] font-bold block mb-1.5 px-1">About Your Services</label>
                            <textarea
                                name="about"
                                value={formData.about}
                                onChange={handleInput}
                                placeholder="Tell clients why they should hire you..."
                                className="w-full border-2 border-slate-50 bg-slate-50/50 rounded-2xl p-4 text-sm font-bold text-slate-900 placeholder:text-slate-500 focus:border-[#1E3A8A] focus:bg-white outline-none transition-all shadow-sm min-h-[100px] resize-none"
                            />
                        </div>

                        {/* Specialities */}
                        <div>
                            <label className="text-slate-700 text-[13px] font-bold block mb-1.5 px-1">Specialities</label>
                            <input
                                type="text"
                                name="specialities"
                                value={formData.specialities}
                                onChange={handleInput}
                                placeholder="e.g. Interior, Ceiling, Industrial (comma separated)"
                                className="w-full border-2 border-slate-50 bg-slate-50/50 rounded-2xl p-4 text-sm font-bold text-slate-900 placeholder:text-slate-500 focus:border-[#1E3A8A] focus:bg-white outline-none transition-all shadow-sm"
                            />
                        </div>

                        {/* Recent Work Portfolio */}
                        <div className="bg-slate-50/50 rounded-3xl p-6 border-2 border-dashed border-slate-100">
                            <label className="text-slate-700 text-[13px] font-bold block mb-2 px-1">Showcase Recent Work</label>
                            <div className="flex gap-4 items-start">
                                <div className="relative shrink-0">
                                    <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm">
                                        {workImage ? (
                                            <img src={workImage} alt="Work" className="w-full h-full object-cover" />
                                        ) : (
                                            <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        )}
                                    </div>
                                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleImageUpload(e, 'work')} />
                                </div>
                                <div className="flex-1">
                                    <textarea
                                        name="recentWorkDesc"
                                        value={formData.recentWorkDesc}
                                        onChange={handleInput}
                                        placeholder="Describe this project..."
                                        className="w-full bg-white rounded-xl p-3 text-xs font-bold text-slate-900 placeholder:text-slate-500 outline-none border border-slate-100 min-h-[80px] grow"
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <p className="text-red-500 text-center font-black text-[10px] tracking-widest pt-4">{error}</p>
                        )}

                        <div className="pt-6">
                            <button
                                onClick={handleSubmit}
                                className="w-full bg-[#1E3A8A] text-white py-5 rounded-[18px] text-sm font-[1000] tracking-[0.1em] shadow-2xl shadow-blue-900/30 active:scale-95 transition-all outline-none"
                            >
                                Complete business bio
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateProfessionalProfile;
