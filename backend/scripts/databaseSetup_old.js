import { Sequelize } from 'sequelize';
import db from '../config/Database.js';

// Control verbosity for setup logs
const VERBOSE = (process.env.VERBOSE_DB_SETUP || '').toLowerCase() === 'true';
const log = (...args) => { if (VERBOSE) console.log(...args); };

/**
 * Membuat tabel dalam urutan yang benar untuk SF BANK
 * Urutan penting karena foreign key dependencies
 */
const ensureAllTables = async () => {
    log('🧱 Membuat tabel SF BANK dalam urutan dependency...');
    
    try {
        // Import models AFTER database connection to avoid circular deps
        const { 
            Alliance, 
            AllianceResource, 
            AllianceBank, 
            User, 
            MemberContribution, 
            AuditLog 
        } = await import('../models/index.js');

        // Step 1: Create parent tables (no dependencies)
        log('📋 Step 1: Creating alliances table...');
        await Alliance.sync({ force: false });
        
        // Step 2: Create tables that depend on alliances
        log('📋 Step 2: Creating alliance_resources table...');
        await AllianceResource.sync({ force: false });
        
        log('📋 Step 3: Creating alliance_bank table...');
        await AllianceBank.sync({ force: false });
        
        // Step 3: Create users table (depends on alliances)
        log('📋 Step 4: Creating users table...');
        await User.sync({ force: false });
        
        // Step 4: Create tables that depend on both users and alliances
        log('📋 Step 5: Creating member_contributions table...');
        await MemberContribution.sync({ force: false });
        
        // Step 5: Create audit_logs (depends on users)
        log('📋 Step 6: Creating audit_logs table...');
        await AuditLog.sync({ force: false });
        
        log(`✅ All SF BANK tables synced successfully!`);
        
    } catch (err) {
        console.error(`❌ Failed to sync tables: ${err.message}`);
        throw err;
    }
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
                const models = db.models;
                if (models && models.Kpi) {
                    const kpiCount = await models.Kpi.count();
                    if (kpiCount === 0) {
                        log('🌱 Seeding sample quality KPIs...');
                        await models.Kpi.bulkCreate([
                            { code: 'KPI-ACC-001', label: 'Program Terakreditasi A/B', category: 'Akreditasi', description: 'Persentase program studi akreditasi A/B', responsible: 'Tim Akreditasi', current_value: 22, current_total: 28, current_percentage: 78.6, previous_value: 20, previous_total: 28, previous_percentage: 71.4, target_value: 26, target_total: 28, target_percentage: 92.9, trend: 'up', status: 'good' },
                            { code: 'KPI-DOC-002', label: 'Dokumen Mutu Valid', category: 'Dokumentasi', description: 'Dokumen standar operasional tervalidasi', responsible: 'PPMPP', current_value: 412, current_total: 520, current_percentage: 79.2, previous_value: 380, previous_total: 520, previous_percentage: 73.1, target_value: 468, target_total: 520, target_percentage: 90.0, trend: 'up', status: 'good' }
                        ]);
                    }
                }

                if (models && models.QualityRisk) {
                    const riskCount = await models.QualityRisk.count();
                    if (riskCount === 0) {
                        log('🌱 Seeding sample quality risks...');
                        await models.QualityRisk.bulkCreate([
                            { code: 'RSK-001', category: 'Penelitian', issue: 'Output penelitian belum mencapai target', description: 'Publikasi dan paten rendah', severity: 'high', probability: 'high', impact: 'high', risk_score: 9, owner: 'LPPM', status: 'active', mitigation: 'Pelatihan & hibah', timeline: '3 bulan', progress: 65 },
                            { code: 'RSK-002', category: 'Alumni', issue: 'Response tracer study rendah', description: 'Response rate < 70%', severity: 'high', probability: 'medium', impact: 'high', risk_score: 6, owner: 'Career Center', status: 'in-progress', mitigation: 'Platform digital & engagement', timeline: '6 bulan', progress: 40 }
                        ]);
                    }
                }

                if (models && models.QualityRecommendation) {
                    const recCount = await models.QualityRecommendation.count();
                    if (recCount === 0) {
                        log('🌱 Seeding sample quality recommendations...');
                        await models.QualityRecommendation.bulkCreate([
                            { category: 'Penelitian', priority: 'high', title: 'Penguatan Ekosistem Penelitian Kolaboratif', description: 'Jejaring lintas prodi & institusi', actions: ['Cluster unggulan','Visiting researcher','Hibah kolaborasi'], timeline: '6 bulan', budget: 'Rp 500.000.000', expected_impact: 'Publikasi naik 40%' },
                            { category: 'Pembelajaran', priority: 'medium', title: 'Standarisasi & Digitalisasi RPS', description: 'Template & workflow digital', actions: ['Template standar','Workflow approval','Integrasi SI Akademik'], timeline: '3 bulan', budget: 'Rp 200.000.000', expected_impact: 'Efisiensi 60%' }
                        ]);
                    }
                }
            } catch (seedErr) {
                console.warn('⚠️  Auto seed quality data failed:', seedErr.message);
            }
        }

        // Khusus index users (logika sebelumnya) dipertahankan
        const qi = db.getQueryInterface();
        const indexes = await qi.showIndex('users');
        const requiredIndexes = [
            { name: 'users_email_unique', unique: true, fields: ['email'] },
            { name: 'users_role_index', fields: ['role'] },
            { name: 'users_is_active_index', fields: ['is_active'] }
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
