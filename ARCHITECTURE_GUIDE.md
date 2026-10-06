# Full-Stack Portfolio Architecture & Operational Guide

This document describes the architecture, environment configuration, database seeding, and workflows for your full-stack portfolio and private admin CMS.

---

## Architecture Overview

```
                               ┌──────────────────────────────────────────────────────────┐
                               │                    CLIENT (Vite SPA)                     │
                               │                                                          │
                               │  [Public Pages]                     [Private Admin]      │
                               │  /, /software,                      /admin/login         │
                               │  /photography, /about               /admin/dashboard     │
                               │  (Isolated PublicLayout)            (ProtectedRoute)     │
                               └─────────────┬───────────────────────────────┬────────────┘
                                             │ GET                           │ POST/PUT/DELETE
                                             │ (Public Endpoints)            │ (Bearer JWT)
                                             ▼                               ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                           BACKEND API (Node.js + Express)                               │
│                                                                                         │
│  [CORS / Rate Limiting] ──► [JWT Auth Guard] ──► [Multer Memory Storage / Controllers]  │
└──────────────────────────┬─────────────────────────────────┬────────────────────────────┘
                           │ MongoDB Documents               │ Stream Images
                           ▼                                 ▼
              ┌────────────────────────┐         ┌────────────────────────┐
              │    MongoDB (Mongoose)  │         │    Cloudinary Storage  │
              │                        │         │                        │
              │ - projects             │         │ - /portfolio/projects  │
              │ - photos               │         │ - /portfolio/photo...  │
              │ - users (admin only)   │         │ - auto WebP / quality  │
              └────────────────────────┘         └────────────────────────┘
```

---

## 1. Quick Start Commands

From the workspace root directory:

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts the **React + Vite frontend** on `http://localhost:5173` |
| `npm run server` | Starts the **Express API server** in development mode on `http://localhost:5000` |
| `npm run build` | Builds the frontend for production |
| `npm run seed:admin` | Provisions or resets your private admin credentials |
| `npm run seed:demo` | Seeds initial placeholder projects and photography into MongoDB |

---

## 2. Environment Configuration

### Frontend (`.env` in project root)
```env
# Contact Form (EmailJS)
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key

# Backend API Endpoint
VITE_API_URL=http://localhost:5000/api
```

### Backend (`server/.env`)
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# MongoDB Connection String (Local or MongoDB Atlas)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/portfolio?retryWrites=true&w=majority

# Cloudinary Image Storage (From your Cloudinary Dashboard)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# JWT Secret (Use a long random string in production)
JWT_SECRET=super_secret_jwt_key_at_least_32_characters_long
JWT_EXPIRES_IN=7d

# Initial Admin Credentials (used by `npm run seed:admin`)
ADMIN_EMAIL=admin@portfolio.com
ADMIN_PASSWORD=change_this_secure_password_123
```

---

## 3. Database Setup (MongoDB Atlas)

1. Create a free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free **M0 Shared Cluster**.
3. Under **Database Access**, create a database user (e.g. `portfolioAdmin`) with a strong password.
4. Under **Network Access**, add an IP access rule (allow access from anywhere `0.0.0.0/0` during initial development).
5. Click **Connect** $\rightarrow$ **Drivers** $\rightarrow$ Copy the connection string.
6. Replace `<password>` with your database user password, and set the database name to `/portfolio`.
7. Paste this connection string into `MONGODB_URI` in `server/.env`.

---

## 4. Cloudinary Setup (Image Storage)

1. Sign up for a free account at [cloudinary.com](https://cloudinary.com/).
2. On your Cloudinary Dashboard, locate:
   - **Cloud name**
   - **API Key**
   - **API Secret**
3. Paste these three keys into `server/.env`:
   ```env
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   ```
4. Now, any image you upload in the admin dashboard streams directly to Cloudinary and is saved with automatic WebP/AVIF compression. When you delete a project or photo, the remote asset is automatically deleted from Cloudinary.

---

## 5. Admin Provisioning & Login

### Step A: Provision Admin
Run:
```bash
npm run seed:admin
```
This script reads `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `server/.env`, salts and hashes the password using `bcrypt`, and registers the account in MongoDB.

### Step B: Access Admin Console
1. Start both servers:
   ```bash
   npm run dev       # Terminal 1
   npm run server    # Terminal 2
   ```
2. In your browser, navigate to:
   ```
   http://localhost:5173/admin/login
   ```
3. Enter your admin email and password.
4. You will be redirected to `/admin/dashboard`.

---

## 6. Admin Workflows

### Managing Software Projects (`/admin/projects`)
- **Add Project (`/admin/projects/new`)**:
  - Enter Project Title, Description, Technologies/Tags (comma-separated, e.g. `React, TypeScript, CSS`).
  - Provide GitHub repository link and Live demo link.
  - Drag and drop or choose a screenshot/cover image file.
  - Check "Feature on Homepage preview" if desired.
  - Click **Create Project**.
- **Edit Project (`/admin/projects/:id/edit`)**:
  - Modify any text fields or links.
  - Optionally pick a new image to replace the existing one on Cloudinary.
- **Toggle Featured**: Click the **★ Featured** / **Standard** badge in the project table to instantly toggle homepage visibility.
- **Delete Project**: Click **Delete**. The document is removed from MongoDB and its Cloudinary asset is automatically destroyed.

### Managing Photography (`/admin/photography`)
- **Batch Upload Photography (`/admin/photography/upload`)**:
  - Drag or select multiple photos at once (up to 20 files per batch).
  - Preview photos with individual removal buttons.
  - Choose a category (Portraits, Editorial, Street, Studio, Architecture, or enter a new custom category).
  - Toggle "Mark as featured in Latest shots".
  - Click **Upload Photos**. All images stream concurrently to Cloudinary and register in MongoDB.
- **In-Place Edit**: Click **Edit** on any photo card to open the modal and update title, category, description, or featured status.
- **Category Filter**: Use the category dropdown to quickly filter by shoot type.

---

## 7. Public Portfolio Resilience

- **Public Isolation**: Public visitors viewing `/`, `/software`, `/photography`, `/about`, or `/contact` have zero access to admin routes or controls.
- **Graceful Fallback**: If MongoDB or the backend server is ever stopped or unreachable, the frontend automatically falls back to your static demo data (`softwareProjects.js` and `photographyData.js`), ensuring your portfolio never crashes or renders a blank page.
- **Instant Synchronization**: Whenever you add, edit, or delete items in the admin dashboard, the public pages automatically reflect those changes immediately upon reload.
