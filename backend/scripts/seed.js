const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = require('../config/db');
const Company = require('../models/Company');
const QuestionBank = require('../models/QuestionBank');

const seedCompanies = [
  {
    companyName: 'Google',
    difficultyLevel: 'Hard',
    topics: ['Graphs', 'Dynamic Programming', 'Trees', 'Heaps', 'Recursion'],
    preparationTips: [
      'Focus deeply on graph traversal algorithms (BFS, DFS, Dijkstra, A*, Topological Sort).',
      'Explain your thought process aloud. Interviewers assess your approach as much as your code.',
      'Optimize for both time and space complexity. Always state complexity before coding.',
      'Prepare well for Googleiness and Leadership rounds.'
    ],
    interviewQuestions: [
      { title: 'Median from Data Stream', difficulty: 'Hard', description: 'Design a data structure that supports adding numbers from a stream and finding the median.' },
      { title: 'Course Schedule II', difficulty: 'Medium', description: 'Find the ordering of courses you should take given a list of prerequisite dependencies.' },
      { title: 'Shortest Path in a Grid with Obstacles Elimination', difficulty: 'Hard', description: 'Find the shortest path in a 2D grid where you can eliminate up to K obstacles.' }
    ],
    interviewExperiences: [
      { title: 'Software Engineer L4 Interview', author: 'SDE-2 Candidate', content: 'Three coding rounds and one Googleiness round. Questions were graph-centric, focused on DFS and BFS optimization. Highly technical but the interviewer was extremely helpful.', date: 'June 2026' }
    ]
  },
  {
    companyName: 'Amazon',
    difficultyLevel: 'Medium',
    topics: ['Heaps', 'Stack', 'Linked Lists', 'Arrays', 'System Design'],
    preparationTips: [
      'Learn the 16 Amazon Leadership Principles inside out. Prepare STAR-format answers for each.',
      'Focus on LRU Cache, Merge K Sorted Lists, and Heap-based priority queue questions.',
      'Understand basic object-oriented design and system design patterns.'
    ],
    interviewQuestions: [
      { title: 'LRU Cache', difficulty: 'Medium', description: 'Design and implement a data structure for Least Recently Used (LRU) cache.' },
      { title: 'Merge k Sorted Lists', difficulty: 'Hard', description: 'Merge k sorted linked lists and return it as one sorted list.' },
      { title: 'K Closest Points to Origin', difficulty: 'Medium', description: 'Given an array of points, find the K closest points to the origin (0, 0).' }
    ],
    interviewExperiences: [
      { title: 'SDE-1 Offcampus Experience', author: 'New Grad', content: '1 Online Assessment + 3 Virtual Onsites. 1 round on OOP design, 2 rounds of coding. Every round started with 15 minutes of Leadership Principle behavioral questions.', date: 'May 2026' }
    ]
  },
  {
    companyName: 'Microsoft',
    difficultyLevel: 'Medium',
    topics: ['Trees', 'Strings', 'Linked Lists', 'Binary Search'],
    preparationTips: [
      'Master binary tree traversals (inorder, preorder, postorder, level order).',
      'Be comfortable with pointer manipulations in linked lists (reversing, splitting).',
      'Focus on writing bug-free, clean code. They appreciate solid debugging skills.'
    ],
    interviewQuestions: [
      { title: 'Binary Tree Zigzag Level Order Traversal', difficulty: 'Medium', description: 'Return the zigzag level order traversal of its nodes values.' },
      { title: 'Reverse Nodes in k-Group', difficulty: 'Hard', description: 'Reverse the nodes of a linked list k at a time and return its modified list.' },
      { title: 'Valid Parentheses', difficulty: 'Easy', description: 'Determine if an input string containing brackets is valid.' }
    ],
    interviewExperiences: [
      { title: 'SDE Intern Interview', author: 'College Student', content: '2 coding rounds. One was related to string manipulation (reversing words) and the other was binary search on a sorted matrix. Focus on edge cases.', date: 'April 2026' }
    ]
  },
  {
    companyName: 'TCS',
    difficultyLevel: 'Easy',
    topics: ['Arrays', 'Strings', 'Basic OOP', 'DBMS', 'SQL'],
    preparationTips: [
      'Practice basic programming problems like Palindromes, Fibonacci, Prime Numbers.',
      'Prepare fundamental concepts of Object-Oriented Programming (Polymorphism, Inheritance).',
      'Revise basic database queries (SELECT, JOINs, Group By).'
    ],
    interviewQuestions: [
      { title: 'Check Palindrome', difficulty: 'Easy', description: 'Check if a given string or number reads the same backward as forward.' },
      { title: 'Second Largest Element', difficulty: 'Easy', description: 'Find the second largest element in an array without sorting.' },
      { title: 'Basic SQL Query', difficulty: 'Easy', description: 'Retrieve names of employees who have a salary greater than 50000.' }
    ],
    interviewExperiences: [
      { title: 'TCS Digital Recruitment', author: 'B.Tech Graduate', content: 'Written exam followed by one technical interview and one HR interview. Technical round asked basic definitions of OOP and a simple palindrome check code.', date: 'March 2026' }
    ]
  },
  {
    companyName: 'Infosys',
    difficultyLevel: 'Easy',
    topics: ['Arrays', 'Strings', 'OOP', 'SQL', 'DBMS'],
    preparationTips: [
      'Revise sorting and searching algorithms.',
      'Practice basic string operations (anagrams, reversing words, removing duplicate characters).',
      'Be prepared with your academic projects in detail.'
    ],
    interviewQuestions: [
      { title: 'Valid Anagram', difficulty: 'Easy', description: 'Given two strings s and t, return true if t is an anagram of s.' },
      { title: 'Count Vowels and Consonants', difficulty: 'Easy', description: 'Write a program to count the number of vowels and consonants in a string.' },
      { title: 'DBMS Join Query', difficulty: 'Easy', description: 'Write a SQL query to join Employee and Department tables.' }
    ],
    interviewExperiences: [
      { title: 'Infosys System Engineer Role', author: 'CS Engineer', content: 'Mainly project discussion. Asked what language I used and to write a small function to count vowels in a string. Very friendly interviewers.', date: 'January 2026' }
    ]
  },
  {
    companyName: 'Accenture',
    difficultyLevel: 'Easy',
    topics: ['Aptitude', 'OOP', 'Computer Networks', 'DBMS'],
    preparationTips: [
      'Aptitude is the main filter. Practice speed-math, logical reasoning, and verbal ability.',
      'Revise basic networking terms (OSI model layers, TCP vs UDP).',
      'Know the differences between compiler/interpreter, and primary keys/foreign keys.'
    ],
    interviewQuestions: [
      { title: 'Difference between TCP and UDP', difficulty: 'Easy', description: 'Explain the core differences between TCP and UDP protocols.' },
      { title: 'Find GCD of Two Numbers', difficulty: 'Easy', description: 'Write a function to calculate the greatest common divisor of two integers.' }
    ],
    interviewExperiences: [
      { title: 'Accenture ASE Role', author: 'ECE Student', content: 'Cognitive assessment was moderate. Technical round focused on academic projects, basics of computer networks (OSI layers), and SQL Join concepts.', date: 'February 2026' }
    ]
  },
  {
    companyName: 'Deloitte',
    difficultyLevel: 'Easy',
    topics: ['SQL', 'DBMS', 'Aptitude', 'OOP'],
    preparationTips: [
      'Strongly brush up on SQL Queries (Subqueries, Aggregate Functions, Joins).',
      'Prepare well for behavioral questions. They look for client-readiness and soft skills.',
      'Revise basic coding questions like Bubble Sort or Prime Number checks.'
    ],
    interviewQuestions: [
      { title: 'Write an SQL Subquery', difficulty: 'Easy', description: 'Find the employee with the maximum salary using a subquery.' },
      { title: 'Bubble Sort Implementation', difficulty: 'Easy', description: 'Implement standard bubble sort algorithm and explain its complexity.' }
    ],
    interviewExperiences: [
      { title: 'Deloitte Advisory Interview', author: 'Consultant Candidate', content: 'Case study presentation followed by a technical discussion on SQL. Focus is on business logic and communication.', date: 'June 2026' }
    ]
  }
];

const seedQuestions = [
  // Aptitude
  {
    title: 'Work and Time Speed',
    description: 'A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?',
    options: ['120 metres', '150 metres', '324 metres', '180 metres'],
    correctAnswer: '150 metres',
    category: 'Aptitude'
  },
  {
    title: 'Simple Interest Principle',
    description: 'A sum of money at simple interest amounts to Rs. 815 in 3 years and to Rs. 854 in 4 years. Find the principal sum.',
    options: ['Rs. 650', 'Rs. 690', 'Rs. 698', 'Rs. 700'],
    correctAnswer: 'Rs. 698',
    category: 'Aptitude'
  },
  {
    title: 'Ratio and Speed',
    description: 'The speed ratio of two trains is 7:8. If the second train runs 400 km in 4 hours, what is the speed of the first train?',
    options: ['70 km/hr', '75 km/hr', '84 km/hr', '87.5 km/hr'],
    correctAnswer: '87.5 km/hr',
    category: 'Aptitude'
  },
  {
    title: 'Percentage Calculations',
    description: 'A fruit seller had some apples. He sells 40% apples and still has 420 apples. Originally, he had how many apples?',
    options: ['588 apples', '600 apples', '672 apples', '700 apples'],
    correctAnswer: '700 apples',
    category: 'Aptitude'
  },
  // Core CS
  {
    title: 'Operating Systems Starvation',
    description: 'Which scheduling algorithm is susceptible to starvation?',
    options: ['Round Robin', 'Shortest Job First', 'First Come First Served', 'FIFO'],
    correctAnswer: 'Shortest Job First',
    category: 'Core CS'
  },
  {
    title: 'Database Transactions Properties',
    description: 'What does the abbreviation "I" in ACID database properties represent?',
    options: ['Inheritance', 'Isolation', 'Indexability', 'Consistency'],
    correctAnswer: 'Isolation',
    category: 'Core CS'
  },
  {
    title: 'Computer Networks OSI Model',
    description: 'At which OSI model layer does a standard network router operate?',
    options: ['Transport Layer', 'Data Link Layer', 'Network Layer', 'Physical Layer'],
    correctAnswer: 'Network Layer',
    category: 'Core CS'
  },
  {
    title: 'Object-Oriented Programming Principles',
    description: 'Which of the following is NOT one of the 4 core pillars of OOP?',
    options: ['Encapsulation', 'Polymorphism', 'Compilation', 'Abstraction'],
    correctAnswer: 'Compilation',
    category: 'Core CS'
  },
  {
    title: 'SQL Ordering Query',
    description: 'Which SQL clause is used to sort the result-set in ascending or descending order?',
    options: ['SORT BY', 'GROUP BY', 'ORDER BY', 'HAVING'],
    correctAnswer: 'ORDER BY',
    category: 'Core CS'
  }
];

const run = async () => {
  console.log('Seeding database...');
  await connectDB();
  
  try {
    // Clear old data
    await Company.deleteMany({});
    await QuestionBank.deleteMany({});
    
    // Insert new data
    for (let comp of seedCompanies) {
      await Company.create(comp);
    }
    
    for (let q of seedQuestions) {
      await QuestionBank.create(q);
    }
    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
  
  process.exit(0);
};

run();
