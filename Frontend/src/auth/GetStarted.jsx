import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBanners } from '../api/publicApi';

const defaultSlides = [
    {
        title: "Let's get started",
        description: "Build your dream project with verified experts and quality materials today.",
        image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format"
    },
    {
        title: "Manage Everything",
        description: "From labor tracking to material audits, manage your site directly with ease.",
        image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format"
    },
    {
        title: "Verified Experts",
        description: "Connect with certified engineers and contractors for safe construction.",
        image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format"
    }
];

const GetStarted = () => {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [slides, setSlides] = useState(defaultSlides);
    const intervalRef = useRef(null);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const data = await getBanners('get-started');
                if (data && data.length > 0) {
                    setSlides(data);
                    setCurrentSlide(0);
                }
            } catch (err) {
                console.error("Failed to fetch banners. Using defaults.", err);
            }
        };
        fetchBanners();
    }, []);

    useEffect(() => {
        if (slides.length <= 1) return;

        intervalRef.current = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 3000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [slides.length]);

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

            {/* Central Circle Image Slider */}
            <div className="relative w-full flex justify-center mb-6 min-h-[256px]">
                {slides.map((slide, index) => (
                    <div 
                        key={`slide-${index}`} 
                        className={`absolute w-64 h-64 rounded-full overflow-hidden border-[6px] border-[#7C3AED]/10 shadow-2xl z-10 transition-all duration-700 ease-in-out ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                    >
                        <img
                            src={`${slide.image}${slide.image.includes('?') ? '&' : '?'}w=600&q=70&fm=webp`}
                            alt={slide.title}
                            fetchPriority={index === 0 ? "high" : "low"}
                            loading={index === 0 ? "eager" : "lazy"}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
                {/* Decorative Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 border-2 border-dashed border-purple-100 rounded-full animate-spin-slow opacity-50" />
            </div>

            {/* Text & Indicators Section */}
            <div className="w-full text-center flex flex-col items-center bg-white z-10 mt-4 min-h-[140px] relative">
                {slides.map((slide, index) => (
                    <div 
                        key={`text-${index}`} 
                        className={`transition-all duration-500 space-y-3 w-full ${index === currentSlide ? 'opacity-100 translate-y-0 relative' : 'opacity-0 translate-y-4 absolute inset-x-0 pointer-events-none'}`}
                    >
                        <h1 className="text-2xl font-[1000] text-slate-900 tracking-tight">
                            {slide.title}
                        </h1>
                        <p className="text-slate-500/80 text-sm font-semibold leading-relaxed px-4 max-w-[300px] mx-auto">
                            {slide.description}
                        </p>
                    </div>
                ))}

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

            {/* Bottom Button Section */}
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
