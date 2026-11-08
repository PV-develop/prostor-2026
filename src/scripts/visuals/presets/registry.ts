/**
 * Реестр графических пресетов ServiceHero.
 * Новый пресет для следующего направления (SEO, аналитика, AI, …) —
 * файл в presets/ и одна строка здесь; компонент и движок не меняются.
 */
import { mountVisual } from '../engine';
import type { VisualPreset } from '../types';

const presets: Record<string, () => Promise<VisualPreset>> = {
  'performance-network': () => import('./network').then((m) => m.networkPreset),
};

export function mountByName(host: HTMLElement, name: string): void {
  const load = presets[name];
  if (!load) return;
  load()
    .then((preset) => mountVisual(host, preset))
    .catch(() => { /* hero остаётся типографским */ });
}
