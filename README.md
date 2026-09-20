# 📚 NextReads — E-Bookstore Platform

Full-stack, AI-augmented E-Bookstore platform built with Next.js 14 (App Router), TypeScript, Tailwind CSS, PostgreSQL, and OpenAPI 3.0.

---

## 🌟 Key Features & User Flows

1. **Landing & Discovery:**
   - Featured technical publications, bestsellers, and category highlights.
   - Dynamic search and quick category navigation.

2. **Catalogue & Filtering:**
   - Filter by Category (AI, Architecture, DevOps, Security) & Publisher/Brand (O'Reilly, Packt, MIT Press).
   - Sorting by rating, featured status, and price.

3. **Product Details & Related Recommendations:**
   - Detailed format information (ePub / PDF), ISBN, reviews, and DRM encryption status.
   - Real-time related recommendations based on category/publisher.

4. **Shopping Basket:**
   - Real-time quantity adjustment, item totals, and discount calculations.
   - Dynamic recommendations generated from historical purchases.

5. **Payment & Purchase Flow:**
   - Multi-address selection.
   - **Loyalty Gift Points Redemption** (instant discount deduction).
   - Flexible payment options: Credit/Debit Card, Instant UPI, and Net Banking.
   - Purchase confirmation screen with order summary and receipt details.

6. **Order History & "Buy It Again":**
   - Historical ledger of past orders with dates, payment method, and addresses.
   - One-click **Buy It Again** to reorder past titles.

7. **API Documentation & AI Test Generation:**
   - OpenAPI 3.0 specification available at `/public/openapi.json` and interactive Swagger UI at `/api-docs`.

---

## 🛠 Tech Stack

- **Frontend & Fullstack:** Next.js 14+ (React 18, App Router, TypeScript)
- **Styling:** Tailwind CSS & Lucide Icons
- **State Management:** Zustand
- **Database & ORM:** PostgreSQL 16 + Prisma ORM
- **API Spec:** OpenAPI 3.0 (Swagger UI)
- **Testing:** Vitest & React Testing Library
- **Containerization:** Docker & Docker Compose (Red Hat UBI 9 Minimal base image)

---

## 🚀 Getting Started

### Local Setup
```bash
# 1. Install dependencies
npm install

# 2. Setup environment variables
cp .env.example .env

# 3. Run database migrations (optional if using local PostgreSQL)
npx prisma db push

# 4. Start local development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.
Open [http://localhost:3000/api-docs](http://localhost:3000/api-docs) for the interactive Swagger OpenAPI docs.

### Docker Compose
```bash
docker compose up --build
```
