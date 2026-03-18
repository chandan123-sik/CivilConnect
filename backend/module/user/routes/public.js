const express = require('express');
const router = express.Router();
const {
  getCategories,
  getProviders,
  getProviderById,
  getMaterials,
  getBanners,
  getPlans,
  getPolicy,
  getHomeUnifiedData
} = require('../controllers/publicController');

router.get('/categories', getCategories);
router.get('/providers', getProviders);
router.get('/providers/:id', getProviderById);
router.get('/materials', getMaterials);
router.get('/banners', getBanners);
router.get('/plans', getPlans);
router.get('/policy', getPolicy);
router.get('/home-unified', getHomeUnifiedData);

module.exports = router;
