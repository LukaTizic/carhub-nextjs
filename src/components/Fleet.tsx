'use client';
// The fleet: search, filters and sorting, all in the browser (thirty cars need no server).
import { useEffect, useMemo, useState } from 'react';
import { bodies, cars, fuels, type Body, type Fuel } from '@/data/cars';
import { useSaved } from '@/lib/saved';
import { fleet as F } from '@/data/site';
import { CarCard } from './CarCard';

type Sort = keyof typeof F.sorts;

export function Fleet() {
  const saved = useSaved();
  const [q, setQ] = useState('');
  const [body, setBody] = useState<Body | 'all'>('all');
  const [fuel, setFuel] = useState<Fuel | 'all'>('all');
  const [gear, setGear] = useState<'all' | 'manual' | 'automatic'>('all');
  const [seats, setSeats] = useState(0);
  const [sort, setSort] = useState<Sort>('price');
  const [onlySaved, setOnlySaved] = useState(false);

  // "Saved" in the header links here with ?saved=1.
  useEffect(() => {
    const read = () => setOnlySaved(new URLSearchParams(location.search).get('saved') === '1');
    read();
    addEventListener('popstate', read);
    return () => removeEventListener('popstate', read);
  }, []);

  const list = useMemo(() => {
    const t = q.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const r = cars.filter((c) =>
      (!t || `${c.make} ${c.model}`.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').includes(t))
      && (body === 'all' || c.body === body) && (fuel === 'all' || c.fuel === fuel)
      && (gear === 'all' || c.gearbox === gear) && c.seats >= seats && (!onlySaved || saved.includes(c.slug)));
    const by: Record<Sort, (a: typeof cars[0], b: typeof cars[0]) => number> = {
      price: (a, b) => a.price - b.price, priceDesc: (a, b) => b.price - a.price,
      size: (a, b) => a.length - b.length, power: (a, b) => b.power - a.power,
    };
    return [...r].sort(by[sort]);
  }, [q, body, fuel, gear, seats, sort, onlySaved, saved]);

  const reset = () => { setQ(''); setBody('all'); setFuel('all'); setGear('all'); setSeats(0); setOnlySaved(false); };

  return (
    <section className="fleet" id="fleet" aria-labelledby="fleet-title">
      <div className="fleet__head">
        <h2 id="fleet-title" className="fleet__title">{F.title}</h2>
        <p className="fleet__count" aria-live="polite">{F.count(list.length)}</p>
      </div>

      <div className="filters">
        <label className="field field--search">
          <span className="sr-only">{F.search}</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={F.search} />
        </label>
        <div className="chips" role="group" aria-label="Body type">
          <button type="button" className="chip" aria-pressed={body === 'all'} onClick={() => setBody('all')}>{F.all}</button>
          {bodies.map((b) => (
            <button key={b.id} type="button" className="chip" aria-pressed={body === b.id} onClick={() => setBody(body === b.id ? 'all' : b.id)}>{b.label}</button>
          ))}
        </div>
        <div className="selects">
          <label className="field"><span>{F.fuel}</span>
            <select value={fuel} onChange={(e) => setFuel(e.target.value as Fuel | 'all')}>
              <option value="all">Any</option>
              {fuels.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
            </select>
          </label>
          <label className="field"><span>{F.gearbox}</span>
            <select value={gear} onChange={(e) => setGear(e.target.value as typeof gear)}>
              <option value="all">Any</option><option value="automatic">Automatic</option><option value="manual">Manual</option>
            </select>
          </label>
          <label className="field"><span>{F.seats}</span>
            <select value={seats} onChange={(e) => setSeats(+e.target.value)}>
              <option value={0}>Any</option><option value={4}>4 or more</option><option value={5}>5 or more</option><option value={7}>7 or more</option>
            </select>
          </label>
          <label className="field"><span>{F.sort}</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
              {(Object.keys(F.sorts) as Sort[]).map((k) => <option key={k} value={k}>{F.sorts[k]}</option>)}
            </select>
          </label>
          <label className="check"><input type="checkbox" checked={onlySaved} onChange={(e) => setOnlySaved(e.target.checked)} /> {F.saved}{saved.length ? ` (${saved.length})` : ''}</label>
        </div>
      </div>

      {list.length ? (
        <div className="grid">{list.map((c) => <CarCard key={c.slug} car={c} />)}</div>
      ) : (
        <div className="empty"><p>{F.none}</p><button type="button" className="btn btn--ghost" onClick={reset}>{F.reset}</button></div>
      )}
    </section>
  );
}
