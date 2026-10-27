// The CarHub fleet. Dimensions and specs are each model's published figures, rounded; they are
// approximate (trims differ) and are here so every car can be drawn to scale and compared.
// Prices per day are examples for this demo, in euros.

export type Body = 'hatch' | 'sedan' | 'wagon' | 'suv' | 'coupe' | 'roadster' | 'pickup' | 'van';
export type Fuel = 'petrol' | 'diesel' | 'hybrid' | 'plug-in' | 'electric';

export type Car = {
  slug: string;
  make: string;
  model: string;
  year: number;
  body: Body;
  boxy?: boolean; // upright, square-shouldered off-roaders
  fuel: Fuel;
  gearbox: 'manual' | 'automatic';
  drive: 'FWD' | 'RWD' | 'AWD';
  seats: number;
  doors: number;
  power: number; // hp
  use: number; // l/100 km, or kWh/100 km for electric cars
  range?: number; // km, electric cars (WLTP)
  length: number; // mm
  wheelbase: number; // mm
  height: number; // mm
  wheel: number; // tyre outer diameter, mm
  clearance: number; // mm
  boot: number; // litres
  price: number; // € per day
  paint: string;
  note: string;
};

const c = (x: Omit<Car, 'slug'>): Car => ({
  ...x,
  slug: `${x.make}-${x.model}`.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
});

export const cars: Car[] = [
  c({ make: 'Fiat', model: '500', year: 2024, body: 'hatch', fuel: 'hybrid', gearbox: 'manual', drive: 'FWD', seats: 4, doors: 3, power: 70, use: 5.3, length: 3571, wheelbase: 2300, height: 1488, wheel: 590, clearance: 130, boot: 185, price: 29, paint: '#e8d9b5', note: 'The one that fits anywhere in the old town.' }),
  c({ make: 'Škoda', model: 'Fabia', year: 2024, body: 'hatch', fuel: 'petrol', gearbox: 'manual', drive: 'FWD', seats: 5, doors: 5, power: 95, use: 5.1, length: 4108, wheelbase: 2564, height: 1459, wheel: 620, clearance: 140, boot: 380, price: 31, paint: '#9fb4c7', note: 'Small outside, a proper boot inside.' }),
  c({ make: 'Renault', model: 'Clio', year: 2024, body: 'hatch', fuel: 'petrol', gearbox: 'manual', drive: 'FWD', seats: 5, doors: 5, power: 90, use: 5.2, length: 4053, wheelbase: 2583, height: 1440, wheel: 620, clearance: 130, boot: 391, price: 32, paint: '#c8452f', note: 'Europe’s favourite city car for good reason.' }),
  c({ make: 'Toyota', model: 'Yaris Hybrid', year: 2024, body: 'hatch', fuel: 'hybrid', gearbox: 'automatic', drive: 'FWD', seats: 5, doors: 5, power: 116, use: 3.9, length: 3940, wheelbase: 2560, height: 1500, wheel: 620, clearance: 140, boot: 286, price: 35, paint: '#d9dcdd', note: 'Sips fuel in traffic, silent in town.' }),
  c({ make: 'MINI', model: 'Cooper', year: 2024, body: 'hatch', fuel: 'petrol', gearbox: 'automatic', drive: 'FWD', seats: 4, doors: 3, power: 156, use: 6.0, length: 3876, wheelbase: 2495, height: 1432, wheel: 640, clearance: 130, boot: 210, price: 45, paint: '#2f5d4a', note: 'Go-kart steering, weekend grin.' }),
  c({ make: 'Volkswagen', model: 'Golf', year: 2024, body: 'hatch', fuel: 'petrol', gearbox: 'automatic', drive: 'FWD', seats: 5, doors: 5, power: 150, use: 5.6, length: 4284, wheelbase: 2636, height: 1456, wheel: 640, clearance: 140, boot: 380, price: 42, paint: '#4a6fa5', note: 'The benchmark, still.' }),
  c({ make: 'Toyota', model: 'Corolla', year: 2024, body: 'sedan', fuel: 'hybrid', gearbox: 'automatic', drive: 'FWD', seats: 5, doors: 4, power: 140, use: 4.5, length: 4630, wheelbase: 2700, height: 1435, wheel: 640, clearance: 135, boot: 471, price: 40, paint: '#efefea', note: 'Calm, frugal and impossible to break.' }),
  c({ make: 'BMW', model: '320d', year: 2024, body: 'sedan', fuel: 'diesel', gearbox: 'automatic', drive: 'RWD', seats: 5, doors: 4, power: 190, use: 4.7, length: 4713, wheelbase: 2851, height: 1440, wheel: 660, clearance: 140, boot: 480, price: 75, paint: '#1f2a3a', note: 'A thousand kilometres on one tank, and you will enjoy all of them.' }),
  c({ make: 'Mercedes-Benz', model: 'E 220 d', year: 2024, body: 'sedan', fuel: 'diesel', gearbox: 'automatic', drive: 'RWD', seats: 5, doors: 4, power: 197, use: 5.1, length: 4949, wheelbase: 2961, height: 1468, wheel: 680, clearance: 140, boot: 540, price: 95, paint: '#7d8186', note: 'For the airport run that has to look right.' }),
  c({ make: 'Tesla', model: 'Model 3', year: 2024, body: 'sedan', fuel: 'electric', gearbox: 'automatic', drive: 'RWD', seats: 5, doors: 4, power: 283, use: 13.2, range: 513, length: 4720, wheelbase: 2875, height: 1441, wheel: 670, clearance: 138, boot: 594, price: 80, paint: '#b81f2e', note: 'Fast, quiet, and the motorway chargers are on the map.' }),
  c({ make: 'Škoda', model: 'Octavia Combi', year: 2024, body: 'wagon', fuel: 'diesel', gearbox: 'automatic', drive: 'FWD', seats: 5, doors: 5, power: 150, use: 4.6, length: 4698, wheelbase: 2686, height: 1468, wheel: 650, clearance: 140, boot: 640, price: 48, paint: '#5b6b4e', note: 'Takes the whole family’s luggage and asks for more.' }),
  c({ make: 'Volvo', model: 'V60', year: 2024, body: 'wagon', fuel: 'plug-in', gearbox: 'automatic', drive: 'AWD', seats: 5, doors: 5, power: 350, use: 1.2, length: 4778, wheelbase: 2872, height: 1435, wheel: 670, clearance: 135, boot: 519, price: 88, paint: '#2d3e50', note: 'Scandinavian calm with a surprising shove.' }),
  c({ make: 'Dacia', model: 'Duster', year: 2024, body: 'suv', fuel: 'petrol', gearbox: 'manual', drive: 'FWD', seats: 5, doors: 5, power: 130, use: 5.7, length: 4343, wheelbase: 2657, height: 1656, wheel: 690, clearance: 209, boot: 472, price: 38, paint: '#8a7c5a', note: 'Gravel roads to the vineyards, no drama.' }),
  c({ make: 'Peugeot', model: '3008', year: 2024, body: 'suv', fuel: 'hybrid', gearbox: 'automatic', drive: 'FWD', seats: 5, doors: 5, power: 136, use: 5.5, length: 4542, wheelbase: 2739, height: 1641, wheel: 700, clearance: 190, boot: 520, price: 55, paint: '#3c3f44', note: 'A cockpit that feels a class above.' }),
  c({ make: 'Toyota', model: 'RAV4 Hybrid', year: 2024, body: 'suv', fuel: 'hybrid', gearbox: 'automatic', drive: 'AWD', seats: 5, doors: 5, power: 222, use: 5.6, length: 4600, wheelbase: 2690, height: 1685, wheel: 720, clearance: 195, boot: 580, price: 62, paint: '#6e7f8d', note: 'Four-wheel drive for the mountain passes.' }),
  c({ make: 'Volkswagen', model: 'ID.4', year: 2024, body: 'suv', fuel: 'electric', gearbox: 'automatic', drive: 'RWD', seats: 5, doors: 5, power: 286, use: 16.3, range: 517, length: 4584, wheelbase: 2771, height: 1631, wheel: 720, clearance: 170, boot: 543, price: 70, paint: '#e4e1d8', note: 'Roomy, smooth, and a long way between charges.' }),
  c({ make: 'Hyundai', model: 'Ioniq 5', year: 2024, body: 'suv', fuel: 'electric', gearbox: 'automatic', drive: 'AWD', seats: 5, doors: 5, power: 325, use: 17.9, range: 454, length: 4635, wheelbase: 3000, height: 1605, wheel: 720, clearance: 160, boot: 527, price: 78, paint: '#9aa3a0', note: 'Charges from 10 to 80 percent over a coffee.' }),
  c({ make: 'Tesla', model: 'Model Y', year: 2024, body: 'suv', fuel: 'electric', gearbox: 'automatic', drive: 'AWD', seats: 5, doors: 5, power: 514, use: 16.9, range: 533, length: 4751, wheelbase: 2890, height: 1624, wheel: 710, clearance: 167, boot: 854, price: 85, paint: '#f2f2ef', note: 'The bestseller, and a boot you can sleep in.' }),
  c({ make: 'Volvo', model: 'XC90', year: 2024, body: 'suv', fuel: 'plug-in', gearbox: 'automatic', drive: 'AWD', seats: 7, doors: 5, power: 455, use: 1.3, length: 4953, wheelbase: 2984, height: 1775, wheel: 760, clearance: 237, boot: 680, price: 130, paint: '#1d2b26', note: 'Seven seats and a living-room hush.' }),
  c({ make: 'Land Rover', model: 'Defender 110', year: 2024, body: 'suv', boxy: true, fuel: 'diesel', gearbox: 'automatic', drive: 'AWD', seats: 5, doors: 5, power: 249, use: 8.4, length: 4758, wheelbase: 3022, height: 1967, wheel: 810, clearance: 291, boot: 786, price: 150, paint: '#a7a184', note: 'Goes where the map gives up.' }),
  c({ make: 'Mercedes-Benz', model: 'G 450 d', year: 2024, body: 'suv', boxy: true, fuel: 'diesel', gearbox: 'automatic', drive: 'AWD', seats: 5, doors: 5, power: 367, use: 9.8, length: 4873, wheelbase: 2890, height: 1969, wheel: 800, clearance: 241, boot: 640, price: 260, paint: '#0f0f10', note: 'Forty-five years of the same brick, perfected.' }),
  c({ make: 'Porsche', model: '911 Carrera', year: 2024, body: 'coupe', fuel: 'petrol', gearbox: 'automatic', drive: 'RWD', seats: 4, doors: 2, power: 394, use: 10.7, length: 4542, wheelbase: 2450, height: 1302, wheel: 680, clearance: 110, boot: 132, price: 290, paint: '#d4b237', note: 'Book the mountain road first, then the car.' }),
  c({ make: 'Ford', model: 'Mustang GT', year: 2024, body: 'coupe', fuel: 'petrol', gearbox: 'manual', drive: 'RWD', seats: 4, doors: 2, power: 446, use: 12.9, length: 4811, wheelbase: 2720, height: 1403, wheel: 690, clearance: 125, boot: 408, price: 160, paint: '#2b4c8c', note: 'A V8 and six gears, the old-fashioned way.' }),
  c({ make: 'BMW', model: 'i4 eDrive40', year: 2024, body: 'coupe', fuel: 'electric', gearbox: 'automatic', drive: 'RWD', seats: 5, doors: 5, power: 340, use: 16.1, range: 590, length: 4783, wheelbase: 2856, height: 1448, wheel: 680, clearance: 125, boot: 470, price: 92, paint: '#3d5a73', note: 'A coupé roofline with room for four.' }),
  c({ make: 'Mazda', model: 'MX-5', year: 2024, body: 'roadster', fuel: 'petrol', gearbox: 'manual', drive: 'RWD', seats: 2, doors: 2, power: 184, use: 6.9, length: 3915, wheelbase: 2310, height: 1235, wheel: 620, clearance: 135, boot: 130, price: 70, paint: '#a3202a', note: 'Roof down in ten seconds, smile for the rest of the day.' }),
  c({ make: 'Ford', model: 'Ranger', year: 2024, body: 'pickup', fuel: 'diesel', gearbox: 'automatic', drive: 'AWD', seats: 5, doors: 4, power: 205, use: 8.4, length: 5370, wheelbase: 3270, height: 1884, wheel: 800, clearance: 235, boot: 1233, price: 95, paint: '#c2611f', note: 'A tonne in the back and the mud does not matter.' }),
  c({ make: 'Toyota', model: 'Hilux', year: 2024, body: 'pickup', fuel: 'diesel', gearbox: 'automatic', drive: 'AWD', seats: 5, doors: 4, power: 204, use: 9.1, length: 5325, wheelbase: 3085, height: 1815, wheel: 780, clearance: 227, boot: 1100, price: 90, paint: '#e8e6df', note: 'Famous for refusing to die.' }),
  c({ make: 'Citroën', model: 'Berlingo', year: 2024, body: 'van', fuel: 'diesel', gearbox: 'manual', drive: 'FWD', seats: 5, doors: 5, power: 102, use: 5.2, length: 4403, wheelbase: 2785, height: 1849, wheel: 650, clearance: 160, boot: 775, price: 45, paint: '#7aa0b8', note: 'Sliding doors, a cave for a boot, honest money.' }),
  c({ make: 'Volkswagen', model: 'Multivan', year: 2024, body: 'van', fuel: 'hybrid', gearbox: 'automatic', drive: 'FWD', seats: 7, doors: 5, power: 218, use: 1.6, length: 4973, wheelbase: 3124, height: 1903, wheel: 690, clearance: 150, boot: 469, price: 120, paint: '#d9c46b', note: 'Seven seats that slide, swivel and fold flat.' }),
  c({ make: 'Mercedes-Benz', model: 'V 300 d', year: 2024, body: 'van', fuel: 'diesel', gearbox: 'automatic', drive: 'RWD', seats: 8, doors: 5, power: 237, use: 7.1, length: 5140, wheelbase: 3200, height: 1880, wheel: 700, clearance: 140, boot: 1030, price: 140, paint: '#232528', note: 'The whole wedding party, in comfort.' }),
];

export const bodies: { id: Body; label: string }[] = [
  { id: 'hatch', label: 'Hatchback' }, { id: 'sedan', label: 'Saloon' }, { id: 'wagon', label: 'Estate' }, { id: 'suv', label: 'SUV' },
  { id: 'coupe', label: 'Coupé' }, { id: 'roadster', label: 'Roadster' }, { id: 'pickup', label: 'Pick-up' }, { id: 'van', label: 'People carrier' },
];

export const fuels: { id: Fuel; label: string }[] = [
  { id: 'petrol', label: 'Petrol' }, { id: 'diesel', label: 'Diesel' }, { id: 'hybrid', label: 'Hybrid' }, { id: 'plug-in', label: 'Plug-in hybrid' }, { id: 'electric', label: 'Electric' },
];

export const bySlug = (slug: string) => cars.find((x) => x.slug === slug);
export const LONGEST = Math.max(...cars.map((x) => x.length));
export const TALLEST = Math.max(...cars.map((x) => x.height));
