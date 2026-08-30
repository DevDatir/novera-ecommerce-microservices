# Frontend quality notes

## Resolved

- Restore visible navigation to Home, Shop, Orders, and Addresses; protected routes still require sign-in.
- Raise CTA and control contrast; use one navy primary action and one teal interaction color.
- Rebuild catalog controls with clear groups, 44px targets, wrapping chips, and adequate gaps.
- Remove non-functional footer actions and reduce footer density.
- Keep unauthenticated cart queries disabled and route all services through the gateway proxy.
- Replace blocking browser alerts with in-app feedback where touched.

## Deferred: backend support required

- Wishlist persistence, email subscriptions, returns, reviews, legal-content management, and delivery tracking.

## Release checks

- Production build must pass.
- Gateway health must report `UP` before testing authenticated cart, checkout, payment, orders, and addresses.
