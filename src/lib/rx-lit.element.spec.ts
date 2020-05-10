import { fixture, expect } from '@open-wc/testing';

import { RxLitElement } from './rx-lit.element';

class DemoElement extends RxLitElement {}
window.customElements.define('demo-testing-element', DemoElement);

describe('RxLitElement', () => {
  it('can be initialized', async () => {
    const element = await fixture(
      '<demo-testing-element></demo-testing-element>'
    );
    expect(element).to.be.ok;
  });
});
