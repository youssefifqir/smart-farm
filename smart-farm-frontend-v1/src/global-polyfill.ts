// global-polyfill.ts
// Add this at the very top of your main entry file (before any imports)

declare global {
  interface Window {
    global: Window;
  }
}

if (typeof global === 'undefined') {
  window.global = window;
}

export {};