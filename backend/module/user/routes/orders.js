const express = require('express');
const router = express.Router();
const auth = require('../../../middleware/auth');
const checkRole = require('../../../middleware/checkRole');
const {
  placeOrder,
  getUserOrders,
  cancelOrder
} = require('../controllers/orderController');

router.post('/', auth, checkRole('user'), placeOrder);
router.get('/', auth, checkRole('user'), getUserOrders);
router.patch('/:id/cancel', auth, checkRole('user'), cancelOrder);

module.exports = router;
