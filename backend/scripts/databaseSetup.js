import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import { User } from '../models/userModel.js';
// Import semua model terpusat (akan memuat asosiasi)
import '../models/index.js';
import { Kpi, QualityRisk, QualityRecommendation } from '../models/index.js';

// Helper untuk mendapatkan/akses model dari Sequelize instance
const allModels = () => db.models;

// Control verbosity for setup logs
const VERBOSE = (process.env.VERBOSE_DB_SETUP || '').toLowerCase() === 'true';
const log = (...args) => { if (VERBOSE) console.log(...args); };

// Urutan pembuatan tabel agar FK tidak gagal
const TABLE_CREATION_ORDER = [
    // Organization / Auth basic
    'faculties', 'departments', 'study_programs', 'users', 'user_program_roles',
    // Auth extras
    'sessions', 'password_resets',
    // Accreditation master & cycles
    'accreditation_criteria', 'accreditation_cycles', 'cycle_criteria_progress',
    'narratives', 'narrative_versions',
    'evidences', 'evidence_tags', 'evidence_versions',
    'accreditation_scores', 'score_simulations',
    // Documents
    'document_templates', 'documents', 'document_versions',
    // Evaluation / PPEPP / Follow up
    'evaluations', 'ppepp_cycles', 'ppepp_actions', 'follow_up_items',
    // Analytics & Quality
    'heatmaps', 'quality_kpis', 'quality_risks', 'quality_recommendations',
    // Notifications & activity
    'notifications', 'activity_logs',
    // News
    'news_posts', 'news_attachments',
    // Integration
    'integration_sources', 'integration_jobs', 'integration_job_logs', 'reconciliation_results'
];

/**
 * Membuat tabel yang belum ada berdasarkan daftar model.
 * Tidak mengubah struktur tabel yang sudah ada (tidak pakai alter). 
 */
const ensureAllTables = async () => {
    log('🧱 Memeriksa & membuat tabel yang belum ada...');
    const qi = db.getQueryInterface();
    const existing = await qi.showAllTables();

    // Normalisasi nama (MySQL bisa case-insensitive)
    const existingSet = new Set(existing.map(t => t.toLowerCase()));

    const models = allModels();
    let createdCount = 0;

    for (const tableName of TABLE_CREATION_ORDER) {
        if (!models) continue;
        // Cari model yang tableName-nya cocok
        const model = Object.values(models).find(m => m.getTableName().toString().toLowerCase() === tableName.toLowerCase());
        if (!model) {
            console.warn(`⚠️  Model untuk tabel '${tableName}' tidak ditemukan. Lewati.`);
            continue;
        }
        if (existingSet.has(tableName.toLowerCase())) {
            // Sudah ada
            continue;
        }
        try {
            log(`📋 Membuat tabel: ${tableName}`);
            await model.sync({ force: false });
            createdCount++;
        } catch (err) {
            console.error(`❌ Gagal membuat tabel ${tableName}:`, err.message);
            throw err;
        }
    }

    log(`✅ Pemeriksaan tabel selesai. Tabel baru dibuat: ${createdCount}`);
};

/**
 * Database setup and migration script for PRIMA
 * This script safely handles table creation and index management
 */
const setupDatabase = async () => {
    try {
    log('🔧 Starting database setup...');
        
        // Test database connection
        await db.authenticate();
    log('✅ Database connection established successfully.');

        // Jalankan pembuatan tabel yang belum ada untuk semua model
        await ensureAllTables();

        // Pastikan kolom updated_at ada pada tabel quality (jika model sudah diperbarui tapi tabel lama belum di-alter)
        const qiQuality = db.getQueryInterface();
        const qualityTables = [
            'quality_kpis',
            'quality_risks',
            'quality_recommendations'
        ];
        for (const qt of qualityTables) {
            try {
                const desc = await qiQuality.describeTable(qt).catch(() => null);
                if (desc && !desc.updated_at) {
                    log(`🛠  Adding missing column updated_at to ${qt} ...`);
                    await qiQuality.addColumn(qt, 'updated_at', {
                        type: Sequelize.DATE,
                        allowNull: true,
                        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
                    });
                    // Apply ON UPDATE manually (Sequelize addColumn doesn’t support ON UPDATE directly in some dialects)
                    try {
                        await db.query(`ALTER TABLE ${qt} MODIFY updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
                    } catch (e) {
                        console.warn(`⚠️  Could not set ON UPDATE for ${qt}.updated_at: ${e.message}`);
                    }
                }
            } catch (e) {
                // Table might not exist yet (created earlier), skip
                console.warn(`⚠️  Quality table check skipped for ${qt}: ${e.message}`);
            }
        }

        // Auto seed minimal quality data bila kosong (hanya di development)
        if ((process.env.NODE_ENV || 'development') === 'development') {
            try {
                const kpiCount = await Kpi.count();
                if (kpiCount === 0) {
                    log('🌱 Seeding sample quality KPIs...');
                    await Kpi.bulkCreate([
                        { code: 'KPI-ACC-001', label: 'Program Terakreditasi A/B', category: 'Akreditasi', description: 'Persentase program studi akreditasi A/B', responsible: 'Tim Akreditasi', current_value: 22, current_total: 28, current_percentage: 78.6, previous_value: 20, previous_total: 28, previous_percentage: 71.4, target_value: 26, target_total: 28, target_percentage: 92.9, trend: 'up', status: 'good' },
                        { code: 'KPI-DOC-002', label: 'Dokumen Mutu Valid', category: 'Dokumentasi', description: 'Dokumen standar operasional tervalidasi', responsible: 'PPMPP', current_value: 412, current_total: 520, current_percentage: 79.2, previous_value: 380, previous_total: 520, previous_percentage: 73.1, target_value: 468, target_total: 520, target_percentage: 90.0, trend: 'up', status: 'good' }
                    ]);
                }
                const riskCount = await QualityRisk.count();
                if (riskCount === 0) {
                    log('🌱 Seeding sample quality risks...');
                    await QualityRisk.bulkCreate([
                        { code: 'RSK-001', category: 'Penelitian', issue: 'Output penelitian belum mencapai target', description: 'Publikasi dan paten rendah', severity: 'high', probability: 'high', impact: 'high', risk_score: 9, owner: 'LPPM', status: 'active', mitigation: 'Pelatihan & hibah', timeline: '3 bulan', progress: 65 },
                        { code: 'RSK-002', category: 'Alumni', issue: 'Response tracer study rendah', description: 'Response rate < 70%', severity: 'high', probability: 'medium', impact: 'high', risk_score: 6, owner: 'Career Center', status: 'in-progress', mitigation: 'Platform digital & engagement', timeline: '6 bulan', progress: 40 }
                    ]);
                }
                const recCount = await QualityRecommendation.count();
                if (recCount === 0) {
                    log('🌱 Seeding sample quality recommendations...');
                    await QualityRecommendation.bulkCreate([
                        { category: 'Penelitian', priority: 'high', title: 'Penguatan Ekosistem Penelitian Kolaboratif', description: 'Jejaring lintas prodi & institusi', actions: ['Cluster unggulan','Visiting researcher','Hibah kolaborasi'], timeline: '6 bulan', budget: 'Rp 500.000.000', expected_impact: 'Publikasi naik 40%' },
                        { category: 'Pembelajaran', priority: 'medium', title: 'Standarisasi & Digitalisasi RPS', description: 'Template & workflow digital', actions: ['Template standar','Workflow approval','Integrasi SI Akademik'], timeline: '3 bulan', budget: 'Rp 200.000.000', expected_impact: 'Efisiensi 60%' }
                    ]);
                }
            } catch (seedErr) {
                console.warn('⚠️  Auto seed quality data failed:', seedErr.message);
            }
        }

        // Pastikan kolom study_program_id ada di tabel users (dibutuhkan oleh asosiasi StudyProgram.hasMany(User))
        const qiUsers = db.getQueryInterface();
        try {
            const usersDesc = await qiUsers.describeTable('users');
            if (!usersDesc.study_program_id) {
                log('🛠  Adding missing column users.study_program_id ...');
                await qiUsers.addColumn('users', 'study_program_id', {
                    type: Sequelize.STRING(36),
                    allowNull: true,
                    comment: 'FK ke study_programs.study_program_id'
                });
                log('✅ Column study_program_id added to users table');
            }
        } catch (colErr) {
            console.warn('⚠️  Could not verify/add study_program_id column:', colErr.message);
        }

        // Khusus index users (logika sebelumnya) dipertahankan
        const qi = db.getQueryInterface();
        const indexes = await qi.showIndex('users');
        const requiredIndexes = [
            { name: 'users_email_unique', unique: true, fields: ['email'] },
            { name: 'users_nip_unique', unique: true, fields: ['nip'], where: { nip: { [Sequelize.Op.ne]: null } } },
            { name: 'users_role_index', fields: ['role'] },
            { name: 'users_is_active_index', fields: ['is_active'] },
            { name: 'users_study_program_id_index', fields: ['study_program_id'] }
        ];
        for (const reqIndex of requiredIndexes) {
            const existingIndex = indexes.find(idx => idx.name === reqIndex.name);
            if (!existingIndex) {
                try {
                    log(`📌 Creating index: ${reqIndex.name}`);
                    await qi.addIndex('users', reqIndex);
                } catch (e) {
                    console.warn(`⚠️  Index ${reqIndex.name} creation skipped: ${e.message}`);
                }
            }
        }

    log('🎉 Database setup & table generation completed successfully!');
        
    } catch (error) {
        console.error('❌ Database setup failed:', error);
        throw error;
    }
};

/**
 * Reset database (use with caution)
 */
const resetDatabase = async () => {
    try {
        console.log('⚠️  Resetting database...');
        await User.drop();
        console.log('🗑️  Users table dropped.');
        await setupDatabase();
        console.log('🔄 Database reset completed.');
    } catch (error) {
        console.error('❌ Database reset failed:', error);
        throw error;
    }
};

/**
 * Check database health
 */
const checkDatabaseHealth = async () => {
    try {
        await db.authenticate();
        const tables = await db.getQueryInterface().showAllTables();
        console.log('🏥 Database Health Check:');
        console.log(`✅ Connection: OK`);
        console.log(`📋 Tables: ${tables.length} found`);
        
        if (tables.includes('users')) {
            const userCount = await User.count();
            console.log(`👥 Users: ${userCount} records`);
        }
        
        return true;
    } catch (error) {
        console.error('❌ Database health check failed:', error);
        return false;
    }
};

// Export functions
export { setupDatabase, resetDatabase, checkDatabaseHealth, ensureAllTables };

// Run setup if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    setupDatabase()
        .then(() => {
            console.log('Setup completed. Exiting...');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Setup failed:', error);
            process.exit(1);
        });
}
