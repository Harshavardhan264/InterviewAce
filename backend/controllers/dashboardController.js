const Topic = require('../models/Topic');
const Problem = require('../models/Problem');
const { resolveAuthenticatedUser } = require('../utils/authUser');

exports.getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get User profile (streak, readiness score)
    const user = await resolveAuthenticatedUser(req);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get all topics and problems for calculations
    const topics = await Topic.find({ userId });
    const problems = await Problem.find({ userId });

    // Solve counts
    const solvedProblemsList = problems.filter(p => p.status === 'Solved');
    const totalSolved = solvedProblemsList.length;
    
    const easySolved = solvedProblemsList.filter(p => p.difficulty === 'Easy').length;
    const mediumSolved = solvedProblemsList.filter(p => p.difficulty === 'Medium').length;
    const hardSolved = solvedProblemsList.filter(p => p.difficulty === 'Hard').length;

    // Study Hours (sum of timeTaken from problems, converted to hours)
    const totalMinutes = problems.reduce((sum, p) => sum + (p.timeTaken || 0), 0);
    const studyHours = Math.round((totalMinutes / 60) * 10) / 10; // round to 1 decimal

    // Identify Weak and Strong topics
    // Strong: Completion >= 50% and Accuracy >= 70%
    // Weak: (Total > 0 and Accuracy < 50%) or (Total > 0 and Completion < 30%)
    const strongTopics = topics
      .filter(t => t.totalProblems > 0 && t.completionPercentage >= 50 && t.accuracy >= 65)
      .map(t => ({ topicName: t.topicName, category: t.category, completion: t.completionPercentage, accuracy: t.accuracy }))
      .slice(0, 3);

    const weakTopics = topics
      .filter(t => t.totalProblems > 0 && (t.accuracy < 50 || t.completionPercentage < 40))
      .map(t => ({ topicName: t.topicName, category: t.category, completion: t.completionPercentage, accuracy: t.accuracy }))
      .slice(0, 3);

    // If no strong/weak yet, populate with helpful defaults or empty state
    // Recent activity: last 5 solved or attempted problems
    const recentActivity = problems
      .filter(p => p.status !== 'Not Started')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(p => ({
        _id: p._id,
        title: p.title,
        difficulty: p.difficulty,
        topic: p.topic,
        status: p.status,
        updatedAt: p.createdAt
      }));

    // Topic Completion Chart Data
    // Return counts and names for top 6 topics
    const topicCompletionData = topics
      .filter(t => t.totalProblems > 0)
      .slice(0, 6)
      .map(t => ({
        name: t.topicName,
        completion: t.completionPercentage,
        solved: t.solvedProblems,
        total: t.totalProblems
      }));

    res.json({
      readinessScore: user.readinessScore || 0,
      streak: user.streak || 0,
      problemsSolved: {
        total: totalSolved,
        easy: easySolved,
        medium: mediumSolved,
        hard: hardSolved
      },
      studyHours,
      strongTopics,
      weakTopics,
      recentActivity,
      topicCompletionData
    });
  } catch (error) {
    console.error('Error generating dashboard stats:', error);
    res.status(500).json({ message: 'Server error generating dashboard statistics' });
  }
};
