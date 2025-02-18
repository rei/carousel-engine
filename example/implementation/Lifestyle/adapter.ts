import { CdrSpaceThreeQuarterX } from '@rei/cdr-tokens';
import type { LifestyleModel, LifestyleSlideExtended } from '.';
import type {
  CarouselAdapter,
  CarouselConfig,
  Slide,
} from '../../../src/index';
import SlideComponent from './LifestyleSlide.vue';

export const adapter: CarouselAdapter<LifestyleSlideExtended> = (modelData) => {
  /**
   * Extracts slides from the raw model data.
   */
  const {
    slides: slideItems = [],
    slideStyle,
    slidesVisible = 4,
  } = modelData as Partial<LifestyleModel>;

  /**
   * Determines the carousel ID.
   */
  const carouselId = 'lifestyle';

  /**
   * Transforms raw items into an array of slides for the carousel.
   *
   * @type {Slide<LifestyleSlideExtended>[]}
   */
  const slides: Slide<LifestyleSlideExtended>[] = Array.isArray(slideItems)
    ? slideItems.map((slide, index) => ({
        key: `lifestyle-slide-${index}`,
        props: {
          ...slide,
          slideStyle,
          lastSlide: index === slideItems.length - 1,
        },
      }))
    : [];

  /**
   * Constructs the carousel model with the resolved slides and metadata.
   *
   * @type {CarouselConfig<LifestyleSlideExtended>}
   */
  const carouselConfig: CarouselConfig<LifestyleSlideExtended> = {
    component: SlideComponent,
    slides,
    carouselId,
    description: 'Lifestyle carousel',
    slidesGap: parseInt(CdrSpaceThreeQuarterX, 10),
    slidesToShow: slidesVisible,
    focusSelector: ':first-child a',
  };

  return carouselConfig;
};

export default adapter;
