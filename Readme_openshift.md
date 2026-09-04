# Novera on OpenShift

This branch (`OpenShiftAndFrontend`) adapts the Novera k8s manifests to run
on OpenShift instead of plain Kubernetes / Docker Desktop. This file covers
two things: exactly what's different from `main`, and how to actually deploy
this branch to an OpenShift cluster.

It forked from `main` at commit `57be307` ("Copy novera-frontend folder from
branch2") — before `main`'s later frontend redesign, its Docker Compose
seed-data automation, and its `.gitignore` fixes. Those are called out below
as gaps, not omitted silently.

## Contents

- [What's different from main](#whats-different-from-main)
- [What was fixed on this branch](#what-was-fixed-on-this-branch)
- [How to deploy to OpenShift](#how-to-deploy-to-openshift)
- [Verifying the deployment](#verifying-the-deployment)

## What's different from main

### 1. No hardcoded `namespace:` in any manifest

Every manifest in `k8s/base/` had its `namespace: novera` field commented
out, and `namespace.yaml` itself is entirely commented out. This is
deliberate and correct for OpenShift: you don't usually create a `Namespace`
object yourself there — you work inside an OpenShift **Project** (a
`Namespace` under the hood) that's either already assigned to you (e.g. a
Developer Sandbox gives you `<username>-dev`, `<username>-stage`, etc.) or
that you create with `oc new-project`. Hardcoding `namespace: novera` into
every manifest would fight that model. `oc apply -f <file>` applies to
whatever project is currently active (`oc project <name>`).

### 2. Postgres: `PGDATA` moved to a subdirectory

`postgres-statefulset.yaml` adds:

```yaml
- name: PGDATA
  value: /var/lib/postgresql/data/pgdata
```

This is the standard fix for running the official `postgres` image under
OpenShift's default `restricted` Security Context Constraint (SCC), which
runs the container as an arbitrary, non-root UID. A freshly mounted PVC often
has a root-owned `lost+found` directory at its root, which makes Postgres's
`initdb` refuse to initialize what it sees as a "non-empty" data directory.
Pointing `PGDATA` at a subdirectory of the mount sidesteps that.

### 3. Frontend: non-root, port 8080, and a writable nginx setup

Three changes, all serving the same goal — running nginx as an arbitrary
non-root UID under the `restricted` SCC:

- **Port 8080, not 80.** Non-root can't bind to ports below 1024.
  `containerPort`/`targetPort` moved from 80 → 8080 in
  `frontend-deployment.yaml` and `frontend-service.yaml` (the Service's
  external port stays `80`; only the container-side port changed).
- **nginx config comes from a ConfigMap**, not the image. New file
  `k8s/base/frontend-nginx-config.yaml` defines `default.conf` (listening on
  8080), mounted over `/etc/nginx/conf.d/default.conf` — the image's own
  baked-in config (`frontend/novera-frontend/nginx.conf`, unchanged, still
  says `listen 80`) gets overridden at runtime by this mount.
- **Writable paths as `emptyDir` volumes.** nginx needs to write to
  `/var/cache/nginx`, `/var/run`, and its pid file location — all owned by
  root in the base image, so unwritable by an arbitrary UID. The Deployment
  mounts `emptyDir` volumes over each of those paths (the pid file is
  redirected to `/tmp`, itself an `emptyDir` mount).

### 4. Docker Compose now reads secrets from `.env`, like main

`docker-compose.yml` originally had real values written straight into each
service's `environment:` block (`POSTGRES_PASSWORD: postgrey@1029`, a
literal `JWT_SECRET`, `RAZORPAY_KEY_ID: test_key`, etc.), and every service's
DB URL pointed at the same shared `postgres` database instead of its own
(`novera_auth_db`, `productdb`, ...). Both are fixed now: every service uses
`env_file: .env`, and `.env` (gitignored, see `.env.example` for the
template) has the correct per-service database URLs.

### 5. Frontend redesign brought over from main

This branch forked before `main`'s frontend redesign, so it originally still
had the earlier design and even the dead files `main` later deleted
(`FeatureCard.tsx`, `SectionTitle.tsx` ×2, `ProductFilters.tsx`,
`SearchBar.tsx` — none were imported anywhere). Both are now resolved: the
redesigned frontend is here, and those five dead files are deleted.

## What was fixed on this branch

Everything below was found and fixed in one pass — noting them here so the
fix is traceable, not just the end state:

- **Real secrets in `docker-compose.yml` + the shared-database bug** — both
  fixed by switching every service to `env_file: .env` (see #4 above).
- **`novera-configmap.yaml`'s `VITE_*_API` entries were inert** — removed.
  Vite bakes `VITE_*` values into the JS bundle at *build time*; a runtime
  ConfigMap env var can never reach them. `frontend/novera-frontend/.env` has
  all `VITE_*` blank (correct — that's what makes the frontend call relative
  `/api/...` paths), so those entries, and the `frontend-nginx-config.yaml`
  `sub_filter` rules that rewrote `http://localhost:8085`/`http://localhost`
  to an empty string, had nothing to actually rewrite. Both removed — they
  were leftovers from an earlier, abandoned approach (a separate public
  Route for the gateway, called by absolute URL).
- **No `Route` was committed anywhere**, despite the ConfigMap referencing
  one (`gateway-route-datir-dev-dev.apps...`). Added
  `k8s/base/frontend-route.yaml` — see [How to deploy](#how-to-deploy-to-openshift)
  for why only the frontend needs a public Route.
- **No `novera-secret.example.yaml` existed on this branch** (only on
  `main`) despite the deploy steps below depending on one. Added it.
- **`.gitignore` didn't exist at all** on this branch — not broken, entirely
  absent, at the root and in every service directory. `.env` and
  `k8s/base/novera-secret.yaml` were sitting completely unprotected. Root
  cause: the original root `.gitignore` (before this branch even forked)
  contained a rule matching its own filename, silently excluding itself —
  and every other same-named file, repo-wide — from ever being committed.
  Same bug found and fixed on `main` independently. Recreated all seven
  `.gitignore` files here.
- **`k8s/base/frontend-ingress.yaml` was removed** (not by me — found
  already deleted in the working tree). Left it gone: a plain nginx
  `Ingress` isn't the right resource type on OpenShift now that
  `frontend-route.yaml` exists.

Everything above is staged, not committed.

## How to deploy to OpenShift

The frontend's nginx (`location /api/ { proxy_pass http://gateway-service:8085; }`)
already proxies API calls to the gateway internally. That means only the
`frontend` Service needs a public Route — the browser talks to the frontend,
the frontend's nginx talks to the gateway inside the cluster. You don't need
a second public Route for `gateway-service` unless you specifically want to
call the API directly from outside the cluster (e.g. Swagger UI, `curl`).

### Option A — Red Hat Developer Sandbox (free, fastest)

The Route hostname already referenced in this branch's ConfigMap
(`*.apps.rm2.thpm.p1.openshiftapps.com`) matches the pattern of the free,
time-limited [Red Hat Developer
Sandbox](https://developers.redhat.com/developer-sandbox) — a pre-provisioned
OpenShift project (`<your-username>-dev`) with no cluster setup needed. Good
fit for demos and development; sandboxes expire after 30 days (renewable).

1. Sign up / log in at <https://sandbox.redhat.com>, open your sandbox.
2. Copy the `oc login` command from the web console (top right → "Copy
   login command"), run it locally:
   ```bash
   oc login --token=<sha256~...> --server=https://api.rm2.thpm.p1.openshiftapps.com:6443
   ```
3. Switch to your assigned project (the console shows its exact name,
   typically `<username>-dev`):
   ```bash
   oc project <username>-dev
   ```

### Option B — ROSA (Red Hat OpenShift Service on AWS)

For a real, persistent deployment on your own AWS account rather than a
shared time-limited sandbox. This is a paid, production-grade managed
OpenShift cluster running in your AWS account.

1. An AWS account, and the [`rosa` CLI](https://console.redhat.com/openshift/downloads) installed and linked to a Red Hat account.
2. Verify prerequisites and create the cluster (takes ~40 minutes):
   ```bash
   rosa verify quota
   rosa create cluster --cluster-name novera --sts
   ```
3. Once the cluster is `ready`, log in the same way as Option A:
   ```bash
   rosa create admin --cluster novera   # prints an oc login command
   oc project -q                         # or: oc new-project novera
   ```

Either path lands you in an OpenShift project with `oc` pointed at it — the
rest of the steps are identical.

### Deploy

1. **Create the Secret** (gitignored, not in git — same values as `main`'s
   `.env.example` / `k8s/base/novera-secret.example.yaml`, just base64-encoded):
   ```bash
   cp k8s/base/novera-secret.example.yaml k8s/base/novera-secret.yaml
   # edit it: echo -n "your-value" | base64, paste into each field
   oc apply -f k8s/base/novera-secret.yaml
   ```
2. **Apply everything else:**
   ```bash
   oc apply -f k8s/base/
   ```
   `namespace.yaml` is commented out, so this applies cleanly into whatever
   project is currently active — no ordering issues to worry about here,
   unlike the plain-Kubernetes path in `main`'s README.
3. **Watch it come up:**
   ```bash
   oc get pods -w
   ```
4. **Get the Route's public URL:**
   ```bash
   oc get route frontend-route -o jsonpath='{.spec.host}'
   ```
   Open `https://<that-host>` — the Route is set to edge TLS termination
   with an automatic HTTP→HTTPS redirect, so OpenShift terminates TLS with
   its own certificate; no cert management needed on your side.

### If a pod won't start

`oc get pods` showing `CreateContainerConfigError` almost always means the
Secret wasn't created yet, or was created with the wrong name/keys — check
with:

```bash
oc describe pod <pod-name>   # bottom "Events" section names the missing key
oc get secret novera-secret -o yaml
```

`CrashLoopBackOff` on a backend service most often means Postgres isn't
ready yet or a database doesn't exist — check
`oc logs deployment/postgres-db` first, then the crashing service's own
logs (`oc logs deployment/product-service`, etc.) for the actual exception.

## Verifying the deployment

```bash
oc get pods
oc get route
curl -sk https://<frontend-route-host>/api/products?page=0&size=1
```

A `200` with product JSON back means the whole chain — Route → frontend
nginx → gateway → product-service → Postgres — is working end to end.
