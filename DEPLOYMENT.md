# Deploy HybridX Backend to Render

## Prerequisites
- Render account (free tier available)
- GitHub repository with the backend code

## Steps to Deploy

### 1. Push Code to GitHub
```bash
git add .
git commit -m "Add attendance system with Render deployment config"
git push origin main
```

### 2. Deploy to Render

#### Option A: Using Render Dashboard
1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the `backend` folder as root directory
5. Configure:
   - **Name**: hybridx-backend
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free

#### Option B: Using render.yaml (Recommended)
1. The `render.yaml` file is already configured
2. Connect your GitHub repository to Render
3. Render will automatically detect and use the configuration

### 3. Database Setup
The `render.yaml` includes a free MongoDB database that will be automatically created.

### 4. Environment Variables
Render will automatically set:
- `NODE_ENV=production`
- `PORT=10000`
- `JWT_SECRET` (auto-generated)
- `MONGODB_URI` (from database)

### 5. Update Frontend
The frontend is already configured to use the production URL:
- `.env.production` contains: `VITE_API_BASE_URL=https://hybridx-backend.onrender.com/api`

### 6. Deploy Frontend
Deploy your frontend to Vercel/Netlify with the production environment variables.

## API Endpoints (After Deployment)
- Backend URL: `https://hybridx-backend.onrender.com`
- Health Check: `https://hybridx-backend.onrender.com/ping`
- API Base: `https://hybridx-backend.onrender.com/api`

## Attendance API Endpoints
- `POST /api/attendance/save` - Save attendance (admin only)
- `GET /api/attendance?date&classLevel` - Get class attendance
- `GET /api/attendance/student?studentId&classLevel` - Get student attendance
- `GET /api/attendance/stats?date&classLevel` - Get attendance statistics

## Testing
1. After deployment, test the health endpoint: `https://hybridx-backend.onrender.com/ping`
2. Test attendance endpoints with proper authentication
3. Verify frontend connects to the deployed backend

## Notes
- Free tier has limited resources (750 hours/month)
- Database has 1GB storage limit
- Backend may take 30-60 seconds to cold start
- All attendance data is permanently stored in MongoDB
