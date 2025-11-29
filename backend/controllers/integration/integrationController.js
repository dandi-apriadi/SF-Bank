import { IntegrationSource, IntegrationJob, IntegrationJobLog, ReconciliationResult } from '../../models/index.js';
import { createCrudController, asyncHandler } from '../shared/crudFactory.js';
import { v4 as uuidv4 } from 'uuid';

export const integrationSourceController = createCrudController(IntegrationSource, { searchFields:['name','type'] });
export const integrationJobController = createCrudController(IntegrationJob, { searchFields:['job_type','status'] });
export const integrationJobLogController = createCrudController(IntegrationJobLog);
export const reconciliationController = createCrudController(ReconciliationResult);

export const startJob = asyncHandler(async (req,res) => {
  const job = await IntegrationJob.create({ ...req.body, status:'running', started_at: new Date() });
  res.status(201).json(job);
});

export const finishJob = asyncHandler(async (req,res) => {
  const job = await IntegrationJob.findByPk(req.params.id);
  if(!job) return res.status(404).json({ msg:'Not found' });
  await job.update({ status: req.body.status || 'success', finished_at: new Date(), summary: req.body.summary });
  res.json(job);
});

export const appendJobLog = asyncHandler(async (req,res) => {
  const log = await IntegrationJobLog.create({
    job_log_id: uuidv4(),
    job_id: req.body.job_id,
    level: req.body.level || 'info',
    message: req.body.message,
    meta: req.body.meta
  });
  res.status(201).json(log);
});
