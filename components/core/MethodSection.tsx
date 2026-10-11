'use client';
import { useRef, useState } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import './MethodSection.css';

const STEPS = [
  {
    word: 'DISCOVER',
    borderColor: '#DED1BC',
    textColor: '#24211D', // heading text on this background
    accentColor: '#9A723E', // swapping word on this background
    image: '/method/Discover.PNG',
  },
  {
    word: 'CONCEPT',
    borderColor: '#B8A992',
    textColor: '#24211D', // heading text on this background
    accentColor: '#4A3828', // swapping word on this background
    image: '/method/Concept.PNG',
  },
  {
    word: 'CURATE',
    borderColor: '#9A723E',
    textColor: '#F6F1E7', // heading text on this background
    accentColor: '#24211D', // swapping word on this background
    image: '/method/Curate.PNG',
  },
  {
    word: 'DESIGN',
    borderColor: '#4A3828',
    textColor: '#F6F1E7', // heading text on this background
    accentColor: '#DED1BC', // swapping word on this background
    image: '/method/Design.PNG',
  },
  {
    word: 'EXPERIENCE',
    borderColor: '#24211D',
    textColor: '#F6F1E7', // heading text on this background
    accentColor: '#B8A992', // swapping word on this background
    image: '/method/Experience.PNG',
  },
];

const N = STEPS.length;

export default function MethodSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [p, setP] = useState(0); // 0 to N-1 continuous
  const [reduced, setReduced] = useState(false);

  const currentWordIdx = Math.min(Math.round(p), N - 1);

  // Background layer currently under the heading: the rising wash reaches the heading
  // (near the top of the stage) late in each sweep, so switch the text colors then.
  const WASH_REACHES_HEADING = 0.87;
  let bgIdx = 0;
  for (let i = 1; i < N; i++) if (p - (i - 1) >= WASH_REACHES_HEADING) bgIdx = i;
  const { textColor, accentColor } = STEPS[bgIdx];

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      setReduced(false);
      const progress = { value: 0 };
      gsap.to(progress, { value: N - 1, ease: 'none', onUpdate: () => setP(progress.value), scrollTrigger: {
        trigger: sectionRef.current, start: 'top top', end: 'bottom bottom', scrub: .65, invalidateOnRefresh: true,
      } });
    });
    media.add('(prefers-reduced-motion: reduce)', () => { setReduced(true); setP(0); });
    return () => media.revert();
  }, { scope: sectionRef });

  const goToStep = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    window.scrollTo({ top: section.getBoundingClientRect().top + window.scrollY + (section.offsetHeight - window.innerHeight) * index / (N - 1), behavior: reduced ? 'instant' : 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      id="method"
      className={reduced ? "orevaMethod methodReduced" : "orevaMethod"}
      style={{
        height: '420vh',
        position: 'relative',
        background: '#DED1BC',
      }}
      aria-label="The ORÉVA Method"
    >
      {/* Pinned Sticky Stage */}
      <div
        className="method-stage"
        style={{
          color: textColor,
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 'calc(100px + 2vh)',
          background: '#DED1BC',
          boxSizing: 'border-box',
        }}
      >
        {/* ── 0. Background color wash (NEW): each card's border color rises from bottom → top ── */}
        {STEPS.map((step, i) => {
          // Layer 0 is always fully visible. Layer i fills as card i becomes the front card.
          const t = i === 0 ? 1 : Math.max(0, Math.min(1, p - (i - 1)));
          return (
            <div
              key={`wash-${step.word}`}
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 0,
                backgroundColor: step.borderColor,
                clipPath: `inset(${(1 - t) * 100}% 0 0 0)`,
                willChange: 'clip-path',
                pointerEvents: 'none',
              }}
            />
          );
        })}

        <p className="methodEyebrow">THE ORÉVA METHOD — FROM INSTINCT TO IMPACT</p>
        {/* ── 1. Heading (Clear layout with wide uncropped word box) ── */}
        <div
          style={{
            textAlign: 'center',
            userSelect: 'none',
            zIndex: 2,
          }}
        >
          <h2
            aria-label="The ORÉVA Method"
            style={{
              fontFamily: "'Cormorant Garamond', 'DM Serif Display', Georgia, serif",
              fontWeight: 600,
              fontSize: 'clamp(28px, 4.2vw, 56px)',
              letterSpacing: '0.04em',
              color: textColor,
              transition: 'color 0.35s ease',
              margin: 0,
              lineHeight: 1.1,
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35em',
              flexWrap: 'nowrap',
            }}
          >
            <span style={{ whiteSpace: 'nowrap' }}>THE ORÉVA</span>
            {/* Swapping word container with generous width so words like RESEARCH / EXPERIENCE never crop */}
            <span
              style={{
                display: 'inline-grid',
                height: '1.2em',
                width: '8.5em',
                overflow: 'hidden',
                position: 'relative',
                alignItems: 'center',
                textAlign: 'left',
              }}
            >
              {STEPS.map((step, idx) => {
                const isActive = idx === currentWordIdx;
                const isPast = idx < currentWordIdx;
                return (
                  <span
                    key={step.word}
                    style={{
                      gridArea: '1 / 1',
                      fontStyle: 'italic',
                      color: accentColor,
                      opacity: isActive ? 1 : 0,
                      transform: isActive
                        ? 'translateY(0%)'
                        : isPast
                          ? 'translateY(-100%)'
                          : 'translateY(100%)',
                      transition:
                        'transform 0.8s cubic-bezier(.7,0,.2,1), opacity 0.8s cubic-bezier(.7,0,.2,1), color 0.35s ease',
                      willChange: 'transform, opacity',
                      whiteSpace: 'nowrap',
                      paddingRight: '0.2em',
                    }}
                  >
                    {step.word}
                  </span>
                );
              })}
            </span>
          </h2>
        </div>

        {/* ── 2. Card Stack (Brought down further with extra margin top) ── */}
        <div
          className="methodCardStack"
          style={{
            position: 'relative',
            width: 'min(640px, 80vw)',
            height: 'min(48vh, 370px)',
            marginTop: '7vh',
            flex: 'none',
          }}
        >
          {STEPS.map((step, i) => {
            const d = i - p; // d > 0 (behind), d = 0 (front), d < 0 (sliding down out)
            if (d > 3 && !reduced) return null;

            let ty = '0%';
            let scale = 1;
            let opacity = 1;
            let zIndex = N - i;

            if (d > 0) {
              // Cards peeking ABOVE the front card
              const offset = Math.min(d, 3);
              ty = `${-8 * offset}px`;
              scale = 1 - 0.035 * offset;
            } else {
              // Front or exiting card
              const gone = Math.abs(d);
              ty = `${gone * 118}%`;
              opacity = gone > 0.6 ? Math.max(0, 1 - (gone - 0.6) / 0.4) : 1;
              zIndex = N + 10;
            }

            return (
              <div
                key={step.word}
                className="methodCard"
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: step.borderColor,
                  border: `6px solid ${step.borderColor}`,
                  borderRadius: '6px',
                  overflow: 'hidden',
                  transform: `translateY(${ty}) rotate(${d > 0 ? Math.min(d, 3) * -0.65 : Math.abs(d) * 5}deg) scale(${scale})`,
                  transformOrigin: '50% 100%',
                  opacity,
                  zIndex,
                  willChange: 'transform, opacity',
                  boxShadow: '0 12px 40px rgba(36,33,29,0.12)',
                }}
              >
                {/* Background image */}
                <img
                  src={step.image}
                  alt={step.word}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />

                {/* Centered bottom step name */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '32px 24px 22px',
                    background:
                      'linear-gradient(to top, rgba(36,33,29,0.88) 0%, rgba(36,33,29,0.3) 60%, transparent 100%)',
                    textAlign: 'center',
                  }}
                >
                  <h3
                    style={{
                      fontFamily:
                        "'Cormorant Garamond', 'DM Serif Display', Georgia, serif",
                      fontWeight: 600,
                      fontSize: 'clamp(22px, 3.5vw, 38px)',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: '#F6F1E7',
                      margin: 0,
                      textShadow: '0 2px 14px rgba(0,0,0,0.4)',
                    }}
                  >
                    {step.word}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>

        <nav className="methodStepNav" aria-label="Method steps">
          {STEPS.map((step, index) => <button key={step.word} onClick={() => goToStep(index)} aria-current={currentWordIdx === index ? 'step' : undefined}><span>0{index + 1}</span><span>{step.word}</span></button>)}
        </nav>
        <a className="methodWorkLink" href="#work">See the method in practice <span aria-hidden="true">↗</span></a>
      </div>

      {/* Mobile styling overrides */}
      <style>{`
        @media (max-width: 640px) {
          .method-stage {
            padding-top: calc(90px + 2vh) !important;
          }
          .method-badge {
            width: 72px !important;
            height: 72px !important;
            bottom: 16px !important;
            right: 16px !important;
          }
          .method-badge svg {
            width: 72px !important;
            height: 72px !important;
          }
        }
      `}</style>
    </section>
  );
}
