const storage = require('../utils/inMemoryStorage');

class Analysis {
  static async create(analysisData) {
    return storage.createAnalysis(analysisData);
  }

  static async find(query) {
    // This is a simplified version - just returns empty for now
    return [];
  }

  static async findById(id) {
    return storage.findAnalysisById(id);
  }

  static async countDocuments(query) {
    if (query.user) {
      const result = storage.findAnalysesByUser(query.user, 1, 999999);
      return result.total;
    }
    return 0;
  }

  static async aggregate(pipeline) {
    // Simplified aggregation for stats
    const match = pipeline.find(p => p.$match);
    if (match && match.$match.user) {
      const stats = storage.getAnalysisStats(match.$match.user);
      
      const group = pipeline.find(p => p.$group);
      if (group) {
        if (group.$group._id === '$verdict') {
          return stats.verdictDistribution;
        } else if (group.$group._id === null) {
          return [{ _id: null, avgScore: stats.averageCredibilityScore }];
        }
      }
    }
    return [];
  }
}

// Add query builder methods
Analysis.prototype.sort = function() { return this; };
Analysis.prototype.skip = function() { return this; };
Analysis.prototype.limit = function() { return this; };
Analysis.prototype.select = function() { return this; };
Analysis.prototype.deleteOne = function() { 
  if (this._id) {
    storage.deleteAnalysis(this._id);
  }
  return Promise.resolve();
};

module.exports = Analysis;
