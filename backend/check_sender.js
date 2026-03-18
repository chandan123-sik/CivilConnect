const mongoose = require('mongoose');
const User = require('./module/user/models/User');
const Provider = require('./module/serviceprovider/models/Provider');
require('dotenv').config();

async function checkIds() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const userId = '69b1930cf9d397e44798'; // from my previous check
        const user = await User.findById(userId);
        const provider = await Provider.findById(userId);
        console.log('User found:', !!user);
        if(user) console.log('User name:', user.fullName);
        console.log('Provider found:', !!provider);
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.connection.close();
    }
}
checkIds();
