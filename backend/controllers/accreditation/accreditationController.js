import { 
  AccreditationCycle,
  AccreditationCriteria,
  CycleCriteriaProgress,
  Narrative,
  NarrativeVersion,
  Evidence,
  EvidenceTag,
  EvidenceVersion,
  AccreditationScore,
  ScoreSimulation,
  StudyProgram,
  Faculty,
  User
} from '../../models/index.js';
import { createCrudController, asyncHandler } from '../shared/crudFactory.js';
import { v4 as uuidv4 } from 'uuid';
import { Sequelize } from 'sequelize';
import ExcelJS from 'exceljs';
import { Parser as CsvParser } from 'json2csv';

export const cycleController = createCrudController(AccreditationCycle, { searchFields:['instrument_type','status'] });
export const criteriaController = createCrudController(AccreditationCriteria, { searchFields:['code','title'] });
export const cycleCriteriaProgressController = createCrudController(CycleCriteriaProgress, { filterableFields: ['cycle_id','criteria_id','narrative_status'] });
export const evidenceController = createCrudController(Evidence, {
  searchFields:['file_name','status'],
  filterableFields: ['cycle_id','criteria_id','status'],
  overrides: {
    include: [
      { model: AccreditationCriteria, attributes: ['criteria_id','code','title'] },
      EvidenceTag,
      { model: User, attributes: ['fullname'] }
    ],
    order: [['updated_at','DESC']]
  }
});
export const evidenceTagController = createCrudController(EvidenceTag, { searchFields:['tag'] });
export const evidenceVersionController = createCrudController(EvidenceVersion);
export const scoreController = createCrudController(AccreditationScore);
export const simulationController = createCrudController(ScoreSimulation, { searchFields:['name'] });

// Narrative custom: create & auto versioning
export const narrativeController = {
  // Enable filtering by cycle_id, criteria_id, and status for narrative queries
  list: createCrudController(Narrative, { filterableFields: ['cycle_id','criteria_id','status'] }).list,
  get: createCrudController(Narrative).get,
  create: asyncHandler(async (req, res) => {
    const narrative = await Narrative.create(req.body);
    await NarrativeVersion.create({
      version_id: uuidv4(),
      narrative_id: narrative.narrative_id,
      version_no: narrative.version_no,
      content: narrative.content,
      changed_by: narrative.created_by,
      change_note: 'Initial version'
    });
    res.status(201).json(narrative);
  }),
  update: asyncHandler(async (req, res) => {
    const row = await Narrative.findByPk(req.params.id);
    if (!row) return res.status(404).json({ msg: 'Not found' });
    const nextVersion = row.version_no + 1;
    await NarrativeVersion.create({
      version_id: uuidv4(),
      narrative_id: row.narrative_id,
      version_no: nextVersion,
      content: req.body.content ?? row.content,
      changed_by: req.body.updated_by || row.updated_by,
      change_note: req.body.change_note || 'Auto version'
    });
    await row.update({ ...req.body, version_no: nextVersion });
    res.json(row);
  }),
  delete: createCrudController(Narrative).delete
};

// Accreditation Instruments aggregation (derived from Criteria and Cycles)
export const instrumentsController = {
  list: asyncHandler(async (req, res) => {
    const criteriaAgg = await AccreditationCriteria.findAll({
      attributes: [
        'instrument_type',
        [Sequelize.fn('COUNT', Sequelize.col('*')), 'criteria_count'],
        [Sequelize.fn('MAX', Sequelize.col('updated_at')), 'last_updated']
      ],
      group: ['instrument_type']
    });

    const cycleAgg = await AccreditationCycle.findAll({
      attributes: [
        'instrument_type',
        [Sequelize.fn('COUNT', Sequelize.col('*')), 'usage_count']
      ],
      group: ['instrument_type']
    });

    const usageMap = new Map(
      cycleAgg.map((row) => [row.get('instrument_type'), parseInt(row.get('usage_count'), 10)])
    );

    const results = criteriaAgg.map((row) => {
      const type = row.get('instrument_type');
      const criteriaCount = parseInt(row.get('criteria_count'), 10) || 0;
      const usageCount = usageMap.get(type) || 0;
      const lastUpdated = row.get('last_updated');

      return {
        instrument_type: type,
        name: `Instrumen Akreditasi ${type}`,
        criteria_count: criteriaCount,
        usage_count: usageCount,
        last_updated: lastUpdated
      };
    });

    // Include instrument types that may appear only in cycles (no criteria defined yet)
    for (const row of cycleAgg) {
      const type = row.get('instrument_type');
      if (!results.find((r) => r.instrument_type === type)) {
        results.push({
          instrument_type: type,
          name: `Instrumen Akreditasi ${type}`,
          criteria_count: 0,
          usage_count: parseInt(row.get('usage_count'), 10) || 0,
          last_updated: null
        });
      }
    }

    res.json(results);
  }),

  stats: asyncHandler(async (req, res) => {
    const [criteriaAgg, cycleAgg] = await Promise.all([
      AccreditationCriteria.findAll({
        attributes: [
          'instrument_type',
          [Sequelize.fn('COUNT', Sequelize.col('*')), 'criteria_count']
        ],
        group: ['instrument_type']
      }),
      AccreditationCycle.findAll({
        attributes: [
          'instrument_type',
          [Sequelize.fn('COUNT', Sequelize.col('*')), 'usage_count']
        ],
        group: ['instrument_type']
      })
    ]);

    const types = new Set([
      ...criteriaAgg.map((r) => r.get('instrument_type')),
      ...cycleAgg.map((r) => r.get('instrument_type'))
    ]);

    const totalUsage = cycleAgg.reduce((sum, r) => sum + (parseInt(r.get('usage_count'), 10) || 0), 0);
    const avgCriteria = criteriaAgg.length
      ? criteriaAgg.reduce((sum, r) => sum + (parseInt(r.get('criteria_count'), 10) || 0), 0) / criteriaAgg.length
      : 0;

    res.json({
      total: types.size,
      totalUsage,
      avgCriteria: Number(avgCriteria.toFixed(1))
    });
  }),

  export: asyncHandler(async (req, res) => {
    const { type } = req.params;
    const criteria = await AccreditationCriteria.findAll({
      where: { instrument_type: type },
      order: [[ 'order_no', 'ASC' ]]
    });

    const payload = {
      instrument_type: type,
      criteria: criteria.map(c => ({
        criteria_id: c.criteria_id,
        code: c.code,
        title: c.title,
        weight: c.weight,
        order_no: c.order_no,
        is_active: c.is_active,
        updated_at: c.updated_at
      }))
    };

    res.setHeader('Content-Disposition', `attachment; filename=accreditation-instrument-${type}.json`);
    res.json(payload);
  })
};

// Export full LED JSON for a given accreditation cycle
export const exportLedController = asyncHandler(async (req, res) => {
  const { cycleId } = req.params;
  const cycle = await AccreditationCycle.findByPk(cycleId);
  if (!cycle) return res.status(404).json({ msg: 'Cycle not found' });

  // Fetch criteria progress and narratives for the cycle
  const progress = await CycleCriteriaProgress.findAll({ where: { cycle_id: cycleId } });
  const narratives = await Narrative.findAll({ where: { cycle_id: cycleId } });

  const led = {
    cycle: {
      cycle_id: cycle.cycle_id,
      study_program_id: cycle.study_program_id,
      instrument_type: cycle.instrument_type,
      year: cycle.year,
      status: cycle.status,
      target_grade: cycle.target_grade,
      final_grade: cycle.final_grade,
      final_score: cycle.final_score
    },
    progress: progress.map(p => ({
      ccp_id: p.ccp_id,
      criteria_id: p.criteria_id,
      narrative_status: p.narrative_status,
      evidence_completion: p.evidence_completion,
      gap_score: p.gap_score,
      updated_by: p.updated_by,
      updated_at: p.updated_at,
      created_at: p.created_at
    })),
    narratives: narratives.map(n => ({
      narrative_id: n.narrative_id,
      criteria_id: n.criteria_id,
      version_no: n.version_no,
      content: n.content,
      status: n.status,
      created_by: n.created_by,
      updated_by: n.updated_by,
      updated_at: n.updated_at
    }))
  };

  res.setHeader('Content-Disposition', `attachment; filename=led-${cycleId}.json`);
  res.json(led);
});

// Export LED as Excel (.xlsx)
export const exportLedExcelController = asyncHandler(async (req, res) => {
  const { cycleId } = req.params;

  // Load cycle with Study Program and Faculty for richer header
  const cycle = await AccreditationCycle.findByPk(cycleId, {
    include: [{ model: StudyProgram, include: [Faculty] }]
  });
  if (!cycle) return res.status(404).json({ msg: 'Cycle not found' });

  // Load all relevant domain data
  const [
    criteria,
    progress,
    narratives,
    evidences,
    scores,
    simulations
  ] = await Promise.all([
    AccreditationCriteria.findAll({
      where: { instrument_type: cycle.instrument_type },
      order: [ ['order_no', 'ASC'], ['code', 'ASC'] ]
    }),
    CycleCriteriaProgress.findAll({ where: { cycle_id: cycleId } }),
    Narrative.findAll({
      where: { cycle_id: cycleId },
      include: [
        { model: AccreditationCriteria, attributes: ['criteria_id','code','title'] },
        { model: User, as: 'creator', attributes: ['fullname'] },
        { model: User, as: 'updater', attributes: ['fullname'] }
      ]
    }),
    Evidence.findAll({
      where: { cycle_id: cycleId },
      include: [
        { model: AccreditationCriteria, attributes: ['criteria_id','code','title'] },
        EvidenceTag,
        { model: User, attributes: ['fullname'] }
      ]
    }),
    AccreditationScore.findAll({
      where: { cycle_id: cycleId },
      include: [
        { model: AccreditationCriteria, attributes: ['criteria_id','code','title','weight'] },
        { model: User, attributes: ['fullname'] }
      ]
    }),
    ScoreSimulation.findAll({ where: { cycle_id: cycleId } })
  ]);

  // Build helper maps
  const criteriaMap = new Map(criteria.map(c => [c.criteria_id, c]));
  const progressMap = new Map(progress.map(p => [p.criteria_id, p]));
  const evidenceByCriteria = evidences.reduce((acc, e) => {
    const key = e.criteria_id;
    (acc[key] = acc[key] || []).push(e);
    return acc;
  }, {});
  const scoresByCriteria = scores.reduce((acc, s) => {
    const key = s.criteria_id;
    (acc[key] = acc[key] || []).push(s);
    return acc;
  }, {});

  // Compute high-level stats
  const totalCriteria = criteria.length;
  const withProgress = criteria.filter(c => progressMap.has(c.criteria_id)).length;
  const narrativeCount = narratives.length;
  const evidenceCount = evidences.length;
  const avgEvidenceCompletion = progress.length
    ? (progress.reduce((sum, p) => sum + (Number(p.evidence_completion) || 0), 0) / progress.length)
    : 0;

  const wb = new ExcelJS.Workbook();
  wb.creator = 'PRIMA';
  wb.created = new Date();

  // Shared styling helpers
  const headerFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1D4ED8' } }; // blue-700 tone
  const headerFont = { color: { argb: 'FFFFFFFF' }, bold: true };
  const thinBorder = { style: 'thin', color: { argb: 'FF94A3B8' } }; // slate-ish border
  const tableHeader = (ws) => {
    const row = ws.getRow(1);
    row.eachCell((cell) => {
      cell.fill = headerFill;
      cell.font = headerFont;
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = { top: thinBorder, left: thinBorder, bottom: thinBorder, right: thinBorder };
    });
    // Safely compute autofilter range based on column count
    const colCount = ws.columnCount || 0;
    if (colCount > 0) {
      // ExcelJS supports object form for autoFilter bounds
      ws.autoFilter = {
        from: { row: 1, column: 1 },
        to: { row: 1, column: colCount }
      };
    }
    ws.views = [{ state: 'frozen', ySplit: 1 }];
  };

  // Sheet: Overview (Cover)
  const wsOverview = wb.addWorksheet('Overview');
  wsOverview.mergeCells('A1', 'F1');
  wsOverview.getCell('A1').value = 'Laporan Evaluasi Diri (LED)';
  wsOverview.getCell('A1').font = { bold: true, size: 16 };
  wsOverview.getCell('A1').alignment = { horizontal: 'left' };

  const sp = cycle.study_program || {};
  const faculty = sp.faculty || {};
  const overviewRows = [
    ['Program Studi', `${sp.name || sp.code || cycle.study_program_id} (${sp.code || '-'})`],
    ['Fakultas', faculty.name || faculty.code || '-'],
    ['Instrumen', cycle.instrument_type],
    ['Tahun', cycle.year],
    ['Status', cycle.status],
    ['Target Peringkat', cycle.target_grade || '-'],
    ['Peringkat Akhir', cycle.final_grade || '-'],
    ['Skor Akhir', cycle.final_score != null ? Number(cycle.final_score) : '-'],
    ['Jumlah Kriteria', totalCriteria],
    ['Kriteria dgn Progress', withProgress],
    ['Jumlah Narasi', narrativeCount],
    ['Jumlah Eviden', evidenceCount],
    ['Rata2 Kelengkapan Eviden (%)', Number(avgEvidenceCompletion).toFixed(0)]
  ];
  wsOverview.columns = [ { header: 'Field', key: 'field', width: 32 }, { header: 'Value', key: 'value', width: 60 } ];
  wsOverview.addRows(overviewRows.map(([field, value]) => ({ field, value })));
  tableHeader(wsOverview);

  // Sheet: Overview+ (Aggregated Stats)
  const wsOverview2 = wb.addWorksheet('Overview+');
  wsOverview2.columns = [
    { header: 'Metric', key: 'metric', width: 40 },
    { header: 'Value', key: 'value', width: 30 },
    { header: 'Notes', key: 'notes', width: 60 }
  ];
  const narrativeStatusCounts = narratives.reduce((acc, n) => {
    const s = (n.status || 'empty').toLowerCase();
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});
  const evidenceByStatus = evidences.reduce((acc, e) => {
    const s = (e.status || 'uploaded').toLowerCase();
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});
  const evidenceByType = evidences.reduce((acc, e) => {
    const mt = (e.mime_type || '').split('/')[0] || 'unknown';
    acc[mt] = (acc[mt] || 0) + 1;
    return acc;
  }, {});
  const rowsOverview2 = [
    { metric: 'Total Kriteria', value: totalCriteria, notes: 'Semua kriteria pada instrumen' },
    { metric: 'Kriteria dgn Progress', value: withProgress, notes: 'Memiliki progress terkait eviden/narasi' },
    { metric: 'Jumlah Narasi', value: narrativeCount, notes: 'Total narasi pada siklus ini' },
    { metric: 'Jumlah Eviden', value: evidenceCount, notes: 'Total dokumen eviden pada siklus ini' },
    { metric: 'Rata2 Kelengkapan Eviden (%)', value: Number(avgEvidenceCompletion).toFixed(0), notes: 'Rata-rata dari evidence_completion per kriteria' },
    { metric: 'Narasi Status (draft)', value: narrativeStatusCounts['draft'] || 0, notes: 'Narasi berstatus draft' },
    { metric: 'Narasi Status (review)', value: narrativeStatusCounts['review'] || 0, notes: 'Narasi dalam review' },
    { metric: 'Narasi Status (submitted)', value: narrativeStatusCounts['submitted'] || 0, notes: 'Narasi telah disubmit' },
    { metric: 'Narasi Status (validated)', value: narrativeStatusCounts['validated'] || 0, notes: 'Narasi tervalidasi' },
    { metric: 'Eviden Status (uploaded)', value: evidenceByStatus['uploaded'] || 0, notes: 'Eviden baru diunggah' },
    { metric: 'Eviden Status (validated)', value: evidenceByStatus['validated'] || 0, notes: 'Eviden tervalidasi' },
    { metric: 'Eviden Type (application)', value: evidenceByType['application'] || 0, notes: 'Dokumen aplikasi (pdf/docx, dll.)' },
    { metric: 'Eviden Type (image)', value: evidenceByType['image'] || 0, notes: 'Gambar/foto' },
    { metric: 'Eviden Type (video)', value: evidenceByType['video'] || 0, notes: 'Video' },
    { metric: 'Eviden Type (text)', value: evidenceByType['text'] || 0, notes: 'Plain text' },
    { metric: 'Eviden Type (lainnya)', value: evidenceByType['unknown'] || 0, notes: 'Lainnya/tidak terdeteksi' }
  ];
  wsOverview2.addRows(rowsOverview2);
  tableHeader(wsOverview2);

  // Sheet: Criteria
  const wsCriteria = wb.addWorksheet('Criteria');
  wsCriteria.columns = [
    { header: 'criteria_id', key: 'criteria_id', width: 36 },
    { header: 'code', key: 'code', width: 10 },
    { header: 'title', key: 'title', width: 60 },
    { header: 'weight', key: 'weight', width: 10 },
    { header: 'order_no', key: 'order_no', width: 10 },
    { header: 'is_active', key: 'is_active', width: 10 }
  ];
  wsCriteria.addRows(criteria.map(c => ({
    criteria_id: c.criteria_id,
    code: c.code,
    title: c.title,
    weight: c.weight != null ? Number(c.weight) : null,
    order_no: c.order_no,
    is_active: c.is_active
  })));
  tableHeader(wsCriteria);

  // Sheet: Summary per criteria
  const wsSummary = wb.addWorksheet('Summary');
  wsSummary.columns = [
    { header: 'code', key: 'code', width: 10 },
    { header: 'title', key: 'title', width: 50 },
    { header: 'narrative_status', key: 'narrative_status', width: 16 },
    { header: 'narrative_present', key: 'narrative_present', width: 16 },
    { header: 'narrative_version', key: 'narrative_version', width: 16 },
    { header: 'evidence_count', key: 'evidence_count', width: 16 },
    { header: 'evidence_completion', key: 'evidence_completion', width: 20 },
    { header: 'gap_score', key: 'gap_score', width: 12 },
    { header: 'avg_score', key: 'avg_score', width: 12 },
    { header: 'weighted_avg', key: 'weighted_avg', width: 14 }
  ];
  // Build narrative map per criteria for quick lookup
  const narrativeByCriteria = narratives.reduce((acc, n) => {
    (acc[n.criteria_id] = acc[n.criteria_id] || []).push(n);
    return acc;
  }, {});
  wsSummary.addRows(criteria.map(c => {
    const p = progressMap.get(c.criteria_id);
    const sc = scoresByCriteria[c.criteria_id] || [];
    const avgScore = sc.length ? (sc.reduce((s, r) => s + Number(r.score || 0), 0) / sc.length) : null;
    const weight = c.weight != null ? Number(c.weight) : null;
    const weightedAvg = avgScore != null && weight != null ? Number((avgScore * weight).toFixed(2)) : null;
    const evidCount = (evidenceByCriteria[c.criteria_id] || []).length;
    const narrs = narrativeByCriteria[c.criteria_id] || [];
    const narrPresent = narrs.length > 0;
    const latestNarr = narrs.sort((a,b)=> (b.version_no||0)-(a.version_no||0))[0];
    const narrStatus = latestNarr ? (latestNarr.status || 'empty') : (p ? p.narrative_status : 'empty');
    return {
      code: c.code,
      title: c.title,
      narrative_status: narrStatus,
      narrative_present: narrPresent ? 'yes' : 'no',
      narrative_version: latestNarr ? Number(latestNarr.version_no) : null,
      evidence_count: evidCount,
      evidence_completion: p ? Number(p.evidence_completion) : null,
      gap_score: p && p.gap_score != null ? Number(p.gap_score) : null,
      avg_score: avgScore != null ? Number(avgScore.toFixed(2)) : null,
      weighted_avg: weightedAvg
    };
  }));
  tableHeader(wsSummary);

  // Sheet: Evidence Summary by Tag
  const tagCounts = evidences.reduce((acc, e) => {
    (e.evidence_tags || []).forEach(t => {
      const key = (t.tag || '').trim();
      if (!key) return;
      acc[key] = (acc[key] || 0) + 1;
    });
    return acc;
  }, {});
  const wsTagSummary = wb.addWorksheet('Evidence Tags');
  wsTagSummary.columns = [
    { header: 'tag', key: 'tag', width: 40 },
    { header: 'count', key: 'count', width: 12 }
  ];
  wsTagSummary.addRows(Object.entries(tagCounts).sort((a,b)=> b[1]-a[1]).map(([tag,count])=>({ tag, count })));
  tableHeader(wsTagSummary);

  // Sheet: Evidence Types Summary
  const wsTypeSummary = wb.addWorksheet('Evidence Types');
  wsTypeSummary.columns = [
    { header: 'type', key: 'type', width: 30 },
    { header: 'count', key: 'count', width: 12 }
  ];
  wsTypeSummary.addRows(Object.entries(evidenceByType).map(([type,count])=>({ type, count })));
  tableHeader(wsTypeSummary);

  // Sheet: Progress (enriched)
  const wsProgress = wb.addWorksheet('Progress');
  wsProgress.columns = [
    { header: 'ccp_id', key: 'ccp_id', width: 36 },
    { header: 'criteria_code', key: 'criteria_code', width: 12 },
    { header: 'criteria_title', key: 'criteria_title', width: 50 },
    { header: 'narrative_status', key: 'narrative_status', width: 18 },
    { header: 'evidence_completion', key: 'evidence_completion', width: 22 },
    { header: 'gap_score', key: 'gap_score', width: 12 },
    { header: 'updated_by', key: 'updated_by', width: 20 },
    { header: 'updated_at', key: 'updated_at', width: 22 },
    { header: 'created_at', key: 'created_at', width: 22 }
  ];
  wsProgress.addRows(progress.map(p => {
    const c = criteriaMap.get(p.criteria_id);
    return {
      ccp_id: p.ccp_id,
      criteria_code: c ? c.code : '',
      criteria_title: c ? c.title : '',
      narrative_status: p.narrative_status,
      evidence_completion: Number(p.evidence_completion),
      gap_score: p.gap_score != null ? Number(p.gap_score) : null,
      updated_by: p.updated_by,
      updated_at: p.updated_at ? new Date(p.updated_at).toISOString() : '',
      created_at: p.created_at ? new Date(p.created_at).toISOString() : ''
    };
  }));
  tableHeader(wsProgress);

  // Sheet: Narratives (enriched)
  const wsNarr = wb.addWorksheet('Narratives');
  wsNarr.columns = [
    { header: 'narrative_id', key: 'narrative_id', width: 36 },
    { header: 'criteria_code', key: 'criteria_code', width: 12 },
    { header: 'criteria_title', key: 'criteria_title', width: 50 },
    { header: 'version_no', key: 'version_no', width: 12 },
    { header: 'status', key: 'status', width: 14 },
    { header: 'created_by', key: 'created_by', width: 24 },
    { header: 'updated_by', key: 'updated_by', width: 24 },
    { header: 'updated_at', key: 'updated_at', width: 22 },
    { header: 'content', key: 'content', width: 100 }
  ];
  wsNarr.addRows(narratives.map(n => ({
    narrative_id: n.narrative_id,
    criteria_code: n.accreditation_criteria ? n.accreditation_criteria.code : (criteriaMap.get(n.criteria_id)?.code || ''),
    criteria_title: n.accreditation_criteria ? n.accreditation_criteria.title : (criteriaMap.get(n.criteria_id)?.title || ''),
    version_no: n.version_no,
    status: n.status,
    created_by: n.creator ? n.creator.fullname : n.created_by,
    updated_by: n.updater ? n.updater.fullname : n.updated_by,
    updated_at: n.updated_at ? new Date(n.updated_at).toISOString() : '',
    content: n.content || ''
  })));
  tableHeader(wsNarr);

  // Sheet: Evidences
  const wsEvid = wb.addWorksheet('Evidences');
  wsEvid.columns = [
    { header: 'evidence_id', key: 'evidence_id', width: 36 },
    { header: 'criteria_code', key: 'criteria_code', width: 12 },
    { header: 'criteria_title', key: 'criteria_title', width: 40 },
    { header: 'file_name', key: 'file_name', width: 40 },
    { header: 'mime_type', key: 'mime_type', width: 18 },
    { header: 'file_size_kb', key: 'file_size_kb', width: 14 },
    { header: 'version_no', key: 'version_no', width: 10 },
    { header: 'status', key: 'status', width: 14 },
    { header: 'tags', key: 'tags', width: 30 },
    { header: 'uploaded_by', key: 'uploaded_by', width: 24 },
    { header: 'created_at', key: 'created_at', width: 22 },
    { header: 'updated_at', key: 'updated_at', width: 22 },
    { header: 'file_path', key: 'file_path', width: 60 }
  ];
  wsEvid.addRows(evidences.map(e => ({
    evidence_id: e.evidence_id,
    criteria_code: e.accreditation_criteria ? e.accreditation_criteria.code : (criteriaMap.get(e.criteria_id)?.code || ''),
    criteria_title: e.accreditation_criteria ? e.accreditation_criteria.title : (criteriaMap.get(e.criteria_id)?.title || ''),
    file_name: e.file_name,
    mime_type: e.mime_type,
    file_size_kb: e.file_size != null ? Math.round(Number(e.file_size) / 1024) : null,
    version_no: e.version_no,
    status: e.status,
    tags: (e.evidence_tags || []).map(t => t.tag).join(', '),
    uploaded_by: e.user ? e.user.fullname : e.uploaded_by,
    created_at: e.created_at ? new Date(e.created_at).toISOString() : '',
    updated_at: e.updated_at ? new Date(e.updated_at).toISOString() : '',
    file_path: e.file_path
  })));
  tableHeader(wsEvid);

  // Sheet: Scores
  const wsScores = wb.addWorksheet('Scores');
  wsScores.columns = [
    { header: 'criteria_code', key: 'criteria_code', width: 12 },
    { header: 'criteria_title', key: 'criteria_title', width: 40 },
    { header: 'evaluator', key: 'evaluator', width: 30 },
    { header: 'score', key: 'score', width: 10 },
    { header: 'weight', key: 'weight', width: 10 },
    { header: 'weighted_score', key: 'weighted_score', width: 14 },
    { header: 'note', key: 'note', width: 50 },
    { header: 'updated_at', key: 'updated_at', width: 22 }
  ];
  wsScores.addRows(scores.map(s => ({
    criteria_code: s.accreditation_criteria ? s.accreditation_criteria.code : (criteriaMap.get(s.criteria_id)?.code || ''),
    criteria_title: s.accreditation_criteria ? s.accreditation_criteria.title : (criteriaMap.get(s.criteria_id)?.title || ''),
    evaluator: s.user ? s.user.fullname : s.evaluator_id,
    score: s.score != null ? Number(s.score) : null,
    weight: s.accreditation_criteria && s.accreditation_criteria.weight != null ? Number(s.accreditation_criteria.weight) : null,
    weighted_score: s.weighted_score != null ? Number(s.weighted_score) : (s.score != null && s.accreditation_criteria?.weight != null ? Number((Number(s.score) * Number(s.accreditation_criteria.weight)).toFixed(2)) : null),
    note: s.note || '',
    updated_at: s.updated_at ? new Date(s.updated_at).toISOString() : ''
  })));
  tableHeader(wsScores);

  // Sheet: Simulations
  const wsSim = wb.addWorksheet('Simulations');
  wsSim.columns = [
    { header: 'name', key: 'name', width: 30 },
    { header: 'total_score', key: 'total_score', width: 14 },
    { header: 'projected_grade', key: 'projected_grade', width: 16 },
    { header: 'assumptions', key: 'assumptions', width: 60 },
    { header: 'created_at', key: 'created_at', width: 22 },
    { header: 'updated_at', key: 'updated_at', width: 22 }
  ];
  wsSim.addRows(simulations.map(sim => ({
    name: sim.name,
    total_score: sim.total_score != null ? Number(sim.total_score) : null,
    projected_grade: sim.projected_grade || '',
    assumptions: sim.assumptions ? JSON.stringify(sim.assumptions) : '',
    created_at: sim.created_at ? new Date(sim.created_at).toISOString() : '',
    updated_at: sim.updated_at ? new Date(sim.updated_at).toISOString() : ''
  })));
  tableHeader(wsSim);

  // Sheet: Cycle (raw key-values for auditors)
  const wsCycle = wb.addWorksheet('Cycle');
  wsCycle.columns = [ { header: 'Field', key: 'field', width: 30 }, { header: 'Value', key: 'value', width: 60 } ];
  const cycleRows = [
    ['cycle_id', cycle.cycle_id],
    ['study_program_id', cycle.study_program_id],
    ['instrument_type', cycle.instrument_type],
    ['year', cycle.year],
    ['status', cycle.status],
    ['target_grade', cycle.target_grade],
    ['final_grade', cycle.final_grade],
    ['final_score', cycle.final_score],
    ['submitted_at', cycle.submitted_at ? new Date(cycle.submitted_at).toISOString() : ''],
    ['visited_at', cycle.visited_at ? new Date(cycle.visited_at).toISOString() : ''],
    ['completed_at', cycle.completed_at ? new Date(cycle.completed_at).toISOString() : '']
  ];
  wsCycle.addRows(cycleRows.map(([field, value]) => ({ field, value })));
  tableHeader(wsCycle);

  // Sheet: Readme (Notes for reviewers)
  const wsReadme = wb.addWorksheet('Readme');
  wsReadme.columns = [
    { header: 'Section', key: 'section', width: 28 },
    { header: 'Description', key: 'description', width: 100 }
  ];
  wsReadme.addRows([
    { section: 'Overview', description: 'Ringkasan profil siklus akreditasi dan statistik kunci (jumlah kriteria, narasi, eviden).' },
    { section: 'Overview+', description: 'Agregasi tambahan: distribusi status narasi, status eviden, dan jenis eviden.' },
    { section: 'Criteria', description: 'Daftar kriteria pada instrumen akreditasi beserta bobot dan urutan.' },
    { section: 'Summary', description: 'Ringkasan per kriteria: status narasi, jumlah eviden, kelengkapan eviden, skor rata-rata, dan skor berbobot.' },
    { section: 'Evidence Tags', description: 'Rekap jumlah eviden berdasarkan tag untuk identifikasi area dan tema dokumen.' },
    { section: 'Evidence Types', description: 'Rekap jumlah eviden berdasarkan jenis file (application, image, video, text, lainnya).' },
    { section: 'Progress', description: 'Detail progress per kriteria (status narasi, kelengkapan eviden, gap score) beserta timestamp.' },
    { section: 'Narratives', description: 'Detail narasi per kriteria, versi, status, penulis dan konten (ringkas).' },
    { section: 'Evidences', description: 'Daftar eviden lengkap: nama file, tipe, ukuran, tag, pengunggah, dan path file.' },
    { section: 'Scores', description: 'Penilaian per kriteria beserta evaluator, bobot, skor, dan catatan.' },
    { section: 'Simulations', description: 'Simulasi perhitungan skor total dan proyeksi peringkat dengan asumsi-asumsi.' },
    { section: 'Cycle', description: 'Data mentah siklus untuk audit: id, tipe, tahun, status dan timestamp penting.' },
    { section: 'Format', description: 'Kolom angka ditampilkan sebagai nilai numerik; tanggal dalam format ISO8601. Gunakan filter pada baris header.' },
    { section: 'Generated By', description: `PRIMA Export • Tanggal: ${new Date().toISOString()} • User: ${req.session?.fullname || 'unknown'}` }
  ]);
  tableHeader(wsReadme);

  // Compose filename with SP code and year for professionalism
  const spCode = sp.code || 'SP';
  const filename = `led-${cycle.instrument_type}-${spCode}-${cycle.year}.xlsx`;

  const buffer = await wb.xlsx.writeBuffer();
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.send(Buffer.from(buffer));
});

// Export LED Summary as CSV (per-criteria summary)
export const exportLedCsvController = asyncHandler(async (req, res) => {
  const { cycleId } = req.params;
  const cycle = await AccreditationCycle.findByPk(cycleId);
  if (!cycle) return res.status(404).json({ msg: 'Cycle not found' });

  const [criteria, progress, narratives, evidences, scores] = await Promise.all([
    AccreditationCriteria.findAll({ where: { instrument_type: cycle.instrument_type }, order: [['order_no','ASC'], ['code','ASC']] }),
    CycleCriteriaProgress.findAll({ where: { cycle_id: cycleId } }),
    Narrative.findAll({ where: { cycle_id: cycleId } }),
    Evidence.findAll({ where: { cycle_id: cycleId } }),
    AccreditationScore.findAll({ where: { cycle_id: cycleId } })
  ]);

  const progressMap = new Map(progress.map(p => [p.criteria_id, p]));
  const evidenceByCriteria = evidences.reduce((acc, e) => { (acc[e.criteria_id] = acc[e.criteria_id] || []).push(e); return acc; }, {});
  const scoresByCriteria = scores.reduce((acc, s) => { (acc[s.criteria_id] = acc[s.criteria_id] || []).push(s); return acc; }, {});
  const narrativeByCriteria = narratives.reduce((acc, n) => { (acc[n.criteria_id] = acc[n.criteria_id] || []).push(n); return acc; }, {});

  const rows = criteria.map(c => {
    const p = progressMap.get(c.criteria_id);
    const sc = scoresByCriteria[c.criteria_id] || [];
    const avgScore = sc.length ? (sc.reduce((s, r) => s + Number(r.score || 0), 0) / sc.length) : null;
    const weight = c.weight != null ? Number(c.weight) : null;
    const weightedAvg = avgScore != null && weight != null ? Number((avgScore * weight).toFixed(2)) : null;
    const evidCount = (evidenceByCriteria[c.criteria_id] || []).length;
    const narrs = narrativeByCriteria[c.criteria_id] || [];
    const narrPresent = narrs.length > 0;
    const latestNarr = narrs.sort((a,b)=> (b.version_no||0)-(a.version_no||0))[0];

    return {
      code: c.code,
      title: c.title,
      narrative_status: latestNarr ? (latestNarr.status || 'empty') : (p ? p.narrative_status : 'empty'),
      narrative_present: narrPresent ? 'yes' : 'no',
      narrative_version: latestNarr ? Number(latestNarr.version_no) : '',
      evidence_count: evidCount,
      evidence_completion: p ? Number(p.evidence_completion) : '',
      gap_score: p && p.gap_score != null ? Number(p.gap_score) : '',
      avg_score: avgScore != null ? Number(avgScore.toFixed(2)) : '',
      weight: weight != null ? weight : '',
      weighted_avg: weightedAvg != null ? weightedAvg : ''
    };
  });

  const parser = new CsvParser({ fields: ['code','title','narrative_status','narrative_present','narrative_version','evidence_count','evidence_completion','gap_score','avg_score','weight','weighted_avg'] });
  const csv = parser.parse(rows);
  res.setHeader('Content-Type','text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="led-${cycle.instrument_type}-${cycle.year}.csv"`);
  res.send(csv);
});

// Upload Evidence file and create Evidence record
export const uploadEvidence = asyncHandler(async (req, res) => {
  // Multer provides req.file
  if (!req.file) return res.status(400).json({ msg: 'File tidak ditemukan' });
  const { cycle_id, criteria_id } = req.body || {};
  if (!cycle_id || !criteria_id) return res.status(400).json({ msg: 'cycle_id dan criteria_id wajib diisi' });

  // Validate referenced cycle and criteria exist to avoid FK errors
  const cycle = await AccreditationCycle.findByPk(cycle_id);
  if (!cycle) return res.status(400).json({ msg: 'cycle_id tidak valid' });
  const criteria = await AccreditationCriteria.findByPk(criteria_id);
  if (!criteria) return res.status(400).json({ msg: 'criteria_id tidak valid' });

  const uploadedBy = req.session?.user_id || req.user_id || 'system';
  // Normalize file path to use forward slashes on all platforms
  const normalizedPath = String(req.file.path || '').replace(/\\/g, '/');

  try {
    const evidence = await Evidence.create({
      cycle_id,
      criteria_id,
      uploaded_by: uploadedBy,
      file_name: req.file.originalname,
      file_path: normalizedPath,
      mime_type: req.file.mimetype,
      file_size: req.file.size,
      version_no: 1,
      status: 'uploaded'
    });
    res.status(201).json(evidence);
  } catch (err) {
    // Handle foreign key / constraint errors explicitly
    if (err && err.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ msg: 'Referensi siklus atau kriteria tidak valid' });
    }
    throw err;
  }
});
