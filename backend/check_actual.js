const mongoose = require('mongoose');
const Report = require('./module/admin/models/Report');
require('dotenv').config();

async function checkActual() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const count = await Report.countDocuments();
        console.log('COUNT:', count);
        const last = await Report.find().sort({createdAt: -1}).limit(1);
        console.log('LAST REPORT:', JSON.stringify(last, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.connection.close();
    }
}
checkActual();
