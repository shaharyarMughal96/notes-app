const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'Untitled Note',
    trim: true,
  },
  content: {
    type: String,
    default: '',
  },
  contentText: {
    type: String,
    default: '',   // plain-text stripped version for search
  },
  tags: {
    type: [String],
    default: [],
  },
  color: {
    type: String,
    default: '#ffffff',
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Text index for full-text search
noteSchema.index({ title: 'text', contentText: 'text', tags: 'text' });

module.exports = mongoose.model('Note', noteSchema);
