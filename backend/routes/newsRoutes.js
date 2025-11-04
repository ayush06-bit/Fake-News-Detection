const express = require('express');
const newsApiService = require('../services/newsApiService');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// @desc    Search news articles
// @route   GET /api/news/search
// @access  Private
router.get('/search', async (req, res, next) => {
  try {
    const { q, page = 1, pageSize = 10 } = req.query;

    if (!q) {
      return res.status(400).json({
        status: 'error',
        message: 'Search query is required'
      });
    }

    const results = await newsApiService.searchNews(q, {
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    });

    res.status(200).json({
      status: 'success',
      data: {
        totalResults: results.totalResults,
        articles: results.articles,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get top headlines
// @route   GET /api/news/headlines
// @access  Private
router.get('/headlines', async (req, res, next) => {
  try {
    const { country = 'us', category, page = 1, pageSize = 10 } = req.query;

    const results = await newsApiService.getTopHeadlines({
      country,
      category,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    });

    res.status(200).json({
      status: 'success',
      data: {
        totalResults: results.totalResults,
        articles: results.articles,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Verify news source
// @route   POST /api/news/verify-source
// @access  Private
router.post('/verify-source', async (req, res, next) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        status: 'error',
        message: 'URL is required'
      });
    }

    const result = await newsApiService.checkSourceCredibility(url);

    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
