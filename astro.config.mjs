import { defineConfig } from 'astro/config';

// Статическая генерация без внешних интеграций и CDN.
export default defineConfig({
  output: 'static',
  site: undefined, // production-домен неизвестен — canonical не подставляем
  build: { assets: 'assets' },
});
