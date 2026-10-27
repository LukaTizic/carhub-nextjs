import Link from 'next/link';
import type { Car } from '@/data/cars';
import { LONGEST } from '@/data/cars';
import { euro, fuelLabel, name } from '@/lib/format';
import { fleet } from '@/data/site';
import { CarArt } from './CarArt';
import { SaveButton } from './SaveButton';

export function CarCard({ car }: { car: Car }) {
  return (
    <article className="card">
      <div className="card__stage">
        <CarArt car={car} id={`card-${car.slug}`} room={LONGEST} />
      </div>
      <div className="card__head">
        <h3 className="card__name">
          <Link href={`/cars/${car.slug}`} className="card__link">
            <span className="card__make">{car.make}</span> {car.model}
          </Link>
        </h3>
        <SaveButton slug={car.slug} name={name(car)} />
      </div>
      <ul className="card__facts" aria-label="Key facts">
        <li>{car.seats} seats</li>
        <li>{car.gearbox === 'manual' ? 'Manual' : 'Automatic'}</li>
        <li>{fuelLabel(car)}</li>
        <li>{(car.length / 1000).toFixed(2)} m</li>
      </ul>
      <p className="card__price"><b>{euro(car.price)}</b> <span>{fleet.perDay}</span></p>
    </article>
  );
}
