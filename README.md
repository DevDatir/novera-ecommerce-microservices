# Novera E-Commerce Microservices

Novera is a Spring Boot microservices e-commerce application with a React frontend. The complete development stack runs in Docker: frontend, gateway, five backend services, and PostgreSQL 17.

## Prerequisites

Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) and ensure it is running. No local Java, Maven, Node.js, or PostgreSQL installation is required.

If local PostgreSQL is running on port `5432`, stop it before starting this project. Docker publishes PostgreSQL on the same port.

## Start from a clone

```powershell
git clone <repository-url>
cd shoesApp
docker compose up --build -d
```

The first build downloads Maven and npm dependencies. Open:

- Frontend: <http://localhost:3000>
- Gateway actuator: <http://localhost:8085/actuator/health>

`docker compose up` creates empty service databases and Hibernate creates the tables. To load Novera's committed development data, follow the restore process below.

## Restore the committed development data

The repository includes these PostgreSQL custom-format dumps in the project root:

```text
productdb.dump
novera_auth_db.dump
novera_cart_db.dump
novera_orders.dump
novera_payment_db.dump
```

Restore into a new Docker database volume before starting the backend services. This avoids services creating tables while `pg_restore` is replacing them.

```powershell
docker compose down -v
docker compose up -d postgres-db
docker compose ps
```

Wait until `postgres-db` shows `healthy`, then run:

```powershell
docker cp productdb.dump postgres-db:/tmp/productdb.dump
docker exec postgres-db pg_restore -U postgres -d productdb --clean --if-exists --no-owner /tmp/productdb.dump

docker cp novera_auth_db.dump postgres-db:/tmp/novera_auth_db.dump
docker exec postgres-db pg_restore -U postgres -d novera_auth_db --clean --if-exists --no-owner /tmp/novera_auth_db.dump

docker cp novera_cart_db.dump postgres-db:/tmp/novera_cart_db.dump
docker exec postgres-db pg_restore -U postgres -d novera_cart_db --clean --if-exists --no-owner /tmp/novera_cart_db.dump

docker cp novera_orders.dump postgres-db:/tmp/novera_orders.dump
docker exec postgres-db pg_restore -U postgres -d novera_orders --clean --if-exists --no-owner /tmp/novera_orders.dump

docker cp novera_payment_db.dump postgres-db:/tmp/novera_payment_db.dump
docker exec postgres-db pg_restore -U postgres -d novera_payment_db --clean --if-exists --no-owner /tmp/novera_payment_db.dump
```

Start the application after the restores complete:

```powershell
docker compose up --build -d
```

`--clean --if-exists` replaces any existing restored objects, and `--no-owner` avoids failures caused by database-role ownership differences.

> The dumps contain development data. Do not commit production data, real customer information, passwords, payment data, or secrets to source control.

## Architecture

Docker Compose creates an internal bridge network (`shoesapp_default`). Docker DNS makes each Compose service name resolvable by the other containers.

```text
frontend -> gateway-service -> backend services -> postgres-db
```

For example, Docker-profile datasource URLs use `postgres-db`, not `localhost` or `host.docker.internal`:

```text
jdbc:postgresql://postgres-db:5432/novera_auth_db
jdbc:postgresql://postgres-db:5432/productdb
jdbc:postgresql://postgres-db:5432/novera_cart_db
jdbc:postgresql://postgres-db:5432/novera_orders
jdbc:postgresql://postgres-db:5432/novera_payment_db
```

Inside a container, `localhost` means that same container. Container-to-container requests must use the Compose service name, such as `http://product-service:8081`.

## PostgreSQL initialization and persistence

`postgres/init.sql` is mounted at `/docker-entrypoint-initdb.d/init.sql`. The official PostgreSQL image runs it automatically only when the named `postgres_data` volume is empty. It creates the five service-owned databases.

The named volume is mounted at `/var/lib/postgresql/data`:

- `docker compose down` removes containers but keeps the database data.
- `docker compose down -v` also deletes `postgres_data`; use it only for a complete reset.
- Without a volume, recreating the PostgreSQL container loses all databases and data.

The PostgreSQL healthcheck uses `pg_isready`. Backend services wait for PostgreSQL to be healthy before they start. `restart: unless-stopped` restarts containers after Docker or host restarts unless you intentionally stop them.

## Create new dumps

Create a dump from a local PostgreSQL server:

```powershell
pg_dump -U postgres -Fc --no-owner --no-acl -d productdb -f productdb.dump
```

Repeat for each service database. `-Fc` creates PostgreSQL's custom format, which is compact and works with `pg_restore` for selective or clean restores.

Create a dump from the Docker database without needing local PostgreSQL tools:

```powershell
docker exec postgres-db pg_dump -U postgres -Fc -d productdb -f /tmp/productdb.dump
docker cp postgres-db:/tmp/productdb.dump ./productdb.dump
```

Dumps are important because a database volume protects data only on one machine. A dump is portable: it supports disaster recovery, sharing reproducible development data, and moving data to another environment. It is a snapshot, not a substitute for versioned schema migrations.

## Useful commands

```powershell
docker compose ps
docker compose logs -f postgres-db
docker compose logs -f product-service
docker exec -it postgres-db psql -U postgres -d postgres -c "\l"
docker exec -it postgres-db psql -U postgres -d productdb -c "\dt"
docker network inspect shoesapp_default
```

Expected results:

- `postgres-db` is `healthy`.
- `\l` lists the five Novera databases.
- `\dt` lists tables for the selected service database.
- Service logs show a JDBC URL containing `postgres-db`.

## Configuration and schema ownership

`application.properties` is the local profile and uses `localhost`. `application-docker.properties` overrides only Docker-specific values, including the `postgres-db` hostname and internal service URLs. Spring loads the Docker profile through `SPRING_PROFILES_ACTIVE=docker` in Compose.

Each service owns one database. Services communicate through APIs, not by reading each other's tables. This prevents tight schema coupling and allows every service to evolve independently.

This project currently uses Hibernate `spring.jpa.hibernate.ddl-auto=update` for schema creation. It does not yet contain Liquibase changelogs. The production migration path is to add reviewed, per-service Liquibase baseline changelogs and change Hibernate to `ddl-auto=validate`.

## Project structure

```text
docker-compose.yml
postgres/
  init.sql
authentication-service/
product-service/
cart-service/
order-service/
paymnet-service/
gateway-service/
frontend/novera-frontend/
*.dump
```

The backend Dockerfiles use multi-stage Maven builds, so a clone builds its own JARs. PostgreSQL and service credentials in this learning setup are development-only; use CI secrets, Docker secrets, or Kubernetes Secrets outside local development.
