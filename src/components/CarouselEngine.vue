<template>
  <div v-if="hasCarouselSlides" ref="CarouselEngine" v-bind="dataAttributes">
    <slot name="heading" />
    <BaseCarousel
      :id="carouselId"
      ref="carousel"
      :description="description"
      :slides="slides"
      :slides-gap="slidesGap"
      :slides-to-show="slidesToShow"
      :slides-to-scroll="slidesToScroll"
      :focus-selector="focusSelector"
      @arrow-click="onArrowClick"
    >
      <template #slide="{ ...slideProps }: Record<string, unknown>">
        <component :is="carouselConfig.component" v-bind="slideProps" />
      </template>
    </BaseCarousel>
  </div>
</template>

<script setup lang="ts">
import BaseCarousel from './BaseCarousel.vue';
import { useResizeObserver, useDebounceFn } from '@vueuse/core';
import type {
  Slide,
  CarouselArrowClickPayload,
  CarouselResizePayload,
  CarouselEventEmitter,
  CarouselConfig,
  CarouselEngine,
} from '..';
import { CarouselEventKey } from '../injection-key';
import { computed, provide, ref, useId, watch } from 'vue';
defineOptions({ name: 'CarouselEngine' });

/**
 * Emits an event with a specified name and optional payload.
 */
const emit = defineEmits<{
  (e: 'arrowClick', payload: CarouselArrowClickPayload): void;
  (e: 'resize', payload: CarouselResizePayload): void;
  (e: string, payload?: unknown): void;
}>();

/**
 * Provides a centralized event emitter function for the carousel and its slides.
 */
const emitEvent: CarouselEventEmitter = (eventName, payload) => {
  emit(eventName, payload);
};

/**
 * Provides the event emitter function to child components.
 */
provide(CarouselEventKey, emitEvent);

/**
 * Defines the props for the CarouselEngine component.
 */
const props = withDefaults(defineProps<CarouselEngine<unknown>>(), {
  model: () => ({}),
});

// Reference to the carousel container element.
const CarouselEngine = ref<HTMLElement | null>(null);
const SLIDES_TO_SHOW_DEFAULT = 6;

/**
 * Resolves and transforms the carousel model.
 */
const carouselConfig = computed<CarouselConfig<unknown>>(() =>
  props.adapter(props.model),
);

/**
 * Number of slides to display at a time.
 */
const slidesToShow = ref<number>(
  carouselConfig?.value?.slidesToShow ?? SLIDES_TO_SHOW_DEFAULT,
);

/**
 * Number of slides to scroll at a time.
 */
const slidesToScroll = ref<number>(slidesToShow.value);

/**
 * Extracts slides from the resolved carousel model.
 */
const slides = computed(() => carouselConfig.value.slides as Slide<never>[]);

/**
 * Checks if the carousel has slides.
 */
const hasCarouselSlides = computed(() => slides.value.length > 0);

/**
 * Retrieves carousel metadata.
 */
const carouselId = computed(
  () => `${carouselConfig.value.carouselId}-${useId()}`,
);

/**
 * Retrieves the description for the carousel.
 */
const description = computed(() => carouselConfig.value.description);

/**
 * Retrieves the gap between slides.
 */
const slidesGap = computed(() => carouselConfig?.value?.slidesGap || 0);

/**
 * Determines if the carousel should use the default resize strategy.
 */
const useDefaultResizeStrategy = ref<boolean>(
  typeof carouselConfig?.value?.useDefaultResizeStrategy === 'boolean'
    ? carouselConfig.value.useDefaultResizeStrategy
    : false,
);

/**
 * Retrieves the focus selector for the carousel.
 */
const focusSelector = computed(
  () => carouselConfig?.value?.focusSelector || ':first-child',
);

/**
 * Retrieves the data attributes for the carousel.
 */
const dataAttributes = computed(
  () => carouselConfig.value?.dataAttributes || {},
);

/**
 * Handles arrow click events.
 */
function onArrowClick({ event, direction }: CarouselArrowClickPayload) {
  const arrowClickPayload: CarouselArrowClickPayload = {
    event,
    direction,
    model: props.model as Record<string, unknown>,
  };
  emit('arrowClick', arrowClickPayload);
}

/**
 * Updates the number of slides dynamically based on screen size.
 * Used only when no `resizeStrategy` is provided in `carouselConfig`.
 */
function defaultResizeStrategy() {
  const screenWidth = window.innerWidth;
  slidesToShow.value = screenWidth >= 1024 ? 5 : screenWidth >= 768 ? 4 : 2;
  slidesToScroll.value = Math.max(slidesToShow.value - 1, 1);
}

/**
 * Handles window resize events.
 */
const onResize = useDebounceFn(() => {
  const resizePayload: CarouselResizePayload = {
    model: props.model as Record<string, unknown>,
    slidesToShow,
    slidesToScroll,
  };
  emit('resize', resizePayload);
  if (useDefaultResizeStrategy.value) {
    defaultResizeStrategy();
  }
}, 25);

/**
 * Sets up the resize observer for the carousel container.
 */
watch(
  () => CarouselEngine.value,
  (el) => {
    if (el) {
      useResizeObserver(el, onResize);
    }
  },
  { immediate: true },
);
</script>
