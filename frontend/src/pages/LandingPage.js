import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <div className="nav-content">
            <div className="logo">
              <span className="logo-icon">🛡️</span>
              <span className="logo-text">NewsAuth</span>
            </div>
            <Link to="/login" className="btn btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content fade-in">
            <h1 className="hero-title">
              Verify News Authenticity
              <span className="gradient-text"> with AI Power</span>
            </h1>
            <p className="hero-description">
              Combat misinformation with our advanced AI-powered news verification platform. 
              Get instant analysis and credibility scores for any news article or URL.
            </p>
            <div className="hero-buttons">
              <Link to="/login" className="btn btn-primary btn-large">
                Start Verifying
                <span>→</span>
              </Link>
              <a href="#features" className="btn btn-secondary btn-large">
                Learn More
              </a>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">10K+</div>
                <div className="stat-label">News Verified</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">95%</div>
                <div className="stat-label">Accuracy Rate</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">5K+</div>
                <div className="stat-label">Active Users</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Powerful Features</h2>
            <p className="section-description">
              Everything you need to verify news authenticity
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card slide-in-left">
              <div className="feature-icon">🤖</div>
              <h3 className="feature-title">AI-Powered Analysis</h3>
              <p className="feature-description">
                Advanced machine learning algorithms analyze news content for credibility and authenticity.
              </p>
            </div>
            <div className="feature-card fade-in">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Instant Results</h3>
              <p className="feature-description">
                Get comprehensive analysis results in seconds, not hours. Fast and reliable verification.
              </p>
            </div>
            <div className="feature-card slide-in-right">
              <div className="feature-icon">🔍</div>
              <h3 className="feature-title">Deep Source Check</h3>
              <p className="feature-description">
                Verify sources, cross-reference facts, and detect bias with our comprehensive analysis.
              </p>
            </div>
            <div className="feature-card slide-in-left">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Detailed Reports</h3>
              <p className="feature-description">
                Receive in-depth reports with credibility scores, reasoning, and supporting evidence.
              </p>
            </div>
            <div className="feature-card fade-in">
              <div className="feature-icon">🌐</div>
              <h3 className="feature-title">URL & Text Support</h3>
              <p className="feature-description">
                Analyze news from URLs or paste text directly. Flexible input options for your convenience.
              </p>
            </div>
            <div className="feature-card slide-in-right">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">Secure & Private</h3>
              <p className="feature-description">
                Your data is encrypted and secure. We prioritize your privacy and data protection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-description">
              Simple and straightforward process
            </p>
          </div>
          <div className="steps-container">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3 className="step-title">Sign In</h3>
                <p className="step-description">
                  Create your account or log in to access the verification platform.
                </p>
              </div>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3 className="step-title">Submit News</h3>
                <p className="step-description">
                  Paste the news text or provide a URL to the article you want to verify.
                </p>
              </div>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3 className="step-title">Get Results</h3>
                <p className="step-description">
                  Receive instant analysis with credibility scores and detailed reasoning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Fight Misinformation?</h2>
            <p className="cta-description">
              Join thousands of users who trust NewsAuth for accurate news verification
            </p>
            <Link to="/login" className="btn btn-primary btn-large">
              Get Started Now
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-left">
              <div className="logo">
                <span className="logo-icon">🛡️</span>
                <span className="logo-text">NewsAuth</span>
              </div>
              <p className="footer-description">
                Empowering truth through AI-powered news verification
              </p>
            </div>
            <div className="footer-right">
              <p>&copy; 2024 NewsAuth. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
