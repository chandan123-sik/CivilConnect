const Admin = require('../module/admin/models/Admin');
const Plan = require('../module/admin/models/Plan');
const bcrypt = require('bcryptjs');

const seedData = async () => {
  try {
    // 👑 1. Seed Admin
    const adminExists = await Admin.findOne({ username: 'Chandan' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('code4898', 12);
      await Admin.create({
        username: 'Chandan',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('✅ Admin seed: Chandan created successfully!');
    }

    // 📦 2. Seed Subscription Plans
    const plansCount = await Plan.countDocuments();
    if (plansCount === 0) {
      const standardPlans = [
        {
          name: 'Standard Monthly',
          price: 499,
          durationDays: 30,
          features: ['5 Leads/month', 'Basic Support', 'Verified Badge'],
          searchPriority: 'Low'
        },
        {
          name: 'Quarterly Pro',
          price: 1299,
          durationDays: 90,
          features: ['20 Leads/month', 'Priority Support', 'Verified Badge', 'Profile Boost'],
          searchPriority: 'Medium'
        },
        {
          name: 'Annual Elite',
          price: 4499,
          durationDays: 365,
          features: ['Unlimited Leads', '24/7 Support', 'Verified Badge', 'Top Search Result', 'Ads Free'],
          searchPriority: 'High'
        }
      ];
      await Plan.insertMany(standardPlans);
      console.log('✅ Plans seed: 3 Standard Plans created successfully!');
    }
  } catch (error) {
    console.error('❌ Seeding Error:', error.message);
  }
};

module.exports = seedData;
