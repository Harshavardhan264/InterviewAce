const Problem = require('../models/Problem');
const Topic = require('../models/Topic');
const { recalculateTopicStats } = require('../utils/metrics');

exports.getProblems = async (req, res) => {
  try {
    const { topic, difficulty, status, search } = req.query;
    const query = { userId: req.user.id };

    if (topic) query.topic = topic;
    if (difficulty) query.difficulty = difficulty;
    if (status) query.status = status;
    if (search) {
      // Keep search filtering in application code for consistent results.
    }

    let problems = await Problem.find(query);

    if (search) {
      const searchLower = search.toLowerCase();
      problems = problems.filter(
        (p) =>
          p.title.toLowerCase().includes(searchLower) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(searchLower)))
      );
    }

    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving problems' });
  }
};

exports.createProblem = async (req, res) => {
  try {
    const { title, difficulty, topic, platform, problemLink, timeTaken, status, notes, tags } = req.body;

    if (!title || !difficulty || !topic) {
      return res.status(400).json({ message: 'Title, difficulty and topic are required' });
    }

    const problem = await Problem.create({
      userId: req.user.id,
      title,
      difficulty,
      topic,
      platform: platform || 'LeetCode',
      problemLink: problemLink || '',
      timeTaken: Number(timeTaken) || 0,
      status: status || 'Not Started',
      notes: notes || '',
      tags: tags || []
    });

    // Ensure the Topic exists. If not, create it.
    const topicExists = await Topic.findOne({ userId: req.user.id, topicName: topic });
    if (!topicExists) {
      // Auto-detect category
      const coreCSTopics = ['Operating Systems', 'DBMS', 'Computer Networks', 'OOP', 'SQL', 'System Design Basics'];
      const category = coreCSTopics.includes(topic) ? 'Core CS' : 'DSA';
      
      await Topic.create({
        userId: req.user.id,
        topicName: topic,
        category,
        totalProblems: 0,
        solvedProblems: 0
      });
    }

    // Recalculate stats
    await recalculateTopicStats(req.user.id, topic);

    res.status(201).json(problem);
  } catch (error) {
    console.error('Error creating problem:', error);
    res.status(500).json({ message: 'Server error creating problem' });
  }
};

exports.updateProblem = async (req, res) => {
  try {
    const oldProblem = await Problem.findById(req.params.id);
    if (!oldProblem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    const problem = await Problem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    // Recalculate stats for the current topic
    await recalculateTopicStats(req.user.id, problem.topic);

    // If the topic was changed, recalculate the old topic's stats too
    if (oldProblem.topic !== problem.topic) {
      await recalculateTopicStats(req.user.id, oldProblem.topic);
    }

    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating problem' });
  }
};

exports.deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    await Problem.findByIdAndDelete(req.params.id);
    
    // Recalculate stats
    await recalculateTopicStats(req.user.id, problem.topic);

    res.json({ message: 'Problem deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting problem' });
  }
};
