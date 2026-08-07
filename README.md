# novera-ecommerce-microservices
Implemented the Docker PostgreSQL migration and made docker compose up capable of building the backend services from a clean clone.

  Changed:

  - docker-compose.yml — adds PostgreSQL 17, healthcheck, named volume, init script mount, restart policies, and database readiness
    dependencies.

  - postgres/init.sql — creates all five service-owned databases automatically.
  - Each backend application-docker.properties — uses postgres-db:5432, while application.properties remains local/localhost.
  - All six backend Dockerfiles — now use multi-stage Maven builds, so a clone does not need pre-existing target/*.jar files.

  docker compose config validates successfully.

  ## What changed architecturally

  Docker Compose creates one private bridge network (shoesapp_default). Its built-in DNS resolves service names:

  postgres-db             → PostgreSQL container
  product-service:8081    → product service container
  cart-service:8082       → cart service container

  Therefore the Docker datasource URLs are now:

  jdbc:postgresql://postgres-db:5432/novera_auth_db
  jdbc:postgresql://postgres-db:5432/productdb
  jdbc:postgresql://postgres-db:5432/novera_cart_db
  jdbc:postgresql://postgres-db:5432/novera_orders
  jdbc:postgresql://postgres-db:5432/novera_payment_db

  localhost is never correct for a different container: inside cart-service, for example, it means cart-service itself.

  ## PostgreSQL setup

  postgres-db:
    image: postgres:17
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./postgres/init.sql:/docker-entrypoint-initdb.d/init.sql:ro

  - The named volume stores PostgreSQL’s data outside the container lifecycle. docker compose down keeps it; docker compose down -v deletes
    it.

  - Without it, removing/recreating the database container loses all databases and tables.
  - restart: unless-stopped brings services back after Docker/host restarts, unless you explicitly stopped them.
  - pg_isready is the healthcheck. Backend services wait for a healthy database rather than merely a started container.

  The init script runs automatically because the official PostgreSQL image executes *.sql files in /docker-entrypoint-initdb.d during first
  initialization of an empty data directory. It does not run again once postgres_data exists. To intentionally rerun it, use:

  docker compose down -v

  That deletes all Docker PostgreSQL data, so do it only when you want a clean reset.

  ## Important: your current local PostgreSQL is on port 5432

  The Docker database also publishes 5432:5432, as requested. Stop the local PostgreSQL server before starting the container, otherwise
  Docker cannot bind that port.

  ## Start from a clean clone

  docker compose up --build

  The new multi-stage Dockerfiles compile each Spring Boot service during the image build. The first run will take longer because Maven and
  npm dependencies are downloaded.

  For normal usage afterwards:

  docker compose up -d
  docker compose logs -f postgres-db

  ## Verify the setup

  docker ps
  docker compose ps
  docker network inspect shoesapp_default

  You should see postgres-db as healthy and every service on the Compose network.

  List databases:

  docker exec -it postgres-db psql -U postgres -d postgres -c "\l"

  List product tables:

  docker exec -it postgres-db psql -U postgres -d productdb -c "\dt"

  Check a service connection:

  docker compose logs product-service
  docker compose logs authentication-service

  Expect a Hikari connection success and JDBC URLs containing postgres-db, not host.docker.internal.

  Then verify:

  http://localhost:8085/actuator/health
  http://localhost:3000

  ## Your existing local data: recommended migration

  ### Option A — pg_dump / pg_restore

  Best for moving your current development data.

  1. Back up each local database before stopping local PostgreSQL:

  pg_dump -Fc -U postgres -d productdb -f productdb.dump
  pg_dump -Fc -U postgres -d novera_auth_db -f novera_auth_db.dump
  pg_dump -Fc -U postgres -d novera_cart_db -f novera_cart_db.dump
  pg_dump -Fc -U postgres -d novera_orders -f novera_orders.dump
  pg_dump -Fc -U postgres -d novera_payment_db -f novera_payment_db.dump

  2. Stop local PostgreSQL, then start only Docker PostgreSQL:

  docker compose up -d postgres-db

  3. Restore each dump:

  docker cp productdb.dump postgres-db:/tmp/productdb.dump
  docker exec -it postgres-db pg_restore -U postgres -d productdb --clean --if-exists --no-owner /tmp/productdb.dump

  Repeat for the other four databases.

  Advantages: preserves your actual users, products, orders, and carts.
  Disadvantages: it is a point-in-time copy, not a repeatable schema history.

  Important: your current logs showed local PostgreSQL 18.4 while the requested container is PostgreSQL 17. Restoring newer-major-version
  data into an older PostgreSQL version is not a supported production migration path. For reliable preservation of that data, use PostgreSQL
  18 for the container or recreate/seed data into PostgreSQL 17.

  ### Option B — Liquibase seed data

  Use Liquibase change sets for stable reference data: categories, demo products, country lists, test roles.

  Advantages: reproducible for every developer, CI environment, and later Kubernetes deployment.
  Disadvantages: do not use it for real users, live orders, payments, or large operational data.

  For this learning project: use Option A to preserve your current local data, then later add Liquibase seed data for categories and demo
  products.

  ## Liquibase status — important correction

  I verified the repository: it currently has no Liquibase dependency or changelog files. It uses:

  spring.jpa.hibernate.ddl-auto=update

  So tables will be created automatically in the correctly owned database, but this is Hibernate schema generation—not Liquibase.

  Each service already has database isolation because it has a distinct JDBC database name. No service should query another service’s
  database; it should use the owning service’s API. This prevents hidden coupling and lets each service evolve its schema independently.

  The correct Liquibase follow-up is:

  1. Create and review one baseline changelog per service/database.
  2. Add liquibase-core.
  3. Set Hibernate to ddl-auto=validate.
  4. Keep future table changes as versioned Liquibase migrations.

  That is the industry pattern, but it must be generated and reviewed against your existing entity schemas rather than guessed.

  ## Production notes

  This is a solid development setup. Before actual production:

  - Move database/JWT/Razorpay secrets out of committed property files into environment secrets, Docker secrets, or Kubernetes Secrets.
  - Usually expose only the gateway externally; keep database and service ports private.
  - In Kubernetes, postgres-db becomes a StatefulSet/service, and service-name DNS works the same way conceptually.
  - Named Docker volumes are ideal for local development databases; production databases generally use managed Postgres or durable cloud
    volumes.
