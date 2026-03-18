const mongoose = require('mongoose');
const { getAllReports } = require('./module/admin/controllers/adminController');
const Report = require('./module/admin/models/Report');
require('dotenv').config();

async function testFetch() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const req = {};
        const res = {
            status: function() { return this; },
            json: function(data) {
                console.log('RESPONSE:', JSON.stringify(data, null, 2));
            }
        };
        await getAllReports(req, res);
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.connection.close();
    }
}
testFetch();
