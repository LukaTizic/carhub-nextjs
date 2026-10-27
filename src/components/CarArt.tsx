// A car drawn to the site's one scale. `room` is the length (mm) the box represents, so in a box
// built for the longest car a Fiat 500 really is two thirds the size of a Ford Ranger.
// `looseWheels` lays the wheels over the drawing as separate elements, so a CSS rotation of each
// wheel runs on the compositor instead of repainting the whole drawing every frame (the parade).
import type { CSSProperties } from 'react';
import type { Car } from '@/data/cars';
import { carSvg, draw, frame, wheelSvg } from '@/lib/drawing';

type Props = { car: Car; id: string; room?: number; dims?: boolean; className?: string; title?: string; looseWheels?: boolean };

export function CarArt({ car, id, room, dims, className, title, looseWheels }: Props) {
  const svg = carSvg(car, { id, dims, title, wheels: !looseWheels });
  const side = 160 + (dims ? 520 : 0); // the padding (and dimension lines) carSvg adds around the car
  const w = room ? `${(((car.length + side) / (room + side)) * 100).toFixed(2)}%` : '100%';
  if (!looseWheels) return <div className={`art ${className ?? ''}`} style={{ width: w }} dangerouslySetInnerHTML={{ __html: svg }} />;
  const d = draw(car);
  const [x0, y0, vw, vh] = frame(d, { dims });
  return (
    <div className={`art art--loose ${className ?? ''}`} style={{ width: w }}>
      <div dangerouslySetInnerHTML={{ __html: svg }} />
      {d.wheels.map((wh, i) => {
        const style: CSSProperties = {
          left: `${(((wh.cx - wh.r - x0) / vw) * 100).toFixed(3)}%`,
          top: `${(((wh.cy - wh.r - y0) / vh) * 100).toFixed(3)}%`,
          width: `${(((2 * wh.r) / vw) * 100).toFixed(3)}%`,
        };
        return <span key={i} className="art__wheel" style={style} dangerouslySetInnerHTML={{ __html: wheelSvg(wh.r) }} />;
      })}
    </div>
  );
}
