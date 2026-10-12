// Extrude the original brand outline; no replacement or redrawn logo paths.
import { readFile, writeFile } from 'node:fs/promises';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

const svg = await readFile(new URL('../public/logo/logo.svg', import.meta.url), 'utf8');
const paths = [...svg.matchAll(/<path\b([^>]*)>/g)].map((match) => {
  const attrs = Object.fromEntries([...match[1].matchAll(/([\w-]+)="([^"]*)"/g)].map((a) => [a[1], a[2]]));
  attrs.fill = '#8e7657';
  return { nodeType: 1, nodeName: 'path', childNodes: [], hasAttribute: (k) => k in attrs, getAttribute: (k) => attrs[k] ?? null };
});
// SVGLoader only needs the source path nodes for this asset, with no DOM dependency.
globalThis.DOMParser = class {
  parseFromString() {
    return { querySelectorAll: () => [], documentElement: { nodeType: 1, nodeName: 'svg', childNodes: paths, hasAttribute: () => false, getAttribute: () => null } };
  }
};
const parsed = new SVGLoader().parse(svg);
const model = new THREE.Group();
model.name = 'OREVA — extruded original monogram';
const material = new THREE.MeshStandardMaterial({ color: '#8b7351', metalness: .78, roughness: .3 });
// Remove redundant near-collinear outline points within half a source SVG unit.
function simplify(points) {
  if (points.length <= 2) return points;
  const a = points[0], b = points.at(-1);
  let distance = 0, index = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const p = points[i];
    const t = Math.max(0, Math.min(1, ((p.x-a.x)*(b.x-a.x)+(p.y-a.y)*(b.y-a.y)) / (a.distanceToSquared(b) || 1)));
    const d = Math.hypot(p.x-a.x-t*(b.x-a.x), p.y-a.y-t*(b.y-a.y));
    if (d > distance) { distance = d; index = i; }
  }
  if (distance <= .45) return [a,b];
  return [...simplify(points.slice(0,index+1)).slice(0,-1), ...simplify(points.slice(index))];
}
for (const path of parsed.paths) {
  for (const shape of path.toShapes()) {
    const outline = new THREE.Shape(simplify(shape.getPoints(3)));
    outline.holes = shape.holes.map((hole) => new THREE.Path(simplify(hole.getPoints(3))));
    const geometry = new THREE.ExtrudeGeometry(outline, { depth: 42, bevelEnabled: true, bevelThickness: 2, bevelSize: 1.2, bevelSegments: 2, curveSegments: 3, steps: 1 });
    geometry.scale(1, -1, 1);
    // Mirroring SVG's downward Y axis also reverses triangle winding.
    // Keep the front faces consistent with the transformed surface normals.
    const indices = Array.from({ length: geometry.attributes.position.count }, (_, i) => i);
    for (let i = 0; i < indices.length; i += 3) {
      [indices[i + 1], indices[i + 2]] = [indices[i + 2], indices[i + 1]];
    }
    geometry.setIndex(indices);
    model.add(new THREE.Mesh(geometry, material));
  }
}
const bounds = new THREE.Box3().setFromObject(model);
const center = bounds.getCenter(new THREE.Vector3());
const scale = 4 / bounds.getSize(new THREE.Vector3()).y;
for (const mesh of model.children) {
  mesh.geometry.translate(-center.x, -center.y, -center.z);
  mesh.geometry.scale(scale, scale, scale);
}
// Node's Blob supplies the binary buffer used by Three's standard glTF exporter.
globalThis.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buffer) => { this.result = buffer; this.onloadend?.(); });
  }
};
const binary = await new GLTFExporter().parseAsync(model, { binary: true });
await writeFile(new URL('../public/models/oreva-monogram.glb', import.meta.url), Buffer.from(binary));
console.log(`Generated original ORÉVA model: ${model.children.length} meshes.`);
