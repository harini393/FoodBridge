import '@testing-library/jest-dom';

// Fix Node 26 + JSDOM AbortSignal mismatch for RequestInit
if (typeof globalThis.Request !== 'undefined') {
  const OriginalRequest = globalThis.Request;
  globalThis.Request = class Request extends OriginalRequest {
    constructor(input: RequestInfo | URL, init?: RequestInit) {
      if (init && 'signal' in init) {
        const { signal: _, ...rest } = init;
        super(input, rest);
      } else {
        super(input, init);
      }
    }
  };
}
