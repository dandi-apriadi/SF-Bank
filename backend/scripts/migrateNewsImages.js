import db from '../config/Database.js';
import fs from 'fs';
import path from 'path';

const runMigration = async () => {
  try {
    console.log('🔄 Running news image fields migration...');
    
    // Connect to database
    await db.authenticate();
    console.log('✅ Database connection established.');

    // Read migration file
    const migrationPath = path.join(process.cwd(), 'migrations', 'add_news_image_fields.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Split by semicolon to handle multiple statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    // Execute each statement
    for (const statement of statements) {
      try {
        console.log(`Executing: ${statement.substring(0, 50)}...`);
        await db.query(statement);
        console.log('✅ Statement executed successfully.');
      } catch (error) {
        if (error.original?.code === 'ER_DUP_FIELDNAME') {
          console.log('⚠️  Column already exists, skipping...');
        } else {
          console.error('❌ Error executing statement:', error.message);
          throw error;
        }
      }
    }

    console.log('🎉 Migration completed successfully!');
    
    // Verify the changes
    console.log('\n🔍 Verifying changes...');
    const [newsPostsColumns] = await db.query("DESCRIBE news_posts");
    const featuredImageColumn = newsPostsColumns.find(col => col.Field === 'featured_image');
    
    if (featuredImageColumn) {
      console.log('✅ featured_image column added to news_posts table');
    } else {
      console.log('❌ featured_image column not found in news_posts table');
    }

    const [attachmentsColumns] = await db.query("DESCRIBE news_attachments");
    const originalNameColumn = attachmentsColumns.find(col => col.Field === 'original_name');
    
    if (originalNameColumn) {
      console.log('✅ Enhanced news_attachments table with new columns');
    } else {
      console.log('❌ original_name column not found in news_attachments table');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await db.close();
    console.log('👋 Database connection closed.');
    process.exit(0);
  }
};

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigration();
}

export default runMigration;
