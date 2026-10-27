import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LONGEST, bySlug, cars } from '@/data/cars';
import { CarArt } from '@/components/CarArt';
import { Booking } from '@/components/Booking';
import { SaveButton } from '@/components/SaveButton';
import { CarCard } from '@/components/CarCard';
import { bodyLabel, euro, fuelLabel, mm, name, consumption } from '@/lib/format';
import { carPage as P, fleet } from '@/data/site';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return cars.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const car = bySlug((await params).slug);
  if (!car) return {};
  return {
    title: `${name(car)} to rent`,
    description: `${name(car)}: ${car.seats} seats, ${car.power} hp, ${consumption(car)}. From ${euro(car.price)} a day, drawn to scale from its real measurements.`,
  };
}

export default async function CarPage({ params }: Params) {
  const car = bySlug((await params).slug);
  if (!car) notFound();
  // Compare with a car of a very different size: the smallest, or for small cars the longest.
  const small = cars.reduce((a, b) => (b.length < a.length ? b : a));
  const big = cars.reduce((a, b) => (b.length > a.length ? b : a));
  const other = car.slug === small.slug || car.length < 4000 ? big : small;
  const room = Math.max(car.length, other.length);
  const similar = cars.filter((c) => c.body === car.body && c.slug !== car.slug).slice(0, 3);
  const specs: [string, string][] = [
    ['Body', `${bodyLabel(car)}, ${car.doors} doors`],
    ['Seats', String(car.seats)],
    ['Engine', `${fuelLabel(car)}, ${car.power} hp`],
    [car.fuel === 'electric' ? 'Consumption' : 'Fuel use', consumption(car)],
    ...(car.range ? [['Range', `${car.range} km (WLTP)`] as [string, string]] : []),
    ['Gearbox', car.gearbox === 'manual' ? 'Manual' : 'Automatic'],
    ['Drive', car.drive === 'AWD' ? 'All-wheel drive' : car.drive === 'RWD' ? 'Rear-wheel drive' : 'Front-wheel drive'],
    ['Boot', `${car.boot} litres`],
    ['Length', mm(car.length)], ['Wheelbase', mm(car.wheelbase)], ['Height', mm(car.height)],
  ];
  return (
    <article className="car-page">
      <p className="car-page__back"><Link className="ul" href="/#fleet">{P.back}</Link></p>
      <header className="car-page__head">
        <div>
          <p className="kicker">{bodyLabel(car)}, {car.year}</p>
          <h1 className="car-page__title"><span>{car.make}</span> {car.model}</h1>
          <p className="car-page__note">{car.note}</p>
        </div>
        <div className="car-page__price">
          <p><b>{euro(car.price)}</b> {fleet.perDay}</p>
          <SaveButton slug={car.slug} name={name(car)} />
        </div>
      </header>
      <div className="car-page__drawing">
        <CarArt car={car} id={`hero-${car.slug}`} room={LONGEST} dims className="art--dims" />
      </div>
      <div className="car-page__body">
        <section className="specs" aria-labelledby="specs-title">
          <h2 id="specs-title" className="section-title">{P.specs}</h2>
          <dl>{specs.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        </section>
        <Booking car={car} />
      </div>
      <section className="compare" aria-labelledby="compare-title">
        <h2 id="compare-title" className="section-title">{P.compare(name(other))}</h2>
        <p className="muted">{P.compareNote}</p>
        <div className="compare__stage">
          <figure><CarArt car={car} id={`cmp-a-${car.slug}`} room={room} /><figcaption>{name(car)}, {(car.length / 1000).toFixed(2)} m</figcaption></figure>
          <figure><CarArt car={other} id={`cmp-b-${other.slug}`} room={room} /><figcaption>{name(other)}, {(other.length / 1000).toFixed(2)} m</figcaption></figure>
        </div>
      </section>
      {similar.length > 0 && (
        <section className="similar" aria-labelledby="similar-title">
          <h2 id="similar-title" className="section-title">{P.similar}</h2>
          <div className="grid">{similar.map((c) => <CarCard key={c.slug} car={c} />)}</div>
        </section>
      )}
    </article>
  );
}
