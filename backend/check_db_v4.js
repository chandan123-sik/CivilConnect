const mongoose = require('mongoose');
const Report = require('./module/admin/models/Report');
require('dotenv').config();

async function checkReports() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const reports = await Report.find().sort({createdAt: -1}).limit(5).lean();
        console.log('--- DETAILED REPORTS ---');
        reports.forEach(r => {
            console.log(`ID: ${r._id}`);
            console.log(`SenderID: ${r.senderId}`);
            console.log(`Model: ${r.senderModel}`);
            console.log(`Msg: ${r.message}`);
            console.log('---');
        });
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.connection.close();
    }
}
checkReports();
