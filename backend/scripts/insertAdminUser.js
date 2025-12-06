import db from '../config/Database.js';

async function insertAdminUser() {
  try {
    console.log('🔄 Inserting admin user...');
    
    const query = `INSERT INTO users (user_id, name, email, password, role, status, created_at, updated_at) 
                   VALUES ('admin001', 'Admin User', 'admin@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$aWY4hbrcTqRzEk1VuBHlJg$EyNj61XJIAp0n2JgpioGkmSOQfasMFN4Pzo12ZuUYG8', 'Admin', 'Active', NOW(), NOW())`;
    
    await db.query(query);

    console.log('✅ Admin user inserted successfully');
    console.log('📧 Email: admin@gmail.com');
    console.log('🔐 Password: admin123 (hashed)');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error inserting admin user:', error.message);
    process.exit(1);
  }
}

insertAdminUser();
