import { h } from 'vue';
import type { CarouselConfig, CarouselAdapter } from '.';

/**
 * Resolves the carousel model using the provided adapter function.
 * If no adapter is provided, returns a default empty carousel model.
 *
 * @param {Record<string, unknown>} modelData - The model data for the carousel.
 * @param {CarouselAdapter<T>} adapter - The adapter function for the carousel.
 * @returns {CarouselConfig<T>} The resolved carousel model, or a fallback empty model if no adapter is provided.
 */
export function useCarouselAdapter<T extends Record<string, unknown>>(
  modelData: Record<string, unknown>,
  adapter?: CarouselAdapter<T>,
): CarouselConfig<T> {
  if (!adapter) {
    console.warn(`No adapter provided for carousel.`, modelData);
    return {
      slides: [],
      carouselId: 'empty-carousel',
      type: 'empty',
      component: h('div'),
      description: 'An empty carousel',
    } as CarouselConfig<T>;
  }
  return adapter(modelData);
}

export default useCarouselAdapter;
