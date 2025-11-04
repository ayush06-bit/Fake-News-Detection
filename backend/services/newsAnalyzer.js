const newsApiService = require('./newsApiService');
const axios = require('axios');

class NewsAnalyzer {
  constructor() {
    this.suspiciousKeywords = [
      'shocking', 'unbelievable', 'miracle', 'secret', 'they don\'t want you to know',
      'click here', 'you won\'t believe', 'doctors hate', 'one weird trick'
    ];
    
    this.credibleSources = [
      'bbc.com', 'reuters.com', 'apnews.com', 'nytimes.com', 'washingtonpost.com',
      'theguardian.com', 'cnn.com', 'npr.org', 'bloomberg.com', 'wsj.com'
    ];
  }

  /**
   * Analyze news from text input
   */
  async analyzeText(title, content) {
    const startTime = Date.now();
    const reasons = [];
    let credibilityScore = 50; // Start with neutral score

    // 1. Check for sensational language
    const sensationalCheck = this.checkSensationalLanguage(title, content);
    if (sensationalCheck.found) {
      credibilityScore -= 15;
      reasons.push({
        category: 'Language Analysis',
        description: `Contains sensational keywords: ${sensationalCheck.keywords.join(', ')}`,
        impact: 'negative'
      });
    } else {
      credibilityScore += 10;
      reasons.push({
        category: 'Language Analysis',
        description: 'No sensational or clickbait language detected',
        impact: 'positive'
      });
    }

    // 2. Enhanced NewsAPI Verification (Increased Weightage)
    try {
      const newsApiResults = await newsApiService.verifyNews(title, content);
      
      if (newsApiResults.totalResults > 0) {
        const matchingArticles = newsApiResults.articles.slice(0, 10); // Increased from 5 to 10
        
        // Base score for finding any matches (increased from 20 to 30)
        let apiScore = 30;
        
        // Bonus for multiple matches (increased impact)
        if (newsApiResults.totalResults > 20) {
          apiScore += 15; // More matches = higher confidence
          reasons.push({
            category: 'Cross-Reference Check',
            description: `Found ${newsApiResults.totalResults}+ similar articles from verified sources`,
            impact: 'highly_positive'
          });
        } else if (newsApiResults.totalResults > 5) {
          apiScore += 10;
          reasons.push({
            category: 'Cross-Reference Check',
            description: `Found ${newsApiResults.totalResults} similar articles from verified sources`,
            impact: 'positive'
          });
        } else {
          reasons.push({
            category: 'Cross-Reference Check',
            description: `Found ${newsApiResults.totalResults} similar article(s)`,
            impact: 'slightly_positive'
          });
        }

        // Enhanced credible source verification
        const credibleMatches = matchingArticles.filter(article => 
          this.isCredibleSource(article.url)
        );

        // Increased impact of credible source verification
        if (credibleMatches.length >= 3) {
          apiScore += 25; // Increased from 15
          reasons.push({
            category: 'Source Verification',
            description: `Strong confirmation from ${credibleMatches.length} highly credible news organizations`,
            impact: 'highly_positive'
          });
        } else if (credibleMatches.length > 0) {
          apiScore += 15;
          reasons.push({
            category: 'Source Verification',
            description: `Confirmed by ${credibleMatches.length} credible source(s)`,
            impact: 'positive'
          });
        }
        
        credibilityScore += apiScore;
        
      } else {
        // More significant penalty for no matches (increased from -20 to -30)
        credibilityScore -= 30;
        reasons.push({
          category: 'Cross-Reference Check',
          description: 'No similar articles found in verified news databases - this may indicate unverified or false information',
          impact: 'negative'
        });
      }
    } catch (error) {
      console.error('NewsAPI verification failed:', error.message);
      // Slight negative impact for API failures (was neutral)
      credibilityScore -= 5;
      reasons.push({
        category: 'Cross-Reference Check',
        description: 'Temporary issue verifying with external sources - results may be less accurate',
        impact: 'slightly_negative'
      });
    }

    // 3. Check content quality
    const qualityCheck = this.checkContentQuality(content);
    credibilityScore += qualityCheck.score;
    reasons.push({
      category: 'Content Quality',
      description: qualityCheck.description,
      impact: qualityCheck.impact
    });

    // 4. Check for proper structure
    const structureCheck = this.checkArticleStructure(title, content);
    credibilityScore += structureCheck.score;
    reasons.push({
      category: 'Article Structure',
      description: structureCheck.description,
      impact: structureCheck.impact
    });

    // Normalize score to 0-100
    credibilityScore = Math.max(0, Math.min(100, credibilityScore));

    const processingTime = Date.now() - startTime;

    return {
      credibilityScore,
      verdict: this.getVerdict(credibilityScore),
      reasons,
      processingTime,
      confidence: this.calculateConfidence(reasons)
    };
  }

  /**
   * Analyze news from URL
   */
  async analyzeUrl(url) {
    const startTime = Date.now();
    const reasons = [];
    let credibilityScore = 50;

    // 1. Check source credibility
    const sourceCheck = await newsApiService.checkSourceCredibility(url);
    if (sourceCheck.credible) {
      credibilityScore += 25;
      reasons.push({
        category: 'Source Verification',
        description: sourceCheck.reason,
        impact: 'positive'
      });
    } else {
      credibilityScore -= 20;
      reasons.push({
        category: 'Source Verification',
        description: sourceCheck.reason,
        impact: 'negative'
      });
    }

    // 2. Check if URL is from known credible source
    if (this.isCredibleSource(url)) {
      credibilityScore += 20;
      reasons.push({
        category: 'Domain Analysis',
        description: 'URL belongs to a well-known credible news organization',
        impact: 'positive'
      });
    }

    // 3. Check URL structure
    const urlCheck = this.checkUrlStructure(url);
    credibilityScore += urlCheck.score;
    reasons.push({
      category: 'URL Analysis',
      description: urlCheck.description,
      impact: urlCheck.impact
    });

    // 4. Try to fetch and analyze content
    try {
      const domain = newsApiService.extractDomain(url);
      const newsResults = await newsApiService.searchNews(domain, { pageSize: 5 });
      
      if (newsResults.totalResults > 0) {
        credibilityScore += 15;
        reasons.push({
          category: 'Domain Reputation',
          description: `Domain has ${newsResults.totalResults} articles indexed in news databases`,
          impact: 'positive'
        });
      }
    } catch (error) {
      console.error('URL analysis error:', error.message);
    }

    credibilityScore = Math.max(0, Math.min(100, credibilityScore));
    const processingTime = Date.now() - startTime;

    return {
      credibilityScore,
      verdict: this.getVerdict(credibilityScore),
      reasons,
      processingTime,
      confidence: this.calculateConfidence(reasons)
    };
  }

  /**
   * Check for sensational language
   */
  checkSensationalLanguage(title, content) {
    const text = `${title} ${content}`.toLowerCase();
    const foundKeywords = this.suspiciousKeywords.filter(keyword => 
      text.includes(keyword.toLowerCase())
    );

    return {
      found: foundKeywords.length > 0,
      keywords: foundKeywords
    };
  }

  /**
   * Check if source is credible
   */
  isCredibleSource(url) {
    return this.credibleSources.some(source => url.includes(source));
  }

  /**
   * Check content quality
   */
  checkContentQuality(content) {
    const wordCount = content.split(/\s+/).length;
    const hasProperPunctuation = /[.!?]/.test(content);
    const hasCapitalization = /[A-Z]/.test(content);

    if (wordCount < 50) {
      return {
        score: -10,
        description: 'Content is too short for a legitimate news article',
        impact: 'negative'
      };
    }

    if (wordCount > 100 && hasProperPunctuation && hasCapitalization) {
      return {
        score: 10,
        description: 'Content shows proper structure and adequate length',
        impact: 'positive'
      };
    }

    return {
      score: 0,
      description: 'Content quality is acceptable',
      impact: 'neutral'
    };
  }

  /**
   * Check article structure
   */
  checkArticleStructure(title, content) {
    const hasTitle = title && title.length > 10;
    const hasContent = content && content.length > 100;
    const titleCapitalized = /^[A-Z]/.test(title);

    if (hasTitle && hasContent && titleCapitalized) {
      return {
        score: 10,
        description: 'Article has proper title and content structure',
        impact: 'positive'
      };
    }

    return {
      score: -5,
      description: 'Article structure is incomplete or poorly formatted',
      impact: 'negative'
    };
  }

  /**
   * Check URL structure
   */
  checkUrlStructure(url) {
    try {
      const urlObj = new URL(url);
      
      // Check for HTTPS
      if (urlObj.protocol !== 'https:') {
        return {
          score: -10,
          description: 'URL does not use secure HTTPS protocol',
          impact: 'negative'
        };
      }

      // Check for suspicious TLDs
      const suspiciousTlds = ['.tk', '.ml', '.ga', '.cf', '.gq'];
      if (suspiciousTlds.some(tld => urlObj.hostname.endsWith(tld))) {
        return {
          score: -15,
          description: 'URL uses a suspicious top-level domain',
          impact: 'negative'
        };
      }

      return {
        score: 5,
        description: 'URL structure appears legitimate',
        impact: 'positive'
      };
    } catch (error) {
      return {
        score: -10,
        description: 'Invalid or malformed URL',
        impact: 'negative'
      };
    }
  }

  /**
   * Get verdict based on credibility score
   */
  getVerdict(score) {
    if (score >= 70) return 'Real';
    if (score >= 40) return 'Uncertain';
    return 'Fake';
  }

  /**
   * Calculate confidence level
   */
  calculateConfidence(reasons) {
    const totalReasons = reasons.length;
    const positiveReasons = reasons.filter(r => r.impact === 'positive').length;
    const negativeReasons = reasons.filter(r => r.impact === 'negative').length;
    
    const confidence = Math.abs(positiveReasons - negativeReasons) / totalReasons * 100;
    return Math.min(100, Math.max(0, confidence));
  }
}

module.exports = new NewsAnalyzer();
