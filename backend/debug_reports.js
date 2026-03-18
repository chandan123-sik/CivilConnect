const mongoose = require('mongoose');
const Report = require('./module/admin/models/Report');
require('dotenv').config();

async function checkReports() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const reports = await Report.find().lean();
        console.log('--- DB REPORTS BEGIN ---');
        console.log(JSON.stringify(reports, null, 2));
        console.log('--- DB REPORTS END ---');
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.connection.close();
    }
}
checkReports();
