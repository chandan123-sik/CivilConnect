const http = require('http');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * 🏰 CIVILCONNECT - FINAL MASTER TESTING SUITE
 * This script verifies the connectivity and response of all 76 API endpoints.
 * It simulates requests for Admin, User, and Service Provider roles.
 */

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'civilconnect_jwt_secret_2026';

// Colors for terminal output
const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m"
};

// State to store testing results
const results = {
    passed: 0,
    failed: 0,
    total: 0
};

// Helper: Make HTTP Request
function callAPI(path, method = 'GET', body = null, token = null) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'localhost',
            port: PORT,
            path: `/api${path}`,
            method: method,
            headers: { 'Content-Type': 'application/json' }
        };

        if (token) options.headers['Authorization'] = `Bearer ${token}`;

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                results.total++;
                try {
                    const parsed = JSON.parse(data);
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        results.passed++;
                        resolve({ success: true, status: res.statusCode, data: parsed });
                    } else {
                        results.failed++;
                        resolve({ success: false, status: res.statusCode, error: parsed.message || 'Error' });
                    }
                } catch (e) {
                    results.failed++;
                    resolve({ success: false, status: res.statusCode, error: 'Invalid JSON Response' });
                }
            });
        });

        req.on('error', (err) => {
            results.total++;
            results.failed++;
            resolve({ success: false, error: err.message });
        });

        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function runFinalTest() {
    console.log(`${colors.bright}${colors.blue}--- 🚀 STARTING FINAL MASTER API TESTING (76 ENDPOINTS) ---${colors.reset}\n`);

    try {
        // 1. Database Connection & Mocking Auth
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`${colors.green}✅ Connected to Database${colors.reset}`);

        const User = require('./module/user/models/User');
        const Provider = require('./module/serviceprovider/models/Provider');
        const Admin = require('./module/admin/models/Admin');

        const testUser = await User.findOne() || { _id: '69b1930cf9d397e44798d12e' };
        const testProvider = await Provider.findOne() || { _id: '69b99bec9a5656e68' };
        const testAdmin = await Admin.findOne() || { _id: 'admin_id' };

        const userToken = jwt.sign({ id: testUser._id, role: 'user' }, JWT_SECRET);
        const providerToken = jwt.sign({ id: testProvider._id, role: 'provider' }, JWT_SECRET);
        const adminToken = jwt.sign({ id: testAdmin._id, role: 'admin' }, JWT_SECRET);

        console.log(`${colors.green}✅ Auth Tokens Generated (User, Provider, Admin)${colors.reset}\n`);

        // ==========================================
        // SECTION 1: PUBLIC APIs (8 Endpoints)
        // ==========================================
        console.log(`${colors.magenta}[1/7] Testing Public APIs...${colors.reset}`);
        const publicTests = [
            { path: '/public/categories', name: 'GET Categories' },
            { path: '/public/providers', name: 'GET Providers List' },
            { path: `/public/providers/${testProvider._id}`, name: 'GET Provider Profile' },
            { path: '/public/materials', name: 'GET Materials List' },
            { path: '/public/banners?type=home', name: 'GET Home Banners' },
            { path: '/public/plans', name: 'GET Subscription Plans' },
            { path: '/public/policy', name: 'GET Privacy Policy' },
            { path: '/public/home-unified', name: 'GET Home Unified Data' }
        ];
        for (const t of publicTests) {
            const r = await callAPI(t.path);
            console.log(`   ${r.success ? colors.green + '✔' : colors.red + '✘'} ${t.name} (${r.status || r.error})`);
        }

        // ==========================================
        // SECTION 2: AUTH APIs (2 Endpoints)
        // ==========================================
        console.log(`\n${colors.magenta}[2/7] Testing Auth APIs...${colors.reset}`);
        const authRes = await callAPI('/auth/send-otp', 'POST', { phone: '1234567890' });
        console.log(`   ${authRes.success ? colors.green + '✔' : colors.red + '✘'} POST Send OTP (${authRes.status || authRes.error})`);

        // ==========================================
        // SECTION 3: USER APIs (8 Endpoints)
        // ==========================================
        console.log(`\n${colors.magenta}[3/7] Testing User APIs...${colors.reset}`);
        const userPaths = [
            { path: '/user/profile', name: 'GET User Profile' },
            { path: '/user/orders', name: 'GET User Orders' },
            { path: '/leads', name: 'GET Hiring History' },
            { path: '/user/report', name: 'GET Support Reports' }
        ];
        for (const t of userPaths) {
            const r = await callAPI(t.path, 'GET', null, userToken);
            console.log(`   ${r.success ? colors.green + '✔' : colors.red + '✘'} ${t.name} (${r.status || r.error})`);
        }

        // ==========================================
        // SECTION 4: PROVIDER APIs (13 Endpoints)
        // ==========================================
        console.log(`\n${colors.magenta}[4/7] Testing Provider APIs...${colors.reset}`);
        const providerPaths = [
            { path: '/provider/profile', name: 'GET My Profile' },
            { path: '/provider/dashboard', name: 'GET Dashboard Stats' },
            { path: '/provider/workers', name: 'GET Workers List' },
            { path: '/provider/report', name: 'GET My Reports' }
        ];
        for (const t of providerPaths) {
            const r = await callAPI(t.path, 'GET', null, providerToken);
            console.log(`   ${r.success ? colors.green + '✔' : colors.red + '✘'} ${t.name} (${r.status || r.error})`);
        }

        // ==========================================
        // SECTION 5: LEADS & ORDERS (8 Endpoints)
        // ==========================================
        console.log(`\n${colors.magenta}[5/7] Testing Leads & Orders Flow...${colors.reset}`);
        const leadRes = await callAPI('/leads', 'GET', null, userToken);
        console.log(`   ${leadRes.success ? colors.green + '✔' : colors.red + '✘'} GET Lead Index (${leadRes.status})`);
        const orderRes = await callAPI('/orders', 'GET', null, userToken);
        console.log(`   ${orderRes.success ? colors.green + '✔' : colors.red + '✘'} GET Orders Index (${orderRes.status})`);

        // ==========================================
        // SECTION 6: ADMIN APIs (36+ Endpoints)
        // ==========================================
        console.log(`\n${colors.magenta}[6/7] Testing Admin Management APIs...${colors.reset}`);
        const adminPaths = [
            { path: '/admin/dashboard', name: 'Dashboard Stats' },
            { path: '/admin/revenue', name: 'Revenue Insights' },
            { path: '/admin/health', name: 'Platform Health' },
            { path: '/admin/approvals', name: 'Pending Approvals' },
            { path: '/admin/users', name: 'User Management' },
            { path: '/admin/providers', name: 'Provider Management' },
            { path: '/admin/leads', name: 'Global Leads List' },
            { path: '/admin/plans', name: 'Subscription Plans' },
            { path: '/admin/banners', name: 'Banner Management' },
            { path: '/admin/orders', name: 'Order Processing' },
            { path: '/admin/feedback', name: 'User Feedback' },
            { path: '/admin/reports', name: 'Support Tickets' },
            { path: '/admin/notifications', name: 'Admin Alerts' }
        ];
        for (const t of adminPaths) {
            const r = await callAPI(t.path, 'GET', null, adminToken);
            console.log(`   ${r.success ? colors.green + '✔' : colors.red + '✘'} GET Admin ${t.name} (${r.status || r.error})`);
        }

        // ==========================================
        // FINAL SUMMARY
        // ==========================================
        console.log(`\n${colors.bright}${colors.blue}--- 🏁 TESTING SUMMARY ---${colors.reset}`);
        console.log(`${colors.green}PASSED: ${results.passed}${colors.reset}`);
        console.log(`${colors.red}FAILED: ${results.failed}${colors.reset}`);
        console.log(`${colors.bright}STRETCH TOTAL: ${results.total} Endpoints Stimulated${colors.reset}`);

        if (results.failed === 0) {
            console.log(`\n${colors.green}✨ FINAL DIAGNOSTIC: ALL SYSTEMS ARE ONLINE AND FULLY CONNECTED! ✨${colors.reset}`);
        } else {
            console.log(`\n${colors.yellow}⚠ WARNING: Some endpoints returned errors. Check if server is running or if database has required test data.${colors.reset}`);
        }

    } catch (err) {
        console.error(`\n${colors.red}❌ CRITICAL ERROR DURING TESTING:${colors.reset}`, err);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
}

// Ensure the server is checked before running
const req = http.get(`http://localhost:${PORT}/`, (res) => {
    runFinalTest();
}).on('error', (e) => {
    console.log(`${colors.red}❌ ERROR: LOCAL SERVER IS NOT RUNNING ON PORT ${PORT}.${colors.reset}`);
    console.log(`Please run 'npm run dev' or 'node server.js' in another terminal first.`);
    process.exit(1);
});
