import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Ensure upload directories exist
const uploadDir = './public/uploads';
const newsUploadDir = './public/uploads/news';
const evidenceUploadDir = './public/uploads/evidences';

[uploadDir, newsUploadDir, evidenceUploadDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure storage for news files
const newsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, newsUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Configure storage for evidences/documents
const evidenceStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, evidenceUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter for images
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (JPEG, JPG, PNG, GIF, WEBP)'));
  }
};

// File filter for documents
const documentFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|xls|xlsx|ppt|pptx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  
  if (extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only document files are allowed (PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX)'));
  }
};

// Combined filter for news (images and documents)
const newsFileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|pdf|doc|docx|xls|xlsx|ppt|pptx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  
  if (extname) {
    return cb(null, true);
  } else {
    cb(new Error('File type not allowed. Use images (JPEG, PNG, GIF, WEBP) or documents (PDF, DOC, XLS, PPT)'));
  }
};

// Multer configurations
export const uploadNewsImage = multer({
  storage: newsStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit for images
  }
});

export const uploadNewsFile = multer({
  storage: newsStorage,
  fileFilter: newsFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit for files
  }
});

// Evidence/document uploader (allow documents and images as supporting evidence)
export const uploadEvidenceFile = multer({
  storage: evidenceStorage,
  fileFilter: (req, file, cb) => {
    // Allow common document types and images
    const allowed = /jpeg|jpg|png|gif|webp|pdf|doc|docx|xls|xlsx|ppt|pptx/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    if (extname) return cb(null, true);
    cb(new Error('File type not allowed for evidence'));
  },
  limits: {
    fileSize: 20 * 1024 * 1024 // 20MB limit
  }
});

// Utility function to determine file type
export const getFileType = (mimetype) => {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.includes('pdf')) return 'document';
  if (mimetype.includes('video/')) return 'video';
  if (mimetype.includes('word') || mimetype.includes('spreadsheet') || mimetype.includes('presentation')) return 'document';
  return 'other';
};

// Utility function to delete file
export const deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    } else {
      resolve(true);
    }
  });
};

// Generate file URL
export const getFileUrl = (filePath) => {
  if (!filePath) return null;
  // Map any saved file under public/uploads to a web path
  const baseName = path.basename(filePath);
  if (filePath.includes('/uploads/news/')) return `/uploads/news/${baseName}`;
  if (filePath.includes('/uploads/evidences/')) return `/uploads/evidences/${baseName}`;
  return `/uploads/${baseName}`;
};
