# 🚀 HybridX – Full Stack MERN EdTech Platform

HybridX is a production-ready MERN stack educational platform built to help students prepare for competitive exams like JEE Mains through structured practice, analytics tracking, attendance management, and role-based dashboards.

This project demonstrates full-stack architecture, secure authentication, production deployment, CORS handling, and real-world debugging.

---

# 🌐 Live Demo

Frontend:  
👉 https://hybrideducationhub.in  

Backend API:  
👉 https://hybridx-uhj9.onrender.com/api  

---

# 📌 Features

## 🔐 Authentication & Authorization
- JWT-based authentication  
- Secure password hashing using bcrypt  
- Role-based access control (Admin / Student)  
- Protected routes  
- Token-based session management  

## 📊 Student Dashboard
- Weekly goal tracking  
- Performance analytics  
- Practice progress monitoring  
- Attendance tracking  
- LocalStorage-based state persistence  

## 📚 Practice System
- Chapter-wise filtering  
- MCQ and numerical question types  
- Real-time attempt recording  
- Analytics updates on submission  
- Clean question navigation UI  

## 🛠 Admin Panel
- Student management  
- Role-based access middleware  
- Attendance overview  
- Analytics monitoring  

## 📈 Analytics Engine
- Weekly stats tracking  
- Practice attempt logging  
- Goal-based performance visualization  
- Dashboard refresh event handling  

---

# 🛠 Tech Stack

## Frontend
- React (Vite)  
- React Router DOM  
- Tailwind CSS  
- React Toastify  
- Fetch API  
- Environment-based configuration  

## Backend
- Node.js  
- Express.js  
- MongoDB Atlas  
- Mongoose  
- JWT Authentication  
- Bcrypt  
- CORS Middleware  

## Deployment
- Frontend: Vercel  
- Backend: Render  
- Database: MongoDB Atlas  
- Media Hosting: Cloudinary  
- Custom Domain: hybrideducationhub.in  

---

# 🏗 Architecture

HybridX follows a clean MVC-based backend architecture.

## Backend Structure

```
backend/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── analyticsController.js
│   └── attendanceController.js
│
├── middlewares/
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   └── isAdmin.js
│
├── models/
│   ├── User.js
│   ├── Attendance.js
│   ├── PracticeAttempt.js
│   └── WeeklyGoal.js
│
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── adminRoutes.js
│   ├── analyticsRoutes.js
│   ├── practiceRoutes.js
│   └── attendanceRoutes.js
│
└── server.js
```

### Design Principles Used
- Separation of concerns  
- Modular routing  
- Middleware-based authorization  
- Environment-specific configuration  
- Centralized error handling  
- Secure token generation  

---

# 🔁 API Endpoints

All routes are prefixed with:

```
/api
```

### Example Routes

```
POST   /api/auth/signup  
POST   /api/auth/login  
GET    /api/users/profile  
GET    /api/analytics/weekly  
POST   /api/practice/attempt  
GET    /api/attendance  
```

---

# ⚙️ Local Development Setup

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/Hardikdhoot121/hybridX.git
cd hybridX
```

---

## 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend`:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
```

Run backend:

```bash
npm run dev
```

Backend runs at:

```
http://localhost:5000
```

---

## 3️⃣ Frontend Setup

```bash
cd ..
npm install
```

Create `.env.development` in root:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

Run frontend:

```bash
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

# 🌍 Production Configuration

## Frontend (.env.production)

```
VITE_API_BASE_URL=https://hybridx-uhj9.onrender.com/api
```

## Backend CORS Setup

```javascript
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://hybrideducationhub.in"
  ],
  credentials: true
}));
```

---

# 📸 Screenshots

Create a folder named `screenshots` and add images:

```
screenshots/
├── login.png
├── dashboard.png
├── practice.png
├── admin.png
└── analytics.png
```

Then add:

```markdown
## Login Page
![Login](./screenshots/login.png)

## Dashboard
![Dashboard](./screenshots/dashboard.png)

## Practice Interface
![Practice](./screenshots/practice.png)

## Admin Panel
![Admin](./screenshots/admin.png)

## Analytics Section
![Analytics](./screenshots/analytics.png)
```

---

# 🚧 Problems Faced & Solutions

## 1️⃣ CORS Policy Error
**Issue:** Frontend was blocked while calling backend API.  
**Solution:** Configured proper CORS in `server.js` allowing both localhost and production domain.

---

## 2️⃣ 500 Internal Server Error During Login
**Issue:** Unexpected JSON parsing error.  
**Cause:** `JWT_SECRET` missing in `.env`.  
**Solution:** Added proper environment variables.

---

## 3️⃣ Production vs Local API Conflict
**Issue:** Backend working in production but not locally.  
**Solution:** Implemented environment-based configuration using:
- `.env.development`
- `.env.production`

---

## 4️⃣ Cloudinary 401 Image Error
**Issue:** Images failed to load with 401 error.  
**Solution:** Corrected public asset URLs and verified Cloudinary access settings.

---

## 5️⃣ Git Non-Fast-Forward Push Error
**Issue:** Push rejected due to remote branch being ahead.  
**Solution:**

```bash
git pull
git push
```

---

# 🔐 Environment Variables

## Backend
- PORT  
- MONGO_URI  
- JWT_SECRET  
- NODE_ENV  

## Frontend
- VITE_API_BASE_URL  

---

# 📈 Future Improvements
- Payment gateway integration  
- AI-based performance recommendations  
- Real-time WebSocket analytics  
- Leaderboard system  
- Progressive Web App (PWA)  
- Mobile application version  

---

# 🧠 What This Project Demonstrates
- Full-stack MERN development  
- Production deployment experience  
- Authentication & authorization  
- CORS handling  
- Environment configuration management  
- Real-world debugging  
- Secure REST API design  
- Clean scalable architecture  

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

Hardik Dhoot  
Full Stack MERN Developer  
