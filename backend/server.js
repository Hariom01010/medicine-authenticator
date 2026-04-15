import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db/index.js';
import batchRoutes from './routes/batchRoutes.js';
import authRoutes from './routes/authRoutes.js';
import organizationRoutes from './routes/organizationRoutes.js';
import dns from "node:dns/promises";

dotenv.config();
dns.setServers(["8.8.8.8"]);

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Hardened CORS for Production
const allowedOrigins = [
  'http://localhost:5173', // Vite local
  process.env.FRONTEND_URL  // Production Vercel URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Basic health check route
app.get('/', (req, res) => {
  res.json({ 
    status: 'online', 
    service: 'MediChain Ledger API',
    database: 'Connected' 
  });
});

// Mount APIs
app.use('/api/batches', batchRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/organizations', organizationRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
