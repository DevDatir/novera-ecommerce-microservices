#!/bin/bash
# Restores the committed seed-data dumps into each database created by init.sql.
# Runs automatically on first container init (docker-entrypoint-initdb.d),
# after init.sql since "init.sql" sorts before "restore-data.sh".
set -e

for f in /docker-entrypoint-initdb.d/*.dump; do
  db=$(basename "$f" .dump)
  echo "Restoring seed data into $db from $f"
  pg_restore -U "$POSTGRES_USER" --no-owner --no-privileges -d "$db" "$f"
done
