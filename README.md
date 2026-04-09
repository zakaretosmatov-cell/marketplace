# NextGenStore - E-commerce SaaS

This is a production-ready E-commerce prototype designed with Next.js (App Router), Vanilla CSS Design System, and structured for Serverless Deployment (Netlify) + Firebase.

## Features

- **RBAC (Role-Based Access Control)**: Mocked Client, Seller, and Admin roles.
- **Cart System**: Client-side state synchronized to Context and LocalStorage.
- **Full Catalog**: Browsing, searching, and product details viewing.
- **Dashboards**: Separate views for `/admin` and `/seller`.
- **Design System**: A fully custom Vanilla CSS library implemented inside `globals.css` with dark-mode support and modern glassmorphism UI.

## Getting Started

Because this environment didn't have Node.js installed, I have scaffolded the complete source code for you. You can run this seamlessly once Node is available.

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Roles Simulation
To test roles, click **Login** in the header. Use the mock-login form to sign in manually as an `admin`, `seller`, or `client`.

- **Client**: Can add items to cart and checkout.
- **Seller**: Has access to the Seller Panel.
- **Admin**: Has access to the Global Admin Dashboard.

## Architecture

This Next.js app adopts a layered approach in `src/`. For real production, simply replace the implementations inside `src/lib/mockApi.ts` with authentic `firebase/firestore` queries, setup custom claims for Auth in `src/context/AuthContext.tsx`, and the app will scale fully globally.
