import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db/index.js';
import batchRoutes from './routes/batchRoutes.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/', (req, res) => {
  res.send('Blockchain Medicine Tracker API is running!');
});

// Mount Batch APIs
app.use('/api/batches', batchRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
