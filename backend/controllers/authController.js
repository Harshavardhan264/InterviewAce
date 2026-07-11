const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Topic = require('../models/Topic');
const Problem = require('../models/Problem');

const defaultTopics = [
  // DSA
  { topicName: 'Arrays', category: 'DSA' },
  { topicName: 'Strings', category: 'DSA' },
  { topicName: 'Linked Lists', category: 'DSA' },
  { topicName: 'Stack', category: 'DSA' },
  { topicName: 'Queue', category: 'DSA' },
  { topicName: 'Trees', category: 'DSA' },
  { topicName: 'Binary Search Trees', category: 'DSA' },
  { topicName: 'Heaps', category: 'DSA' },
  { topicName: 'Graphs', category: 'DSA' },
  { topicName: 'Dynamic Programming', category: 'DSA' },
  { topicName: 'Greedy', category: 'DSA' },
  { topicName: 'Recursion', category: 'DSA' },
  { topicName: 'Backtracking', category: 'DSA' },
  { topicName: 'Bit Manipulation', category: 'DSA' },
  // Core CS
  { topicName: 'Operating Systems', category: 'Core CS' },
  { topicName: 'DBMS', category: 'Core CS' },
  { topicName: 'Computer Networks', category: 'Core CS' },
  { topicName: 'OOP', category: 'Core CS' },
  { topicName: 'SQL', category: 'Core CS' },
  { topicName: 'System Design Basics', category: 'Core CS' }
];

const defaultProblems = [
  { title: 'Two Sum', difficulty: 'Easy', topic: 'Arrays', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/two-sum/', status: 'Not Started', tags: ['Hash Table', 'Array'] },
  { title: 'Valid Parentheses', difficulty: 'Easy', topic: 'Stack', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/valid-parentheses/', status: 'Not Started', tags: ['Stack', 'String'] },
  { title: 'Reverse Linked List', difficulty: 'Easy', topic: 'Linked Lists', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/reverse-linked-list/', status: 'Not Started', tags: ['Linked List'] },
  { title: 'Merge Intervals', difficulty: 'Medium', topic: 'Arrays', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/merge-intervals/', status: 'Not Started', tags: ['Sorting', 'Array'] },
  { title: 'Validate Binary Search Tree', difficulty: 'Medium', topic: 'Binary Search Trees', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/validate-binary-search-tree/', status: 'Not Started', tags: ['BST', 'Tree', 'DFS'] },
  { title: 'Course Schedule II', difficulty: 'Medium', topic: 'Graphs', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/course-schedule-ii/', status: 'Not Started', tags: ['Graph', 'BFS', 'Topological Sort'] },
  { title: 'Climbing Stairs', difficulty: 'Easy', topic: 'Dynamic Programming', platform: 'LeetCode', problemLink: 'https://leetcode.com/problems/climbing-stairs/', status: 'Not Started', tags: ['DP', 'Math'] },
  { title: 'Explain ACID Properties', difficulty: 'Medium', topic: 'DBMS', platform: 'GeeksforGeeks', problemLink: 'https://www.geeksforgeeks.org/acid-properties-in-dbms/', status: 'Not Started', tags: ['Database', 'Transactions'] },
  { title: 'Explain 4 Pillars of OOP', difficulty: 'Easy', topic: 'OOP', platform: 'GeeksforGeeks', problemLink: 'https://www.geeksforgeeks.org/object-oriented-programming-in-cpp/', status: 'Not Started', tags: ['OOP', 'Basics'] },
  { title: 'TCP 3-Way Handshake', difficulty: 'Medium', topic: 'Computer Networks', platform: 'GeeksforGeeks', problemLink: 'https://www.geeksforgeeks.org/computer-network-tcp-3-way-handshake-process/', status: 'Not Started', tags: ['Networking', 'TCP'] }
];

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'super_secret_interviewace_jwt_token_12345',
    { expiresIn: '30d' }
  );
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role === 'admin' ? 'admin' : 'student';

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole,
      streak: 0,
      readinessScore: 10 // Start with basic readiness score
    });

    // Seed default topics for this registered user
    for (let topic of defaultTopics) {
      // Find default problems related to this topic
      const matchingDefaultProblems = defaultProblems.filter(p => p.topic === topic.topicName);
      
      await Topic.create({
        userId: user._id,
        topicName: topic.topicName,
        category: topic.category,
        totalProblems: matchingDefaultProblems.length,
        solvedProblems: 0,
        easySolved: 0,
        mediumSolved: 0,
        hardSolved: 0,
        accuracy: 0,
        completionPercentage: 0,
        lastPracticed: null
      });
    }

    // Seed default starter problems for this registered user
    for (let prob of defaultProblems) {
      await Problem.create({
        userId: user._id,
        ...prob
      });
    }

    res.status(201).json({
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        streak: user.streak,
        readinessScore: user.readinessScore
      }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update streak (Simple check: if last login / streak increase was > 24 hours but < 48 hours, increment. If > 48 hours, reset. If same day, do nothing.)
    // We can simulate simple streak update here
    let currentStreak = user.streak || 0;
    if (currentStreak === 0) {
      currentStreak = 1;
    } else {
      currentStreak += 1; // Basic increment for daily login simplicity
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { streak: currentStreak },
      { new: true }
    );

    res.json({
      token: generateToken(updatedUser),
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        streak: updatedUser.streak,
        readinessScore: updatedUser.readinessScore
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

exports.logout = (req, res) => {
  res.json({ message: 'Successfully logged out' });
};
