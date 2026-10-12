'use client';

import { useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { gsap, useGSAP } from '@/lib/gsap';
import BoutiqueScene, { type BoutiqueZone } from './BoutiqueScene';
import { TextEffect, wordSpringVariants } from './text-effect';
import './HomeHero.css';

export default function HomeHero() {
  const root = useRef<HTMLElement>(null);
  const [blueprint, setBlueprint] = useState(false);
  const [zone, setZone] = useState<BoutiqueZone>('display');
  const details = {
    display: { title: 'The art of display.', text: 'Light, proportion and material. Every detail draws the eye.' },
    lounge: { title: 'A moment to stay.', text: 'Sculptural seating turns a retail visit into a personal experience.' },
    arrival: { title: 'An invitation inside.', text: 'A considered threshold sets the tone for everything that follows.' },
  };
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .fromTo('.homeHero-links a, .homeHero-controls', { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: .7, stagger: .1 }, .9)
        .fromTo('.homeHero-foot > *', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: .7, stagger: .12 }, 1)
        .fromTo('.homeHero-object', { opacity: 0, y: 35 }, { opacity: 1, y: 0, duration: 1.8 }, .15);
      gsap.timeline({ scrollTrigger: {
        trigger: root.current,
        start: () => window.innerWidth <= 700 ? 'bottom bottom' : 'top top',
        end: 'bottom top', scrub: .65, invalidateOnRefresh: true,
      } })
        .fromTo('.homeHero-title', { y: 0, opacity: 1 }, { y: -80, opacity: 0, ease: 'none', immediateRender: false }, 0)
        .fromTo('.homeHero-aside, .homeHero-foot, .homeHero-controls', { opacity: 1, y: 0 }, { opacity: 0, y: -30, ease: 'none', immediateRender: false }, 0)
        .fromTo('.homeHero-object', { y: 0, opacity: 1 }, { y: -45, opacity: 0, ease: 'none', immediateRender: false }, .2)
        .to(root.current, { backgroundColor: '#EFECE5', ease: 'sine.inOut', duration: .55 }, .3);
    });
    return () => media.revert();
  }, { scope: root });

  return <section id="top" ref={root} className="homeHero" aria-labelledby="home-title">
    <div className="homeHero-stage">
      <div className="homeHero-editorial">
        <p className="homeHero-eyebrow">ORÉVA · Spaces, considered.</p>
        <h1 id="home-title" className="homeHero-title"><span><TextEffect per="word" variants={wordSpringVariants} delay={.15}>From blueprint</TextEffect></span><span><em><TextEffect per="word" variants={wordSpringVariants} delay={.4}>to experience.</TextEffect></em></span></h1>
        <div className="homeHero-aside">
          <p><TextEffect per="char" preset="fade" delay={.65} stagger={.025}>We compose spaces that make people feel something.</TextEffect></p>
          <nav className="homeHero-links" aria-label="Explore ORÉVA">
            <a href="#work">Explore our work<ArrowUpRight size={17} aria-hidden="true" /></a>
          </nav>
        </div>
      </div>
      <div className={`homeHero-world${blueprint ? ' is-blueprint' : ''}`}>
        <div className="homeHero-object"><BoutiqueScene blueprint={blueprint} zone={zone} onSelect={setZone} /></div>
        <div className="homeHero-controls">
          <div className="homeHero-viewSwitch" role="group" aria-label="Boutique view">
            <button aria-pressed={!blueprint} onClick={() => setBlueprint(false)}>Experience</button>
            <button aria-pressed={blueprint} onClick={() => setBlueprint(true)}>Blueprint</button>
          </div>
          <span className="homeHero-dragHint">Drag to explore</span>
        </div>
        <div className="homeHero-zoneNav" role="group" aria-label="Explore the boutique">
          {([{ id: 'arrival', label: 'Arrival' }, { id: 'display', label: 'Display' }, { id: 'lounge', label: 'Lounge' }] as const).map((item, index) =>
            <button key={item.id} aria-pressed={zone === item.id} onClick={() => setZone(item.id)}><span>0{index + 1}</span>{item.label}</button>)}
        </div>
        <div className="homeHero-sceneCaption" aria-live="polite" aria-atomic="true">
          <h2><TextEffect key={zone} per="word" variants={wordSpringVariants} delay={.15}>{details[zone].title}</TextEffect></h2><p><TextEffect key={zone} per="char" preset="fade" delay={.3} stagger={.018}>{details[zone].text}</TextEffect></p>
        </div>
      </div>
      <div className="homeHero-foot"><span>VISUAL MERCHANDISING · SPATIAL DESIGN · STYLING</span><a href="#about">Enter the studio<ArrowDown size={16} aria-hidden="true" /></a></div>
    </div>
    <div className="homeHero-colorBridge" aria-hidden="true" />
  </section>;
}
