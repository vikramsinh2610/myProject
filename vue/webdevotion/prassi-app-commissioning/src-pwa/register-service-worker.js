/*
 * This file is picked up by the build system only
 * when building for PRODUCTION
 */

import { register } from 'register-service-worker';
import { Notify } from 'quasar';

register(process.env.SERVICE_WORKER_FILE, {
  ready() {
    // eslint-disable-next-line no-console
    console.log('App is being served from cache by a service worker.');
  },
  // eslint-disable-next-line no-unused-vars
  cached(registration) {
    // registration -> a ServiceWorkerRegistration instance
    // eslint-disable-next-line no-console
    console.log('Content has been cached for offline use.');
  },
  // eslint-disable-next-line no-unused-vars
  updated(registration) {
    // registration -> a ServiceWorkerRegistration instance
    // eslint-disable-next-line no-console
    console.log('New content is available; please refresh.');
    // eslint-disable-next-line no-undef
    Notify.create({
      message: 'Nuova versione disponibile',
      icon: 'cloud_download',
      closeBtn: 'Aggiorna',
      timeout: 10000,
      onDismiss() {
        // eslint-disable-next-line no-restricted-globals
        location.reload(true);
      },
    });
  },
  offline() {
    // eslint-disable-next-line no-console
    console.log('No internet connection found. App is running in offline mode.');
  },
  error(err) {
    // eslint-disable-next-line no-console
    console.error('Error during service worker registration:', err);
  },
});

// ServiceWorkerRegistration: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration
