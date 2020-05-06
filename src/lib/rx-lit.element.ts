import { LitElement } from 'lit-element';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const unsubscribe = Symbol('unsubscribe');

export class RxLitElement extends LitElement {
  [unsubscribe] = new Subject();

  // TODO: Investigate advanced types (ThisType)
  subscribe(prop: keyof this, stream: Observable<this[keyof this]>) {
    stream.pipe(takeUntil(this[unsubscribe])).subscribe((res) => {
      this[prop] = res;
      this.requestUpdate();
    });
  }

  // TODO: Add method to transform stream into async iterable
  // async *iteratorFromStream(stream: Observable<this[keyof this]>) {
  // while (true) {
  //   await stream
  //     .pipe(takeUntil(this[unsubscribe]))
  //     .forEach((value) => yield value, Promise);
  //   if (done.) return;
  // }
  // try {
  //   const observer: Observer<this[keyof this]> = {
  //     next: (value: this[keyof this]) => yield value
  //     error: (err: any) => void;
  //     complete: () => void;
  //   }
  //   stream.pipe(takeUntil(this[unsubscribe])).subscribe((res) => {
  //     this[prop] = res;
  //     this.requestUpdate();
  //   });
  // }
  /*
    const reader = stream.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          return;
        }
        yield value;
      }
    } finally {
      reader.releaseLock();
    }*/
  // }

  disconnectedCallback() {
    this[unsubscribe].next();
    super.disconnectedCallback();
  }
}

// How would a mixin be better, beside the fact that I would be able to extend more than 1 thing
/*
export const RxMixin = (base: typeof LitElement) =>
  class extends base {
    [unsubscribe] = new Subject();

    subscribe(prop: keyof this, stream: Observable<this[keyof this]>) {
      stream.pipe(takeUntil(this[unsubscribe])).subscribe((res) => {
        this[prop] = res;
        this.requestUpdate();
      });
    }

    disconnectedCallback() {
      this[unsubscribe].next();
      super.disconnectedCallback();
    }
  };
  */
