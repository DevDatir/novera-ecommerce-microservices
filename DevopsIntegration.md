# 🛒 Novera — Docker, Kubernetes & CI/CD Implementation

> A journey from local Spring Boot services to a fully containerized, orchestrated, and automated e-commerce platform.

![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)

---

## 📖 Table of Contents

1. [Project Overview](#-1-project-overview)
2. [Initial Docker Setup](#-2-initial-docker-setup)
3. [PostgreSQL Containerization](#-3-postgresql-containerization)
4. [PostgreSQL Data Migration](#-4-postgresql-data-migration)
5. [Moving to Kubernetes](#-5-moving-postgresql-from-docker-compose-to-kubernetes)
6. [Kubernetes Namespace](#-6-kubernetes-namespace)
7. [Manifest Structure](#-7-kubernetes-manifest-structure)
8. [PostgreSQL StatefulSet](#-8-postgresql-statefulset)
9. [PersistentVolumeClaim](#-9-persistentvolumeclaim)
10. [PostgreSQL Kubernetes Service](#-10-postgresql-kubernetes-service)
11. [Database Restore in Kubernetes](#-11-postgresql-database-restore-in-kubernetes)
12. [kubectl exec Problem](#-12-kubernetes-kubectl-exec-problem)
13. [Backend Deployments](#-13-backend-kubernetes-deployments)
14. [Kubernetes Services](#-14-kubernetes-services)
15. [Gateway Internal Communication](#-15-gateway-internal-service-communication)
16. [Testing Backend Services](#-16-testing-backend-services)
17. [ConfigMaps and Secrets](#-17-configmaps-and-secrets)
18. [Local .env Configuration](#-18-local-env-configuration)
19. [Spring Boot Actuator](#-19-spring-boot-actuator)
20. [Kubernetes Health Probes](#-20-kubernetes-health-probes)
21. [Auth Service Health Problem](#-21-authentication-service-health-probe-problem)
22. [Resource Requests & Limits](#-22-kubernetes-resource-requests-and-limits)
23. [Kubernetes Ingress](#-23-kubernetes-ingress)
24. [NGINX Ingress Controller](#-24-nginx-ingress-controller)
25. [Frontend Ingress](#-25-frontend-ingress)
26. [CORS Problem with Ingress](#-26-cors-problem-with-ingress)
27. [Gateway Routing Through Ingress](#-27-gateway-routing-through-ingress)
28. [Frontend API Configuration](#-28-frontend-api-configuration)
29. [Final Local Architecture](#-29-final-local-kubernetes-architecture)
30. [Manual Scaling](#-30-manual-scaling)
31. [Metrics Server](#-31-metrics-server)
32. [Horizontal Pod Autoscaler](#-32-horizontal-pod-autoscaler)
33. [HPA `<unknown>` Problem](#-33-hpa-unknown-problem)
34. [Rolling Updates](#-34-rolling-updates)
35. [Kubernetes Rollback](#-35-kubernetes-rollback)
36. [Docker Image Versioning](#-36-docker-image-versioning)
37. [GitHub Actions CI](#-37-github-actions-ci)
38. [Why `-DskipTests`](#-38-why--dskiptests-was-used)
39. [Secrets and CI/CD](#-39-secrets-and-cicd)
40. [Docker Hub Auth in Actions](#-40-docker-hub-authentication-in-github-actions)
41. [CI → Docker Build → Docker Hub](#-41-ci--docker-build--docker-hub)
42. [Dockerfile Naming Problem](#-42-dockerfile-naming-problem-in-github-actions)
43. [All Backend Images in CI/CD](#-43-all-backend-images-in-cicd)
44. [React Frontend CI/CD](#-44-react-frontend-cicd)
45. [Vite Env Vars in CI](#-45-vite-environment-variables-in-ci)
46. [Current CI/CD Pipeline](#-46-current-cicd-pipeline)
47. [Self-Hosted Runner](#-47-self-hosted-runner--what-we-discussed)
48. [What a Self-Hosted Runner Does NOT Do](#-48-what-a-self-hosted-runner-does-not-do)
49. [Current Architecture Diagram](#-49-current-novera-kubernetes-architecture)
50. [Problems Encountered & Solutions](#-50-problems-encountered-and-solutions)
51. [Kubernetes Concepts Learned](#-51-kubernetes-concepts-learned)
52. [Project Status](#-52-current-project-status)
53. [Overall DevOps Journey](#-53-overall-devops-journey-so-far)

---

## 🧭 1. Project Overview

**Novera** is an e-commerce application built with a **Spring Boot microservices** architecture, a **React** frontend, **PostgreSQL** databases, **Docker**, and **Kubernetes**.

**Services:**

| Layer | Component |
|---|---|
| Frontend | React / Vite |
| Backend | `authentication-service` |
| Backend | `product-service` |
| Backend | `cart-service` |
| Backend | `order-service` |
| Backend | `payment-service` |
| Backend | `gateway-service` |
| Database | PostgreSQL |

The **Gateway** is the single entry point for backend APIs; the frontend only ever talks to the Gateway.

**Architecture evolution:**

```
Local Spring Boot applications
        ↓
Docker Compose
        ↓
Docker images
        ↓
Kubernetes
        ↓
Kubernetes Ingress
        ↓
CI/CD with GitHub Actions
```

---

## 🐳 2. Initial Docker Setup

Before Kubernetes, every microservice was containerized with its own `Dockerfile` and image. Docker Compose ran the full stack together:

- PostgreSQL
- Authentication Service
- Product Service
- Cart Service
- Order Service
- Payment Service
- Gateway Service
- React Frontend

```yaml
services:

  postgres-db:
    image: postgres:17

  authentication-service:
    build: ./authentication-service

  product-service:
    build: ./product-service

  cart-service:
    build: ./cart-service

  order-service:
    build: ./order-service

  payment-service:
    build: ./paymnet-service

  gateway-service:
    build: ./gateway-service

  frontend:
    build: ./frontend/novera-frontend
```

---

## 🗄️ 3. PostgreSQL Containerization

Rather than depending on a locally installed PostgreSQL server, the database was containerized too.

```yaml
postgres-db:
  image: postgres:17
  container_name: postgres-db
  environment:
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: <password>
    POSTGRES_DB: postgres
```

A **volume** keeps data safe across container recreation:

```yaml
volumes:
  - postgres_data:/var/lib/postgresql/data
```

An **init script** was mounted to bootstrap per-service databases:

```yaml
- ./postgres/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
```

```sql
CREATE DATABASE productdb;
CREATE DATABASE novera_auth_db;
CREATE DATABASE novera_cart_db;
CREATE DATABASE novera_orders;
CREATE DATABASE novera_payment_db;
```

> Follows the microservices principle: **one database per service**.

---

## 📦 4. PostgreSQL Data Migration

Existing local databases were exported to `.dump` files, then restored into the container:

```bash
docker cp productdb.dump postgres-db:/tmp/productdb.dump

docker exec postgres-db pg_restore `
  -U postgres `
  -d productdb `
  --clean `
  --if-exists `
  --no-owner `
  /tmp/productdb.dump
```

The same process was repeated for every service database.

---

## ☸️ 5. Moving PostgreSQL from Docker Compose to Kubernetes

With Compose working, the next goal was running everything on **Kubernetes**.

- **Local environment:** Docker Desktop Kubernetes
- **Context:** `docker-desktop`

```bash
kubectl get nodes
```

---

## 🏷️ 6. Kubernetes Namespace

A dedicated namespace isolates Novera's resources:

```bash
kubectl create namespace novera
kubectl get all -n novera
```

Initial output (expected, since nothing was deployed yet):

```
No resources found in novera namespace.
```

---

## 🗂️ 7. Kubernetes Manifest Structure

```
k8s/
└── base/
    ├── namespace.yaml
    ├── configmap.yaml
    ├── secret.yaml
    ├── postgres-service.yaml
    ├── postgres-statefulset.yaml
    ├── authentication-deployment.yaml
    ├── authentication-service.yaml
    ├── product-deployment.yaml
    ├── product-service.yaml
    ├── cart-deployment.yaml
    ├── cart-service.yaml
    ├── order-deployment.yaml
    ├── order-service.yaml
    ├── payment-deployment.yaml
    ├── payment-service.yaml
    ├── gateway-deployment.yaml
    ├── gateway-service.yaml
    ├── frontend-deployment.yaml
    ├── frontend-service.yaml
    ├── frontend-ingress.yaml
    └── ...
```

Manifests were organized around **individual resources** rather than a direct Compose-to-K8s conversion — this made each Kubernetes concept easier to learn in isolation.

---

## 🧱 8. PostgreSQL StatefulSet

PostgreSQL runs as a **StatefulSet**, not a Deployment, because it owns persistent data.

Application services are **stateless** — any Pod can be freely replaced:

```
Product Pod
Product Pod
Product Pod
```

PostgreSQL is different:

```
PostgreSQL StatefulSet
        │
        ├── PostgreSQL Pod
        │
        └── PersistentVolumeClaim
```

Resulting Pod name: **`postgres-db-0`**

---

## 💾 9. PersistentVolumeClaim

The PVC decouples database storage from the PostgreSQL Pod's lifecycle.

```bash
kubectl get pvc -n novera
```

Key status: **`Bound`** — the claim is successfully attached to storage, so deleting/recreating the Pod won't destroy the data.

---

## 🔌 10. PostgreSQL Kubernetes Service

A Service named `postgres-db` gives PostgreSQL a **stable DNS name**:

```properties
spring.datasource.url=jdbc:postgresql://postgres-db:5432/productdb
```

Instead of a fragile Pod IP (`10.x.x.x`), everything connects via `postgres-db`.

---

## ♻️ 11. PostgreSQL Database Restore in Kubernetes

```bash
kubectl cp .\productdb.dump novera/postgres-db-0:/tmp/productdb.dump

kubectl exec postgres-db-0 -n novera -- ls -lh /tmp/productdb.dump

kubectl exec postgres-db-0 -n novera -- pg_restore `
  -U postgres `
  -d productdb `
  --clean `
  --if-exists `
  --no-owner `
  /tmp/productdb.dump
```

Verified with:

```bash
kubectl exec -it postgres-db-0 -n novera -- psql -U postgres -d productdb
\dt
```

Expected tables: `categories`, `product_images`, `products` ✅

---

## ⚠️ 12. Kubernetes `kubectl exec` Problem

**Error:**

```
error sending request:
http: server gave HTTP response to HTTPS client
```

Cluster itself was healthy (`v1.36.1`, context `docker-desktop`) — this was a **remote command transport** issue specific to local Docker Desktop Kubernetes.

**Fix:**

```powershell
$env:KUBECTL_REMOTE_COMMAND_WEBSOCKETS="false"
```

---

## 🚀 13. Backend Kubernetes Deployments

Every Spring Boot microservice got its own Deployment:

```
product-service
    ↓
Deployment
    ↓
Pod
```

Applied to: `authentication-service`, `product-service`, `cart-service`, `order-service`, `payment-service`, `gateway-service`.

---

## 🔗 14. Kubernetes Services

Each backend Deployment received a matching Service for stable internal DNS:

```
product-service Service
        ↓
product-service Pod
```

| Service | Port |
|---|---|
| authentication-service | 8080 |
| product-service | 8081 |
| cart-service | 8082 |
| order-service | 8083 |
| paymnet-service | 8084 |
| gateway-service | 8085 |

Other services reach it via `http://product-service:8081` instead of a Pod IP.

---

## 🌐 15. Gateway Internal Service Communication

```properties
services.auth=http://authentication-service:8080
services.product=http://product-service:8081
services.cart=http://cart-service:8082
services.order=http://order-service:8083
services.payment=http://paymnet-service:8084
```

Kubernetes DNS resolves each Service name automatically:

```
gateway-service
      ↓
product-service:8081
      ↓
product Pod
```

---

## 🧪 16. Testing Backend Services

```bash
kubectl port-forward service/product-service 8081:8081 -n novera
```

This verified the full chain:

```
Kubernetes Service → Product Pod → Spring Boot application → PostgreSQL
```

---

## 🔐 17. ConfigMaps and Secrets

Hardcoded config was replaced with Kubernetes-native mechanisms:

- **ConfigMaps** → non-sensitive configuration
- **Secrets** → database passwords, JWT secrets, API secrets

```properties
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
```

```
ConfigMap → environment variables
Secret    → environment variables
```

---

## 🧾 18. Local `.env` Configuration

`.env` (kept out of Git) drives local Compose development, while Kubernetes uses Secrets:

```
Local development → .env → Docker Compose
Kubernetes         → Secret → Pod → Spring Boot
```

---

## ❤️ 19. Spring Boot Actuator

Actuator was extended from just the Gateway to **all** services, enabling Kubernetes health management:

```properties
management.endpoints.web.exposure.include=health,info
management.endpoint.health.probes.enabled=true
```

Exposed endpoints:

```
/actuator/health
/actuator/health/liveness
/actuator/health/readiness
```

---

## 🩺 20. Kubernetes Health Probes

| Probe | Purpose |
|---|---|
| **Startup** | Checks whether the app has finished starting (important for slower Spring Boot boot times) |
| **Readiness** | Determines whether a Pod should receive traffic |
| **Liveness** | Determines whether an unhealthy container should be restarted |

```
Startup → Application starts → Readiness → Traffic allowed → Liveness → Restart if unhealthy
```

---

## 🧯 21. Authentication Service Health Probe Problem

**Symptom:** Pod stuck at `0/1 Running`, startup probe returning `HTTP 403`.

**Cause:** Spring Security was blocking the Actuator health endpoint:

```
GET /actuator/health → Spring Security → 403 Forbidden
```

**Fix:** Permit `/actuator/health/**` in the security config, rebuild, redeploy → Pod became `1/1 Running`. This also unblocked the HPA (see [Problem 33](#-33-hpa-unknown-problem)).

---

## ⚖️ 22. Kubernetes Resource Requests and Limits

```yaml
resources:
  requests:
    cpu: "250m"
    memory: "512Mi"
  limits:
    cpu: "500m"
    memory: "768Mi"
```

> Starting values for a learning project — **not** universal production defaults.

**CPU units:**

```
1000m = 1 CPU core
500m  = 0.5 CPU
250m  = 0.25 CPU
```

- **Requests** → what Kubernetes uses for scheduling
- **Limits** → maximum allowed usage

PostgreSQL was sized separately, given its different resource profile.

---

## 🚪 23. Kubernetes Ingress

Port-forwarding both the frontend and Gateway worked for development but wasn't a real entry point:

```bash
kubectl port-forward service/frontend 3000:80 -n novera
kubectl port-forward service/gateway-service 8085:8085 -n novera
```

So **NGINX Ingress** was introduced.

---

## 🧩 24. NGINX Ingress Controller

```bash
kubectl get ingressclass
# No resources found
```

After installing the controller:

```bash
kubectl get pods -n ingress-nginx
```

IngressClass `nginx` became available.

---

## 🖥️ 25. Frontend Ingress

```
/ → frontend:80
```

```
Browser → http://localhost → NGINX Ingress → frontend Service → frontend Pod
```

This eliminated the frontend port-forward entirely.

---

## 🚫 26. CORS Problem with Ingress

Frontend served from `http://localhost`, but the Gateway only allowed `http://localhost:3000` and `http://localhost:5173`.

**Error:**

```
blocked by CORS policy
No 'Access-Control-Allow-Origin' header
```

**Fix:**

```java
configuration.setAllowedOrigins(List.of(
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173"
));
```

---

## 🛣️ 27. Gateway Routing Through Ingress

```
/       → frontend:80
/api/*  → gateway-service:8085
```

`http://localhost/api/products` returned correct product JSON, proving:

```
Ingress → Gateway → Product Service → PostgreSQL
```

---

## ⚙️ 28. Frontend API Configuration

**Before:**

```env
VITE_PRODUCT_API=http://localhost:8085
VITE_AUTH_API=http://localhost:8085
VITE_CART_API=http://localhost:8085
VITE_ORDER_API=http://localhost:8085
VITE_PAYMENT_API=http://localhost:8085
```

**After:**

```env
VITE_PRODUCT_API=http://localhost
VITE_AUTH_API=http://localhost
VITE_CART_API=http://localhost
VITE_ORDER_API=http://localhost
VITE_PAYMENT_API=http://localhost
```

> Vite embeds `VITE_*` variables at **build time**, so the frontend image had to be rebuilt. After that, `http://localhost` alone served both frontend and backend, and the Gateway port-forward was no longer needed.

---

## 🏛️ 29. Final Local Kubernetes Architecture

```
                         Browser
                            │
                            ▼
                    http://localhost
                            │
                            ▼
                    NGINX Ingress
                     /           \
                    /             \
                   ▼               ▼
             Frontend            /api/*
              :80                  │
                                  ▼
                            Gateway Service
                               :8085
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
                    ▼             ▼             ▼
                  Auth         Product        Cart
                    │             │             │
                    ▼             ▼             ▼
                  Auth DB     Product DB      Cart DB

                         ...
                    Order / Payment

                                  │
                                  ▼
                         PostgreSQL StatefulSet
                                  │
                                  ▼
                              PVC Storage
```

Everything is now reachable through `http://localhost` — no manual port-forwarding.

---

## 📈 30. Manual Scaling

```bash
kubectl scale deployment product-service --replicas=2 -n novera
```

```
product-service
    ├── Pod 1
    └── Pod 2
```

The existing Service automatically load-balances across both Pods. PostgreSQL was deliberately **not** scaled this way, since it's stateful.

---

## 📊 31. Metrics Server

```bash
kubectl top pods -n novera   # initially unavailable
```

Installed via:

```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

Docker Desktop required the `--kubelet-insecure-tls` flag. After that:

```bash
kubectl top nodes
```

```
docker-desktop
CPU: 2771m   (17%)
Memory: 4109Mi  (54%)
```

```bash
kubectl top pods -n novera
```

---

## 📐 32. Horizontal Pod Autoscaler

Introduced for the Authentication Service:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler

metadata:
  name: authentication-service-hpa
  namespace: novera

spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: authentication-service

  minReplicas: 2
  maxReplicas: 5

  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

| Setting | Value |
|---|---|
| Min replicas | 2 |
| Max replicas | 5 |
| Target CPU | 70% |

```
Pods → Resource requests → Metrics Server → HPA → Deployment replica count
```

Only Authentication Service has an HPA so far; PostgreSQL was intentionally excluded.

---

## ❓ 33. HPA `<unknown>` Problem

```
cpu: <unknown>/70%
```

**Cause:** an old ReplicaSet/Pod without the expected CPU request, plus new Auth Pods failing the startup probe (`403`, see [Problem 21](#-21-authentication-service-health-probe-problem)).

**Fix:** correct the Actuator security rule and redeploy → Pods became healthy → HPA began reporting real CPU percentages.

> **Lesson:** health configuration and resource configuration must both be correct before autoscaling can work reliably.

---

## 🔄 34. Rolling Updates

The Product Deployment already uses Kubernetes' default strategy:

```yaml
strategy:
  rollingUpdate:
    maxSurge: 25%
    maxUnavailable: 25%
  type: RollingUpdate
```

```
Old version → New Pod created → Startup probe → Readiness probe → New Pod Ready → Old Pod removed
```

Health probes ensure traffic never hits a Pod that isn't ready yet.

---

## ⏪ 35. Kubernetes Rollback

```bash
kubectl rollout history deployment/product-service -n novera
kubectl rollout status deployment/product-service -n novera
kubectl rollout undo deployment/product-service -n novera
```

```
New version → Rolling Update → Health checks → Running → (if broken) → Rollback
```

---

## 🏷️ 36. Docker Image Versioning

Moved away from `latest` to explicit version tags:

```
novera-product-service:0.2.1
novera-product-service:0.2.2
```

Makes it trivial to know exactly what's deployed, and simplifies rollback.

---

## 🤖 37. GitHub Actions CI

```
.github/
└── workflows/
    └── ci.yml
```

**Goal #1:** build all backend services successfully, using Java 21 (Temurin) and Maven:

```bash
mvn clean package -DskipTests
```

---

## ⏭️ 38. Why `-DskipTests` Was Used

The project has no test files yet, and `mvn clean verify` fails locally because the app expects runtime values (e.g. DB credentials) that CI shouldn't need just to compile.

`mvn clean package -DskipTests` is the right call for now because:

- ✅ No tests currently exist
- ✅ Compile/package validation is still valuable
- ✅ Runtime secrets stay out of CI

Tests can be layered in later.

---

## 🔑 39. Secrets and CI/CD

**Decision: never commit real secrets.**

```
Local:    .env → Docker Compose
Kubernetes: Secret → Pod → Spring Boot
CI/CD:    GitHub Actions Secret → GitHub Actions → Docker Hub / deployment credentials
```

Production credentials should never live in `application.properties` or be committed to Git.

---

## 🔓 40. Docker Hub Authentication in GitHub Actions

Repository secrets:

```
DOCKERHUB_USERNAME
DOCKERHUB_TOKEN
```

```yaml
uses: docker/login-action@v3
with:
  username: ${{ secrets.DOCKERHUB_USERNAME }}
  password: ${{ secrets.DOCKERHUB_TOKEN }}
```

A Docker Hub **access token** is used instead of the account password.

---

## 🏗️ 41. CI → Docker Build → Docker Hub

```
build-and-test
      │
      │ success
      ▼
docker-build-push
      │
      ├── Docker login
      ├── Docker build
      └── Docker push
```

```yaml
needs: build-and-test
```

Images are only pushed if the build succeeds.

---

## 🧨 42. Dockerfile Naming Problem in GitHub Actions

**Error:**

```
ERROR: failed to build:
failed to solve:
failed to read dockerfile:
open Dockerfile: no such file or directory
```

**Cause:** the file was named `DockerFile`, which works fine on case-insensitive Windows but fails on the **case-sensitive Linux** GitHub-hosted runners.

**Fix:** rename to `Dockerfile`.

> 💡 Always use the exact standard filename — CI runners are typically Linux, where capitalization matters.

---

## 🐳 43. All Backend Images in CI/CD

After Product Service was automated, the pipeline was extended to every backend service:

```
authentication-service
product-service
cart-service
order-service
payment-service
gateway-service
```

```
Git push → GitHub Actions → Build all backend services → Docker build → Docker Hub
```

All images now push successfully, with version tags.

---

## ⚛️ 44. React Frontend CI/CD

Unlike Spring Boot, the frontend uses Node.js, npm, and Vite:

```bash
npm ci
npm run build
```

`npm ci` was chosen for deterministic, lock-file-driven installs. The frontend is then Dockerized and pushed alongside the backend images:

```
novera-authentication-service
novera-product-service
novera-cart-service
novera-order-service
novera-payment-service
novera-gateway-service
novera-frontend
```

---

## 🌱 45. Vite Environment Variables in CI

```
VITE_PRODUCT_API
VITE_AUTH_API
VITE_CART_API
VITE_ORDER_API
VITE_PAYMENT_API
```

All currently set to `http://localhost`, since frontend and API traffic share the same Ingress origin.

> ⚠️ **Important distinction:** `VITE_*` variables are **build-time frontend configuration**, not secrets — anything embedded in a browser bundle is visible to users. Database passwords and JWT secrets stay in Kubernetes Secrets.

---

## 🔁 46. Current CI/CD Pipeline

```
Developer
   │
   │ git push
   ▼
GitHub
   │
   ▼
GitHub Actions
   │
   ├─────────────────────────────┐
   │                             │
   ▼                             ▼
Backend Maven Build        Frontend npm Build
   │                             │
   └──────────────┬──────────────┘
                  ▼
            Docker Build
                  │
                  ▼
             Docker Hub
                  │
       ┌──────────┴───────────┐
       │                      │
 Backend Images          Frontend Image
```

Everything up to Docker Hub is now **fully automated**.

---

## 🖥️ 47. Self-Hosted Runner — What We Discussed

The Kubernetes cluster runs on **Docker Desktop on Windows**, which a GitHub-hosted runner can't reach directly. A **self-hosted runner** solves this:

```
GitHub
   ↓
GitHub Actions
   ↓
Self-hosted Runner
   ↓
Your Windows PC
   ↓
Docker Desktop
   ↓
Kubernetes
   ↓
Novera
```

This lets GitHub Actions execute `kubectl apply`, `kubectl rollout status`, `kubectl get pods`, etc. against the local `docker-desktop` cluster.

---

## 🚧 48. What a Self-Hosted Runner Does NOT Do

It does **not** make Novera publicly accessible. It solves:

```
GitHub Actions → local Kubernetes deployment
```

It does **not** solve:

```
Remote user → Novera website
```

`http://localhost` only means the local machine — no one else can reach it. True public accessibility eventually needs something like:

```
Internet
   ↓
Public IP / Domain
   ↓
Remote/Cloud Infrastructure
   ↓
Kubernetes Ingress
   ↓
Novera
```

...or a temporary tunneling solution for demos.

| Concept | Solves |
|---|---|
| Self-hosted runner | CI/CD deployment mechanism |
| Public cloud / networking | Remote user accessibility |

---

## 🏛️ 49. Current Novera Kubernetes Architecture

```
                         Internet/Browser
                               │
                               ▼
                        NGINX Ingress
                         localhost:80
                               │
                ┌──────────────┴──────────────┐
                │                             │
                ▼                             ▼
          Frontend Service              Gateway Service
               :80                           :8085
                                                │
                          ┌─────────────────────┼─────────────────────┐
                          │                     │                     │
                          ▼                     ▼                     ▼
                     Auth Service         Product Service        Cart Service
                        :8080                  :8081                 :8082
                          │                     │                     │
                          ▼                     ▼                     ▼
                       Auth DB              Product DB              Cart DB

                                      ┌───────────────┐
                                      │               │
                                      ▼               ▼
                                Order Service   Payment Service
                                    :8083            :8084

                                           │
                                           ▼
                                  PostgreSQL StatefulSet
                                           │
                                           ▼
                                      Persistent PVC
```

**Kubernetes resources now in play:**

`Namespace` · `Deployments` · `Pods` · `Services` · `StatefulSet` · `PersistentVolumeClaim` · `ConfigMaps` · `Secrets` · `Ingress` · `Ingress Controller` · `Health Probes` · `Resource Requests/Limits` · `HPA`

---

## 🩹 50. Problems Encountered and Solutions

<details>
<summary><strong>Problem 1 — No Kubernetes resources</strong></summary>

```
kubectl get all -n novera
No resources found
```
**Cause:** Namespace existed but nothing had been deployed yet.
**Solution:** Create manifests and apply them to the namespace.
</details>

<details>
<summary><strong>Problem 2 — PostgreSQL kubectl exec HTTPS/HTTP error</strong></summary>

```
server gave HTTP response to HTTPS client
```
**Cause:** Local Docker Desktop Kubernetes remote command transport issue.
**Solution:**
```powershell
$env:KUBECTL_REMOTE_COMMAND_WEBSOCKETS="false"
```
</details>

<details>
<summary><strong>Problem 3 — Docker container name not found</strong></summary>

```
docker cp productdb.dump postgres-db:/tmp/productdb.dump
No such container: postgres-db
```
**Cause:** PostgreSQL now runs as a Kubernetes-managed container with a generated name, not the old Compose container.
**Solution:** Use `kubectl cp` / `kubectl exec` instead:
```bash
kubectl cp productdb.dump novera/postgres-db-0:/tmp/productdb.dump
```
</details>

<details>
<summary><strong>Problem 4 — CORS after Ingress</strong></summary>

Frontend served from `http://localhost`, but Gateway only allowed `http://localhost:3000` / `:5173`.
**Solution:** Add `http://localhost` to the Gateway's allowed CORS origins.
</details>

<details>
<summary><strong>Problem 5 — Authentication Pod failed health checks</strong></summary>

```
0/1 Running   |   startup probe → 403
```
**Cause:** Spring Security blocking the Actuator endpoint.
**Solution:** Permit `/actuator/health/**` through Spring Security.
</details>

<details>
<summary><strong>Problem 6 — HPA showed &lt;unknown&gt;</strong></summary>

```
cpu: <unknown>/70%
```
**Cause:** Unhealthy Pods + an older Pod missing the expected CPU request.
**Solution:** Fix the Auth health/security config and redeploy — HPA then reported real CPU utilization.
</details>

<details>
<summary><strong>Problem 7 — Metrics Server unavailable</strong></summary>

`kubectl top pods` didn't work initially.
**Solution:** Install Metrics Server with `--kubelet-insecure-tls` for Docker Desktop compatibility.
</details>

<details>
<summary><strong>Problem 8 — Dockerfile not found in GitHub Actions</strong></summary>

```
failed to read dockerfile: open Dockerfile: no such file or directory
```
**Cause:** File was named `DockerFile`; Linux runners are case-sensitive.
**Solution:** Rename to `Dockerfile`.
</details>

---

## 🎓 51. Kubernetes Concepts Learned

| Concept | What it does |
|---|---|
| **Namespace** | Logical isolation for application resources (`novera`) |
| **Pod** | Smallest deployable unit containing the application container |
| **Deployment** | Manages stateless application Pods and their replicas |
| **Service** | Provides stable networking and DNS for Pods |
| **StatefulSet** | Used for stateful apps such as PostgreSQL |
| **PersistentVolumeClaim** | Provides persistent storage for PostgreSQL |
| **ConfigMap** | Stores non-sensitive configuration |
| **Secret** | Stores sensitive configuration |
| **Ingress** | Defines HTTP routing rules |
| **Ingress Controller** | Processes traffic according to Ingress rules |
| **Readiness Probe** | Determines whether a Pod should receive traffic |
| **Liveness Probe** | Determines whether Kubernetes should restart an unhealthy container |
| **Startup Probe** | Gives slow-starting applications time to initialize |
| **Resource Requests** | What the Pod needs for scheduling |
| **Resource Limits** | Maximum CPU/memory allowed |
| **HPA** | Automatically adjusts replicas based on resource metrics |
| **Rolling Update** | Gradually replaces old Pods with new versions |
| **Rollback** | Returns a Deployment to a previous revision |

---

## ✅ 52. Current Project Status

### Docker
- [x] All services containerized
- [x] PostgreSQL containerized
- [x] Docker Compose working
- [x] Images pushed to Docker Hub

### Kubernetes
- [x] Docker Desktop Kubernetes
- [x] Novera namespace
- [x] PostgreSQL StatefulSet
- [x] PostgreSQL PVC
- [x] PostgreSQL Service
- [x] Database restoration
- [x] Backend Deployments
- [x] Backend Services
- [x] Gateway
- [x] Frontend Deployment
- [x] Frontend Service
- [x] ConfigMaps
- [x] Secrets
- [x] Actuator
- [x] Health probes
- [x] Resource requests/limits
- [x] NGINX Ingress
- [x] HPA for Authentication Service

### CI/CD
- [x] GitHub Actions
- [x] Maven backend builds
- [x] React frontend build
- [x] Docker image builds
- [x] Docker Hub authentication
- [x] Backend image publishing
- [x] Frontend image publishing
- [ ] Kubernetes deployment automation

### Public Accessibility
- [ ] Not publicly accessible yet ❌

> The application currently runs through `http://localhost` on the machine hosting Docker Desktop Kubernetes.

---

## 🗺️ 53. Overall DevOps Journey So Far

```
                  NOVERA
                    │
                    ▼
             Spring Boot
             Microservices
                    │
                    ▼
                  Docker
                    │
                    ▼
             Docker Compose
                    │
                    ▼
             Docker Registry
               Docker Hub
                    │
                    ▼
               Kubernetes
                    │
        ┌───────────┴───────────┐
        │                       │
   Stateful Apps          Stateless Apps
        │                       │
    PostgreSQL              Deployments
        │                       │
       PVC                  Services
        │                       │
        └───────────┬───────────┘
                    │
                    ▼
             ConfigMap/Secret
                    │
                    ▼
              Health Probes
                    │
                    ▼
           Resource Management
                    │
                    ▼
                   HPA
                    │
                    ▼
                Ingress
                    │
                    ▼
              localhost:80
                    │
                    ▼
              GitHub Actions
                    │
                    ▼
             Docker Hub Push
                    │
                    ▼
           Self-hosted Runner
             (next stage)
```

> 🚀 The key milestone isn't just "using Kubernetes commands" — it's having built a real Kubernetes architecture and understanding **why** each layer exists.

---

<p align="center"><i>Built one problem — and one fix — at a time.</i></p>
