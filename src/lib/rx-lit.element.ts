import { LitElement } from 'lit-element';
import { Observable, Subject, Subscription, isObservable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const unsubscribe = Symbol('unsubscribe');
const subscriptions = Symbol('subscriptions');

class ExistingSubscription {
  stream$?: Observable<unknown>;
  subscription?: Subscription;
}

export abstract class RxLitElement extends LitElement {
  [unsubscribe] = new Subject();
  [subscriptions] = new Map<keyof this, ExistingSubscription>();

  /**
   * Subscribes to an observable, sets new values to the property of the class and schedules an update.
   * @param propKey Property of the class to receive values.
   * @param stream$ Observable that will be subscribed to.
   */
  subscribe<Key extends keyof this>(
    propKey: Key,
    stream$: Observable<this[Key]>
  ) {
    if (!isObservable(stream$)) throw new Error('Invalid Observable!');

    const existingSubscription = this[subscriptions].get(propKey);
    if (existingSubscription) {
      if (existingSubscription?.stream$ === stream$) return;
      else existingSubscription?.subscription?.unsubscribe();
    }

    const subscription = stream$
      .pipe(takeUntil(this[unsubscribe]))
      .subscribe((res) => {
        this[propKey] = res;
        this.requestUpdate();
      });

    this[subscriptions].set(propKey, { stream$, subscription });
  }

  disconnectedCallback() {
    this[unsubscribe].next();
    super.disconnectedCallback();
  }
}
