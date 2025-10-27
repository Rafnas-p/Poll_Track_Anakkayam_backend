// routes/authRoutes.js
import express from 'express';
import { body } from 'express-validator';
import { registerAdmin, loginAdmin, refreshToken, logoutAdmin } from '../controller/authcontroller.js';

const router = express.Router();

// Register route
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  registerAdmin
);

// Login route
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  loginAdmin
);

// Refresh token route
router.post('/refresh-token', refreshToken);

// Logout route
router.post('/logout', logoutAdmin);

export default router;