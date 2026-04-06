# Foodies - Full Stack Setup Guide

Complete guide for running locally and deploying to free hosting.

---

## PART 1: LOCAL DEVELOPMENT

### Prerequisites

Install these on your machine:
- **Java 8** (JDK) — [Adoptium](https://adoptium.net/)
- **MySQL 8** — [MySQL Downloads](https://dev.mysql.com/downloads/mysql/)
- **Apache Kafka** — [Kafka Downloads](https://kafka.apache.org/downloads)
- **Node.js 18+** — [Node.js](https://nodejs.org/)
- **Git**

### Step 1: Start MySQL

```bash
# Ensure MySQL is running on localhost:3306
# Default credentials used: root / rootroot
# If your MySQL password is different, update ALL application.properties files:
#   food-app/src/main/resources/application.properties
#   merchant-service/src/main/resources/application.properties
#   driver-service/src/main/resources/application.properties
#   notification-service/src/main/resources/application.properties
```

### Step 2: Start Kafka

```bash
# From your Kafka installation directory:

# Terminal 1 — Start Zookeeper
bin/zookeeper-server-start.sh config/zookeeper.properties

# Terminal 2 — Start Kafka Broker
bin/kafka-server-start.sh config/server.properties

# On Windows, use the .bat files in bin/windows/ instead
```

### Step 3: Build Backend

```bash
# From the project root (FoodAPPComplete-main/)
./mvnw clean install -DskipTests
```

### Step 4: Start All Backend Services (4 terminals)

```bash
# Terminal 1 — Food App (Main Gateway, port 5001)
./mvnw spring-boot:run -pl food-app

# Terminal 2 — Merchant Service (port 6000)
./mvnw spring-boot:run -pl merchant-service

# Terminal 3 — Driver Service (port 4000)
./mvnw spring-boot:run -pl driver-service

# Terminal 4 — Notification Service (port 7001)
./mvnw spring-boot:run -pl notification-service
```

### Step 5: Start Frontend

```bash
# Terminal 5
cd frontend
npm install
npm run dev
```

### Step 6: Open the App

Open **http://localhost:5173** in your browser.

### How to Use the App

1. **Register as Customer** — Sign up with role "Customer", browse restaurants, place orders
2. **Register as Merchant** — Sign up with role "Merchant", add your restaurant, add menu items
3. **Register as Driver** — Sign up with role "Driver", set your availability

**Testing flow:**
1. Register a Merchant account → Add a restaurant → Add menu items
2. Register a Customer account → Browse restaurants → Place an order
3. Register a Driver account → Set availability (driver auto-assigned to orders via Kafka)

---

## PART 2: FREE DEPLOYMENT

### Architecture for Deployment

```
Frontend (Vercel)  →  Backend Services (Render)  →  MySQL (Aiven)
                                                  →  Kafka (Upstash)
```

### A. Database — Aiven MySQL (Free Tier)

1. Go to [https://aiven.io](https://aiven.io) and sign up (free plan available)
2. Create a **MySQL** service (free tier: 1 node, 1 GB)
3. Note down:
   - **Host**: `mysql-xxxx.aiven.io`
   - **Port**: `12345`
   - **Username**: `avnadmin`
   - **Password**: (from dashboard)
   - **Database**: Create databases named `food-app`, `merchant-service`, `driver-service`, `notification-service`
4. In each `application.properties`, update the datasource:
   ```properties
   spring.datasource.url=jdbc:mysql://YOUR_HOST:YOUR_PORT/food-app?createDatabaseIfNotExist=true&sslMode=REQUIRED
   spring.datasource.username=avnadmin
   spring.datasource.password=YOUR_PASSWORD
   spring.jpa.hibernate.ddl-auto=update
   ```
   **IMPORTANT:** Change `ddl-auto` from `create-drop` to `update` for production!

### B. Kafka — Upstash (Free Tier)

1. Go to [https://upstash.com](https://upstash.com) and sign up
2. Create a **Kafka cluster** (free: 10,000 messages/day)
3. Create topics: `user_created`, `ORDER_CREATED`, `ORDER_CREATED_WITH_MERCHANT_DETAILS`
4. Note the **Bootstrap Endpoint**, **Username**, **Password**
5. Update all `application.properties`:
   ```properties
   spring.kafka.bootstrap-servers=YOUR_UPSTASH_ENDPOINT:9092
   spring.kafka.properties.security.protocol=SASL_SSL
   spring.kafka.properties.sasl.mechanism=SCRAM-SHA-256
   spring.kafka.properties.sasl.jaas.config=org.apache.kafka.common.security.scram.ScramLoginModule required username="YOUR_USERNAME" password="YOUR_PASSWORD";
   ```

### C. Backend — Render (Free Tier)

Each microservice needs to be deployed as a separate Render Web Service.

#### Prepare Each Service for Deployment

1. In the project root, create a `Dockerfile` for each service:

**food-app/Dockerfile:**
```dockerfile
FROM eclipse-temurin:8-jdk-alpine
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 5001
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**merchant-service/Dockerfile:**
```dockerfile
FROM eclipse-temurin:8-jdk-alpine
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 6000
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**driver-service/Dockerfile:**
```dockerfile
FROM eclipse-temurin:8-jdk-alpine
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 4000
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**notification-service/Dockerfile:**
```dockerfile
FROM eclipse-temurin:8-jdk-alpine
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 7001
ENTRYPOINT ["java", "-jar", "app.jar"]
```

2. Build all JARs locally first:
   ```bash
   ./mvnw clean package -DskipTests
   ```

3. Push code to GitHub

#### Deploy on Render

1. Go to [https://render.com](https://render.com) and sign up
2. For each service:
   - Click **New** → **Web Service**
   - Connect your GitHub repo
   - Set **Root Directory** to the service folder (e.g., `food-app`)
   - Set **Runtime** to **Docker**
   - Set **Environment Variables** for database, Kafka, etc.
   - Free tier gives 750 hours/month

3. After deploying food-app, update the `merchant.host` and `driver.host` in food-app's environment to point to the deployed URLs:
   ```
   MERCHANT_HOST=https://your-merchant-service.onrender.com
   DRIVER_HOST=https://your-driver-service.onrender.com
   ```

4. Update `application.properties` to read from environment variables:
   ```properties
   merchant.host=${MERCHANT_HOST:http://localhost:6000}
   driver.host=${DRIVER_HOST:http://localhost:4000}
   ```

**Note:** Render free tier spins down after 15 min of inactivity. First request after spin-down takes ~30 seconds.

### D. Frontend — Vercel (Free)

1. Go to [https://vercel.com](https://vercel.com) and sign up with GitHub
2. Click **New Project** → Import your GitHub repo
3. Set:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variable:
   ```
   VITE_API_BASE_URL = https://your-food-app.onrender.com
   ```
5. Click **Deploy**

Your frontend will be live at `https://your-project.vercel.app`

---

## PART 3: ALTERNATIVE FREE OPTIONS

### Instead of Aiven MySQL

| Provider | Free Tier |
|----------|-----------|
| [PlanetScale](https://planetscale.com) | 1 DB, 5GB, 1B row reads/mo |
| [TiDB Cloud](https://tidbcloud.com) | 5GB storage |
| [Railway](https://railway.app) | $5 free credit/month |

### Instead of Render

| Provider | Free Tier |
|----------|-----------|
| [Railway](https://railway.app) | $5 free credit, good for small apps |
| [Fly.io](https://fly.io) | 3 shared VMs, 3GB storage |
| [Koyeb](https://koyeb.com) | 1 nano service free |

### Instead of Vercel

| Provider | Free Tier |
|----------|-----------|
| [Netlify](https://netlify.com) | 100GB bandwidth, same setup as Vercel |
| [Cloudflare Pages](https://pages.cloudflare.com) | Unlimited bandwidth |

---

## Quick Reference: Ports

| Service | Local Port | Purpose |
|---------|-----------|---------|
| Frontend | 5173 | React dev server |
| Food App | 5001 | Main API gateway |
| Merchant Service | 6000 | Restaurant management |
| Driver Service | 4000 | Driver management |
| Notification | 7001 | Email notifications |
| MySQL | 3306 | Database |
| Kafka | 9092 | Message queue |

## Quick Reference: API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/userOnboarding/{type} | None | Register user/merchant/driver |
| GET | /api/me | Any | Get current user profile |
| GET | /api/restaurants | Any | List all restaurants |
| GET | /api/restaurants/{id} | Any | Get restaurant details |
| GET | /api/restaurants/{id}/menu | Any | Get restaurant menu |
| POST | /api/order/ | User | Place order |
| GET | /api/orders | User | Get user's orders |
| POST | /api/restaurant/onBoarding | Merchant | Register restaurant |
| POST | /api/restaurant/menu | Merchant | Add menu item |
| GET | /api/restaurant/my | Merchant | Get own restaurant |
| GET | /api/restaurant/my/menu | Merchant | Get own menu items |
| POST | /api/driver/onBoarding | Driver | Register as driver |
