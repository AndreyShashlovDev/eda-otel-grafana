## Example DDD/EDA NestJS application with OpenTelemetry tracing, Prometheus metrics and Grafana dashboards

# Getting Started Guide

## Prerequisites

- Node.js (v18 or later)
- Docker and Docker Compose
- npm or yarn

## Setup and Installation

1. **Clone the repository**

```bash
git clone https://github.com/AndreyShashlovDev/eda-otel-grafana.git
cd eda-otel-grafana
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the infrastructure services**

```bash
# Start Kafka, PostgreSQL, Prometheus, Grafana and Jaeger
docker-compose up -d
```

4. **Configure environment variables**

Ensure the `config/development.env` file exists with the following variables:

```
NODE_ENV=development
API_PORT=3000
API_HOST=localhost
KAFKA_BROKERS=localhost:29092
KAFKA_CLIENT_ID=eda-shop-app
KAFKA_GROUP_ID=eda-shop-group
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=user
DB_PASSWORD=password
DB_DATABASE=orders_db
```

5. **Start the application services**

```bash
# In one terminal - start the API Gateway
npm run start:dev api-gateway

# In another terminal - start the Order Service
npm run start:dev order-service
```

## Monitoring and Observability

- **Kafka UI**: http://localhost:8080
- **Jaeger UI** (Distributed Tracing): http://localhost:16686
- **Grafana** (Dashboards): http://localhost:3001 (user: admin, password: admin)
- **Prometheus** (Metrics): http://localhost:9090

## Testing the API

Create a new order:

```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "items": [
      {
        "productId": "prod-1",
        "name": "Sample Product",
        "price": 99.99,
        "quantity": 1
      }
    ],
    "total": 99.99
  }'
```

Get an order (replace `order-id` with an actual ID):

```bash
curl http://localhost:3000/orders/order-id
```

## Project Structure

- `apps/api-gateway`: Frontend API for client requests
- `apps/order-service`: Microservice for order processing
- `libs/common`: Shared code, DTOs, and entities
- `libs/telemetry`: OpenTelemetry configuration and utilities
- `config`: Environment configuration files
- `docker-compose.yml`: Infrastructure service definitions

## Architecture

This project demonstrates:
- Domain-Driven Design (DDD) principles
- Event-Driven Architecture (EDA) with Kafka
- Distributed tracing with OpenTelemetry
- Metrics collection with Prometheus
- Visualization with Grafana dashboards
