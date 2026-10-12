'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import './MethodSection.css';
import { TextEffect, wordSpringVariants } from './text-effect';

const steps = [
  { title: 'Discover', line: 'Listen first. See what matters.', image: '/method/Discover.PNG' },
  { title: 'Concept', line: 'Give the idea a clear direction.', image: '/method/Concept.PNG' },
  { title: 'Curate', line: 'Choose every detail with intent.', image: '/method/Curate.PNG' },
  { title: 'Design', line: 'Bring form and feeling together.', image: '/method/Design.PNG' },
  { title: 'Experience', line: 'Make it memorable in the real world.', image: '/method/Experience.PNG' },
];

export default function MethodSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const rows = Array.from(section.querySelectorAll<HTMLElement>('.methodEditorial__row'));
      const colors = ['#ded1bc', '#24211d', '#3b3029', '#594f42', '#c5b69e', '#ded1bc', '#f6f1e7'];
      const channels = colors.map((color) => [1, 3, 5].map((offset) => parseInt(color.slice(offset, offset + 2), 16)));
      const light = section.querySelector('.methodEditorial__light');
      const setBackground = gsap.quickSetter(section, 'backgroundColor');
      const setInk = gsap.quickSetter(section, '--method-ink');
      const setMuted = gsap.quickSetter(section, '--method-muted');
      const setAccent = gsap.quickSetter(section, '--method-accent');
      let stops: number[] = [];
      let distance = 1;
      const measure = () => {
        distance = Math.max(1, section.offsetHeight - window.innerHeight);
        stops = [0, ...rows.map((row) => Math.max(0, Math.min(distance * .86,
          row.offsetTop + row.offsetHeight * .3 - window.innerHeight * .5))), distance];
      };
      const paint = (progress: number) => {
        const position = progress * distance;
        let index = 0;
        while (index < stops.length - 2 && position >= stops[index + 1]) index++;
        const fraction = gsap.utils.clamp(0, 1,
          (position - stops[index]) / Math.max(1, stops[index + 1] - stops[index]));
        const eased = fraction * fraction * (3 - 2 * fraction);
        const rgb = channels[index].map((channel, component) =>
          Math.round(channel + (channels[index + 1][component] - channel) * eased));
        setBackground(`rgb(${rgb.join(',')})`);
        // Choose the foreground from the actual color, including during transitions.
        const linear = rgb.map((channel) => {
          const value = channel / 255;
          return value <= .04045 ? value / 12.92 : Math.pow((value + .055) / 1.055, 2.4);
        });
        const dark = linear[0] * .2126 + linear[1] * .7152 + linear[2] * .0722 < .179;
        setInk(dark ? '#f6f1e7' : '#24211d');
        setMuted(dark ? '#f6f1e7' : '#342a20');
        setAccent(dark ? '#f6f1e7' : '#4a3828');
      };
      measure();
      ScrollTrigger.create({
        trigger: section, start: 'top top', end: 'bottom bottom',
        onUpdate: (self) => paint(self.progress),
        onRefresh: (self) => { measure(); paint(self.progress); },
      });
      if (light) gsap.fromTo(light, { xPercent: -22, yPercent: -12, rotation: -18 }, {
        xPercent: 22, yPercent: 12, rotation: 18, ease: 'none',
        scrollTrigger: { trigger: section, start: 'top top', end: 'bottom bottom', scrub: 1 },
      });
      rows.forEach((row) => {
        const mediaFrame = row.querySelector('.methodEditorial__media');
        const image = row.querySelector('.methodEditorial__media img');
        const reverse = row.classList.contains('methodEditorial__row--reverse');
        const reveal = gsap.timeline({ scrollTrigger: {
          trigger: row, start: 'top 88%', end: 'top 28%', scrub: .7,
          invalidateOnRefresh: true,
        } });
        if (mediaFrame) reveal.fromTo(mediaFrame, {
          y: 64, rotation: reverse ? -2 : 2,
          clipPath: reverse ? 'inset(0% 100% 0% 0%)' : 'inset(0% 0% 0% 100%)',
        }, { y: 0, rotation: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power2.out' }, 0);
        if (image) gsap.fromTo(image, { scale: 1.18, yPercent: 4 }, {
          scale: 1.08, yPercent: -4, ease: 'none',
          scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: .9 },
        });
      });
      return () => {
        ['background-color', '--method-ink', '--method-muted', '--method-accent'].forEach((property) =>
          section.style.removeProperty(property));
      };
    });
    return () => media.revert();
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="method" className="methodEditorial" aria-labelledby="method-heading">
      <div className="methodEditorial__atmosphere" aria-hidden="true">
        <div className="methodEditorial__lightStage"><div className="methodEditorial__light" /></div>
      </div>
      <div className="methodEditorial__intro">
        <h2 id="method-heading" className="methodEditorial__heading"><TextEffect per="word" variants={wordSpringVariants} delay={.18} viewportAmount={.55}>The ORÉVA</TextEffect> <em><TextEffect per="word" variants={wordSpringVariants} delay={.26} viewportAmount={.55}>Method.</TextEffect></em></h2>
        <span className="methodEditorial__count" aria-label="Five steps">(05)</span>
      </div>

      <div className="methodEditorial__list">
        {steps.map((step, index) => (
          <article
            key={step.title}
            className={`methodEditorial__row${index % 2 ? ' methodEditorial__row--reverse' : ''}`}
            aria-labelledby={`method-step-${index + 1}`}
          >
            <div className="methodEditorial__copy">
              <span className="methodEditorial__number"><TextEffect per="char" preset="fade" delay={.12} viewportAmount={.55}>{`0${index + 1} / 05`}</TextEffect></span>
              <div className="methodEditorial__titleMask"><h3 id={`method-step-${index + 1}`}><TextEffect per="word" variants={wordSpringVariants} delay={.22} viewportAmount={.55} once={false}>{step.title}</TextEffect></h3></div>
              <p><TextEffect per="char" preset="fade" delay={.32} stagger={.018} viewportAmount={.55} once={false}>{step.line}</TextEffect></p>
            </div>
            <div className="methodEditorial__media" aria-hidden="true">
              <img src={step.image} alt="" loading={index === 0 ? 'eager' : 'lazy'} />
            </div>
          </article>
        ))}
      </div>

    </section>
  );
}
