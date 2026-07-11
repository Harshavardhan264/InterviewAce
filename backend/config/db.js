const mongoose = require('mongoose');

let cachedConnection = null;

const connectDB = async () => {
  // If connection is already open, reuse it to prevent recreation in serverless executions
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  const connUri = process.env.MONGODB_URI;
  if (!connUri) {
    throw new Error('MONGODB_URI environment variable is required');
  }

  try {
    await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 5000,
      dbName: process.env.MONGODB_DB_NAME || undefined
    });
    console.log('🚀 Database: Connected to MongoDB.');
    return mongoose.connection;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  }
};

module.exports = connectDB;
