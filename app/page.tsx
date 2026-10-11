'use client';
import { useEffect, useRef, useState } from 'react';
import HomeHero from '../components/core/HomeHero';
import JourneyLine from '../components/core/JourneyLine';
import { TextEffect } from '../components/core/text-effect';
import { Cursor } from '../components/core/cursor';
import { Menu as MenuIcon } from 'lucide-react';
import { AnimatedBackground } from '../components/core/animated-background';
import CircularCarousel from '../components/core/CircularCarousel';
import MethodSection from '../components/core/MethodSection';
import ProjectShowcaseSection from '../components/core/ProjectShowcaseSection';
import HeroTransitionSection from '../components/core/HeroTransitionSection';
import InteractiveFooter from '../components/core/InteractiveFooter';
import Playground from '../components/core/Playground';

// ─── DATA ──────────────────────────────────────────────────────────────────
const services = [
    ['01', 'Visual Merchandising', 'Jewellery display / plinth'],
    ['02', 'Styling', 'Fabric / garment silhouette'],
    ['03', 'Retail Concepts', 'Architectural store frame'],
    ['04', 'Brand Storytelling', 'Editorial paper / card'],
    ['05', 'Creative Direction', 'Rotating ORÉVA monogram'],
];
const work = [
    ['01', 'Maison No. 01', 'Retail concept · 2026', 'A study in stone, metal and desire.'],
    ['02', 'Object / Form', 'Visual merchandising · 2026', 'Objects composed as quiet moments.'],
    ['03', 'The Private Room', 'Spatial styling · 2025', 'An intimate language for luxury.'],
    ['04', 'Still / Moving', 'Creative direction · 2025', 'Material, light and movement.'],
];
const materials = [
    ['TRAVERTINE', 'Grounded / Architectural / Timeless'],
    ['LINEN', 'Tactile / Relaxed / Human'],
    ['BRUSHED METAL', 'Refined / Precise / Contemporary'],
    ['GLASS', 'Light / Transparent / Intriguing'],
    ['VELVET', 'Depth / Sensual / Quiet'],
];

interface ServiceDetailItem {
    num: string;
    title: string;
    subtitle: string;
    description: string;
    details: string[];
    src: string;
    alt?: string;
    aspectRatio: number;
}

const whatWeMakeServices: ServiceDetailItem[] = [
    {
        num: '01',
        title: 'VISUAL MERCHANDISING',
        subtitle: 'SPACES • PRODUCTS • PEOPLE • EXPERIENCES',
        description: '',
        details: [
            'Window & in-store display concepts',
            'Product placement & styling',
            'Color, lighting & material curation',
            'Customer journey & visual storytelling',
        ],
        src: '/circle corousel/visual merchandising/Visual merchandising .PNG',
        aspectRatio: 1253 / 1098,
        alt: 'Visual Merchandising by ORÉVA'
    },
    {
        num: '02',
        title: 'SPACE CURATION',
        subtitle: 'SPACES • PRODUCTS • PEOPLE • EXPERIENCES',
        description: '',
        details: [
            'Spatial planning & zoning',
            'Concept development & mood creation',
            'Material, furniture & prop selection',
            'Creating functional, immersive environments',
        ],
        src: '/circle corousel/space curration/Space curation .PNG',
        aspectRatio: 1288 / 1027,
        alt: 'Space Curation by ORÉVA'
    },
    {
        num: '03',
        title: 'EDITORIAL STYLING',
        subtitle: 'CONCEPTS • MOOD • LOOKS • STYLING • DETAILS • NARRATIVE',
        description: '',
        details: [
            'Concept-led fashion storytelling',
            'Look development & outfit curation',
            'Trend, color & silhouette research',
            'Art direction & visual composition',
        ],
        src: '/circle corousel/editorial styling/Editorial styling .PNG',
        aspectRatio: 1253 / 1097,
        alt: 'Editorial Styling by ORÉVA'
    },
    {
        num: '04',
        title: 'BRAND EXPERIENCE',
        subtitle: 'PEOPLE • SPACE • SENSORY • STORY • EXPERIENCES',
        description: '',
        details: [
            'Translating brand identity into spaces',
            'Creating memorable customer touchpoints',
            'Sensory storytelling through visual & material details',
            'Building consistent brand narratives across experiences',
        ],
        src: '/circle corousel/brand experience/Brand experience .PNG',
        aspectRatio: 1254 / 1098,
        alt: 'Brand Experience by ORÉVA'
    },
];


// ─── FLYTHROUGH CONFIG ─────────────────────────────────────────────────────
const CARD_COUNT = 38;
const SPEED = 3.6;
const SPEED_A11Y = 0.9;
const DEPTH = 62;
const NEAR_CULL = 1.3;
const RADIUS_MIN = 1.8;
const RADIUS_MAX = 5.8;
const SIZE_MIN = 1.1;
const SIZE_MAX = 2.1;
const FOV = 50;

// Only real photos — repeated to fill any count
const IMAGES = [
    '/props/%40en__gold_.jpeg',
    '/props/Background%20image%20.PNG',
    '/props/Golden%20Mirror%20Aesthetic%20%E2%9C%A8%20Pearls%2C%20Silk%20%26%20White%20Roses.jpeg',
    '/props/_%20%281%29%20%281%29.jpeg',
    '/props/_%20%282%29.jpeg',
    '/props/_%20%283%29.jpeg',
    '/props/_%20%284%29.jpeg',
    '/props/_%20%285%29.jpeg',
    '/props/little%20women%20%20%20%20%20beth%20march%20%20%28painting%20by%20%40talithakatalayi%29.jpeg',
    '/props/p%20.jpeg',
];

// ─── FLYTHROUGH COMPONENT ──────────────────────────────────────────────────
function FlythroughSection() {
    const canvasRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        let cancelled = false;

        import('three').then((THREE) => {
            if (cancelled || !canvasRef.current) return;

            const reducedMotion =
                typeof window !== 'undefined' &&
                window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            const spd = reducedMotion ? SPEED_A11Y : SPEED;

            // Renderer
            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setClearColor(0x000000, 0);
            canvasRef.current!.appendChild(renderer.domElement);

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 0.1, 200);
            camera.position.set(0, 0, 5);

            const loader = new THREE.TextureLoader();

            function rnd(a: number, b: number) { return a + Math.random() * (b - a); }
            function randXY() {
                const angle = Math.random() * Math.PI * 2;
                const radius = rnd(RADIUS_MIN, RADIUS_MAX);
                return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
            }

            // Load all unique textures once, then cycle via index
            interface TexInfo { tex: any; aspect: number }
            const loaded: (TexInfo | null)[] = new Array(IMAGES.length).fill(null);

            IMAGES.forEach((url, idx) => {
                loader.load(url, (t: any) => {
                    t.colorSpace = THREE.SRGBColorSpace;
                    const img = t.image as HTMLImageElement;
                    const aspect = img.naturalWidth && img.naturalHeight
                        ? img.naturalWidth / img.naturalHeight : 1;
                    loaded[idx] = { tex: t, aspect };
                });
            });

            interface Card { mesh: any; slot: number }
            const cards: Card[] = [];

            function buildCard(slot: number, initialZ: boolean) {
                const imgIdx = slot % IMAGES.length;
                const info = loaded[imgIdx];

                const aspect = info ? info.aspect : 1.33; // fallback ratio until loaded
                const size = rnd(SIZE_MIN, SIZE_MAX);
                const geom = new THREE.PlaneGeometry(size * aspect, size);

                const mat = new THREE.MeshBasicMaterial({
                    transparent: true,
                    opacity: 0,
                    side: THREE.DoubleSide,
                    ...(info ? { map: info.tex } : { color: new THREE.Color('#EFECE5') }),
                });

                const mesh = new THREE.Mesh(geom, mat);
                const { x, y } = randXY();
                const z = initialZ
                    ? camera.position.z - NEAR_CULL - Math.random() * DEPTH
                    : camera.position.z - DEPTH;
                mesh.position.set(x, y, z);
                mesh.rotation.z = rnd(-0.09, 0.09);
                scene.add(mesh);
                return { mesh, slot };
            }

            for (let i = 0; i < CARD_COUNT; i++) {
                cards.push(buildCard(i, true));
            }

            function onResize() {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            }
            window.addEventListener('resize', onResize);

            let last = performance.now();
            let raf: number;

            function animate() {
                if (cancelled) return;
                raf = requestAnimationFrame(animate);

                const now = performance.now();
                const dt = Math.min((now - last) / 1000, 0.05);
                last = now;

                for (const card of cards) {
                    const { mesh } = card;
                    mesh.position.z += spd * dt;

                    // Depth fade
                    const dist = camera.position.z - mesh.position.z;
                    const t = Math.max(0, Math.min(1, 1 - dist / DEPTH));
                    const smooth = t * t * (3 - 2 * t);
                    const fadein = Math.min(1, t / 0.06);
                    const mat = mesh.material as any;
                    mat.opacity = Math.min(smooth, fadein) * 0.88 + 0.08;

                    // Swap texture in once loaded (if it wasn't ready at build time)
                    const imgIdx = card.slot % IMAGES.length;
                    if (!mat.map && loaded[imgIdx]) {
                        const info = loaded[imgIdx]!;
                        mat.map = info.tex;
                        mat.color.set(0xffffff);
                        mat.needsUpdate = true;
                        const sz = rnd(SIZE_MIN, SIZE_MAX);
                        const g = new THREE.PlaneGeometry(sz * info.aspect, sz);
                        mesh.geometry.dispose();
                        mesh.geometry = g;
                    }

                    // Respawn
                    if (mesh.position.z > camera.position.z - NEAR_CULL) {
                        scene.remove(mesh);
                        mesh.geometry.dispose();
                        (mesh.material as any).dispose();
                        const idx = cards.indexOf(card);
                        const nc = buildCard(card.slot, false);
                        cards[idx] = nc;
                    }
                }

                renderer.render(scene, camera);
            }
            animate();

            return () => {
                cancelled = true;
                cancelAnimationFrame(raf);
                window.removeEventListener('resize', onResize);
                renderer.dispose();
                if (canvasRef.current && renderer.domElement.parentNode === canvasRef.current) {
                    canvasRef.current.removeChild(renderer.domElement);
                }
            };
        });

        return () => { cancelled = true; };
    }, []);

    return (
        <section id="about" className="flySection">
            {/* Soft gradient blend transition from hero photo */}
            <div
                className="flySectionTopBlend"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '28vh',
                    background: 'linear-gradient(to bottom, #F6F1E7 0%, rgba(246, 241, 231, 0.7) 45%, rgba(239, 236, 229, 0) 100%)',
                    zIndex: 8,
                    pointerEvents: 'none',
                }}
            />
            {/* WebGL fills the section */}
            <div ref={canvasRef} className="flyCanvas" aria-hidden="true" />
            {/* Centred headline on top */}
            <div className="flyHero">
                <p className="flyEyebrow">ORÉVA STUDIO</p>
                <h3 className="flyHeadline">Curating spaces, styling stories.</h3>
                <p className="flySub">Visual Merchandising</p>
            </div>
        </section>
    );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────
export default function Home() {
    const [menu, setMenu] = useState(false);
    const [scroll, setScroll] = useState(0);
    const [selectedService, setSelectedService] = useState<ServiceDetailItem | null>(null);

    useEffect(() => {
        const f = () => setScroll(window.scrollY);
        addEventListener('scroll', f, { passive: true });
        return () => removeEventListener('scroll', f);
    }, []);

    return (
        <main>
            {/* NAV */}
            <header className="nav">
                <div className="navLeft" style={{ cursor: 'none' }}>

                    <a className="logoNavGroup" href="#top" style={{ display: 'inline-flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }}>
                        <img
                            src="/logo/logo.svg"
                            alt="ORÉVA Studio Logo"
                            style={{ height: '42px', width: 'auto', display: 'block', filter: 'drop-shadow(0 2px 8px rgba(154,114,62,0.25))' }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '30px', letterSpacing: '0.12em', color: '#4A3828', fontWeight: 600, lineHeight: 1 }}>ORÉVA</span>
                            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#9A723E', marginTop: '3px' }}>STUDIO</span>
                        </div>
                    </a>
                </div>

                <div className="navRight">
                    <nav style={{ display: 'flex', alignItems: 'center' }}>
                        <AnimatedBackground
                            className="navPill"
                            transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
                            enableHover
                        >
                            {(['About', 'Services', 'Method', 'Work', 'Contact'] as const).map((label) => (
                                <a
                                    key={label}
                                    data-id={label}
                                    href={`#${label.toLowerCase()}`}
                                    className="navLink"
                                >
                                    {label}
                                </a>
                            ))}
                        </AnimatedBackground>
                    </nav>
                    <div className="navDivider"></div>
                    <a href="mailto:hello@orevastudio.com" className="navIcon" aria-label="Contact ORÉVA Studio">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                    </a>
                    <button className="menuIcon" aria-label={menu ? 'Close navigation' : 'Open navigation'} aria-expanded={menu} onClick={() => setMenu(!menu)}><MenuIcon size={22} strokeWidth={1.5} /></button>
                </div>
            </header>

            {menu && (
                <div className="mobileMenu">
                    {['about', 'services', 'method', 'work', 'contact'].map(x => (
                        <a key={x} href={'#' + x} onClick={() => setMenu(false)}>{x}</a>
                    ))}
                </div>
            )}

            {/* 1 — HERO */}
            <HomeHero />

            {/* 2 — THREE.JS FLYTHROUGH (full-screen, after first scroll) */}
            <FlythroughSection />

            <div className="studioJourney">
            <JourneyLine />
            {/* 3 — WHAT DO WE MAKE & 3D CIRCULAR CAROUSEL */}
            <section id="services" className="whatWeMakeSection">
                {/* Subtle luxury transition mask from flythrough */}
                <div className="whatWeMakeTransitionMask" />

                <div className="whatWeMakeContainer">
                    <div className="whatWeMakeHeader">
                        <h2><TextEffect per="char" preset="fade">What do we make?</TextEffect></h2>
                        <p><TextEffect per="char" preset="fade">ORÉVA creates tangible and visual outputs across the retail journey.</TextEffect></p>
                    </div>
                </div>

                {/* 3D circular carousel with plinth base */}
                <div className="whatWeMakeCarousel">
                    <CircularCarousel
                        items={whatWeMakeServices.map(s => ({
                            src: s.src,
                            alt: s.alt,
                            title: s.title,
                            subtitle: s.subtitle,
                            aspectRatio: s.aspectRatio
                        }))}
                        preset="cylinder"
                        intro="rise"
                        cardWidth={290}
                        aspectRatio={1253 / 1098}
                        gap={45}
                        radiusMultiplier={1.15}
                        plinthImage="/___6_-removebg-preview.png"
                        speed={12}
                        captions={true}
                        fadeColor="#DED1BC"
                        onItemClick={(item, index) => {
                            const fullService = whatWeMakeServices[index] || whatWeMakeServices[0];
                            setSelectedService(fullService);
                        }}
                    />
                </div>
                <div className="servicesMethodBridge">
                    <span>THE WORK BEGINS WITH A POINT OF VIEW</span>
                    <a href="#method">Explore the ORÉVA method <span aria-hidden="true">↓</span></a>
                </div>
            </section>

            {/* 3b — METHOD JOURNEY (after circular carousel) */}
            <MethodSection />

            {/* 3c — PROJECT SHOWCASE (after method section) */}
            <ProjectShowcaseSection />

            {/* 3d — HERO TO PAGE 2 SCROLL TRANSITION (before footer) */}
            <HeroTransitionSection />

            <Playground />

            {/* CONTACT / FOOTER AFTER THE MATERIALS SEQUENCE */}
            <InteractiveFooter />
            </div>

            <div className="cursor" style={{ transform: `translate(${scroll * 0.02}px, ${scroll * 0.01}px)` }}></div>

            {/* SERVICE EXTENDED DETAIL MODAL */}
            {selectedService && (
                <div
                    className="serviceModalBackdrop"
                    onClick={() => setSelectedService(null)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 100,
                        background: 'rgba(36, 33, 29, 0.75)',
                        backdropFilter: 'blur(10px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2vw',
                    }}
                >
                    <div
                        className="serviceModalCard"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: '#F6F1E7',
                            color: '#4A3828',
                            borderRadius: '16px',
                            maxWidth: '860px',
                            width: '92%',
                            maxHeight: '90vh',
                            overflowY: 'auto',
                            border: '1px solid rgba(154, 114, 62, 0.35)',
                            boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
                            display: 'grid',
                            gridTemplateColumns: '1.1fr 1.2fr',
                            position: 'relative'
                        }}
                    >
                        <button
                            onClick={() => setSelectedService(null)}
                            aria-label="Close modal"
                            style={{
                                position: 'absolute',
                                top: '18px',
                                right: '18px',
                                background: 'rgba(74, 56, 40, 0.1)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '36px',
                                height: '36px',
                                cursor: 'pointer',
                                fontSize: '18px',
                                color: '#4A3828',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 10,
                                transition: 'background 0.2s'
                            }}
                        >
                            ✕
                        </button>

                        <div style={{ height: '100%', minHeight: '360px', overflow: 'hidden', borderRadius: '16px 0 0 16px' }}>
                            <img
                                src={selectedService.src}
                                alt={selectedService.alt || selectedService.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                        </div>

                        <div style={{ padding: '36px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <span style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#9A723E', fontWeight: 600 }}>
                                {selectedService.num} — SERVICE DETAILS
                            </span>
                            <h2 style={{ font: "500 32px/1.1 'Cormorant Garamond', serif", margin: '10px 0 6px', color: '#4A3828' }}>
                                {selectedService.title}
                            </h2>
                            <p style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9A723E', margin: '0 0 16px', opacity: 0.85 }}>
                                {selectedService.subtitle}
                            </p>
                            <p style={{ fontSize: '13px', lineHeight: '1.7', color: '#4A3828', opacity: 0.9, marginBottom: '20px' }}>
                                {selectedService.description}
                            </p>

                            <div style={{ borderTop: '1px solid rgba(154, 114, 62, 0.25)', paddingTop: '16px' }}>
                                <span style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#4A3828', fontWeight: 600, display: 'block', marginBottom: '10px' }}>
                                    KEY OUTPUTS & DELIVERABLES:
                                </span>
                                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', lineHeight: '1.8', color: '#4A3828' }}>
                                    {selectedService.details.map((item, idx) => (
                                        <li key={idx} style={{ marginBottom: '3px' }}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
