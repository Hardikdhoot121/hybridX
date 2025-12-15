# 🚀 HybridX Backend

HybridX is a **role-based JEE-style online examination backend** built using **Node.js, Express, MongoDB, and JWT authentication**.  
This backend powers user authentication, protected APIs, role management, and exam-related services.

---

## 🧠 Project Overview

HybridX aims to simulate a real-world **JEE Online Test Platform**, enabling:
- Secure user authentication
- Role-based access (Student / Admin)
- Protected APIs using JWT
- Scalable backend architecture

This repository contains **only the backend** of the HybridX platform.

---

## 🏗️ Tech Stack

- **Node.js** – Runtime environment
- **Express.js** – Backend framework
- **MongoDB Atlas** – Cloud database
- **Mongoose** – ODM for MongoDB
- **JWT (JSON Web Tokens)** – Authentication
- **bcrypt** – Password hashing
- **dotenv** – Environment variables
- **nodemon** – Development auto-reload

---

## 📁 Backend Project Structure

The following image shows the current backend folder structure of HybridX:

<img width="294" height="805" alt="backend_struct" src="https://github.com/user-attachments/assets/e64faf8f-7160-406e-8d6c-fe5065256a6c" />


---

## 🔐 Authentication Flow (JWT-based)

1. **User Signup**
   - Password is hashed using `bcrypt`
   - User is stored in MongoDB

2. **User Login**
   - Credentials verified
   - JWT token generated and returned

3. **Protected Routes**
   - JWT sent in `Authorization` header
   - Middleware verifies token
   - User data attached to `req.user`

---

## 🛡️ Role-Based Access Control

HybridX supports multiple roles:
- **student** – Default role
- **admin** – For managing questions & tests (future scope)

Roles are embedded inside JWT payload and validated in middleware.

---

## 🌐 API Endpoints

### 🔓 Public Routes

| Method | Endpoint | Description |
|------|---------|------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login & receive JWT |
| GET  | `/api/health` | Server health check |

---

### 🔐 Protected Routes

| Method | Endpoint | Description |
|------|---------|------------|
| GET | `/api/protected/profile` | Get logged-in user info |

> Requires `Authorization: Bearer <JWT_TOKEN>`

---

## ⚙️ Environment Variables

Create a `.env` file inside `backend/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
