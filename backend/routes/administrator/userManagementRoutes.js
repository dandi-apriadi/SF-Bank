import express from 'express';
import userManagementController from '../../controllers/administrator/userManagementController.js';
import { authenticate, authorize } from '../../middleware/AuthUser.js';

const router = express.Router();

// All routes require authentication and Admin role
router.use(authenticate);
router.use(authorize(['Admin']));

// GET /api/v1/users - Get all users with filters
router.get('/', userManagementController.getAllUsers);

// GET /api/v1/users/stats - Get user statistics
router.get('/stats', userManagementController.getUserStats);

// GET /api/v1/users/search - Search users
router.get('/search', userManagementController.searchUsers);

// GET /api/v1/users/role/:role - Get users by role
router.get('/role/:role', userManagementController.getUsersByRole);

// GET /api/v1/users/:id - Get specific user
router.get('/:id', userManagementController.getUserById);

// POST /api/v1/users - Create new user
router.post('/', userManagementController.createUser);

// PUT /api/v1/users/:id - Update user
router.put('/:id', userManagementController.updateUser);

// PUT /api/v1/users/:id/role - Update user role
router.put('/:id/role', userManagementController.updateUserRole);

// PUT /api/v1/users/:id/status - Change user status
router.put('/:id/status', userManagementController.changeUserStatus);

// PUT /api/v1/users/:id/password - Reset user password
router.put('/:id/password', userManagementController.resetUserPassword);

// DELETE /api/v1/users/:id - Delete user
router.delete('/:id', userManagementController.deleteUser);

export default router;
