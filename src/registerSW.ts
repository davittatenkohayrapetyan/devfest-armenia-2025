export function registerSW() {
  if ('serviceWorker' in navigator) {
    // Register service worker
    window.addEventListener('load', () => {
      // The service worker will be automatically registered by vite-plugin-pwa
      // This function can be used for additional PWA setup if needed
      console.log('PWA initialized')
    })
  }
}
