# 🍎 Fruit mStore - MERN Stack E-Commerce Application

A full-stack grocery store application built with MongoDB, Express.js, React, and Node.js (MERN Stack).

## 📋 Features

### Customer Features
- Browse products with category filtering
- Filter by in-stock items
- Add products to cart
- Checkout with delivery address
- View order history
- User registration and login

### Admin Features
- View all orders with statistics
- Update order status (pending → confirmed → delivered/cancelled)
- Add, edit, and delete products
- Manage product stock status

---

## 🚀 How to Run the Project

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (optional, for cloning)

> **Note:** The project uses a cloud MongoDB Atlas database, so you don't need to install MongoDB locally.

---

### Step 1: Install Backend Dependencies

Open a terminal and navigate to the backend folder:

```bash
cd backend
npm install
```

### Step 2: Install Frontend Dependencies

Open another terminal and navigate to the frontend folder:

```bash
cd frontend
npm install
```

---

### Step 3: Run the Application

You need to run **both** the backend and frontend servers simultaneously.

#### Terminal 1 - Start Backend Server:
```bash
cd backend
npm run dev
```
The backend will start on `http://localhost:5000`

#### Terminal 2 - Start Frontend Server:
```bash
cd frontend
npm start
```
The frontend will start on `http://localhost:3000` and open automatically in your browser.

---

## 🔐 Demo Credentials

Use these credentials to test the application:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@fruitmstore.com | admin123 |
| **Customer** | customer@test.com | customer123 |

Or register a new account to test customer features.

---

## 📁 Project Structure

```
Web_CCP/
├── backend/                 # Express.js API server
│   ├── middleware/
│   │   └── auth.js         # JWT authentication middleware
│   ├── models/
│   │   ├── User.js         # User schema
│   │   ├── Product.js      # Product schema
│   │   └── Order.js        # Order schema
│   ├── routes/
│   │   ├── auth.js         # Login/Register endpoints
│   │   ├── products.js     # Product CRUD endpoints
│   │   └── orders.js       # Order management endpoints
│   ├── .env                # Environment variables
│   ├── package.json
│   └── server.js           # Main server entry point
│
└── frontend/               # React application
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   ├── PrivateRoute.js
    │   │   └── AdminRoute.js
    │   ├── context/
    │   │   ├── AuthContext.js   # Authentication state
    │   │   └── CartContext.js   # Shopping cart state
    │   ├── pages/
    │   │   ├── Home.js          # Product catalog
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Cart.js
    │   │   ├── Checkout.js
    │   │   ├── Orders.js        # Customer order history
    │   │   ├── AdminDashboard.js
    │   │   └── AdminProducts.js
    │   ├── App.js
    │   └── index.js
    └── package.json
```

---

## 🔧 Configuration

### Backend Environment Variables (`.env`)

The backend uses these environment variables (already configured):

```env
PORT=5000
MONGODB_URI=<MongoDB connection string>
JWT_SECRET=<Secret key for JWT tokens>
```

### Frontend Proxy

The frontend is configured to proxy API requests to the backend. This is set in `frontend/package.json`:

```json
"proxy": "http://localhost:5000"
```

---

## 📝 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |

### Products
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/products` | Get all products | Public |
| GET | `/api/products/:id` | Get single product | Public |
| POST | `/api/products` | Add new product | Admin |
| PUT | `/api/products/:id` | Update product | Admin |
| DELETE | `/api/products/:id` | Delete product | Admin |

### Orders
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/orders` | Place new order | User |
| GET | `/api/orders/my-orders` | Get user's orders | User |
| GET | `/api/orders` | Get all orders | Admin |
| GET | `/api/orders/:id` | Get single order | User/Admin |
| PUT | `/api/orders/:id/status` | Update order status | Admin |

---

## ⚠️ Troubleshooting

### "ECONNREFUSED" or "Network Error"
- Make sure the backend server is running on port 5000
- Check if another application is using port 5000

### "Module not found" errors
- Run `npm install` in both `backend` and `frontend` folders

### MongoDB connection issues
- Check your internet connection (the database is hosted on MongoDB Atlas)
- The connection string is pre-configured in `.env`

### Port already in use
```bash
# For Windows - Find and kill process using port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# For Mac/Linux
lsof -i :5000
kill -9 <PID>
```

---

## 📦 Technologies Used

### Backend
- **Express.js** - Web framework
- **MongoDB** + **Mongoose** - Database & ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Frontend
- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management

---

## 📄 License

This project is for educational purposes.

---

## 👨‍💻 Quick Start Commands

```bash
# Clone and setup (if using Git)
git clone <repository-url>
cd Web_CCP

# Install all dependencies
cd backend && npm install
cd ../frontend && npm install

# Run both servers (in separate terminals)
# Terminal 1:
cd backend && npm run dev

# Terminal 2:
cd frontend && npm start
```

**Happy coding! 🚀**
