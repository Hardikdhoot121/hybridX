# HybridX - Advanced Education Platform

HybridX is a comprehensive educational platform designed to bridge the gap between traditional learning and modern technology. It provides a robust interface for students to access study materials, track their progress, and for administrators to manage attendance and student performance.

## 🚀 Features

### Student Portal
- **Dashboard**: A personalized dashboard displaying daily goals, attendance stats, and test performance.
- **Study Materials**: Access to NCERT+ resources, notes, and JEE Main/Advanced practice questions.
- **Practice & Assessment**: 
  - **DPP (Daily Practice Problems)**: Daily assignments with result tracking.
  - **Mock Tests**: Full-length tests for JEE Mains and Advanced.
  - **PYQ (Previous Year Questions)**: Extensive archive of past questions.
- **Analytics**: Detailed performance analysis with graphical representation.

### Admin Portal
- **Dashboard**: Overview of student statistics and system status.
- **Attendance Management**: Tools to mark and track student attendance (manual or QR based).
- **Student Management**: View and edit student details, including performance history.
- **Content Management**: Upload and manage study resources (PDFs, Videos).

## 🛠️ Technology Stack

### Frontend
- **React.js**: Core library for building the user interface.
- **Vite**: Fast build tool and development server.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Framer Motion**: For smooth animations and transitions.
- **React Router DOM**: For client-side routing.
- **Recharts**: For data visualization and analytics charts.
- **PDF.js / React-PDF**: For rendering PDF documents directly in the browser.

### Backend
- **Node.js & Express**: Server-side runtime and framework.
- **MongoDB & Mongoose**: NoSQL database for flexible data storage.
- **JWT (JSON Web Token)**: Secure authentication and authorization.
- **Bcrypt**: Password hashing for security.
- **Cors**: Cross-Origin Resource Sharing configuration.

## 📂 Project Structure

```bash
HybridX/
├── backend/                 # Backend server code
│   ├── config/              # Database configuration (db.js)
│   ├── controllers/         # Request handlers (auth, attendance, analytics)
│   ├── models/              # Mongoose schemas (User, Student, etc.)
│   ├── routes/              # API routes definition
│   └── server.js            # Entry point for backend
├── src/                     # Frontend source code
│   ├── admin/               # Admin-specific components and pages
│   ├── assets/              # Static assets (images, icons)
│   ├── components/          # Reusable UI components
│   ├── data/                # Static data (sampleData.js)
│   ├── pages/               # Main application pages (Home, Login, Dashboard)
│   ├── protectingRoute/     # Route protection logic
│   ├── App.jsx              # Main application component & Routing
│   └── main.jsx             # Entry point for React
├── public/                  # Public assets
└── README.md                # Project documentation
```

## 🚦 Routing & Navigation

The application uses `react-router-dom` for handling navigation. Routes are split into three main categories:

### 1. Public Routes
Accessible to everyone without login.
- `/` - **Home**: Landing page of the website.
- `/login` - **Login**: User authentication page.
- `/signup` - **Signup**: User registration page.
- `/contact_us` - **Contact Us**: Support and inquiry page.
- `/pyq` - **PYQ**: Previous Year Questions preview.

### 2. Student Protected Routes
Requires valid student authentication.
- `/dashboard` - **Student Dashboard**: Main hub for students.
- `/jeemains` - **JEE Mains Section**: Subject-wise practice.
- `/jeemains/:subject/:chapter` - **Chapter Questions**.
- `/ncert+` - **NCERT+**: Advanced NCERT resources.
- `/notes` - **Notes**: Study notes section.
- `/dpp` - **DPP**: Daily Practice Problems.
- `/attendance-calendar` - **Attendance**: detailed view.

### 3. Admin Protected Routes
Requires admin privileges.
- `/admin` - **Admin Dashboard**: Administrator overview.
- `/admin/attendance` - **Attendance Manager**: Mark/View attendance.
- `/admin/student/:_id` - **Student Details**: Detailed view of a specific student.

## ⚙️ Installation & Setup

Follow these steps to get the project running locally.

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (Local or Atlas URL)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/hybridx.git
cd hybridx
```

### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
The frontend will run on `http://localhost:5173`.

### 3. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file
# Add: PORT=5000, MONGO_URI=your_mongo_url, JWT_SECRET=your_secret

# Start server
npm run dev # or node server.js
```
The backend will run on `http://localhost:5000`.

## 🔐 Environment Variables

Create a `.env` file in the `backend` directory with the following:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/hybridx
JWT_SECRET=your_super_secret_key_123
```

## 🤝 Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
