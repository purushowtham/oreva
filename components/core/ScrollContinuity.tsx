'use client';

import { gsap, useGSAP } from '@/lib/gsap';

/** Join adjacent scenes without adding another scroll panel. */
export default function ScrollContinuity() {
  useGSAP(() => {
    const media = gsap.matchMedia();
    // Both visible surfaces must share a color throughout the handoff.
    // Coloring only the outgoing scene leaves a hard edge at the next section.
    gsap.fromTo('.flySection, .whatWeMakeSection', {
      backgroundColor: '#EFECE5', '--scene-background': '#EFECE5',
    }, {
      backgroundColor: '#DED1BC', '--scene-background': '#DED1BC', ease: 'none',
      scrollTrigger: { trigger: '.flySection', start: 'bottom 85%', end: 'bottom 15%', scrub: true },
    });
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.flyHero', { y: 0, opacity: 1 }, {
        y: -24, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: '.flySection', start: 'bottom 50%', end: 'bottom top', scrub: .5 },
      });
    });
    return () => media.revert();
  });
  return null;
}
