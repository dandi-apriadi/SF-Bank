import express from 'express';
import contactController from '../../controllers/shared/contactController.js';

const router = express.Router();

// Public contact form endpoint
router.post('/api/contact', contactController.create);

export default router;
