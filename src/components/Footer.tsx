import Link from 'next/link';
import { footer, site } from '@/data/site';

export function Footer() {
  return (
    <footer className="foot">
      <p className="foot__brand">Car<span>Hub</span></p>
      <div className="foot__meta">
        <p>{footer.note}</p>
        <p className="muted">{footer.data}</p>
        <p>Design and code by <a className="ul" href={site.credit.href} target="_blank" rel="noopener noreferrer">{site.credit.name}</a>. <span className="muted">{footer.colophon}</span></p>
      </div>
      <p className="foot__links"><Link className="ul" href="/#fleet">Fleet</Link></p>
    </footer>
  );
}
