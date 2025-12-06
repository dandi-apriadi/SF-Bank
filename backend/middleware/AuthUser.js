import { User } from '../models/index.js';

/**
 * Authentication middleware
 * Verifies if user is logged in and attaches user info to request
 * Session uses user.id as primary key (INT)
 */
const authenticate = async (req, res, next) => {
  try {
    // Check if user is logged in via session
    if (!req.session.user || !req.session.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Please login to your account',
      });
    }

    // Fetch user from database to verify still exists and get current data
    const user = await User.findByPk(req.session.user.id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      // User deleted, clear session
      req.session.destroy();
      return res.status(401).json({
        success: false,
        message: 'User account not found',
      });
    }

    // Check if user is active
    if (user.status === 'Inactive') {
      return res.status(403).json({
        success: false,
        message: 'Your account is inactive',
      });
    }

    // Attach user to request for use in route handlers
    req.user = user;

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication',
      error: error.message,
    });
  }
};

/**
 * Authorization middleware
 * Checks if user has required roles
 * Usage: authorize(['Admin', 'R1', 'R2'])
 */
const authorize = (requiredRoles = []) => {
  return (req, res, next) => {
    try {
      // authenticate middleware should have run first
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authenticated',
        });
      }

      // Check if user role is in required roles
      if (requiredRoles.length > 0 && !requiredRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required roles: ${requiredRoles.join(', ')}`,
        });
      }

      next();
    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error during authorization',
        error: error.message,
      });
    }
  };
};

/**
 * Admin-only middleware
 * Shorthand for authorize(['Admin'])
 */
const adminOnly = authorize(['Admin']);

/**
 * Optional authentication middleware
 * Doesn't fail if user not logged in, just attaches user if available
 */
const optionalAuth = async (req, res, next) => {
  try {
    if (req.session.user && req.session.user.id) {
      const user = await User.findByPk(req.session.user.id, {
        attributes: { exclude: ['password'] },
      });
      if (user) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    console.error('Optional auth error:', error);
    next(); // Continue even if error
  }
};

export {
  authenticate,
  authorize,
  adminOnly,
  optionalAuth,
};
