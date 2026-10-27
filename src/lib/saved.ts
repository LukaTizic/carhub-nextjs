'use client';
// Saved cars, kept in this browser only.
import { useSyncExternalStore } from 'react';

const KEY = 'carhub:saved';
let ids: string[] = [];
let loaded = false;
const subs = new Set<() => void>();

function load() {
  if (loaded || typeof window === 'undefined') return;
  loaded = true;
  try { ids = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { ids = []; }
}
const emit = () => { try { localStorage.setItem(KEY, JSON.stringify(ids)); } catch { /* private mode */ } subs.forEach((f) => f()); };

export function toggleSaved(slug: string) {
  load();
  ids = ids.includes(slug) ? ids.filter((x) => x !== slug) : [...ids, slug];
  emit();
}

const EMPTY: string[] = [];
export function useSaved() {
  return useSyncExternalStore(
    (f) => { load(); subs.add(f); return () => { subs.delete(f); }; },
    () => { load(); return ids; },
    () => EMPTY,
  );
}
