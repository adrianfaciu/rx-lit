import { Observable } from 'rxjs';

import { RxLitElement } from './rx-lit.element';

// TODO: Improve typing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const subscribe = (stream: Observable<any>) => <K extends RxLitElement>(
  targetPrototype: K,
  propertyKey: keyof K
) => {
  if (!stream) throw new Error('Invalid stream!');

  const initial = targetPrototype.connectedCallback;
  targetPrototype.connectedCallback = function () {
    initial?.call(this);
    this.subscribe(propertyKey, stream);
  };
};
