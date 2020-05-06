import { LitElement } from 'lit-element';
import { Observable } from 'rxjs';

import { smartSubscribe } from './smart-subscribe';

// TODO: Do I care about restricting propertyKey here?
// It's a decorator, I will never pass this manually
export const subscribe = <K extends LitElement>(
  stream: Observable<unknown>
) => (targetPrototype: K, propertyKey: string) => {
  // Do I leave the checks here ?

  // Only for instance members
  if (typeof targetPrototype === 'function')
    throw new Error('Should not be used on static members!');

  // Make sure we get a stream (maybe check type also...)
  if (!stream) throw new Error('Invalid stream!');

  // Whats in the stream, it's a reference, but still, it's executed when? what if it's changed?
  // Experiment with this

  // How about if I have a stream inside my component, there is no way to handle that...

  const NEW_PROP_NAME = Symbol(propertyKey);

  // We define the same property on the constructor, in this way when it's defined on the instance
  // it goes to the prototype
  Object.defineProperty(targetPrototype, propertyKey, {
    get() {
      // This needs to be done only once
      if (!this.hasOwnProperty(NEW_PROP_NAME))
        smartSubscribe(NEW_PROP_NAME, stream, this);

      return this[NEW_PROP_NAME];
    },
    set(value) {
      if (this[NEW_PROP_NAME] === value) {
        return;
      }

      this[NEW_PROP_NAME] = value;
    },
  });
};
