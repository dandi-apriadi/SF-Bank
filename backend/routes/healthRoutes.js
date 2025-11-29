import express from 'express';
import healthController from '../controllers/shared/healthController.js';

const router = express.Router();

// Lightweight health check (no auth) - intended for dev/diagnostics
router.get('/api/health', healthController.status);

export default router;
