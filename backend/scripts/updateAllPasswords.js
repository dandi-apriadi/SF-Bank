/**
 * SF BANK - Update All User Passwords Script
 * Change all user passwords to a single hash
 */

import Database from '../config/Database.js';
import User from '../models/userModelNew.js';

const updateAllPasswords = async () => {
  try {
    console.log('🚀 Starting Password Update...\n');
    await Database.authenticate();
    console.log('✅ Database connected\n');

    // The new password hash (password: 12345678)
    const newPasswordHash = '$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8';

    console.log('📊 Current user count:');
    const totalUsers = await User.count();
    console.log(`  Total users: ${totalUsers}\n`);

    // Update all user passwords using raw query to bypass hooks
    console.log('🔄 Updating all user passwords...');
    const [result] = await Database.query(
      'UPDATE users SET password = ? WHERE 1=1',
      {
        replacements: [newPasswordHash],
        type: Database.QueryTypes.UPDATE
      }
    );

    console.log(`✅ Updated ${result} user passwords\n`);

    // Verify update
    console.log('🔍 Verifying password update...');
    const sampleUsers = await User.findAll({
      limit: 5,
      attributes: ['id', 'user_id', 'name', 'email', 'role', 'password']
    });

    console.log('\n📋 Sample of updated users:');
    sampleUsers.forEach(user => {
      const passwordMatch = user.password === newPasswordHash ? '✅' : '❌';
      console.log(`  ${passwordMatch} ${user.user_id} (${user.name}) - ${user.role}`);
    });

    console.log('\n═══════════════════════════════════════');
    console.log('✅ PASSWORD UPDATE COMPLETED');
    console.log('═══════════════════════════════════════');
    console.log(`Total users updated: ${result}`);
    console.log(`New password for all users: 12345678`);
    console.log(`Password hash: ${newPasswordHash.substring(0, 50)}...`);
    console.log('═══════════════════════════════════════\n');

    await Database.close();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error updating passwords:', error.message);
    console.error(error);
    process.exit(1);
  }
};

// Run the update
updateAllPasswords();
