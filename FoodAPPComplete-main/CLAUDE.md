# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Run

This is a Maven multi-module Java 8 project using Spring Boot 2.7.12.

```bash
# Build all modules
./mvnw clean install

# Run a specific service (from its directory)
./mvnw spring-boot:run -pl food-app
./mvnw spring-boot:run -pl driver-service
./mvnw spring-boot:run -pl merchant-service
./mvnw spring-boot:run -pl notification-service

# Run tests
./mvnw test                  # all modules
./mvnw test -pl food-app     # single module
./mvnw test -pl food-app -Dtest=OrderServiceTest  # single test class
```

```bash
# Frontend (React + Vite + Tailwind CSS)
cd frontend
npm install
npm run dev          # starts on http://localhost:5173
npm run build        # production build to dist/
```

## Prerequisites

- MySQL running locally (user: root, all service databases auto-created)
- Apache Kafka on localhost:9092
- Node.js 18+ (for frontend)
- Google Maps Geocoding API key (configured in food-app application.properties)

## Architecture

**Microservices monorepo** — four Spring Boot services + one shared utils module + React frontend. Backend services communicate via REST (synchronous) and Kafka (asynchronous). Frontend talks only to food-app (port 5001) which acts as API gateway.

### Services

| Service | Port | Database | Role |
|---------|------|----------|------|
| **food-app** | 5001 | food-app | Main orchestrator — users, orders, coordinates merchant/driver calls |
| **merchant-service** | 6000 | merchant-service | Restaurant and menu management |
| **driver-service** | 4000 | driver-service | Driver registration and availability |
| **notification-service** | 7001 | notification-service | Email notifications (Mailtrap SMTP) |
| **utils** | — | — | Shared code: Google Geocoding client, Kafka constants, DTOs |
| **frontend** | 5173 | — | React SPA — Vite dev server proxies /api to food-app:5001 |

### Event Flow (Kafka)

```
food-app (Producer) ──> user_created topic ──> notification-service, merchant-service
                    ──> ORDER_CREATED topic ──> driver-service, merchant-service, notification-service
```

### Inter-Service REST Calls

- food-app → merchant-service: `http://localhost:6000/merchant/addRestaurantDetails`
- food-app → driver-service: `http://localhost:4000/driver/addDriverDetails`

### Security

Spring Security with HTTP Basic Auth (CORS enabled) and role-based access:
- `/api/userOnboarding/**` — public
- `GET /api/me`, `GET /api/restaurants/**` — any authenticated
- `GET /api/orders`, `/api/order/**` — USER role
- `/api/restaurant/**` — MERCHANT role
- `/api/driver/**` — DRIVER role

Passwords stored with BCrypt. CSRF is disabled.

### Key Domain Models

- **food-app:** `User` (implements UserDetails), `OrderDetails` (linked to User via foreign key)
- **merchant-service:** `Restaurant` → `MenuItems` (one-to-many)
- **driver-service:** `DriverDetails` (location, availability hours)

### Database

All services use JPA with MySQL. Schema auto-creation: `create-drop` for food-app/driver/notification, `create` for merchant-service. No cross-database foreign keys — services are decoupled via Kafka events.

### Shared Utils Module

`CommonService.getLatLongFromAddress()` — geocodes addresses via Google Maps API. `CommonConstants` — Kafka topic names and event field keys. Used by food-app and merchant-service.
