'use client';
import { useEffect, useRef, useState } from 'react';
import { TextLoop } from '../components/core/text-loop';
import { Cursor } from '../components/core/cursor';
import { Menu as MenuIcon } from 'lucide-react';
import { AnimatedBackground } from '../components/core/animated-background';
import CircularCarousel from '../components/core/CircularCarousel';
import MethodSection from '../components/core/MethodSection';

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
}

const whatWeMakeServices: ServiceDetailItem[] = [
    {
        num: '01',
        title: 'VISUAL MERCHANDISING',
        subtitle: 'Windows · Mannequins · Display systems',
        description: 'Sculpting store displays, architectural plinths, and product clustering that guide customer movement and evoke desire.',
        details: [
            'Windows',
            'Mannequin styling',
            'Product clustering',
            'Cross-merchandising',
            'Display systems'
        ],
        src: '/props/%40en__gold_.jpeg',
        alt: 'Visual Merchandising by ORÉVA'
    },
    {
        num: '02',
        title: 'STYLING',
        subtitle: 'Editorial · Campaigns · Lookbooks',
        description: 'Defining tactile harmony through fabric selection, garment silhouettes, prop curation, and visual narratives.',
        details: [
            'Editorial styling',
            'Campaign direction',
            'Look development',
            'Prop & product styling',
            'Visual narratives'
        ],
        src: '/props/Background%20image%20.PNG',
        alt: 'Styling by ORÉVA'
    },
    {
        num: '03',
        title: 'RETAIL CONCEPTS',
        subtitle: 'Boutiques · Pop-ups · Spatial moodboards',
        description: 'Building immersive physical spaces and temporary pop-ups framed around spatial moodboards and material direction.',
        details: [
            'Store concepts',
            'Window concepts',
            'Pop-ups',
            'Spatial moodboards',
            'Material direction'
        ],
        src: '/props/Golden%20Mirror%20Aesthetic%20%E2%9C%A8%20Pearls%2C%20Silk%20%26%20White%20Roses.jpeg',
        alt: 'Retail Concepts by ORÉVA'
    },
    {
        num: '04',
        title: 'BRAND EXPERIENCE',
        subtitle: 'Storytelling · Packaging · Creative direction',
        description: 'Translating brand identity into spatial environments, customer journeys, packaging touchpoints, and creative direction.',
        details: [
            'Brand storytelling',
            'Visual identity in space',
            'Customer journey',
            'Packaging touchpoints',
            'Creative direction'
        ],
        src: '/props/_%20%281%29%20%281%29.jpeg',
        alt: 'Brand Experience by ORÉVA'
    },
    {
        num: '05',
        title: 'OBJECT COMPOSITION',
        subtitle: 'Quiet moments · Sculptural harmony',
        description: 'Composing curated items, jewelry, and luxury objects as quiet, still-life moments of desire.',
        details: [
            'Jewelry & Fine Object Placement',
            'Sculptural & Plinth Composition',
            'Material & Texture Juxtaposition',
            'Lighting & Shadow Direction'
        ],
        src: '/props/_%20%282%29.jpeg',
        alt: 'Object Composition by ORÉVA'
    },
    {
        num: '06',
        title: 'MATERIAL & MOTION',
        subtitle: 'Travertine · Linen · Brushed metal',
        description: 'Integrating stone, metal, linen, and subtle motion to create grounded, architectural spatial stories.',
        details: [
            'Travertine & Stone Plinths',
            'Brushed Metal & Glass Frames',
            'Tactile Linen & Soft Fabrics',
            'Dynamic Light & Shadow Play'
        ],
        src: '/props/_%20%283%29.jpeg',
        alt: 'Material & Motion by ORÉVA'
    }
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
            interface TexInfo { tex: THREE.Texture; aspect: number }
            const loaded: (TexInfo | null)[] = new Array(IMAGES.length).fill(null);

            IMAGES.forEach((url, idx) => {
                loader.load(url, (t) => {
                    t.colorSpace = THREE.SRGBColorSpace;
                    const img = t.image as HTMLImageElement;
                    const aspect = img.naturalWidth && img.naturalHeight
                        ? img.naturalWidth / img.naturalHeight : 1;
                    loaded[idx] = { tex: t, aspect };
                });
            });

            interface Card { mesh: THREE.Mesh; slot: number }
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
                    const mat = mesh.material as THREE.MeshBasicMaterial;
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
                        (mesh.material as THREE.Material).dispose();
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
        <section className="flySection">
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
                    <Cursor
                        attachToParent
                        variants={{
                            initial: { height: 10, opacity: 0, scale: 0.5 },
                            animate: { height: 'auto', opacity: 1, scale: 1 },
                            exit: { height: 0, opacity: 0, scale: 0.3 },
                        }}
                        transition={{
                            type: 'spring',
                            duration: 0.3,
                            bounce: 0.1,
                        }}
                        className='overflow-hidden cursorWrapper'
                        springConfig={{
                            bounce: 0.01,
                        }}
                    >
                        <img
                            src="/Screenshot 2026-10-03 at 1.24.15 PM.png"
                            alt="Creative Direction"
                            className="cursorImage"
                        />
                    </Cursor>
                    <a className="logo" href="#top">ORÉVA<br /><span className="logoSub">STUDIO</span></a>
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
                    <a href="#" className="navIcon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                    </a>
                    <button className="menuIcon" onClick={() => setMenu(!menu)}><MenuIcon size={22} strokeWidth={1.5} /></button>
                </div>
            </header>

            {menu && (
                <div className="mobileMenu">
                    {['work', 'services', 'studio', 'journal', 'contact'].map(x => (
                        <a key={x} href={'#' + x} onClick={() => setMenu(false)}>{x}</a>
                    ))}
                </div>
            )}

            {/* 1 — HERO */}
            <section id="top" className="hero">
                {/* Background image at low opacity */}
                <div className="heroBg" aria-hidden="true" />

                <div className="eyebrow" style={{ cursor: 'none' }}>
                    <Cursor
                        attachToParent
                        variants={{
                            initial: { height: 10, opacity: 0, scale: 0.5 },
                            animate: { height: 'auto', opacity: 1, scale: 1 },
                            exit: { height: 0, opacity: 0, scale: 0.3 },
                        }}
                        transition={{
                            type: 'spring',
                            duration: 0.3,
                            bounce: 0.1,
                        }}
                        className='overflow-hidden cursorWrapper'
                        springConfig={{
                            bounce: 0.01,
                        }}
                    >
                        <img
                            src="/Screenshot 2026-10-03 at 1.24.15 PM.png"
                            alt="Creative Direction"
                            className="cursorImage"
                        />
                    </Cursor>
                    ORÉVA STUDIO <span>—</span> CREATIVE DIRECTION
                </div>

                {/* Right-side logo mark with hover animation */}
                <div className="heroLogoMark" aria-hidden="true">
                    <img
                        src="/logo/logo.svg"
                        alt=""
                        className="heroLogo"
                        draggable={false}
                    />
                </div>

                <div className="heroTitle">
                    <h1 className="heroTextLoop">
                        <span style={{ color: '#886539' }}>We</span>{' '}
                        <TextLoop
                            className="overflow-y-clip"
                            transition={{
                                type: 'spring',
                                stiffness: 900,
                                damping: 80,
                                mass: 10,
                            }}
                            variants={{
                                initial: {
                                    y: 20,
                                    rotateX: 90,
                                    opacity: 0,
                                    filter: 'blur(4px)',
                                },
                                animate: {
                                    y: 0,
                                    rotateX: 0,
                                    opacity: 1,
                                    filter: 'blur(0px)',
                                },
                                exit: {
                                    y: -20,
                                    rotateX: -90,
                                    opacity: 0,
                                    filter: 'blur(4px)',
                                },
                            }}
                        >
                            <span>Think</span>
                            <span>Create</span>
                            <span>Transform</span>
                        </TextLoop>
                    </h1>
                    <p>Visual Merchandising · Styling · Retail Concepts</p>
                </div>
            </section>

            {/* 2 — THREE.JS FLYTHROUGH (full-screen, after first scroll) */}
            <FlythroughSection />

            {/* 3 — STATEMENT, WHAT DO WE MAKE & ENLARGED 3D CIRCULAR CAROUSEL */}
            <section className="statementSection" style={{ position: 'relative' }}>

                {/* WHAT DO WE MAKE TABLE GRID */}
                <div className="whatWeMakeContainer" style={{ padding: '0 6vw 4vw' }}>
                    <div className="whatWeMakeHeader" style={{ marginBottom: '32px' }}>
                        <h2 style={{ font: "400 clamp(36px, 5vw, 64px)/1.05 'Cormorant Garamond', Georgia, serif", margin: '0 0 12px', color: '#4A3828', letterSpacing: '-0.02em' }}>
                            What do we make?
                        </h2>
                        <p style={{ font: "400 18px 'Cormorant Garamond', Georgia, serif", color: '#4A3828', opacity: 0.85, margin: 0, letterSpacing: '0.02em' }}>
                            ORÉVA creates tangible and visual outputs across the retail journey.
                        </p>
                    </div>

                    <div className="whatWeMakeGrid">
                        {whatWeMakeServices.slice(0, 4).map((service) => (
                            <div
                                key={service.num}
                                className="whatWeMakeCol"
                                onClick={() => setSelectedService(service)}
                                style={{ cursor: 'pointer' }}
                            >
                                <span className="colNum">{service.num}</span>
                                <h3 className="colTitle">{service.title}</h3>
                                <ul className="colList">
                                    {service.details.map((detail, idx) => (
                                        <li key={idx}>{detail}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ENLARGED 3D CIRCULAR CAROUSEL WITH PLINTH BASE */}
                <div style={{ width: '100%', height: '680px', position: 'relative', marginTop: '1vw', marginBottom: '2vw' }}>
                    <CircularCarousel
                        items={whatWeMakeServices.map(s => ({
                            src: s.src,
                            alt: s.alt,
                            title: s.title,
                            subtitle: s.subtitle
                        }))}
                        preset="cylinder"
                        intro="rise"
                        cardWidth={290}
                        aspectRatio={0.82}
                        gap={45}
                        radiusMultiplier={1.45}
                        plinthImage="/___6_-removebg-preview.png"
                        speed={12}
                        captions={true}
                        fadeColor="#F6F1E7"
                        onItemClick={(item, index) => {
                            const fullService = whatWeMakeServices[index] || whatWeMakeServices[0];
                            setSelectedService(fullService);
                        }}
                    />
                </div>
            </section>

            {/* 3b — METHOD JOURNEY (after circular carousel) */}
            <MethodSection />

            {/* 4 — GALLERY */}
            <section className="gallery">
                <div className="gallerySticky">
                    <div className="scene">
                        <div className="orb"></div>
                        <div className="ring big"></div>
                        <div className="frame"></div>
                        <div className="stone"></div>
                        <div className="sceneText">
                            <small>THE OBJECT</small>
                            <h2>Material<br /><i>in motion.</i></h2>
                        </div>
                    </div>
                </div>
                <div className="galleryCopy">
                    <article><small>01 — THE OBJECT</small><h3>Form creates the first invitation.</h3></article>
                    <article><small>02 — THE MATERIAL</small><h3>Texture gives space its memory.</h3></article>
                    <article><small>03 — THE DETAIL</small><h3>Desire lives in what we notice closely.</h3></article>
                    <article><small>04 — THE DESIRE</small><h3>Experience is what remains.</h3></article>
                </div>
            </section>

            {/* 5 — SERVICES */}
            <section id="services" className="services">
                <div className="sectionHead">
                    <small>03 / WHAT WE CREATE</small>
                    <h2>THE ORÉVA<br /><i>CABINET.</i></h2>
                </div>
                <div className="cabinet">
                    {services.map((s, i) => (
                        <article className="service" key={s[0]}>
                            <span>{s[0]}</span>
                            <div><h3>{s[1]}</h3><p>{s[2]}</p></div>
                            <b>↗</b>
                            <div className={'serviceShape s' + i}></div>
                        </article>
                    ))}
                </div>
            </section>

            {/* 6 — WORK */}
            <section id="work" className="work">
                <div className="sectionHead">
                    <small>04 / SELECTED WORK</small>
                    <h2>A VISUAL<br /><i>JOURNAL.</i></h2>
                </div>
                <div className="workGrid">
                    {work.map((p, i) => (
                        <article className={'project p' + i} key={p[0]}>
                            <div className="projectImage">
                                {/* Cycle real photos; mod by IMAGES.length */}
                                <img
                                    src={IMAGES[i % IMAGES.length]}
                                    alt={p[1]}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                />
                            </div>
                            <div className="meta">
                                <small>{p[0]} — {p[1]}</small>
                                <strong>{p[2]}</strong>
                                <p>{p[3]}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* 8 — STUDIO */}
            <section id="studio" className="studio">
                <div className="studioImage">
                    <img
                        src={IMAGES[4 % IMAGES.length]}
                        alt="ORÉVA editorial"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                </div>
                <div className="studioText">
                    <small>06 / STUDIO</small>
                    <h2>A MORE BEAUTIFUL WAY<br />TO <i>EXPERIENCE.</i></h2>
                    <p>Quiet. Editorial. Tactile. Architectural. Emotional. Contemporary.</p>
                    <p>ORÉVA builds visual worlds for fashion, jewellery, luxury retail, boutiques and emerging brands.</p>
                    <div className="miniMark">O</div>
                </div>
            </section>

            {/* 9 — JOURNAL */}
            <section id="journal" className="journal">
                <div className="sectionHead">
                    <small>07 / MATERIAL · MOOD · MEANING</small>
                    <h2>THE PRIVATE<br /><i>NOTEBOOK.</i></h2>
                </div>
                <div className="materialStrip">
                    {materials.map((m, i) => (
                        <article key={m[0]}>
                            <div className="mat" style={{
                                backgroundImage: `url(${IMAGES[i % IMAGES.length]})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}></div>
                            <small>{m[0]}</small>
                            <p>{m[1]}</p>
                        </article>
                    ))}
                </div>
            </section>

            {/* 10 — CONTACT */}
            <section id="contact" className="contact">
                <small>08 / CONTACT</small>
                <h2>LET&apos;S CREATE SOMETHING<br /><i>WORTH EXPERIENCING.</i></h2>
                <p>Visual Merchandising · Styling · Retail Concepts</p>
                <a className="email" href="mailto:hello@orevastudio.com">
                    hello@orevastudio.com <span>↗</span>
                </a>
                <div className="finalMark">O</div>
            </section>

            <footer>
                <span>ORÉVA STUDIO</span>
                <span>SPACES. STORIES. DESIRE.</span>
                <span>© 2026</span>
            </footer>

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
