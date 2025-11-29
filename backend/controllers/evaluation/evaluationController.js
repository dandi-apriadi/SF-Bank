import { Evaluation, PpeppCycle, PpeppAction, FollowUpItem, StudyProgram, User } from '../../models/index.js';
import { createCrudController, asyncHandler } from '../shared/crudFactory.js';
import { Parser as Json2csvParser } from 'json2csv';

export const evaluationController = createCrudController(Evaluation);
export const ppeppCycleController = createCrudController(PpeppCycle, { searchFields:['cycle_label','status'] });
export const ppeppActionController = {
	...createCrudController(PpeppAction, { searchFields:['phase','status','title'] }),
	list: asyncHandler(async (req, res) => {
		const { Op } = await import('sequelize');
		const limit = Math.min(parseInt(req.query.limit) || 25, 100);
		const offset = parseInt(req.query.offset) || 0;
		const orderParam = (req.query.order || 'created_at:DESC').split(':');
		const [orderField, orderDir] = [orderParam[0], (orderParam[1] || 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC'];
		const where = {};
		if (req.query.status) where.status = req.query.status;
		if (req.query.phase) where.phase = req.query.phase;
		if (req.query.q) {
			where[Op.or] = [
				{ title: { [Op.like]: `%${req.query.q}%` } },
				{ description: { [Op.like]: `%${req.query.q}%` } }
			];
		}
		const data = await PpeppAction.findAndCountAll({
			where,
			limit,
			offset,
			order: [[orderField, orderDir]],
			include: [
				{ model: PpeppCycle, include: [{ model: StudyProgram, attributes:['study_program_id','name'] }] },
				{ model: User, as: 'responsible', attributes: ['user_id','fullname','email'] }
			]
		});
		res.json({ total: data.count, rows: data.rows });
	})
};

export const exportPpeppActionsCsv = asyncHandler(async (req, res) => {
	const where = {};
	const { Op } = await import('sequelize');
	if (req.query.status) where.status = req.query.status;
	if (req.query.phase) where.phase = req.query.phase;
	if (req.query.q) {
		where[Op.or] = [
			{ title: { [Op.like]: `%${req.query.q}%` } },
			{ description: { [Op.like]: `%${req.query.q}%` } }
		];
	}

	const rows = await PpeppAction.findAll({
		where,
		order: [['created_at','DESC']],
		include: [
			{ model: PpeppCycle, include: [{ model: StudyProgram, attributes:['name'] }] },
			{ model: User, as: 'responsible', attributes: ['fullname','email'] }
		]
	});

	const dataset = rows.map(r => ({
		action_id: r.action_id,
		phase: r.phase,
		title: r.title,
		status: r.status,
		progress: r.progress,
		due_date: r.due_date,
		study_program: r.ppepp_cycle && r.ppepp_cycle.study_program ? r.ppepp_cycle.study_program.name : null,
		responsible: r.responsible ? r.responsible.fullname : null,
		responsible_email: r.responsible ? r.responsible.email : null,
		created_at: r.created_at,
		updated_at: r.updated_at
	}));

	const parser = new Json2csvParser({ header: true });
	const csv = parser.parse(dataset);
	res.setHeader('Content-Type', 'text/csv');
	res.setHeader('Content-Disposition', 'attachment; filename="ppepp_actions_export.csv"');
	res.send(csv);
});
export const followUpController = createCrudController(FollowUpItem, { searchFields:['source','status','priority'] });
