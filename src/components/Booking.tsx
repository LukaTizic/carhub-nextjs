'use client';
// Price your dates: days times the day rate, plus extras. A demo: "Reserve" books nothing.
import { useState, useSyncExternalStore } from 'react';
import type { Car } from '@/data/cars';
import { booking as B } from '@/data/site';
import { euro } from '@/lib/format';

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const noop = () => () => {};

export function Booking({ car }: { car: Car }) {
  // Today comes from the browser, so the page can be built ahead of time: empty on the server,
  // tomorrow to three days later once it hydrates, until the visitor picks their own dates.
  const today = useSyncExternalStore(noop, () => iso(new Date()), () => '');
  const [picked, setPicked] = useState<{ from?: string; to?: string }>({});
  const from = picked.from ?? (today ? iso(addDays(new Date(`${today}T12:00`), 1)) : '');
  const to = picked.to ?? (today ? iso(addDays(new Date(`${today}T12:00`), 4)) : '');
  const setFrom = (v: string) => setPicked((p) => ({ ...p, from: v }));
  const setTo = (v: string) => setPicked((p) => ({ ...p, to: v }));
  const [extras, setExtras] = useState<Record<string, boolean>>({ cover: true });
  const [done, setDone] = useState(false);

  const days = from && to ? Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86400000) : 0;
  const ok = days >= 1;
  const extrasPerDay = B.options.reduce((s, o) => s + (extras[o.id] ? o.perDay : 0), 0);
  const total = ok ? days * (car.price + extrasPerDay) : 0;
  const deposit = Math.max(200, Math.round((car.price * 6) / 50) * 50);

  if (done) {
    return (
      <div className="book book--done" role="status">
        <h2 className="book__title">{B.doneTitle}</h2>
        <p>{car.make} {car.model}, {B.days(days)}, {euro(total)}.</p>
        <p className="muted">{B.done}</p>
        <button type="button" className="btn btn--ghost" onClick={() => setDone(false)}>{B.again}</button>
      </div>
    );
  }
  return (
    <form className="book" onSubmit={(e) => { e.preventDefault(); if (ok) setDone(true); }}>
      <h2 className="book__title">{B.title}</h2>
      <div className="book__dates">
        <label className="field"><span>{B.from}</span><input type="date" value={from} min={today || undefined} onChange={(e) => setFrom(e.target.value)} required /></label>
        <label className="field"><span>{B.to}</span><input type="date" value={to} min={from} onChange={(e) => setTo(e.target.value)} required /></label>
      </div>
      <fieldset className="book__extras">
        <legend>{B.extras}</legend>
        {B.options.map((o) => (
          <label key={o.id} className="check">
            <input type="checkbox" checked={!!extras[o.id]} onChange={(e) => setExtras({ ...extras, [o.id]: e.target.checked })} />
            <span>{o.label}</span><span className="book__per">{euro(o.perDay)} / day</span>
          </label>
        ))}
      </fieldset>
      <dl className="book__sum">
        <div><dt>{ok ? `${B.days(days)} × ${euro(car.price + extrasPerDay)}` : B.total}</dt><dd>{ok ? euro(total) : '-'}</dd></div>
      </dl>
      {!ok && from && to && <p className="book__bad" role="alert">{B.bad}</p>}
      <p className="book__note muted">{B.deposit(deposit)}</p>
      <button type="submit" className="btn btn--solid" disabled={!ok}>{B.reserve}</button>
    </form>
  );
}
