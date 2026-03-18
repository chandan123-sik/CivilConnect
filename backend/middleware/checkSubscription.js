const Provider = require('../module/serviceprovider/models/Provider');
const { errorRes } = require('../utils/apiResponse');

const checkSubscription = async (req, res, next) => {
    // If not a provider route or not a provider user, skip
    if (req.user.role !== 'provider') {
        return next();
    }

    try {
        const provider = await Provider.findById(req.user.id);
        if (!provider) return errorRes(res, 'Provider not found', 404);

        // Exclude specific routes that MUST be accessible even if expired
        // e.g., fetching profile, subscribing, etc.
        const openRoutes = [
            '/profile',
            '/subscribe',
            '/status'
        ];

        const isOpeningRoute = openRoutes.some(route => req.originalUrl.includes(route));
        if (isOpeningRoute) {
            return next();
        }

        const now = new Date();
        if (!provider.subscriptionExpiry || new Date(provider.subscriptionExpiry) < now) {
            return errorRes(res, 'Subscription Expired. Please renew your plan to continue.', 403);
        }

        next();
    } catch (err) {
        console.error("Subscription Check Error:", err);
        return errorRes(res, 'Server Error during subscription verification');
    }
};

module.exports = checkSubscription;
