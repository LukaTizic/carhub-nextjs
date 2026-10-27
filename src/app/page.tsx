import Link from 'next/link';
import { Parade } from '@/components/Parade';
import { Fleet } from '@/components/Fleet';
import { CarArt } from '@/components/CarArt';
import { bySlug } from '@/data/cars';
import { hero, steps } from '@/data/site';

export default function Home() {
  const featured = bySlug('porsche-911-carrera')!;
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__text">
          <p className="kicker">{hero.kicker}</p>
          <h1 id="hero-title" className="hero__title">{hero.title}</h1>
          <p className="hero__lead">{hero.lead}</p>
          <p><Link href="#fleet" className="btn btn--solid">{hero.cta}</Link></p>
        </div>
        <Link href={`/cars/${featured.slug}`} className="hero__figure">
          <CarArt car={featured} id="hero-featured" dims />
          <span className="hero__caption">{featured.make} {featured.model}, {featured.length.toLocaleString('en-GB')} mm, {hero.drawn}</span>
        </Link>
        <Parade />
      </section>
      <Fleet />
      <section className="steps" aria-labelledby="steps-title">
        <h2 id="steps-title" className="steps__title">{steps.title}</h2>
        <ol className="steps__list">
          {steps.items.map((s, i) => (
            <li key={s.k}><span className="steps__n">{String(i + 1).padStart(2, '0')}</span><h3>{s.k}</h3><p>{s.v}</p></li>
          ))}
        </ol>
      </section>
    </>
  );
}
