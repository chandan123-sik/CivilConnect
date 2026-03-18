const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Centralize storage logic
const createStorage = (folder) => new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: `civilconnect/${folder}`,
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
  },
});

const upload = (folder = 'others') => multer({ storage: createStorage(folder) });

module.exports = {
  uploadProfile: upload('profiles'),
  uploadPortfolio: upload('portfolio'),
  uploadKYC: upload('kyc-docs'),
  uploadBanner: upload('banners'),
  uploadMaterial: upload('materials'),
};
