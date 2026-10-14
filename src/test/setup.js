import '@testing-library/jest-dom';
import React from 'react';
import { vi } from 'vitest';

window.scrollTo = vi.fn();
if (typeof Element !== 'undefined') {
  Element.prototype.scrollIntoView = vi.fn();
}
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    Link: ({ to, children, ...props }) =>
      React.createElement('a', { href: to, ...props }, children),
  };
});