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

  subscribe<Key extends keyof this>(prop: Key, stream$: Observable<this[Key]>) {
    if (!isObservable(stream$)) throw new Error('Invalid Observable!');

    const existingSubscription = this[subscriptions].get(prop);
    if (existingSubscription) {
      if (existingSubscription?.stream$ === stream$) return;
      else existingSubscription?.subscription?.unsubscribe();
    }

    const subscription = stream$
      .pipe(takeUntil(this[unsubscribe]))
      .subscribe((res) => {
        this[prop] = res;
        this.requestUpdate();
      });

    this[subscriptions].set(prop, { stream$, subscription });
  }

  disconnectedCallback() {
    this[unsubscribe].next();
    super.disconnectedCallback();
  }
}
