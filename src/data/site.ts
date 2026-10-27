// Every visible string that is not car data.
//
// Assumptions:
// - CarHub is a demo: nothing can actually be booked, and the site says so where it matters.
// - Prices are examples in euros; specs are each model's published figures, rounded.
// - site.url is the current Vercel address; credit.href points to the GitHub profile.

export const site = {
  name: 'CarHub',
  url: 'https://carhub-nextjs-1h3h.vercel.app',
  title: 'CarHub: rent a car, see it drawn to scale',
  description: 'Thirty cars to rent by the day, from a Fiat 500 to a Ford Ranger, each drawn to scale from its real measurements so you can compare before you book.',
  credit: { name: 'Semperor', href: 'https://github.com/LukaTizic' },
};

export const hero = {
  kicker: 'Car rental, by the day',
  title: 'Every car, drawn to scale.',
  lead: 'Thirty cars from a Fiat 500 to a Ford Ranger. Each is drawn from its real length, wheelbase and height, so you can see what you are getting before you get the keys.',
  cta: 'Browse the fleet',
  scale: '1 metre',
  drawn: 'drawn from its numbers',
};

export const fleet = {
  title: 'The fleet',
  search: 'Search make or model',
  all: 'All',
  fuel: 'Fuel',
  gearbox: 'Gearbox',
  seats: 'Seats',
  sort: 'Sort',
  sorts: { price: 'Price, low to high', priceDesc: 'Price, high to low', size: 'Size, small to large', power: 'Most powerful' },
  saved: 'Saved only',
  count: (n: number) => (n === 1 ? '1 car' : `${n} cars`),
  none: 'No car matches all of that. Try fewer filters.',
  reset: 'Clear filters',
  perDay: '/ day',
};

export const steps = {
  title: 'How it works',
  items: [
    { k: 'Pick a car', v: 'Compare them at true size: the drawings share one scale, so a long wheelbase looks long.' },
    { k: 'Choose your dates', v: 'See the price for your days with insurance and extras included, before you commit.' },
    { k: 'Collect the keys', v: 'In a real rental this is where the car would be waiting. Here, it is where the demo ends.' },
  ],
};

export const carPage = {
  back: 'All cars',
  specs: 'Specifications',
  compare: (other: string) => `Next to a ${other}`,
  compareNote: 'Both drawn at the same scale.',
  similar: 'Similar cars',
};

export const booking = {
  title: 'Price your dates',
  from: 'Pick-up',
  to: 'Return',
  extras: 'Extras',
  options: [
    { id: 'cover', label: 'Full insurance, no excess', perDay: 14 },
    { id: 'seat', label: 'Child seat', perDay: 6 },
    { id: 'driver', label: 'Additional driver', perDay: 8 },
  ],
  days: (n: number) => (n === 1 ? '1 day' : `${n} days`),
  total: 'Total',
  deposit: (n: number) => `A refundable deposit of €${n} is held on your card at pick-up.`,
  reserve: 'Reserve',
  bad: 'The return has to be after the pick-up.',
  doneTitle: 'Reserved, in theory',
  done: 'CarHub is a demo, so nothing was booked and nothing was charged. In a real rental you would now get a confirmation email.',
  again: 'Change dates',
};

export const saved = { add: 'Save', remove: 'Saved', label: (name: string, on: boolean) => (on ? `Remove ${name} from saved cars` : `Save ${name}`) };

export const notFound = {
  title: 'Empty bay',
  body: 'This car is not in the fleet, or it has already been driven away.',
  back: 'See the fleet',
};

export const footer = {
  note: 'CarHub is a demo. Nothing can be booked; prices are examples.',
  data: 'Dimensions and specs are each model’s published figures, rounded. Every drawing is made in code from those numbers.',
  colophon: 'Set in Archivo and JetBrains Mono. Built with Next.js.',
};
