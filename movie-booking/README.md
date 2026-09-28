# 🎬 MovieBook - Full-Stack Movie Booking Application (DevOps Edition)

A clean, decoupled full-stack Movie Booking Web Application specifically designed for **learning and practicing DevOps**. 

The frontend and backend are completely decoupled into two separate directories. The frontend runs independently (e.g. on port `5500`) and communicates with the backend REST API (running on port `5000`) over HTTP using the native browser **Fetch API** and **CORS**.

---

## 📌 Table of Contents
- [Project Overview](#-project-overview)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [MongoDB Configuration](#-mongodb-configuration)
- [Backend Setup & Installation](#-backend-setup--installation)
- [Database Seeding](#-database-seeding)
- [Frontend Setup & Execution](#-frontend-setup--execution)
- [REST API Documentation & Endpoints](#-rest-api-documentation--endpoints)
- [Sample API Requests & Payloads](#-sample-api-requests--payloads)
- [DevOps Practice Roadmap](#-devops-practice-roadmap)

---

## 🚀 Project Overview

MovieBook provides a seamless, cinema ticket reservation workflow without unnecessary frontend frameworks or complex state managers.

### Core Features:
1. **Home Page (`index.html`)**:
   - Modern dark-cinema UI with branding and live status badges.
   - Hero banner with instant movie search.
   - Dynamic featured movie cards with ratings, language, genres, and pricing.
2. **Movies Catalog (`movies.html`)**:
   - Real-time cinema listings fetched from backend (`GET /api/movies`).
   - JavaScript search and multi-criteria filtering by genre, language, and sort order.
3. **Movie Details & Seat Booking (`booking.html`)**:
   - Cinema screen orientation visualization.
   - Interactive 40-seat theatre grid (Rows A–E, Columns 1–8).
   - Real-time seat status: Available, Selected, and Booked.
   - Live total price calculation (`₹150` × seat count).
   - Instant ticket confirmation modal with booking summary.
4. **My Bookings (`my-bookings.html`)**:
   - Ticket management calling `GET /api/bookings`.
   - Booking reference IDs, seat list, customer names, and total amounts.
   - One-click booking cancellation (`DELETE /api/bookings/:id`) which automatically releases reserved seats back to the theatre inventory.

---

## 🛠 Technology Stack

### Frontend
- **HTML5**: Semantic, accessible markup.
- **CSS3 (Vanilla)**: Modern responsive design system, sleek dark mode theme, glassmorphic navigation, curved cinema screen CSS.
- **JavaScript (Vanilla ES6+)**: Native DOM manipulation, state handling, and modal controls.
- **Fetch API**: Native asynchronous browser-to-backend HTTP communication with CORS support.

### Backend
- **Node.js**: Asynchronous event-driven runtime environment.
- **Express.js**: Layered REST API architecture (Routes → Controllers → Models).
- **Mongoose**: Object Data Modeling (ODM) for MongoDB.
- **dotenv**: Environment variable isolation.
- **cors**: Cross-Origin Resource Sharing middleware.
- **nodemon**: Automated development server reloading.

### Database
- **MongoDB**: NoSQL document database (`movies` and `bookings` collections).

---

## 📂 Project Structure

```text
movie-booking/
│
├── frontend/
│   ├── index.html              # Home page with hero & featured movies
│   ├── movies.html             # All movies catalog with search & filters
│   ├── booking.html            # Seat layout & booking checkout page
│   ├── my-bookings.html        # Booking history & cancellation page
│   ├── css/
│   │   └── style.css           # Vanilla CSS cinema design system
│   └── js/
│       ├── main.js             # Logic for home page
│       ├── movies.js           # Logic for catalog & filtering
│       ├── booking.js          # Logic for seat selection & booking
│       └── my-bookings.js      # Logic for ticket view & cancellation
│
├── backend/
│   ├── package.json            # Backend dependencies and scripts
│   ├── server.js               # Express application entrypoint
│   ├── .env                    # Environment variables (git-ignored)
│   ├── .env.example            # Environment template
│   ├── seeder.js               # Database seeder for sample movies
│   ├── config/
│   │   └── db.js               # Mongoose MongoDB connection
│   ├── models/
│   │   ├── Movie.js            # Movie schema & model
│   │   └── Booking.js          # Booking schema & model
│   ├── controllers/
│   │   ├── movieController.js  # Movie CRUD request handlers
│   │   └── bookingController.js# Booking & seat reservation handlers
│   ├── routes/
│   │   ├── movieRoutes.js      # Express routes for /api/movies
│   │   └── bookingRoutes.js    # Express routes for /api/bookings
│   └── middleware/
│       └── errorMiddleware.js  # 404 and global JSON error handlers
│
├── .gitignore                  # Git ignore rules for node_modules and .env
└── README.md                   # Complete documentation & DevOps guide
```

---

## ⚙️ Prerequisites

- **Node.js**: v18+ or v20+ installed ([Download Node.js](https://nodejs.org/))
- **MongoDB**: Either a local MongoDB instance running on port `27017` or a free cloud cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- **Static HTTP Server**: VS Code Live Server extension, `npx serve`, or Python HTTP server.

---

## 🗄️ MongoDB Configuration

The backend reads the database connection URI from `backend/.env`.

1. Inside `movie-booking/backend/`, ensure the `.env` file exists:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/movie-booking
   CLIENT_ORIGIN=http://localhost:5500
   ```

2. **Option A — Local MongoDB**:
   Start your local MongoDB service:
   - Windows Service: `net start MongoDB` or through Windows Services.
   - Command Line: `mongod --dbpath <data-directory-path>`

3. **Option B — MongoDB Atlas (Free Cloud Database)**:
   - Create a free shared cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
   - Create a database user and allow your IP in Network Access (`0.0.0.0/0` for development).
   - Copy the connection string and update `backend/.env`:
     ```env
     MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/movie-booking?retryWrites=true&w=majority
     ```

---

## 💻 Backend Setup & Installation

Open **Terminal 1**:

```bash
# Navigate to the backend directory
cd movie-booking/backend

# Install dependencies (express, mongoose, dotenv, cors, nodemon)
npm install

# Start in Development Mode with hot reload (nodemon)
npm run dev

# OR start in standard production mode
npm start
```

When started, you should see:
```text
===============================================
🚀 Movie Booking Server running on port 5000
📡 API Base URL: http://localhost:5000/api
===============================================
✅ MongoDB Connected: 127.0.0.1 (or Atlas cluster)
```

Health check endpoint: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🌱 Database Seeding

To quickly populate MongoDB with at least 5 blockbusters (Interstellar, Inception, Avengers: Endgame, Spider-Man: No Way Home, The Dark Knight, RRR):

```bash
cd movie-booking/backend

# Seed sample movies and an initial booking into MongoDB
npm run seed

# To wipe the database clean if needed:
npm run seed:destroy
```

---

## 🌐 Frontend Setup & Execution

The frontend contains **pure static files** (HTML, CSS, JS) and must run on a local HTTP server (such as port `5500`) to avoid browser file:// origin restrictions.

Open **Terminal 2**:

### Option 1: Using VS Code Live Server
- Open `movie-booking/frontend` in VS Code.
- Right-click `index.html` and click **"Open with Live Server"**.
- Opens at: `http://localhost:5500` or `http://127.0.0.1:5500`

### Option 2: Using Node `serve`
```bash
# From movie-booking/frontend directory:
npx -y serve -p 5500 .
```

### Option 3: Using Python HTTP Server
```bash
# From movie-booking/frontend directory:
python -m http.server 5500
```

Now open your browser at **`http://localhost:5500`**.

---

## 📡 REST API Documentation & Endpoints

Base URL: `http://localhost:5000/api`

### Movies API

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/movies` | Get all movies (supports `?search=`, `?genre=`, `?language=`) | `200 OK` |
| `GET` | `/api/movies/:id` | Get details of a single movie by ID | `200 OK` / `404 Not Found` |
| `POST` | `/api/movies` | Create a new movie | `201 Created` / `400 Bad Request` |
| `DELETE` | `/api/movies/:id` | Delete a movie by ID | `200 OK` / `404 Not Found` |

### Bookings API

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/bookings` | Retrieve all bookings (sorted newest first) | `200 OK` |
| `GET` | `/api/bookings/:id` | Retrieve single booking by ID | `200 OK` / `404 Not Found` |
| `POST` | `/api/bookings` | Create new booking and reserve seats in movie | `201 Created` / `400 Bad Request` |
| `DELETE` | `/api/bookings/:id` | Cancel booking and release seats back to movie | `200 OK` / `404 Not Found` |

### System & Health Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | API Information and root status |
| `GET` | `/api/health` | Container liveness & uptime probe |

---

## 🧪 Sample API Requests & Payloads

### 1. Create a Booking (`POST /api/bookings`)

**Request:**
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "movieId": "64f1a2b3c4d5e6f7a8b9c0d1",
    "movieTitle": "Avengers: Endgame",
    "customerName": "Lokesh",
    "selectedSeats": ["A1", "A2"],
    "totalAmount": 300
  }'
```

**Success Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Booking Confirmed!",
  "data": {
    "_id": "673f1b40283c7a29e4d019f2",
    "movieId": "64f1a2b3c4d5e6f7a8b9c0d1",
    "movieTitle": "Avengers: Endgame",
    "customerName": "Lokesh",
    "selectedSeats": ["A1", "A2"],
    "totalAmount": 300,
    "bookingDate": "2026-09-28T16:55:00.000Z"
  }
}
```

### 2. Conflict Handling (Seat Already Booked)

If a user tries to book seats already occupied:
**Response (`400 Bad Request`):**
```json
{
  "success": false,
  "message": "Seat(s) A1 already booked. Please choose available seats."
}
```

### 3. Cancel a Booking (`DELETE /api/bookings/:id`)

**Request:**
```bash
curl -X DELETE http://localhost:5000/api/bookings/673f1b40283c7a29e4d019f2
```

**Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Booking cancelled successfully",
  "data": {
    "id": "673f1b40283c7a29e4d019f2"
  }
}
```

---

## 🚢 DevOps Practice Roadmap

Because the frontend and backend are kept strictly separated, this repository is ready for progressive DevOps workflows:

1. **Phase 1: Containerization (Docker)**
   - Create `backend/Dockerfile` using `node:20-alpine`.
   - Create `frontend/Dockerfile` using `nginx:alpine` to serve static assets.
   - Write a `docker-compose.yml` to orchestrate `frontend`, `backend`, and a `mongodb` service with health checks and volumes.

2. **Phase 2: CI/CD (GitHub Actions / GitLab CI)**
   - Lint and syntax verification.
   - Integration tests with MongoDB memory server or Docker service container.
   - Build and publish multi-arch Docker images to Docker Hub or AWS ECR.

3. **Phase 3: Infrastructure as Code & Deployment**
   - Deploy backend to AWS ECS / Fargate, Render, or Railway.
   - Deploy frontend to AWS S3 + CloudFront, Vercel, or Netlify.
   - Configure domain names and SSL/TLS certificates via Let's Encrypt / AWS ACM.

4. **Phase 4: Kubernetes & Monitoring**
   - Write K8s manifests (Deployments, Services, ConfigMaps, Secrets, Ingress).
   - Set up Prometheus & Grafana to monitor HTTP request latency and MongoDB connection pools.
