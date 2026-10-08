'use client';
import { useEffect, useRef, useState } from 'react';

interface Project {
  id: string;
  name: string;
  category: string;
  year: string;
  location: string;
  description: string;
  details: string[];
  mainImage: string;
  galleryImages: string[];
  gradient: string;
  baseRot: number;
  baseY: number; // in vh
}

const PROJECTS: Project[] = [
  {
    id: 'villa-lumina',
    name: 'VILLA LUMINA',
    category: 'RESIDENTIAL ARCHITECTURE',
    year: '2025',
    location: 'MONTE CARLO',
    description:
      'A sanctuary sculpted from honed travertine and brushed brass. Villa Lumina explores the interplay of Mediterranean natural light, raw organic monoliths, and minimalist interior curation.',
    details: ['Custom Stone Plinths', 'Acoustic Wall Panels', 'Integrated Lighting Scenarios'],
    mainImage: '/props/%40en__gold_.jpeg',
    galleryImages: [
      '/props/%40en__gold_.jpeg',
      '/props/Background%20image%20.PNG',
      '/props/Golden%20Mirror%20Aesthetic%20%E2%9C%A8%20Pearls%2C%20Silk%20%26%20White%20Roses.jpeg',
      '/props/_%20%283%29.jpeg',
    ],
    gradient: 'linear-gradient(160deg, #DED1BC 0%, #4A3828 100%)',
    baseRot: -5,
    baseY: -4,
  },
  {
    id: 'maison-etheree',
    name: 'MAISON ÉTHÉRÉE',
    category: 'HAUTE BOUTIQUE',
    year: '2025',
    location: 'PARIS',
    description:
      'Designed for quiet luxury fashion, Maison Éthérée balances diaphanous silk drapes with weighted bronze fixtures, creating an immersive sensory retail experience.',
    details: ['Silk Veil Partitions', 'Hand-hammered Bronze Racks', 'Tactile Display Pedestals'],
    mainImage: '/props/Background%20image%20.PNG',
    galleryImages: [
      '/props/Background%20image%20.PNG',
      '/props/_%20%281%29%20%281%29.jpeg',
      '/props/_%20%282%29.jpeg',
      '/props/p%20.jpeg',
    ],
    gradient: 'linear-gradient(160deg, #B8A992 0%, #24211D 100%)',
    baseRot: 3,
    baseY: 4,
  },
  {
    id: 'solis-pavilion',
    name: 'SOLIS PAVILION',
    category: 'EXHIBITION PAVILION',
    year: '2024',
    location: 'MILAN',
    description:
      'A ephemeral pavilion crafted for Salone del Mobile. Solis Pavilion uses dynamic mirror reflections and golden hour lighting to transform geometric stone forms.',
    details: ['Reflective Mirror Canopies', 'Tiered Onyx Displays', 'Atmospheric Sound Design'],
    mainImage: '/props/Golden%20Mirror%20Aesthetic%20%E2%9C%A8%20Pearls%2C%20Silk%20%26%20White%20Roses.jpeg',
    galleryImages: [
      '/props/Golden%20Mirror%20Aesthetic%20%E2%9C%A8%20Pearls%2C%20Silk%20%26%20White%20Roses.jpeg',
      '/props/%40en__gold_.jpeg',
      '/props/_%20%284%29.jpeg',
      '/props/little%20women%20%20%20%20%20beth%20march%20%20%28painting%20by%20%40talithakatalayi%29.jpeg',
    ],
    gradient: 'linear-gradient(160deg, #9A723E 0%, #4A3828 100%)',
    baseRot: -2,
    baseY: -5,
  },
  {
    id: 'aura-retreat',
    name: 'AURA RETREAT',
    category: 'WELLNESS & SPA',
    year: '2024',
    location: 'KYOTO',
    description:
      'A tranquil haven inspired by traditional Japanese joinery and contemporary minimalist spatial planning. Natural cedar wood, dark slate, and indirect warm glow define the atmosphere.',
    details: ['Acoustic Cedar Screens', 'Monolithic Slate Basins', 'Custom Incense Vane'],
    mainImage: '/props/_%20%281%29%20%281%29.jpeg',
    galleryImages: [
      '/props/_%20%281%29%20%281%29.jpeg',
      '/props/_%20%285%29.jpeg',
      '/props/Background%20image%20.PNG',
      '/props/_%20%282%29.jpeg',
    ],
    gradient: 'linear-gradient(160deg, #4A3828 0%, #24211D 100%)',
    baseRot: 5,
    baseY: 3,
  },
  {
    id: 'sanctuary-noir',
    name: 'SANCTUARY NOIR',
    category: 'PRIVATE RESIDENCE',
    year: '2025',
    location: 'LONDON',
    description:
      'Deep dark walnut, charcoal suede, and warm antique bronze accents come together to form an intimate, quiet refuge in the heart of Mayfair.',
    details: ['Smoked Oak Joinery', 'Charcoal Suede Walls', 'Bronze Hardware Details'],
    mainImage: '/props/_%20%282%29.jpeg',
    galleryImages: [
      '/props/_%20%282%29.jpeg',
      '/props/_%20%283%29.jpeg',
      '/props/%40en__gold_.jpeg',
      '/props/p%20.jpeg',
    ],
    gradient: 'linear-gradient(160deg, #DED1BC 0%, #9A723E 100%)',
    baseRot: -4,
    baseY: -3,
  },
  {
    id: 'atelier-terra',
    name: 'ATELIER TERRA',
    category: 'ART GALLERY',
    year: '2024',
    location: 'ZÜRICH',
    description:
      'An expansive contemporary art gallery designed with raw earth plaster walls, high ceilings, and tailored directional spotlights to celebrate sculpture and form.',
    details: ['Earthen Plaster Walls', 'Custom Modular Pedestals', 'Integrated Track Lighting'],
    mainImage: '/props/_%20%283%29.jpeg',
    galleryImages: [
      '/props/_%20%283%29.jpeg',
      '/props/_%20%284%29.jpeg',
      '/props/Golden%20Mirror%20Aesthetic%20%E2%9C%A8%20Pearls%2C%20Silk%20%26%20White%20Roses.jpeg',
      '/props/%40en__gold_.jpeg',
    ],
    gradient: 'linear-gradient(160deg, #B8A992 0%, #4A3828 100%)',
    baseRot: 2,
    baseY: 5,
  },
  {
    id: 'palazzo-oreva',
    name: 'PALAZZO ORÉVA',
    category: 'FLAGSHIP STORE',
    year: '2025',
    location: 'MILAN',
    description:
      'ORÉVA flagship experience store combining high jewellery showcases, VIP private salons, and an interactive material library.',
    details: ['Bulletproof Fluted Glass Cases', 'Private VIP Lounge', 'Material Library Counter'],
    mainImage: '/props/_%20%284%29.jpeg',
    galleryImages: [
      '/props/_%20%284%29.jpeg',
      '/props/Background%20image%20.PNG',
      '/props/_%20%281%29%20%281%29.jpeg',
      '/props/_%20%285%29.jpeg',
    ],
    gradient: 'linear-gradient(160deg, #9A723E 0%, #24211D 100%)',
    baseRot: -3,
    baseY: -2,
  },
];

export default function ProjectShowcaseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const animFrameId = useRef<number | null>(null);

  const [p, setP] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const totalTrack = el.offsetHeight - window.innerHeight;
      if (totalTrack <= 0) return;
      const scrolled = -rect.top;
      const raw = Math.max(0, Math.min(1, scrolled / totalTrack));
      targetProgress.current = raw;
    };

    const updateLoop = () => {
      currentProgress.current +=
        (targetProgress.current - currentProgress.current) * 0.12;
      setP(currentProgress.current);
      animFrameId.current = requestAnimationFrame(updateLoop);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    animFrameId.current = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  // ── 1. Color Transition (completes by p = 0.55) ──
  const colorP = Math.max(0, Math.min(1, (p - 0.04) / 0.51));
  const easedColorP =
    colorP < 0.5 ? 2 * colorP * colorP : 1 - Math.pow(-2 * colorP + 2, 2) / 2;

  // Background Color Interpolation (Light Beige #F6F1E7 → Dark Beige #8C775D)
  const bgR = Math.round(246 + (140 - 246) * easedColorP);
  const bgG = Math.round(241 + (119 - 241) * easedColorP);
  const bgB = Math.round(231 + (93 - 231) * easedColorP);
  const stageBgColor = `rgb(${bgR}, ${bgG}, ${bgB})`;

  // Headline Text Color Interpolation (Soft Black #24211D → Initial Background #F6F1E7 Warm Ivory)
  const textR = Math.round(36 + (246 - 36) * easedColorP);
  const textG = Math.round(33 + (241 - 33) * easedColorP);
  const textB = Math.round(29 + (231 - 29) * easedColorP);
  const headlineTextColor = `rgb(${textR}, ${textG}, ${textB})`;

  // Headline opacity & translateY
  let headlineOpacity = 1;
  let headlineTranslateY = 0;
  if (p < 0.08) {
    headlineOpacity = p / 0.08;
    headlineTranslateY = (1 - p / 0.08) * 24;
  } else if (p > 0.88) {
    headlineOpacity = Math.max(0, (1 - p) / 0.12);
  }

  const N = PROJECTS.length;

  const openProjectModal = (proj: Project) => {
    setSelectedProject(proj);
    setActivePhotoIdx(0);
    document.body.style.overflow = 'hidden';
  };

  const closeProjectModal = () => {
    setSelectedProject(null);
    document.body.style.overflow = '';
  };

  return (
    <section
      ref={sectionRef}
      id="work"
      style={{
        height: '430vh', // Reduced from 600vh to 430vh to eliminate end delay
        position: 'relative',
        background: stageBgColor,
      }}
      aria-label="Project Showcase"
    >
      {/* Pinned Sticky Stage */}
      <div
        className="showcase-stage"
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          background: stageBgColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          willChange: 'background-color',
        }}
      >
        {/* ── 1. Background Headline ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            userSelect: 'none',
            zIndex: 1,
            opacity: headlineOpacity,
            transform: `translateY(${headlineTranslateY}px)`,
            willChange: 'transform, opacity',
            pointerEvents: 'none',
          }}
        >
          <h2
            style={{
              fontFamily:
                "'Cormorant Garamond', 'DM Serif Display', Georgia, serif",
              fontWeight: 600,
              fontSize: 'clamp(54px, 11.5vw, 150px)',
              lineHeight: 0.95,
              letterSpacing: '0.04em',
              color: headlineTextColor,
              margin: 0,
              textTransform: 'uppercase',
              opacity: 0.92,
            }}
          >
            OUR SELECTED
            <br />
            PROJECTS
          </h2>
        </div>

        {/* ── 2. Horizontal Row of Clickable Cards (Optimized track span) ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'auto',
            zIndex: 2,
          }}
        >
          {PROJECTS.map((proj, i) => {
            // Calibrated startP & spanP so last card clears screen at p = 0.93 without wasted end delay
            const startP = i * 0.075;
            const spanP = 0.48;
            const rawP = Math.max(0, Math.min(1, (p - startP) / spanP));

            const eased =
              rawP < 0.5
                ? 2 * rawP * rawP
                : 1 - Math.pow(-2 * rawP + 2, 2) / 2;

            const xPercent = 115 - eased * 175; // in vw
            const parallaxY = (rawP - 0.5) * 2;
            const rotDrift = (rawP - 0.5) * 3;

            const distFromCenter = Math.abs(xPercent - 37);
            const isCentered = distFromCenter < 18;
            const scale = isCentered ? 1.04 : 1.0;
            const cardZIndex = isCentered ? 10 : N - i;

            return (
              <div
                key={proj.id}
                onClick={() => openProjectModal(proj)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    openProjectModal(proj);
                  }
                }}
                className="showcase-card-clickable"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  width: 'clamp(220px, 26vw, 380px)',
                  height: 'clamp(320px, 58vh, 520px)',
                  transform: `translate3d(${xPercent}vw, calc(-50% + ${proj.baseY + parallaxY}vh), 0) rotate(${proj.baseRot + rotDrift}deg) scale(${scale})`,
                  transformOrigin: '50% 50%',
                  borderRadius: '14px',
                  boxShadow: isCentered
                    ? '0 25px 60px rgba(36,33,29,0.22)'
                    : '0 18px 45px rgba(36,33,29,0.14)',
                  zIndex: cardZIndex,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  background: '#F6F1E7',
                  willChange: 'transform',
                  border: '1px solid rgba(184,169,146,0.3)',
                  userSelect: 'none',
                }}
              >
                {/* Top ~72% Image Area */}
                <div
                  style={{
                    position: 'relative',
                    height: '72%',
                    width: '100%',
                    overflow: 'hidden',
                    background: proj.gradient,
                  }}
                >
                  <img
                    src={proj.mainImage}
                    alt={proj.name}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      opacity: 0.9,
                    }}
                  />

                  {/* Gradient & Diagonal overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: proj.gradient,
                      opacity: 0.35,
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage:
                        'repeating-linear-gradient(45deg, transparent, transparent 12px, rgba(246,241,231,0.06) 12px, rgba(246,241,231,0.06) 14px)',
                    }}
                  />

                  {/* Label top-left */}
                  <span
                    style={{
                      position: 'absolute',
                      top: '16px',
                      left: '18px',
                      fontFamily: 'Montserrat, DM Sans, sans-serif',
                      fontWeight: 300,
                      fontSize: '9px',
                      letterSpacing: '0.26em',
                      textTransform: 'uppercase',
                      color: '#F6F1E7',
                      background: 'rgba(36,33,29,0.45)',
                      backdropFilter: 'blur(4px)',
                      padding: '4px 9px',
                      borderRadius: '4px',
                    }}
                  >
                    {proj.galleryImages.length} PHOTOS · CLICK TO EXPAND
                  </span>
                </div>

                {/* Bottom ~28% Caption Area */}
                <div
                  style={{
                    height: '28%',
                    width: '100%',
                    background: '#F6F1E7',
                    padding: '16px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    boxSizing: 'border-box',
                    borderTop: '1px solid rgba(184,169,146,0.3)',
                  }}
                >
                  <h3
                    style={{
                      fontFamily:
                        "'Cormorant Garamond', 'DM Serif Display', Georgia, serif",
                      fontWeight: 600,
                      fontSize: 'clamp(18px, 2vw, 24px)',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      color: '#24211D',
                      margin: 0,
                      lineHeight: 1.1,
                    }}
                  >
                    {proj.name}
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '6px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'Montserrat, DM Sans, sans-serif',
                        fontWeight: 400,
                        fontSize: '9px',
                        letterSpacing: '0.24em',
                        textTransform: 'uppercase',
                        color: '#9A723E',
                      }}
                    >
                      {proj.category}
                    </span>
                    <span
                      style={{
                        fontSize: '12px',
                        color: '#9A723E',
                      }}
                    >
                      ↗
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 3. Extended Modal View ── */}
      {selectedProject && (
        <div
          onClick={closeProjectModal}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(36, 33, 29, 0.75)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px 16px',
            boxSizing: 'border-box',
            animation: 'fadeIn 0.3s ease forwards',
          }}
        >
          {/* Modal Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: 'min(920px, 94vw)',
              maxHeight: '88vh',
              overflowY: 'auto',
              background: '#F6F1E7',
              borderRadius: '16px',
              padding: 'clamp(24px, 4vw, 48px)',
              boxSizing: 'border-box',
              boxShadow: '0 30px 90px rgba(0, 0, 0, 0.4)',
              border: '1px solid #DED1BC',
            }}
          >
            {/* Close Button */}
            <button
              onClick={closeProjectModal}
              aria-label="Close Project Details"
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                background: '#4A3828',
                color: '#F6F1E7',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '20px',
                zIndex: 10,
                transition: 'background 0.2s ease',
              }}
            >
              ✕
            </button>

            {/* Header info */}
            <div style={{ marginBottom: '28px', paddingRight: '48px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '8px',
                  flexWrap: 'wrap',
                }}
              >
                <span
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 400,
                    fontSize: '10px',
                    letterSpacing: '0.28em',
                    textTransform: 'uppercase',
                    color: '#9A723E',
                  }}
                >
                  {selectedProject.category}
                </span>
                <span style={{ color: '#B8A992' }}>·</span>
                <span
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 300,
                    fontSize: '10px',
                    letterSpacing: '0.22em',
                    color: '#4A3828',
                  }}
                >
                  {selectedProject.location} — {selectedProject.year}
                </span>
              </div>
              <h2
                style={{
                  fontFamily:
                    "'Cormorant Garamond', 'DM Serif Display', Georgia, serif",
                  fontWeight: 600,
                  fontSize: 'clamp(32px, 5vw, 54px)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: '#24211D',
                  margin: 0,
                  lineHeight: 1.05,
                }}
              >
                {selectedProject.name}
              </h2>
            </div>

            {/* ── Multiple Photos Gallery Carousel ── */}
            <div style={{ marginBottom: '32px' }}>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: 'clamp(280px, 46vh, 460px)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: '#24211D',
                  boxShadow: '0 12px 36px rgba(36,33,29,0.18)',
                  marginBottom: '16px',
                }}
              >
                <img
                  src={selectedProject.galleryImages[activePhotoIdx]}
                  alt={`${selectedProject.name} Photo ${activePhotoIdx + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'opacity 0.4s ease',
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '16px',
                    background: 'rgba(36,33,29,0.65)',
                    backdropFilter: 'blur(6px)',
                    color: '#F6F1E7',
                    padding: '5px 12px',
                    borderRadius: '4px',
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '9px',
                    letterSpacing: '0.22em',
                  }}
                >
                  PHOTO {activePhotoIdx + 1} / {selectedProject.galleryImages.length}
                </span>
              </div>

              {/* Thumbnails */}
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  overflowX: 'auto',
                  paddingBottom: '8px',
                }}
              >
                {selectedProject.galleryImages.map((imgUrl, idx) => {
                  const isSelected = idx === activePhotoIdx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIdx(idx)}
                      style={{
                        position: 'relative',
                        width: '90px',
                        height: '64px',
                        flex: 'none',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: isSelected
                          ? '3px solid #9A723E'
                          : '1px solid #DED1BC',
                        opacity: isSelected ? 1 : 0.65,
                        cursor: 'pointer',
                        padding: 0,
                        background: '#24211D',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <img
                        src={imgUrl}
                        alt={`Thumbnail ${idx + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description & Specs */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '32px',
                borderTop: '1px solid #DED1BC',
                paddingTop: '28px',
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 400,
                    fontSize: '10px',
                    letterSpacing: '0.26em',
                    textTransform: 'uppercase',
                    color: '#9A723E',
                    display: 'block',
                    marginBottom: '10px',
                  }}
                >
                  PROJECT OVERVIEW
                </span>
                <p
                  style={{
                    fontFamily: 'Montserrat, DM Sans, sans-serif',
                    fontWeight: 300,
                    fontSize: '14px',
                    lineHeight: 1.75,
                    color: '#4A3828',
                    margin: 0,
                  }}
                >
                  {selectedProject.description}
                </p>
              </div>

              <div>
                <span
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 400,
                    fontSize: '10px',
                    letterSpacing: '0.26em',
                    textTransform: 'uppercase',
                    color: '#9A723E',
                    display: 'block',
                    marginBottom: '10px',
                  }}
                >
                  KEY SPECIFICATIONS & CURATION
                </span>
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  {selectedProject.details.map((detail, index) => (
                    <li
                      key={index}
                      style={{
                        fontFamily: 'Montserrat, DM Sans, sans-serif',
                        fontWeight: 300,
                        fontSize: '13px',
                        color: '#24211D',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: '#9A723E',
                        }}
                      />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style>{`
        .showcase-card-clickable {
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        @media (max-width: 640px) {
          .showcase-card-clickable {
            width: 62vw !important;
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </section>
  );
}
