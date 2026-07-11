const mongoose = require('mongoose');
const { createModel } = require('./modelRegistry');

const TopicSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  topicName: { type: String, required: true },
  category: { type: String, enum: ['DSA', 'Core CS'], required: true },
  totalProblems: { type: Number, default: 0 },
  solvedProblems: { type: Number, default: 0 },
  easySolved: { type: Number, default: 0 },
  mediumSolved: { type: Number, default: 0 },
  hardSolved: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 }, // 0 to 100
  completionPercentage: { type: Number, default: 0 }, // 0 to 100
  lastPracticed: { type: Date, default: null }
});

module.exports = createModel('Topic', TopicSchema, 'interviewace_topics');
