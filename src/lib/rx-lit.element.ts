import { LitElement } from 'lit-element';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const unsubscribe = Symbol('unsubscribe');

export class RxLitElement extends LitElement {
  [unsubscribe] = new Subject();

  subscribe<Key extends keyof this>(prop: Key, stream: Observable<this[Key]>) {
    stream.pipe(takeUntil(this[unsubscribe])).subscribe((res) => {
      this[prop] = res;
      this.requestUpdate();
    });
  }

  disconnectedCallback() {
    this[unsubscribe].next();
    super.disconnectedCallback();
  }
}
