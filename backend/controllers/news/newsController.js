import { NewsPost, NewsAttachment, User } from '../../models/index.js';
import { createCrudController, asyncHandler } from '../shared/crudFactory.js';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import { getFileType, deleteFile, getFileUrl } from '../../utils/fileUpload.js';

// Custom news controller with author handling
const newsPostController = {
  // Get all news posts with author information
  list: asyncHandler(async (req, res) => {
    const { limit = 25, offset = 0, q } = req.query;
    const where = {};
    
    if (q) {
      where[Op.or] = [
        { title: { [Op.like]: `%${q}%` } },
        { slug: { [Op.like]: `%${q}%` } }
      ];
    }

    const newsItems = await NewsPost.findAndCountAll({
      where,
      include: [
        {
          model: User,
          attributes: ['user_id', 'fullname', 'email'],
          foreignKey: 'author_user_id'
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      data: newsItems.rows,
      totalCount: newsItems.count,
      currentPage: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(newsItems.count / limit)
    });
  }),

  // Get single news post
  get: asyncHandler(async (req, res) => {
    const newsItem = await NewsPost.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['user_id', 'fullname', 'email'],
          foreignKey: 'author_user_id'
        },
        {
          model: NewsAttachment,
          foreignKey: 'news_id'
        }
      ]
    });

    if (!newsItem) {
      return res.status(404).json({ msg: 'Berita tidak ditemukan' });
    }

    res.json(newsItem);
  }),

  // Create new news post
  create: asyncHandler(async (req, res) => {
    const { title, slug, content, status = 'draft' } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ msg: 'Judul dan konten harus diisi' });
    }

    // Auto-generate slug if not provided
    const finalSlug = slug || title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check slug uniqueness
    const existingNews = await NewsPost.findOne({ where: { slug: finalSlug } });
    if (existingNews) {
      return res.status(400).json({ msg: 'Slug sudah digunakan, gunakan slug yang berbeda' });
    }

    // Handle featured image from uploaded file
    let featuredImage = null;
    if (req.file && getFileType(req.file.mimetype) === 'image') {
      featuredImage = getFileUrl(req.file.filename);
    }

    const newsItem = await NewsPost.create({
      news_id: uuidv4(),
      title,
      slug: finalSlug,
      content,
      featured_image: featuredImage,
      status,
      author_user_id: req.session.user_id,
      published_at: status === 'published' ? new Date() : null
    });

    // Create attachment record if file was uploaded
    if (req.file) {
      await NewsAttachment.create({
        news_attachment_id: uuidv4(),
        news_id: newsItem.news_id,
        file_path: req.file.path,
        original_name: req.file.originalname,
        mime_type: req.file.mimetype,
        file_size: req.file.size,
        file_type: getFileType(req.file.mimetype),
        is_featured: getFileType(req.file.mimetype) === 'image'
      });
    }

    res.status(201).json(newsItem);
  }),

  // Update news post
  update: asyncHandler(async (req, res) => {
    const { title, slug, content, status } = req.body;
    
    const newsItem = await NewsPost.findByPk(req.params.id);
    if (!newsItem) {
      return res.status(404).json({ msg: 'Berita tidak ditemukan' });
    }

    // Check slug uniqueness if slug is being changed
    if (slug && slug !== newsItem.slug) {
      const existingNews = await NewsPost.findOne({ 
        where: { 
          slug, 
          news_id: { [Op.ne]: req.params.id } 
        } 
      });
      if (existingNews) {
        return res.status(400).json({ msg: 'Slug sudah digunakan, gunakan slug yang berbeda' });
      }
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (slug) updateData.slug = slug;
    if (content) updateData.content = content;
    if (status) {
      updateData.status = status;
      if (status === 'published' && !newsItem.published_at) {
        updateData.published_at = new Date();
      }
    }

    // Handle new featured image upload
    if (req.file && getFileType(req.file.mimetype) === 'image') {
      // Delete old featured image file if exists
      if (newsItem.featured_image) {
        const oldImagePath = `./public${newsItem.featured_image}`;
        await deleteFile(oldImagePath).catch(console.error);
      }
      
      updateData.featured_image = getFileUrl(req.file.filename);

      // Create new attachment record
      await NewsAttachment.create({
        news_attachment_id: uuidv4(),
        news_id: newsItem.news_id,
        file_path: req.file.path,
        original_name: req.file.originalname,
        mime_type: req.file.mimetype,
        file_size: req.file.size,
        file_type: getFileType(req.file.mimetype),
        is_featured: true
      });
    }

    await newsItem.update(updateData);
    res.json(newsItem);
  }),

  // Delete news post
  delete: asyncHandler(async (req, res) => {
    const newsItem = await NewsPost.findByPk(req.params.id);
    if (!newsItem) {
      return res.status(404).json({ msg: 'Berita tidak ditemukan' });
    }

    // Delete featured image file if exists
    if (newsItem.featured_image) {
      const imagePath = `./public${newsItem.featured_image}`;
      await deleteFile(imagePath).catch(console.error);
    }

    // Get and delete all attachment files
    const attachments = await NewsAttachment.findAll({ where: { news_id: req.params.id } });
    for (const attachment of attachments) {
      await deleteFile(attachment.file_path).catch(console.error);
    }

    // Delete associated attachments records
    await NewsAttachment.destroy({ where: { news_id: req.params.id } });
    
    await newsItem.destroy();
    res.json({ msg: 'Berita berhasil dihapus' });
  })
};

export { newsPostController };

// Keep the existing attachment controller from crud factory
export const newsAttachmentController = createCrudController(NewsAttachment);

// Upload file endpoint
export const uploadNewsFileHandler = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ msg: 'Tidak ada file yang diupload' });
  }

  const attachment = await NewsAttachment.create({
    news_attachment_id: uuidv4(),
    news_id: req.body.news_id || null,
    file_path: req.file.path,
    original_name: req.file.originalname,
    mime_type: req.file.mimetype,
    file_size: req.file.size,
    file_type: getFileType(req.file.mimetype),
    is_featured: false
  });

  res.json({
    attachment,
    url: getFileUrl(req.file.filename)
  });
});

// Delete attachment endpoint
export const deleteNewsAttachment = asyncHandler(async (req, res) => {
  const attachment = await NewsAttachment.findByPk(req.params.id);
  if (!attachment) {
    return res.status(404).json({ msg: 'Lampiran tidak ditemukan' });
  }

  // Delete file from filesystem
  await deleteFile(attachment.file_path).catch(console.error);
  
  await attachment.destroy();
  res.json({ msg: 'Lampiran berhasil dihapus' });
});

export const publishNews = asyncHandler(async (req, res) => {
  const row = await NewsPost.findByPk(req.params.id);
  if (!row) return res.status(404).json({ msg: 'Berita tidak ditemukan' });
  
  await row.update({ 
    status: 'published', 
    published_at: new Date() 
  });
  
  res.json(row);
});
