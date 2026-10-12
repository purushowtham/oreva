'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import './MethodSection.css';

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
      const palette = [
        { background: '#24211d', ink: '#f6f1e7', muted: '#ded1bc', accent: '#c3a47a' },
        { background: '#3b3029', ink: '#f6f1e7', muted: '#ded1bc', accent: '#c3a47a' },
        { background: '#594f42', ink: '#f6f1e7', muted: '#eee4d3', accent: '#e3c69d' },
        { background: '#c5b69e', ink: '#342a20', muted: '#493c2f', accent: '#725330' },
        { background: '#ded1bc', ink: '#342a20', muted: '#493c2f', accent: '#725330' },
      ];
      const colorFlow = gsap.timeline({ scrollTrigger: {
        trigger: section, start: 'top top', end: 'bottom bottom', scrub: .6,
      } });
      rows.forEach((row, index) => {
        const color = palette[index];
        const at = Math.max(0, Math.min(.8, (row.offsetTop - window.innerHeight * .65) / Math.max(1, section.offsetHeight - window.innerHeight)));
        colorFlow.to(section, {
          backgroundColor: color.background, duration: .09, ease: 'sine.inOut',
        }, at);
        // Switch foregrounds at the midpoint instead of blending into low-contrast gray.
        colorFlow.set(section, {
          '--method-ink': color.ink, '--method-muted': color.muted,
          '--method-accent': color.accent,
        }, at + .045);
      });
      colorFlow.to(section, {
        backgroundColor: '#f6f1e7', '--method-ink': '#342a20',
        '--method-muted': '#493c2f', '--method-accent': '#725330',
        duration: .12, ease: 'none',
      }, .88);
      const heading = section.querySelector('.methodEditorial__heading');
      if (heading) {
        gsap.fromTo(heading, { yPercent: 28, opacity: 0 }, {
          yPercent: 0, opacity: 1, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: heading, start: 'top 90%', once: true },
        });
      }

      rows.forEach((row) => {
        const copy = row.querySelector('.methodEditorial__copy');
        const mediaFrame = row.querySelector('.methodEditorial__media');
        const image = row.querySelector('.methodEditorial__media img');
        const fromX = row.classList.contains('methodEditorial__row--reverse') ? 48 : -48;

        if (copy) gsap.fromTo(copy, { x: fromX, y: 24, opacity: 0 }, {
          x: 0, y: 0, opacity: 1, ease: 'none',
          scrollTrigger: { trigger: row, start: 'top 88%', end: 'top 42%', scrub: 0.65 },
        });
        if (mediaFrame) gsap.fromTo(mediaFrame, {
          y: 72, opacity: 0, clipPath: 'inset(13% 0 13% 0)',
        }, {
          y: 0, opacity: 1, clipPath: 'inset(0% 0 0% 0)', ease: 'none',
          scrollTrigger: { trigger: row, start: 'top 92%', end: 'top 34%', scrub: 0.7 },
        });
        if (image) gsap.fromTo(image, { scale: 1.16, yPercent: -3 }, {
          scale: 1, yPercent: 0, ease: 'none',
          scrollTrigger: { trigger: row, start: 'top 92%', end: 'bottom 22%', scrub: 0.8 },
        });
      });
    });
    return () => media.revert();
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="method" className="methodEditorial" aria-labelledby="method-heading">
      <div className="methodEditorial__intro">
        <h2 id="method-heading" className="methodEditorial__heading">The ORÉVA <em>Method.</em></h2>
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
              <span className="methodEditorial__number">0{index + 1} / 05</span>
              <h3 id={`method-step-${index + 1}`}>{step.title}</h3>
              <p>{step.line}</p>
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
