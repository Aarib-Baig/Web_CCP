# Fruit mStore - Project Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [System Architecture](#system-architecture)
4. [Entity Relationship Diagram (ERD)](#entity-relationship-diagram-erd)
5. [Database Schema](#database-schema)
6. [API Documentation](#api-documentation)
7. [Security Features](#security-features)
8. [User Roles & Permissions](#user-roles--permissions)
9. [Screenshots](#screenshots)

---

## System Overview

**Fruit mStore** is a full-stack e-commerce web application for selling fresh fruits, vegetables, and other grocery items. The application provides a seamless shopping experience for customers and comprehensive management tools for administrators.

### Key Features

**For Customers:**
- Browse products with category filtering
- Filter products by stock availability
- Add items to shopping cart
- Secure checkout with delivery address
- View order history and track order status
- User registration and authentication

**For Administrators:**
- Dashboard with order statistics and revenue tracking
- Add, edit, and delete products
- Manage product inventory and stock status
- View and manage all customer orders
- Update order status (pending → confirmed → delivered)

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React.js 18 |
| **Routing** | React Router DOM v6 |
| **State Management** | React Context API |
| **HTTP Client** | Axios |
| **Backend** | Node.js with Express.js |
| **Database** | MongoDB (NoSQL) |
| **ODM** | Mongoose |
| **Authentication** | JWT (JSON Web Tokens) |
| **Password Security** | bcrypt.js |
| **Deployment** | Vercel (Serverless) |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                        │
│                    React.js Frontend                         │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTP/HTTPS (REST API)
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    EXPRESS.JS SERVER                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Routes    │  │ Middleware  │  │    Controllers      │  │
│  │  /api/auth  │  │    CORS     │  │  Business Logic     │  │
│  │/api/products│  │    JWT      │  │                     │  │
│  │ /api/orders │  │ Rate Limit  │  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────┬───────────────────────────────────┘
                          │ Mongoose ODM
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                     MONGODB DATABASE                         │
│     ┌──────────┐   ┌──────────┐   ┌──────────┐             │
│     │  Users   │   │ Products │   │  Orders  │             │
│     └──────────┘   └──────────┘   └──────────┘             │
└─────────────────────────────────────────────────────────────┘
```

---

## Entity Relationship Diagram (ERD)

```
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│      USER        │       │     PRODUCT      │       │      ORDER       │
├──────────────────┤       ├──────────────────┤       ├──────────────────┤
│ _id (ObjectId)   │       │ _id (ObjectId)   │       │ _id (ObjectId)   │
│ name (String)    │       │ name (String)    │       │ userId (FK→User) │
│ email (String)   │       │ category (String)│       │ items [Array]    │
│ password (Hash)  │       │ price (Number)   │       │  ├─productId(FK) │
│ phone (String)   │       │ unit (String)    │       │  ├─name          │
│ role (Enum)      │       │ stockStatus(Bool)│       │  ├─price         │
│ createdAt (Date) │       │ imageUrl (String)│       │  └─quantity      │
└────────┬─────────┘       │ description      │       │ totalAmount      │
         │                 │ createdAt (Date) │       │ deliveryAddress  │
         │                 └────────┬─────────┘       │  ├─street        │
         │                          │                 │  ├─area          │
         │   1:N                    │                 │  ├─city          │
         └──────────────────────────┼─────────────────│  └─postalCode    │
                                    │ N:M             │ paymentMethod    │
                                    └─────────────────│ orderStatus(Enum)│
                                                      │ createdAt (Date) │
                                                      └──────────────────┘

RELATIONSHIPS:
• User (1) ──────< (N) Order     : One user can have many orders
• Product (N) >──< (M) Order     : Many products can be in many orders (via items array)
```

---

## Database Schema

### User Collection
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | ObjectId | Auto-generated | Unique identifier |
| `name` | String | Required, Trimmed | User's full name |
| `email` | String | Required, Unique, Lowercase | User's email address |
| `password` | String | Required, Hashed | bcrypt hashed password |
| `phone` | String | Required | Contact phone number |
| `role` | String | Enum: ['customer', 'admin'] | User role, default: 'customer' |
| `createdAt` | Date | Default: Date.now | Account creation timestamp |

### Product Collection
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | ObjectId | Auto-generated | Unique identifier |
| `name` | String | Required, Trimmed | Product name |
| `category` | String | Enum: ['Fruits', 'Vegetables', 'Herbs', 'Dairy', 'Others'] | Product category |
| `price` | Number | Required, Min: 0 | Price in PKR |
| `unit` | String | Enum: ['kg', 'piece', 'dozen', 'bunch'] | Unit of measurement |
| `stockStatus` | Boolean | Default: true | Availability status |
| `imageUrl` | String | Default: placeholder | Product image URL |
| `description` | String | Optional, Trimmed | Product description |
| `createdAt` | Date | Default: Date.now | Product creation timestamp |

### Order Collection
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | ObjectId | Auto-generated | Unique identifier |
| `userId` | ObjectId | Required, Ref: 'User' | Reference to User who placed order |
| `items` | Array | Required | Array of ordered items |
| `items.productId` | ObjectId | Required, Ref: 'Product' | Reference to Product |
| `items.name` | String | - | Product name (denormalized) |
| `items.price` | Number | - | Price at time of order |
| `items.quantity` | Number | Required, Min: 1 | Quantity ordered |
| `totalAmount` | Number | Required, Min: 0 | Order total in PKR |
| `deliveryAddress` | Object | Required | Delivery address details |
| `paymentMethod` | String | Enum: ['Cash on Delivery', 'Online Payment'] | Payment method |
| `orderStatus` | String | Enum: ['pending', 'confirmed', 'delivered', 'cancelled'] | Order status |
| `createdAt` | Date | Default: Date.now | Order placement timestamp |

---

## API Documentation

### Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.vercel.app/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |

#### POST /auth/register
**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "03001234567"
}
```
**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

#### POST /auth/login
**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
**Response (200):** Same as register response

---

### Product Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/products` | Get all products | No |
| GET | `/products/:id` | Get single product | No |
| POST | `/products` | Create product | Admin Only |
| PUT | `/products/:id` | Update product | Admin Only |
| DELETE | `/products/:id` | Delete product | Admin Only |

#### GET /products
**Query Parameters:**
- `category` (optional): Filter by category
- `inStock` (optional): Filter by stock status ('true')

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Fresh Apples",
    "category": "Fruits",
    "price": 250,
    "unit": "kg",
    "stockStatus": true,
    "imageUrl": "https://...",
    "description": "Fresh red apples"
  }
]
```

---

### Order Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/orders` | Place new order | Yes |
| GET | `/orders/my-orders` | Get user's orders | Yes |
| GET | `/orders` | Get all orders | Admin Only |
| GET | `/orders/:id` | Get single order | Yes (Owner/Admin) |
| PUT | `/orders/:id/status` | Update order status | Admin Only |

---

## Security Features

### Implemented Security Measures

| Feature | Implementation | Description |
|---------|---------------|-------------|
| **Password Hashing** | bcrypt (10 rounds) | Passwords are never stored in plain text |
| **JWT Authentication** | jsonwebtoken | Stateless authentication with 7-day expiry |
| **Role-Based Access** | Custom middleware | Admin-only routes are protected |
| **Rate Limiting** | Custom middleware | Prevents brute-force attacks on auth endpoints |
| **Input Validation** | Schema validation | Required fields are validated before processing |
| **CORS** | Express CORS | Cross-origin requests are controlled |

### Authentication Flow
```
1. User submits credentials (email/password)
2. Server validates credentials against database
3. If valid, server generates JWT token with userId and role
4. Token is returned to client and stored in localStorage
5. Client includes token in Authorization header for protected routes
6. Server middleware validates token on each protected request
```

---

## User Roles & Permissions

| Feature | Customer | Admin |
|---------|:--------:|:-----:|
| View products | ✅ | ✅ |
| Add to cart | ✅ | ✅ |
| Place orders | ✅ | ✅ |
| View own orders | ✅ | ✅ |
| View all orders | ❌ | ✅ |
| Update order status | ❌ | ✅ |
| Add/Edit/Delete products | ❌ | ✅ |
| Access admin dashboard | ❌ | ✅ |

---

## Screenshots

> **Note:** Add screenshots of the following pages:

### 1. Home Page
*Screenshot showing product grid with filters*

### 2. Login Page
*Screenshot showing login form with demo credentials*

### 3. Registration Page
*Screenshot showing registration form*

### 4. Shopping Cart
*Screenshot showing cart with items*

### 5. Checkout Page
*Screenshot showing checkout form with delivery address*

### 6. Order History (Customer)
*Screenshot showing customer's order list*

### 7. Admin Dashboard
*Screenshot showing statistics and order management*

### 8. Admin Products Management
*Screenshot showing product add/edit forms*

---

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@fruitmstore.com | admin123 |
| Customer | customer@test.com | customer123 |

---

## Setup Instructions

### Prerequisites
- Node.js v16+
- MongoDB (Local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Web_CCP
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Configure environment variables**
Create `.env` file in backend folder:
```env
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-secret-key
PORT=5000
```

4. **Seed the database (optional)**
```bash
node seed.js
```

5. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

6. **Run the application**

Backend:
```bash
cd backend
npm start
```

Frontend:
```bash
cd frontend
npm start
```

7. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

---

*Document generated for Fruit mStore v1.0*
*Last updated: December 2024*
