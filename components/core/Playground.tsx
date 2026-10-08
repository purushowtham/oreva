'use client';

import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import './Playground.css';

type Position = { x: number; y: number };
type Piece = Position & { className: string; label: string };

const pieces: Record<string, Piece> = {
  arch: { className: 'o-arch', label: 'Arch', x: 12, y: 30 },
  disc: { className: 'o-disc', label: 'Disc', x: 46, y: 12 },
  plinth: { className: 'o-plinth', label: 'Plinth', x: 62, y: 48 },
  velvet: { className: 'o-velvet', label: 'Velvet', x: 36, y: 58 },
  glass: { className: 'o-glass', label: 'Glass', x: 80, y: 14 },
};
const ids = Object.keys(pieces);

const clamp = (value: number, max: number) => Math.min(max, Math.max(0, value));
const initialPositions = () => Object.fromEntries(ids.map(id => [id, { x: pieces[id].x, y: pieces[id].y }]));

export default function Playground() {
  const stage = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: string; pointerId: number; sx: number; sy: number; ox: number; oy: number } | null>(null);
  const top = useRef(1);
  const [positions, setPositions] = useState<Record<string, Position>>(initialPositions);
  const [layers, setLayers] = useState<Record<string, number>>({});
  const [ease, setEase] = useState(false);

  const bringToFront = (id: string) => setLayers(previous => ({ ...previous, [id]: ++top.current }));

  const onPointerDown = (id: string) => (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setEase(false);
    drag.current = {
      id, pointerId: event.pointerId,
      sx: event.clientX, sy: event.clientY,
      ox: positions[id].x, oy: positions[id].y,
    };
    bringToFront(id);
  };

  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const active = drag.current;
    const bounds = stage.current?.getBoundingClientRect();
    if (!active || active.pointerId !== event.pointerId || !bounds) return;
    const x = clamp(active.ox + ((event.clientX - active.sx) / bounds.width) * 100, 82);
    const y = clamp(active.oy + ((event.clientY - active.sy) / bounds.height) * 100, 72);
    setPositions(previous => ({ ...previous, [active.id]: { x, y } }));
  };

  const endDrag = (event: PointerEvent<HTMLButtonElement>) => {
    if (drag.current?.pointerId === event.pointerId) drag.current = null;
  };

  const onKeyDown = (id: string) => (event: KeyboardEvent<HTMLButtonElement>) => {
    const step: Record<string, Position> = {
      ArrowLeft: { x: -2, y: 0 }, ArrowRight: { x: 2, y: 0 },
      ArrowUp: { x: 0, y: -2 }, ArrowDown: { x: 0, y: 2 },
    };
    if (!step[event.key]) return;
    event.preventDefault();
    setEase(false);
    bringToFront(id);
    setPositions(previous => ({
      ...previous,
      [id]: {
        x: clamp(previous[id].x + step[event.key].x, 82),
        y: clamp(previous[id].y + step[event.key].y, 72),
      },
    }));
  };

  const place = (getPosition: (id: string) => Position) => {
    drag.current = null;
    setEase(true);
    setPositions(Object.fromEntries(ids.map(id => [id, getPosition(id)])));
  };

  return (
    <section id="play" className="playground" aria-labelledby="playground-title">
      <div className="playground__heading">
        <div>
          <p className="playground__eyebrow">06 / THE PLAYGROUND</p>
          <h2 id="playground-title">Style the <i>window.</i></h2>
        </div>
        <p className="playground__hint">Drag the pieces. Build a composition that feels right.</p>
      </div>

      <div className="playground__stage" ref={stage} aria-label="Interactive styling window">
        <span className="playground__stageNote">ORÉVA / WINDOW NO. 01</span>
        <span className="playground__stageRule" aria-hidden="true" />
        {ids.map(id => (
          <button
            key={id}
            type="button"
            className={`playground__object ${pieces[id].className}${ease ? ' is-easing' : ''}`}
            style={{ left: `${positions[id].x}%`, top: `${positions[id].y}%`, zIndex: layers[id] || 1 }}
            aria-label={`Move ${pieces[id].label}. Drag or use arrow keys.`}
            onPointerDown={onPointerDown(id)}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onKeyDown={onKeyDown(id)}
          >
            <span className="playground__objectLabel" aria-hidden="true">{pieces[id].label}</span>
          </button>
        ))}
      </div>

      <div className="playground__actions">
        <span>01—05 / MOVE THE OBJECTS</span>
        <div>
          <button type="button" onClick={() => place(() => ({ x: Math.random() * 78, y: Math.random() * 66 }))}>Shuffle <span aria-hidden="true">↗</span></button>
          <button type="button" onClick={() => place(id => ({ x: pieces[id].x, y: pieces[id].y }))}>Reset <span aria-hidden="true">↺</span></button>
        </div>
      </div>
    </section>
  );
}
