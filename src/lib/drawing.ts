// Every car is drawn from its own measurements: length, wheelbase, height, tyre size and ground
// clearance, in millimetres. The body type gives the silhouette; the numbers give the proportions.
// Coordinates here are millimetres with y up from the ground and x back from the front bumper;
// the component flips y for SVG.
import type { Car } from '@/data/cars';

export type Pt = [number, number];
export type Drawing = {
  L: number; H: number;
  body: string; // silhouette path (SVG coordinates)
  windows: string; // glass
  pillars: string; // body-coloured pillars over the glass
  lines: string; // door shut lines and the beltline
  lamps: { head: string; tail: string };
  wheels: { cx: number; cy: number; r: number }[];
  arches: { cx: number; cy: number; r: number }[];
  sill: number; // y of the sill, SVG coordinates
  mirror: string;
  extra?: string; // a roadster's headrest
};

const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
// Where a straight segment a→b reaches height y.
const atY = (a: Pt, b: Pt, y: number): Pt => lerp(a, b, (y - a[1]) / (b[1] - a[1] || 1));

/** A smooth path through points (Catmull-Rom as cubic Béziers). `sharp` marks corners kept crisp. */
function smooth(pts: Pt[], sharp = new Set<number>(), k = 0.9) {
  const s = (p: Pt) => `${p[0].toFixed(1)},${(-p[1]).toFixed(1)}`;
  let d = `M${s(pts[0])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    if (sharp.has(i) && sharp.has(i + 1)) { d += ` L${s(p2)}`; continue; }
    const t1 = sharp.has(i) ? 0 : k, t2 = sharp.has(i + 1) ? 0 : k;
    const c1: Pt = [p1[0] + ((p2[0] - p0[0]) / 6) * t1, p1[1] + ((p2[1] - p0[1]) / 6) * t1];
    const c2: Pt = [p2[0] - ((p3[0] - p1[0]) / 6) * t2, p2[1] - ((p3[1] - p1[1]) / 6) * t2];
    d += ` C${s(c1)} ${s(c2)} ${s(p2)}`;
  }
  return d;
}
const poly = (pts: Pt[]) => `M${pts.map((p) => `${p[0].toFixed(1)},${(-p[1]).toFixed(1)}`).join(' L')} Z`;

export function draw(car: Car): Drawing {
  const L = car.length, W = car.wheelbase, H = car.height, r = car.wheel / 2;
  const over = L - W;
  const kf = car.body === 'coupe' && car.drive === 'RWD' && car.wheelbase < 2500 ? 0.36 : car.body === 'suv' || car.body === 'pickup' ? 0.47 : 0.53;
  const xF = over * kf, xR = xF + W, ro = L - xR;
  const sill = Math.max(car.clearance + 60, r * 0.62); // bottom edge of the body between the wheels
  const low = sill + 10; // bumper bottoms

  // The silhouette's top edge, front to rear, and the glass line (where the windscreen starts,
  // where the roof runs, where the rear glass ends), per body type.
  let top: Pt[]; let sharp: number[] = [];
  let ws0: Pt, ws1: Pt, rr0: Pt, rr1: Pt; // windscreen base→top, rear glass top→base
  let belt: number; let pillarsAt: number[] = []; let open = false;
  const y = (f: number) => f * H;

  switch (car.body) {
    case 'hatch': {
      belt = y(0.64);
      ws0 = [xF + 0.2 * W, y(0.63)]; ws1 = [xF + 0.5 * W, y(0.965)];
      rr0 = [xR + 0.42 * ro, y(0.955)]; rr1 = [L - 0.07 * ro, y(0.66)];
      top = [[0, low], [0, y(0.43)], [0.014 * L, y(0.53)], [xF + 0.05 * W, y(0.585)], ws0, ws1, [xF + 0.8 * W, y(1)], rr0, rr1, [L, y(0.52)], [L, low]];
      sharp = [0, 1, 9, 10];
      pillarsAt = car.doors > 3 ? [xF + 0.6 * W] : [];
      break;
    }
    case 'sedan': {
      belt = y(0.66);
      ws0 = [xF + 0.34 * W, y(0.64)]; ws1 = [xF + 0.62 * W, y(0.97)];
      rr0 = [xF + 0.98 * W, y(0.955)]; rr1 = [xR + 0.36 * ro, y(0.7)];
      top = [[0, low], [0, y(0.42)], [0.012 * L, y(0.52)], [xF + 0.04 * W, y(0.585)], ws0, ws1, [xF + 0.8 * W, y(1)], rr0, rr1, [L - 0.08 * ro, y(0.69)], [L, y(0.58)], [L, low]];
      sharp = [0, 1, 10, 11];
      pillarsAt = [xF + 0.66 * W];
      break;
    }
    case 'wagon': {
      belt = y(0.66);
      ws0 = [xF + 0.34 * W, y(0.64)]; ws1 = [xF + 0.62 * W, y(0.97)];
      rr0 = [xR + 0.55 * ro, y(0.94)]; rr1 = [L - 0.05 * ro, y(0.7)];
      top = [[0, low], [0, y(0.42)], [0.012 * L, y(0.52)], [xF + 0.04 * W, y(0.585)], ws0, ws1, [xF + 0.85 * W, y(1)], rr0, rr1, [L, y(0.58)], [L, low]];
      sharp = [0, 1, 9, 10];
      pillarsAt = [xF + 0.66 * W, xR + 0.1 * ro];
      break;
    }
    case 'suv': {
      const bx = car.boxy;
      belt = y(bx ? 0.64 : 0.67);
      ws0 = [xF + (bx ? 0.2 : 0.3) * W, y(bx ? 0.64 : 0.68)]; ws1 = [xF + (bx ? 0.3 : 0.53) * W, y(0.97)];
      rr0 = [L - (bx ? 0.08 : 0.2) * ro, y(bx ? 0.985 : 0.95)]; rr1 = [L - (bx ? 0.02 : 0.06) * ro, y(bx ? 0.66 : 0.72)];
      top = bx
        ? [[0, low], [0, y(0.5)], [0.006 * L, y(0.6)], [xF - 0.05 * W, y(0.62)], ws0, ws1, [xF + 0.6 * W, y(1)], rr0, rr1, [L, y(0.6)], [L, low]]
        : [[0, low], [0, y(0.47)], [0.014 * L, y(0.6)], [xF + 0.04 * W, y(0.655)], ws0, ws1, [xF + 0.8 * W, y(1)], rr0, rr1, [L, y(0.6)], [L, low]];
      sharp = bx ? [0, 1, 4, 5, 7, 8, 9, 10] : [0, 1, 9, 10];
      pillarsAt = [xF + (bx ? 0.5 : 0.6) * W, xR + 0.05 * ro];
      break;
    }
    case 'coupe': {
      belt = y(0.63);
      const fastback = car.wheelbase < 2500;
      ws0 = [xF + 0.4 * W, y(0.6)]; ws1 = [xF + 0.68 * W, y(0.965)];
      rr0 = [xF + (fastback ? 0.86 : 0.93) * W, y(fastback ? 0.97 : 0.95)]; rr1 = [xR + (fastback ? 0.45 : 0.4) * ro, y(fastback ? 0.68 : 0.67)];
      top = [[0, low], [0, y(0.39)], [0.014 * L, y(0.48)], [xF + 0.1 * W, y(0.555)], ws0, ws1, [xF + 0.78 * W, y(1)], rr0, rr1, [L - 0.06 * ro, y(0.63)], [L, y(0.55)], [L, low]];
      sharp = [0, 1, 10, 11];
      pillarsAt = car.doors > 2 ? [xF + 0.72 * W] : [];
      break;
    }
    case 'roadster': {
      open = true;
      belt = y(0.74);
      ws0 = [xF + 0.4 * W, y(0.74)]; ws1 = [xF + 0.55 * W, y(1)];
      rr0 = [xF + 0.62 * W, y(1)]; rr1 = [xF + 0.62 * W, y(0.74)];
      top = [[0, low], [0, y(0.43)], [0.016 * L, y(0.55)], [xF + 0.1 * W, y(0.64)], [xF + 0.38 * W, y(0.72)], [xF + 0.62 * W, y(0.75)], [xR, y(0.76)], [L - 0.15 * ro, y(0.74)], [L, y(0.6)], [L, low]];
      sharp = [0, 1, 8, 9];
      break;
    }
    case 'pickup': {
      belt = y(0.66);
      const cab = xF + 0.74 * W; // back of the crew cab
      ws0 = [xF + 0.2 * W, y(0.69)]; ws1 = [xF + 0.4 * W, y(0.975)];
      rr0 = [cab - 0.02 * W, y(0.975)]; rr1 = [cab, y(0.69)];
      top = [[0, low], [0, y(0.46)], [0.008 * L, y(0.6)], [xF + 0.03 * W, y(0.65)], ws0, ws1, [xF + 0.55 * W, y(1)], rr0, [cab, y(0.95)], [cab + 0.02 * W, y(0.68)], [L - 20, y(0.68)], [L, y(0.6)], [L, low]];
      sharp = [0, 1, 7, 8, 9, 10, 11, 12];
      pillarsAt = [xF + 0.5 * W];
      break;
    }
    case 'van':
    default: {
      belt = y(0.6);
      ws0 = [xF + 0.08 * W, y(0.6)]; ws1 = [xF + 0.36 * W, y(0.975)];
      rr0 = [L - 0.02 * ro, y(0.97)]; rr1 = [L - 0.01 * ro, y(0.62)];
      top = [[0, low], [0, y(0.4)], [0.014 * L, y(0.51)], [0.08 * L, y(0.57)], ws0, ws1, [xF + 0.6 * W, y(1)], rr0, rr1, [L, y(0.56)], [L, low]];
      sharp = [0, 1, 7, 8, 9, 10];
      pillarsAt = [xF + 0.42 * W, xF + 0.8 * W];
      break;
    }
  }

  // The silhouette: the top edge, then back along the sill.
  const body = `${smooth(top, new Set(sharp))} L${(L * 0.985).toFixed(1)},${(-sill).toFixed(1)} L${(L * 0.015).toFixed(1)},${(-sill).toFixed(1)} Z`;

  // Glass: from the beltline up the windscreen, along under the roof, down the rear glass.
  const inset = 0.035 * H;
  const wA = atY(ws0, ws1, belt + inset);
  const wB: Pt = [ws1[0] + 0.03 * W, ws1[1] - inset];
  const wC: Pt = [rr0[0] - 0.03 * W, rr0[1] - inset];
  const wD = atY(rr0, rr1, belt + inset);
  const windows = open
    ? poly([atY(ws0, ws1, belt + inset * 0.3), [ws1[0] - 20, ws1[1] - inset * 0.4], [ws1[0] + 40, ws1[1] - inset * 0.4], [ws1[0] + 70, belt + inset * 0.3]])
    : poly([[wA[0] + 40, belt + inset], wA, wB, wC, wD, [wD[0] - 40, belt + inset]]);

  // Shut lines: the front of the front door, any pillars, and the back of the last door.
  const doorTop = belt + inset * 0.5, doorBottom = sill + 60;
  const frontDoor = ws0[0] + 0.03 * W;
  const lastDoor = car.body === 'pickup' ? rr1[0] - 30 : car.doors <= 3 ? Math.min(xR - 0.28 * W, frontDoor + 0.55 * W) : xR - r * 1.25;
  const cuts = [frontDoor, ...pillarsAt.filter((p) => p < lastDoor - 100), lastDoor];
  const lines = cuts.map((x) => `M${x.toFixed(1)},${(-doorTop).toFixed(1)} L${(x + 10).toFixed(1)},${(-doorBottom).toFixed(1)}`).join(' ')
    + ` M${(L * 0.03).toFixed(1)},${(-(belt - 0.12 * H)).toFixed(1)} L${(L * 0.97).toFixed(1)},${(-(belt - 0.12 * H)).toFixed(1)}`;
  const pillars = open ? '' : pillarsAt.filter((p) => p > wA[0] + 100 && p < wD[0] - 100).map((p) => {
    const w = car.boxy ? 70 : 60;
    return `M${(p - w / 2).toFixed(1)},${(-(belt + inset)).toFixed(1)} L${(p - w / 2 + 25).toFixed(1)},${(-(H - inset * 1.2)).toFixed(1)} L${(p + w / 2 + 25).toFixed(1)},${(-(H - inset * 1.2)).toFixed(1)} L${(p + w / 2).toFixed(1)},${(-(belt + inset)).toFixed(1)} Z`;
  }).join(' ');

  // Lamps.
  const hy = car.body === 'suv' || car.body === 'pickup' || car.body === 'van' ? 0.58 : 0.5;
  const head = poly([[6, y(hy - 0.06)], [6, y(hy + 0.02)], [0.07 * L, y(hy + 0.035)], [0.075 * L, y(hy - 0.02)]]);
  const ty = car.body === 'van' || car.body === 'suv' ? 0.62 : car.body === 'pickup' ? 0.55 : 0.6;
  const tail = poly([[L - 4, y(ty - 0.07)], [L - 4, y(ty + 0.03)], [L - 0.05 * L, y(ty + 0.03)], [L - 0.045 * L, y(ty - 0.05)]]);

  // Door mirror at the base of the windscreen.
  const m = atY(ws0, ws1, belt + inset * 1.2);
  const mirror = poly([[m[0] - 10, m[1]], [m[0] + 130, m[1] - 20], [m[0] + 140, m[1] - 90], [m[0] + 20, m[1] - 80]]);

  const wheels = [{ cx: xF, cy: -r, r }, { cx: xR, cy: -r, r }];
  const arches = wheels.map((w) => ({ cx: w.cx, cy: w.cy - 0.03 * r, r: r * 1.13 }));
  const extra = open ? poly([[xF + 0.66 * W, y(0.74)], [xF + 0.67 * W, y(0.93)], [xF + 0.74 * W, y(0.94)], [xF + 0.75 * W, y(0.74)]]) : undefined;
  return { extra, L, H, body, windows, pillars, lines, lamps: { head, tail }, wheels, arches, sill: -sill, mirror };
}

// ---- SVG ----------------------------------------------------------------------------------------

function shade(hex: string, k: number) {
  const n = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const t = k < 0 ? 0 : 255;
  const f = Math.abs(k);
  return `#${n.map((v) => Math.round(v + (t - v) * f).toString(16).padStart(2, '0')).join('')}`;
}

export type SvgOpts = { id: string; pad?: number; dims?: boolean; title?: string; wheels?: boolean };

/** The viewBox around a drawing: the car plus padding, and room for dimension lines if asked. */
export function frame(d: Drawing, o: Pick<SvgOpts, 'pad' | 'dims'>) {
  const pad = o.pad ?? 80;
  const extraTop = o.dims ? 420 : 0, extraBottom = o.dims ? 420 : 0, extraSide = o.dims ? 260 : 0;
  return [-pad - extraSide, -d.H - pad - extraTop, d.L + 2 * pad + 2 * extraSide, d.H + 2 * pad + extraTop + extraBottom];
}

const INK = '#151515';
const sw = 'vector-effect="non-scaling-stroke"';

/** One wheel centred on 0,0: tyre, rim, five spokes, hub. */
function wheelParts(r: number) {
  const spokes = Array.from({ length: 5 }, (_, k) => {
    const a = (k / 5) * Math.PI * 2;
    return `<line x1="0" y1="0" x2="${(Math.cos(a) * r * 0.56).toFixed(1)}" y2="${(Math.sin(a) * r * 0.56).toFixed(1)}" />`;
  }).join('');
  return `<circle r="${r.toFixed(1)}" fill="#1b1b1c" />`
    + `<circle r="${(r * 0.82).toFixed(1)}" fill="none" stroke="#2f2f31" stroke-width="${(r * 0.05).toFixed(1)}" />`
    + `<circle r="${(r * 0.6).toFixed(1)}" fill="#cfd2d4" stroke="${INK}" stroke-width="1.2" ${sw} />`
    + `<g stroke="#8d9194" stroke-width="${(r * 0.09).toFixed(1)}" stroke-linecap="round">${spokes}</g>`
    + `<circle r="${(r * 0.13).toFixed(1)}" fill="#55595c" />`;
}

/** A wheel as its own small SVG, for wheels laid over the car as separate (composited) elements. */
export function wheelSvg(r: number) {
  return `<svg viewBox="${(-r).toFixed(1)} ${(-r).toFixed(1)} ${(2 * r).toFixed(1)} ${(2 * r).toFixed(1)}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${wheelParts(r)}</svg>`;
}

/** The car as an SVG string, in millimetres (the viewBox), so every car shares one scale. */
export function carSvg(car: Car, o: SvgOpts) {
  const d = draw(car);
  const { L, H } = d;
  const ink = INK;
  const paint = car.paint;
  const dark = shade(paint, -0.28), light = shade(paint, 0.35);
  const vb = frame(d, o);
  const cid = `clip-${o.id}`;
  const wheel = (w: { cx: number; cy: number; r: number }, i: number) =>
    `<g class="car__wheel" transform="translate(${w.cx.toFixed(1)} ${w.cy.toFixed(1)})"><g class="car__spin car__spin--${i}">${wheelParts(w.r)}</g></g>`;
  const dims = o.dims ? dimLines(car, d) : '';
  return `<svg class="car" viewBox="${vb.map((v) => v.toFixed(0)).join(' ')}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${o.title ?? `${car.make} ${car.model}, side view drawn to scale`}">`
    + `<defs><clipPath id="${cid}"><path d="${d.body}" /></clipPath></defs>`
    + `<ellipse cx="${(L / 2).toFixed(0)}" cy="6" rx="${(L * 0.52).toFixed(0)}" ry="${(L * 0.012).toFixed(0)}" fill="rgba(20,20,20,0.16)" />`
    + `<path d="${d.body}" fill="${paint}" />`
    + `<g clip-path="url(#${cid})">`
    + `<rect x="0" y="${(-(H * 0.33)).toFixed(0)}" width="${L}" height="${(H * 0.33).toFixed(0)}" fill="${dark}" opacity="0.55" />`
    + `<rect x="0" y="${(-(H * 0.6)).toFixed(0)}" width="${L}" height="${(H * 0.045).toFixed(0)}" fill="${light}" opacity="0.55" />`
    + d.arches.map((a) => `<circle cx="${a.cx.toFixed(0)}" cy="${a.cy.toFixed(0)}" r="${a.r.toFixed(0)}" fill="#202022" />`).join('')
    + `<path d="${d.lamps.head}" fill="#fff6d8" stroke="${ink}" stroke-width="1" ${sw} />`
    + `<path d="${d.lamps.tail}" fill="#d1352b" stroke="${ink}" stroke-width="1" ${sw} />`
    + `</g>`
    + `<path d="${d.windows}" fill="#26303b" stroke="${ink}" stroke-width="1.2" ${sw} />`
    + (d.pillars ? `<path d="${d.pillars}" fill="${paint}" stroke="${ink}" stroke-width="1" ${sw} />` : '')
    + `<path d="${d.lines}" fill="none" stroke="rgba(0,0,0,0.38)" stroke-width="1" ${sw} />`
    + (d.extra ? `<path d="${d.extra}" fill="#26303b" stroke="${ink}" stroke-width="1" ${sw} />` : '')
    + `<path d="${d.mirror}" fill="${paint}" stroke="${ink}" stroke-width="1" ${sw} />`
    + `<path d="${d.body}" fill="none" stroke="${ink}" stroke-width="1.6" stroke-linejoin="round" ${sw} />`
    + (o.wheels === false ? '' : d.wheels.map(wheel).join(''))
    + dims
    + `</svg>`;
}

/** Brochure-style dimension lines: overall length, wheelbase and height, in millimetres. */
function dimLines(car: Car, d: Drawing) {
  const { L, H } = d;
  const [f, r] = d.wheels;
  const fmt = (n: number) => `${n.toLocaleString('en-GB')} mm`;
  const t = 'class="car__dim"';
  const arrow = (x1: number, y1: number, x2: number, y2: number, label: string, lx: number, ly: number, vertical = false) =>
    `<g ${t}><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" /><line x1="${x1 - (vertical ? 60 : 0)}" y1="${y1 - (vertical ? 0 : 60)}" x2="${x1 + (vertical ? 60 : 0)}" y2="${y1 + (vertical ? 0 : 60)}" /><line x1="${x2 - (vertical ? 60 : 0)}" y1="${y2 - (vertical ? 0 : 60)}" x2="${x2 + (vertical ? 60 : 0)}" y2="${y2 + (vertical ? 0 : 60)}" />`
    + `<text x="${lx}" y="${ly}" ${vertical ? `transform="rotate(-90 ${lx} ${ly})"` : ''} text-anchor="middle">${label}</text></g>`;
  return arrow(0, 260, L, 260, fmt(L), L / 2, 380)
    + arrow(f.cx, -H - 220, r.cx, -H - 220, `wheelbase ${fmt(car.wheelbase)}`, (f.cx + r.cx) / 2, -H - 270)
    + arrow(L + 180, 0, L + 180, -H, fmt(H), L + 300, -H / 2, true);
}
