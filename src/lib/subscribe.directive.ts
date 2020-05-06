import { directive, Part, EventPart } from 'lit-html';
import { Observable, Subscription } from 'rxjs';

interface PreviousValue<T> {
  readonly value: T;
  readonly stream: Observable<T>;
  readonly subscription: Subscription;
}

const previousValues = new WeakMap<Part, PreviousValue<unknown>>();

export const subscribe = directive(
  <T>(stream: Observable<T>) => (part: Part) => {
    // Asert typeof part
    if (part instanceof EventPart) {
      throw new Error('subscribe cannot be used in event bindings');
    }

    // When we've already set up this particular stream
    const previousValue = previousValues.get(part);
    if (previousValue !== undefined) {
      if (stream === previousValue.stream) return;
      else previousValue.subscription.unsubscribe();
    }

    // Handle takeUntil... how?
    // How the fk do I unsubscribe...

    // Handle new values
    const subscription = stream.subscribe((value) => {
      // Ignore if same value
      if (previousValue?.value == value) return;

      part.setValue(value);
      part.commit();

      // This could be improved so I set only the new value
      previousValues.set(part, { value, stream, subscription });
    });
  }
);
