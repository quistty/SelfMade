import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js'; // Add .js extension for local imports
import userRoutes from './routes/user.js'; // Add .js extension for local imports
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Use the authentication and user profile routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/virtualstylist')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Export the app for testing purposes
export default app;

// Start the server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server running on port ${port}`));
}
