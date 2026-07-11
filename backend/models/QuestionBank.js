const mongoose = require('mongoose');
const { createModel } = require('./modelRegistry');

const QuestionBankSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: String, required: true },
  category: { type: String, enum: ['Aptitude', 'Core CS'], required: true }
});

module.exports = createModel('QuestionBank', QuestionBankSchema, 'interviewace_question_bank');
