<template>
  <CdrContainer class="showcase">
    <CdrHeadingSerif class="showcase__heading" tag="h1" scale="4"
      >Carousel showcase</CdrHeadingSerif
    >
    <div>
      <CdrSubheadingSans class="showcase__subheading" tag="h2"
        >Recommended products</CdrSubheadingSans
      >
      <CarouselEngine
        class="showcase__carousel"
        :model="recommendedProductModelData"
        :adapter="RecommendedProductAdapter"
        @slide-click="recommendedProductOnSlideClick"
        @arrow-click="recommendedProductOnArrowClick"
      />
    </div>
    <div>
      <CdrSubheadingSans class="showcase__subheading" tag="h2"
        >Lifestyle</CdrSubheadingSans
      >
      <CarouselEngine
        class="showcase__carousel"
        :model="lifestyleModelData"
        :adapter="LifestyleAdapter"
        @slide-click="lifestyleOnSlideClick"
        @arrow-click="lifestyleOnArrowClick"
      />
    </div>
  </CdrContainer>
</template>

<script setup lang="ts">
import CarouselEngine from '../src/components/CarouselEngine.vue';
import type { RecommendedProductModel } from './implementation/RecommendedProduct';
import type { LifestyleModel } from './implementation/Lifestyle';
import recommendedProductModel from './implementation/RecommendedProduct/mock.json';
import lifestyleModel from './implementation/Lifestyle/mock.json';

// Models
const recommendedProductModelData =
  recommendedProductModel as RecommendedProductModel;
const lifestyleModelData = lifestyleModel as LifestyleModel;

// Handlers
import {
  onSlideClick as recommendedProductOnSlideClick,
  onArrowClick as recommendedProductOnArrowClick,
} from './implementation/RecommendedProduct/handlers';
import {
  onSlideClick as lifestyleOnSlideClick,
  onArrowClick as lifestyleOnArrowClick,
} from './implementation/Lifestyle/handlers';

// Adapters
import RecommendedProductAdapter from './implementation/RecommendedProduct/adapter';
import LifestyleAdapter from './implementation/Lifestyle/adapter';
import { CdrContainer, CdrHeadingSerif, CdrSubheadingSans } from '@rei/cedar';
</script>

<style lang="scss" scoped>
.showcase {
  &__heading {
    margin-top: $cdr-space-three-x;
    margin-bottom: $cdr-space-one-x;
  }

  &__subheading {
    margin-bottom: $cdr-space-one-x;
  }

  &__carousel {
    & :deep(.scroll-carousel) {
      margin-left: -$cdr-space-one-x;
      margin-right: -$cdr-space-one-x;

      @include cdr-sm-mq-up {
        margin-left: auto;
        margin-right: auto;
      }
    }
  }
}
</style>
