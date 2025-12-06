/**
 * SF BANK - Update User Roles Script
 * Change all user roles to R1 except Admin
 */

import Database from '../config/Database.js';
import User from '../models/userModelNew.js';
import { Op } from 'sequelize';

const updateUserRoles = async () => {
  try {
    console.log('🚀 Starting User Roles Update...\n');
    await Database.authenticate();
    console.log('✅ Database connected\n');

    // Count current roles
    console.log('📊 Current role distribution:');
    const adminCount = await User.count({ where: { role: 'Admin' } });
    const r1Count = await User.count({ where: { role: 'R1' } });
    const r2Count = await User.count({ where: { role: 'R2' } });
    const r3Count = await User.count({ where: { role: 'R3' } });
    const r4Count = await User.count({ where: { role: 'R4' } });
    const r5Count = await User.count({ where: { role: 'R5' } });
    
    console.log(`  - Admin: ${adminCount}`);
    console.log(`  - R1: ${r1Count}`);
    console.log(`  - R2: ${r2Count}`);
    console.log(`  - R3: ${r3Count}`);
    console.log(`  - R4: ${r4Count}`);
    console.log(`  - R5: ${r5Count}`);
    console.log('');

    // Update all non-admin users to R1
    console.log('🔄 Updating all non-admin users to R1...');
    const [updatedCount] = await User.update(
      { role: 'R1' },
      { 
        where: { 
          role: { [Op.ne]: 'Admin' }
        } 
      }
    );

    console.log(`✅ Updated ${updatedCount} users to R1\n`);

    // Verify new distribution
    console.log('📊 New role distribution:');
    const newAdminCount = await User.count({ where: { role: 'Admin' } });
    const newR1Count = await User.count({ where: { role: 'R1' } });
    const newR2Count = await User.count({ where: { role: 'R2' } });
    const newR3Count = await User.count({ where: { role: 'R3' } });
    const newR4Count = await User.count({ where: { role: 'R4' } });
    const newR5Count = await User.count({ where: { role: 'R5' } });
    
    console.log(`  - Admin: ${newAdminCount}`);
    console.log(`  - R1: ${newR1Count}`);
    console.log(`  - R2: ${newR2Count}`);
    console.log(`  - R3: ${newR3Count}`);
    console.log(`  - R4: ${newR4Count}`);
    console.log(`  - R5: ${newR5Count}`);
    console.log('');

    console.log('═══════════════════════════════════════');
    console.log('✅ USER ROLES UPDATE COMPLETED');
    console.log('═══════════════════════════════════════');
    console.log(`Total users updated: ${updatedCount}`);
    console.log(`Admin users (unchanged): ${newAdminCount}`);
    console.log(`R1 users (new): ${newR1Count}`);
    console.log('═══════════════════════════════════════\n');

    await Database.close();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error updating user roles:', error.message);
    console.error(error);
    process.exit(1);
  }
};

// Run the update
updateUserRoles();
