# ✨ LuminaApp

LuminaApp is a full-stack e-commerce application built with Next.js. It includes a customer storefront, account and checkout flows, product reviews, inventory-aware ordering, and an administration area for catalog, order, return, purchase, user, and review management.

## 🌟 Features

### 🛍️ Storefront

- Browse, search, sort, and filter products and category pages
- Select product variants with independent prices, stock levels, SKUs, and images
- Persistent cart and wishlist experiences
- Multi-step checkout with standard, express, and overnight shipping
- Stripe-hosted payment flow with server-side price and inventory validation
- Customer account, addresses, order history, order details, cancellation, returns, and invoice generation
- Product ratings, written reviews, images, voting, reporting, and seller responses
- Newsletter subscription and in-app notifications
- Shipping, returns, privacy, and terms pages

### 🔐 Authentication

- Email/password registration with email verification
- Google sign-in
- Password reset by email
- Seven-day sessions powered by Better Auth
- Protected account and administration routes
- User, moderator, and administrator roles

### 🛠️ Administration

- Dashboard and revenue reporting
- Product, variant, image, category, and inventory management
- Order status and return-request management
- Purchase/restocking records
- User administration
- Review moderation, statistics, and analytics

## 🧰 Technology

- Next.js 16 App Router, React 19, and TypeScript
- Tailwind CSS 4
- MongoDB, Mongoose, and the Better Auth MongoDB adapter
- Stripe Checkout
- Cloudinary product and review images
- Resend and SMTP/Nodemailer email delivery
- TanStack Query and TanStack Table
- React Hook Form and Zod validation
- React Email templates

## 🚀 Getting started

### ✅ Prerequisites

- Node.js 20 or newer
- pnpm
- A MongoDB database
- Accounts/credentials for Stripe, Cloudinary, and an email provider
- Google OAuth credentials if Google sign-in is enabled

### 📦 Installation

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000).

### 🔑 Environment variables

Fill in `.env.local` using [`.env.example`](./.env.example) as a guide.

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string used by Mongoose and Better Auth |
| `BETTER_AUTH_SECRET` | Secret used to sign authentication data; use a long random value |
| `BETTER_AUTH_URL` | Canonical Better Auth URL, such as `http://localhost:3000` |
| `NEXT_PUBLIC_APP_URL` | Public application origin used by auth, email links, and checkout redirects |
| `NEXT_PUBLIC_BASE_URL` | Legacy/fallback application origin used by some email and checkout code |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth application credentials |
| `STRIPE_SECRET_KEY` | Stripe server-side API key |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `NEXT_PUBLIC_CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret; server-only |
| `RESEND_API_KEY` | Resend key for transactional and review-request email |
| `EMAIL_FROM` | Verified sender address |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` | SMTP credentials used by verification and password-reset email |

Never expose variables without the `NEXT_PUBLIC_` prefix to client components or commit real secrets.

## ⌨️ Commands

```bash
pnpm dev      # start the development server
pnpm build    # create a production build
pnpm start    # run the production build
pnpm lint     # run ESLint
```

There is currently no automated test script in `package.json`.

## 🗂️ Project structure

```text
app/
  (shop)/              Storefront, authentication, account, and policy pages
  (management)/admin/  Administration pages
  api/                 Route handlers for app data and integrations
components/             UI grouped by feature
context/                Cart, wishlist, sidebar, and query providers
hooks/                  Data fetching, mutations, and UI hooks
lib/
  db/models/            Mongoose models
  email-templates/      React Email templates
  queries/              Server-side read/query functions
  services/             Inventory and email services
  validations/          Zod request and form schemas
public/                 Static product and application assets
utils/                  Search, filtering, and redirect helpers
proxy.ts                Route protection and auth-page redirects
```

The App Router route groups organize the source without changing public URLs. For example, `app/(shop)/cart/page.tsx` is served at `/cart`.

## 🧭 Main routes

| Area | Routes |
| --- | --- |
| Store | `/`, `/products`, `/products/[id]`, `/categories`, `/categories/[slug]` |
| Shopping | `/cart`, `/wishlist`, `/checkout`, `/checkout/success`, `/checkout/cancel` |
| Authentication | `/login`, `/register`, `/verify-email`, `/forgot-password`, `/reset-password` |
| Account | `/account`, `/account/addresses`, `/account/orders`, `/account/orders/[id]`, `/account/settings` |
| Admin | `/admin`, `/admin/products`, `/admin/categories`, `/admin/orders`, `/admin/purchases`, `/admin/reviews`, `/admin/users` |

## 🔌 API overview

All endpoints are implemented as Next.js route handlers under `app/api`.

| Endpoint | Methods | Responsibility |
| --- | --- | --- |
| `/api/auth/[...all]` | Better Auth handlers | Sign-up, sign-in, sessions, verification, OAuth, and password reset |
| `/api/products` | `GET`, `POST` | List/filter and create products |
| `/api/products/[id]` | `GET`, `PUT`, `PATCH` | Read and update a product |
| `/api/products/[id]/variants/[variantId]` | `PATCH` | Update a variant |
| `/api/products/[id]/variants/[variantId]/images` | `PATCH`, `DELETE` | Update or remove variant images |
| `/api/categories` | `GET`, `POST` | List and create categories |
| `/api/categories/[id]` | `GET`, `PUT`, `DELETE` | Read, update, and delete a category |
| `/api/checkout/session` | `POST` | Revalidate inventory and create a Stripe Checkout session |
| `/api/checkout/order` | `POST` | Create an order after checkout |
| `/api/reviews` | `GET`, `POST`, `PATCH` | Query, submit, and moderate reviews |
| `/api/reviews/[reviewId]/vote` | `GET`, `POST` | Read or submit helpfulness votes |
| `/api/reviews/[reviewId]/report` | `POST` | Report a review |
| `/api/orders/[id]/returns` | `POST` | Submit a return request |
| `/api/notifications` | `GET`, `PATCH`, `DELETE` | List, mark, or clear notifications |
| `/api/purchases` | `GET`, `POST`, `PATCH` | Manage restocking purchases |
| `/api/newsletter/subscribe` | `POST` | Subscribe an email address |
| `/api/admin/*` | `GET`/`PATCH` | Order, return, and review administration and analytics |

Authentication and authorization checks live in route handlers/server helpers as well as `proxy.ts`; do not rely on UI visibility as an access-control boundary.

## 🗃️ Data model

The primary MongoDB models are:

- `Product`: catalog details, embedded variants, image references, specifications, ratings, flags, and sales totals
- `Category`: hierarchical categories with ancestors and slugs
- `Order`: line-item snapshots, shipping/payment totals, status history, and inventory adjustment state
- `Purchase`: supplier/restocking records and status
- `Review`: rating, content, moderation state/history, reports, votes, images, and seller response
- `ReturnRequest`: requested items, reasons, status, and status history
- `User`: application profile, role, cart, and wishlist data
- `Address`, `Notification`, and `NewsletterSubscriber`

## 🛒 Checkout and inventory flow

1. The browser submits product IDs, variant IDs, quantities, shipping details, and payment details.
2. `/api/checkout/session` reloads product and variant data from MongoDB. Client-provided prices and stock are not trusted.
3. The server validates availability, calculates shipping and 8% tax, and creates a Stripe Checkout session.
4. After successful payment, the success flow creates the order and inventory services apply stock adjustments.

Standard shipping is free from $50; otherwise it is $5.99. Express is $12.99 and overnight is $24.99. Currency is currently hard-coded to USD.

## ☁️ Deployment

The project is configured for Vercel. Add all production environment variables in the deployment settings, ensure the public application URLs use the deployed HTTPS origin, and configure OAuth/Stripe redirect origins accordingly.

`vercel.json` currently schedules `/api/cron/review-requests` daily at 10:00 UTC. That route is not present in the repository, so add the handler or remove the cron entry before relying on the scheduled review-email workflow.

Before deployment, run:

```bash
pnpm lint
pnpm build
```

## 📝 Implementation notes

- Uploaded image records store both a Cloudinary `secure_url` and `public_id`.
- Product variants currently model `color`, `size`, and optional `material` attributes.
- Review aggregate values are maintained on products when approved review data changes.
- `proxy.ts` requires authentication for `/admin` and `/account` paths and redirects signed-in users away from authentication pages. Administrative API handlers must continue to enforce roles independently.
