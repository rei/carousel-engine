import {
  CdrBreakpointLg,
  CdrBreakpointMd,
  CdrSpaceThreeQuarterX,
} from '@rei/cdr-tokens';
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
  const carouselModel: CarouselConfig<LifestyleSlideExtended> = {
    component: SlideComponent,
    slides,
    carouselId,
    description: 'Lifestyle carousel',
    slidesGap: parseInt(CdrSpaceThreeQuarterX, 10),
    slidesToShow: slidesVisible,
    // dynamicSizing: false,
    focusSelector: ':first-child a',

    /**
     * A function that dynamically adjusts the number of slides to show
     * and scroll based on the client's screen width.
     *
     * @param {{ slidesToShow: Ref<number>, slidesToScroll: Ref<number> }} refs -
     *  An object containing references to the slidesToShow and slidesToScroll values.
     * @return {void}
     */
    resizeStrategy: ({ slidesToShow, slidesToScroll }) => {
      const { clientWidth } = window.document.body;
      switch (true) {
        case clientWidth >= Number(CdrBreakpointLg):
          slidesToShow.value = slidesVisible;
          slidesToScroll.value = slidesVisible - 1;
          break;
        case clientWidth >= Number(CdrBreakpointMd):
          slidesToShow.value = 3;
          slidesToScroll.value = 2;
          break;
        default:
          slidesToShow.value = 2;
          slidesToScroll.value = 1;
      }
    },
  };

  return carouselModel;
};

export default adapter;
