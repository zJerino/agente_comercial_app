/**
 * Carousel Component
 * @author Google Gemini IA
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

/**
 * Hook personalizado para detectar visibilidad (IntersectionObserver)
 */
const useVisibility = (ref) => {
    const [isIntersecting, setIntersecting] = useState(false);

    useEffect(() => {
        if (!ref.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => setIntersecting(entry.isIntersecting),
            { threshold: 0.1 } // Se activa cuando al menos el 10% es visible
        );

        observer.observe(ref.current);

        return () => {
            observer.disconnect();
        };
    }, [ref]);

    return isIntersecting;
};

/**
 * Componente Carousel
 */
export default function Main ({ 
    items = [], 
    autoSlide = true, 
    autoSlideInterval = 5000,
    customClasses = {} 
}) {
    const [curr, setCurr] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);

    const containerRef = useRef(null);
    const isVisible = useVisibility(containerRef);

    const normalizedItems = useMemo(() => items.map(item => {
        if (typeof item === 'string') {
            return { src: item, type: 'simple' };
        }
        return { ...item, type: 'complex' };
    }), [items]);

    const prev = useCallback(() => {
        setCurr((curr) => (curr === 0 ? normalizedItems.length - 1 : curr - 1));
        setDragOffset(0);
    }, [normalizedItems.length]);

    const next = useCallback(() => {
        setCurr((curr) => (curr === normalizedItems.length - 1 ? 0 : curr + 1));
        setDragOffset(0);
    }, [normalizedItems.length]);

    useEffect(() => {
        if (!autoSlide || isDragging || !isVisible) return;
        
        const slideInterval = setInterval(next, autoSlideInterval);
        return () => clearInterval(slideInterval);
    }, [autoSlide, autoSlideInterval, isDragging, next, curr, isVisible]);

    const handleTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
        setIsDragging(true);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
        const currentTouch = e.targetTouches[0].clientX;
        const diff = currentTouch - touchStart;
        setDragOffset(diff);
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        const minSwipeDistance = 50;

        if (!touchStart || !touchEnd) {
            setDragOffset(0);
            return;
        }

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            next();
        } else if (isRightSwipe) {
            prev();
        } else {
            setDragOffset(0);
        }

        setTouchStart(0);
        setTouchEnd(0);
    };

    return (
        <div className={`relative group overflow-hidden w-full ${customClasses.container || ''}`} ref={containerRef} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} >
            <div className="flex transition-transform duration-500 ease-out h-full" style={{ transition: isDragging ? 'none' : 'transform 500ms ease-out', transform: `translateX(calc(-${curr * 100}% + ${dragOffset}px))` }}>
                {normalizedItems.map((item, index) => (
                    <div key={index} className={`min-w-full relative flex items-center justify-center ${customClasses.slide || 'h-64 md:h-96'}`} >
                        <img src={item.src} alt={`Slide ${index}`} loading="lazy" className={`w-full h-full object-cover ${customClasses.image || ''}`} draggable="false" />
                        
                        {(item.text || item.btn) && (
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col items-center justify-end pb-12 px-4 text-center">
                                
                                {item.text && (
                                    <h2 className={`text-white text-2xl md:text-4xl font-bold mb-4 drop-shadow-lg ${customClasses.text || ''}`}>
                                        {item.text}
                                    </h2>
                                )}

                                {item.btn && (
                                    <a href={item.btn.link} className={`inline-flex items-center gap-2 px-6 py-2 rounded-full font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-lg ${item.btn.customClass ? item.btn.customClass : 'bg-white text-black hover:bg-gray-100'} `} onClick={(e) => { if (Math.abs(dragOffset) > 10) e.preventDefault(); }} >
                                        {item.btn.text}
                                        <i className="bi bi-circle"></i>
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="absolute inset-0 flex items-center justify-between p-4 pointer-events-none">
                <button onClick={prev} className={` pointer-events-auto p-2 rounded-full bg-white/30 backdrop-blur-sm text-white hover:bg-white/50 transition-all shadow-lg opacity-0 group-hover:opacity-100 hidden md:block ${customClasses.arrowBtn || ''}`} >
                    <i className="bi bi-chevron-left"></i>
                </button>
                <button onClick={next} className={`pointer-events-auto p-2 rounded-full bg-white/30 backdrop-blur-sm text-white hover:bg-white/50 transition-all shadow-lg opacity-0 group-hover:opacity-100 hidden md:block ${customClasses.arrowBtn || ''} `} >
                    <i className="bi bi-chevron-right"></i>
                </button>
            </div>

            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {normalizedItems.map((_, i) => (
                    <div key={i} className={` transition-all size-[.5rem] bg-white rounded-full cursor-pointer shadow-sm ${curr === i ? "p-0.5 opacity-100 scale-125" : "bg-opacity-50 hover:bg-opacity-75"} `} onClick={() => setCurr(i)} />
                ))}
            </div>
        </div>
    );
};