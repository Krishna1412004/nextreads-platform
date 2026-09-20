# E-Bookstore Platform Specification

## 1. Architecture Overview
Full-stack Next.js (App Router) with TypeScript, Tailwind CSS, PostgreSQL, and Prisma ORM.

## 2. Core Entities
- **User**: Authentication, profile, loyalty/gift points balance.
- **Address**: User shipping/billing delivery addresses.
- **Category**: Hierarchical book classifications (e.g., Fiction, Science, Technology).
- **Brand / Publisher**: Publishers and imprint brands (e.g., O'Reilly, Penguin Random House, HarperCollins, Packt).
- **Book (Product)**: ISBN, title, description, price, cover image, rating, stock/format (ePub, PDF, Hardcover), category, publisher.
- **Order & OrderItem**: Order transactions, status, totals, points redeemed, payment method, support for "Buy It Again".
- **Cart & CartItem**: Active user cart items.
- **PaymentTransaction**: Payment record (Credit/Debit Card, Net Banking, UPI, Gift Points).
