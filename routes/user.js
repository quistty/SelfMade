import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Use .js extension for ES modules
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const router = express.Router();

// Middleware to authenticate user using JWT
const authenticate = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded token data to the request object
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// Route: GET /user/
// Description: Get the authenticated user's profile data
router.get('/user', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Exclude password from the result
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error); // Log the error
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Route: PUT /user/
// Description: Update the authenticated user's preferences (e.g., fashion style, body measurements)
router.put('/user', authenticate, async (req, res) => {
  const { fashionStyle, bodyMeasurements } = req.body;

  try {
    // Update the user data in the database
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { 
        preferences: { fashionStyle },
        bodyMeasurements 
      },
      { new: true } // Return the updated user
    ).select('-password'); // Exclude password from the result

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error('Error updating user profile:', err); // Log the error
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router; // Export router using ES modules
