// Temporary in-memory storage (no MongoDB required)
// WARNING: All data will be lost when server restarts!

class InMemoryStorage {
  constructor() {
    this.users = [];
    this.analyses = [];
    this.userIdCounter = 1;
    this.analysisIdCounter = 1;
  }

  // User methods
  createUser(userData) {
    const user = {
      _id: this.userIdCounter++,
      ...userData,
      createdAt: new Date(),
      lastLogin: null
    };
    this.users.push(user);
    return user;
  }

  findUserByEmail(email) {
    return this.users.find(u => u.email === email);
  }

  findUserById(id) {
    return this.users.find(u => u._id == id);
  }

  updateUser(id, updates) {
    const user = this.findUserById(id);
    if (user) {
      Object.assign(user, updates);
    }
    return user;
  }

  // Analysis methods
  createAnalysis(analysisData) {
    const analysis = {
      _id: this.analysisIdCounter++,
      ...analysisData,
      createdAt: new Date()
    };
    this.analyses.push(analysis);
    return analysis;
  }

  findAnalysesByUser(userId, page = 1, limit = 10) {
    const userAnalyses = this.analyses.filter(a => a.user == userId);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      analyses: userAnalyses.slice(startIndex, endIndex),
      total: userAnalyses.length
    };
  }

  findAnalysisById(id) {
    return this.analyses.find(a => a._id == id);
  }

  deleteAnalysis(id) {
    const index = this.analyses.findIndex(a => a._id == id);
    if (index > -1) {
      this.analyses.splice(index, 1);
      return true;
    }
    return false;
  }

  getAnalysisStats(userId) {
    const userAnalyses = this.analyses.filter(a => a.user == userId);
    
    const verdictStats = {};
    userAnalyses.forEach(a => {
      verdictStats[a.verdict] = (verdictStats[a.verdict] || 0) + 1;
    });

    const avgScore = userAnalyses.length > 0
      ? userAnalyses.reduce((sum, a) => sum + a.credibilityScore, 0) / userAnalyses.length
      : 0;

    return {
      totalAnalyses: userAnalyses.length,
      verdictDistribution: Object.entries(verdictStats).map(([verdict, count]) => ({
        _id: verdict,
        count
      })),
      averageCredibilityScore: avgScore
    };
  }
}

module.exports = new InMemoryStorage();
