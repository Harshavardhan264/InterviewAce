const mongoose = require('mongoose');
const { createModel } = require('./modelRegistry');

const ProblemSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  topic: { type: String, required: true },
  platform: { type: String, default: 'LeetCode' },
  problemLink: { type: String, default: '' },
  timeTaken: { type: Number, default: 0 }, // in minutes
  status: { type: String, enum: ['Not Started', 'Attempted', 'Solved', 'Revision Needed'], default: 'Not Started' },
  notes: { type: String, default: '' },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = createModel('Problem', ProblemSchema, 'interviewace_problems');
