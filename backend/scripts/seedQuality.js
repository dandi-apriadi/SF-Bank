import dotenv from 'dotenv';
dotenv.config();
import db from '../config/Database.js';
import '../models/index.js';
import { Kpi, QualityRisk, QualityRecommendation } from '../models/index.js';

const seed = async () => {
  try {
    await db.authenticate();
    console.log('DB connected');

    const kpiCount = await Kpi.count();
    if (kpiCount === 0) {
      await Kpi.bulkCreate([
        {
          code: 'KPI-ACC-001', label: 'Program Terakreditasi A/B', category: 'Akreditasi', description: 'Persentase program studi akreditasi A atau B', responsible: 'Tim Akreditasi',
          current_value: 22, current_total: 28, current_percentage: 78.6,
          previous_value: 20, previous_total: 28, previous_percentage: 71.4,
          target_value: 26, target_total: 28, target_percentage: 92.9,
          trend: 'up', status: 'good'
        },
        {
          code: 'KPI-DOC-002', label: 'Dokumen Mutu Valid', category: 'Dokumentasi', description: 'Dokumen standar operasional tervalidasi', responsible: 'PPMPP',
          current_value: 412, current_total: 520, current_percentage: 79.2,
          previous_value: 380, previous_total: 520, previous_percentage: 73.1,
          target_value: 468, target_total: 520, target_percentage: 90.0,
          trend: 'up', status: 'good'
        }
      ]);
      console.log('Seeded KPIs');
    }

    const riskCount = await QualityRisk.count();
    if (riskCount === 0) {
      await QualityRisk.bulkCreate([
        { code: 'RSK-001', category: 'Penelitian', issue: 'Output penelitian belum mencapai target', description: 'Publikasi dan paten rendah', severity: 'high', probability: 'high', impact: 'high', risk_score: 9, owner: 'LPPM', status: 'active', mitigation: 'Pelatihan & hibah', timeline: '3 bulan', progress: 65 },
        { code: 'RSK-002', category: 'Alumni', issue: 'Response tracer study rendah', description: 'Response rate < 70%', severity: 'high', probability: 'medium', impact: 'high', risk_score: 6, owner: 'Career Center', status: 'in-progress', mitigation: 'Platform digital & engagement', timeline: '6 bulan', progress: 40 }
      ]);
      console.log('Seeded Risks');
    }

    const recCount = await QualityRecommendation.count();
    if (recCount === 0) {
      await QualityRecommendation.bulkCreate([
        { category: 'Penelitian', priority: 'high', title: 'Penguatan Ekosistem Penelitian Kolaboratif', description: 'Jejaring lintas prodi & institusi', actions: ['Cluster unggulan','Visiting researcher','Hibah kolaborasi'], timeline: '6 bulan', budget: 'Rp 500.000.000', expected_impact: 'Publikasi naik 40%' },
        { category: 'Pembelajaran', priority: 'medium', title: 'Standarisasi dan Digitalisasi RPS', description: 'Template & workflow digital', actions: ['Template standar','Workflow approval','Integrasi SI Akademik'], timeline: '3 bulan', budget: 'Rp 200.000.000', expected_impact: 'Efisiensi 60%' }
      ]);
      console.log('Seeded Recommendations');
    }

    console.log('✅ Quality seed complete');
    process.exit(0);
  } catch (e) {
    console.error('Seed failed', e);
    process.exit(1);
  }
};

seed();