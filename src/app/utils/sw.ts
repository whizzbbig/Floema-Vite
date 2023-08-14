if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/src/app/service-worker.js')

    .then(function (registration) {
      console.log('Service Worker OK : ', registration.scope);
    })
    .catch(function (error) {
      console.log('Service Worker Failed :', error);
    });
}
