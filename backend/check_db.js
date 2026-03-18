const mongoose = require('mongoose');
const Report = require('./module/admin/models/Report');
require('dotenv').config();

async function checkReports() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const count = await Report.countDocuments();
        const all = await Report.find();
        console.log('Total Reports in DB:', count);
        console.log('Reports:', JSON.stringify(all, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.connection.close();
    }
}
checkReports();
