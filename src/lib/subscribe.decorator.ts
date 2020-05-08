import { LitElement } from 'lit-element';
import { Observable } from 'rxjs';

import { smartSubscribe } from './smart-subscribe';

export const subscribe = <K extends LitElement>(
  stream: Observable<unknown>
) => (targetPrototype: K, propertyKey: string) => {
  if (typeof targetPrototype === 'function')
    throw new Error('Should not be used on static members!');

  if (!stream) throw new Error('Invalid stream!');

  const NEW_PROP_NAME = Symbol(propertyKey);

  Object.defineProperty(targetPrototype, propertyKey, {
    get() {
      if (!Object.prototype.hasOwnProperty.call(this, NEW_PROP_NAME))
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
