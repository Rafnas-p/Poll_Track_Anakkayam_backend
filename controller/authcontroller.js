// controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../model/Admin.js'; // Adjust path to your Admin model
import { validationResult } from 'express-validator'; // For input validation

// Register a new admin
export const registerAdmin = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new admin
    const admin = new Admin({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
    });
    console.log("hai");
    

    await admin.save();
console.log(admin,'admin');

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error('Error in registerAdmin:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login admin
export const loginAdmin = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
console.log(req.body,'req.body');

    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate access token
    const accessToken = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' } // Short-lived access token
    );

    // // Generate refresh token
    // const
    //  refreshToken = jwt.sign(
    //   { id: admin._id, role: admin.role },
    //   process.env.REFRESH_TOKEN_SECRET,
    //   { expiresIn: '7d' } // Long-lived refresh token
    // );

    // Store refresh token in database
    // admin.refreshToken = refreshToken;
    await admin.save();

    // Send tokens to client
    res.status(200).json({
      message: 'Login successful',
      accessToken,
    //   refreshToken,
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (error) {
    console.error('Error in loginAdmin:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Refresh token
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    // Verify refresh token
    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }

    // Check if refresh token exists in database
    const admin = await Admin.findById(payload.id);
    if (!admin || admin.refreshToken !== refreshToken) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Optionally generate a new refresh token
    const newRefreshToken = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    // Update refresh token in database
    admin.refreshToken = newRefreshToken;
    await admin.save();

    res.status(200).json({
      message: 'Token refreshed successfully',
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error('Error in refreshToken:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Logout admin (invalidate refresh token)
export const logoutAdmin = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token required' });
    }

    // Find admin by refresh token and clear it
    const admin = await Admin.findOne({ refreshToken });
    if (admin) {
      admin.refreshToken = null;
      await admin.save();
    }

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error in logoutAdmin:', error);
    res.status(500).json({ message: 'Server error' });
  }
};