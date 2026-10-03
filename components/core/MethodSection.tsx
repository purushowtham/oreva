'use client';
import { useEffect, useRef, useState } from 'react';

const STEPS = [
  {
    num: '01',
    title: 'Research',
    sentence: 'Understand the brand, customer, space and visual culture.',
    object: '◉',
    image: '/props/%40en__gold_.jpeg',
  },
  {
    num: '02',
    title: 'Concept',
    sentence: 'Translate insight into a visual direction.',
    object: '▲',
    image: '/props/Background%20image%20.PNG',
  },
  {
    num: '03',
    title: 'Curation',
    sentence: 'Select materials, references, objects and details.',
    object: '◈',
    image: '/props/Golden%20Mirror%20Aesthetic%20%E2%9C%A8%20Pearls%2C%20Silk%20%26%20White%20Roses.jpeg',
  },
  {
    num: '04',
    title: 'Design',
    sentence: 'Shape the environment, styling and visual system.',
    object: '◻',
    image: '/props/_%20%281%29%20%281%29.jpeg',
  },
  {
    num: '05',
    title: 'Experience',
    sentence: 'Turn the concept into something people remember.',
    object: '✦',
    image: '/props/_%20%282%29.jpeg',
  },
];

export default function MethodSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0); // 0–1 how far through the sticky scroll
  const [activeStep, setActiveStep] = useState(-1);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const totalScroll = el.offsetHeight - window.innerHeight;
      if (totalScroll <= 0) return;
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / totalScroll));
      setProgress(p);
      setActiveStep(Math.floor(p * STEPS.length));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Line progress: how far the bronze line has drawn (0–100%)
  const linePercent = Math.min(progress * 120, 100);

  // Per-step reveal: step i becomes visible when progress > i/5
  const stepVisible = (i: number) => progress > i / STEPS.length;

  return (
    <section
      ref={sectionRef}
      id="method"
      className="methodJourney"
      aria-label="The ORÉVA Method"
    >
      <div className="methodSticky">
        {/* ── Header ── */}
        <div className="methodJourneyHead">
          <span className="methodJourneyEye">05 / THE ORÉVA METHOD</span>
          <h2 className="methodJourneyTitle">
            From Insight<br /><em>to Experience.</em>
          </h2>
        </div>

        {/* ── Horizontal timeline track ── */}
        <div className="methodTrack" aria-hidden="true">
          {/* Background rail */}
          <div className="methodRail" />
          {/* Animated bronze line */}
          <div
            className="methodProgress"
            style={{ width: `${linePercent}%` }}
          />
          {/* Travelling dot */}
          <div
            className="methodTraveller"
            style={{ left: `${linePercent}%` }}
          />
        </div>

        {/* ── Steps ── */}
        <div className="methodSteps">
          {STEPS.map((step, i) => {
            const visible = stepVisible(i);
            const active = i === Math.min(activeStep, STEPS.length - 1);
            return (
              <div
                key={step.num}
                className={`methodStep ${visible ? 'methodStep--visible' : ''} ${active ? 'methodStep--active' : ''}`}
                style={{ transitionDelay: `${i * 0.04}s` }}
              >
                {/* Step marker on line */}
                <div className="methodMarker">
                  <div className="methodMarkerDot" />
                </div>

                {/* Content */}
                <div className="methodStepContent">
                  <span className="methodStepNum">{step.num}</span>
                  <h3 className="methodStepTitle">{step.title}</h3>
                  <p className="methodStepSentence">{step.sentence}</p>

                  {/* Tactile symbol */}
                  <div className="methodObject">{step.object}</div>

                  {/* Image reveal */}
                  <div className="methodImageWrap">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="methodImg"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
