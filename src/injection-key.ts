import type { InjectionKey } from 'vue';
import type { CarouselEventEmitter } from '.';

/**
 * Injection key for providing a `CarouselEventEmitter` instance via Vue's dependency injection system.
 *
 * This key is used to enable event communication within the carousel component tree,
 * allowing child components to emit events without requiring direct parent-child communication.
 *
 * @type {InjectionKey<CarouselEventEmitter>}
 */
export const CarouselEventKey: InjectionKey<CarouselEventEmitter> = Symbol(
  'CarouselEventEmitter',
);
