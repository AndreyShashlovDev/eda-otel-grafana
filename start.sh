#!/bin/bash
echo "Starting Kafka, Zookeeper, Kafka UI and PostgreSQL..."
docker-compose up -d

echo "Waiting for containers to be ready..."
sleep 10
docker-compose ps

echo "Infrastructure is ready!"
echo "Kafka UI is available at http://localhost:8080"
echo "Kafka is available at localhost:29092"
echo "PostgreSQL is available at localhost:5432 (user/password)"
