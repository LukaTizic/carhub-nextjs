import type { MetadataRoute } from 'next';
import { cars } from '@/data/cars';
import { site } from '@/data/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: site.url }, ...cars.map((c) => ({ url: `${site.url}/cars/${c.slug}` }))];
}
