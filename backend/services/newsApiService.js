const axios = require('axios');

class NewsApiService {
  constructor() {
    this.apiKey = process.env.NEWS_API_KEY;
    this.baseUrl = process.env.NEWS_API_BASE_URL || 'https://newsapi.org/v2';
  }

  /**
   * Search for news articles by query
   */
  async searchNews(query, options = {}) {
    try {
      const params = {
        q: query,
        apiKey: this.apiKey,
        language: options.language || 'en',
        sortBy: options.sortBy || 'relevancy',
        pageSize: options.pageSize || 10,
        page: options.page || 1
      };

      const response = await axios.get(`${this.baseUrl}/everything`, { params });
      return response.data;
    } catch (error) {
      console.error('NewsAPI search error:', error.response?.data || error.message);
      throw new Error('Failed to search news articles');
    }
  }

  /**
   * Get top headlines
   */
  async getTopHeadlines(options = {}) {
    try {
      const params = {
        apiKey: this.apiKey,
        country: options.country || 'us',
        category: options.category,
        pageSize: options.pageSize || 10,
        page: options.page || 1
      };

      const response = await axios.get(`${this.baseUrl}/top-headlines`, { params });
      return response.data;
    } catch (error) {
      console.error('NewsAPI headlines error:', error.response?.data || error.message);
      throw new Error('Failed to fetch top headlines');
    }
  }

  /**
   * Verify news by searching for similar articles
   */
  async verifyNews(title, content) {
    try {
      // Search for articles with similar title
      const searchQuery = title.substring(0, 100); // Limit query length
      const results = await this.searchNews(searchQuery, { pageSize: 20 });

      return {
        totalResults: results.totalResults,
        articles: results.articles.map(article => ({
          title: article.title,
          source: article.source.name,
          url: article.url,
          publishedAt: article.publishedAt,
          description: article.description,
          author: article.author
        }))
      };
    } catch (error) {
      console.error('News verification error:', error.message);
      return {
        totalResults: 0,
        articles: []
      };
    }
  }

  /**
   * Extract domain from URL
   */
  extractDomain(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch (error) {
      return null;
    }
  }

  /**
   * Check if source is credible based on NewsAPI sources
   */
  async checkSourceCredibility(sourceUrl) {
    try {
      const domain = this.extractDomain(sourceUrl);
      if (!domain) return { credible: false, reason: 'Invalid URL' };

      // Get all sources from NewsAPI
      const response = await axios.get(`${this.baseUrl}/sources`, {
        params: { apiKey: this.apiKey }
      });

      const sources = response.data.sources;
      const matchingSource = sources.find(source => 
        source.url.includes(domain) || domain.includes(source.id)
      );

      if (matchingSource) {
        return {
          credible: true,
          source: matchingSource,
          reason: `Verified source: ${matchingSource.name}`
        };
      }

      return {
        credible: false,
        reason: 'Source not found in verified news sources'
      };
    } catch (error) {
      console.error('Source credibility check error:', error.message);
      return {
        credible: false,
        reason: 'Unable to verify source'
      };
    }
  }
}

module.exports = new NewsApiService();
