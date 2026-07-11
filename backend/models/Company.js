const mongoose = require('mongoose');
const { createModel } = require('./modelRegistry');

const QuestionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  description: { type: String, default: '' }
});

const ExperienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, default: 'Anonymous' },
  content: { type: String, required: true },
  date: { type: String, default: '' }
});

const CompanySchema = new mongoose.Schema({
  companyName: { type: String, required: true, unique: true },
  topics: [{ type: String }],
  interviewQuestions: [QuestionSchema],
  interviewExperiences: [ExperienceSchema],
  difficultyLevel: { type: String, default: 'Medium' },
  preparationTips: [{ type: String }]
});

module.exports = createModel('Company', CompanySchema, 'interviewace_companies');
