const mongoose = require('mongoose');
const { createModel } = require('./modelRegistry');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  streak: { type: Number, default: 0 },
  readinessScore: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = createModel('User', UserSchema, 'interviewace_users');
