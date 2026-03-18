const mongoose = require('mongoose');
const Report = require('./module/admin/models/Report');
require('dotenv').config();

async function checkReports() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const reports = await Report.find().sort({createdAt: -1}).limit(5);
        console.log('--- LAST 5 REPORTS ---');
        reports.forEach(r => {
            console.log(`ID: ${r._id} | Model: ${r.senderModel} | Msg: ${r.message.substring(0, 30)}...`);
        });
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.connection.close();
    }
}
checkReports();
