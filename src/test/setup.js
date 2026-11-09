import '@testing-library/jest-dom';
import React from 'react';
import { vi } from 'vitest';

window.scrollTo = vi.fn();
if (typeof Element !== 'undefined') {
  Element.prototype.scrollIntoView = vi.fn();
}