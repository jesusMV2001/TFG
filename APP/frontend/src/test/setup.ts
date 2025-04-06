import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'
import { vi } from 'vitest'

expect.extend(matchers)

// Mock para TextEncoder
if (typeof TextEncoder === 'undefined') {
  class MockTextEncoder {
    encode(input: string): Uint8Array {
      return new Uint8Array([]);
    }
  }
  global.TextEncoder = MockTextEncoder as any;
}

// Mock para TextDecoder
if (typeof TextDecoder === 'undefined') {
  class MockTextDecoder {
    encoding: string;
    fatal: boolean;
    ignoreBOM: boolean;

    constructor(label?: string, options?: TextDecoderOptions) {
      this.encoding = label || 'utf-8';
      this.fatal = options?.fatal || false;
      this.ignoreBOM = options?.ignoreBOM || false;
    }

    decode(input?: BufferSource): string {
      return '';
    }
  }
  global.TextDecoder = MockTextDecoder as any;
}

// Mock para localStorage
global.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
  length: 0,
  key: vi.fn()
}

// Limpieza después de cada test
afterEach(() => {
  cleanup()
})