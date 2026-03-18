const mongoose = require('mongoose');
require('dotenv').config();
const Report = require('./module/admin/models/Report');
const User = require('./module/user/models/User'); // Required for population
const Provider = require('./module/serviceprovider/models/Provider'); // Required for population

async function testFlow() {
  try {
    console.log("--- STARTING REPORT SYSTEM TEST ---");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB.");

    // 1. CLEAR PREVIOUS (Safety)
    await Report.deleteMany({});
    console.log("Database cleared.");

    // 2. SIMULATE USER SENDING REPORT (POST)
    // We'll use the ID we found
    const userId = "69b1930cf9d397e44798d12e";
    const reportMessage = "Test issue from verification script";
    
    const newReport = await Report.create({
      senderId: userId,
      senderModel: 'User',
      message: reportMessage
    });
    console.log("STEP 1: User sent report. ID:", newReport._id);

    // 3. SIMULATE ADMIN FETCHING ALL REPORTS (GET)
    const allReports = await Report.find().populate('senderId');
    if (allReports.length > 0) {
      console.log("STEP 2: Admin fetched reports. Count:", allReports.length);
    } else {
      throw new Error("Admin fetch failed: No reports found");
    }

    // 4. SIMULATE ADMIN REPLYING (PATCH)
    const reportToReply = allReports[0];
    const replyMessage = "We are looking into it. Your issue is noted.";
    
    const updatedReport = await Report.findByIdAndUpdate(reportToReply._id, {
      reply: replyMessage,
      status: 'Resolved'
    }, { new: true });
    
    console.log("STEP 3: Admin replied. Status:", updatedReport.status, "Reply:", updatedReport.reply);

    // 5. SIMULATE USER SEEING REPLY (GET)
    const userReports = await Report.find({ senderId: userId });
    const hasReply = userReports.some(r => r.reply === replyMessage);
    if (hasReply) {
      console.log("STEP 4: User saw the reply correctly.");
    } else {
      throw new Error("User GET failed: Reply not found in reports");
    }

    // 6. SIMULATE ADMIN DELETING REPORT (DELETE)
    await Report.findByIdAndDelete(updatedReport._id);
    const finalCount = await Report.countDocuments({});
    if (finalCount === 0) {
      console.log("STEP 5: Admin deleted report successfully.");
    } else {
      throw new Error("Admin DELETE failed: Report still exists");
    }

    console.log("--- ALL TESTS PASSED SUCCESSFULLY! ---");
  } catch (err) {
    console.error("!!! TEST FAILED !!!", err);
  } finally {
    await mongoose.connection.close();
  }
}

testFlow();
