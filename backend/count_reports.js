const mongoose = require('mongoose');
const Report = require('./module/admin/models/Report');
require('dotenv').config();

async function countReports() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const count = await Report.countDocuments();
        console.log('REAL_REPORT_COUNT:', count);
        const reports = await Report.find().lean();
        console.log('REPORTS_ALL:', JSON.stringify(reports));
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.connection.close();
    }
}
countReports();
