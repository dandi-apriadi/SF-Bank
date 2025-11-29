import db from '../config/Database.js';

const checkSchema = async () => {
  try {
    console.log('🔍 Checking current database schema...');
    
    await db.authenticate();
    console.log('✅ Database connected.');

    // Check news_posts table structure
    console.log('\n📋 Current news_posts table structure:');
    const [newsPostsColumns] = await db.query("DESCRIBE news_posts");
    console.table(newsPostsColumns);

    // Check news_attachments table structure
    console.log('\n📋 Current news_attachments table structure:');
    const [attachmentsColumns] = await db.query("DESCRIBE news_attachments");
    console.table(attachmentsColumns);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await db.close();
    process.exit(0);
  }
};

checkSchema();
