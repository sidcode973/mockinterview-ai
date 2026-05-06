# MockInterview AI

AI-powered mock interview platform built with Next.js, TypeScript, MongoDB, and Stripe.  
It helps users practice realistic interviews, receive AI-driven feedback, and track progress over time.

## Why This Project Stands Out

- End-to-end product flow: authentication, interview generation, answer evaluation, payments, and analytics.
- Real business logic: subscription lifecycle management with Stripe webhooks and role-based access control.
- Production-style architecture: App Router API routes, server controllers, middleware protection, and reusable UI modules.
- Admin capabilities: dashboard analytics, user/interview management, and subscription insights.

## Key Features

- AI-generated interview questions based on topic/type/difficulty.
- Answer evaluation with scoring dimensions (clarity, relevance, completeness).
- Interview progress tracking, results view, and performance statistics.
- Secure authentication with credentials + OAuth (Google and GitHub) using NextAuth.
- Subscription payments and invoice history via Stripe.
- Role-aware routing and API authorization (`user` vs `admin`).
- Admin dashboard with aggregate stats and management views.
- Dark mode support with `next-themes`.

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, HeroUI
- **Backend/API:** Next.js Route Handlers, controller-service style modules
- **Database:** MongoDB + Mongoose
- **Authentication:** NextAuth (Credentials, Google, GitHub)
- **AI:** Google Generative AI (`@google/genai`)
- **Payments:** Stripe (subscriptions, webhooks, invoices)
- **Media/Email:** Cloudinary, Nodemailer
- **Charts/UX:** Recharts, Framer Motion, React Hot Toast

## Project Structure

```text
app/
  api/                  # Route handlers (auth, interviews, dashboard, admin, payments)
  app/                  # Authenticated user pages
  admin/                # Admin pages
backend/
  config/               # DB connection and backend configuration
  controllers/          # Core business logic
  models/               # Mongoose schemas/models
  middlewares/          # Async/error middleware utilities
  utils/                # Stripe, cloudinary, auth, query helpers
components/             # Reusable UI and feature components
actions/                # Server actions used by client components
helpers/                # Shared helper functions
middleware.ts           # Route protection and role/subscription gating
```

## Main User Flows

1. **User Authentication**
   - Login/register with credentials or OAuth provider.
   - JWT session is enriched with fresh DB user data.

2. **Interview Lifecycle**
   - Create interview -> AI generates questions -> user answers.
   - Answers are evaluated -> interview completion + scores are stored.
   - User views result details and aggregated stats.

3. **Subscription Lifecycle**
   - User subscribes via Stripe.
   - Subscription status is persisted immediately in DB.
   - Stripe webhook handles renewals, failures, cancellations.
   - Invoice history can be fetched from Stripe customer records.

4. **Admin Operations**
   - Access admin-only dashboards and data views.
   - Manage users and interviews.
   - Monitor platform metrics like completion rate and subscription worth.

## Environment Variables

Create `.env.local` in the project root and configure:

```bash
# App / URLs
API_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# MongoDB
MONGODB_URI_LOCAL=your_local_mongodb_uri
MONGODB_URI=your_production_mongodb_uri

# OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# AI
GEMINI_API_KEY=your_gemini_api_key

# Stripe
NEXT_PUBLIC_STRIPE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
STRIPE_PRICE_ID=your_recurring_price_id

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# SMTP
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
FROM_NAME=MockInterview AI
FROM_EMAIL=no-reply@example.com
```

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build and Quality Checks

```bash
npm run lint
npm run build
npm run start
```

## API Surface (High-Level)

- `POST /api/auth/[...nextauth]` - authentication flows
- `GET /api/interviews` - list interviews for current user
- `GET /api/interviews/:id` - fetch interview detail
- `POST /api/interviews` - create interview
- `GET /api/dashboard/stats` - user-level dashboard stats
- `GET /api/admin/stats` - admin metrics
- `GET /api/admin/interviews` - admin interview listing
- `GET /api/admin/users` - admin user listing
- `POST /api/payment/webhook` - Stripe webhook events
- `GET /api/invoices` - invoices for current user

## Security and Access Control

- Session-based auth powered by NextAuth JWT strategy.
- Route/API protection in `middleware.ts`.
- Admin-only routes under `/admin` and `/api/admin/*`.
- Subscription-aware gating for premium app routes.

## Notes for Evaluators / Interviewers

This project demonstrates:

- Clean separation of concerns between UI, route handlers, and business controllers.
- Real-world integrations (OAuth, AI evaluation, Stripe subscriptions/webhooks).
- Data modeling and state synchronization between external services and MongoDB.
- Scalable feature design with both user and admin experiences.

## Deployment

Deploy on Vercel or any Node-compatible platform with environment variables configured.  
For Stripe webhooks in development, use Stripe CLI forwarding:

```bash
stripe listen --forward-to localhost:3000/api/payment/webhook
```

---

If you are reviewing this repository for hiring purposes, please check the `backend/controllers` and `app/api` modules first; they contain the core product and integration logic that best reflect engineering decisions.
