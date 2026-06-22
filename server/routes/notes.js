const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// Helper: strip HTML tags to plain text
function stripHtml(html) {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

// GET all notes (with optional search & tag filter)
router.get('/', async (req, res) => {
  try {
    const { search, tag, sort = 'updatedAt' } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { contentText: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    if (tag) {
      query.tags = { $in: [tag] };
    }

    const sortOption = sort === 'title' ? { title: 1 } :
                       sort === 'createdAt' ? { createdAt: -1 } :
                       { isPinned: -1, updatedAt: -1 };

    const notes = await Note.find(query).sort(sortOption);
    res.json({ success: true, notes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single note
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    res.json({ success: true, note });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create note
router.post('/', async (req, res) => {
  try {
    const { title, content, tags, color } = req.body;
    const note = new Note({
      title: title || 'Untitled Note',
      content: content || '',
      contentText: stripHtml(content || ''),
      tags: tags || [],
      color: color || '#ffffff',
    });
    await note.save();
    res.status(201).json({ success: true, note });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT update note
router.put('/:id', async (req, res) => {
  try {
    const { title, content, tags, color, isPinned } = req.body;
    const update = {};
    if (title !== undefined) update.title = title;
    if (content !== undefined) { update.content = content; update.contentText = stripHtml(content); }
    if (tags !== undefined) update.tags = tags;
    if (color !== undefined) update.color = color;
    if (isPinned !== undefined) update.isPinned = isPinned;

    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true, runValidators: true }
    );
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    res.json({ success: true, note });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE note
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    res.json({ success: true, message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET all unique tags
router.get('/meta/tags', async (req, res) => {
  try {
    const tags = await Note.distinct('tags');
    res.json({ success: true, tags: tags.filter(Boolean).sort() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
