import dotenv from 'dotenv';
dotenv.config();

import db from '../config/Database.js';
import '../models/index.js';
import {
  StudyProgram,
  AccreditationCycle,
  AccreditationCriteria,
  CycleCriteriaProgress,
  Evidence,
  Narrative
} from '../models/index.js';

import { v4 as uuidv4 } from 'uuid';

const BANPT_CRITERIA = [
  { code: 'K1', title: 'Visi, Misi, Tujuan dan Strategi', weight: 10, order_no: 1 },
  { code: 'K2', title: 'Tata Pamong, Tata Kelola, dan Kerjasama', weight: 10, order_no: 2 },
  { code: 'K3', title: 'Mahasiswa', weight: 10, order_no: 3 },
  { code: 'K4', title: 'Sumber Daya Manusia', weight: 10, order_no: 4 },
  { code: 'K5', title: 'Keuangan, Sarana dan Prasarana', weight: 10, order_no: 5 },
  { code: 'K6', title: 'Pendidikan', weight: 15, order_no: 6 },
  { code: 'K7', title: 'Penelitian', weight: 15, order_no: 7 },
  { code: 'K8', title: 'Pengabdian kepada Masyarakat', weight: 10, order_no: 8 },
  { code: 'K9', title: 'Luaran dan Capaian Tridharma', weight: 10, order_no: 9 }
];

async function ensureStudyProgram() {
  // Ensure at least one faculty/study program exists; minimal stub if needed
  let sp = await StudyProgram.findOne();
  if (!sp) {
    sp = await StudyProgram.create({
      study_program_id: uuidv4(),
      faculty_id: uuidv4(), // if no faculties table populated, this is fine without FK
      name: 'Program Studi Sistem Informasi',
      code: 'SI-001',
      jenjang: 'S1',
      is_active: true
    });
  }
  return sp;
}

async function ensureCriteria() {
  // Insert BAN-PT criteria set if fewer than 9 exist for BAN-PT
  const count = await AccreditationCriteria.count({ where: { instrument_type: 'BAN-PT' } });
  if (count < 9) {
    const existingCodes = new Set(
      (await AccreditationCriteria.findAll({ where: { instrument_type: 'BAN-PT' }, attributes: ['code'] }))
        .map(r => r.code)
    );
    const toCreate = BANPT_CRITERIA
      .filter(c => !existingCodes.has(c.code))
      .map(c => ({ ...c, instrument_type: 'BAN-PT', is_active: true }));
    if (toCreate.length) await AccreditationCriteria.bulkCreate(toCreate);
  }
  return AccreditationCriteria.findAll({ where: { instrument_type: 'BAN-PT' }, order: [['order_no','ASC']] });
}

async function ensureCycle(study_program_id) {
  // Find latest active/draft cycle for BAN-PT; otherwise create one for this year
  let cycle = await AccreditationCycle.findOne({
    where: { study_program_id },
    order: [['updated_at','DESC']]
  });
  if (!cycle) {
    cycle = await AccreditationCycle.create({
      study_program_id,
      instrument_type: 'BAN-PT',
      year: new Date().getFullYear(),
      status: 'in_progress',
      target_grade: 'Unggul'
    });
  }
  return cycle;
}

async function ensureProgress(cycle_id, criteriaRows, userIdHint) {
  for (const c of criteriaRows) {
    const exists = await CycleCriteriaProgress.findOne({ where: { cycle_id, criteria_id: c.criteria_id } });
    if (!exists) {
      await CycleCriteriaProgress.create({
        cycle_id,
        criteria_id: c.criteria_id,
        narrative_status: 'empty',
        evidence_completion: 0,
        gap_score: null,
        updated_by: userIdHint || 'system'
      });
    }
  }
}

async function ensureSampleEvidence(cycle_id, criteriaRows, userIdHint) {
  // Add 1-2 sample evidences for first criterion to unblock UI listing
  const first = criteriaRows[0];
  if (!first) return;
  const count = await Evidence.count({ where: { cycle_id, criteria_id: first.criteria_id } });
  if (count === 0) {
    await Evidence.bulkCreate([
      {
        cycle_id,
        criteria_id: first.criteria_id,
        uploaded_by: userIdHint || 'system',
        file_name: 'pedoman-akreditasi.pdf',
        file_path: '/uploads/docs/pedoman-akreditasi.pdf',
        mime_type: 'application/pdf',
        file_size: 1024 * 300,
        status: 'uploaded'
      },
      {
        cycle_id,
        criteria_id: first.criteria_id,
        uploaded_by: userIdHint || 'system',
        file_name: 'struktur-organisasi.png',
        file_path: '/uploads/images/struktur-organisasi.png',
        mime_type: 'image/png',
        file_size: 1024 * 120,
        status: 'uploaded'
      }
    ]);
  }
}

async function run() {
  try {
    console.log('Seeding accreditation baseline...');
    await db.authenticate();

    const sp = await ensureStudyProgram();
    const criteriaRows = await ensureCriteria();
    const cycle = await ensureCycle(sp.study_program_id);

    await ensureProgress(cycle.cycle_id, criteriaRows, null);
    await ensureSampleEvidence(cycle.cycle_id, criteriaRows, null);

    console.log('Done. Summary:');
    console.log(`- Study Program: ${sp.name} (${sp.study_program_id})`);
    console.log(`- Criteria (BAN-PT): ${criteriaRows.length}`);
    console.log(`- Cycle: ${cycle.cycle_id} year ${cycle.year} status ${cycle.status}`);
    const progressCount = await CycleCriteriaProgress.count({ where: { cycle_id: cycle.cycle_id } });
    console.log(`- Progress rows: ${progressCount}`);
    const evCount = await Evidence.count({ where: { cycle_id: cycle.cycle_id } });
    console.log(`- Evidences in cycle: ${evCount}`);

    process.exit(0);
  } catch (e) {
    console.error('Seed accreditation failed:', e);
    process.exit(1);
  }
}

run();
