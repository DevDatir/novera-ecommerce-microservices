#!/bin/bash

echo "Starting Product Service..."
(cd product-service && mvn spring-boot:run) &

echo "Starting Authentication Service..."
(cd authentication-service && mvn spring-boot:run) &

echo "Starting Cart Service..."
(cd cart-service && mvn spring-boot:run) &

echo "Starting Order Service..."
(cd order-service && mvn spring-boot:run) &

echo "Starting Payment Service..."
(cd paymnet-service && mvn spring-boot:run) &

echo "Starting Gateway Service..."
(cd gateway-service && mvn spring-boot:run) &

echo "Starting Frontend..."
(cd frontend/novera-frontend && npm run dev) &

wait