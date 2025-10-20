import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './database';
import customersRouter from './routes/customers';
import teaRecordsRouter from './routes/tea-records';

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize database
initializeDatabase();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/customers', customersRouter);
app.use('/api/tea-records', teaRecordsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Tea Tracking System API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
