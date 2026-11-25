import '@testing-library/jest-dom';
import { vi } from 'vitest';

window.scrollTo = vi.fn();
if (typeof Element !== 'undefined') {
  Element.prototype.scrollIntoView = vi.fn();
}
