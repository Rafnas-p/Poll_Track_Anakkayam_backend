// backend/server.js
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/authRoutes.js'
import panchayatRoutes from './routes/panjayathRoutes.js'
import wardRoutes from './routes/wardRoutes.js'
import boothRoutes from './routes/boothRoutes.js'
import voterRoutes from './routes/voterRoutes.js'

// Load environment variables
dotenv.config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

// Configure CORS to allow requests from your Vite frontend
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use("/api/panchayats", panchayatRoutes);
app.use("/api/booths", boothRoutes);
app.use("/api/wards", wardRoutes);
app.use("/api/voters", voterRoutes)

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

// Monitor MongoDB connection
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err);
});

app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from the Node.js backend!' });
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});