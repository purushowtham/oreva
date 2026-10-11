'use client';

import { useRef } from 'react';
import { ScrollTrigger, useGSAP } from '@/lib/gsap';
import './JourneyLine.css';

export default function JourneyLine() {
  const svg = useRef<SVGSVGElement>(null);
  const path = useRef<SVGPathElement>(null);
  useGSAP(() => {
    const container = svg.current?.parentElement;
    if (!container || !svg.current || !path.current) return;
    const line = path.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let trigger: ScrollTrigger | undefined;
    const build = () => {
      const height = container.offsetHeight;
      svg.current!.setAttribute('viewBox', `0 0 1000 ${height}`);
      let d = 'M 940 0';
      for (let y = 0, i = 0; y < height; y += 650, i++) {
        const end = Math.min(y + 650, height);
        const span = end - y;
        const left = [790, 920, 850, 730, 900][i % 5];
        d += ` C ${left} ${y + span * .22}, 1030 ${y + span * .31}, 925 ${y + span * .56} S ${left - 40} ${y + span * .82}, 940 ${end}`;
      }
      line.setAttribute('d', d);
      const length = line.getTotalLength();
      line.style.strokeDasharray = `${length}`;
      const draw = (progress: number) => { line.style.strokeDashoffset = `${length * (1 - progress)}`; };
      trigger?.kill();
      if (reducedMotion.matches) { draw(1); return; }
      const update = (self: ScrollTrigger) => {
        if (self.progress === 1) { draw(1); return; }
        const y = Math.max(0, Math.min(height, -container.getBoundingClientRect().top + window.innerHeight * .65));
        let low = 0, high = length;
        for (let i = 0; i < 13; i++) {
          const mid = (low + high) / 2;
          if (line.getPointAtLength(mid).y < y) low = mid; else high = mid;
        }
        line.style.strokeDashoffset = `${length - (low + high) / 2}`;
      };
      trigger = ScrollTrigger.create({ trigger: container, start: 'top 65%', end: 'bottom bottom', onUpdate: update, onRefresh: update });
      update(trigger);
    };
    build();
    reducedMotion.addEventListener('change', build);
    let previousHeight = container.offsetHeight;
    const observer = new ResizeObserver(() => {
      if (container.offsetHeight !== previousHeight) { previousHeight = container.offsetHeight; build(); ScrollTrigger.refresh(); }
    });
    observer.observe(container);
    return () => { observer.disconnect(); trigger?.kill(); reducedMotion.removeEventListener('change', build); };
  }, {});
  return <svg ref={svg} className="journeyLine" preserveAspectRatio="none" aria-hidden="true"><path ref={path} fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" /></svg>;
}
