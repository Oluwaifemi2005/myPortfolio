import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Generate a signed JWT token
 * @param {Object} user - User document
 * @returns {string} Signed JWT
 */
function signToken(user) {
  return jwt.sign(
    {
      id: user.id || user._id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );
}

/**
 * @desc   Authenticate admin user and issue JWT token
 * @route  POST /api/auth/login
 * @access Public (admin credentials required)
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'BadRequest',
        message: 'Please provide both email and password'
      });
    }

    // Look up user by lowercase email
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'InvalidCredentials',
        message: 'Invalid email or password'
      });
    }

    // Verify password match
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'InvalidCredentials',
        message: 'Invalid email or password'
      });
    }

    // Issue signed JWT token
    const token = signToken(user);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc   Get current authenticated admin user
 * @route  GET /api/auth/me
 * @access Private (Admin only)
 */
export async function getMe(req, res, next) {
  try {
    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
}
