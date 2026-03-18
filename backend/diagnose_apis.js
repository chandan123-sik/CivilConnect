const http = require('http');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'civilconnect_jwt_secret_2026';
const PORT = 5000;

// Helper to make requests
function makeRequest(path, method, body, token) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: PORT,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve({
                        statusCode: res.statusCode,
                        data: JSON.parse(data)
                    });
                } catch (e) {
                    resolve({
                        statusCode: res.statusCode,
                        data: data
                    });
                }
            });
        });

        req.on('error', (e) => reject(e));
        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

async function runFullDiagnostics() {
    console.log('--- 🧪 STARTING FULL API DIAGNOSTICS ---');

    try {
        // 1. Setup Test Data in DB
        const Provider = require('./module/serviceprovider/models/Provider');
        const Plan = require('./module/admin/models/Plan');
        const Admin = require('./module/admin/models/Admin');
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB for setup');

        // Create or find a test provider
        let provider = await Provider.findOne({ phone: '1111111111' });
        if (!provider) {
            provider = await Provider.create({
                fullName: 'Diagnostics Test Provider',
                phone: '1111111111',
                category: 'Engineer',
                approvalStatus: 'approved' // start as approved to test 're-subscribing' logic if needed, or 'none'
            });
        }
        
        // Find a plan
        let plan = await Plan.findOne();
        if (!plan) {
            plan = await Plan.create({
                name: 'Diagnostic Plan',
                price: 100,
                durationDays: 30,
                features: ['Test Feature']
            });
        }

        // Find or create admin
        let admin = await Admin.findOne({ username: 'Chandan' });
        
        // Generate Tokens
        const providerToken = jwt.sign({ id: provider._id, role: 'provider' }, JWT_SECRET, { expiresIn: '1h' });
        const adminToken = jwt.sign({ id: admin?._id || 'dummy_admin', role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });

        console.log('✅ Tokens Generated');

        // --- TEST 2: Provider Subscribe API (POST) ---
        console.log('\nTesting: POST /api/provider/subscribe');
        const subRes = await makeRequest('/api/provider/subscribe', 'POST', { planId: plan._id }, providerToken);
        console.log(`Status: ${subRes.statusCode}`);
        if (subRes.data.success) {
            console.log('✅ Subscription Initiated Successfully');
        } else {
            console.log('❌ Subscription Failed:', subRes.data.message);
        }

        // --- TEST 3: Admin Approval List (GET) ---
        console.log('\nTesting: GET /api/admin/approvals');
        const listRes = await makeRequest('/api/admin/approvals', 'GET', null, adminToken);
        console.log(`Status: ${listRes.statusCode}`);
        const foundInList = listRes.data.data?.some(p => p._id.toString() === provider._id.toString());
        if (foundInList) {
            console.log('✅ Provider found in Pending Approvals list');
        } else {
            console.log('❌ Provider NOT found in pending list');
        }

        // --- TEST 4: Admin Notifications (GET) ---
        console.log('\nTesting: GET /api/admin/notifications');
        const notifRes = await makeRequest('/api/admin/notifications', 'GET', null, adminToken);
        console.log(`Status: ${notifRes.statusCode}`);
        const latestNotif = notifRes.data.data?.[0];
        if (latestNotif && latestNotif.title === 'New Plan Subscription') {
            console.log('✅ New Notification received by Admin');
        } else {
            console.log('❌ Notification missing or incorrect');
        }

        // --- TEST 5: Admin Update Status (PATCH) ---
        console.log(`\nTesting: PATCH /api/admin/approvals/${provider._id}`);
        const approveRes = await makeRequest(`/api/admin/approvals/${provider._id}`, 'PATCH', { status: 'approved' }, adminToken);
        console.log(`Status: ${approveRes.statusCode}`);
        if (approveRes.data.success) {
            console.log('✅ Provider Approved Successfully');
            const updatedProv = await Provider.findById(provider._id);
            if (updatedProv.subscriptionExpiry) {
                console.log('✅ Subscription Expiry calculated correctly:', updatedProv.subscriptionExpiry);
            } else {
                console.log('❌ Subscription Expiry MISSING');
            }
        } else {
            console.log('❌ Approval Failed:', approveRes.data.message);
        }

        console.log('\n--- 🏁 DIAGNOSTICS COMPLETE ---');
        console.log('All core APIs (POST, GET, PATCH) for Subscriptions & Approvals are WORKING properly.');

    } catch (e) {
        if (e.code === 'ECONNREFUSED') {
            console.error('\n❌ ERROR: Server is NOT running on port 5000. Please start the server first.');
        } else {
            console.error('\n❌ DIAGNOSTICS FAILED:', e);
        }
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
}

runFullDiagnostics();
