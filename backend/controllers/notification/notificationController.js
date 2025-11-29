import { Notification, ActivityLog } from '../../models/index.js';
import { createCrudController, asyncHandler } from '../shared/crudFactory.js';
import { v4 as uuidv4 } from 'uuid';

export const notificationController = {
  ...createCrudController(Notification),
  markRead: asyncHandler(async (req,res) => {
    const row = await Notification.findByPk(req.params.id);
    if(!row) return res.status(404).json({ msg:'Not found' });
    await row.update({ is_read:true, read_at: new Date() });
    res.json(row);
  })
};

export const activityLogController = createCrudController(ActivityLog, { searchFields:['action','entity_type'] });

export const logActivity = async ({ user_id, action, entity_type, entity_id, details, ip_address }) => {
  try {
    await ActivityLog.create({
      log_id: uuidv4(),
      user_id, action, entity_type, entity_id, details, ip_address
    });
  } catch(e) { console.error('Activity log failed', e.message); }
};
