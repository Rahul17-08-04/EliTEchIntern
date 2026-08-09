# Shoply — Offline E-Commerce PWA

Responsive installable PWA demonstrating Service Worker, Cache API, offline shell, localStorage cart persistence, install prompt, and Web Push client/service-worker handlers.

## Run

Service Workers require HTTPS or localhost. From this folder run:

```bash
python -m http.server 5500
```

Open `http://localhost:5500`.

## Offline test
1. Load the app once online.
2. DevTools → Application → Service Workers: confirm `sw.js` is registered.
3. DevTools → Network → Offline.
4. Reload. Cached app shell remains available.

## Push notifications
The UI requests notification permission and the Service Worker handles `push` and `notificationclick`. For real push delivery, generate VAPID keys, put only the public key in `app.js`, send subscriptions to a secure backend, and send Web Push messages from that backend. Never expose the VAPID private key.

## Production improvements
Use HTTPS, IndexedDB for larger offline catalogs/orders, API/database-backed products, authenticated checkout, real 192x192/512x512 PNG icons, and version the cache whenever assets change.
