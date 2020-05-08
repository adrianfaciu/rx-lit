import { LitElement } from 'lit-element';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export function smartSubscribe<K extends LitElement>(
  propertyKey: keyof K,
  stream: Observable<K[keyof K]>,
  element: K
) {
  const unsubscribe$ = getUnsubscribeStream(element);

  stream.pipe(takeUntil(unsubscribe$)).subscribe((res) => {
    element[propertyKey] = res;
    element.requestUpdate();
  });
}

const UNSUBSCRIBE_NAME = Symbol('unsubscribe');

interface WithUnsubscribe {
  [UNSUBSCRIBE_NAME]?: Subject<void>;
}

function getUnsubscribeStream<T extends LitElement & WithUnsubscribe>(
  element: T
) {
  const unsubscribe$ = element[UNSUBSCRIBE_NAME] || new Subject<void>();

  if (!element[UNSUBSCRIBE_NAME]) {
    element[UNSUBSCRIBE_NAME] = unsubscribe$;

    const initialDisconnectedCallback = element.disconnectedCallback;
    element.disconnectedCallback = () => {
      unsubscribe$.next();
      initialDisconnectedCallback();
    };
  }

  return unsubscribe$;
}
