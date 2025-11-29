import { DocumentTemplate, Document, DocumentVersion, StudyProgram, User } from '../../models/index.js';
import { createCrudController, asyncHandler } from '../shared/crudFactory.js';
import { Parser as Json2csvParser } from 'json2csv';
import { v4 as uuidv4 } from 'uuid';

export const templateController = createCrudController(DocumentTemplate, { searchFields:['name','type'] });

export const documentController = {
  list: asyncHandler(async (req, res) => {
    // Include related entities for richer UI (program, owner, template)
    const limit = Math.min(parseInt(req.query.limit) || 25, 100);
    const offset = parseInt(req.query.offset) || 0;
    const orderParam = (req.query.order || 'created_at:DESC').split(':');
    const [orderField, orderDir] = [orderParam[0], (orderParam[1] || 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC'];
    const where = {};
    // Basic status filter
    if (req.query.status) where.status = req.query.status;
    // Basic search on title/description
    if (req.query.q) {
      const { Op } = await import('sequelize');
      where[Op.or] = [
        { title: { [Op.like]: `%${req.query.q}%` } },
        { description: { [Op.like]: `%${req.query.q}%` } }
      ];
    }
    const data = await Document.findAndCountAll({
      where,
      limit,
      offset,
      order: [[orderField, orderDir]],
      include: [
        { model: DocumentTemplate, as: 'template', attributes: ['template_id','type','name'], required: false },
        { model: StudyProgram, as: 'study_program', attributes: ['study_program_id','name'], required: false },
        { model: User, as: 'owner', attributes: ['user_id','fullname','email'], required: false }
      ]
    });
    res.json({ total: data.count, rows: data.rows });
  }),
  get: createCrudController(Document).get,
  create: asyncHandler(async (req,res) => {
    const doc = await Document.create(req.body);
    await DocumentVersion.create({
      document_version_id: uuidv4(),
      document_id: doc.document_id,
      version_no: doc.version_no,
      file_path: doc.file_path,
      content: doc.content,
      changed_by: req.body.owner_user_id,
      change_note: 'Initial version'
    });
    res.status(201).json(doc);
  }),
  update: asyncHandler(async (req,res) => {
    const row = await Document.findByPk(req.params.id);
    if (!row) return res.status(404).json({ msg:'Not found' });
    const nextVersion = row.version_no + 1;
    await DocumentVersion.create({
      document_version_id: uuidv4(),
      document_id: row.document_id,
      version_no: nextVersion,
      file_path: req.body.file_path ?? row.file_path,
      content: req.body.content ?? row.content,
      changed_by: req.body.changed_by || row.owner_user_id,
      change_note: req.body.change_note || 'Auto version'
    });
    await row.update({ ...req.body, version_no: nextVersion });
    res.json(row);
  }),
  delete: createCrudController(Document).delete
};

export const documentVersionController = createCrudController(DocumentVersion);

// Export documents as CSV
export const exportCsv = asyncHandler(async (req, res) => {
  const where = {};
  if (req.query.status) where.status = req.query.status;
  if (req.query.q) {
    const { Op } = await import('sequelize');
    where[Op.or] = [
      { title: { [Op.like]: `%${req.query.q}%` } },
      { description: { [Op.like]: `%${req.query.q}%` } }
    ];
  }

  const rows = await Document.findAll({
    where,
    order: [['created_at','DESC']],
    include: [
      { model: DocumentTemplate, as: 'template', attributes: ['type','name'], required: false },
      { model: StudyProgram, as: 'study_program', attributes: ['name'], required: false },
      { model: User, as: 'owner', attributes: ['fullname','email'], required: false }
    ]
  });

  const dataset = rows.map(r => ({
    document_id: r.document_id,
    title: r.title,
    status: r.status,
    version_no: r.version_no,
    template_type: r.template ? r.template.type : null,
    template_name: r.template ? r.template.name : null,
    study_program: r.study_program ? r.study_program.name : null,
    owner: r.owner ? r.owner.fullname : null,
    owner_email: r.owner ? r.owner.email : null,
    file_path: r.file_path,
    created_at: r.created_at,
    updated_at: r.updated_at
  }));

  const parser = new Json2csvParser({ header: true });
  const csv = parser.parse(dataset);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="documents_export.csv"');
  res.send(csv);
});
