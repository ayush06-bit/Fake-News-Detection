import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ResultsPage.css';

const ResultsPage = ({ result, onLogout }) => {
  const navigate = useNavigate();

  if (!result) {
    return null;
  }

  const getVerdictClass = () => {
    if (result.credibilityScore >= 70) return 'verdict-high';
    if (result.credibilityScore >= 50) return 'verdict-medium';
    return 'verdict-low';
  };

  const getScoreColor = (score) => {
    if (score >= 70) return '#10b981';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const handleNewAnalysis = () => {
    navigate('/analyze');
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="results-page">
      {/* Header */}
      <header className="main-header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <span className="logo-icon">🛡️</span>
              <span className="logo-text">NewsAuth</span>
            </div>
            <div className="header-actions">
              <button onClick={handleNewAnalysis} className="btn btn-primary btn-sm">
                New Analysis
              </button>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="results-content">
        <div className="container">
          <div className="results-wrapper">
            {/* Title */}
            <div className="results-header fade-in">
              <h1 className="results-title">Analysis Results</h1>
              <p className="results-subtitle">
                Comprehensive credibility analysis of your submitted content
              </p>
            </div>

            {/* Verdict Card */}
            <div className={`verdict-card card fade-in ${getVerdictClass()}`}>
              <div className="verdict-content">
                <div className="verdict-icon">
                  {result.credibilityScore >= 50 ? '✓' : '⚠'}
                </div>
                <div className="verdict-info">
                  <h2 className="verdict-label">Verdict</h2>
                  <h3 className="verdict-text">{result.verdict}</h3>
                </div>
                <div className="credibility-score">
                  <div className="score-circle">
                    <svg className="score-svg" viewBox="0 0 120 120">
                      <circle
                        className="score-bg"
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                      />
                      <circle
                        className="score-progress"
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        stroke={getScoreColor(result.credibilityScore)}
                        strokeWidth="8"
                        strokeDasharray={`${result.credibilityScore * 3.39} 339`}
                        strokeLinecap="round"
                        transform="rotate(-90 60 60)"
                      />
                    </svg>
                    <div className="score-value">
                      <span className="score-number">{result.credibilityScore}</span>
                      <span className="score-max">/100</span>
                    </div>
                  </div>
                  <div className="score-label">Credibility Score</div>
                </div>
              </div>
            </div>

            {/* Content Preview */}
            <div className="content-preview card slide-in-left">
              <h3 className="section-title">
                <span className="title-icon">📄</span>
                Analyzed Content
              </h3>
              <div className="content-box">
                {result.inputType === 'url' ? (
                  <div className="url-preview">
                    <span className="url-label">URL:</span>
                    <a href={result.content} target="_blank" rel="noopener noreferrer" className="url-link">
                      {result.content}
                    </a>
                  </div>
                ) : (
                  <p className="text-preview">{result.content}</p>
                )}
              </div>
            </div>

            {/* Analysis Breakdown */}
            <div className="analysis-breakdown card slide-in-right">
              <h3 className="section-title">
                <span className="title-icon">📊</span>
                Analysis Breakdown
              </h3>
              <div className="metrics-grid">
                <div className="metric-item">
                  <div className="metric-header">
                    <span className="metric-name">Source Reliability</span>
                    <span className="metric-value">{result.analysis.sourceReliability}%</span>
                  </div>
                  <div className="metric-bar">
                    <div 
                      className="metric-fill" 
                      style={{
                        width: `${result.analysis.sourceReliability}%`,
                        backgroundColor: getScoreColor(result.analysis.sourceReliability)
                      }}
                    ></div>
                  </div>
                </div>
                <div className="metric-item">
                  <div className="metric-header">
                    <span className="metric-name">Factual Accuracy</span>
                    <span className="metric-value">{result.analysis.factualAccuracy}%</span>
                  </div>
                  <div className="metric-bar">
                    <div 
                      className="metric-fill" 
                      style={{
                        width: `${result.analysis.factualAccuracy}%`,
                        backgroundColor: getScoreColor(result.analysis.factualAccuracy)
                      }}
                    ></div>
                  </div>
                </div>
                <div className="metric-item">
                  <div className="metric-header">
                    <span className="metric-name">Bias Detection</span>
                    <span className="metric-value">{result.analysis.biasDetection}%</span>
                  </div>
                  <div className="metric-bar">
                    <div 
                      className="metric-fill" 
                      style={{
                        width: `${result.analysis.biasDetection}%`,
                        backgroundColor: getScoreColor(result.analysis.biasDetection)
                      }}
                    ></div>
                  </div>
                </div>
                <div className="metric-item">
                  <div className="metric-header">
                    <span className="metric-name">Language Analysis</span>
                    <span className="metric-value">{result.analysis.languageAnalysis}%</span>
                  </div>
                  <div className="metric-bar">
                    <div 
                      className="metric-fill" 
                      style={{
                        width: `${result.analysis.languageAnalysis}%`,
                        backgroundColor: getScoreColor(result.analysis.languageAnalysis)
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Findings */}
            <div className="key-findings card fade-in">
              <h3 className="section-title">
                <span className="title-icon">🔍</span>
                Key Findings
              </h3>
              <div className="findings-list">
                {result.reasons.map((reason, index) => (
                  <div key={index} className="finding-item">
                    <span className="finding-bullet">•</span>
                    <span className="finding-text">{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="recommendations card slide-in-left">
              <h3 className="section-title">
                <span className="title-icon">💡</span>
                Recommendations
              </h3>
              <div className="recommendations-list">
                {result.recommendations.map((recommendation, index) => (
                  <div key={index} className="recommendation-item">
                    <span className="recommendation-number">{index + 1}</span>
                    <span className="recommendation-text">{recommendation}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons fade-in">
              <button onClick={handleNewAnalysis} className="btn btn-primary btn-large">
                Analyze Another Article
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResultsPage;
