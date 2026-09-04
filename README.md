# Novera — E-Commerce Microservices Platform

Novera is a full-stack e-commerce application: a React frontend backed by six
independent Spring Boot microservices, each owning its own PostgreSQL
database, fronted by a single API gateway. It runs the same way locally via
Docker Compose or on Kubernetes.

For the story of how this project got built out — the Kubernetes concepts,
the problems hit along the way, the CI/CD pipeline — see
[`DevopsIntegration.md`](./DevopsIntegration.md). This file is the
"how do I actually run it" reference.

## Contents

- [Architecture](#architecture)
- [Tech stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Environment variables](#environment-variables)
- [Run with Docker Compose](#run-with-docker-compose)
- [Run with Kubernetes](#run-with-kubernetes)
- [Product images: local files vs. ImageKit](#product-images-local-files-vs-imagekit)
- [Useful commands](#useful-commands)
- [Project structure](#project-structure)
- [Security notes](#security-notes)

## Architecture

```
                         Browser
                            │
                            ▼
                    frontend (nginx, :80)
                            │
                   /api/*   │   everything else → static React app
                            ▼
                    gateway-service (:8085)
                            │
        ┌───────────┬───────────┬───────────┬───────────┐
        ▼           ▼           ▼           ▼           ▼
   authentication  product     cart       order       payment
      :8080         :8081      :8082      :8083        :8084
        │           │           │           │           │
        ▼           ▼           ▼           ▼           ▼
  novera_auth_db  productdb  novera_cart_db  novera_orders  novera_payment_db
        └───────────┴───────────┴───────────┴───────────┘
                            │
                      PostgreSQL 17
              (one server, five databases — one per service)
```

The frontend never talks to a backend service directly — everything goes
through the gateway at `/api/*`. Each service owns its database exclusively;
services talk to each other over HTTP, never by touching another service's
tables.

| Service | Port | Owns | Responsibility |
|---|---|---|---|
| `authentication-service` | 8080 | `novera_auth_db` | Register/login, JWT issuing, addresses |
| `product-service` | 8081 | `productdb` | Product catalog, categories, images (URLs) |
| `cart-service` | 8082 | `novera_cart_db` | Per-user cart |
| `order-service` | 8083 | `novera_orders` | Checkout, order history |
| `payment-service` (dir: `paymnet-service`) | 8084 | `novera_payment_db` | Razorpay payment flow |
| `gateway-service` | 8085 | — | Single entry point, routes `/api/*` to the above |
| `frontend` | 80 | — | React app (nginx), serves the SPA and proxies `/api/*` to the gateway |

## Tech stack

- **Backend**: Java 21, Spring Boot 4.1, Spring Security + JWT (`jjwt`), Spring Data JPA / Hibernate, springdoc-openapi (Swagger UI), Razorpay Java SDK (`payment-service`)
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, TanStack Query, React Hook Form + Zod, React Router
- **Database**: PostgreSQL 17, one database per service
- **Infra**: Docker / Docker Compose, Kubernetes (tested on Docker Desktop's built-in cluster) with an NGINX Ingress controller, GitHub Actions CI

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/), running
- For the Kubernetes path only: Kubernetes enabled in Docker Desktop, and the
  [NGINX Ingress controller](https://kubernetes.github.io/ingress-nginx/deploy/)
  installed in the cluster
- No local Java, Maven, Node.js, or PostgreSQL installation is required —
  everything builds inside containers

If a local PostgreSQL is already running on port `5432`, stop it first; Docker
publishes PostgreSQL on that same host port.

## Environment variables

Both deployment paths need the same set of values — Docker Compose reads them
from a root `.env` file, Kubernetes reads them from a `ConfigMap` (non-secret
values, already committed in `k8s/base/novera-configmap.yaml`) and a `Secret`
(sensitive values, gitignored, you create it locally).

Copy the template and fill in real values:

```bash
cp .env.example .env
```

| Variable | Used for | Notes |
|---|---|---|
| `POSTGRES_USER` | DB connection | `postgres` is fine for local dev |
| `POSTGRES_PASSWORD` | DB connection | pick your own for local dev |
| `JWT_SECRET` | Signing/verifying login tokens | any long random string, e.g. `openssl rand -hex 32` |
| `JWT_EXPIRATION` | Token lifetime, ms | `86400000` = 24h |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | `payment-service` → Razorpay | test keys from the [Razorpay dashboard](https://dashboard.razorpay.com/app/keys) |
| `AUTH_DB_URL` / `CART_DB_URL` / `ORDER_DB_URL` / `PAYMENT_DB_URL` / `PRODUCT_DB_URL` | Each service's JDBC URL | point at the `postgres-db` service DNS name, not `localhost` — see `.env.example` |
| `AUTH_SERVICE_URL` / `PRODUCT_SERVICE_URL` / `CART_SERVICE_URL` / `ORDER_SERVICE_URL` / `PAYMENT_SERVICE_URL` / `GATEWAY_SERVICE_URL` | Service-to-service calls (e.g. the gateway routing to each service, `order-service` calling `cart-service`) | Docker Compose/Kubernetes service DNS names — see `.env.example` |

`.env` and `k8s/base/novera-secret.yaml` are both gitignored — never commit
real secrets. `.env.example` and `k8s/base/novera-secret.example.yaml` are the
committed templates; copy and fill them in.

The frontend does **not** need any `VITE_*` env vars for either deployment
path: the build's API services default to same-origin relative paths
(`/api/...`), and nginx (`frontend/novera-frontend/nginx.conf`) proxies
`/api/*` straight to `gateway-service:8085` inside the container network.
`VITE_*` vars only matter if you run the Vite dev server (`npm run dev`)
against a gateway on a different origin.

## Run with Docker Compose

```bash
git clone <repository-url>
cd shoesApp
cp .env.example .env   # then edit .env with real values
docker compose up -d --build
```

Open:

- Frontend: <http://localhost:3000>
- Gateway actuator: <http://localhost:8085/actuator/health>

On first run, Postgres initializes an empty `postgres_data` volume and
automatically:

1. runs `postgres/init.sql`, creating the five per-service databases, then
2. runs `postgres/restore-data.sh`, which `pg_restore`s the seed data
   committed in the repo's `*.dump` files into those databases.

Both only run once, against an **empty** data directory — they're standard
`postgres` image `docker-entrypoint-initdb.d` scripts, so they never touch an
existing volume with data in it. You get a fully working app with real seed
products, a couple of test users, etc. with a single `docker compose up`,
nothing manual.

If you want to wipe and reinitialize from scratch (e.g. to re-pull an updated
dump):

```bash
docker compose down -v   # -v also removes the postgres_data volume
docker compose up -d --build
```

Hibernate manages the schema on top of the restored data
(`spring.jpa.hibernate.ddl-auto=update`); the dumps carry both schema and
rows, so this isn't a from-scratch migration path — see
[Create new dumps](#create-new-dumps) below if you change the schema.

### Create new dumps

```bash
docker exec postgres-db pg_dump -U postgres -Fc -d productdb -f /tmp/productdb.dump
docker cp postgres-db:/tmp/productdb.dump ./productdb.dump
```

Repeat for each service's database (`novera_auth_db`, `novera_cart_db`,
`novera_orders`, `novera_payment_db`). `-Fc` is PostgreSQL's custom format,
compact and restorable with `pg_restore`. Commit the updated `.dump` files —
they're deliberately tracked in git as the project's seed data (see
[Security notes](#security-notes) for what should *never* go in a dump).

## Run with Kubernetes

Tested against Docker Desktop's built-in Kubernetes (context `docker-desktop`).

**1. Create the namespace and the gitignored Secret:**

```bash
kubectl apply -f k8s/base/namespace.yaml
cp k8s/base/novera-secret.example.yaml k8s/base/novera-secret.yaml
# edit novera-secret.yaml: base64-encode each real value with
#   echo -n "your-value" | base64
kubectl apply -f k8s/base/novera-secret.yaml
```

**2. Apply everything else:**

```bash
kubectl apply -f k8s/base/
```

`kubectl apply -f <dir>` applies every manifest in the directory; `kubectl`
prioritizes creating resources like `Namespace`/`Secret`/`ConfigMap` before
the things that reference them, regardless of file name order, so this one
command is normally enough. If anything errors on a truly first-ever apply,
it's almost always a one-time ordering hiccup — re-running the same command
is safe and picks up whatever didn't get created the first time.

**3. Wait for pods to come up** (Spring Boot services take a little while to
boot and connect to the database):

```bash
kubectl get pods -n novera -w
```

Postgres runs as a `StatefulSet` (`postgres-db-0`) with a `PersistentVolumeClaim`.
On first boot against an empty volume it runs the same `init.sql` +
`restore-data.sh` pair as Docker Compose — mounted via the
`postgres-init` ConfigMap (`k8s/base/postgres-init-configmap.yaml`,
which embeds the seed-data dumps as base64) — so you get the same
fully-seeded database automatically, no manual `pg_restore` needed.

**4. Open the app:**

- Frontend + API (via the NGINX Ingress, path-routed: `/` → frontend, `/api` → gateway): <http://localhost>

If `kubectl get ingress -n novera` shows no address, the NGINX Ingress
controller isn't installed — install it, then re-check.

### Resetting the Kubernetes database

Like Compose, the init scripts only run once against an empty volume. To
force a clean reinitialization (e.g. after changing `postgres-init-configmap.yaml`):

```bash
kubectl scale statefulset postgres-db -n novera --replicas=0
kubectl delete pvc postgres-pvc -n novera
kubectl apply -f k8s/base/postgres-pvc.yaml
kubectl scale statefulset postgres-db -n novera --replicas=1
```

Scaling to 0 first matters — deleting the PVC while a pod still references it
just recreates the pod against the same, still-populated volume instead of
actually wiping it.

## Product images: local files vs. ImageKit

Nothing in this codebase stores or serves image *files*. `product_images.image_url`
(and the API's `imageUrls` field) is just a plain URL string — `product-service`
never receives an upload, and there's no local static file server for images.

The seed data's product photos are all hosted on
[ImageKit](https://imagekit.io) (`https://ik.imagekit.io/...`), a free-tier
image CDN: upload originals there, then paste the resulting URL into
`image_url` for a product. That's the whole integration — no SDK, no backend
config, it's just an HTTP URL.

The gitignored `images/` folder at the repo root is only a local staging
place for original image files before they're uploaded to ImageKit (or
wherever) — the app never reads from it. If you'd rather serve images
yourself instead of a CDN, the only change needed is what URL you put in
`image_url`; e.g. point it at a static file server or an object storage
bucket's public URL. There's no code path to update.

## Useful commands

**Docker Compose**

```bash
docker compose ps
docker compose logs -f gateway-service
docker exec -it postgres-db psql -U postgres -d productdb -c "\dt"
```

**Kubernetes**

```bash
kubectl get pods -n novera
kubectl logs -f deployment/gateway-service -n novera
kubectl exec -it postgres-db-0 -n novera -- psql -U postgres -d productdb -c "\dt"
kubectl rollout restart deployment/product-service -n novera
```

## Project structure

```text
docker-compose.yml
.env.example
postgres/
  init.sql            # creates the 5 per-service databases
  restore-data.sh      # restores the seed-data dumps into them
k8s/base/               # one manifest per resource; kubectl apply -f k8s/base/
  novera-secret.example.yaml
  postgres-init-configmap.yaml
  ...
authentication-service/
product-service/
cart-service/
order-service/
paymnet-service/         # payment-service
gateway-service/
frontend/novera-frontend/
*.dump                    # seed data, restored automatically on first boot
```

Each backend service builds its own JAR via a multi-stage Maven Dockerfile,
so a fresh clone builds everything itself — no host-installed Java/Maven
needed.

## Security notes

- `.env` and `k8s/base/novera-secret.yaml` are gitignored. Never commit real
  passwords, JWT secrets, or Razorpay keys — use `.env.example` /
  `novera-secret.example.yaml` as templates instead.
- The `*.dump` files are committed intentionally as development seed data.
  Before creating a new dump, make sure it contains no real customer data,
  real payment details, or production credentials — dumps carry table rows
  as-is.
- This project uses Hibernate `ddl-auto=update` and has no schema migration
  tool yet (no Liquibase/Flyway). Fine for local/learning use; a real
  production setup should pin `ddl-auto=validate` and manage schema changes
  through reviewed migrations instead.
