const AWS = require('aws-sdk');

// AWS Configuration
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

/**
 * Generate a presigned URL for accessing an S3 object
 * @param {string} objectKey - The key of the object in S3
 * @returns {string} The presigned URL
 */
function generatePresignedUrl(objectKey) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: objectKey,
    Expires: 600 // URL expires in 10 minutes
  };

  return s3.getSignedUrl('getObject', params);
}

/**
 * Delete an object from S3
 * @param {string} objectKey - The key of the object to delete
 * @returns {Promise} Promise that resolves when the object is deleted
 */
function deleteObject(objectKey) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: objectKey
  };

  return s3.deleteObject(params).promise();
}

/**
 * Upload a file to S3
 * @param {Object} file - The file object containing buffer and mimetype
 * @param {string} objectKey - The key to store the file under in S3
 * @returns {Promise<string>} Promise that resolves with the object key
 */
const uploadFile = (file, objectKey) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: objectKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(objectKey);
      }
    });
  });
};

module.exports = { generatePresignedUrl, deleteObject, uploadFile }; 