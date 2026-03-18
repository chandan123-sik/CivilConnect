const express = require('express');
const router = express.Router();
const auth = require('../../../middleware/auth');
const checkRole = require('../../../middleware/checkRole');
const {
  createLead,
  getUserLeads,
  getProviderLeads,
  updateLeadStatus,
  getLeadById
} = require('../controllers/leadController');

router.post('/', auth, checkRole('user'), createLead);
router.get('/', auth, checkRole('user'), getUserLeads);
router.get('/provider', auth, checkRole('provider'), getProviderLeads);
router.patch('/:id/status', auth, updateLeadStatus);
router.get('/:id', auth, getLeadById);

module.exports = router;
