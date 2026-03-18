import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProviderProfile } from '../api/providerApi';

const CreateProfessionalProfile = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        category: localStorage.getItem('provider_category') || localStorage.getItem('role_category') || '',
        experience: '', 
        about: '',
        specialities: '', 
        pricing: '',
        city: '',
        address: '',
        recentWorkDesc: '',
        profileImage: null,
        aadharImage: null,
        policeVerifyImage: null,
        workImage: null
    });
    const [preview, setPreview] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('cc_provider_token') || localStorage.getItem('cc_temp_token');
        if (!token) {
            setError("No authentication token found. Please login again.");
        }
    }, [navigate]);

    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleImageUpload = (e, target) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, [target]: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(prev => ({ ...prev, [target]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        if (!formData.fullName.trim() || !formData.experience || !formData.about.trim() || !formData.pricing.trim() || !formData.city.trim() || !formData.address.trim() || !formData.profileImage || !formData.aadharImage || !formData.policeVerifyImage) {
            setError('All fields including City, Address, Photo, Aadhar, and Police Verification are mandatory.');
            return;
        }

        setLoading(true);
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });

            const res = await createProviderProfile(data);

            // Update localStorage
            localStorage.setItem('cc_provider_token', res.token || localStorage.getItem('cc_provider_token') || localStorage.getItem('cc_temp_token') || localStorage.getItem('access_token'));
            localStorage.setItem('cc_current_role', 'provider');
            localStorage.setItem('cc_provider_data', JSON.stringify(res.user || res));
            localStorage.setItem('profile_complete', 'true');
            
            // CLEANUP: Remove temporary onboarding tokens
            localStorage.removeItem('cc_temp_token');
            localStorage.removeItem('access_token');
            
            // After profile, Go to Plans
            navigate('/auth/provider-plans');
        } catch (err) {
            setError(err || "Failed to create profile");
        } finally {
            setLoading(false);
        }
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
                            {preview.profileImage ? (
                                <img src={preview.profileImage} alt="Preview" className="w-full h-full object-cover" />
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
                        <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleImageUpload(e, 'profileImage')} />
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#1E3A8A] rounded-xl flex items-center justify-center text-white shadow-lg border-4 border-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                        </div>
                    </div>

                    <div className="space-y-4 w-full">
                        {/* Name Input */}
                        <div>
                            <label className="text-slate-700 text-[15px] font-bold block mb-1.5 px-1">Professional Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInput}
                                placeholder="Enter your business name"
                                className="w-full border-2 border-slate-50 bg-slate-50/50 rounded-2xl p-4 text-base font-bold text-slate-900 placeholder:text-slate-300 focus:border-[#1E3A8A] focus:bg-white outline-none transition-all shadow-sm"
                            />
                        </div>

                        {/* Experience, Price, and Rating */}
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="text-slate-700 text-[15px] font-bold block mb-1.5 px-1">Exp (Y)</label>
                                <input
                                    type="number"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleInput}
                                    placeholder="e.g. 5"
                                    className="w-full border-2 border-slate-50 bg-slate-50/50 rounded-2xl p-4 text-base font-bold text-slate-900 placeholder:text-slate-300 focus:border-[#1E3A8A] focus:bg-white outline-none transition-all shadow-sm"
                                />
                            </div>
                            <div>
                                <label className="text-slate-700 text-[15px] font-bold block mb-1.5 px-1">Price</label>
                                <input
                                    type="text"
                                    name="pricing"
                                    value={formData.pricing}
                                    onChange={handleInput}
                                    placeholder="₹500/hr"
                                    className="w-full border-2 border-slate-50 bg-slate-50/50 rounded-2xl p-4 text-base font-bold text-slate-900 placeholder:text-slate-300 focus:border-[#1E3A8A] focus:bg-white outline-none transition-all shadow-sm"
                                />
                            </div>
                            <div>
                                <label className="text-slate-700 text-[15px] font-bold block mb-1.5 px-1">Rating</label>
                                <input
                                    type="text"
                                    name="rating"
                                    value={formData.rating}
                                    onChange={handleInput}
                                    placeholder="4.9"
                                    className="w-full border-2 border-slate-50 bg-slate-50/50 rounded-2xl p-4 text-base font-bold text-slate-900 placeholder:text-slate-300 focus:border-[#1E3A8A] focus:bg-white outline-none transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        {/* City & Address */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-slate-700 text-[15px] font-bold block mb-1.5 px-1">Service City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInput}
                                    placeholder="e.g. Pune"
                                    className="w-full border-2 border-slate-50 bg-slate-50/50 rounded-2xl p-4 text-base font-bold text-slate-900 placeholder:text-slate-300 focus:border-[#1E3A8A] focus:bg-white outline-none transition-all shadow-sm"
                                />
                            </div>
                            <div>
                                <label className="text-slate-700 text-[15px] font-bold block mb-1.5 px-1">Service Area</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInput}
                                    placeholder="e.g. Hinjewadi"
                                    className="w-full border-2 border-slate-50 bg-slate-50/50 rounded-2xl p-4 text-base font-bold text-slate-900 placeholder:text-slate-300 focus:border-[#1E3A8A] focus:bg-white outline-none transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        {/* About */}
                        <div>
                            <label className="text-slate-700 text-[15px] font-bold block mb-1.5 px-1">About Your Services</label>
                            <textarea
                                name="about"
                                value={formData.about}
                                onChange={handleInput}
                                placeholder="Tell clients why they should hire you..."
                                className="w-full border-2 border-slate-50 bg-slate-50/50 rounded-2xl p-4 text-base font-bold text-slate-900 placeholder:text-slate-300 focus:border-[#1E3A8A] focus:bg-white outline-none transition-all shadow-sm min-h-[100px] resize-none"
                            />
                        </div>

                        {/* Specialities */}
                        <div>
                            <label className="text-slate-700 text-[15px] font-bold block mb-1.5 px-1">Specialities</label>
                            <input
                                type="text"
                                name="specialities"
                                value={formData.specialities}
                                onChange={handleInput}
                                placeholder="e.g. Interior, Ceiling, Industrial (comma separated)"
                                className="w-full border-2 border-slate-50 bg-slate-50/50 rounded-2xl p-4 text-base font-bold text-slate-900 placeholder:text-slate-300 focus:border-[#1E3A8A] focus:bg-white outline-none transition-all shadow-sm"
                            />
                        </div>

                        {/* Identity & Legal Verification */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            {/* Aadhar Identity Verification */}
                            <div className="bg-emerald-50/50 rounded-3xl p-5 border-2 border-dashed border-emerald-100">
                                <label className="text-emerald-800 text-[11px] font-black block mb-3 px-1 uppercase tracking-widest">Aadhar Verification</label>
                                <div className="relative group">
                                    <div className={`w-full aspect-[16/8] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all duration-300 overflow-hidden ${preview.aadharImage ? 'border-emerald-500 bg-white' : 'border-slate-200 bg-white hover:border-emerald-400'}`}>
                                        {preview.aadharImage ? (
                                            <div className="relative w-full h-full">
                                                <img src={preview.aadharImage} alt="Aadhar" className="w-full h-full object-cover" />
                                                <div className="absolute inset-x-0 bottom-0 py-1 bg-emerald-600 text-white text-[8px] font-black text-center uppercase tracking-widest">Aadhar Captured</div>
                                            </div>
                                        ) : (
                                            <>
                                                <svg className="w-6 h-6 text-slate-300 mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest text-center px-4">Upload Front Aadhar</p>
                                            </>
                                        )}
                                    </div>
                                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleImageUpload(e, 'aadharImage')} />
                                </div>
                            </div>

                            {/* Police Verification */}
                            <div className="bg-blue-50/50 rounded-3xl p-5 border-2 border-dashed border-blue-100">
                                <label className="text-blue-800 text-[11px] font-black block mb-3 px-1 uppercase tracking-widest">Police Verification</label>
                                <div className="relative group">
                                    <div className={`w-full aspect-[16/8] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all duration-300 overflow-hidden ${preview.policeVerifyImage ? 'border-blue-500 bg-white' : 'border-slate-200 bg-white hover:border-blue-400'}`}>
                                        {preview.policeVerifyImage ? (
                                            <div className="relative w-full h-full">
                                                <img src={preview.policeVerifyImage} alt="Police" className="w-full h-full object-cover" />
                                                <div className="absolute inset-x-0 bottom-0 py-1 bg-blue-600 text-white text-[8px] font-black text-center uppercase tracking-widest">Document Captured</div>
                                            </div>
                                        ) : (
                                            <>
                                                <svg className="w-6 h-6 text-slate-300 mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest text-center px-4">Upload Police Clearance</p>
                                            </>
                                        )}
                                    </div>
                                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleImageUpload(e, 'policeVerifyImage')} />
                                </div>
                            </div>
                        </div>

                        {/* Recent Work Portfolio */}
                        <div className="bg-indigo-50/50 rounded-3xl p-5 border-2 border-dashed border-indigo-100">
                            <label className="text-indigo-800 text-[11px] font-black block mb-3 px-1 uppercase tracking-widest">Showcase Recent Work</label>
                            <div className="space-y-4">
                                <div className="relative group">
                                    <div className={`w-full aspect-[16/8] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all duration-300 overflow-hidden ${preview.workImage ? 'border-indigo-500 bg-white' : 'border-slate-200 bg-white hover:border-indigo-400'}`}>
                                        {preview.workImage ? (
                                            <div className="relative w-full h-full">
                                                <img src={preview.workImage} alt="Work" className="w-full h-full object-cover" />
                                                <div className="absolute inset-x-0 bottom-0 py-1 bg-indigo-600 text-white text-[8px] font-black text-center uppercase tracking-widest">Work Example Captured</div>
                                            </div>
                                        ) : (
                                            <>
                                                <svg className="w-6 h-6 text-slate-300 mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest text-center px-4">Upload Best Work Image</p>
                                            </>
                                        )}
                                    </div>
                                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleImageUpload(e, 'workImage')} />
                                </div>
                                <textarea
                                    name="recentWorkDesc"
                                    value={formData.recentWorkDesc}
                                    onChange={handleInput}
                                    placeholder="Briefly describe this project (e.g. Dream House Painting)..."
                                    className="w-full border-2 border-slate-50 bg-white rounded-2xl p-4 text-[13px] font-bold text-slate-900 placeholder:text-slate-300 focus:border-indigo-600 outline-none transition-all resize-none h-24 shadow-sm"
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="text-red-500 text-center font-black text-[10px] tracking-widest pt-4">{error}</p>
                        )}

                        <div className="pt-6">
                            <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className={`w-full py-5 rounded-[24px] text-sm font-[1000] uppercase tracking-[0.3em] shadow-2xl shadow-indigo-900/30 active:scale-95 transition-all outline-none ${loading ? 'bg-slate-200 text-slate-400' : 'bg-gradient-to-r from-indigo-700 to-blue-800 text-white'}`}
                        >
                            {loading ? 'Registering...' : 'Build My Presence'}
                        </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateProfessionalProfile;
