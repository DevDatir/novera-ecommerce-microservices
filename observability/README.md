# Product-service observability lab

This first slice observes only `product-service`.

## Start

```powershell
docker compose --env-file observability/compose.env -f docker-compose.yml -f observability/docker-compose.observability.yml up --build -d product-service prometheus grafana otel-collector tempo elasticsearch kibana logstash filebeat
```

Open Grafana at http://localhost:3001 (admin/admin), Prometheus at http://localhost:9090, and Kibana at http://localhost:5601.

## Verify

1. Check `http://localhost:8081/actuator/prometheus` for `http_server_requests` metrics.
2. In Prometheus, query `up{job="product-service"}`. It should be `1`.
3. Send requests to `http://localhost:8081/api/products`; then use Grafana **Explore → Tempo** to find the `product-service` trace.
4. In Kibana, create a data view named `novera-product-service-*` using `@timestamp`, then search for `traceId:*`.

The service logs as JSON to standard output. Filebeat collects only its Docker logs, Logstash parses the JSON, and Elasticsearch stores it. Prometheus scrapes Actuator metrics; OpenTelemetry sends traces to the Collector, which forwards them to Tempo.

## Stop

```powershell
docker compose --env-file observability/compose.env -f docker-compose.yml -f observability/docker-compose.observability.yml down
```

The named volumes retain telemetry. To remove only lab data, run `docker volume ls` and remove the `shoesapp_*_data` volumes deliberately.
