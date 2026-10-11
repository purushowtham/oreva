'use client';

import { useRef, useState } from 'react';
import Magnet from '../Magnet';
import { gsap, useGSAP } from '@/lib/gsap';
import './HomeHero.css';

export default function HomeHero() {
  const root = useRef<HTMLElement>(null);
  const [magnetic, setMagnetic] = useState(false);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      setMagnetic(window.matchMedia('(pointer: fine)').matches);
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('.homeHero-kicker, .homeHero-copy, .homeHero-actions, .homeHero-foot', { y: 22, opacity: 0, duration: .9, stagger: .13 })
        .from('.homeHero-title > span', { yPercent: 105, rotate: 3, opacity: 0, duration: 1.25, stagger: .12 }, .1)
        .from('.homeHero-image', { clipPath: 'inset(100% 0 0 0)', scale: 1.12, duration: 1.6 }, .25)
        .from('.homeHero-detail, .homeHero-seal', { scale: .8, opacity: 0, rotate: -12, duration: 1.2, stagger: .15 }, .7);
      gsap.to('.homeHero-image img', { yPercent: 12, scale: 1.1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 1 } });
      gsap.to('.homeHero-editorial', { y: -65, opacity: .15, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 1 } });
      gsap.to('.homeHero-seal svg', { rotation: 360, repeat: -1, duration: 40, ease: 'none' });
      return () => setMagnetic(false);
    });
    return () => media.revert();
  }, { scope: root });

  return <section id="top" ref={root} className="homeHero" aria-labelledby="home-title">
    <div className="homeHero-editorial">
      <p className="homeHero-kicker"><span /> INDEPENDENT CREATIVE STUDIO</p>
      <h1 id="home-title" className="homeHero-title"><span>Spaces.</span><span>Stories.</span><span><em>Desire.</em></span></h1>
      <p className="homeHero-copy">We shape the way a space feels.<br />And the way a brand is remembered.</p>
      <div className="homeHero-actions">
        <Magnet disabled={!magnetic} padding={35} magnetStrength={5}>
          <a className="homeHero-cta" href="#work">Discover our work <span aria-hidden="true">↗</span></a>
        </Magnet>
        <a className="homeHero-link" href="#about">Enter the studio <span aria-hidden="true">↓</span></a>
      </div>
    </div>
    <div className="homeHero-composition">
      <span className="homeHero-caption">A STUDY IN LIGHT, FORM & FEELING</span>
      <div className="homeHero-image"><img src="/hero-bg.png" alt="Sunlit sculptural retail interior with stone displays and bronze arches" fetchPriority="high" /></div>
      <div className="homeHero-detail"><img src="/props/%40en__gold_.jpeg" alt="A sculptural material detail from the studio's visual archive" /><span>01 / THE ART OF ARRANGEMENT</span></div>
      <div className="homeHero-seal" aria-hidden="true"><svg viewBox="0 0 120 120"><defs><path id="hero-seal-circle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" /></defs><text><textPath href="#hero-seal-circle" textLength="276">ORÉVA STUDIO · COMPOSED WITH INTENT · </textPath></text></svg><span>✳</span></div>
      <span className="homeHero-imageNote">Considered spaces.<br /><i>Lasting impressions.</i></span>
    </div>
    <div className="homeHero-foot"><span>VISUAL MERCHANDISING / STYLING / RETAIL CONCEPTS</span><a href="#about">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></a></div>
  </section>;
}
