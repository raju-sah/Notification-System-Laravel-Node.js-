# Notification System (Laravel + Node.js)

This project implements a mock notification system using a **Laravel API** and a **Node.js microservice**, with **Redis Pub/Sub** for communication. 

The **Laravel API** handles authentication and notification publishing, while the **Node.js microservice** consumes and processes notifications.

---

## 🛠️ Prerequisites

- PHP >= 8.1
- Composer
- Node.js >= 16
- Redis
- MySQL/PostgreSQL
- Laravel CLI
- npm

---

## ⚙️ Setup Instructions

### Laravel (API)

1. **Clone the repository**
   ```bash
   git clone https://github.com/raju-sah/Notification-System-Laravel-Node.js-
   ```

2. **Navigate to the project**
   ```bash
   cd laravel-notification-api
   ```

3. **Install dependencies**
   ```bash
   composer install
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` file and set:
   - Database settings (MySQL/PostgreSQL)
   - Redis settings
     ```
     REDIS_HOST=127.0.0.1
     REDIS_PORT=6379
     ```

5. **Run migrations**
   ```bash
   php artisan migrate
   ```

6. **Start queue worker**
   ```bash
   php artisan queue:work
   ```

7. **Start Laravel server**
   ```bash
   php artisan serve
   ```

---

### Node.js Microservice

1. **Clone the repository**
   ```bash
   git clone https://github.com/raju-sah/Notification-System-Laravel-Node.js-
   ```

2. **Navigate to the project**
   ```bash
   cd notification-consumer
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the server**
   ```bash
   npx ts-node src/server.ts
   ```

---

## 🚀 Running the Project

In separate terminals, run the following:

1. **Start Redis server**
   ```bash
   redis-server
   ```

2. **Start Laravel server**
   ```bash
   php artisan serve
   ```

3. **Start queue worker**
   ```bash
   php artisan queue:work
   ```

4. **Start Node.js microservice**
   ```bash
   npx ts-node src/server.ts
   ```

---

## 🔥 Test APIs

### Laravel API (Port 8000)
- **Login**
  ```
  POST http://localhost:8000/api/v1/login
  ```

- **Send Notification**
  ```
  POST http://localhost:8000/api/v1/notifications
  ```

### Node.js Microservice (Port 3000)
- **Recent Notifications**
  ```
  GET http://localhost:3000/recent
  ```

- **Summary**
  ```
  GET http://localhost:3000/summary
  ```

---

## 📦 Assumptions

- Redis is running locally on default port `6379`.
- Only one notification type (generic message) is implemented.
- Laravel API runs on port `8000`.
- Node.js microservice runs on port `3000`.
- Rate limiting applied per user (10 notifications per hour).
- In-memory caching is used in Node.js for simplicity.

---

## 🧹 Design Decisions

- **Laravel Sanctum**: Used for token-based authentication.
- **Redis Pub/Sub**: Chosen for lightweight message queue.
- **Fastify with TypeScript**: Ensures type safety and performance in Node.js.
- **Retry Logic**: Implemented in Node.js with 3 retries on failure.
- **Caching**:
  - Redis for notification counts in Laravel.
  - In-memory cache in Node.js for simplicity.

---

## 📚 License

This project is for educational and demonstration purposes.
