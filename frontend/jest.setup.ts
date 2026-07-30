import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

if (!globalThis.TextEncoder) {
  globalThis.TextEncoder = TextEncoder;
}
if (!globalThis.TextDecoder) {
  globalThis.TextDecoder = TextDecoder as unknown as typeof globalThis.TextDecoder;
}

// Mock react-router navigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// CustomEvent polyfill
if (typeof globalThis.CustomEvent !== 'function') {
  class CustomEventPolyfill<T = unknown> extends Event implements CustomEvent<T> {
    detail: T;

    constructor(type: string, eventInitDict?: CustomEventInit<T>) {
      super(type, eventInitDict);
      this.detail = eventInitDict?.detail as T;
    }

    initCustomEvent(
      type: string,
      bubbles?: boolean,
      cancelable?: boolean,
      detail?: T
    ): void {
      (this as unknown as { detail: T }).detail = detail as T;
    }
  }

  globalThis.CustomEvent = CustomEventPolyfill as {
    new <T>(type: string, eventInitDict?: CustomEventInit<T>): CustomEvent<T>;
    prototype: CustomEvent<unknown>;
  };
}
