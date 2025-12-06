// backend/routes/audit/auditLogRoutes.js
import express from 'express';
import {
  getAllLogs,
  getStatistics,
  getLogDetail,
  getLogsByUser,
  getLogsByTarget,
  createLog,
  exportLogs,
  deleteOldLogs,
} from '../../controllers/audit/auditLogController.js';
import { authenticate, authorize } from '../../middleware/AuthUser.js';

const router = express.Router();

// Middleware untuk cek admin role
const checkAdminRole = authorize(['Admin', 'R5']);

// GET - Get all audit logs dengan filter
router.get('/', authenticate, checkAdminRole, getAllLogs);

// GET - Get statistics
router.get('/statistics', authenticate, checkAdminRole, getStatistics);

// GET - Get audit log detail
router.get('/:logId', authenticate, checkAdminRole, getLogDetail);

// GET - Get logs by user
router.get('/user/:userId', authenticate, checkAdminRole, getLogsByUser);

// GET - Get logs by target (alliance, user, bank, resource)
router.get('/target/:targetType/:targetId', authenticate, checkAdminRole, getLogsByTarget);

// POST - Create audit log (internal use)
router.post('/', authenticate, createLog);

// GET - Export logs to CSV
router.get('/export/csv', authenticate, checkAdminRole, exportLogs);

// POST - Delete old logs
router.post('/delete-old', authenticate, checkAdminRole, deleteOldLogs);

export default router;
