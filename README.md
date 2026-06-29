# Vendor Management & Quotation System

A full-stack web application that helps organizations manage vendors, request quotations, track vendor responses, and compare proposals through a centralized platform — replacing the usual email/spreadsheet-based procurement workflow.

Built as part of the **Teyzix Core Internship (June Batch)** — Task FS-2 (Full-Stack Web Development).

🔗 **Live Demo:** https://vendor-hub-cyan.vercel.app
🔗 **Backend API:** https://vendor-hub-production-3fba.up.railway.app

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Default Login Credentials](#default-login-credentials)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [Author](#author)

---

## Features

### Core Requirements

**Vendor Management**
- Add, view, update, and delete vendors
- Search and filter vendors by name, company, or email
- Each vendor has a dedicated profile drawer showing full details + quotation history

**Quotation Management**
- Create a quotation request and assign it to one or more vendors in a single action
- Each assigned vendor receives their own quotation record (auto-grouped under one request)
- Vendors (or admin on their behalf) can submit a response with amount and submission date
- Admin can approve or reject submitted quotations
- Full quotation history is viewable and filterable by status

**Dashboard**
- Total Vendors
- Active Quotations
- Pending Quotations
- Approved Quotations
- Quotation status breakdown (donut chart)
- Top Vendors by Approvals (leaderboard)
- Recent Activity feed

**Quotation Comparison**
- Compare all vendor responses submitted for the same quotation request, side by side
- Automatically highlights the most cost-effective ("Best Price") quotation
- Shows potential savings between the lowest and highest quote
- Tracks status of each quotation in the comparison view

### Additional / Bonus Features

- **Authentication** — JWT-based login for Admin users (register/login)
- **Vendor Portal** — A separate, secure login for vendors to view only their own assigned quotation requests and submit their pricing directly (no email back-and-forth)
- **PDF Export** — Export any quotation comparison as a branded PDF report
- **Dark Mode** — Full app-wide light/dark theme toggle, persisted across sessions
- **Admin Profile & Vendor Profile pages**
- **Responsive UI** with form validation and error handling throughout
- **Animated, distinctive UI** (entrance animations, sliding drawers, animated backgrounds) built on a custom navy & gold design system

---

## Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- React Router DOM
- Axios
- Recharts (dashboard charts)
- jsPDF + jspdf-autotable (PDF export)
- Lucide React (icons)

**Backend**
- Node.js + Express.js
- MongoDB with Mongoose
- JWT (jsonwebtoken) for authentication
- bcryptjs for password hashing

**Deployment**
- Frontend: Vercel
- Backend: Railway
- Database: MongoDB Atlas

---

## Project Structure

```
vendor-quotation-system/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── vendorAuth.controller.js
│   │   ├── vendor.controller.js
│   │   ├── quotation.controller.js
│   │   └── dashboard.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js      # protects admin routes
│   │   ├── protectVendor.middleware.js  # protects vendor portal routes
│   │   └── error.middleware.js
│   ├── models/
│   │   ├── user.model.js           # admin accounts
│   │   ├── vendor.model.js
│   │   └── quotation.model.js
│   ├── routes/
│   │   ├── auth.route.js
│   │   ├── vendorAuth.route.js
│   │   ├── vendor.route.js
│   │   ├── quotation.route.js
│   │   └── dashboard.route.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   └── src/
│       ├── api/                    # axios instances + API call functions
│       ├── components/
│       │   ├── Layout/             # Sidebar, Navbar, Footer, MainLayout
│       │   ├── Vendor/             # VendorFormModal, VendorDrawer
│       │   ├── Quotation/          # QuotationFormModal, RespondModal
│       │   └── VendorPortal/       # VendorProfileDrawer
│       ├── context/                # AuthContext, ThemeContext
│       ├── pages/
│       │   ├── Login.jsx / Register.jsx       (admin)
│       │   ├── VendorLogin.jsx / VendorDashboard.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Vendors.jsx
│       │   ├── Quotations.jsx
│       │   ├── Comparison.jsx
│       │   └── Profile.jsx
│       ├── routes/                 # ProtectedRoute, VendorProtectedRoute
│       ├── App.jsx
│       └── index.css
│
└── README.md
```

---

## Database Schema

### `users` (Admin accounts)
| Field | Type | Notes |
|---|---|---|
| name | String | required |
| email | String | required, unique |
| password | String | hashed (bcrypt), select: false |
| role | String | enum: admin, manager |

### `vendors`
| Field | Type | Notes |
|---|---|---|
| vendorName | String | required |
| companyName | String | required |
| email | String | required, unique |
| password | String | hashed (bcrypt) — used for Vendor Portal login |
| contactNumber | String | required |
| address | String | required |

### `quotations`
| Field | Type | Notes |
|---|---|---|
| title | String | required |
| description | String | optional |
| vendor | ObjectId | ref → Vendor, required |
| requestGroup | String | links all vendor quotations from the same request, used for comparison |
| amount | Number | null until vendor responds |
| submissionDate | Date | null until vendor responds |
| status | String | enum: Pending, Submitted, Approved, Rejected |

**Relationship logic:** When a quotation request is created and assigned to multiple vendors, one `Quotation` document is created per vendor — all sharing the same `requestGroup` value. This allows the Comparison feature to pull and compare every vendor's response to the same request.

---

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- A MongoDB Atlas account (or local MongoDB instance)

### Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder (see [Environment Variables](#environment-variables)).

```bash
npm run dev
```

Backend runs at `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` folder:
```
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## Environment Variables

### Backend (`backend/.env`)
```
MONGO_URL = mongodb+srv://esharajpoot156_db_user:zHn5ahNxqFPouhFu@cluster0.t1vn8fc.mongodb.net/myDatabase?retryWrites=true&w=majority
PORT=5000
JWT_SECRET= hellohellohello1234
JWT_EXPIRE=7d
```

### Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:5000/api
```

---

## API Endpoints

### Admin Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new admin |
| POST | `/api/auth/login` | Admin login |
| GET | `/api/auth/me` | Get logged-in admin's info (protected) |

### Vendor Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/vendor-auth/login` | Vendor portal login |

### Vendors (Admin only)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/vendors` | List/search vendors |
| GET | `/api/vendors/:id` | Get a single vendor |
| POST | `/api/vendors` | Create a vendor |
| PUT | `/api/vendors/:id` | Update a vendor |
| DELETE | `/api/vendors/:id` | Delete a vendor |

### Quotations (Admin)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/quotations` | Create a request & assign to one or more vendors |
| GET | `/api/quotations` | List quotations (filterable by status/vendor) |
| GET | `/api/quotations/requests` | List all grouped quotation requests |
| GET | `/api/quotations/:id` | Get a single quotation |
| PUT | `/api/quotations/:id/respond` | Submit a response on behalf of a vendor |
| PUT | `/api/quotations/:id/status` | Approve / Reject a quotation |
| GET | `/api/quotations/compare/:requestGroup` | Compare all responses for a request |
| DELETE | `/api/quotations/:id` | Delete a quotation |

### Quotations (Vendor Portal)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/quotations/vendor/mine` | Get quotations assigned to the logged-in vendor |
| PUT | `/api/quotations/vendor/:id/respond` | Vendor submits their own response |

### Dashboard
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard` | Get dashboard statistics |

---

## Default Login Credentials

**Admin:**
```
Email: admin@test.com
Password: 123456
```

**Vendor (example):**
```
Email: sara@ahmedfurniture.com
Password: vendor123
```

---

## Deployment

| Layer | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Railway |
| Database | MongoDB Atlas |

The frontend communicates with the backend via the `VITE_API_URL` environment variable, making it easy to point the app at any backend environment (local, staging, production) without code changes.




