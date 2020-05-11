import { fixture, expect } from '@open-wc/testing';
import { from, Observable, Subject } from 'rxjs';

import { RxLitElement } from './rx-lit.element';

class DemoElement extends RxLitElement {
  streamValues: unknown | undefined;

  setupObservable(stream$: Observable<unknown>) {
    this.subscribe('streamValues', stream$);
  }
}
window.customElements.define('demo-testing-element', DemoElement);

describe('RxLitElement', () => {
  let element: DemoElement;

  beforeEach(async () => {
    element = await fixture('<demo-testing-element></demo-testing-element>');
  });

  it('can be initialized', async () => {
    expect(element).to.be.ok;
  });

  it('can handle simple Observable', async () => {
    element.setupObservable(from([1]));
    expect(element.streamValues).equal(1);
  });

  it('can handle invalid input', async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(() => element.setupObservable(null!)).to.throw(
      'Invalid Observable!'
    );
    expect(() => element.setupObservable({} as Observable<unknown>)).to.throw(
      'Invalid Observable!'
    );
  });

  it('will unsubscribe when destroyed', async () => {
    const stream$ = new Subject();
    element.setupObservable(stream$);

    stream$.next(1);
    expect(element.streamValues).equal(1);
    expect(stream$.observers.length).equal(1);

    element.remove();

    expect(stream$.observers.length).equal(0);
  });

  it('will unsubscribe when called with a different stream', async () => {
    const stream$ = new Subject();
    element.setupObservable(stream$);

    stream$.next(1);
    expect(element.streamValues).equal(1);
    expect(stream$.observers.length).equal(1);

    element.setupObservable(new Subject());

    expect(stream$.observers.length).equal(0);
  });

  it('will ignore calls with the same stream', async () => {
    const stream$ = new Subject();
    element.setupObservable(stream$);

    stream$.next(1);
    expect(element.streamValues).equal(1);
    expect(stream$.observers.length).equal(1);

    element.setupObservable(stream$);

    expect(stream$.observers.length).equal(1);
  });
});
