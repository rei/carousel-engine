# Carousel Engine

Carousel Engine is a flexible, adapter-driven Vue 3 carousel framework that leverages the Adapter Pattern to separate data transformation from rendering. This is a forked and re-architected version of `@rei/recommendations-slider`, designed for greater modularity and reusability.

## 📦 Installation

```bash
$ npm i @rei/carousel-engine
```

## 🚀 Usage

Using CarouselEngine involves three key steps:

1. Define an Adapter (Transforms raw model data into a carousel format)
2. Provide a Model (Pass structured data to the carousel)
3. Handle Events (Optional) (Define custom event handlers for interactions)

### 1️⃣ Define an Adapter

An adapter maps raw model data to a structured carousel configuration.

```ts
// adapter.ts
import type { LifestyleModel, LifestyleSlide } from '.';
import type {
  CarouselAdapter,
  CarouselConfig,
  Slide,
} from '@rei/carousel-engine';

import SlideComponent from './LifestyleSlide.vue';

export const adapter: CarouselAdapter<LifestyleSlide> = (modelData) => {
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
   * @type {Slide<LifestyleSlide>[]}
   */
  const slides: Slide<LifestyleSlide>[] = Array.isArray(slideItems)
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
   * Constructs the carousel config with the resolved slides and metadata.
   *
   * @type {CarouselConfig<LifestyleSlide>}
   */
  const carouselConfig: CarouselConfig<LifestyleSlide> = {
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
```

### 2️⃣ Provide a Model & Render the Carousel

In a Vue component, pass the model and adapter to CarouselEngine. Your model is passed to your adapter, which transforms it into a structured carousel configuration.

```vue
<template>
  <CarouselEngine :model="model" :adapter="adapter" />
</template>

<script setup lang="ts">
import CarouselEngine from '@rei/carousel-engine';
import adapter from './adapter';

import lifestyleModelData from './mock.json';
import type { LifestyleModel } from './implementation/Lifestyle';

const model = lifestyleModelData as LifestyleModel;
</script>
```

### 3️⃣ Handle Events

Carousel Engine emits several named events:

- `arrowClick` - Emitted when an arrow is clicked.
- `resize` - Emitted when the carousel resize observer fires.

```ts
// handlers.ts
import type { CarouselArrowClickPayload } from '@rei/carousel-engine';
import type { LifestyleModel, LifestyleSlideClickPayload } from '.';

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
```

Attach the handler:

```vue
<template>
  <CarouselEngine
    :model="model"
    :adapter="adapter"
    @arrow-click="onArrowClick"
  />
</template>

<script setup lang="ts">
import CarouselEngine from '@rei/carousel-engine';

import { onSlideClick, onArrowClick } from './handlers';
</script>
```

#### Resizing

There is a default resizing strategy that you can enable for general use. Enable it by setting `useDefaultResizeStrategy` to `true` from your implementation's adapter. It is disabled by default.

```ts
// adapter.ts
...
/**
 * Constructs the carousel config with the resolved slides and metadata.
 *
 * @type {CarouselConfig<LifestyleSlide>}
 */
const carouselConfig: CarouselConfig<LifestyleSlide> = {
  component: SlideComponent,
  slides,
  carouselId,
  description: 'Lifestyle carousel',
  slidesGap: parseInt(CdrSpaceThreeQuarterX, 10),
  slidesToShow: slidesVisible,
  focusSelector: ':first-child a',
  useDefaultResizeStrategy: true, // <-- here
};

return carouselConfig;
...
```

If you need to customize the resize strategy, you can attach a handler to the `resize` event. The resize event is emitted when the carousel resize observer fires. It provides the `slidesToShow` and `slidesToScroll` references which can be used to update the carousel's internal state.

Define a handler:

```ts
/**
 * Handles window resize events and updates the carousel's
 * internal state for `slidesToShow` and `slidesToScroll` based
 * on the current window size.
 *
 * @param {unknown} payload - The event payload containing
 *   information about the carousel's config and model.
 * @return {void}
 */
export function onResize(payload: unknown): void {
  const {
    slidesToScroll,
    slidesToShow,
    model = {},
  } = payload as CarouselResizePayload;
  const { slidesVisible = 3 } = model as Partial<LifestyleModel>;

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
}
```

Attach the handler:

```vue
<template>
  <CarouselEngine
    :model="model"
    :adapter="adapter"
    @arrow-click="onArrowClick"
    @resize="onResize"
  />
</template>

<script setup lang="ts">
import CarouselEngine from '@rei/carousel-engine';

import { onSlideClick, onArrowClick, onResize } from './handlers';
</script>
```

#### Custom Events (Provide/Inject)

Carousel Engine supports custom events by using Provide/Inject. If you need to bubble an event to a parent component, `CarouselEngine.vue` provides the `emitEvent` function. In your components, you can Inject the `emitEvent` function and use it to emit custom events.

```vue
<template>
  <button class="slide__button" @click.once="onSlideClick"></button>
</template>
<script setup lang="ts">
import type { CarouselEventEmitter } from '@rei/carousel-engine';
import { CarouselEventKey } from '@rei/carousel-engine';

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
  } as LifestyleSlideClickPayload);
};
</script>
```

Now, define a handler for the `slideClick` event:

```ts
import type { CarouselArrowClickPayload } from '@rei/carousel-engine';
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
```

Attach the handler:

```vue
<template>
  <CarouselEngine
    :model="lifestyleModelData"
    :adapter="LifestyleAdapter"
    @slide-click="onSlideClick"
    @arrow-click="onArrowClick"
    @resize="onResize"
  />
</template>

<script setup lang="ts">
import CarouselEngine from 'carousel-engine';
import LifestyleAdapter from './adapter';
import lifestyleModelData from './mock.json';
import { onSlideClick, onArrowClick, onResize } from './handlers';
</script>
```

## 🏗 Architectural Overview

Carousel Engine is built with a layered architecture that separates concerns into four key layers:

### 1️⃣ Engine Layer (Core Carousel Logic)

- The Carousel Engine component acts as the orchestrator, managing carousel state, event handling, and rendering.
- Handles carousel navigation, focus management, and slide transitions, while remaining agnostic to specific implementations.

### 2️⃣ Adapter Layer (Model Transformation & Customization)

- Adapters define how raw model data is transformed into a standardized carousel structure.
- Implements the Adapter Pattern, allowing different data formats to be consumed without modifying the core engine.

### 3️⃣ Handler Layer (Event Processing & Consumer Interactions)

- Handlers allow consumers to define custom event logic for slides and navigation without modifying the core engine.
- Arbitrary events can be emitted with Provide/Inject, enabling per-instance overrides.
- Supports tracking analytics, logging, or triggering additional UI behaviors in a fully decoupled way.

### 4️⃣ Model-Driven Rendering (Data as the Source of Truth)

- The entire carousel is driven by a structured model, making it highly flexible.
- Consumers pass a model object and an adapter, and CarouselEngine dynamically constructs the carousel.
- Enables easy A/B testing, content variations, and dynamic configurations without modifying components.

## Examples

Check out the `examples` folder for more detailed examples. You can also run the local development environment to see how it works in SFCs:

```bash
git clone git@github.com:rei/carousel-engine.git
cd carousel-engine
npm ci
npm run dev
```
