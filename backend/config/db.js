const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI;

    if (!connUri) {
      throw new Error('MONGODB_URI is required');
    }

    await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 5000,
      dbName: process.env.MONGODB_DB_NAME || undefined
    });
    console.log('🚀 Database: Connected to MongoDB.');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  }
};

module.exports = connectDB;
