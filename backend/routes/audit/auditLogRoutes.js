// backend/routes/audit/auditLogRoutes.js
const express = require("express");
const router = express.Router();
const AuditLogController = require("../../controllers/audit/auditLogController");
const AuthUser = require("../../middleware/AuthUser");

// Middleware untuk cek admin role
const checkAdminRole = (req, res, next) => {
  if (!req.user || !["Admin", "R5"].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized: Admin access required",
    });
  }
  next();
};

// GET - Get all audit logs dengan filter
router.get("/", AuthUser, checkAdminRole, AuditLogController.getAllLogs);

// GET - Get statistics
router.get("/statistics", AuthUser, checkAdminRole, AuditLogController.getStatistics);

// GET - Get audit log detail
router.get("/:logId", AuthUser, checkAdminRole, AuditLogController.getLogDetail);

// GET - Get logs by user
router.get("/user/:userId", AuthUser, checkAdminRole, AuditLogController.getLogsByUser);

// GET - Get logs by target (alliance, user, bank, resource)
router.get("/target/:targetType/:targetId", AuthUser, checkAdminRole, AuditLogController.getLogsByTarget);

// POST - Create audit log (internal use)
router.post("/", AuthUser, AuditLogController.createLog);

// GET - Export logs to CSV
router.get("/export/csv", AuthUser, checkAdminRole, AuditLogController.exportLogs);

// POST - Delete old logs
router.post("/delete-old", AuthUser, checkAdminRole, AuditLogController.deleteOldLogs);

module.exports = router;
