const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const crypto = require('crypto');

// Ensure upload directories exist
const createUploadDir = (dir) => {
  const uploadDir = path.join(__dirname, '../../uploads', dir);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  return uploadDir;
};

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadDir = 'uploads';
    
    // Determine subfolder based on file type or route
    if (file.fieldname === 'avatar') {
      uploadDir = createUploadDir('avatars');
    } else if (file.fieldname === 'logo') {
      uploadDir = createUploadDir('logos');
    } else if (file.fieldname === 'product') {
      uploadDir = createUploadDir('products');
    } else if (file.fieldname === 'banner') {
      uploadDir = createUploadDir('banners');
    } else if (file.fieldname.match(/image/i)) {
      uploadDir = createUploadDir('images');
    } else if (file.fieldname.match(/document/i)) {
      uploadDir = createUploadDir('documents');
    } else {
      uploadDir = createUploadDir('misc');
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(6).toString('hex');
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/[^a-z0-9]/gi, '-').toLowerCase();
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Define allowed file types
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  const allowedDocumentTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
  const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];

  // Check if file type is allowed
  if (file.fieldname === 'avatar' || file.fieldname === 'logo' || file.fieldname === 'product' || file.fieldname === 'banner' || file.fieldname.match(/image/i)) {
    if (allowedImageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'), false);
    }
  } else if (file.fieldname.match(/document/i)) {
    if (allowedDocumentTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only documents are allowed.'), false);
    }
  } else if (file.fieldname.match(/video/i)) {
    if (allowedVideoTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only videos are allowed.'), false);
    }
  } else {
    // For other fields, allow images and documents
    if (allowedImageTypes.includes(file.mimetype) || allowedDocumentTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type.'), false);
    }
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
    files: 10 // Max 10 files per request
  }
});

// Error handler for multer
exports.handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 10MB.'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum is 10 files.'
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  next();
};

// Process image with Sharp
exports.processImage = async (req, res, next) => {
  if (!req.file && !req.files) return next();

  try {
    const processFile = async (file) => {
      const filePath = file.path;
      const parsedPath = path.parse(filePath);
      const optimizedPath = path.join(parsedPath.dir, `optimized-${parsedPath.base}`);

      // Optimize image
      await sharp(filePath)
        .resize(1200, 1200, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ quality: 80, progressive: true })
        .toFile(optimizedPath);

      // Replace original with optimized
      fs.unlinkSync(filePath);
      fs.renameSync(optimizedPath, filePath);

      // Create thumbnail
      const thumbPath = path.join(parsedPath.dir, `thumb-${parsedPath.base}`);
      await sharp(filePath)
        .resize(300, 300, {
          fit: 'cover',
          position: 'centre'
        })
        .jpeg({ quality: 70 })
        .toFile(thumbPath);

      // Add thumbnail path to file object
      file.thumbnail = `/uploads/${path.relative('uploads', thumbPath)}`;
    };

    if (req.file) {
      await processFile(req.file);
    } else if (req.files) {
      const files = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
      await Promise.all(files.map(processFile));
    }

    next();

  } catch (error) {
    console.error('Image processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing image'
    });
  }
};

// Clean up old files
exports.cleanupOldFiles = async (req, res, next) => {
  // This would typically run as a cron job
  const cleanup = async () => {
    const uploadsDir = path.join(__dirname, '../../uploads');
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    const cleanDir = (dir) => {
      if (!fs.existsSync(dir)) return;

      const files = fs.readdirSync(dir);
      const now = Date.now();

      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isFile() && (now - stat.mtimeMs) > maxAge) {
          fs.unlinkSync(filePath);
        }
      });
    };

    // Clean temporary uploads
    const tempDirs = ['temp', 'misc'];
    tempDirs.forEach(dir => cleanDir(path.join(uploadsDir, dir)));
  };

  // Run cleanup asynchronously
  cleanup().catch(console.error);
  next();
};

// Validate file count
exports.validateFileCount = (maxFiles = 10) => {
  return (req, res, next) => {
    const files = req.files;
    if (files) {
      const totalFiles = Array.isArray(files) ? files.length : Object.keys(files).length;
      if (totalFiles > maxFiles) {
        return res.status(400).json({
          success: false,
          message: `Too many files. Maximum is ${maxFiles}.`
        });
      }
    }
    next();
  };
};

// Single file upload middleware
exports.uploadSingle = (fieldName) => {
  return [
    upload.single(fieldName),
    exports.handleMulterError,
    exports.processImage
  ];
};

// Multiple files upload middleware
exports.uploadMultiple = (fieldName, maxCount = 10) => {
  return [
    upload.array(fieldName, maxCount),
    exports.handleMulterError,
    exports.validateFileCount(maxCount),
    exports.processImage
  ];
};

// Fields upload middleware
exports.uploadFields = (fields) => {
  return [
    upload.fields(fields),
    exports.handleMulterError,
    exports.processImage
  ];
};

module.exports = {
  upload,
  handleMulterError: exports.handleMulterError,
  processImage: exports.processImage,
  cleanupOldFiles: exports.cleanupOldFiles,
  validateFileCount: exports.validateFileCount,
  uploadSingle: exports.uploadSingle,
  uploadMultiple: exports.uploadMultiple,
  uploadFields: exports.uploadFields
};