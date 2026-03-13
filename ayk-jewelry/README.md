# AYK Jewelry — Full Stack Next.js App

Luxury jewelry e-commerce with Google Sheets backend, Cloudinary image hosting, and Vercel deployment.

---

## 🚀 Deploy to Vercel in 5 Steps

### 1. Google Sheets Setup
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project → Enable **Google Sheets API**
3. Create a **Service Account** → Download JSON key
4. Create a Google Sheet with two tabs: `products` and `orders`
5. Share the sheet with the service account email (Editor role)
6. Copy the Sheet ID from the URL: `docs.google.com/spreadsheets/d/**SHEET_ID**/edit`

**Sheet headers (add these to row 1 of each tab):**

`products`: `id | name | price | stock | image1 | image2 | image3 | description | category | status | variants`

`orders`: `id | reference | name | phone | location | product_name | product_id | variant | quantity | amount | status | timestamp`

### 2. Cloudinary Setup
1. Sign up at [cloudinary.com](https://cloudinary.com) (free tier works)
2. Get your **Cloud Name**, **API Key**, **API Secret** from the dashboard

### 3. Environment Variables
Copy `.env.example` to `.env.local` and fill in:

```bash
cp .env.example .env.local
```

Key variables:
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` — from the JSON key file
- `GOOGLE_PRIVATE_KEY` — the `private_key` field from JSON (keep the `\n` characters)
- `GOOGLE_SHEET_ID` — from your Sheet URL
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `JWT_SECRET` — generate with: `openssl rand -base64 32`
- `ADMIN_USERNAME` — your admin username
- `ADMIN_PASSWORD_HASH` — your admin password (plain text, checked server-side)

### 4. Local Development
```bash
npm install
npm run dev
# Visit http://localhost:3000 (shop)
# Visit http://localhost:3000/admin (admin panel)
```

### 5. Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add all env vars when prompted, or via Vercel dashboard
# Settings → Environment Variables
```

Or connect your GitHub repo to Vercel for auto-deploy on push.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/login/route.ts      ← POST /api/auth/login
│   │   ├── auth/verify/route.ts     ← GET  /api/auth/verify
│   │   ├── products/route.ts        ← GET/POST /api/products
│   │   ├── products/[id]/route.ts   ← DELETE/PATCH /api/products/:id
│   │   ├── orders/route.ts          ← GET/POST /api/orders
│   │   ├── orders/[id]/route.ts     ← PATCH /api/orders/:id
│   │   └── upload/route.ts          ← POST /api/upload
│   ├── admin/page.tsx               ← Admin panel
│   ├── page.tsx                     ← Shop homepage
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── admin/    Dashboard, LoginForm, OrderManager, ProductManager
│   ├── cart/     CartDrawer
│   ├── layout/   BackgroundEffects, Header
│   ├── product/  ProductCard, ProductGrid
│   └── ui/       Button, Input, Card, Badge
├── hooks/        useAuth, useOrders, useProducts, useUpload
├── lib/          auth, cloudinary, constants, queryClient, rateLimit, sheets, utils
└── types/        index.ts
```

---

## 🔐 Security Features
- JWT authentication (jose, works on Vercel Edge)
- Rate limiting on auth (5 req/5min) and orders (3 req/15min)
- Input sanitization + Zod validation on all API routes
- Ghana phone number validation
- Admin-only routes protected server-side

## 📲 Telegram Notifications (Optional)
1. Message [@BotFather](https://t.me/BotFather) → `/newbot`
2. Get chat ID from [@userinfobot](https://t.me/userinfobot)
3. Add `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` to env

---

## 🛠 Tech Stack
- **Framework**: Next.js 14 App Router
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State**: TanStack Query v5
- **Database**: Google Sheets
- **Images**: Cloudinary
- **Auth**: JWT via jose
- **Validation**: Zod
- **Deployment**: Vercel
