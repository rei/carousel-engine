import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import vue from '@vitejs/plugin-vue';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'CarouselEngine',
      // the proper extensions will be added
      fileName: 'carousel-engine',
      formats: ['es'],
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue', '@rei/cedar'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use '@rei/cdr-tokens/dist/rei-dot-com/scss/cdr-tokens' as *;
          @use '@rei/cdr-component-variables/dist/scss/index' as *;
        `,
        silenceDeprecations: ['legacy-js-api'],
        quietDeps: true,
      },
    },
  },
  plugins: [vue(), dts({ tsconfigPath: './tsconfig.app.json' })],
});
