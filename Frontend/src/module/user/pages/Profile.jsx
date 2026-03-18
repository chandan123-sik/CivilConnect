import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, ShieldCheck, Star, ChevronRight, LogOut, Camera, AlertCircle, Languages } from 'lucide-react';
import { getUserProfile, getHiringHistory, getOrders, submitFeedback, submitReport } from '../../../api/userApi';
import { getPolicy } from '../../../api/publicApi';
import axiosInstance from '../../../api/axiosInstance';

const Profile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        city: '',
        area: '',
        gender: '',
        profileImage: null
    });
    const [preview, setPreview] = useState(null);
    const [hiringHistory, setHiringHistory] = useState([]);
    const [materialOrders, setMaterialOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showEdit, setShowEdit] = useState(false);
    const [showPolicy, setShowPolicy] = useState(false);
    const [showRate, setShowRate] = useState(false);
    const [rating, setRating] = useState(0);

    const [showReport, setShowReport] = useState(false);
    const [showResolution, setShowResolution] = useState(false);
    const [reports, setReports] = useState([]);
    const [reportText, setReportText] = useState('');
    const [reportSuccess, setReportSuccess] = useState(false);
    const [showLanguage, setShowLanguage] = useState(false);
    const [selectedLang, setSelectedLang] = useState('English');

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

    const fetchProfile = async () => {
        try {
            const res = await getUserProfile();
            setUserData(res);
            setFormData({
                fullName: res.fullName || '',
                email: res.email || '',
                city: res.city || '',
                area: res.area || '',
                gender: res.gender || '',
                profileImage: null
            });
            setPreview(res.profileImage);
        } catch (err) {
            console.error("Failed to fetch profile:", err);
        }
    };

    const fetchHistory = async () => {
        try {
            const [history, orders, reps] = await Promise.all([getHiringHistory(), getOrders(), axiosInstance.get('/user/report')]);
            setHiringHistory(history);
            setMaterialOrders(orders);
            
            // Robust parsing for Resolution Center reports
            let reportsList = [];
            if (Array.isArray(reps)) {
                reportsList = reps;
            } else if (reps?.data && Array.isArray(reps.data)) {
                reportsList = reps.data;
            } else if (reps?.data?.data && Array.isArray(reps.data.data)) {
                reportsList = reps.data.data;
            }
            setReports(reportsList);
        } catch (err) {
            console.error("Failed to fetch history:", err);
        }
    };

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

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            await Promise.all([fetchProfile(), fetchHistory(), fetchCMS()]);
            setLoading(false);
        };
        load();
    }, []);

    // Prevent background scroll and stop Lenis smoothing when modals are open
    useEffect(() => {
        const isAnyOpen = showLanguage || showEdit || showRate || showResolution || showReport || showPolicy;
        if (isAnyOpen) {
            document.body.style.overflow = 'hidden';
            window.lenis?.stop();
        } else {
            document.body.style.overflow = 'unset';
            window.lenis?.start();
        }
        return () => { 
            document.body.style.overflow = 'unset'; 
            window.lenis?.start();
        };
    }, [showLanguage, showEdit, showRate, showResolution, showReport, showPolicy]);

    const handleRateSubmit = async () => {
        try {
            await submitFeedback({ stars: rating });
            alert("Thanks for your rating! 🌟");
            setShowRate(false);
            setRating(0);
        } catch (err) {
            alert("Failed to submit rating");
        }
    };



    const handleLogout = () => {
        localStorage.removeItem('cc_user_token');
        localStorage.removeItem('cc_user_data');
        localStorage.removeItem('cc_current_role');
        navigate('/');
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key]) data.append(key, formData[key]);
            });

            await axiosInstance.put('/user/profile', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            await fetchProfile();
            setShowEdit(false);
        } catch (err) {
            alert(err?.response?.data?.message || "Update failed");
        }
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

    // Dynamic sent requests from localStorage
    // Dynamic requests from API
    const sentRequests = useMemo(() => {
        if (!Array.isArray(hiringHistory)) return [];

        const realLeads = hiringHistory
            .filter(lead => lead.providerId)
            .map(lead => ({
                id: lead._id,
                provider: lead.providerId?.fullName || lead.serviceType,
                role: lead.serviceType,
                date: lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Unknown',
                status: lead.status ? lead.status.charAt(0).toUpperCase() + lead.status.slice(1) : 'Pending',
                price: lead.budget || 'Negotiable',
                isMaterial: false,
                createdAt: lead.createdAt
            }));

        const combined = [...realLeads].sort((a, b) => {
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        });

        return combined.slice(0, 3);
    }, [hiringHistory]);

    return (
        <div style={{ paddingBottom: 80, background: '#F9FAFB' }}>
            {/* Context Header */}
            <header style={{
                padding: '16px 20px 24px',
                background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
                borderRadius: '0 0 32px 32px',
                boxShadow: '0 10px 30px rgba(124, 58, 237, 0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: '20px', fontWeight: '900', color: '#fff', margin: 0 }}>
                    Profile Settings
                </h1>
            </header>

            {/* User Profile Card */}
            <div style={{ padding: '16px 12px 0', animation: 'fadeInUp 0.6s ease-out both' }}>
                <div style={{
                    background: '#fff',
                    borderRadius: '20px',
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    boxShadow: '0 8px 30px rgba(0,0,0,0.03)',
                    border: '1.5px solid #E2E8F0',
                    position: 'relative'
                }}>
                    <div style={{
                        width: '64px', height: '64px', borderRadius: '16px',
                        background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        overflow: 'hidden', flexShrink: 0
                    }}>
                        {preview ? (
                            <img src={preview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName || 'User')}&background=F5F3FF&color=7C3AED`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                    </div>
                    <div style={{ flex: 1 }}>
                        <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: '21px', fontWeight: '900', color: '#111827', margin: '0 0 6px 0' }}>
                            {formData.fullName}
                        </h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: '12px' }}>📍</span>
                            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#6B7280', fontWeight: '500' }}>
                                {formData.area ? `${formData.area}, ` : ''}{formData.city || 'India'}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowEdit(true)}
                        className="pulse-btn"
                        style={{ border: 'none', background: '#F5F3FF', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                        <span style={{ fontSize: '16px' }}>✏️</span>
                    </button>
                </div>
            </div>

            {/* My Service Requests */}
            <section style={{ padding: '16px 20px 0', animation: 'fadeInUp 0.6s ease-out 0.2s both' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: '17px', fontWeight: '800', color: '#1F2937', margin: 0 }}>
                        Service Requests
                    </h2>
                    <span
                        onClick={() => navigate('/user/requests')}
                        style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#7C3AED', fontWeight: '700', cursor: 'pointer' }}
                    >
                        See All
                    </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {sentRequests.map(req => (
                        <div key={req.id} style={{
                            background: '#fff',
                            borderRadius: '16px',
                            padding: '16px',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                            border: '1.5px solid #F1F5F9',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                <div style={{
                                    width: '44px', height: '44px', borderRadius: '12px',
                                    background: req.isMaterial ? '#ECFDF5' : '#F5F3FF',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
                                    border: `1px solid ${req.isMaterial ? '#D1FAE5' : '#EDE9FE'}`
                                }}>
                                    {req.isMaterial ? '📦' : '🏗️'}
                                </div>
                                <div>
                                    <h4 style={{ fontFamily: "'Inter', sans-serif", fontSize: '16px', fontWeight: '800', color: '#111827', margin: '0 0 4px 0' }}>{req.provider}</h4>
                                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#64748B', margin: 0, fontWeight: '500' }}>{req.date} · {req.role}</p>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{
                                    display: 'inline-block', padding: '4px 10px', borderRadius: '8px',
                                    background: req.status === 'Accepted' ? '#DCFCE7' : '#FEF9C3',
                                    color: req.status === 'Accepted' ? '#065F46' : '#854D0E',
                                    fontSize: '11px', fontWeight: '900', marginBottom: 4
                                }}>
                                    {req.status}
                                </span>
                                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: '800', color: '#111827', margin: 0 }}>{req.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Support & Settings */}
            <section style={{ padding: '16px 20px 0', animation: 'fadeInUp 0.6s ease-out 0.4s both' }}>
                <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: '900', color: '#9CA3AF', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Preference & Support
                </h2>
                <div style={{ background: '#fff', borderRadius: '24px', overflow: 'hidden', border: '1.5px solid #F3F4FB', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                    {[
                        { icon: <UserCircle size={18} />, label: 'Edit Profile Information', action: () => setShowEdit(true) },
                        { icon: <Languages size={18} />, label: 'Choose App Language', action: () => setShowLanguage(true) },
                        { icon: <ShieldCheck size={18} />, label: 'Safety & Privacy Policy', action: () => setShowPolicy(true) },
                        { icon: <Star size={18} />, label: 'Rate CivilConnect App', action: () => setShowRate(true) },
                        { icon: <ShieldCheck size={18} />, label: 'Resolution Center', action: () => setShowResolution(true) },
                        { icon: <AlertCircle size={18} />, label: 'Report an Issue', action: () => setShowReport(true) },
                    ].map((item, i, arr) => (
                        <div key={item.label}
                            onClick={item.action}
                            className="preference-item-tap"
                            style={{
                                padding: '16px 20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderBottom: i === arr.length - 1 ? 'none' : '1.5px solid #F9FAFB',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid #F3E8FF', color: '#7C3AED' }}>
                                    {item.icon}
                                </div>
                                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '15px', fontWeight: '700', color: '#1E293B' }}>{item.label}</span>
                            </div>
                            <span style={{ color: '#D1D5DB', fontSize: '18px' }}>›</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Logout Button */}
            <div style={{ padding: '24px 20px 0' }}>
                <button
                    onClick={handleLogout}
                    className="sign-out-btn-animate"
                    style={{
                        width: '100%', padding: '16px', borderRadius: '16px',
                        background: '#FFF1F2', border: '1.5px solid #FECDD3',
                        color: '#E11D48', fontFamily: "'Inter', sans-serif", fontSize: '16px', fontWeight: '900',
                        cursor: 'pointer', transition: 'all 0.2s ease',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
                    }}
                >
                    <LogOut size={20} />
                    Sign Out Account
                </button>
                <p style={{ textAlign: 'center', fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#9CA3AF', marginTop: 8 }}>
                    CivilConnect Version 2.0.4 (Stable)
                </p>
            </div>

            {/* --- Modals/Overlays --- */}

            {/* Edit Profile Modal */}
            {showEdit && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'flex-end' }}>
                    <div style={{ background: '#fff', width: '100%', borderRadius: '32px 32px 0 0', padding: '32px 24px', animation: 'slideUp 0.3s ease-out', maxHeight: '90dvh', overflowY: 'auto' }}>
                        <div style={{ width: '40px', height: '4px', background: '#E5E7EB', borderRadius: '2px', margin: '0 auto 24px' }} />
                        <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: '800', color: '#111827', marginBottom: 20 }}>Edit Profile</h3>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                            <div style={{ position: 'relative' }}>
                                <div style={{ width: 80, height: 80, borderRadius: 24, background: '#F5F3FF', overflow: 'hidden', border: '2px solid #EDE9FE' }}>
                                    {preview ? <img src={preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <UserCircle size={40} color="#7C3AED" style={{ margin: 20 }} />}
                                </div>
                                <label style={{ position: 'absolute', bottom: -5, right: -5, width: 30, height: 30, borderRadius: 10, background: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid #fff' }}>
                                    <Camera size={14} color="#fff" />
                                    <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                                </label>
                            </div>
                        </div>

                        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                                <label style={{ fontSize: '11px', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', tracking: '0.1em', display: 'block', marginBottom: 8 }}>Full Name</label>
                                <input
                                    type="text" value={formData.fullName} onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                                    style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '1px solid #E5E7EB', outline: 'none', fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: '600' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '11px', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', tracking: '0.1em', display: 'block', marginBottom: 8 }}>Email Address</label>
                                <input
                                    type="email" value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '1px solid #E5E7EB', outline: 'none', fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: '600' }}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div>
                                    <label style={{ fontSize: '11px', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', tracking: '0.1em', display: 'block', marginBottom: 8 }}>City</label>
                                    <input
                                        type="text" value={formData.city} onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                                        style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '1px solid #E5E7EB', outline: 'none', fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: '600' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '11px', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', tracking: '0.1em', display: 'block', marginBottom: 8 }}>Area</label>
                                    <input
                                        type="text" value={formData.area} onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                                        style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '1px solid #E5E7EB', outline: 'none', fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: '600' }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ fontSize: '11px', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', tracking: '0.1em', display: 'block', marginBottom: 8 }}>Gender</label>
                                <div style={{ display: 'flex', gap: 10 }}>
                                    {['Male', 'Female', 'Other'].map(g => (
                                        <button
                                            key={g} type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, gender: g }))}
                                            style={{
                                                flex: 1, padding: '12px', borderRadius: '10px', border: '1.5px solid',
                                                borderColor: formData.gender === g ? '#7C3AED' : '#E5E7EB',
                                                background: formData.gender === g ? '#F5F3FF' : '#fff',
                                                color: formData.gender === g ? '#7C3AED' : '#6B7280',
                                                fontSize: '12px', fontWeight: '700', transition: 'all 0.2s'
                                            }}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button type="submit" style={{ marginTop: 10, width: '100%', padding: '16px', borderRadius: '14px', background: '#7C3AED', color: '#fff', border: 'none', fontWeight: '800', cursor: 'pointer', boxShadow: '0 10px 20px rgba(124, 58, 237, 0.2)' }}>
                                Save Changes
                            </button>
                            <button type="button" onClick={() => setShowEdit(false)} style={{ width: '100%', padding: '10px', background: 'none', border: 'none', color: '#9CA3AF', fontWeight: '800', fontSize: '13px', cursor: 'pointer', textTransform: 'uppercase' }}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Privacy Policy Modal */}
            {showPolicy && (
                <div style={{ position: 'fixed', inset: 0, background: '#fff', zIndex: 1000, overflowY: 'auto' }}>
                    <div style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
                            <button onClick={() => setShowPolicy(false)} style={{ border: 'none', background: '#F3F4F6', width: '40px', height: '40px', borderRadius: '12px', fontSize: '20px' }}>‹</button>
                            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: '800' }}>Privacy Policy</h3>
                        </div>
                        <div style={{ fontFamily: "'Inter', sans-serif", lineHeight: 1.6, color: '#4B5563' }}>
                            {cmsData.policyPoints.map(point => (
                                <div key={point.id}>
                                    <h4 style={{ color: '#111827', margin: '20px 0 10px' }}>{point.id}. {point.title}</h4>
                                    <p>{point.desc}</p>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            )}

            {/* Rate App Modal (Bottom Sheet) */}
            {showRate && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'flex-end' }}>
                    <div style={{ background: '#fff', width: '100%', borderRadius: '32px 32px 0 0', padding: '32px 24px', animation: 'slideUp 0.3s ease-out', textAlign: 'center' }}>
                        <div style={{ width: '40px', height: '4px', background: '#E5E7EB', borderRadius: '2px', margin: '0 auto 24px' }} />
                        <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '20px', fontWeight: '900', color: '#111827', marginBottom: 8 }}>{cmsData.ratingTitle}</h3>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#6B7280', marginBottom: 24 }}>{cmsData.ratingDesc}</p>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 32 }}>
                            {[1, 2, 3, 4, 5].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setRating(prev => prev === s ? s - 1 : s)}
                                    style={{ border: 'none', background: 'none', fontSize: '36px', cursor: 'pointer', transition: 'transform 0.2s active:scale-90' }}
                                >
                                    {s <= rating ? '⭐' : '☆'}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={handleRateSubmit}
                            style={{ width: '100%', padding: '16px', borderRadius: '16px', background: rating > 0 ? '#7C3AED' : '#F3F4F6', color: rating > 0 ? '#fff' : '#9CA3AF', border: 'none', fontWeight: '800', cursor: rating > 0 ? 'pointer' : 'default', transition: 'all 0.3s' }}
                            disabled={rating === 0}
                        >
                            Submit Review
                        </button>
                        <button onClick={() => setShowRate(false)} style={{ padding: '16px', color: '#9CA3AF', background: 'none', border: 'none', fontWeight: '600', cursor: 'pointer' }}>Later</button>
                    </div>
                </div>
            )}

            {/* Report Issue Modal */}
            {showReport && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} onClick={() => setShowReport(false)}>
                    <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '32px 32px 0 0', padding: '32px 24px 40px', display: 'flex', flexDirection: 'column', gap: 20, animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                        <div style={{ width: '48px', height: '6px', background: '#E2E8F0', borderRadius: '4px', margin: '0 auto -10px' }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>
                                <AlertCircle size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '20px', fontWeight: '900', color: '#111827', margin: '0 0 4px 0' }}>Report an Issue</h3>
                                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#6B7280', margin: 0, fontWeight: '500' }}>Describe the problem you are facing.</p>
                            </div>
                        </div>

                        {reportSuccess ? (
                            <div style={{ padding: '40px 20px', textAlign: 'center', animation: 'fadeInUp 0.3s ease-out' }}>
                                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '32px' }}>✓</div>
                                <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: '800', color: '#111827', marginBottom: 8 }}>Report Sent!</h3>
                                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#6B7280' }}>Our support team will review your issue and reach out shortly.</p>
                            </div>
                        ) : (
                            <>
                                <div style={{ background: '#F8FAFC', borderRadius: '20px', padding: '16px', border: '1px solid #F1F5F9' }}>
                                    <textarea
                                        value={reportText}
                                        onChange={(e) => setReportText(e.target.value)}
                                        placeholder="Tell us what went wrong..."
                                        style={{ width: '100%', minHeight: '120px', background: 'transparent', border: 'none', outline: 'none', fontSize: '15px', fontFamily: "'Inter', sans-serif", color: '#1F2937', resize: 'none' }}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: 12 }}>
                                    <button onClick={() => setShowReport(false)} style={{ flex: 1, padding: '16px', color: '#64748B', background: '#F1F5F9', borderRadius: '16px', border: 'none', fontWeight: '800', cursor: 'pointer' }}>Cancel</button>
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
                                                }, 2000);
                                            } catch (err) {
                                                console.error(err);
                                            }
                                        }}
                                        style={{ flex: 1, padding: '16px', borderRadius: '16px', background: reportText.trim() ? '#EF4444' : '#FCA5A5', color: '#fff', border: 'none', fontWeight: '900', cursor: reportText.trim() ? 'pointer' : 'default', transition: 'all 0.3s' }}
                                        disabled={!reportText.trim()}
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
                                                    <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#7C3AED', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '900' }}>A</div>
                                                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#0369A1', textTransform: 'uppercase' }}>Admin Reply</span>
                                                </div>
                                                <p style={{ margin: 0, fontSize: '13px', color: '#0C4A6E', fontWeight: '500', lineHeight: 1.5 }}>
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

            {showLanguage && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'flex-end' }}>
                    <div style={{ background: '#fff', width: '100%', borderRadius: '32px 32px 0 0', padding: '32px 24px', animation: 'slideUp 0.3s ease-out', maxHeight: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <div style={{ width: '40px', height: '4px', background: '#E5E7EB', borderRadius: '2px', margin: '0 auto 24px', flexShrink: 0 }} onClick={() => setShowLanguage(false)} />
                        <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '20px', fontWeight: '900', color: '#111827', marginBottom: 8, flexShrink: 0 }}>Choose App Language</h3>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#6B7280', marginBottom: 20, flexShrink: 0 }}>Select your preferred language from 30+ options.</p>
                        
                        <div 
                            data-lenis-prevent
                            style={{ 
                                overflowY: 'auto', 
                                flex: '1 1 auto', 
                                maxHeight: 'calc(80vh - 180px)', 
                                paddingBottom: 20, 
                                WebkitOverflowScrolling: 'touch', 
                                overscrollBehavior: 'contain' 
                            }} 
                            className="custom-scrollbar"
                        >
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
                                {[
                                    { name: 'English', native: 'English' },
                                    { name: 'Hindi', native: 'हिंदी' },
                                    { name: 'Marathi', native: 'मराठी' },
                                    { name: 'Gujarati', native: 'ગુજરાતી' },
                                    { name: 'Tamil', native: 'தமிழ்' },
                                    { name: 'Telugu', native: 'తెలుగు' },
                                    { name: 'Kannada', native: 'ಕನ್ನಡ' },
                                    { name: 'Malayalam', native: 'മലയാളം' },
                                    { name: 'Bengali', native: 'বাংলা' },
                                    { name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
                                    { name: 'Odia', native: 'ଓଡ଼ିଆ' },
                                    { name: 'Assamese', native: 'অসমীয়া' },
                                    { name: 'Maithili', native: 'मैथिली' },
                                    { name: 'Sanskrit', native: 'संस्कृतम्' },
                                    { name: 'Urdu', native: 'اردو' },
                                    { name: 'Kashmiri', native: 'کٲشُر' },
                                    { name: 'Santali', native: 'ᱥᱟᱱᱛᱟᱲᱤ' },
                                    { name: 'Spanish', native: 'Español' },
                                    { name: 'French', native: 'Français' },
                                    { name: 'German', native: 'Deutsch' },
                                    { name: 'Japanese', native: '日本語' },
                                    { name: 'Chinese', native: '中文' },
                                    { name: 'Russian', native: 'Русский' },
                                    { name: 'Arabic', native: 'العربية' },
                                    { name: 'Portuguese', native: 'Português' },
                                    { name: 'Italian', native: 'Italiano' },
                                    { name: 'Korean', native: '한국어' },
                                    { name: 'Vietnamese', native: 'Tiếng Việt' },
                                    { name: 'Thai', native: 'ไทย' },
                                    { name: 'Turkish', native: 'Türkçe' },
                                    { name: 'Dutch', native: 'Nederlands' }
                                ].map(lang => (
                                    <button
                                        key={lang.name}
                                        onClick={() => {
                                            setSelectedLang(lang.name);
                                            setTimeout(() => setShowLanguage(false), 300);
                                        }}
                                        style={{
                                            width: '100%', padding: '16px 20px', borderRadius: '16px', border: '1.5px solid',
                                            borderColor: selectedLang === lang.name ? '#7C3AED' : '#F1F5F9',
                                            background: selectedLang === lang.name ? '#F5F3FF' : '#fff',
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            transition: 'all 0.2s', cursor: 'pointer'
                                        }}
                                    >
                                        <div style={{ textAlign: 'left' }}>
                                            <p style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: selectedLang === lang.name ? '#7C3AED' : '#1F2937' }}>{lang.native}</p>
                                            <p style={{ margin: 0, fontSize: '12px', color: '#94A3B8', fontWeight: '600' }}>{lang.name}</p>
                                        </div>
                                        {selectedLang === lang.name && <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#7C3AED', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>✓</div>}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button onClick={() => setShowLanguage(false)} style={{ marginTop: 10, width: '100%', padding: '16px', borderRadius: '16px', background: '#F9FAFB', color: '#6B7280', border: 'none', fontWeight: '800', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>Close</button>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
                .pulse-btn { animation: pulse 2s infinite ease-in-out; }
                .preference-item-tap:active { 
                    transform: scale(0.97) translateX(4px);
                    background: #F9FAFB;
                }
                .sign-out-btn-animate:active {
                    transform: scale(0.97);
                    background: #FFE4E6;
                }
            `}</style>
        </div>
    );
};

export default Profile;
