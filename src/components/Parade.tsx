// The whole fleet driving past, bumper to bumper, at one scale. Each wheel turns at the speed its
// own tyre would turn for the road speed, so small wheels spin faster than big ones.
import Link from 'next/link';
import { cars } from '@/data/cars';
import { name } from '@/lib/format';
import { hero } from '@/data/site';
import { CarArt } from './CarArt';
import { Visible } from './Visible';

const PX_PER_MM = 0.052; // the parade's scale
const GAP = 900; // mm between cars
const SPEED = 1300; // road speed of the parade, mm per second (about 4.7 km/h at this scale)

export function Parade() {
  const order = [...cars].sort((a, b) => (a.slug < b.slug ? -1 : 1));
  const rowLength = order.reduce((s, c) => s + c.length + 160 + GAP, 0);
  const seconds = rowLength / SPEED;
  // The second row only closes the loop for the marquee: hidden from assistive tech, and not links.
  const row = (dup: boolean) => (
    <div className="parade__row" aria-hidden={dup || undefined}>
      {order.map((c) => {
        const style = { width: `${((c.length + 160) * PX_PER_MM).toFixed(1)}px`, marginRight: `${(GAP * PX_PER_MM).toFixed(1)}px`, ['--rev' as string]: `${((Math.PI * c.wheel) / SPEED).toFixed(2)}s` };
        const art = <CarArt car={c} id={`p${dup ? 'b' : 'a'}-${c.slug}`} looseWheels />;
        return dup
          ? <span key={c.slug} className="parade__car" style={style}>{art}</span>
          : <Link key={c.slug} href={`/cars/${c.slug}`} className="parade__car" aria-label={name(c)} style={style}>{art}</Link>;
      })}
    </div>
  );
  return (
    <Visible className="parade" style={{ ['--loop' as string]: `${seconds.toFixed(0)}s` }}>
      <div className="parade__track">{row(false)}{row(true)}</div>
      <div className="parade__road" aria-hidden="true" />
      <p className="parade__scale" aria-hidden="true"><span style={{ width: `${(1000 * PX_PER_MM).toFixed(1)}px` }} />{hero.scale}</p>
    </Visible>
  );
}
