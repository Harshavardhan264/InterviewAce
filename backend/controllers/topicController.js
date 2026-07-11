const Topic = require('../models/Topic');

exports.getTopics = async (req, res) => {
  try {
    const topics = await Topic.find({ userId: req.user.id });
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving topics' });
  }
};

exports.createTopic = async (req, res) => {
  try {
    const { topicName, category } = req.body;
    if (!topicName || !category) {
      return res.status(400).json({ message: 'Topic name and category are required' });
    }

    const topic = await Topic.create({
      userId: req.user.id,
      topicName,
      category,
      totalProblems: 0,
      solvedProblems: 0,
      easySolved: 0,
      mediumSolved: 0,
      hardSolved: 0,
      accuracy: 0,
      completionPercentage: 0
    });

    res.status(201).json(topic);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating topic' });
  }
};

exports.updateTopic = async (req, res) => {
  try {
    const topic = await Topic.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    res.json(topic);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating topic' });
  }
};

exports.deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findByIdAndDelete(req.params.id);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    res.json({ message: 'Topic deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting topic' });
  }
};
