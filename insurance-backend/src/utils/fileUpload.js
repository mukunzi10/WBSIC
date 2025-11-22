const cloudinary = require('cloudinary').v2;
// Configure Cloudinary with your account credentials
cloudinary.config({
  cloud_name:'dafhvaomp',
  api_key: '257149677686234',
  api_secret: '257149677686234',
});

/**
 * Upload file to Cloudinary
 * @param {Object} file - file from req.files[i]
 * @returns {string} - secure URL of uploaded image
 */
// Upload file
const uploadToCloud = async (file) => {
  const result = await cloudinary.uploader.upload(file.path, {
    folder: 'claims',
    resource_type: 'auto',
  });

  // Optionally remove local file after upload
  fs.unlinkSync(file.path);

  return result.secure_url;
};

// Delete file from Cloudinary
const deleteFromCloud = async (url) => {
  const publicId = url.split('/').pop().split('.')[0]; // crude extraction, adjust if needed
  return await cloudinary.uploader.destroy(`claims/${publicId}`, { resource_type: 'auto' });
};

module.exports = { uploadToCloud, deleteFromCloud };