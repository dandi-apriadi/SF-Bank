import { Op } from 'sequelize';

// Generic error-safe async wrapper
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Build basic filtering from query params
const buildQueryOptions = (req, extra = {}) => {
  const { limit = 25, offset = 0, order = 'created_at:DESC', q } = req.query;
  let [orderField, orderDir] = order.split(':');
  const where = {};
  if (q && extra.searchFields) {
    where[Op.or] = extra.searchFields.map(f => ({ [f]: { [Op.like]: `%${q}%` } }));
  }
  // Exact-match filters for whitelisted fields
  if (Array.isArray(extra.filterableFields) && extra.filterableFields.length) {
    for (const key of extra.filterableFields) {
      if (req.query[key] !== undefined && req.query[key] !== '') {
        where[key] = req.query[key];
      }
    }
  }
  return {
    where,
    limit: Math.min(parseInt(limit), 100),
    offset: parseInt(offset),
    order: [[orderField, orderDir && orderDir.toUpperCase() === 'ASC' ? 'ASC' : 'DESC']],
    ...extra.overrides
  };
};

export const createCrudController = (model, { idField, searchFields = [], filterableFields = [], overrides } = {}) => {
  const pk = idField || Object.keys(model.primaryKeys)[0];
  return {
    list: asyncHandler(async (req, res) => {
      const options = buildQueryOptions(req, { searchFields, filterableFields, overrides });
      const data = await model.findAndCountAll(options);
      res.json({ total: data.count, rows: data.rows });
    }),
    get: asyncHandler(async (req, res) => {
      const id = req.params.id;
      let row = await model.findByPk(id);
      if (!row && pk) {
        // debug: log primary key info to help diagnose lookup issues
        try {
          console.info(`Lookup miss for model=${model.name} id=${id} pkVar=${pk} primaryKeys=${JSON.stringify(Object.keys(model.primaryKeys || {}))} primaryKeyAttributes=${JSON.stringify(model.primaryKeyAttributes || [])}`);
        } catch (err) {
          // ignore logging errors
        }
        // fallback: try finding by primary key column name
        try {
          row = await model.findOne({ where: { [pk]: id } });
        } catch (err) {
          console.error('Fallback findOne failed for', model.name, pk, id, err.message);
        }
      }
      if (!row) {
        try {
          console.warn(`Resource not found: ${model.name} id=${id} pkVar=${pk} primaryKeys=${JSON.stringify(Object.keys(model.primaryKeys || {}))} primaryKeyAttributes=${JSON.stringify(model.primaryKeyAttributes || [])}`);
        } catch (err) {}
        return res.status(404).json({ msg: 'Not found' });
      }
      res.json(row);
    }),
    create: asyncHandler(async (req, res) => {
      const created = await model.create(req.body);
      res.status(201).json(created);
    }),
    update: asyncHandler(async (req, res) => {
      const id = req.params.id;
      let row = await model.findByPk(id);
      if (!row && pk) {
        try {
          console.info(`Update lookup miss for model=${model.name} id=${id} pkVar=${pk} primaryKeys=${JSON.stringify(Object.keys(model.primaryKeys || {}))} primaryKeyAttributes=${JSON.stringify(model.primaryKeyAttributes || [])}`);
        } catch (err) {}
        try {
          row = await model.findOne({ where: { [pk]: id } });
        } catch (err) {
          console.error('Fallback findOne failed for', model.name, pk, id, err.message);
        }
      }
      if (!row) {
        try {
          console.warn(`Resource not found for update: ${model.name} id=${id} pkVar=${pk} primaryKeys=${JSON.stringify(Object.keys(model.primaryKeys || {}))} primaryKeyAttributes=${JSON.stringify(model.primaryKeyAttributes || [])}`);
        } catch (err) {}
        return res.status(404).json({ msg: 'Not found' });
      }
      // (debug logging removed) Incoming payload will no longer be logged here.
      await row.update(req.body);
      res.json(row);
    }),
    delete: asyncHandler(async (req, res) => {
      const id = req.params.id;
      let row = await model.findByPk(id);
      if (!row && pk) {
        try {
          console.info(`Delete lookup miss for model=${model.name} id=${id} pkVar=${pk} primaryKeys=${JSON.stringify(Object.keys(model.primaryKeys || {}))} primaryKeyAttributes=${JSON.stringify(model.primaryKeyAttributes || [])}`);
        } catch (err) {}
        try {
          row = await model.findOne({ where: { [pk]: id } });
        } catch (err) {
          console.error('Fallback findOne failed for', model.name, pk, id, err.message);
        }
      }
      if (!row) {
        try {
          console.warn(`Resource not found for delete: ${model.name} id=${id} pkVar=${pk} primaryKeys=${JSON.stringify(Object.keys(model.primaryKeys || {}))} primaryKeyAttributes=${JSON.stringify(model.primaryKeyAttributes || [])}`);
        } catch (err) {}
        return res.status(404).json({ msg: 'Not found' });
      }
      await row.destroy();
      res.json({ msg: 'Deleted' });
    })
  };
};
