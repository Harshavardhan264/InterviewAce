const mongoose = require('mongoose');
const { createModel } = require('./modelRegistry');

const MockTestQuestionSchema = new mongoose.Schema({
  type: { type: String, enum: ['Coding', 'MCQ', 'Core CS', 'Aptitude'], required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  options: [{ type: String }], // For MCQs/Aptitude
  correctAnswer: { type: String, default: '' },
  userAnswer: { type: String, default: '' },
  points: { type: Number, default: 10 }
});

const MockTestSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  company: { type: String, required: true },
  difficulty: { type: String, required: true },
  duration: { type: Number, required: true }, // in minutes
  questions: [MockTestQuestionSchema],
  score: { type: Number, default: 0 },
  totalPoints: { type: Number, default: 0 },
  weakAreas: [{ type: String }],
  suggestions: [{ type: String }],
  completed: { type: Boolean, default: false },
  completedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = createModel('MockTest', MockTestSchema, 'interviewace_mocktests');
