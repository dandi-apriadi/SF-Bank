/**
 * SF BANK - Seed Audit Logs Script
 * Mengisi table audit_logs dengan data historis yang selaras dengan data existing
 */

import Database from '../config/Database.js';
import User from '../models/userModelNew.js';
import { Alliance } from '../models/allianceModel.js';
import MemberContribution from '../models/memberContributionModel.js';
import AuditLog from '../models/auditLogModel.js';

const seedAuditLogs = async () => {
  try {
    console.log('🚀 Starting Audit Logs Seeding...\n');
    await Database.authenticate();
    
    // Clear existing audit logs
    console.log('🗑️  Clearing existing audit logs...');
    await AuditLog.destroy({ where: {}, truncate: true });
    console.log('✅ Audit logs cleared\n');

    // Get admin user (ID 501)
    const adminUser = await User.findOne({ where: { user_id: 'ADMIN-001' } });
    if (!adminUser) {
      throw new Error('Admin user not found! Please run createAdminUser.js first.');
    }
    console.log(`👤 Using admin user: ${adminUser.name} (ID: ${adminUser.id})\n`);

    const auditLogs = [];
    let logId = 1;

    // ==========================================
    // 1. Audit logs untuk Alliance Creation
    // ==========================================
    console.log('📝 Creating audit logs for alliances...');
    const alliances = await Alliance.findAll({ order: [['id', 'ASC']] });
    
    for (const alliance of alliances) {
      auditLogs.push({
        id: logId++,
        user_id: adminUser.id,
        action: 'CREATE',
        target_type: 'alliance',
        target_id: alliance.id,
        details: JSON.stringify({
          name: alliance.name,
          tag: alliance.tag,
          leader: alliance.leader,
          members_count: alliance.members_count,
          description: alliance.description,
          message: `Alliance "${alliance.name}" (${alliance.tag}) created by ${adminUser.name}`
        }),
        ip_address: '127.0.0.1',
        user_agent: 'SF Bank Admin Portal / Seed Script v1.0',
        timestamp: new Date(alliance.created_at),
        created_at: new Date(alliance.created_at),
        updated_at: new Date(alliance.created_at)
      });
    }
    console.log(`✅ Created ${alliances.length} alliance audit logs\n`);

    // ==========================================
    // 2. Audit logs untuk User Creation
    // ==========================================
    console.log('📝 Creating audit logs for users...');
    const users = await User.findAll({ 
      where: { role: 'R5' }, // Only member users, not admin
      order: [['id', 'ASC']]
    });
    
    // Create audit logs in batches to avoid memory issues
    const batchSize = 100;
    for (let i = 0; i < users.length; i += batchSize) {
      const userBatch = users.slice(i, i + batchSize);
      
      for (const user of userBatch) {
        const userAlliance = await Alliance.findByPk(user.alliance_id);
        
        auditLogs.push({
          id: logId++,
          user_id: adminUser.id,
          action: 'CREATE',
          target_type: 'user',
          target_id: user.id,
          details: JSON.stringify({
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            role: user.role,
            alliance: userAlliance ? userAlliance.name : 'No Alliance',
            status: user.status,
            message: `User "${user.name}" (${user.user_id}) registered in ${userAlliance?.name || 'No Alliance'} by ${adminUser.name}`
          }),
          ip_address: '127.0.0.1',
          user_agent: 'SF Bank Admin Portal / Seed Script v1.0',
          timestamp: new Date(user.created_at),
          created_at: new Date(user.created_at),
          updated_at: new Date(user.created_at)
        });
      }
      
      console.log(`  Progress: ${Math.min(i + batchSize, users.length)}/${users.length} users processed`);
    }
    console.log(`✅ Created ${users.length} user audit logs\n`);

    // ==========================================
    // 3. Audit logs untuk Member Contributions (sample only)
    // ==========================================
    console.log('📝 Creating audit logs for member contributions (sample)...');
    
    // Get sample contributions (first and last week for each user)
    const sampleContributions = await MemberContribution.findAll({
      where: {},
      order: [['member_id', 'ASC'], ['week', 'ASC']]
    });

    // Group by member_id to get first and last week
    const contributionsByMember = {};
    sampleContributions.forEach(contrib => {
      if (!contributionsByMember[contrib.member_id]) {
        contributionsByMember[contrib.member_id] = [];
      }
      contributionsByMember[contrib.member_id].push(contrib);
    });

    // Create audit logs for first contribution of each member
    let contributionCount = 0;
    for (const memberId in contributionsByMember) {
      const contributions = contributionsByMember[memberId];
      const firstContrib = contributions[0];
      
      if (firstContrib) {
        const member = await User.findByPk(firstContrib.member_id);
        const alliance = await Alliance.findByPk(firstContrib.alliance_id);
        
        const totalRss = parseInt(firstContrib.food) + parseInt(firstContrib.wood) + 
                        parseInt(firstContrib.stone) + parseInt(firstContrib.gold);
        
        auditLogs.push({
          id: logId++,
          user_id: adminUser.id,
          action: 'CREATE',
          target_type: 'resource',
          target_id: firstContrib.id,
          details: JSON.stringify({
            member: member ? member.name : 'Unknown',
            alliance: alliance ? alliance.name : 'Unknown',
            week: firstContrib.week,
            food: firstContrib.food,
            wood: firstContrib.wood,
            stone: firstContrib.stone,
            gold: firstContrib.gold,
            total_rss: totalRss,
            message: `Resource contribution recorded for ${member?.name || 'Unknown'} - Week ${firstContrib.week}`
          }),
          ip_address: '127.0.0.1',
          user_agent: 'SF Bank Admin Portal / Seed Script v1.0',
          timestamp: new Date(firstContrib.created_at),
          created_at: new Date(firstContrib.created_at),
          updated_at: new Date(firstContrib.created_at)
        });
        
        contributionCount++;
      }
    }
    console.log(`✅ Created ${contributionCount} resource contribution audit logs\n`);

    // ==========================================
    // 4. Add some UPDATE and DELETE actions for variety
    // ==========================================
    console.log('📝 Creating sample UPDATE and DELETE audit logs...');
    
    // Sample UPDATE logs (alliance updates)
    for (let i = 0; i < 3; i++) {
      const alliance = alliances[i];
      const updateDate = new Date(alliance.created_at);
      updateDate.setDate(updateDate.getDate() + 7); // 7 days after creation
      
      auditLogs.push({
        id: logId++,
        user_id: adminUser.id,
        action: 'UPDATE',
        target_type: 'alliance',
        target_id: alliance.id,
        details: JSON.stringify({
          name: alliance.name,
          changes: {
            members_count: { old: alliance.members_count - 5, new: alliance.members_count },
            description: { old: 'Initial description', new: alliance.description }
          },
          message: `Alliance "${alliance.name}" updated by ${adminUser.name}`
        }),
        ip_address: '127.0.0.1',
        user_agent: 'SF Bank Admin Portal / Desktop App v1.0',
        timestamp: updateDate,
        created_at: updateDate,
        updated_at: updateDate
      });
    }

    // Sample DELETE logs (inactive users)
    for (let i = 0; i < 2; i++) {
      const deleteDate = new Date();
      deleteDate.setDate(deleteDate.getDate() - (10 - i)); // 10 and 9 days ago
      
      auditLogs.push({
        id: logId++,
        user_id: adminUser.id,
        action: 'DELETE',
        target_type: 'user',
        target_id: 9999 + i, // Fake IDs for deleted users
        details: JSON.stringify({
          user_id: `DEL-00${i + 1}`,
          name: `Inactive User ${i + 1}`,
          email: `deleted.user${i + 1}@sfbank.com`,
          reason: 'Inactive for more than 90 days',
          message: `User account deleted by ${adminUser.name} due to inactivity`
        }),
        ip_address: '127.0.0.1',
        user_agent: 'SF Bank Admin Portal / Desktop App v1.0',
        timestamp: deleteDate,
        created_at: deleteDate,
        updated_at: deleteDate
      });
    }
    
    console.log(`✅ Created 5 sample UPDATE/DELETE audit logs\n`);

    // ==========================================
    // 5. Bulk Insert All Audit Logs
    // ==========================================
    console.log(`💾 Inserting ${auditLogs.length} audit logs into database...`);
    
    // Insert in batches to avoid memory issues
    const insertBatchSize = 500;
    for (let i = 0; i < auditLogs.length; i += insertBatchSize) {
      const batch = auditLogs.slice(i, i + insertBatchSize);
      await AuditLog.bulkCreate(batch, { validate: true });
      console.log(`  Inserted batch: ${Math.min(i + insertBatchSize, auditLogs.length)}/${auditLogs.length}`);
    }

    // ==========================================
    // 6. Verify Results
    // ==========================================
    console.log('\n📊 Verifying audit logs...');
    const totalLogs = await AuditLog.count();
    const createLogs = await AuditLog.count({ where: { action: 'CREATE' } });
    const updateLogs = await AuditLog.count({ where: { action: 'UPDATE' } });
    const deleteLogs = await AuditLog.count({ where: { action: 'DELETE' } });
    
    console.log('\n═══════════════════════════════════════');
    console.log('✅ AUDIT LOGS SEEDING COMPLETED');
    console.log('═══════════════════════════════════════');
    console.log(`📊 Total Audit Logs: ${totalLogs}`);
    console.log(`  - CREATE actions: ${createLogs}`);
    console.log(`  - UPDATE actions: ${updateLogs}`);
    console.log(`  - DELETE actions: ${deleteLogs}`);
    console.log('\n🎯 Breakdown:');
    console.log(`  - Alliances: ${alliances.length} logs`);
    console.log(`  - Users: ${users.length} logs`);
    console.log(`  - Contributions: ${contributionCount} logs`);
    console.log(`  - Updates: 3 logs`);
    console.log(`  - Deletes: 2 logs`);
    console.log('═══════════════════════════════════════\n');

    await Database.close();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error seeding audit logs:', error.message);
    console.error(error);
    process.exit(1);
  }
};

// Run the seeding
seedAuditLogs();
