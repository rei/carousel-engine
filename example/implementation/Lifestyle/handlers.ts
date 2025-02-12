import type { CarouselArrowClickPayload } from '../../../src/index';
import type { LifestyleModel, LifestyleSlideClickPayload } from '.';

/**
 * Handles slide click events in the carousel and logs analytics data.
 *
 * @param {unknown} payload - The event payload containing details about the clicked slide.
 * @return {void}
 */
export function onSlideClick(payload: unknown): void {
  const { event, item } = payload as LifestyleSlideClickPayload;

  const analytics = {
    target: item.cta.target,
    text: item.cta.text,
  };

  console.log('onSlideClick', { event, item, analytics });
}

/**
 * Handles arrow click events in the carousel.
 * Determines scroll direction and formats analytics tracking data.
 *
 * @param {unknown} payload - The event payload containing navigation details.
 * @return {void}
 */
export function onArrowClick(payload: unknown): void {
  const { direction, event, model = {} } = payload as CarouselArrowClickPayload;
  const { slidesVisible, slideStyle } = model as Partial<LifestyleModel>;

  const scrollDirection =
    direction === 'right' ? 'forwardScroll' : 'backScroll';
  const scrollValue = `scroll-${direction}`;
  const analytics = {
    [scrollDirection]: scrollValue, // Scroll direction tracking key
    slidesVisible,
    slideStyle,
  };

  console.log('onArrowClick', { event, direction, analytics });
}
