# Rx Lit

![Build](https://github.com/adrianfaciu/rx-lit/workflows/Build/badge.svg)
[![npm version](https://badge.fury.io/js/rx-lit.svg)](https://badge.fury.io/js/rx-lit)

- [Reasoning](#reasoning)
- [RxLitElement](#RxLitElement)
- [Decorator](#Decorator)
- [Why](#Why)

## Reasoning

Working with Observables inside a LitElement component is easy enough, but it involves a bit of code. We need at least to subscribe, unsubscribe and make sure we schedule an update when we get a new value. An implementation might look like this:

```typescript
class DemoElement extends LitElement {
  unsubscribe$ = new Subject();
  streamValues: number;

  connectedCallback() {
    super.connectedCallback();
    stream$.pipe(takeUntil(this.unsubscribe$)).subscribe((res) => {
      this.streamValues = number;
      this.requestUpdate();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.unsubscribe$.next();
  }
}
```

We can avoid writing this code for each Observable using _RxLitElement_ base class.

## RxLitElement

RxLitElement is a base class, that extends LitElement, and provides a _subscribe_ method.

Definition: `subscribe(propKey, stream$)`. We pass in the property we want to assign values to and the Observable we want to subscribe.

Using it we can rewrite the above code:

```typescript
class DemoElement extends RxLitElement {
  streamValues: number;

  connectedCallback() {
    super.connectedCallback();
    this.subscribe('streamValues', stream$);
  }
}
```

Beside abstracting away some of the code, we have some other benefits:

- type safety (we can use only existing property names and Observable objects)
- unsubscribes when the component is removed
- unsubscribes from old observable if called again on the same property with different Observable
- ignores calls on the same property with the same Observable

## Decorator

In some cases, we can use a decorator to simplify further. If the Observable we want to subscribe to is not a property of our class, we can simplify the code:

```typescript
class DemoElement extends LitElement {
  @subscribe(stream$)
  streamValues: number;

  @subscribe(from([1]))
  anotherStreamValues: number;
}
```

## Why

Why not a simple function?

You cannot monkey patch life cycle hooks of custom elements. This means we cannot extend the functionality of disconnectedCallback to know when the element was removed and unsubscribe.

Why not a lit-html directive?

There is not straight forward way of knowing when the element is removed. So again, we cannot unsubscribe from our Observable.

If you know a solution to this problems or have a different idea, feel free to open a pull request :)
