import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound as N } from '@/data/site';

export const metadata: Metadata = { title: 'Empty bay', description: 'This page is not part of CarHub.' };

// An empty parking bay, drawn like the cars: to scale, a standard 2.5 by 5 metre bay.
export default function NotFound() {
  return (
    <section className="lost" aria-labelledby="lost-title">
      <svg className="lost__bay" viewBox="-100 -100 2700 5200" aria-hidden="true">
        <path d="M0,5000 V0 M2500,0 V5000" />
        <text x="1250" y="2700" textAnchor="middle">P</text>
      </svg>
      <div>
        <h1 id="lost-title" className="lost__title">{N.title}</h1>
        <p className="muted">{N.body}</p>
        <p><Link className="btn btn--solid" href="/#fleet">{N.back}</Link></p>
      </div>
    </section>
  );
}
