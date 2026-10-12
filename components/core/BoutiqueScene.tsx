'use client';

import { useEffect, useRef, useState } from 'react';
import type { BufferGeometry, Material } from 'three';

export type BoutiqueZone = 'display' | 'lounge' | 'arrival';

export default function BoutiqueScene({ blueprint, zone, onSelect }: {
  blueprint: boolean; zone: BoutiqueZone; onSelect: (zone: BoutiqueZone) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const control = useRef({ blueprint, zone, yaw: -.15 });
  const select = useRef(onSelect);
  const [ready, setReady] = useState(false);
  useEffect(() => { control.current.blueprint = blueprint; control.current.zone = zone; select.current = onSelect; }, [blueprint, zone, onSelect]);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let stopped = false;
    let cleanup = () => {};
    async function build() {
      const [T, { RoomEnvironment }, { RoundedBoxGeometry }] = await Promise.all([
        import('three'), import('three/examples/jsm/environments/RoomEnvironment.js'),
        import('three/examples/jsm/geometries/RoundedBoxGeometry.js'),
      ]);
      if (stopped) return;
      const renderer = new T.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
      let needsRender = true;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.toneMapping = T.ACESFilmicToneMapping;
      renderer.toneMappingExposure = .95;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = T.PCFShadowMap;
      const scene = new T.Scene();
      const room = new RoomEnvironment();
      const generator = new T.PMREMGenerator(renderer);
      const environment = generator.fromScene(room, .04);
      scene.environment = environment.texture;
      scene.environmentIntensity = .55;
      room.dispose(); generator.dispose();
      const camera = new T.OrthographicCamera(-7, 7, 6, -6, .1, 80);
      const sculpture = new T.Group();
      const solid = new T.Group();
      const drawing = new T.Group();
      sculpture.add(solid, drawing); scene.add(sculpture);
      const surface = document.createElement('canvas');
      surface.width = surface.height = 256;
      const context = surface.getContext('2d')!;
      context.fillStyle = '#eee5d6'; context.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 1600; i++) {
        context.fillStyle = `rgba(116,89,53,${.025 + (i % 4) * .01})`;
        context.fillRect((i * 73) % 256, (i * 139 + Math.floor(i / 256) * 17) % 256, 1, 2);
      }
      context.strokeStyle = '#b7a68f28'; context.lineWidth = .7;
      for (let i = 0; i < 7; i++) {
        context.beginPath(); context.moveTo(0, i * 43);
        context.bezierCurveTo(80, i * 43 - 16, 150, i * 43 + 22, 256, i * 43 - 8); context.stroke();
      }
      const stoneTexture = new T.CanvasTexture(surface);
      stoneTexture.colorSpace = T.SRGBColorSpace;
      stoneTexture.wrapS = stoneTexture.wrapT = T.RepeatWrapping; stoneTexture.repeat.set(3, 3);
      const stone = new T.MeshStandardMaterial({ color: '#d4c0a0', map: stoneTexture, roughness: .78 });
      const plaster = new T.MeshStandardMaterial({ color: '#bca385', roughness: .9 });
      const brass = new T.MeshStandardMaterial({ color: '#ac7a3e', metalness: .72, roughness: .3 });
      const walnut = new T.MeshStandardMaterial({ color: '#493325', roughness: .65 });
      const velvet = new T.MeshStandardMaterial({ color: '#917960', roughness: 1 });
      const leaves = new T.MeshStandardMaterial({ color: '#343c29', roughness: 1 });
      const glass = new T.MeshStandardMaterial({ color: '#f1e6d2', transparent: true, opacity: .2, metalness: .15, roughness: .12, depthWrite: false });
      const glow = new T.MeshStandardMaterial({ color: '#ffe6ae', emissive: '#ffc778', emissiveIntensity: .6, roughness: .45 });
      const jewels = new T.MeshStandardMaterial({ color: '#fff3dd', metalness: .2, roughness: .3 });
      const lines = new T.LineBasicMaterial({ color: '#cabda4', transparent: true, opacity: 0 });
      const mesh = (geometry: BufferGeometry, material: Material, x: number, y: number, z: number, area?: BoutiqueZone) => {
        const object = new T.Mesh(geometry, material);
        object.castShadow = material !== glass && material !== glow;
        object.receiveShadow = true;
        object.position.set(x, y, z);
        if (area) object.userData.zone = area;
        solid.add(object);
        return object;
      };
      const box = (w: number, h: number, d: number, x: number, y: number, z: number, material = stone, area?: BoutiqueZone) =>
        mesh(new RoundedBoxGeometry(w, h, d, 2, Math.min(.055, w / 4, h / 4, d / 4)), material, x, y, z, area);
      const cylinder = (radius: number, height: number, x: number, y: number, z: number, material = brass, area?: BoutiqueZone) =>
        mesh(new T.CylinderGeometry(radius, radius, height, 40), material, x, y, z, area);
      const arch = (w: number, h: number) => {
        const shape = new T.Shape();
        shape.moveTo(-w / 2, 0); shape.lineTo(w / 2, 0); shape.lineTo(w / 2, h - w / 2);
        shape.absarc(0, h - w / 2, w / 2, 0, Math.PI, false);
        shape.closePath();
        return shape;
      };
      // Cutaway architecture: open front and right edges keep the interior visible.
      box(9, .28, 7.4, 0, -.14, 0);
      box(9, 2.8, .2, 0, 1.4, -3.6, plaster);
      box(.2, 2.25, 7.4, -4.4, 1.125, 0, plaster);
      box(.18, .5, 7.4, 4.4, .25, 0, plaster);
      for (let i = 0; i < 7; i++) box(.012, .005, 7.15, -3.3 + i * 1.1, .006, 0, plaster);
      for (let i = 0; i < 6; i++) box(8.7, .005, .012, 0, .007, -2.8 + i * 1.1, plaster);
      for (const x of [-2.9, 0, 2.9]) {
        mesh(new T.ExtrudeGeometry(arch(1.85, 2.22), { depth: .1, bevelEnabled: false }), brass, x, .2, -3.43, 'display');
        mesh(new T.ShapeGeometry(arch(1.58, 2.02)), glow, x, .27, -3.31, 'display');
        box(1.7, .12, .48, x, .64, -3.08, brass, 'display');
        for (const dx of [-.45, 0, .45]) {
          mesh(new T.ConeGeometry(.13, .32, 24), jewels, x + dx, .87, -3.07, 'display');
          mesh(new T.SphereGeometry(.075, 16, 12), jewels, x + dx, 1.08, -3.07, 'display');
        }
      }
      // Fluted walnut shelving along the side wall.
      for (let i = 0; i < 29; i++) box(.05, 2.05, .075, -4.22, 1.1, -3.3 + i * .235, walnut);
      for (const z of [-2.4, -.8, .8]) {
        box(.8, .75, 1.2, -3.8, .38, z, brass, 'display');
        box(.8, .055, 1.2, -3.8, .78, z, glow, 'display');
        mesh(new T.ConeGeometry(.13, .3, 20), jewels, -3.72, .96, z, 'display');
      }
      const counter = (x: number, z: number, w: number, d: number) => {
        box(w, .72, d, x, .36, z, brass, 'display');
        box(w + .06, .07, d + .06, x, .755, z, stone, 'display');
        box(w, .42, d, x, 1, z, glass, 'display');
        box(w, .035, d, x, 1.22, z, brass, 'display');
        for (const dx of [-.3, .3]) mesh(new T.ConeGeometry(.1, .24, 20), jewels, x + dx, .92, z, 'display');
      };
      counter(-1.75, -.85, .85, 2.1); counter(1.95, .9, .85, 2);
      cylinder(.75, .65, .25, .325, -.05, brass, 'display');
      cylinder(.78, .06, .25, .68, -.05, stone, 'display');
      for (let i = 0; i < 5; i++) {
        const angle = i / 5 * Math.PI * 2;
        cylinder(.1, .16, .25 + Math.cos(angle) * .45, .79, -.05 + Math.sin(angle) * .45, jewels, 'display');
      }
      // A sculptural conversation area, echoing the reference's curved sofa.
      const sofa = mesh(new T.TorusGeometry(.85, .24, 12, 36, Math.PI * 1.35), velvet, -2.3, .48, 2.15, 'lounge');
      sofa.rotation.x = Math.PI / 2; sofa.rotation.z = -.55;
      cylinder(.48, .38, -2, .19, 2.2, brass, 'lounge');
      cylinder(.5, .05, -2, .41, 2.2, stone, 'lounge');
      cylinder(.28, .36, -1.12, .18, 2.65, velvet, 'lounge');
      for (const [x, z] of [[-3.5, 1.4], [2.9, -2.4]]) {
        cylinder(.27, .42, x, .21, z, walnut);
        cylinder(.035, .85, x, .75, z, walnut);
        for (let i = 0; i < 9; i++) {
          const angle = i * 2.4;
          const leaf = mesh(new T.SphereGeometry(.2, 10, 8), leaves, x + Math.cos(angle) * .3, 1 + (i % 3) * .2, z + Math.sin(angle) * .3);
          leaf.scale.set(1.3, .5, .8);
        }
      }
      // Brass portal and shopfront glazing.
      const portal = arch(1.65, 2.5);
      const opening = arch(1.4, 2.33);
      const hole = new T.Path(opening.getPoints());
      portal.holes.push(hole);
      mesh(new T.ExtrudeGeometry(portal, { depth: .18, bevelEnabled: false }), brass, .3, 0, 3.43, 'arrival');
      for (const x of [-3.1, -1.6, 1.95, 3.45]) {
        box(1.35, 1.3, .06, x, .65, 3.5, glass, 'arrival');
        box(.045, 1.4, .08, x - .67, .7, 3.5, brass, 'arrival');
        box(1.4, .055, .08, x, 1.35, 3.5, brass, 'arrival');
      }
      box(1.65, .025, 1.2, .3, .02, 3.4, walnut, 'arrival');
      // A precise line version of the same model, rather than a separate image.
      solid.updateMatrixWorld(true);
      solid.children.forEach((object) => {
        if (!(object instanceof T.Mesh)) return;
        // Soft furniture corners still need a crisp rectangular footprint in plan.
        let source = object.geometry;
        if (source instanceof RoundedBoxGeometry) {
          source.computeBoundingBox();
          const bounds = source.boundingBox!.getSize(new T.Vector3());
          source = new T.BoxGeometry(bounds.x, bounds.y, bounds.z);
        }
        const outline = new T.LineSegments(new T.EdgesGeometry(source, 28), lines);
        if (source !== object.geometry) source.dispose();
        outline.position.copy(object.position); outline.rotation.copy(object.rotation); outline.scale.copy(object.scale);
        drawing.add(outline);
      });
      const grid = new T.GridHelper(13, 26, '#b4a084', '#665747');
      grid.position.y = -.3;
      grid.material.transparent = true; grid.material.opacity = .16;
      scene.add(grid);
      const halo = new T.Mesh(new T.RingGeometry(.85, .88, 64), new T.MeshBasicMaterial({ color: '#ead2a3', transparent: true, opacity: .85, side: T.DoubleSide }));
      halo.rotation.x = -Math.PI / 2; halo.position.y = .03; sculpture.add(halo);
      scene.add(new T.AmbientLight('#ead9c0', .75));
      const sun = new T.DirectionalLight('#fff0d3', 2); sun.position.set(-3, 8, 6);
      sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024);
      Object.assign(sun.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8, near: .1, far: 30 });
      sun.shadow.normalBias = .025; sun.shadow.bias = -.0002; scene.add(sun);
      const rim = new T.DirectionalLight('#b88b50', 1.2); rim.position.set(5, 3, -4); scene.add(rim);
      element!.appendChild(renderer.domElement);
      const materials = new Set<Material>();
      solid.traverse((object) => {
        if (object instanceof T.Mesh) (Array.isArray(object.material) ? object.material : [object.material]).forEach((m) => materials.add(m));
      });
      const ray = new T.Raycaster();
      const pointer = new T.Vector2();
      let drag: { x: number; yaw: number; moved: boolean } | null = null;
      const down = (e: PointerEvent) => { drag = { x: e.clientX, yaw: control.current.yaw, moved: false }; };
      const move = (e: PointerEvent) => {
        if (!drag) return;
        const dx = e.clientX - drag.x;
        if (Math.abs(dx) > 6) { drag.moved = true; element!.setPointerCapture(e.pointerId); }
        control.current.yaw = Math.max(-.8, Math.min(.8, drag.yaw + dx * .004));
      };
      const up = (e: PointerEvent) => {
        if (drag && !drag.moved) {
          const bounds = element!.getBoundingClientRect();
          pointer.set((e.clientX - bounds.left) / bounds.width * 2 - 1, -(e.clientY - bounds.top) / bounds.height * 2 + 1);
          ray.setFromCamera(pointer, camera);
          const hit = ray.intersectObjects(solid.children).find((entry) => entry.object.userData.zone);
          if (hit) select.current(hit.object.userData.zone);
        }
        drag = null;
        if (element!.hasPointerCapture(e.pointerId)) element!.releasePointerCapture(e.pointerId);
      };
      const cancel = () => { drag = null; };
      const key = (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); control.current.yaw = Math.max(-.8, Math.min(.8, control.current.yaw + (e.key === 'ArrowLeft' ? -.12 : .12))); }
        if (e.key === 'Home') { e.preventDefault(); control.current.yaw = -.15; }
      };
      element!.addEventListener('pointerdown', down); element!.addEventListener('pointermove', move);
      element!.addEventListener('pointerup', up); element!.addEventListener('pointercancel', cancel); element!.addEventListener('keydown', key);
      const resize = () => {
        const { width, height } = element!.getBoundingClientRect();
        const aspect = width / Math.max(height, 1);
        const size = Math.max(5.5, 6.7 / aspect);
        camera.left = -size * aspect; camera.right = size * aspect; camera.top = size; camera.bottom = -size;
        camera.updateProjectionMatrix(); renderer.setSize(width, height);
        needsRender = true;
      };
      const observer = new ResizeObserver(resize); observer.observe(element!); resize();
      let visible = true;
      const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }); intersection.observe(element!);
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
      let frame = 0, blend = 0;
      const places = { display: [.25, -.05], lounge: [-2, 2.2], arrival: [.3, 3.4] };
      function render() {
        frame = requestAnimationFrame(render);
        if (!visible || document.hidden) return;
        const place = places[control.current.zone];
        const moving = Math.abs(blend - (control.current.blueprint ? 1 : 0)) > .001
          || Math.abs(sculpture.rotation.y - control.current.yaw) > .001
          || Math.abs(halo.position.x - place[0]) > .001 || Math.abs(halo.position.z - place[1]) > .001;
        if (!needsRender && !moving) return;
        const factor = reduced.matches ? 1 : .08;
        blend += ((control.current.blueprint ? 1 : 0) - blend) * factor;
        sculpture.rotation.y += (control.current.yaw - sculpture.rotation.y) * factor;
        camera.position.set(10 * (1 - blend), 10 + 6 * blend, 12 * (1 - blend) + .01);
        camera.lookAt(0, .4, 0);
        materials.forEach((material) => {
          const transparent = material === glass || blend > .005;
          if (material.transparent !== transparent) { material.transparent = transparent; material.needsUpdate = true; }
          material.opacity = (material === glass ? .2 : 1) * (1 - blend);
        });
        solid.visible = blend < .995; drawing.visible = blend > .005; lines.opacity = blend * .85;
        halo.position.x += (place[0] - halo.position.x) * factor;
        halo.position.z += (place[1] - halo.position.z) * factor;
        renderer.render(scene, camera);
        needsRender = false;
      }
      cleanup = () => {
        cancelAnimationFrame(frame); observer.disconnect(); intersection.disconnect();
        element!.removeEventListener('pointerdown', down); element!.removeEventListener('pointermove', move);
        element!.removeEventListener('pointerup', up); element!.removeEventListener('pointercancel', cancel); element!.removeEventListener('keydown', key);
        scene.traverse((object) => {
          if (object instanceof T.Mesh || object instanceof T.LineSegments) {
            object.geometry.dispose();
            (Array.isArray(object.material) ? object.material : [object.material]).forEach((m) => m.dispose());
          }
        });
        stoneTexture.dispose(); sun.shadow.dispose(); environment.dispose(); renderer.dispose(); renderer.domElement.remove();
      };
      if (stopped) { cleanup(); return; }
      frame = requestAnimationFrame(render); setReady(true);
    }
    build().catch(() => { cleanup(); });
    return () => { stopped = true; cleanup(); };
  }, []);

  return <div className={`boutiqueScene${ready ? ' is-ready' : ''}`} ref={host} tabIndex={0}
    role="group" aria-label="Interactive boutique model. Drag or use left and right arrow keys to rotate. Press Home to reset.">
    <img className="boutiqueScene-fallback" src="/oreva-boutique-reference.png" alt="Architectural plan and a warm bronze boutique interior" />
  </div>;
}
