import { asyncHandler } from '../shared/crudFactory.js';

/**
 * Lightweight contact controller for public contact form submissions.
 * This implementation intentionally keeps behavior simple: validate input,
 * log payload to server logs, and respond with a standardized JSON payload.
 * You can extend this later to persist messages or forward them via email.
 */
export const contactController = {
  create: asyncHandler(async (req, res) => {
    const { name, email, company, phone, subject, message, budget, timeline } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ msg: 'Missing required fields: name, email, message' });
    }

    // Minimal validation
    const payload = { name, email, company, phone, subject, message, budget, timeline, received_at: new Date() };

    // Log the message for operators (can be replaced with DB persistence or email)
    console.log('[Contact] New contact submission:', JSON.stringify(payload));

    // Optionally, you could create a Notification or ActivityLog here.

    return res.json({ msg: 'Message received successfully. Our team will contact you.', data: { received: true } });
  })
};

export default contactController;
