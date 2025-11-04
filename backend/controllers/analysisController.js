// Use in-memory storage instead of MongoDB
const Analysis = require('../models/AnalysisInMemory');
const storage = require('../utils/inMemoryStorage');
const newsAnalyzer = require('../services/newsAnalyzer');
const newsApiService = require('../services/newsApiService');
const { validationResult } = require('express-validator');

// @desc    Analyze news from text
// @route   POST /api/analysis/text
// @access  Private
exports.analyzeText = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }

    const { title, content, source } = req.body;

    // Perform analysis
    const analysisResult = await newsAnalyzer.analyzeText(title, content);

    // Get related articles from NewsAPI
    const newsApiResults = await newsApiService.verifyNews(title, content);

    // Save analysis to database
    const analysis = await Analysis.create({
      user: req.user.id,
      inputType: 'text',
      inputContent: content,
      title,
      source: source || 'User Input',
      credibilityScore: analysisResult.credibilityScore,
      verdict: analysisResult.verdict,
      reasons: analysisResult.reasons,
      newsApiResults: {
        totalResults: newsApiResults.totalResults,
        relatedArticles: newsApiResults.articles.slice(0, 5)
      },
      analysisMetadata: {
        processingTime: analysisResult.processingTime,
        apiCalls: 1,
        confidence: analysisResult.confidence
      }
    });

    res.status(200).json({
      status: 'success',
      data: {
        analysis: {
          id: analysis._id,
          credibilityScore: analysis.credibilityScore,
          verdict: analysis.verdict,
          reasons: analysis.reasons,
          relatedArticles: analysis.newsApiResults.relatedArticles,
          confidence: analysis.analysisMetadata.confidence,
          createdAt: analysis.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Text analysis error:', error);
    next(error);
  }
};

// @desc    Analyze news from URL
// @route   POST /api/analysis/url
// @access  Private
exports.analyzeUrl = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }

    const { url } = req.body;

    // Perform URL analysis
    const analysisResult = await newsAnalyzer.analyzeUrl(url);

    // Extract domain for additional info
    const domain = newsApiService.extractDomain(url);

    // Save analysis to database
    const analysis = await Analysis.create({
      user: req.user.id,
      inputType: 'url',
      inputContent: url,
      title: `Analysis of ${domain}`,
      source: domain,
      credibilityScore: analysisResult.credibilityScore,
      verdict: analysisResult.verdict,
      reasons: analysisResult.reasons,
      newsApiResults: {
        totalResults: 0,
        relatedArticles: []
      },
      analysisMetadata: {
        processingTime: analysisResult.processingTime,
        apiCalls: 1,
        confidence: analysisResult.confidence
      }
    });

    res.status(200).json({
      status: 'success',
      data: {
        analysis: {
          id: analysis._id,
          url,
          domain,
          credibilityScore: analysis.credibilityScore,
          verdict: analysis.verdict,
          reasons: analysis.reasons,
          confidence: analysis.analysisMetadata.confidence,
          createdAt: analysis.createdAt
        }
      }
    });
  } catch (error) {
    console.error('URL analysis error:', error);
    next(error);
  }
};

// @desc    Get user's analysis history
// @route   GET /api/analysis/history
// @access  Private
exports.getHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = storage.findAnalysesByUser(req.user.id, page, limit);
    const analyses = result.analyses;
    const total = result.total;

    res.status(200).json({
      status: 'success',
      data: {
        analyses,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single analysis by ID
// @route   GET /api/analysis/:id
// @access  Private
exports.getAnalysis = async (req, res, next) => {
  try {
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({
        status: 'error',
        message: 'Analysis not found'
      });
    }

    // Make sure user owns the analysis
    if (analysis.user != req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to access this analysis'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { analysis }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete analysis
// @route   DELETE /api/analysis/:id
// @access  Private
exports.deleteAnalysis = async (req, res, next) => {
  try {
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({
        status: 'error',
        message: 'Analysis not found'
      });
    }

    // Make sure user owns the analysis
    if (analysis.user != req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to delete this analysis'
      });
    }

    storage.deleteAnalysis(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Analysis deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get analysis statistics
// @route   GET /api/analysis/stats
// @access  Private
exports.getStats = async (req, res, next) => {
  try {
    const stats = storage.getAnalysisStats(req.user.id);

    res.status(200).json({
      status: 'success',
      data: stats
    });
  } catch (error) {
    next(error);
  }
};
