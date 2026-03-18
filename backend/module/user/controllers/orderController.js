const Order = require('../models/Order');
const Material = require('../../admin/models/Material');
const User = require('../models/User');
const { successRes, errorRes } = require('../../../utils/apiResponse');

const placeOrder = async (req, res) => {
  const { materialId, brand, quantity } = req.body;
  try {
    const [material, user] = await Promise.all([
      Material.findById(materialId),
      User.findById(req.user.id)
    ]);

    if (!material) return errorRes(res, 'Material not found', 404);
    if (!user) return errorRes(res, 'User not found', 404);

    const brandData = material.brands.find(b => b.name === brand);
    if (!brandData) return errorRes(res, 'Brand not found', 404);

    const order = await Order.create({
      userId: req.user.id,
      userName: user.fullName || 'Unknown User',
      userPhone: user.phone || 'N/A',
      userAddress: `${user.area || ''}, ${user.city || ''}`.trim() || 'Address N/A',
      materialId,
      materialName: material.name,
      brand: brand,
      unit: material.unit,
      quantity,
      totalPrice: brandData.price * quantity,
      status: 'pending'
    });
    return successRes(res, order, 'Order placed', 201);
  } catch (err) { 
    console.error("Place Order Error:", err);
    return errorRes(res, 'Error placing order'); 
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return successRes(res, orders);
  } catch (err) { return errorRes(res, 'Error'); }
};

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.id, status: 'pending' });
    if (!order) return errorRes(res, 'Unable to cancel', 400);
    order.status = 'rejected';
    await order.save();
    return successRes(res, order, 'Canceled');
  } catch (err) { return errorRes(res, 'Error'); }
};

module.exports = {
  placeOrder,
  getUserOrders,
  cancelOrder
};
