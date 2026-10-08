'use client';
import { useEffect, useRef } from 'react';

export default function ScrollExperience() {
  const progress = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const elements = Array.from(document.querySelectorAll<HTMLElement>('.flyHero, .whatWeMakeHeader, .contact > :not(.finalMark), footer > span'));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    if (!reduced.matches) elements.forEach((element, i) => {
      element.classList.add('scroll-reveal');
      element.style.setProperty('--reveal-delay', `${(i % 3) * 80}ms`);
      observer.observe(element);
    });
    let frame = 0;
    const update = () => {
      frame = 0;
      const method = document.getElementById('method');
      if (method) {
        // Begin the handoff while both sections share the viewport.
        const entry = Math.max(0, Math.min(1, 1 - method.getBoundingClientRect().top / (window.innerHeight * .85)));
        method.style.setProperty('--method-entry', reduced.matches ? '1' : String(entry));
      }
      const distance = document.documentElement.scrollHeight - window.innerHeight;
      if (progress.current) progress.current.style.transform = `scaleX(${distance > 0 ? Math.min(1, window.scrollY / distance) : 0})`;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      elements.forEach(element => element.classList.remove('scroll-reveal', 'is-revealed'));
    };
  }, []);
  return <div ref={progress} className="reading-progress" aria-hidden="true" />;
}
