import { Op } from 'sequelize';
import { AuditLog, User } from '../../models/index.js';
import { Parser as Json2csvParser } from 'json2csv';

// Build search filters
const buildFilters = (query) => {
  const {
    search = '',
    action,
    targetType,
    userId,
    dateFrom,
    dateTo,
  } = query;

  const where = {};

  if (action) where.action = action;
  if (targetType) where.target_type = targetType;
  if (userId) where.user_id = userId;

  if (dateFrom || dateTo) {
    where.timestamp = {};
    if (dateFrom) where.timestamp[Op.gte] = new Date(dateFrom);
    if (dateTo) {
      const end = new Date(dateTo);
      end.setHours(23, 59, 59, 999);
      where.timestamp[Op.lte] = end;
    }
  }

  if (search && search.trim()) {
    const like = { [Op.like]: `%${search.trim()}%` };
    where[Op.or] = [
      { details: like },
      { target_type: like },
      { '$user.name$': like },
      { '$user.email$': like },
    ];
  }

  return where;
};

export const getAllLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) > 0 ? parseInt(req.query.page, 10) : 1;
    const limit = parseInt(req.query.limit, 10) > 0 ? parseInt(req.query.limit, 10) : 200;
    const offset = (page - 1) * limit;

    const where = buildFilters(req.query);

    const { rows, count } = await AuditLog.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'role'],
        },
      ],
      order: [['timestamp', 'DESC']],
      limit,
      offset,
    });

    const logs = rows.map((log) => ({
      id: log.id,
      user_id: log.user_id,
      user_name: log.user?.name || 'Unknown',
      user_email: log.user?.email || '',
      user_role: log.user?.role || '',
      action: log.action,
      target_type: log.target_type,
      target_id: log.target_id,
      details: log.details,
      ip_address: log.ip_address,
      user_agent: log.user_agent,
      timestamp: log.timestamp,
      created_at: log.created_at,
      updated_at: log.updated_at,
    }));

    res.status(200).json({
      logs,
      total: count,
      page,
      totalPages: Math.ceil(count / limit) || 1,
      limit,
    });
  } catch (error) {
    console.error('Get all audit logs error:', error);
    res.status(500).json({ msg: 'Failed to fetch audit logs', error: error.message });
  }
};

export const getStatistics = async (req, res) => {
  try {
    const [total, creates, updates, deletes] = await Promise.all([
      AuditLog.count(),
      AuditLog.count({ where: { action: 'CREATE' } }),
      AuditLog.count({ where: { action: 'UPDATE' } }),
      AuditLog.count({ where: { action: 'DELETE' } }),
    ]);

    res.status(200).json({ total, creates, updates, deletes });
  } catch (error) {
    console.error('Get audit log statistics error:', error);
    res.status(500).json({ msg: 'Failed to fetch statistics', error: error.message });
  }
};

export const getLogDetail = async (req, res) => {
  try {
    const { logId } = req.params;
    const log = await AuditLog.findByPk(logId, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'role'] },
      ],
    });

    if (!log) {
      return res.status(404).json({ msg: 'Audit log not found' });
    }

    res.status(200).json(log);
  } catch (error) {
    console.error('Get audit log detail error:', error);
    res.status(500).json({ msg: 'Failed to fetch audit log detail', error: error.message });
  }
};

export const getLogsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const logs = await AuditLog.findAll({
      where: { user_id: userId },
      order: [['timestamp', 'DESC']],
    });
    res.status(200).json(logs);
  } catch (error) {
    console.error('Get logs by user error:', error);
    res.status(500).json({ msg: 'Failed to fetch logs by user', error: error.message });
  }
};

export const getLogsByTarget = async (req, res) => {
  try {
    const { targetType, targetId } = req.params;
    const logs = await AuditLog.findAll({
      where: { target_type: targetType, target_id: targetId },
      order: [['timestamp', 'DESC']],
    });
    res.status(200).json(logs);
  } catch (error) {
    console.error('Get logs by target error:', error);
    res.status(500).json({ msg: 'Failed to fetch logs by target', error: error.message });
  }
};

export const createLog = async (req, res) => {
  try {
    const {
      user_id,
      action,
      target_type,
      target_id,
      details = '',
      ip_address,
      user_agent,
    } = req.body;

    if (!action || !target_type || !target_id) {
      return res.status(400).json({ msg: 'action, target_type, and target_id are required' });
    }

    const auditLog = await AuditLog.create({
      user_id: user_id || req.user?.id || null,
      action,
      target_type,
      target_id,
      details,
      ip_address: ip_address || req.ip || req.connection?.remoteAddress || '0.0.0.0',
      user_agent: user_agent || req.get('user-agent') || 'Unknown',
      timestamp: new Date(),
    });

    res.status(201).json({ msg: 'Audit log created', data: auditLog });
  } catch (error) {
    console.error('Create audit log error:', error);
    res.status(500).json({ msg: 'Failed to create audit log', error: error.message });
  }
};

export const exportLogs = async (req, res) => {
  try {
    const where = buildFilters(req.query);
    const logs = await AuditLog.findAll({
      where,
      include: [{ model: User, as: 'user', attributes: ['name', 'email'] }],
      order: [['timestamp', 'DESC']],
    });

    const parser = new Json2csvParser({
      fields: ['id', 'action', 'target_type', 'target_id', 'details', 'user_id', 'user.name', 'user.email', 'ip_address', 'timestamp'],
      unwind: ['user'],
      defaultValue: '',
    });
    const csv = parser.parse(logs.map((log) => log.toJSON()));

    res.header('Content-Type', 'text/csv');
    res.attachment(`audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
    return res.send(csv);
  } catch (error) {
    console.error('Export audit logs error:', error);
    res.status(500).json({ msg: 'Failed to export audit logs', error: error.message });
  }
};

export const deleteOldLogs = async (req, res) => {
  try {
    const { days = 90 } = req.body;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - parseInt(days, 10));

    const deleted = await AuditLog.destroy({
      where: {
        timestamp: { [Op.lt]: cutoff },
      },
    });

    res.status(200).json({ msg: 'Old logs deleted', deleted });
  } catch (error) {
    console.error('Delete old audit logs error:', error);
    res.status(500).json({ msg: 'Failed to delete old logs', error: error.message });
  }
};
