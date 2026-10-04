'use client';
import { useEffect, useRef, useState } from 'react';

const STEPS = [
  {
    word: 'RESEARCH',
    label: 'IMAGE PLACEHOLDER 01',
    borderColor: '#DED1BC',
    gradient: 'linear-gradient(160deg, #DED1BC 0%, #4A3828 100%)',
    image: '/props/%40en__gold_.jpeg',
  },
  {
    word: 'CONCEPT',
    label: 'IMAGE PLACEHOLDER 02',
    borderColor: '#B8A992',
    gradient: 'linear-gradient(160deg, #B8A992 0%, #4A3828 100%)',
    image: '/props/Background%20image%20.PNG',
  },
  {
    word: 'CURATION',
    label: 'IMAGE PLACEHOLDER 03',
    borderColor: '#9A723E',
    gradient: 'linear-gradient(160deg, #9A723E 0%, #24211D 100%)',
    image: '/props/Golden%20Mirror%20Aesthetic%20%E2%9C%A8%20Pearls%2C%20Silk%20%26%20White%20Roses.jpeg',
  },
  {
    word: 'DESIGN',
    label: 'IMAGE PLACEHOLDER 04',
    borderColor: '#4A3828',
    gradient: 'linear-gradient(160deg, #4A3828 0%, #24211D 100%)',
    image: '/props/_%20%281%29%20%281%29.jpeg',
  },
  {
    word: 'EXPERIENCE',
    label: 'IMAGE PLACEHOLDER 05',
    borderColor: '#24211D',
    gradient: 'linear-gradient(160deg, #24211D 0%, #9A723E 100%)',
    image: '/props/_%20%282%29.jpeg',
  },
];

const N = STEPS.length;

export default function MethodSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [p, setP] = useState(0); // 0 to N-1 continuous
  const [badgeRot, setBadgeRot] = useState(0);

  const currentWordIdx = Math.min(Math.round(p), N - 1);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const totalTrack = el.offsetHeight - window.innerHeight;
      if (totalTrack <= 0) return;
      const scrolled = -rect.top;
      const raw = Math.max(0, Math.min(1, scrolled / totalTrack));
      setP(raw * (N - 1));
      setBadgeRot(window.scrollY * 0.25);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="method"
      style={{
        height: '520vh',
        position: 'relative',
        background: '#F6F1E7',
      }}
      aria-label="The ORÉVA Method"
    >
      {/* Pinned Sticky Stage */}
      <div
        className="method-stage"
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 'calc(100px + 2vh)',
          background: '#F6F1E7',
          boxSizing: 'border-box',
        }}
      >
        {/* ── 1. Heading (Clear layout with wide uncropped word box) ── */}
        <div
          style={{
            textAlign: 'center',
            userSelect: 'none',
            zIndex: 2,
          }}
        >
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', 'DM Serif Display', Georgia, serif",
              fontWeight: 600,
              fontSize: 'clamp(28px, 4.2vw, 56px)',
              letterSpacing: '0.04em',
              color: '#24211D',
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
                      color: '#9A723E',
                      opacity: isActive ? 1 : 0,
                      transform: isActive
                        ? 'translateY(0%)'
                        : isPast
                        ? 'translateY(-100%)'
                        : 'translateY(100%)',
                      transition:
                        'transform 0.8s cubic-bezier(.7,0,.2,1), opacity 0.8s cubic-bezier(.7,0,.2,1)',
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
          style={{
            position: 'relative',
            width: 'min(640px, 84vw)',
            height: 'min(48vh, 370px)',
            marginTop: '6vh',
            flex: 'none',
          }}
        >
          {STEPS.map((step, i) => {
            const d = i - p; // d > 0 (behind), d = 0 (front), d < 0 (sliding down out)
            if (d > 3) return null;

            let ty = '0%';
            let scale = 1;
            let opacity = 1;
            let zIndex = N - i;

            if (d > 0) {
              // Cards peeking ABOVE the front card
              const offset = Math.min(d, 3);
              ty = `${-26 * offset}px`;
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
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: step.borderColor,
                  border: `6px solid ${step.borderColor}`,
                  borderRadius: '6px',
                  overflow: 'hidden',
                  transform: `translateY(${ty}) scale(${scale})`,
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

                {/* Palette Gradient Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: step.gradient,
                    opacity: 0.5,
                  }}
                />

                {/* Diagonal Stripe Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage:
                      'repeating-linear-gradient(45deg, transparent, transparent 12px, rgba(246,241,231,0.07) 12px, rgba(246,241,231,0.07) 14px)',
                  }}
                />

                {/* Top-left Montserrat label */}
                <span
                  style={{
                    position: 'absolute',
                    top: '18px',
                    left: '20px',
                    fontFamily: 'Montserrat, DM Sans, sans-serif',
                    fontWeight: 300,
                    fontSize: '9px',
                    letterSpacing: '0.27em',
                    textTransform: 'uppercase',
                    color: '#F6F1E7',
                  }}
                >
                  {step.label}
                </span>

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

        {/* ── 3. Button (~24px below stack) ── */}
        <div
          style={{
            marginTop: '24px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '4px',
            overflow: 'hidden',
            boxShadow: '0 6px 24px rgba(154,114,62,0.22)',
            zIndex: 2,
          }}
        >
          {/* Arrow chip */}
          <div
            style={{
              background: '#4A3828',
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontSize: '15px',
                color: '#F6F1E7',
                lineHeight: 1,
              }}
            >
              →
            </span>
          </div>
          {/* Main button label */}
          <button
            style={{
              background: '#9A723E',
              border: 'none',
              cursor: 'pointer',
              padding: '12px 26px',
              fontFamily: 'Montserrat, DM Sans, sans-serif',
              fontWeight: 400,
              fontSize: '10px',
              letterSpacing: '0.27em',
              textTransform: 'uppercase',
              color: '#F6F1E7',
            }}
          >
            EXPLORE THE METHOD
          </button>
        </div>
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
