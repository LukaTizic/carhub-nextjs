'use client';
import { toggleSaved, useSaved } from '@/lib/saved';
import { saved as S } from '@/data/site';

export function SaveButton({ slug, name }: { slug: string; name: string }) {
  const on = useSaved().includes(slug);
  return (
    <button type="button" className="save" aria-pressed={on} aria-label={S.label(name, on)} onClick={() => toggleSaved(slug)}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2Z" /></svg>
    </button>
  );
}
