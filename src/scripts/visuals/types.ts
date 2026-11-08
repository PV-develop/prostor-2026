/**
 * Контракт визуального пресета для ServiceHero.
 * Пресет описывает только геометрию (частицы + связи в нормализованных
 * координатах 0..1); жизненным циклом занимается engine.ts.
 */

export interface Vec2 {
  x: number;
  y: number;
}

/** Частица сцены. */
export interface SceneParticle {
  /** целевая («домашняя») позиция после сборки, нормализованная */
  home: Vec2;
  /** базовый размер, px */
  size: number;
  /** базовая альфа 0..1 */
  alpha: number;
  /** красная акцентная частица */
  red?: boolean;
  /** задержка старта сборки, с */
  delay: number;
  /** параметры медленного дрейфа после сборки */
  driftAmp: number;
  driftFreq: number;
  driftPhase: number;
  /** поток: после сборки частица движется вдоль отрезка (к центральным точкам) */
  flow?: { from: Vec2; to: Vec2; speed: number; phase: number };
}

/** Тонкая связь между двумя частицами-узлами (линия). */
export interface SceneLink {
  /** индексы частиц в PresetScene.particles */
  a: number;
  b: number;
  /** базовая альфа линии (0..1) */
  alpha?: number;
}

export interface PresetScene {
  particles: SceneParticle[];
  links: SceneLink[];
}

export interface BuildContext {
  /** размеры области графики, px */
  w: number;
  h: number;
  /** целевое число частиц (уже адаптировано движком под устройство) */
  budget: number;
  rand(): number;
}

export interface VisualPreset {
  name: string;
  build(ctx: BuildContext): PresetScene;
}
