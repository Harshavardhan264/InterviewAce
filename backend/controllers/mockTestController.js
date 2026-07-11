const MockTest = require('../models/MockTest');
const Company = require('../models/Company');
const QuestionBank = require('../models/QuestionBank');

exports.createMockTest = async (req, res) => {
  try {
    const { company, difficulty, duration } = req.body;

    if (!company || !difficulty || !duration) {
      return res.status(400).json({ message: 'Company, difficulty, and duration are required' });
    }

    // Find company questions
    const companyObj = await Company.findOne({ companyName: company });
    const questions = [];

    // 1. Pull Coding questions
    let codingSource = [];
    if (companyObj && companyObj.interviewQuestions && companyObj.interviewQuestions.length > 0) {
      codingSource = companyObj.interviewQuestions;
    } else {
      // Fallback coding questions
      codingSource = [
        { title: 'Two Sum', description: 'Find two numbers in an array that add up to a target value.' },
        { title: 'Reverse Linked List', description: 'Write an algorithm to reverse a singly linked list.' },
        { title: 'Valid Parentheses', description: 'Verify if bracket pairs in an input string are properly closed.' }
      ];
    }

    // Choose 1 coding question for Easy/short, 2 for Medium/Hard
    const numCoding = difficulty === 'Easy' ? 1 : 2;
    const shuffledCoding = codingSource.sort(() => 0.5 - Math.random()).slice(0, numCoding);
    
    for (let q of shuffledCoding) {
      questions.push({
        type: 'Coding',
        title: q.title,
        description: q.description || 'Provide code logic and explanation for this programming problem.',
        options: [],
        correctAnswer: 'Code solution is evaluated on completion.',
        points: 20
      });
    }

    // 2. Add MCQs from CS Bank (select 3 randomly from MongoDB)
    const csQuestions = await QuestionBank.find({ category: 'Core CS' });
    let shuffledCS = [];
    if (csQuestions.length > 0) {
      shuffledCS = csQuestions.sort(() => 0.5 - Math.random()).slice(0, 3);
    }
    for (let q of shuffledCS) {
      questions.push({
        type: 'Core CS',
        title: q.title,
        description: q.description,
        options: q.options,
        correctAnswer: q.correctAnswer,
        points: 10
      });
    }

    // 3. Add Aptitude questions (select 2 randomly from MongoDB)
    const aptQuestions = await QuestionBank.find({ category: 'Aptitude' });
    let shuffledApt = [];
    if (aptQuestions.length > 0) {
      shuffledApt = aptQuestions.sort(() => 0.5 - Math.random()).slice(0, 2);
    }
    for (let q of shuffledApt) {
      questions.push({
        type: 'Aptitude',
        title: q.title,
        description: q.description,
        options: q.options,
        correctAnswer: q.correctAnswer,
        points: 10
      });
    }

    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

    const mockTest = await MockTest.create({
      userId: req.user.id,
      company,
      difficulty,
      duration: Number(duration),
      questions,
      totalPoints,
      score: 0,
      completed: false
    });

    res.status(201).json(mockTest);
  } catch (error) {
    console.error('Error generating mock test:', error);
    res.status(500).json({ message: 'Server error generating mock test' });
  }
};

exports.submitMockTest = async (req, res) => {
  try {
    const { testId, answers } = req.body; // answers is an object mapping question indices to user answers
    const mockTest = await MockTest.findById(testId);
    
    if (!mockTest) {
      return res.status(404).json({ message: 'Mock test not found' });
    }
    
    if (mockTest.completed) {
      return res.status(400).json({ message: 'Test has already been completed and graded' });
    }

    let finalScore = 0;
    const weakAreas = [];
    const suggestions = [];

    // Grade each question
    const gradedQuestions = mockTest.questions.map((q, idx) => {
      const userAnswer = answers[idx] || '';
      let isCorrect = false;

      if (q.type === 'Coding') {
        // Coding questions are auto-approved / graded as correct for completion demonstration
        // in a real app this is verified by run-tests, but we grant full credit for attempted code
        isCorrect = userAnswer.trim().length > 10; 
      } else {
        isCorrect = userAnswer === q.correctAnswer;
      }

      if (isCorrect) {
        finalScore += q.points;
      } else {
        // Note weak areas
        const area = q.type === 'Core CS' ? 'Core Computer Science Concepts' : q.type === 'Aptitude' ? 'General Aptitude' : 'Data Structures & Algorithms';
        if (!weakAreas.includes(area)) {
          weakAreas.push(area);
        }
      }

      // We clone/assign new properties
      return {
        type: q.type,
        title: q.title,
        description: q.description,
        options: q.options,
        correctAnswer: q.correctAnswer,
        userAnswer,
        points: q.points
      };
    });

    if (weakAreas.includes('Core Computer Science Concepts')) {
      suggestions.push('Revise basic concepts of Operating Systems, DBMS and OOP. Solve CS quizzes.');
    }
    if (weakAreas.includes('General Aptitude')) {
      suggestions.push('Practice speed quantitative calculations and logical reasoning puzzles regularly.');
    }
    if (weakAreas.includes('Data Structures & Algorithms')) {
      suggestions.push('Practice more coding questions under Trees, Stack, and Graph topics.');
    }

    if (suggestions.length === 0) {
      suggestions.push('Outstanding performance! Keep maintaining consistency by taking harder mock tests.');
    }

    const updatedTest = await MockTest.findByIdAndUpdate(
      testId,
      {
        questions: gradedQuestions,
        score: finalScore,
        weakAreas,
        suggestions,
        completed: true,
        completedAt: new Date()
      },
      { new: true }
    );

    res.json(updatedTest);
  } catch (error) {
    console.error('Error submitting mock test:', error);
    res.status(500).json({ message: 'Server error grading mock test' });
  }
};

exports.getMockTests = async (req, res) => {
  try {
    const tests = await MockTest.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving mock tests history' });
  }
};
