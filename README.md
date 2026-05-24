
# Inventory Reservation System

A concurrency-safe inventory reservation system built as part of the take-home engineering exercise for :contentReference[oaicite:0]{index=0}.

The system simulates a real-world ecommerce checkout flow where inventory must be temporarily reserved during payment processing, while preventing overselling under concurrent access.

---

# Live Demo


URL: https://inventory-reservation-system-22-mis-one.vercel.app


---

# Repository


GitHub: https://github.com/ghoraav/InventoryReservationSystem-22MIS0243---for-Allo-.git

---

# Problem Statement

In ecommerce systems, payment confirmation is not immediate. During the checkout window, multiple users may attempt to purchase the same product simultaneously.

Without proper reservation handling:

* overselling can occur,
* stock consistency becomes unreliable,
* abandoned carts may permanently block inventory.

This project implements a reservation-based inventory system that:

* temporarily reserves stock,
* confirms reservations after payment,
* automatically releases expired reservations,
* prevents race conditions under concurrency.

---

# Features

## Core Features

* Product inventory management
* Warehouse-based inventory tracking
* Temporary inventory reservations
* Reservation expiry handling
* Reservation confirmation
* Reservation cancellation
* Concurrency-safe stock reservation
* Live inventory updates
* Reservation countdown timer
* REST APIs using Next.js Route Handlers

---

## Bonus Features Implemented

* Redis-based idempotency support
* Automatic retry-safe API behavior
* Cron-based reservation cleanup
* Optimistic frontend updates
* Transaction-safe reservation workflow

---

# Tech Stack

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

---

## Backend

* Next.js Route Handlers
* Prisma
* PostgreSQL
* Redis

---

## Infrastructure

* Vercel
* Neon
* Upstash

---

# Architecture Overview

## Inventory Model

Inventory is tracked per warehouse.

Available stock is computed using:

```txt
availableStock = totalStock - reservedStock
```

This prevents overselling while allowing temporary checkout reservations.

---

## Reservation Lifecycle

A reservation can exist in one of the following states:

```txt
PENDING
CONFIRMED
RELEASED
```

### Reservation Flow

1. User initiates reservation
2. Stock is temporarily reserved
3. Reservation expiry timer starts
4. User either:

   * confirms payment
   * cancels reservation
   * lets reservation expire

Expired reservations are automatically released using scheduled cleanup jobs.

---

# Concurrency Handling

The most important requirement of this project was ensuring race-condition-free inventory reservations.

To achieve this:

* reservation creation occurs inside database transactions,
* inventory rows are locked during updates,
* stock validation and reservation updates occur atomically.

This guarantees:

* two simultaneous requests cannot reserve the same final inventory unit,
* inventory consistency is maintained,
* overselling does not occur.

---

# Idempotency Support

The system implements Redis-backed idempotency support.

This ensures:

* duplicate client retries do not create duplicate reservations,
* APIs behave safely under network retries,
* repeated requests return consistent responses.

Implementation includes:

* idempotency keys,
* cached request responses,
* retry-safe reservation behavior.

---

# Reservation Expiry System

Expired reservations are cleaned automatically using scheduled cron jobs.

The cleanup process:

1. identifies expired pending reservations,
2. releases reserved stock,
3. updates reservation status,
4. restores inventory availability.

This mimics production-grade inventory reservation systems. Currently the cleanup process is set to run once per day due to Vercel app limitations, but the correct limit is once a min.

---

# API Endpoints

## Products

### Get Products

```http
GET /api/products
```

Returns all products with inventory details.

---

## Reservations

### Create Reservation

```http
POST /api/reservations
```

Creates a temporary inventory reservation.

---

### Confirm Reservation

```http
POST /api/reservations/:id/confirm
```

Confirms reservation after successful payment.

---

### Cancel Reservation

```http
POST /api/reservations/:id/release
```

Cancels reservation and releases inventory.

---

# Database Schema

## Main Entities

### Product

Represents a purchasable item.

### Warehouse

Represents a physical inventory location.

### Inventory

Tracks stock levels per product per warehouse.

### Reservation

Tracks temporary inventory reservations.

---

# Local Development Setup

## 1. Clone Repository

```bash
git clone <YOUR_GITHUB_REPO_URL>
cd allo-inventory-reservation-system
```

---

## 2. Install Dependencies

```bash
npm install
```

`prisma generate` runs automatically during installation via the `postinstall` script.

---

## 3. Setup Environment Variables

Create a `.env` file in the root directory.

```env
DATABASE_URL=

UPSTASH_REDIS_REST_URL=

UPSTASH_REDIS_REST_TOKEN=

CRON_SECRET=
```

---

## 4. Run Prisma Migrations

```bash
npx prisma migrate dev
```

---

## 5. Seed Database

```bash
npx prisma db seed
```

---

## 6. Start Development Server

```bash
npm run dev
```

Application will run at:

```txt
http://localhost:3000
```

---

# Production Build

## Build Application

```bash
npm run build
```

---

## Start Production Server

```bash
npm run start
```

---

# Linting

```bash
npm run lint
```
---
# Reservation Cleanup

Expired reservations are cleaned using scheduled server-side jobs deployed on Vercel.

The cleanup flow:
1. detects expired pending reservations,
2. releases reserved inventory,
3. updates reservation status,
4. restores stock availability.
---

# Design Decisions

## Why PostgreSQL?

PostgreSQL provides:

* strong transactional guarantees,
* row-level locking,
* ACID compliance,
* concurrency-safe updates.

This makes it ideal for inventory reservation systems.

---

## Why Redis?

Redis was used for:

* idempotency handling,
* retry-safe API requests,
* fast temporary request caching.

---

## Why Cron-Based Cleanup?

Cron jobs provide:

* predictable cleanup intervals,
* simple deployment,
* low operational complexity.

Tradeoff:

* reservations may remain expired for a short interval before cleanup executes.

---

# Tradeoffs Considered

## Alternative Approaches

### Optimistic Locking

Considered but rejected because:

* retry complexity increases,
* conflict handling becomes harder under heavy concurrency.

### In-Memory Reservation Tracking

Rejected because:

* state would not persist across deployments,
* not horizontally scalable,
* unsafe in distributed environments.

---

# Future Improvements

If this system were scaled further, possible improvements would include:

* distributed queue processing
* websocket-based live inventory updates
* event-driven reservation workflows
* warehouse prioritization strategies
* reservation analytics
* payment provider integration
* distributed locking strategies
* horizontal service decomposition

---

# Testing Strategy

The system was tested for:

* concurrent reservation attempts
* expired reservation cleanup
* stock consistency
* duplicate request handling
* reservation confirmation flow
* cancellation flow
* API validation behavior

---

# Deployment

The application is deployed on:

* Vercel
* Neon
* Upstash

---

# Git Workflow

Commit history intentionally reflects incremental development and architectural decisions throughout the project lifecycle.

The project was developed incrementally using small commits to reflect:

* architecture evolution,
* backend implementation,
* concurrency handling,
* frontend development,
* infrastructure setup,
* deployment and cleanup workflows.

---

# Key Learnings

This project involved solving real-world backend engineering challenges including:

* transactional consistency,
* concurrency control,
* idempotency,
* distributed system behavior,
* reservation lifecycle management,
* production deployment workflows.

---

# Author

K. C. Ghoraav

Software Engineering Internship Submission for Allo Health

```
```
