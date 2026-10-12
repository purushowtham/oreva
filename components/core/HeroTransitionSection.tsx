'use client';

import { useEffect, useRef } from 'react';
import InteractiveFooter from './InteractiveFooter';

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const easeInOut = (value: number) => value < 0.5 ? 4 * value ** 3 : 1 - (-2 * value + 2) ** 3 / 2;

export default function HeroTransitionSection() {
  const trackRef = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const weRef = useRef<HTMLSpanElement>(null);
  const transformRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLSpanElement>(null);
  const footerLayerRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    let target = 0;
    let progress = 0;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const footerCopy = footerLayerRef.current?.querySelector<HTMLElement>('.orevaFooter__content');

    const onScroll = () => {
      const track = trackRef.current;
      if (!track) return;
      const distance = track.offsetHeight - window.innerHeight;
      target = distance > 0 ? clamp(-track.getBoundingClientRect().top / distance) : 0;
    };

    const render = () => {
      progress = reducedMotion.matches ? target : progress + (target - progress) * 0.14;
      if (Math.abs(target - progress) < 0.0001) progress = target;

      const width = window.innerWidth;
      const height = window.innerHeight;
      const mobile = width <= 650;
      const centerX = mobile ? 70 : 78;
      const centerY = mobile ? 25 : 26;
      const x = width * centerX / 100;
      const y = height * centerY / 100;
      const fullRadius = Math.max(
        Math.hypot(x, y), Math.hypot(width - x, y),
        Math.hypot(x, height - y), Math.hypot(width - x, height - y),
      ) + 12;
      const reveal = reducedMotion.matches
        ? Number(progress >= 0.5)
        : easeInOut(clamp((progress - 0.08) / 0.7));
      const radius = 40 + (fullRadius - 40) * reveal;
      const split = reducedMotion.matches ? 0 : clamp(progress / 0.7);
      const heroFade = reducedMotion.matches ? reveal : clamp((progress - 0.2) / 0.44);
      const footerFade = reducedMotion.matches ? reveal : clamp((progress - 0.45) / 0.3);
      if (coverRef.current) coverRef.current.style.opacity = String(reducedMotion.matches ? 1 - reveal : 1 - clamp((progress - .035) / .14));

      if (weRef.current) weRef.current.style.transform = `translateY(${-19 * split}vh)`;
      if (transformRef.current) transformRef.current.style.transform = `translateY(${18 * split}vh)`;
      if (copyRef.current) copyRef.current.style.opacity = String(1 - heroFade);
      if (backgroundRef.current) backgroundRef.current.style.transform = `scale(${1 + 0.18 * split})`;
      if (hintRef.current) hintRef.current.style.opacity = String(1 - clamp(progress / 0.12));
      if (footerLayerRef.current) {
        footerLayerRef.current.style.clipPath = `circle(${radius.toFixed(1)}px at ${centerX}% ${centerY}%)`;
        footerLayerRef.current.inert = progress < 0.7;
      }
      if (footerCopy) {
        footerCopy.style.opacity = String(footerFade);
        footerCopy.style.transform = `translateY(${((1 - footerFade) * 24).toFixed(1)}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${centerX}%`;
        ringRef.current.style.top = `${centerY}%`;
        ringRef.current.style.width = `${radius * 2}px`;
        ringRef.current.style.height = `${radius * 2}px`;
        ringRef.current.style.opacity = String(1 - clamp((reveal - 0.86) / 0.14));
      }
      frame = requestAnimationFrame(render);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    progress = target;
    frame = requestAnimationFrame(render);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={trackRef} className="hero-transition-track" style={{ height: '220svh', position: 'relative', background: '#8c775d' }} aria-label="We Transform and contact">
      <span id="contact" aria-hidden="true" style={{ position: 'absolute', bottom: 0, left: 0, width: 1, height: '100svh', pointerEvents: 'none' }} />
      <div style={{ position: 'sticky', top: 0, height: '100svh', overflow: 'hidden', display: 'grid', placeItems: 'center', isolation: 'isolate' }}>
        <div
          ref={backgroundRef}
          aria-hidden="true"
          style={{ position: 'absolute', inset: '-3%', zIndex: -2, background: 'radial-gradient(circle at 60% 40%, #9e8970 0%, #8c775d 55%, #6b5b47 100%)', willChange: 'transform' }}
        />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: -1, background: 'repeating-linear-gradient(45deg, rgba(222,209,188,.035), rgba(222,209,188,.035) 2px, transparent 2px, transparent 14px)' }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: '0 0 auto', height: '24svh', zIndex: -1, background: 'linear-gradient(#8c775d, transparent)', pointerEvents: 'none' }} />

        <div ref={copyRef} style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 20px', willChange: 'opacity' }}>
          <img src="/logo/logo.svg" alt="" style={{ display: 'block', width: 'clamp(54px, 6vw, 90px)', height: 'auto', margin: '0 auto 24px', opacity: .95 }} />
          <h2 style={{ margin: 0, font: "600 clamp(4rem, 15vw, 13rem)/.88 'Cormorant Garamond', Georgia, serif", letterSpacing: '-.02em', color: '#f6f1e7', textShadow: '0 10px 40px rgba(0,0,0,.3)' }}>
            <span ref={weRef} style={{ display: 'block', willChange: 'transform' }}>We</span>
            <span ref={transformRef} style={{ display: 'block', fontStyle: 'italic', color: '#ded1bc', willChange: 'transform' }}>Transform</span>
          </h2>
          <p style={{ margin: '36px 0 0', font: "400 clamp(10px, 1.2vw, 14px) Montserrat, sans-serif", letterSpacing: '.26em', color: '#e0d5c5', textTransform: 'uppercase' }}>
            Visual merchandising · Styling · Retail concepts
          </p>
        </div>
        <span ref={hintRef} aria-hidden="true" style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', zIndex: 1, color: '#ded1bc', font: '400 10px Montserrat, sans-serif', letterSpacing: '.35em', textTransform: 'uppercase' }}>Scroll</span>

        <div
          ref={footerLayerRef}
          className="transformFooterViewport"
          style={{ position: 'absolute', inset: 0, zIndex: 2, overflow: 'hidden', clipPath: 'circle(40px at 78% 26%)', willChange: 'clip-path' }}
        >
          <InteractiveFooter embedded />
          <div ref={coverRef} aria-hidden="true" style={{ position: 'absolute', inset: 0, background: '#e8ddc9', pointerEvents: 'none' }} />
        </div>
        <div ref={ringRef} aria-hidden="true" style={{ position: 'absolute', left: '78%', top: '26%', width: 80, height: 80, border: '8px solid #9a723e', borderRadius: '50%', transform: 'translate(-50%, -50%)', zIndex: 3, pointerEvents: 'none', boxSizing: 'border-box', willChange: 'width, height, opacity' }} />
      </div>
    </section>
  );
}
