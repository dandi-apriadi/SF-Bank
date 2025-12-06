import { User, Alliance, AuditLog } from '../../models/index.js';
import { Op } from 'sequelize';
import auditLogger from '../../utils/auditLogger.js';

/**
 * Get all users with pagination and filtering
 * GET /api/v1/users
 */
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, status, alliance_id } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (role && role !== 'All') where.role = role;
    if (status && status !== 'All') where.status = status;
    if (alliance_id) where.alliance_id = alliance_id;

    const { count, rows } = await User.findAndCountAll({
      where,
      offset: parseInt(offset),
      limit: parseInt(limit),
      include: [{ model: Alliance, as: 'alliance', attributes: ['id', 'name', 'tag'] }],
      attributes: { exclude: ['password'] },
      order: [['created_at', 'DESC']],
    });

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: count,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message,
    });
  }
};

/**
 * Get specific user by ID
 * GET /api/v1/users/:id
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      include: [{ model: Alliance, as: 'alliance', attributes: ['id', 'name', 'tag', 'leader'] }],
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message,
    });
  }
};

/**
 * Create new user
 * POST /api/v1/users
 */
const createUser = async (req, res) => {
  try {
    const { user_id, name, email, role, alliance_id, password } = req.body;

    // Validation
    if (!user_id || !name || !email || !role) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: user_id, name, email, role',
      });
    }

    // Check if user_id already exists
    const existingUser = await User.findOne({ where: { user_id } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User ID already exists',
      });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: 'Email already in use',
      });
    }

    // Validate role
    const validRoles = ['Admin', 'R1', 'R2', 'R3', 'R4', 'R5'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be: Admin, R1, R2, R3, R4, or R5',
      });
    }

    // Use provided password or default
    const userPassword = password || 'Kingdom3946!';

    // Create user
    const newUser = await User.create({
      user_id,
      name,
      email,
      role,
      alliance_id: alliance_id || null,
      status: 'Active',
      password: userPassword,
    });

    // Log audit (note: don't log the actual password in production)
    await auditLogger.log(req.user.id, 'CREATE', 'user', newUser.id, `New user created: ${name} (Email: ${email}, Role: ${role}, User ID: ${user_id})`, req);

    const userResponse = newUser.toJSON();
    delete userResponse.password;

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: userResponse,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: error.message,
    });
  }
};

/**
 * Update user information
 * PUT /api/v1/users/:id
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, alliance_id, password } = req.body;

    console.log(`[UPDATE USER] ID: ${id}, Data:`, { name, email, role, alliance_id, password: password ? '***' : undefined });

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    console.log(`[UPDATE USER] Found user:`, { id: user.id, name: user.name, email: user.email, role: user.role });

    // Check if new email is already in use
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message: 'Email already in use',
        });
      }
    }

    // Validate role if provided
    if (role) {
      const validRoles = ['Admin', 'R1', 'R2', 'R3', 'R4', 'R5'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid role. Must be: Admin, R1, R2, R3, R4, or R5',
        });
      }
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (alliance_id !== undefined) user.alliance_id = alliance_id;
    if (password) user.password = password; // Will be hashed by beforeUpdate hook

    console.log(`[UPDATE USER] Before save:`, { name: user.name, email: user.email, role: user.role, alliance_id: user.alliance_id });

    await user.save();

    console.log(`[UPDATE USER] After save - User updated successfully`);

    // Log audit
    const auditDetails = `User information updated: Name=${name || user.name}, Email=${email || user.email}, Role=${role || user.role}, Alliance ID=${alliance_id}${password ? ', Password changed' : ''}`;
    await auditLogger.log(req.user.id, 'UPDATE', 'user', id, auditDetails, req);

    const userResponse = user.toJSON();
    delete userResponse.password;

    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: userResponse,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message,
    });
  }
};

/**
 * Update user role
 * PUT /api/v1/users/:id/role
 */
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: 'Role is required',
      });
    }

    const validRoles = ['Admin', 'R1', 'R2', 'R3', 'R4', 'R5'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be: Admin, R1, R2, R3, R4, or R5',
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const oldRole = user.role;
    user.role = role;
    await user.save();

    // Log audit
    await auditLogger.log(req.user.id, 'UPDATE', 'user', id, `User role changed from ${oldRole} to ${role}`, req);

    const userResponse = user.toJSON();
    delete userResponse.password;

    return res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: userResponse,
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update user role',
      error: error.message,
    });
  }
};

/**
 * Change user status (Active/Inactive)
 * PUT /api/v1/users/:id/status
 */
const changeUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['Active', 'Inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: Active or Inactive',
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const oldStatus = user.status;
    user.status = status;
    await user.save();

    // Log audit
    await auditLogger.log(req.user.id, 'UPDATE', 'user', id, `User status changed from ${oldStatus} to ${status}`, req);

    const userResponse = user.toJSON();
    delete userResponse.password;

    return res.status(200).json({
      success: true,
      message: 'User status updated successfully',
      data: userResponse,
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update user status',
      error: error.message,
    });
  }
};

/**
 * Reset user password
 * PUT /api/v1/users/:id/password
 */
const resetUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password is required',
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long',
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.password = newPassword;
    await user.save();

    // Log audit
    await auditLogger.log(req.user.id, 'UPDATE', 'user', id, `User password was reset for user ID: ${id}`, req);

    return res.status(200).json({
      success: true,
      message: 'User password reset successfully',
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to reset password',
      error: error.message,
    });
  }
};

/**
 * Delete user
 * DELETE /api/v1/users/:id
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent users from deleting themselves
    if (user.id === req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete your own account',
      });
    }

    // Optional: Prevent deleting admin accounts (can be removed if admins should be able to delete other admins)
    if (user.role === 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete Admin users. Contact system administrator if needed.',
      });
    }

    const userData = user.toJSON();
    await user.destroy();

    // Log audit
    await auditLogger.log(req.user.id, 'DELETE', 'user', id, `User deleted: ${userData.name} (Email: ${userData.email}, User ID: ${userData.user_id})`, req);

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message,
    });
  }
};

/**
 * Search users by name, email, or user_id
 * GET /api/v1/users/search?query=...
 */
const searchUsers = async (req, res) => {
  try {
    const { query, role, alliance_id, page = 1, limit = 10 } = req.query;

    if (!query || query.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters',
      });
    }

    const offset = (page - 1) * limit;

    const where = {
      [Op.or]: [
        { name: { [Op.iLike]: `%${query}%` } },
        { email: { [Op.iLike]: `%${query}%` } },
        { user_id: { [Op.iLike]: `%${query}%` } },
      ],
    };

    if (role && role !== 'All') where.role = role;
    if (alliance_id) where.alliance_id = alliance_id;

    const { count, rows } = await User.findAndCountAll({
      where,
      offset: parseInt(offset),
      limit: parseInt(limit),
      include: [{ model: Alliance, as: 'alliance', attributes: ['id', 'name', 'tag'] }],
      attributes: { exclude: ['password'] },
      order: [['created_at', 'DESC']],
    });

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: count,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('Error searching users:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to search users',
      error: error.message,
    });
  }
};

/**
 * Get users by specific role
 * GET /api/v1/users/role/:role
 */
const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const validRoles = ['Admin', 'R1', 'R2', 'R3', 'R4', 'R5'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be: Admin, R1, R2, R3, R4, or R5',
      });
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      where: { role },
      offset: parseInt(offset),
      limit: parseInt(limit),
      include: [{ model: Alliance, as: 'alliance', attributes: ['id', 'name', 'tag'] }],
      attributes: { exclude: ['password'] },
      order: [['created_at', 'DESC']],
    });

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: count,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('Error fetching users by role:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users by role',
      error: error.message,
    });
  }
};

/**
 * Get user statistics
 * GET /api/v1/users/stats
 */
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { status: 'Active' } });
    const inactiveUsers = await User.count({ where: { status: 'Inactive' } });

    const roleStats = await User.findAll({
      attributes: [
        'role',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count'],
      ],
      group: ['role'],
      raw: true,
    });

    const stats = {
      totalUsers,
      activeUsers,
      inactiveUsers,
      inactivePercentage: ((inactiveUsers / totalUsers) * 100).toFixed(2),
      byRole: roleStats.reduce((acc, stat) => {
        acc[stat.role] = parseInt(stat.count);
        return acc;
      }, {}),
    };

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user statistics',
      error: error.message,
    });
  }
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserRole,
  changeUserStatus,
  resetUserPassword,
  deleteUser,
  searchUsers,
  getUsersByRole,
  getUserStats,
};
