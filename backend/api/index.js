const app = require('../app');
const connectDB = require('../config/db');

module.exports = async (req, res) => {
  try {
    // 1. Establish/reuse cached MongoDB connection
    await connectDB();

    // 2. Run auto-seed check if collections are empty (on cold starts)
    const QuestionBank = require('../models/QuestionBank');
    const count = await QuestionBank.countDocuments({});
    if (count === 0) {
      console.log('⚠️ Database empty. Initializing automatic questions seed inside serverless function...');
      
      const seedQuestions = [
        { title: 'Work and Time Speed', description: 'A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?', options: ['120 metres', '150 metres', '324 metres', '180 metres'], correctAnswer: '150 metres', category: 'Aptitude' },
        { title: 'Simple Interest Principle', description: 'A sum of money at simple interest amounts to Rs. 815 in 3 years and to Rs. 854 in 4 years. Find the principal sum.', options: ['Rs. 650', 'Rs. 690', 'Rs. 698', 'Rs. 700'], correctAnswer: 'Rs. 698', category: 'Aptitude' },
        { title: 'Ratio and Speed', description: 'The speed ratio of two trains is 7:8. If the second train runs 400 km in 4 hours, what is the speed of the first train?', options: ['70 km/hr', '75 km/hr', '84 km/hr', '87.5 km/hr'], correctAnswer: '87.5 km/hr', category: 'Aptitude' },
        { title: 'Percentage Calculations', description: 'A fruit seller had some apples. He sells 40% apples and still has 420 apples. Originally, he had how many apples?', options: ['588 apples', '600 apples', '672 apples', '700 apples'], correctAnswer: '700 apples', category: 'Aptitude' },
        { title: 'Operating Systems Starvation', description: 'Which scheduling algorithm is susceptible to starvation?', options: ['Round Robin', 'Shortest Job First', 'First Come First Served', 'FIFO'], correctAnswer: 'Shortest Job First', category: 'Core CS' },
        { title: 'Database Transactions Properties', description: 'What does the abbreviation "I" in ACID database properties represent?', options: ['Inheritance', 'Isolation', 'Indexability', 'Consistency'], correctAnswer: 'Isolation', category: 'Core CS' },
        { title: 'Computer Networks OSI Model', description: 'At which OSI model layer does a standard network router operate?', options: ['Transport Layer', 'Data Link Layer', 'Network Layer', 'Physical Layer'], correctAnswer: 'Network Layer', category: 'Core CS' },
        { title: 'Object-Oriented Programming Principles', description: 'Which of the following is NOT one of the 4 core pillars of OOP?', options: ['Encapsulation', 'Polymorphism', 'Compilation', 'Abstraction'], correctAnswer: 'Compilation', category: 'Core CS' },
        { title: 'SQL Ordering Query', description: 'Which SQL clause is used to sort the result-set in ascending or descending order?', options: ['SORT BY', 'GROUP BY', 'ORDER BY', 'HAVING'], correctAnswer: 'ORDER BY', category: 'Core CS' }
      ];

      for (let q of seedQuestions) {
        await QuestionBank.create(q);
      }
      console.log('✅ Auto-seed completed successfully!');
    }

    // 3. Delegate request resolution to Express routing app
    return app(req, res);
  } catch (error) {
    console.error('Serverless function failed to process request:', error);
    res.status(500).json({ 
      message: 'Failed to process serverless function request', 
      error: error.message 
    });
  }
};
