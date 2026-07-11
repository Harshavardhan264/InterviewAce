const Topic = require('../models/Topic');
const Problem = require('../models/Problem');
const User = require('../models/User');
const { resolveAuthenticatedUser } = require('./authUser');

const recalculateTopicStats = async (userId, topicName) => {
  try {
    const problems = await Problem.find({ userId, topic: topicName });
    
    const totalProblems = problems.length;
    const solvedProblemsList = problems.filter(p => p.status === 'Solved');
    const solvedProblems = solvedProblemsList.length;
    const easySolved = solvedProblemsList.filter(p => p.difficulty === 'Easy').length;
    const mediumSolved = solvedProblemsList.filter(p => p.difficulty === 'Medium').length;
    const hardSolved = solvedProblemsList.filter(p => p.difficulty === 'Hard').length;
    
    const interactedProblems = problems.filter(p =>
      ['Solved', 'Attempted', 'Revision Needed'].includes(p.status)
    ).length;
    
    const accuracy =
      interactedProblems > 0
        ? Math.round((solvedProblems / interactedProblems) * 100)
        : 0;
        
    const completionPercentage =
      totalProblems > 0
        ? Math.round((solvedProblems / totalProblems) * 100)
        : 0;
        
    const lastPracticedProblem = problems
      .filter(p => p.status !== 'Not Started')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
      
    const lastPracticed = lastPracticedProblem
      ? new Date(lastPracticedProblem.createdAt)
      : null;

    await Topic.findOneAndUpdate(
      { userId, topicName },
      {
        totalProblems,
        solvedProblems,
        easySolved,
        mediumSolved,
        hardSolved,
        accuracy,
        completionPercentage,
        lastPracticed
      },
      { new: true }
    );

    await recalculateUserReadiness(userId);
  } catch (err) {
    console.error('Error recalculating topic stats:', err);
  }
};

const recalculateUserReadiness = async (userId) => {
  try {
    const topics = await Topic.find({ userId });
    if (topics.length === 0) return;

    const totalCompletion = topics.reduce((sum, t) => sum + (t.completionPercentage || 0), 0);
    const averageCompletion = totalCompletion / topics.length;

    const topicsWithAccuracy = topics.filter(t => t.totalProblems > 0);
    const totalAccuracy = topicsWithAccuracy.reduce((sum, t) => sum + (t.accuracy || 0), 0);
    const averageAccuracy = topicsWithAccuracy.length > 0 ? (totalAccuracy / topicsWithAccuracy.length) : 0;

    const user = await resolveAuthenticatedUser({ user: { id: userId } });
    if (!user) return;

    const streakBonus = Math.min((user.streak || 0) * 2, 10);
    
    // Formula: 60% completion + 30% accuracy + 10% streak bonus
    const rawScore = (averageCompletion * 0.6) + (averageAccuracy * 0.3) + streakBonus;
    const readinessScore = Math.max(10, Math.min(Math.round(rawScore), 100));

    await User.findByIdAndUpdate(userId, { readinessScore });
  } catch (err) {
    console.error('Error recalculating readiness score:', err);
  }
};

module.exports = { recalculateTopicStats, recalculateUserReadiness };
