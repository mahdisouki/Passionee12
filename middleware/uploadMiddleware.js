const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../helper/cloudinaryConfig');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads',
    format: async (req, file) => {
      if (file.mimetype.startsWith('video')) {
        return file.mimetype.split('/')[1]; // Keeps the original video format
      } else {
        return 'jpg'; // Converts images to jpg
      }
    },
    resource_type: async (req, file) => {
      if (file.mimetype.startsWith('video')) {
        return 'video';
      } else {
        return 'image';
      }
    },
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image or video file!'), false);
  }
};

const upload = multer({ 
  storage: storage, 
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Middleware to handle file upload
const handleFileUpload = async (req, res, next) => {
  try {
    if (!req.files && !req.file) {
      return next();
    }

    // Handle multiple files
    if (req.files) {
      const uploadedFiles = req.files.map(file => ({
        ...file,
        url: file.path // Cloudinary provides the URL in the path property
      }));
      req.files = uploadedFiles;
    }

    // Handle single file
    if (req.file) {
      req.file.url = req.file.path; // Cloudinary provides the URL in the path property
    }

    next();
  } catch (error) {
    console.error('Error handling file upload:', error);
    res.status(500).json({ error: 'Error handling file upload' });
  }
};

// Middleware to handle file deletion
const handleFileDeletion = async (req, res, next) => {
  try {
    const { logo } = req.body;
    if (logo) {
      const publicId = logo.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }
    next();
  } catch (error) {
    console.error('Error deleting file:', error);
    next();
  }
};

module.exports = {
  upload,
  handleFileUpload,
  handleFileDeletion
}; 