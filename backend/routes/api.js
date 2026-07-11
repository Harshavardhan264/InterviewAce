const express = require('express');
const router = express.Router();

const { protect, adminOnly } = require('../middleware/authMiddleware');

// Controller imports
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const topicController = require('../controllers/topicController');
const problemController = require('../controllers/problemController');
const recommendationController = require('../controllers/recommendationController');
const dashboardController = require('../controllers/dashboardController');
const companyController = require('../controllers/companyController');
const mockTestController = require('../controllers/mockTestController');
const noteController = require('../controllers/noteController');
const adminController = require('../controllers/adminController');

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [student, admin]
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input or User already exists
 */
router.post('/auth/register', authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */
router.post('/auth/login', authController.login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out current user
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 */
router.post('/auth/logout', authController.logout);

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Retrieve profile of logged in user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Profile details returned
 *       401:
 *         description: Unauthorized
 *   put:
 *     summary: Update profile of logged in user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.get('/users/profile', protect, userController.getProfile);
router.put('/users/profile', protect, userController.updateProfile);

/**
 * @swagger
 * /topics:
 *   get:
 *     summary: Get all topics logged for the user
 *     tags: [Topics]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of topics
 *   post:
 *     summary: Create a new custom study topic
 *     tags: [Topics]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [topicName, category]
 *             properties:
 *               topicName:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Topic created
 */
router.get('/topics', protect, topicController.getTopics);
router.post('/topics', protect, topicController.createTopic);

/**
 * @swagger
 * /topics/{id}:
 *   put:
 *     summary: Update a topic
 *     tags: [Topics]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Topic updated
 *   delete:
 *     summary: Delete a topic
 *     tags: [Topics]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Topic deleted
 */
router.put('/topics/:id', protect, topicController.updateTopic);
router.delete('/topics/:id', protect, topicController.deleteTopic);

/**
 * @swagger
 * /problems:
 *   get:
 *     summary: Get user-practiced problems
 *     tags: [Problems]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: topic
 *         in: query
 *         schema:
 *           type: string
 *       - name: difficulty
 *         in: query
 *         schema:
 *           type: string
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Problems list returned
 *   post:
 *     summary: Log a new coding problem
 *     tags: [Problems]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, topic]
 *             properties:
 *               title:
 *                 type: string
 *               difficulty:
 *                 type: string
 *               topic:
 *                 type: string
 *               platform:
 *                 type: string
 *               problemLink:
 *                 type: string
 *               timeTaken:
 *                 type: number
 *               status:
 *                 type: string
 *               notes:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Problem created
 */
router.get('/problems', protect, problemController.getProblems);
router.post('/problems', protect, problemController.createProblem);

/**
 * @swagger
 * /problems/{id}:
 *   put:
 *     summary: Update problem logs or status
 *     tags: [Problems]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Problem updated
 *   delete:
 *     summary: Delete a problem
 *     tags: [Problems]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Problem deleted
 */
router.put('/problems/:id', protect, problemController.updateProblem);
router.delete('/problems/:id', protect, problemController.deleteProblem);

/**
 * @swagger
 * /recommendations:
 *   get:
 *     summary: Fetch system recommendations for study focus
 *     tags: [Recommendations]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of recommendation profiles
 */
router.get('/recommendations', protect, recommendationController.getRecommendations);

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Get dashboard KPI metrics and analytics
 *     tags: [Dashboard]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard JSON metrics returned
 */
router.get('/dashboard', protect, dashboardController.getDashboardSummary);

/**
 * @swagger
 * /companies:
 *   get:
 *     summary: List configured companies
 *     tags: [Companies]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of companies
 *   post:
 *     summary: Create a new company guide
 *     tags: [Companies]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [companyName]
 *     responses:
 *       201:
 *         description: Company created
 */
router.get('/companies', protect, companyController.getCompanies);
router.post('/companies', protect, adminOnly, companyController.createCompany);

/**
 * @swagger
 * /companies/{id}:
 *   put:
 *     summary: Update an existing company guide
 *     tags: [Companies]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Company listing updated
 *   delete:
 *     summary: Delete a company guide
 *     tags: [Companies]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Company listing deleted
 */
router.put('/companies/:id', protect, adminOnly, companyController.updateCompany);
router.delete('/companies/:id', protect, adminOnly, companyController.deleteCompany);

/**
 * @swagger
 * /mock-tests:
 *   get:
 *     summary: Fetch mock exam logs history
 *     tags: [Mock Interviews]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of mock exams
 *   post:
 *     summary: Generate a new mock exam
 *     tags: [Mock Interviews]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [company, difficulty, duration]
 *             properties:
 *               company:
 *                 type: string
 *               difficulty:
 *                 type: string
 *               duration:
 *                 type: number
 *     responses:
 *       201:
 *         description: Mock exam initialized
 */
router.get('/mock-tests', protect, mockTestController.getMockTests);
router.post('/mock-tests', protect, mockTestController.createMockTest);

/**
 * @swagger
 * /mock-tests/submit:
 *   post:
 *     summary: Submit and grade mock exam answers
 *     tags: [Mock Interviews]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [testId, answers]
 *             properties:
 *               testId:
 *                 type: string
 *               answers:
 *                 type: object
 *     responses:
 *       200:
 *         description: Graded exam report returned
 */
router.post('/mock-tests/submit', protect, mockTestController.submitMockTest);

/**
 * @swagger
 * /notes:
 *   get:
 *     summary: Fetch user-logged notes
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: category
 *         in: query
 *         schema:
 *           type: string
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of notes
 *   post:
 *     summary: Create a study note
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, category, content]
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Note created
 */
router.get('/notes', protect, noteController.getNotes);
router.post('/notes', protect, noteController.createNote);

/**
 * @swagger
 * /notes/{id}:
 *   put:
 *     summary: Update an existing study note
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Note updated
 *   delete:
 *     summary: Delete a note
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Note deleted
 */
router.put('/notes/:id', protect, noteController.updateNote);
router.delete('/notes/:id', protect, noteController.deleteNote);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: List all registered accounts (Admin Only)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of accounts
 *       403:
 *         description: Access Denied
 */
router.get('/admin/users', protect, adminOnly, adminController.getUsers);

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Delete a user account (Admin Only)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 *       403:
 *         description: Access Denied
 */
router.delete('/admin/users/:id', protect, adminOnly, adminController.deleteUser);

module.exports = router;
