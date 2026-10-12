'use client';

import { useRef } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { gsap, useGSAP } from '@/lib/gsap';
import LogoSculpture from './LogoSculpture';
import './HomeHero.css';

export default function HomeHero() {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .fromTo('.homeHero-title > span', { yPercent: 65, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.2, stagger: .13 })
        .fromTo('.homeHero-aside, .homeHero-foot', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .9, stagger: .12 }, .35)
        .from('.homeHero-model', { opacity: 0, scale: .92, duration: 1.8 }, .15);
      gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: .65 } })
        .fromTo('.homeHero-title', { y: 0, opacity: 1 }, { y: -80, opacity: 0, ease: 'none', immediateRender: false }, 0)
        .fromTo('.homeHero-aside, .homeHero-foot', { opacity: 1, y: 0 }, { opacity: 0, y: -30, ease: 'none', immediateRender: false }, 0)
        .fromTo('.homeHero-model', { y: 0, opacity: 1 }, { y: -45, opacity: 0, ease: 'none', immediateRender: false }, .2)
        .to(root.current, { backgroundColor: '#EFECE5', ease: 'sine.inOut', duration: .55 }, .3);
    });
    return () => media.revert();
  }, { scope: root });

  return <section id="top" ref={root} className="homeHero" aria-labelledby="home-title">
    <div className="homeHero-stage">
      <LogoSculpture />
      <div className="homeHero-editorial">
        <h1 id="home-title" className="homeHero-title"><span>ORÉVA</span><span><em>Studio</em></span></h1>
      </div>
      <div className="homeHero-aside">
        <p>We shape the way a space feels.<br />And the way a brand is remembered.</p>
        <nav className="homeHero-links" aria-label="Explore ORÉVA">
          <a href="#work"><span>01</span>Selected projects<ArrowUpRight size={17} aria-hidden="true" /></a>
          <a href="#services"><span>02</span>What we make<ArrowUpRight size={17} aria-hidden="true" /></a>
          <a href="#method"><span>03</span>The ORÉVA method<ArrowUpRight size={17} aria-hidden="true" /></a>
        </nav>
      </div>
      <div className="homeHero-foot"><span>SPACES. STORIES. DESIRE.</span><a href="#about">Enter the studio<ArrowDown size={16} aria-hidden="true" /></a></div>
    </div>
    <div className="homeHero-colorBridge" aria-hidden="true" />
  </section>;
}
