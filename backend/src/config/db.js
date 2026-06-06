const mongoose = require("mongoose");

const connectDB = async () => {
  global.isMongoConnected = false;
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/prepsmartdb";
    console.log(`Connecting to MongoDB at ${mongoUri}...`);
    
    // Set a short timeout of 3 seconds so server boot is fast in demo mode
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });

    global.isMongoConnected = true;
    console.log("MongoDB Connected Successfully!");
  } catch (error) {
    console.warn("\n==============================================================");
    console.warn("WARNING: MongoDB connection failed.");
    console.warn("PrepSmart AI is running in offline DEMO MODE with In-Memory store.");
    console.warn("You can use all features fully. Any data modifications will");
    console.warn("remain in server memory.");
    console.warn("==============================================================\n");
    global.isMongoConnected = false;
  }
};

module.exports = connectDB;