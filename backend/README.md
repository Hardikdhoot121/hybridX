# HybridX Backend

Backend API for HybridX application deployed on Render.

## Environment Variables

The following environment variables need to be set in Render:

- `NODE_ENV`: Set to `production`
- `PORT`: Set to `10000` (Render's default)
- `MONGO_URI`: Your MongoDB connection string
- `JWT_SECRET`: Your JWT secret key

## API Endpoints

- `GET /` - Root endpoint
- `GET /ping` - Health check endpoint
- `GET /api/*` - Main API routes
- `GET /api/admin/*` - Admin routes

## Deployment

This backend is configured to deploy on Render using the `render.yaml` configuration file.

## Local Development

1. Install dependencies: `npm install`
2. Set up environment variables in `.env`
3. Start development server: `npm run dev`
