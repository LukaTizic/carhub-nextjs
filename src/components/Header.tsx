'use client';
import Link from 'next/link';
import { useSaved } from '@/lib/saved';
import { site } from '@/data/site';

export function Header() {
  const n = useSaved().length;
  return (
    <header className="top">
      <Link href="/" className="top__brand" aria-label={`${site.name}, home`}>Car<span>Hub</span></Link>
      <nav aria-label="Main">
        <ul className="top__nav">
          <li><Link href="/#fleet" className="ul">Fleet</Link></li>
          <li><Link href="/?saved=1#fleet" className="ul">Saved{n ? <span className="top__count">{n}</span> : null}</Link></li>
        </ul>
      </nav>
    </header>
  );
}
