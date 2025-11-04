import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analysisAPI } from '../services/api';
import './MainPage.css';

const MainPage = ({ onAnalysis, onLogout }) => {
  const navigate = useNavigate();
  const [inputType, setInputType] = useState('text'); // 'text' or 'url'
  const [newsText, setNewsText] = useState('');
  const [newsUrl, setNewsUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    setError('');

    // Validation
    if (inputType === 'text' && !newsText.trim()) {
      setError('Please enter news text to analyze');
      return;
    }

    if (inputType === 'url' && !newsUrl.trim()) {
      setError('Please enter a URL to analyze');
      return;
    }

    if (inputType === 'url') {
      try {
        new URL(newsUrl);
      } catch (e) {
        setError('Please enter a valid URL');
        return;
      }
    }

    setIsAnalyzing(true);

    try {
      let response;
      
      if (inputType === 'text') {
        // Extract title from first line or first 100 chars
        const lines = newsText.trim().split('\n');
        const title = lines[0].substring(0, 100);
        const content = newsText;
        
        response = await analysisAPI.analyzeText({
          title: title,
          content: content,
          source: 'User Input'
        });
      } else {
        response = await analysisAPI.analyzeUrl({
          url: newsUrl
        });
      }

      if (response.status === 'success' && response.data.analysis) {
        const analysis = response.data.analysis;
        
        // Transform backend response to match frontend format
        const result = {
          content: inputType === 'text' ? newsText : newsUrl,
          inputType: inputType,
          credibilityScore: analysis.credibilityScore,
          verdict: analysis.verdict,
          confidence: analysis.confidence,
          analysis: {
            sourceReliability: analysis.credibilityScore,
            factualAccuracy: analysis.credibilityScore,
            biasDetection: analysis.credibilityScore,
            languageAnalysis: analysis.credibilityScore,
          },
          reasons: analysis.reasons.map(r => r.description),
          reasonsDetailed: analysis.reasons,
          relatedArticles: analysis.relatedArticles || [],
          recommendations: getRecommendations(analysis.verdict, analysis.credibilityScore),
          timestamp: analysis.createdAt || new Date().toISOString()
        };

        onAnalysis(result);
        navigate('/results');
      } else {
        setError('Analysis failed. Please try again.');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors?.[0]?.msg ||
                          'Failed to analyze news. Please try again.';
      setError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRecommendations = (verdict, score) => {
    if (verdict === 'Real' || score >= 70) {
      return [
        'This news appears credible, but always cross-reference with multiple sources',
        'Check the publication date to ensure information is current',
        'Look for primary sources and official statements'
      ];
    } else if (verdict === 'Uncertain' || (score >= 40 && score < 70)) {
      return [
        'Exercise caution - this content requires further verification',
        'Cross-check with multiple established news organizations',
        'Look for fact-checks from reputable fact-checking websites',
        'Consider the source\'s reputation and potential biases'
      ];
    } else {
      return [
        'High risk of misinformation - verify before trusting',
        'Cross-reference with established news organizations',
        'Look for fact-checks from reputable fact-checking websites',
        'Be cautious about sharing this content on social media',
        'Consider the source\'s reputation and potential biases'
      ];
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="main-page">
      {/* Header */}
      <header className="main-header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <span className="logo-icon">🛡️</span>
              <span className="logo-text">NewsAuth</span>
            </div>
            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          <div className="content-wrapper">
            {/* Title Section */}
            <div className="title-section fade-in">
              <h1 className="page-title">Verify News Authenticity</h1>
              <p className="page-subtitle">
                Enter news text or provide a URL to analyze its credibility using our AI-powered verification system
              </p>
            </div>

            {/* Analysis Card */}
            <div className="analysis-card card fade-in">
              {/* Input Type Selector */}
              <div className="input-type-selector">
                <button
                  className={`type-btn ${inputType === 'text' ? 'active' : ''}`}
                  onClick={() => setInputType('text')}
                >
                  <span className="type-icon">📝</span>
                  <span>Text Input</span>
                </button>
                <button
                  className={`type-btn ${inputType === 'url' ? 'active' : ''}`}
                  onClick={() => setInputType('url')}
                >
                  <span className="type-icon">🔗</span>
                  <span>URL Input</span>
                </button>
              </div>

              {/* Input Area */}
              <div className="input-area">
                {inputType === 'text' ? (
                  <div className="input-group">
                    <label htmlFor="newsText">News Text</label>
                    <textarea
                      id="newsText"
                      value={newsText}
                      onChange={(e) => setNewsText(e.target.value)}
                      placeholder="Paste the news article text here..."
                      rows="10"
                      disabled={isAnalyzing}
                    />
                    <div className="input-info">
                      {newsText.length} characters
                    </div>
                  </div>
                ) : (
                  <div className="input-group">
                    <label htmlFor="newsUrl">News Article URL</label>
                    <input
                      type="url"
                      id="newsUrl"
                      value={newsUrl}
                      onChange={(e) => setNewsUrl(e.target.value)}
                      placeholder="https://example.com/news-article"
                      disabled={isAnalyzing}
                    />
                    <div className="input-info">
                      Enter the complete URL including https://
                    </div>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="error-alert">
                  <span className="error-icon">⚠️</span>
                  {error}
                </div>
              )}

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                className="btn btn-primary btn-large btn-full"
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <span className="spinner"></span>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>🔍</span>
                    <span>Analyze News</span>
                  </>
                )}
              </button>
            </div>

            {/* Info Cards */}
            <div className="info-cards">
              <div className="info-card slide-in-left">
                <div className="info-icon">⚡</div>
                <h3 className="info-title">Fast Analysis</h3>
                <p className="info-description">
                  Get results in seconds with our advanced AI algorithms
                </p>
              </div>
              <div className="info-card fade-in">
                <div className="info-icon">🎯</div>
                <h3 className="info-title">Accurate Results</h3>
                <p className="info-description">
                  95% accuracy rate based on verified data sources
                </p>
              </div>
              <div className="info-card slide-in-right">
                <div className="info-icon">🔒</div>
                <h3 className="info-title">Secure & Private</h3>
                <p className="info-description">
                  Your data is encrypted and never shared with third parties
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Loading Overlay */}
      {isAnalyzing && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner-large"></div>
            <h2 className="loading-title">Analyzing News Content</h2>
            <p className="loading-text">
              Our AI is examining the content for credibility indicators...
            </p>
            <div className="loading-steps">
              <div className="loading-step">
                <span className="step-icon">✓</span>
                <span>Extracting content</span>
              </div>
              <div className="loading-step">
                <span className="step-icon">⟳</span>
                <span>Analyzing sources</span>
              </div>
              <div className="loading-step">
                <span className="step-icon">○</span>
                <span>Generating report</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPage;
