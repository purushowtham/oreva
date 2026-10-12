'use client';

import { useEffect, useRef, useState } from 'react';

/** A real extruded mesh built from public/logo/logo.svg. */
export default function LogoSculpture() {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let disposed = false;
    let disposeScene = () => {};
    const controller = new AbortController();

    async function init() {
      const [THREE, { RoomEnvironment }, { GLTFLoader }, data] = await Promise.all([
        import('three'),
        import('three/examples/jsm/environments/RoomEnvironment.js'),
        import('three/examples/jsm/loaders/GLTFLoader.js'),
        fetch('/models/oreva-monogram.glb', { signal: controller.signal }).then((response) => {
          if (!response.ok) throw new Error('Logo model unavailable');
          return response.arrayBuffer();
        }),
      ]);
      const { scene: model } = await new GLTFLoader().parseAsync(data, '');
      if (disposed) return;
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setClearColor(0x000000, 0);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      const scene = new THREE.Scene();
      const environment = new RoomEnvironment();
      const pmrem = new THREE.PMREMGenerator(renderer);
      const environmentMap = pmrem.fromScene(environment, .04);
      scene.environment = environmentMap.texture;
      scene.environmentIntensity = .65;
      environment.dispose();
      pmrem.dispose();
      const camera = new THREE.PerspectiveCamera(38, 1, .1, 30);
      camera.position.z = 6.7;
      scene.add(model);
      const key = new THREE.DirectionalLight('#f3e4c5', 1.2);
      key.position.set(-3, 4, 5);
      const rim = new THREE.DirectionalLight('#e8d3aa', 2);
      rim.position.set(4, 1, -2);
      scene.add(key, rim);
      element!.appendChild(renderer.domElement);
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
      const pointer = { x: 0, y: 0 };
      let visible = true, frame = 0, last = 0, time = 0;
      const resize = () => {
        const { width, height } = element!.getBoundingClientRect();
        renderer.setSize(width, height);
        camera.aspect = width / Math.max(height, 1);
        camera.updateProjectionMatrix();
      };
      const observer = new ResizeObserver(resize);
      observer.observe(element!);
      const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
      intersection.observe(element!);
      const move = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') return;
        pointer.x = (event.clientX / window.innerWidth - .5) * .35;
        pointer.y = (event.clientY / window.innerHeight - .5) * .18;
      };
      const leave = () => { pointer.x = 0; pointer.y = 0; };
      window.addEventListener('pointermove', move, { passive: true });
      document.addEventListener('pointerleave', leave);
      resize();
      function render(now: number) {
        frame = requestAnimationFrame(render);
        const delta = Math.min((now - last) / 1000, .05);
        last = now;
        if (!visible || document.hidden) return;
        if (!reduced.matches) time += delta;
        const targetY = reduced.matches ? -.25 : -.35 + Math.sin(time * .24) * .75 + pointer.x;
        model.rotation.y += (targetY - model.rotation.y) * .05;
        model.rotation.x = reduced.matches ? .04 : .08 + Math.sin(time * .19) * .08 + pointer.y;
        model.rotation.z = -.08;
        model.position.y = reduced.matches ? 0 : Math.sin(time * .6) * .065;
        renderer.render(scene, camera);
      }
      frame = requestAnimationFrame(render);
      setReady(true);
      disposeScene = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        intersection.disconnect();
        window.removeEventListener('pointermove', move);
        document.removeEventListener('pointerleave', leave);
        model.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            const materials = Array.isArray(object.material) ? object.material : [object.material];
            materials.forEach((material) => material.dispose());
          }
        });
        environmentMap.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    }
    init().catch(() => { /* Original SVG remains visible if WebGL is unavailable. */ });
    return () => { disposed = true; controller.abort(); disposeScene(); };
  }, []);

  return <div className="homeHero-model" ref={host} aria-hidden="true">
    <img className={`homeHero-modelFallback${ready ? ' is-ready' : ''}`} src="/logo/logo.svg" alt="" />
  </div>;
}
