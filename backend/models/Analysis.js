const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  inputType: {
    type: String,
    enum: ['text', 'url'],
    required: true
  },
  inputContent: {
    type: String,
    required: true
  },
  title: {
    type: String
  },
  source: {
    type: String
  },
  credibilityScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  verdict: {
    type: String,
    enum: ['Real', 'Fake', 'Uncertain'],
    required: true
  },
  reasons: [{
    category: String,
    description: String,
    impact: {
      type: String,
      enum: ['positive', 'negative', 'neutral']
    }
  }],
  newsApiResults: {
    totalResults: Number,
    relatedArticles: [{
      title: String,
      source: String,
      url: String,
      publishedAt: Date
    }]
  },
  analysisMetadata: {
    processingTime: Number,
    apiCalls: Number,
    confidence: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
analysisSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Analysis', analysisSchema);
