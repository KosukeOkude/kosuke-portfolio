export function whenDomReady(callback: () => void): void {
  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', callback, { once: true })
  } else {
    callback();
  }
}