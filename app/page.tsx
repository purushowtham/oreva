'use client';
import { useEffect, useRef, useState } from 'react';
import { TextLoop } from '../components/core/text-loop';
import { Cursor } from '../components/core/cursor';
import { Menu as MenuIcon } from 'lucide-react';

// ─── DATA ──────────────────────────────────────────────────────────────────
const services = [
  ['01','Visual Merchandising','Jewellery display / plinth'],
  ['02','Styling','Fabric / garment silhouette'],
  ['03','Retail Concepts','Architectural store frame'],
  ['04','Brand Storytelling','Editorial paper / card'],
  ['05','Creative Direction','Rotating ORÉVA monogram'],
];
const work = [
  ['01','Maison No. 01','Retail concept · 2026','A study in stone, metal and desire.'],
  ['02','Object / Form','Visual merchandising · 2026','Objects composed as quiet moments.'],
  ['03','The Private Room','Spatial styling · 2025','An intimate language for luxury.'],
  ['04','Still / Moving','Creative direction · 2025','Material, light and movement.'],
];
const materials = [
  ['TRAVERTINE','Grounded / Architectural / Timeless'],
  ['LINEN','Tactile / Relaxed / Human'],
  ['BRUSHED METAL','Refined / Precise / Contemporary'],
  ['GLASS','Light / Transparent / Intriguing'],
  ['VELVET','Depth / Sensual / Quiet'],
];

// ─── FLYTHROUGH CONFIG ─────────────────────────────────────────────────────
const CARD_COUNT  = 38;
const SPEED       = 3.6;
const SPEED_A11Y  = 0.9;
const DEPTH       = 62;
const NEAR_CULL   = 1.3;
const RADIUS_MIN  = 1.8;
const RADIUS_MAX  = 5.8;
const SIZE_MIN    = 1.1;
const SIZE_MAX    = 2.1;
const FOV         = 50;

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

      const scene  = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 0.1, 200);
      camera.position.set(0, 0, 5);

      const loader = new THREE.TextureLoader();

      function rnd(a: number, b: number) { return a + Math.random() * (b - a); }
      function randXY() {
        const angle  = Math.random() * Math.PI * 2;
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
        const info   = loaded[imgIdx];

        const aspect = info ? info.aspect : 1.33; // fallback ratio until loaded
        const size   = rnd(SIZE_MIN, SIZE_MAX);
        const geom   = new THREE.PlaneGeometry(size * aspect, size);

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
        const dt  = Math.min((now - last) / 1000, 0.05);
        last = now;

        for (const card of cards) {
          const { mesh } = card;
          mesh.position.z += spd * dt;

          // Depth fade
          const dist   = camera.position.z - mesh.position.z;
          const t      = Math.max(0, Math.min(1, 1 - dist / DEPTH));
          const smooth = t * t * (3 - 2 * t);
          const fadein = Math.min(1, t / 0.06);
          const mat    = mesh.material as THREE.MeshBasicMaterial;
          mat.opacity  = Math.min(smooth, fadein) * 0.88 + 0.08;

          // Swap texture in once loaded (if it wasn't ready at build time)
          const imgIdx = card.slot % IMAGES.length;
          if (!mat.map && loaded[imgIdx]) {
            const info = loaded[imgIdx]!;
            mat.map   = info.tex;
            mat.color.set(0xffffff);
            mat.needsUpdate = true;
            const sz = rnd(SIZE_MIN, SIZE_MAX);
            const g  = new THREE.PlaneGeometry(sz * info.aspect, sz);
            mesh.geometry.dispose();
            mesh.geometry = g;
          }

          // Respawn
          if (mesh.position.z > camera.position.z - NEAR_CULL) {
            scene.remove(mesh);
            mesh.geometry.dispose();
            (mesh.material as THREE.Material).dispose();
            const idx = cards.indexOf(card);
            const nc  = buildCard(card.slot, false);
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
  const [menu, setMenu]     = useState(false);
  const [scroll, setScroll] = useState(0);

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
          <a className="logo" href="#top">ORÉVA<br/><span className="logoSub">STUDIO</span></a>
        </div>
        
        <div className="navRight">
          <nav>
            <a href="#about">About</a>
            <a href="#services">Services</a>
            <a href="#method">Method</a>
            <a href="#work">Work</a>
            <a href="#contact">Contact</a>
          </nav>
          <div className="navDivider"></div>
          <a href="#" className="navIcon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
          </a>
          <button className="menuIcon" onClick={() => setMenu(!menu)}><MenuIcon size={22} strokeWidth={1.5} /></button>
        </div>
      </header>

      {menu && (
        <div className="mobileMenu">
          {['work','services','studio','journal','contact'].map(x => (
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

      {/* 3 — STATEMENT */}
      <section className="statement">
        <p>Quiet luxury,<br/><em>translated into space.</em></p>
        <span>ORÉVA creates considered visual worlds for fashion, jewellery and contemporary retail.</span>
      </section>

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
              <h2>Material<br/><i>in motion.</i></h2>
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
          <h2>THE ORÉVA<br/><i>CABINET.</i></h2>
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
          <h2>A VISUAL<br/><i>JOURNAL.</i></h2>
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

      {/* 7 — METHOD */}
      <section className="method">
        <div className="sectionHead">
          <small>05 / THE ORÉVA METHOD</small>
          <h2>FROM INSIGHT<br/><i>TO EXPERIENCE.</i></h2>
        </div>
        <div className="methodLine">
          {['Research','Concept','Curation','Design','Experience'].map((x, i) => (
            <article key={x}>
              <span>0{i + 1}</span>
              <div className="dot"></div>
              <h3>{x}</h3>
              <p>{[
                'Understand the brand, customer, space and visual culture.',
                'Translate insight into a visual direction.',
                'Select materials, references, objects and details.',
                'Shape the environment, styling and visual system.',
                'Turn the concept into something people remember.',
              ][i]}</p>
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
          <h2>A MORE BEAUTIFUL WAY<br/>TO <i>EXPERIENCE.</i></h2>
          <p>Quiet. Editorial. Tactile. Architectural. Emotional. Contemporary.</p>
          <p>ORÉVA builds visual worlds for fashion, jewellery, luxury retail, boutiques and emerging brands.</p>
          <div className="miniMark">O</div>
        </div>
      </section>

      {/* 9 — JOURNAL */}
      <section id="journal" className="journal">
        <div className="sectionHead">
          <small>07 / MATERIAL · MOOD · MEANING</small>
          <h2>THE PRIVATE<br/><i>NOTEBOOK.</i></h2>
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
        <h2>LET&apos;S CREATE SOMETHING<br/><i>WORTH EXPERIENCING.</i></h2>
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
    </main>
  );
}
