import dotenv from 'dotenv';
dotenv.config();

import db from '../config/Database.js';
import fs from 'fs';
import path from 'path';

const analyzeDatabaseAndGenerateLogs = async () => {
    try {
        console.log('📊 Starting Database Analysis...\n');

        await db.authenticate();
        console.log('✅ Database connection established.\n');

        // Get all tables
        const [tables] = await db.query(`
            SELECT TABLE_NAME, TABLE_ROWS, DATA_LENGTH, INDEX_LENGTH, AUTO_INCREMENT
            FROM INFORMATION_SCHEMA.TABLES
            WHERE TABLE_SCHEMA = DATABASE()
            ORDER BY TABLE_NAME;
        `);

        console.log('📋 Tables Found:\n');
        let totalRecords = 0;
        let logContent = '';

        logContent += '═══════════════════════════════════════════════════════════════\n';
        logContent += '  SF BANK DATABASE ANALYSIS REPORT\n';
        logContent += `  Generated: ${new Date().toLocaleString('id-ID')}\n`;
        logContent += '═══════════════════════════════════════════════════════════════\n\n';

        logContent += '1. TABLE OVERVIEW\n';
        logContent += '───────────────────────────────────────────────────────────────\n\n';

        for (const table of tables) {
            const tableName = table.TABLE_NAME;
            const rowCount = table.TABLE_ROWS || 0;
            const dataSize = (table.DATA_LENGTH / 1024 / 1024).toFixed(2);
            const indexSize = (table.INDEX_LENGTH / 1024 / 1024).toFixed(2);

            totalRecords += rowCount;

            console.log(`📄 ${tableName}`);
            console.log(`   Records: ${rowCount.toLocaleString('id-ID')}`);
            console.log(`   Data Size: ${dataSize} MB`);
            console.log(`   Index Size: ${indexSize} MB\n`);

            logContent += `TABLE: ${tableName}\n`;
            logContent += `  Records: ${rowCount.toLocaleString('id-ID')}\n`;
            logContent += `  Data Size: ${dataSize} MB\n`;
            logContent += `  Index Size: ${indexSize} MB\n`;
            logContent += `  Total Size: ${(parseFloat(dataSize) + parseFloat(indexSize)).toFixed(2)} MB\n`;

            // Get table schema
            const [columns] = await db.query(
                `SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_KEY, EXTRA
                FROM INFORMATION_SCHEMA.COLUMNS
                WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = '${tableName}'
                ORDER BY ORDINAL_POSITION;`
            );

            logContent += `\n  COLUMNS:\n`;
            for (const col of columns) {
                const nullable = col.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL';
                const key = col.COLUMN_KEY ? `[${col.COLUMN_KEY}]` : '';
                logContent += `    - ${col.COLUMN_NAME}: ${col.COLUMN_TYPE} ${nullable} ${key}\n`;
            }

            // Get row count
            const [rowInfo] = await db.query(`SELECT COUNT(*) as count FROM \`${tableName}\`;`);
            const actualRowCount = rowInfo[0]?.count || 0;

            logContent += `\n  ACTUAL ROW COUNT: ${actualRowCount.toLocaleString('id-ID')}\n\n`;

            // Get sample data for key tables
            if (['alliances', 'users', 'member_contributions'].includes(tableName)) {
                const [sampleData] = await db.query(`SELECT * FROM \`${tableName}\` LIMIT 3;`);
                logContent += `  SAMPLE DATA (First 3 rows):\n`;
                if (sampleData.length > 0) {
                    logContent += `    ${JSON.stringify(sampleData, null, 2)}\n`;
                } else {
                    logContent += `    (No data)\n`;
                }
            }

            logContent += '\n───────────────────────────────────────────────────────────────\n\n';
        }

        // Database statistics
        console.log('\n📊 Database Statistics:\n');
        logContent += '\n2. DATABASE STATISTICS\n';
        logContent += '───────────────────────────────────────────────────────────────\n\n';

        const [dbStats] = await db.query(`
            SELECT 
                SUM(DATA_LENGTH + INDEX_LENGTH) as total_size,
                COUNT(*) as table_count
            FROM INFORMATION_SCHEMA.TABLES
            WHERE TABLE_SCHEMA = DATABASE();
        `);

        const totalSize = ((dbStats[0]?.total_size || 0) / 1024 / 1024).toFixed(2);
        const tableCount = dbStats[0]?.table_count || 0;

        console.log(`Total Tables: ${tableCount}`);
        console.log(`Total Records: ${totalRecords.toLocaleString('id-ID')}`);
        console.log(`Total Database Size: ${totalSize} MB\n`);

        logContent += `Total Tables: ${tableCount}\n`;
        logContent += `Total Records: ${totalRecords.toLocaleString('id-ID')}\n`;
        logContent += `Total Database Size: ${totalSize} MB\n\n`;

        // Table relationships
        console.log('🔗 Table Relationships:\n');
        logContent += '\n3. TABLE RELATIONSHIPS & KEYS\n';
        logContent += '───────────────────────────────────────────────────────────────\n\n';

        const relationships = {
            'users': ['alliance_id'],
            'member_contributions': ['member_id', 'alliance_id'],
            'alliances': [],
            'alliance_resources': ['alliance_id'],
            'alliance_banks': ['alliance_id'],
            'audit_logs': ['user_id']
        };

        for (const [table, fks] of Object.entries(relationships)) {
            if (fks.length > 0) {
                console.log(`${table}:`);
                logContent += `${table}:\n`;
                for (const fk of fks) {
                    console.log(`  └─ ${fk}`);
                    logContent += `  └─ ${fk}\n`;
                }
            }
        }

        // Data integrity checks
        console.log('\n✅ Data Integrity Checks:\n');
        logContent += '\n4. DATA INTEGRITY CHECKS\n';
        logContent += '───────────────────────────────────────────────────────────────\n\n';

        // Check users
        const [userStats] = await db.query(`
            SELECT 
                COUNT(*) as total_users,
                COUNT(DISTINCT role) as roles,
                COUNT(DISTINCT alliance_id) as alliances
            FROM users;
        `);

        console.log(`Users:`);
        console.log(`  Total: ${userStats[0]?.total_users || 0}`);
        console.log(`  Roles: ${userStats[0]?.roles || 0}`);
        console.log(`  Alliances: ${userStats[0]?.alliances || 0}\n`);

        logContent += `Users:\n`;
        logContent += `  Total: ${userStats[0]?.total_users || 0}\n`;
        logContent += `  Roles: ${userStats[0]?.roles || 0}\n`;
        logContent += `  Alliances: ${userStats[0]?.alliances || 0}\n\n`;

        // Check alliances
        const [allianceStats] = await db.query(`
            SELECT 
                COUNT(*) as total_alliances,
                SUM(members_count) as total_members
            FROM alliances;
        `);

        console.log(`Alliances:`);
        console.log(`  Total: ${allianceStats[0]?.total_alliances || 0}`);
        console.log(`  Total Members: ${allianceStats[0]?.total_members || 0}\n`);

        logContent += `Alliances:\n`;
        logContent += `  Total: ${allianceStats[0]?.total_alliances || 0}\n`;
        logContent += `  Total Members: ${allianceStats[0]?.total_members || 0}\n\n`;

        // Check contributions
        const [contribStats] = await db.query(`
            SELECT 
                COUNT(*) as total_contributions,
                MIN(week) as min_week,
                MAX(week) as max_week,
                COUNT(DISTINCT week) as unique_weeks,
                COUNT(DISTINCT member_id) as total_members
            FROM member_contributions;
        `);

        console.log(`Member Contributions:`);
        console.log(`  Total: ${contribStats[0]?.total_contributions || 0}`);
        console.log(`  Week Range: ${contribStats[0]?.min_week || 0} - ${contribStats[0]?.max_week || 0}`);
        console.log(`  Unique Weeks: ${contribStats[0]?.unique_weeks || 0}`);
        console.log(`  Members with Contributions: ${contribStats[0]?.total_members || 0}\n`);

        logContent += `Member Contributions:\n`;
        logContent += `  Total: ${contribStats[0]?.total_contributions || 0}\n`;
        logContent += `  Week Range: ${contribStats[0]?.min_week || 0} - ${contribStats[0]?.max_week || 0}\n`;
        logContent += `  Unique Weeks: ${contribStats[0]?.unique_weeks || 0}\n`;
        logContent += `  Members with Contributions: ${contribStats[0]?.total_members || 0}\n\n`;

        // Data summary per alliance
        console.log('👥 Data Summary Per Alliance:\n');
        logContent += '\n5. DATA SUMMARY PER ALLIANCE\n';
        logContent += '───────────────────────────────────────────────────────────────\n\n';

        const [allianceDetails] = await db.query(`
            SELECT 
                a.name,
                a.tag,
                COUNT(DISTINCT u.id) as member_count,
                COUNT(DISTINCT mc.id) as contribution_count,
                SUM(mc.food + mc.wood + mc.stone + mc.gold) as total_rss
            FROM alliances a
            LEFT JOIN users u ON a.id = u.alliance_id
            LEFT JOIN member_contributions mc ON a.id = mc.alliance_id
            GROUP BY a.id, a.name, a.tag
            ORDER BY a.name;
        `);

        for (const alliance of allianceDetails) {
            console.log(`${alliance.name} (${alliance.tag}):`);
            console.log(`  Members: ${alliance.member_count || 0}`);
            console.log(`  Contributions: ${alliance.contribution_count || 0}`);
            console.log(`  Total RSS: ${(alliance.total_rss || 0).toLocaleString('id-ID')}\n`);

            logContent += `${alliance.name} (${alliance.tag}):\n`;
            logContent += `  Members: ${alliance.member_count || 0}\n`;
            logContent += `  Contributions: ${alliance.contribution_count || 0}\n`;
            logContent += `  Total RSS: ${(alliance.total_rss || 0).toLocaleString('id-ID')}\n\n`;
        }

        // Write log to file
        const logsDir = path.join(process.cwd(), 'logs');
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const logFile = path.join(logsDir, `database-analysis-${timestamp}.log`);
        fs.writeFileSync(logFile, logContent);

        console.log(`\n✨ Analysis completed!\n`);
        console.log(`📁 Log file saved to: ${logFile}\n`);

        process.exit(0);

    } catch (error) {
        console.error('❌ Error analyzing database:', error);
        console.error('\nStack trace:', error.stack);
        process.exit(1);
    }
};

analyzeDatabaseAndGenerateLogs();
