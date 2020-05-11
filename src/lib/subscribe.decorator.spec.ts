import { fixture, expect } from '@open-wc/testing';
import { from, Subject } from 'rxjs';

import { RxLitElement } from './rx-lit.element';
import { subscribe } from './subscribe.decorator';

const stream$ = new Subject<number>();

class DemoElement extends RxLitElement {
  @subscribe(from([1]))
  streamValues?: number;

  @subscribe(stream$)
  subjectValues?: number;
}
window.customElements.define('demo-subscribe-element', DemoElement);

describe('Subscribe decorator', () => {
  let element: DemoElement;
  beforeEach(async () => {
    element = await fixture<DemoElement>(
      '<demo-subscribe-element></demo-subscribe-element>'
    );
  });

  it('can handle simple Observable', async () => {
    expect(element.streamValues).equal(1);
  });

  it('will unsubscribe when destroyed', async () => {
    stream$.next(1);
    expect(element.subjectValues).equal(1);
    expect(stream$.observers.length).equal(1);

    element.remove();

    expect(stream$.observers.length).equal(0);
  });
});
