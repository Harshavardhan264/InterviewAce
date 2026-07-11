const Topic = require('../models/Topic');
const Problem = require('../models/Problem');

const getSubtopicsForTopic = (topicName) => {
  const mapping = {
    'Graphs': ['Graph Basics', 'Breadth First Search (BFS)', 'Depth First Search (DFS)', 'Topological Sort', 'Shortest Path (Dijkstra/Bellman)', 'Minimum Spanning Tree (Prim/Kruskal)'],
    'Dynamic Programming': ['Fibonacci DP', '1D DP', 'Knapsack Problem', 'Longest Common Subsequence (LCS)', 'Matrix Chain Multiplication', 'Decision DP'],
    'Arrays': ['Two Pointer technique', 'Sliding Window', 'Prefix Sum', 'Subarray Algorithms'],
    'Strings': ['String Hashing', 'KMP Algorithm', 'Rabin-Karp', 'Anagrams & Palindromes'],
    'Trees': ['Preorder/Inorder/Postorder traversals', 'Level Order Traversal', 'Lowest Common Ancestor (LCA)', 'Path Sum Problems'],
    'Binary Search Trees': ['BST Insertion/Deletion', 'Inorder Successor/Predecessor', 'Validate BST', 'BST to Doubly Linked List'],
    'Linked Lists': ['Singly & Doubly Linked List Basics', 'Floyd Cycle Detection', 'Reverse Linked List', 'Merge Lists'],
    'Stack': ['Balanced Parentheses', 'Next Greater Element', 'Min Stack Implementation', 'Infix to Postfix Conversion'],
    'Queue': ['Circular Queue', 'Sliding Window Maximum', 'Implement Stack using Queues'],
    'Heaps': ['K-way Merge', 'Median Finding', 'Priority Queue Operations'],
    'Greedy': ['Activity Selection', 'Fractional Knapsack', 'Huffman Coding'],
    'Recursion': ['Base Cases', 'Recursion Trees', 'Helper Methods', 'Divide and Conquer'],
    'Backtracking': ['N-Queens Problem', 'Sudoku Solver', 'Subset Sum', 'Permutations'],
    'Bit Manipulation': ['Bitwise Operations', 'Count Set Bits', 'Single Number problem', 'Power of Two Check'],
    'Operating Systems': ['CPU Scheduling Algorithms', 'Deadlocks (Prevention & Avoidance)', 'Virtual Memory & Paging', 'Process Synchronization & Semaphores'],
    'DBMS': ['ACID Properties', 'Normalizations (1NF, 2NF, 3NF, BCNF)', 'Indexing and Hashing', 'Transaction States'],
    'Computer Networks': ['TCP/IP vs OSI model', 'TCP 3-way Handshake', 'DNS resolution process', 'IP Routing Protocols'],
    'OOP': ['Inheritance & Polymorphism', 'Encapsulation & Abstraction', 'Interfaces vs Abstract Classes', 'Method Overloading vs Overriding'],
    'SQL': ['Joins (Inner, Left, Right, Full)', 'Subqueries and Nested Queries', 'Group By & Having Clauses', 'Window Functions (Row_Number, Rank)'],
    'System Design Basics': ['Caching mechanisms', 'Load Balancing', 'Sharding & Database Replication', 'CAP Theorem']
  };
  return mapping[topicName] || ['Fundamentals', 'Practice Exercises', 'Interview Questions'];
};

exports.getRecommendations = async (req, res) => {
  try {
    const topics = await Topic.find({ userId: req.user.id });
    const problems = await Problem.find({ userId: req.user.id });

    const recommendations = [];

    for (let topic of topics) {
      // Rule 1: Topic has active problems but accuracy is low
      if (topic.totalProblems > 0 && topic.accuracy > 0 && topic.accuracy < 60) {
        recommendations.push({
          topicName: topic.topicName,
          category: topic.category,
          priority: topic.accuracy < 50 ? 'High' : 'Medium',
          type: 'Review',
          reason: `Accuracy is low (${topic.accuracy}%). Focus on fundamentals and resolve attempted problems.`,
          subtopics: getSubtopicsForTopic(topic.topicName),
          suggestedProblems: problems.filter(
            (p) => p.topic === topic.topicName && p.status !== 'Solved'
          ).slice(0, 3)
        });
      }
      
      // Rule 2: Topic has high completion but low solved count, or not started but has problems
      else if (topic.totalProblems > 0 && topic.completionPercentage < 40) {
        recommendations.push({
          topicName: topic.topicName,
          category: topic.category,
          priority: topic.completionPercentage === 0 ? 'High' : 'Medium',
          type: 'Practice',
          reason: `Completion is low (${topic.completionPercentage}%). Practice more coding questions to gain confidence.`,
          subtopics: getSubtopicsForTopic(topic.topicName),
          suggestedProblems: problems.filter(
            (p) => p.topic === topic.topicName && p.status !== 'Solved'
          ).slice(0, 3)
        });
      }
    }

    // Default recommendations if everything is completed or no problems exist yet
    if (recommendations.length === 0) {
      // Recommend starting the most popular topics
      const defaultRecs = ['Arrays', 'Strings', 'Operating Systems', 'OOP'];
      for (let recName of defaultRecs) {
        const topicObj = topics.find((t) => t.topicName === recName);
        recommendations.push({
          topicName: recName,
          category: topicObj ? topicObj.category : 'DSA',
          priority: 'Low',
          type: 'Start',
          reason: 'Looks like you are doing great! Start practicing this foundational topic to get ahead.',
          subtopics: getSubtopicsForTopic(recName),
          suggestedProblems: []
        });
      }
    }

    // Sort by priority (High first)
    const priorityWeight = { High: 3, Medium: 2, Low: 1 };
    recommendations.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);

    res.json(recommendations.slice(0, 6)); // Return top 6 recommendations
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ message: 'Server error generating recommendations' });
  }
};
