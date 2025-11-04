const express = require('express');
const { body } = require('express-validator');
const {
  analyzeText,
  analyzeUrl,
  getHistory,
  getAnalysis,
  deleteAnalysis,
  getStats
} = require('../controllers/analysisController');
const { protect } = require('../middleware/auth');
const { analysisLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Validation rules
const textAnalysisValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: 50 })
    .withMessage('Content must be at least 50 characters long')
];

const urlAnalysisValidation = [
  body('url')
    .trim()
    .notEmpty()
    .withMessage('URL is required')
    .isURL()
    .withMessage('Please provide a valid URL')
];

// All routes are protected
router.use(protect);

// Analysis routes
router.post('/text', analysisLimiter, textAnalysisValidation, analyzeText);
router.post('/url', analysisLimiter, urlAnalysisValidation, analyzeUrl);

// History and stats routes
router.get('/history', getHistory);
router.get('/stats', getStats);

// Single analysis routes
router.get('/:id', getAnalysis);
router.delete('/:id', deleteAnalysis);

module.exports = router;
