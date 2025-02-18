import type {
  CarouselAdapter,
  CarouselConfig,
  Slide,
} from '../../../src/index';
import SlideComponent from './components/RecommendedProductSlide.vue';
import type { RecommendedProductModel, RecommendedProductSlide } from '.';

/**
 * Resolves a product carousel model from raw model data.
 *
 * This function takes `modelData`, extracts relevant product information,
 * and transforms it into a structured carousel model that conforms to the
 * `CarouselConfig<ProductSlide>` format.
 *
 * @param {Record<string, unknown>} modelData - The raw data used to populate the carousel.
 * @returns {CarouselConfig<RecommendedProductSlide>} The resolved product carousel model.
 */
export const adapter: CarouselAdapter<RecommendedProductSlide> = (
  modelData,
) => {
  const { items = [], placementName } =
    modelData as Partial<RecommendedProductModel>;

  /**
   * Determines the carousel ID.
   * If `carouselId` is a string in `modelData`, it is used; otherwise, a default ID is generated.
   */
  const carouselId =
    typeof modelData.carouselId === 'string'
      ? modelData.carouselId
      : `product-${placementName || 'unknown'}`;

  /**
   * Transforms raw items into an array of slides for the carousel.
   *
   * @type {Slide<RecommendedProductSlide>[]}
   */
  const slides: Slide<RecommendedProductSlide>[] = Array.isArray(items)
    ? items.map((item, index) => ({
        key: `product-slide-${index}`,
        props: item,
      }))
    : [];

  /**
   * Constructs the carousel config with the resolved slides and metadata.
   *
   * @type {CarouselConfig<RecommendedProductSlide>}
   */
  const carouselConfig: CarouselConfig<RecommendedProductSlide> = {
    component: SlideComponent,
    slides,
    carouselId,
    description: 'Product carousel',
    dataAttributes: {
      'data-placement-name': placementName,
    },
    useDefaultResizeStrategy: true,
  };

  return carouselConfig;
};

export default adapter;
