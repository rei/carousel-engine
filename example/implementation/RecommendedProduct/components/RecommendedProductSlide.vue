<template>
  <CdrLink
    class="recommended-product"
    :href="href"
    @click.once.prevent="onSlideClick"
  >
    <div class="recommended-product__image-container">
      <CdrImg
        :src="imageSrc"
        :alt="formattedTitle"
        fit="contain"
        ratio="1/1"
        class="recommended-product__image"
        loading="lazy"
      />
    </div>
    <div class="recommended-product__details">
      <CdrText class="recommended-product__brand" tag="span">{{
        brand
      }}</CdrText>
      <CdrText class="recommended-product__name" tag="span">{{
        formattedTitle
      }}</CdrText>
      <CdrRating
        v-if="rating"
        :compact="true"
        :rating="rating.average"
        :count="rating.count"
        size="small"
        class="recommended-product__rating-stars"
      />
      <RecommendedProductPrice v-bind="price" />
    </div>
  </CdrLink>
</template>

<script setup lang="ts">
import { CdrRating, CdrImg, CdrText, CdrLink } from '@rei/cedar';
import RecommendedProductPrice from './RecommendedProductPrice.vue';

import { CarouselEventKey } from '../../../../src/injection-key';
import type {
  RecommendedProductSlide,
  RecommendedProductSlideClickPayload,
} from '..';
import type { CarouselEventEmitter } from '../../../../src/index';
import { computed, inject } from 'vue';

const props = defineProps<RecommendedProductSlide>();

const formattedTitle = computed(() => props.name?.replace('&quot;', '"'));
const imageSrc = computed(
  () =>
    `${process.env.NODE_ENV === 'production' ? 'https://rei.com' : 'https://future.rei-cloud.com'}/media/product/${props.id}?size=300`,
);

const emitEvent = inject(CarouselEventKey) as CarouselEventEmitter;

/**
 * Handles the click event on a slide, emitting a 'slideClick' event with the event details and the slide item.
 *
 * @param {Event} event - The click event that triggered this function.
 * @return {void}
 */
const onSlideClick = (event: Event) => {
  emitEvent?.('slideClick', {
    event,
    item: props,
  } as RecommendedProductSlideClickPayload);
};
</script>

<style lang="scss" scoped>
.recommended-product {
  height: 100%;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  outline: none;
  padding: $cdr-space-half-x;
  border-radius: $cdr-radius-softer;

  &:active,
  &:focus {
    box-shadow: inset 0px 0px 0px $cdr-space-eighth-x #2e2e2b;
  }

  &:hover .recommended-product__name {
    text-decoration: underline;
  }

  &__brand,
  &__name {
    width: 100%;
    overflow: hidden;
    display: -webkit-box;
  }

  &__brand {
    line-clamp: 1;
    -webkit-line-clamp: 1;
    font-weight: 500;
  }

  &__name {
    line-clamp: 2;
    -webkit-line-clamp: 2;
  }

  &__image-container {
    background-color: #fbfaf9;
    border-radius: $cdr-radius-softer;
    margin-bottom: $cdr-space-three-quarter-x;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  &__image {
    width: 100%;
    max-height: var(--recommended-product-size, 168px);
    max-width: var(--recommended-product-size, 168px);
    mix-blend-mode: multiply;
    padding: $cdr-space-inset-three-quarter-x;
  }

  &__details {
    display: flex;
    flex-direction: column;
    gap: $cdr-space-half-x;
    padding-right: $cdr-space-one-and-a-half-x;
  }

  &__rating-stars {
    margin-left: -3px;
  }
}
</style>
