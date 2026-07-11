const mongoose = require('mongoose');

let cachedPromise = null;

const connectDB = async () => {
  // 1. If connection is already open, reuse it instantly
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // 2. If connection is in progress (connecting), reuse the active connection promise to prevent duplicates
  if (mongoose.connection.readyState === 2 && cachedPromise) {
    return cachedPromise;
  }

  const connUri = process.env.MONGODB_URI;
  if (!connUri) {
    throw new Error('MONGODB_URI environment variable is required');
  }

  try {
    cachedPromise = mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 5000,
      dbName: process.env.MONGODB_DB_NAME || undefined
    });
    
    await cachedPromise;
    console.log('🚀 Database: Connected to MongoDB.');
    return mongoose.connection;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    cachedPromise = null; // Reset promise cache on error so subsequent requests can retry
    throw error;
  }
};

module.exports = connectDB;
