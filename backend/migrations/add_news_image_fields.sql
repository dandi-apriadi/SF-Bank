-- Add featured_image column to news_posts table
ALTER TABLE news_posts ADD COLUMN featured_image VARCHAR(255) NULL COMMENT 'Path to featured image';

-- Update news_attachments table with additional columns
ALTER TABLE news_attachments 
ADD COLUMN original_name VARCHAR(255) NOT NULL AFTER file_path,
ADD COLUMN file_type ENUM('image','document','video','other') DEFAULT 'other' AFTER file_size,
ADD COLUMN is_featured BOOLEAN DEFAULT FALSE AFTER file_type;
