import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const defaultSlides = [
    {
        title: "Let's get started",
        desc: "Build your dream project with verified experts and quality materials today.",
        img: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format"
    },
    {
        title: "Manage Everything",
        desc: "From labor tracking to material audits, manage your site directly with ease.",
        img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format"
    },
    {
        title: "Verified Experts",
        desc: "Connect with certified engineers and contractors for safe construction.",
        img: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format"
    }
];

const GetStarted = () => {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = React.useMemo(() => {
        const saved = localStorage.getItem('cc_get_started_banners');
        return saved ? JSON.parse(saved) : defaultSlides;
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % slides.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-screen bg-white flex flex-col items-center px-8 pt-20 pb-12 overflow-hidden">
            <style>{`
                @keyframes scaleIn {
                    from { transform: scale(0.8); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .img-animate { animation: scaleIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
                .text-animate { animation: slideUp 0.6s ease-out forwards; }
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-spin-slow {
                    animation: spin 8s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>

            {/* Central Circle Image Slider - MOVED UP */}
            <div className="relative w-full flex justify-center mb-6">
                <div key={currentSlide} className="w-64 h-64 rounded-full overflow-hidden border-[6px] border-[#7C3AED]/10 shadow-2xl img-animate z-10">
                    <img
                        key={slides[currentSlide].img}
                        src={slides[currentSlide].img}
                        alt="Onboarding"
                        className="w-full h-full object-cover"
                    />
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 border-2 border-dashed border-purple-100 rounded-full animate-spin-slow opacity-50" />
            </div>

            {/* Text & Indicators Section */}
            <div className="w-full text-center flex flex-col items-center bg-white z-10">
                <div key={`text-${currentSlide}`} className="text-animate mb-6">
                    <h1 className="text-2xl font-[1000] text-slate-900 tracking-tight mb-3">
                        {slides[currentSlide].title}
                    </h1>
                    <p className="text-slate-500/80 text-sm font-semibold leading-relaxed px-4 max-w-[300px] mx-auto">
                        {slides[currentSlide].desc}
                    </p>
                </div>

                {/* Progress Indicators */}
                <div className="flex gap-2 mb-8">
                    {slides.map((_, idx) => (
                        <div
                            key={idx}
                            style={{ transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
                            className={`h-1.5 rounded-full ${currentSlide === idx ? 'w-10 bg-[#7C3AED] shadow-[0_2px_8px_rgba(124,58,237,0.4)]' : 'w-4 bg-slate-100'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Bottom Button Section - MOVED DOWN SLIGHTLY */}
            <div className="w-full mt-auto pb-10">
                <button
                    onClick={() => navigate('/auth/mobile-input')}
                    className="w-full bg-[#7C3AED] text-white py-5 rounded-[24px] text-sm font-[1000] uppercase tracking-[0.3em] shadow-2xl shadow-purple-900/30 active:scale-95 transition-all outline-none"
                >
                    Get Started
                </button>
                <p className="text-center text-slate-500 text-[11px] font-[1000] uppercase tracking-widest mt-6 pb-2">
                    Premium Civil Construction Network
                </p>
            </div>
        </div>
    );
};

export default GetStarted;
