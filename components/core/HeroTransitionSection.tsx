'use client';

import React, { useEffect, useRef } from 'react';

export interface PhotoObjectData {
    id: string;
    title: string;
    widthVw: number;
    minPx: number;
    left: string;
    depth: number;
    tilt: number;
    startP: number;
    bg?: string;
    imgSrc?: string;
}

const DEFAULT_PHOTOS: PhotoObjectData[] = [
    { id: 'IMG 01', title: 'TRAVERTINE', widthVw: 8.5, minPx: 72, left: '10%', depth: 0.7, tilt: -4.5, startP: 0.32, bg: 'radial-gradient(circle, #EADFCE, #B8A992)' },
    { id: 'IMG 02', title: 'SILK SILHOUETTE', widthVw: 10.0, minPx: 84, left: '23%', depth: 1.2, tilt: 3.8, startP: 0.345, bg: 'radial-gradient(circle, #F6F1E7, #DED1BC)' },
    { id: 'IMG 03', title: 'BRUSHED BRONZE', widthVw: 7.0, minPx: 64, left: '38%', depth: 0.9, tilt: -2.2, startP: 0.37, bg: 'radial-gradient(circle, #C4A57B, #9A723E)' },
    { id: 'IMG 04', title: 'ARCHITECTURAL', widthVw: 10.5, minPx: 88, left: '52%', depth: 1.5, tilt: 5.5, startP: 0.395, bg: 'radial-gradient(circle, #DED1BC, #A6957B)' },
    { id: 'IMG 05', title: 'EDITORIAL', widthVw: 7.5, minPx: 68, left: '67%', depth: 0.8, tilt: -5.0, startP: 0.42, bg: 'radial-gradient(circle, #E5DCCC, #B8A992)' },
    { id: 'IMG 06', title: 'RAW MARBLE', widthVw: 9.0, minPx: 78, left: '80%', depth: 1.1, tilt: -3.0, startP: 0.445, bg: 'radial-gradient(circle, #D5C7B1, #8C7B65)' },
    { id: 'IMG 07', title: 'GLASS STUDY', widthVw: 8.0, minPx: 70, left: '44%', depth: 1.3, tilt: 4.2, startP: 0.47, bg: 'radial-gradient(circle, #F6F1E7, #B8A992)' }
];

interface HeroTransitionSectionProps {
    photos?: PhotoObjectData[];
    className?: string;
}

export default function HeroTransitionSection({ photos = DEFAULT_PHOTOS, className = '' }: HeroTransitionSectionProps) {
    const trackRef = useRef<HTMLDivElement>(null);
    const heroBgWrapRef = useRef<HTMLDivElement>(null);
    const heroCopyRef = useRef<HTMLDivElement>(null);
    const heroLineWeRef = useRef<HTMLSpanElement>(null);
    const heroLineTransformRef = useRef<HTMLSpanElement>(null);
    const scrollHintRef = useRef<HTMLDivElement>(null);
    const page2LayerRef = useRef<HTMLDivElement>(null);
    const page2HeadingRef = useRef<HTMLDivElement>(null);
    const ringCircleRef = useRef<SVGCircleElement>(null);
    const photoRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        let animationFrameId: number;
        let targetP = 0;
        let currentP = 0;
        const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        function easeInOutCubic(t: number): number {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        function easeOutCubic(t: number): number {
            return 1 - Math.pow(1 - t, 3);
        }

        function clamp(val: number, min: number, max: number): number {
            return Math.max(min, Math.min(max, val));
        }

        function render() {
            if (isReducedMotion) {
                currentP = targetP;
            } else {
                currentP += (targetP - currentP) * 0.1;
                if (Math.abs(targetP - currentP) < 0.0001) {
                    currentP = targetP;
                }
            }

            const p = currentP;
            const windowW = window.innerWidth;
            const windowH = window.innerHeight;
            const isMobile = windowW <= 768;

            const cxPercent = isMobile ? 70 : 78;
            const cyPercent = 26;
            const cxPx = (cxPercent / 100) * windowW;
            const cyPx = (cyPercent / 100) * windowH;

            // 1. Scroll hint fade out (p 0 to 0.08)
            if (scrollHintRef.current) {
                const hintOpacity = 1 - clamp(p / 0.08, 0, 1);
                scrollHintRef.current.style.opacity = hintOpacity.toFixed(3);
            }

            // 2. Hero copy split & fade (p 0 to 0.38)
            const copyProgress = clamp(p / 0.38, 0, 1);
            const copyFadeProgress = clamp(p / 0.34, 0, 1);

            if (heroLineWeRef.current) {
                heroLineWeRef.current.style.transform = `translateY(${-22 * copyProgress}vh)`;
            }
            if (heroLineTransformRef.current) {
                heroLineTransformRef.current.style.transform = `translateY(${20 * copyProgress}vh)`;
            }
            if (heroCopyRef.current) {
                heroCopyRef.current.style.opacity = (1 - copyFadeProgress).toFixed(3);
            }

            // Hero BG zoom (1 to 1.25) & drift up (4%)
            if (heroBgWrapRef.current) {
                const bgScale = 1 + 0.25 * p;
                const bgDriftY = -4 * p;
                heroBgWrapRef.current.style.transform = `scale(${bgScale.toFixed(4)}) translateY(${bgDriftY.toFixed(2)}%)`;
            }

            // 3. Ring to Iris (p 0 to 0.55)
            const dBL = Math.hypot(cxPx, windowH - cyPx);
            const dTL = Math.hypot(cxPx, cyPx);
            const dBR = Math.hypot(windowW - cxPx, windowH - cyPx);
            const dTR = Math.hypot(windowW - cxPx, cyPx);
            const maxRadius = Math.max(dBL, dTL, dBR, dTR);

            const irisP = clamp(p / 0.55, 0, 1);
            const irisEase = easeInOutCubic(irisP);
            const currentR = maxRadius * irisEase;

            if (page2LayerRef.current) {
                page2LayerRef.current.style.clipPath = `circle(${currentR.toFixed(1)}px at ${cxPercent}% ${cyPercent}%)`;
            }

            // Bronze Ring animation
            const initialRingR = isMobile ? 32 : 44;
            const ringRadius = currentR + (initialRingR * (1 - irisEase));
            const ringStrokeWidth = 10 - (8 * irisEase);

            let ringOpacity = 1;
            if (p > 0.50) {
                ringOpacity = 1 - clamp((p - 0.50) / (0.62 - 0.50), 0, 1);
            }

            if (ringCircleRef.current) {
                ringCircleRef.current.setAttribute('cx', `${cxPercent}%`);
                ringCircleRef.current.setAttribute('cy', `${cyPercent}%`);
                ringCircleRef.current.setAttribute('r', Math.max(0, ringRadius).toFixed(1));
                ringCircleRef.current.setAttribute('stroke-width', ringStrokeWidth.toFixed(2));
                ringCircleRef.current.style.opacity = ringOpacity.toFixed(3);
            }

            // 4. Page 2 Scattered Photos (from p 0.32)
            photos.forEach((data, index) => {
                const el = photoRefs.current[index];
                if (!el) return;

                if (p < data.startP) {
                    el.style.opacity = '0';
                    el.style.transform = `translate3d(0, 100vh, 0) rotate(${data.tilt * 3.5}deg)`;
                    return;
                }

                const itemP = clamp((p - data.startP) / (0.92 - data.startP), 0, 1);
                const itemEase = easeOutCubic(itemP);

                const travelDistVh = 60 + data.depth * 40;
                const currentYVh = (1 - itemEase) * travelDistVh;
                const currentTilt = (data.tilt * 3.5) * (1 - itemEase) + data.tilt * itemEase;
                const itemOpacity = clamp(itemP / 0.15, 0, 1);

                el.style.opacity = itemOpacity.toFixed(3);
                el.style.transform = `translate3d(0, ${currentYVh.toFixed(2)}vh, 0) rotate(${currentTilt.toFixed(2)}deg)`;
            });

            // 5. Page 2 Heading (p 0.58 to 0.83)
            if (page2HeadingRef.current) {
                if (p < 0.58) {
                    page2HeadingRef.current.style.opacity = '0';
                    page2HeadingRef.current.style.transform = 'translate(-50%, calc(-50% + 30px))';
                } else {
                    const headP = clamp((p - 0.58) / (0.83 - 0.58), 0, 1);
                    const headEase = easeOutCubic(headP);
                    const headYOffset = (1 - headEase) * 30;

                    page2HeadingRef.current.style.opacity = headEase.toFixed(3);
                    page2HeadingRef.current.style.transform = `translate(-50%, calc(-50% + ${headYOffset.toFixed(1)}px))`;
                }
            }

            animationFrameId = requestAnimationFrame(render);
        }

        function onScroll() {
            if (!trackRef.current) return;
            const trackRect = trackRef.current.getBoundingClientRect();
            const totalScrollable = trackRef.current.offsetHeight - window.innerHeight;
            if (totalScrollable <= 0) return;

            const currentScroll = -trackRect.top;
            targetP = clamp(currentScroll / totalScrollable, 0, 1);
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        onScroll();
        animationFrameId = requestAnimationFrame(render);

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            cancelAnimationFrame(animationFrameId);
        };
    }, [photos]);

    return (
        <section ref={trackRef} className={`hero-transition-track ${className}`} style={{ height: '360vh', position: 'relative' }}>
            <div
                style={{
                    position: 'sticky',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    overflow: 'hidden',
                    paddingTop: 'env(safe-area-inset-top)',
                    paddingBottom: 'env(safe-area-inset-bottom)',
                }}
            >
                {/* ─── Z1: HERO LAYER ─── */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: 1,
                        backgroundColor: '#8C775D',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <div
                        ref={heroBgWrapRef}
                        style={{
                            position: 'absolute',
                            top: '-3%',
                            left: '-3%',
                            width: '106%',
                            height: '106%',
                            overflow: 'hidden',
                            willChange: 'transform',
                        }}
                    >
                        <div
                            style={{
                                width: '100%',
                                height: '100%',
                                background: 'radial-gradient(circle at 60% 40%, #9E8970 0%, #8C775D 55%, #6B5B47 100%)',
                                position: 'relative',
                            }}
                        >
                            {/* Fine stripe overlay */}
                            <div
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'repeating-linear-gradient(45deg, rgba(222,209,188,0.035), rgba(222,209,188,0.035) 2px, transparent 2px, transparent 14px)',
                                    pointerEvents: 'none',
                                }}
                            />
                        </div>
                        <div
                            style={{
                                position: 'absolute',
                                bottom: '40px',
                                left: '40px',
                                fontFamily: "'Montserrat', sans-serif",
                                fontSize: '11px',
                                letterSpacing: '0.35em',
                                color: 'rgba(222, 209, 188, 0.4)',
                                border: '1px solid rgba(222, 209, 188, 0.2)',
                                padding: '8px 16px',
                                borderRadius: '4px',
                                textTransform: 'uppercase',
                                pointerEvents: 'none',
                            }}
                        >
                            HERO IMAGE PLACEHOLDER
                        </div>
                    </div>

                    <div
                        ref={heroCopyRef}
                        style={{
                            position: 'relative',
                            zIndex: 2,
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            willChange: 'transform, opacity',
                            padding: '0 20px',
                        }}
                    >
                        <img
                            src="/logo/logo.svg"
                            alt="ORÉVA Studio Logo"
                            style={{
                                width: 'clamp(54px, 6vw, 90px)',
                                height: 'auto',
                                marginBottom: '24px',
                                filter: 'drop-shadow(0 6px 20px rgba(154, 114, 62, 0.4))',
                                opacity: 0.95,
                            }}
                        />
                        <h1
                            style={{
                                font: "600 clamp(4rem, 15vw, 13rem)/0.88 'Cormorant Garamond', serif",
                                color: '#F6F1E7',
                                letterSpacing: '-0.02em',
                                margin: 0,
                                textShadow: '0 10px 40px rgba(0,0,0,0.4)',
                            }}
                        >
                            <span ref={heroLineWeRef} style={{ display: 'block', willChange: 'transform' }}>
                                We
                            </span>
                            <span ref={heroLineTransformRef} style={{ display: 'block', fontStyle: 'italic', color: '#DED1BC', willChange: 'transform' }}>
                                Transform
                            </span>
                        </h1>
                        <p
                            style={{
                                marginTop: '36px',
                                font: "400 clamp(10px, 1.2vw, 14px) 'Montserrat', sans-serif",
                                letterSpacing: '0.32em',
                                color: '#B8A992',
                                textTransform: 'uppercase',
                            }}
                        >
                            VISUAL MERCHANDISING · STYLING · RETAIL CONCEPTS
                        </p>
                    </div>

                    <div
                        ref={scrollHintRef}
                        style={{
                            position: 'absolute',
                            bottom: '32px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: 2,
                            font: "400 10px 'Montserrat', sans-serif",
                            letterSpacing: '0.35em',
                            color: '#DED1BC',
                            textTransform: 'uppercase',
                            opacity: 0.8,
                            willChange: 'opacity',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '8px',
                        }}
                    >
                        SCROLL
                    </div>
                </div>

                {/* ─── Z2: PAGE 2 LAYER (REVEALED THROUGH CLIP-PATH CIRCLE) ─── */}
                <div
                    ref={page2LayerRef}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: 2,
                        backgroundColor: '#F6F1E7',
                        overflow: 'hidden',
                        willChange: 'clip-path',
                        clipPath: 'circle(0px at 78% 26%)',
                    }}
                >
                    <div
                        ref={page2HeadingRef}
                        style={{
                            position: 'absolute',
                            top: '30%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            textAlign: 'center',
                            zIndex: 10,
                            width: '90%',
                            maxWidth: '800px',
                            willChange: 'opacity, transform',
                            opacity: 0,
                        }}
                    >
                        <span
                            style={{
                                font: "400 clamp(10px, 1.1vw, 13px) 'Montserrat', sans-serif",
                                letterSpacing: '0.3em',
                                color: '#9A723E',
                                textTransform: 'uppercase',
                                marginBottom: '12px',
                                display: 'block',
                            }}
                        >
                            SELECTED OBJECTS
                        </span>
                        <h2
                            style={{
                                font: "600 clamp(2.2rem, 5.5vw, 4.8rem)/1.1 'Cormorant Garamond', serif",
                                color: '#4A3828',
                                margin: 0,
                            }}
                        >
                            Materials, <i style={{ fontStyle: 'italic', color: '#9A723E' }}>composed</i> with intent.
                        </h2>
                    </div>

                    {/* 7 Scattered Framed Photos */}
                    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
                        {photos.map((data, idx) => (
                            <div
                                key={data.id || idx}
                                ref={(el) => { photoRefs.current[idx] = el; }}
                                style={{
                                    position: 'absolute',
                                    aspectRatio: '3 / 4',
                                    width: `max(${data.widthVw}vw, ${data.minPx}px)`,
                                    left: data.left,
                                    bottom: '18vh',
                                    backgroundColor: '#FFFFFF',
                                    padding: '6px',
                                    borderRadius: '2px',
                                    boxShadow: '0 12px 30px rgba(36, 33, 29, 0.15), 0 2px 6px rgba(36, 33, 29, 0.08)',
                                    willChange: 'transform, opacity',
                                    opacity: 0,
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <div
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: data.bg || '#DED1BC',
                                    }}
                                >
                                    {data.imgSrc ? (
                                        <img src={data.imgSrc} alt={data.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <>
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    inset: '4px',
                                                    border: '1px solid rgba(184, 169, 146, 0.4)',
                                                    pointerEvents: 'none',
                                                }}
                                            />
                                            <span
                                                style={{
                                                    font: "400 10px 'Montserrat', sans-serif",
                                                    letterSpacing: '0.2em',
                                                    color: '#4A3828',
                                                    opacity: 0.75,
                                                    textAlign: 'center',
                                                    padding: '4px',
                                                }}
                                            >
                                                {data.id}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ─── Z3: BRONZE RING LAYER ─── */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none' }}>
                    <svg style={{ width: '100%', height: '100%', display: 'block' }}>
                        <circle
                            ref={ringCircleRef}
                            cx="78%"
                            cy="26%"
                            r="40"
                            fill="none"
                            stroke="#9A723E"
                            strokeWidth="10"
                            style={{ willChange: 'r, stroke-width, opacity' }}
                        />
                    </svg>
                </div>
            </div>
        </section>
    );
}
