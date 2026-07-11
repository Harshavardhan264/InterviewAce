const mongoose = require('mongoose');
const { createModel } = require('./modelRegistry');

const NoteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['DSA', 'OS', 'DBMS', 'CN', 'SQL', 'Interview Tips'], 
    default: 'DSA' 
  },
  content: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = createModel('Note', NoteSchema, 'interviewace_notes');
