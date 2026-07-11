const Note = require('../models/Note');

exports.getNotes = async (req, res) => {
  try {
    const { category, search } = req.query;
    const query = { userId: req.user.id };

    if (category) query.category = category;

    let notes = await Note.find(query);

    if (search) {
      const searchLower = search.toLowerCase();
      notes = notes.filter(
        (n) =>
          n.title.toLowerCase().includes(searchLower) ||
          n.content.toLowerCase().includes(searchLower)
      );
    }

    res.json(notes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving study notes' });
  }
};

exports.createNote = async (req, res) => {
  try {
    const { title, category, content } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Note title is required' });
    }

    const note = await Note.create({
      userId: req.user.id,
      title,
      category: category || 'DSA',
      content: content || ''
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating study note' });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const { title, category, content } = req.body;
    const updateFields = { updatedAt: new Date() };

    if (title) updateFields.title = title;
    if (category) updateFields.category = category;
    if (content !== undefined) updateFields.content = content;

    const note = await Note.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ message: 'Study note not found' });
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating study note' });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Study note not found' });
    }
    res.json({ message: 'Study note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting study note' });
  }
};
