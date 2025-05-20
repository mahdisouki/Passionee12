const multer = require('multer');
const { uploadFile, deleteObject } = require('../config/aws.config');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Middleware to handle file upload to S3
const handleFileUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }

    const file = req.file;
    const objectKey = `uploads/${Date.now()}-${file.originalname}`;
    
    // Upload to S3
    const uploadedKey = await uploadFile(file, objectKey);
    
    // Add the S3 key to the request body
    req.body.logo = uploadedKey;
    
    next();
  } catch (error) {
    res.status(500).json({ error: 'Error uploading file to S3' });
  }
};

// Middleware to handle file deletion from S3
const handleFileDeletion = async (req, res, next) => {
  try {
    const { logo } = req.body;
    if (logo) {
      await deleteObject(logo);
    }
    next();
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    next();
  }
};

module.exports = {
  upload,
  handleFileUpload,
  handleFileDeletion
}; 