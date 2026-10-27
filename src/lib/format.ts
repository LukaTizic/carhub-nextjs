import type { Car } from '@/data/cars';
import { bodies, fuels } from '@/data/cars';

export const euro = (n: number) => `€${n.toLocaleString('en-GB')}`;
export const bodyLabel = (c: Car) => bodies.find((b) => b.id === c.body)!.label;
export const fuelLabel = (c: Car) => fuels.find((f) => f.id === c.fuel)!.label;
export const consumption = (c: Car) => (c.fuel === 'electric' ? `${c.use} kWh/100 km` : `${c.use} l/100 km`);
export const mm = (n: number) => `${n.toLocaleString('en-GB')} mm`;
export const name = (c: Car) => `${c.make} ${c.model}`;
