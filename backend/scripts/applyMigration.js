import db from '../config/Database.js';

const applyMigration = async () => {
  try {
    console.log('🔄 Applying news image fields migration...');
    
    await db.authenticate();
    console.log('✅ Database connected.');

    // Add featured_image column to news_posts
    try {
      console.log('Adding featured_image column to news_posts...');
      await db.query("ALTER TABLE news_posts ADD COLUMN featured_image VARCHAR(255) NULL COMMENT 'Path to featured image'");
      console.log('✅ featured_image column added to news_posts');
    } catch (error) {
      if (error.original?.code === 'ER_DUP_FIELDNAME') {
        console.log('⚠️  featured_image column already exists');
      } else {
        throw error;
      }
    }

    // Add original_name column to news_attachments
    try {
      console.log('Adding original_name column to news_attachments...');
      await db.query("ALTER TABLE news_attachments ADD COLUMN original_name VARCHAR(255) NOT NULL DEFAULT '' AFTER file_path");
      console.log('✅ original_name column added to news_attachments');
    } catch (error) {
      if (error.original?.code === 'ER_DUP_FIELDNAME') {
        console.log('⚠️  original_name column already exists');
      } else {
        throw error;
      }
    }

    // Add file_type column to news_attachments
    try {
      console.log('Adding file_type column to news_attachments...');
      await db.query("ALTER TABLE news_attachments ADD COLUMN file_type ENUM('image','document','video','other') DEFAULT 'other' AFTER file_size");
      console.log('✅ file_type column added to news_attachments');
    } catch (error) {
      if (error.original?.code === 'ER_DUP_FIELDNAME') {
        console.log('⚠️  file_type column already exists');
      } else {
        throw error;
      }
    }

    // Add is_featured column to news_attachments
    try {
      console.log('Adding is_featured column to news_attachments...');
      await db.query("ALTER TABLE news_attachments ADD COLUMN is_featured BOOLEAN DEFAULT FALSE AFTER file_type");
      console.log('✅ is_featured column added to news_attachments');
    } catch (error) {
      if (error.original?.code === 'ER_DUP_FIELDNAME') {
        console.log('⚠️  is_featured column already exists');
      } else {
        throw error;
      }
    }

    console.log('\n🎉 Migration completed successfully!');
    
    // Verify the changes
    console.log('\n🔍 Verifying changes...');
    const [newsPostsColumns] = await db.query("DESCRIBE news_posts");
    const featuredImageColumn = newsPostsColumns.find(col => col.Field === 'featured_image');
    
    if (featuredImageColumn) {
      console.log('✅ featured_image column verified in news_posts');
    }

    const [attachmentsColumns] = await db.query("DESCRIBE news_attachments");
    const originalNameColumn = attachmentsColumns.find(col => col.Field === 'original_name');
    const fileTypeColumn = attachmentsColumns.find(col => col.Field === 'file_type');
    const isFeaturedColumn = attachmentsColumns.find(col => col.Field === 'is_featured');
    
    if (originalNameColumn && fileTypeColumn && isFeaturedColumn) {
      console.log('✅ All new columns verified in news_attachments');
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

applyMigration();
