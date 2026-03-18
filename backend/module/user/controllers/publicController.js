const Category = require('../../admin/models/Category');
const Provider = require('../../serviceprovider/models/Provider');
const Material = require('../../admin/models/Material');
const Banner = require('../../admin/models/Banner');
const Plan = require('../../admin/models/Plan');
const SystemSetting = require('../../admin/models/SystemSetting');
const { successRes, errorRes } = require('../../../utils/apiResponse');


const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ status: 'Active' });
    return successRes(res, categories);
  } catch (err) { return errorRes(res, 'Error'); }
};

const getProviders = async (req, res) => {
  const { categoryId, subCategory, city, isOnline } = req.query;
  const filter = { approvalStatus: 'approved' };
  if (categoryId) filter.category = categoryId;
  if (subCategory) filter.subCategory = subCategory;
  if (city) filter.city = city;
  if (isOnline === 'true') filter.isOnline = true;

  try {
    const providers = await Provider.find(filter).sort({ rating: -1 });
    return successRes(res, providers);
  } catch (err) { return errorRes(res, 'Error'); }
};

const getProviderById = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) return errorRes(res, 'Provider not found', 404);
    return successRes(res, provider);
  } catch (err) { return errorRes(res, 'Error'); }
};

const getMaterials = async (req, res) => {
  const { category, search } = req.query;
  const filter = { status: 'Active' };
  if (category && category !== 'All') filter.category = category;
  if (search) filter.name = { $regex: search, $options: 'i' };

  try {
    const materials = await Material.find(filter);
    return successRes(res, materials);
  } catch (err) { return errorRes(res, 'Error'); }
};

const getBanners = async (req, res) => {
  const { type } = req.query;
  const filter = { isActive: true };
  if (type) filter.type = type;
  try {
    const banners = await Banner.find(filter).sort({ order: 1 });
    return successRes(res, banners);
  } catch (err) {
    console.error("GET Banners Error:", err);
    return errorRes(res, 'Error fetching banners');
  }
};

const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true });
    return successRes(res, plans);
  } catch (err) { return errorRes(res, 'Error'); }
};

const getPolicy = async (req, res) => {
  try {
    const setting = await SystemSetting.findOne({ key: 'dynamic_cms' });
    if (!setting || !setting.value || !setting.value.policyPoints) {
      return successRes(res, []);
    }
    return successRes(res, setting.value.policyPoints);
  } catch (err) { 
    console.error("GET Policy Error:", err);
    return errorRes(res, 'Policy Fetch Error'); 
  }
};
const getHomeUnifiedData = async (req, res) => {
  try {
    const [banners, categories, providers, materials] = await Promise.all([
      Banner.find({ isActive: true, type: 'home' }).sort({ order: 1 }).lean(),
      Category.find({ status: 'Active' }).lean(),
      Provider.find({ approvalStatus: 'approved' }).sort({ rating: -1 }).limit(5).lean(),
      Material.find({ status: 'Active' }).limit(4).lean(),
    ]);

    return successRes(res, {
      banners,
      categories,
      providers,
      materials
    });
  } catch (err) {
    console.error("Home Unified Data Error:", err);
    return errorRes(res, 'Error fetching home data');
  }
};

module.exports = {
  getCategories,
  getProviders,
  getProviderById,
  getMaterials,
  getBanners,
  getPlans,
  getPolicy,
  getHomeUnifiedData
};
