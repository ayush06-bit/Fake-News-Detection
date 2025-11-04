# Fake News Detection - Complete Setup Guide

## ✅ What's Been Done

The application now has **real authentication** and **NewsAPI integration**. No more mock data!

### Backend Features
- ✅ JWT-based authentication with bcrypt password hashing
- ✅ MongoDB database for users and analysis history
- ✅ NewsAPI integration for news verification
- ✅ Intelligent analysis with detailed reasoning
- ✅ Rate limiting and security features

### Frontend Features
- ✅ Connected to real backend API
- ✅ Token-based authentication with localStorage
- ✅ Real news analysis using NewsAPI
- ✅ Detailed credibility scores and reasons

## 🚀 How to Run

### Prerequisites
1. **MongoDB** - Must be running on `mongodb://localhost:27017`
2. **NewsAPI Key** - Already configured in backend `.env`

### Step 1: Start MongoDB
Make sure MongoDB is running. If not installed:
- Download from: https://www.mongodb.com/try/download/community
- Start the service

### Step 2: Start Backend (Already Running ✅)
The backend is already running on port 5000. If you need to restart:
```bash
cd backend
npm run dev
```

### Step 3: Start Frontend
```bash
cd frontend
npm start
```

The frontend will open at `http://localhost:3000`

## 🔐 How Authentication Works Now

### Registration
1. Go to `/login`
2. Click "Sign Up"
3. Enter name, email, and password (min 6 characters)
4. Backend creates user in MongoDB with hashed password
5. Returns JWT token
6. Token stored in localStorage
7. Redirects to `/analyze`

### Login
1. Go to `/login`
2. Enter email and password
3. Backend validates credentials against MongoDB
4. Returns JWT token if valid
5. Token stored in localStorage
6. Redirects to `/analyze`

**Important**: You must create an account first! The system no longer accepts any random credentials.

## 📰 How News Analysis Works

### Text Analysis
1. User enters news title and content
2. Frontend sends to `POST /api/analysis/text`
3. Backend performs:
   - **Language Analysis**: Checks for sensational keywords
   - **Cross-Reference**: Searches NewsAPI for similar articles
   - **Source Verification**: Validates against credible sources
   - **Content Quality**: Analyzes structure and grammar
4. Returns credibility score (0-100) with detailed reasons
5. Saves analysis to MongoDB

### URL Analysis
1. User enters news article URL
2. Frontend sends to `POST /api/analysis/url`
3. Backend performs:
   - **Source Verification**: Checks if domain is in NewsAPI
   - **Domain Analysis**: Validates against known credible sources
   - **URL Structure**: Checks HTTPS, suspicious TLDs
   - **Domain Reputation**: Searches NewsAPI for domain history
4. Returns credibility score with reasons
5. Saves analysis to MongoDB

## 🎯 Credibility Scoring

**Score Ranges:**
- **70-100**: Real (Credible)
- **40-69**: Uncertain (Needs Verification)
- **0-39**: Fake (High Risk)

**Factors Analyzed:**
- Language patterns (sensational vs. neutral)
- Cross-references with verified news sources
- Source credibility and reputation
- Content quality and structure
- URL legitimacy

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (requires token)

### Analysis
- `POST /api/analysis/text` - Analyze news text (requires token)
- `POST /api/analysis/url` - Analyze news URL (requires token)
- `GET /api/analysis/history` - Get analysis history (requires token)
- `GET /api/analysis/stats` - Get statistics (requires token)

### News
- `GET /api/news/search?q=query` - Search news (requires token)
- `GET /api/news/headlines` - Get top headlines (requires token)
- `POST /api/news/verify-source` - Verify source (requires token)

## 🔧 Configuration Files

### Backend `.env`
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/fake_news_detect
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NEWS_API_KEY=623e2a6edad64f6a897bdca877ef5e3a
FRONTEND_URL=http://localhost:3000
```

### Frontend `.env`
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🧪 Testing the Application

### 1. Test Registration
```bash
# Use the frontend or test with curl:
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Test Analysis (with token)
```bash
curl -X POST http://localhost:5000/api/analysis/text \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Breaking News: Scientists Discover New Planet",
    "content": "Scientists at NASA have announced the discovery of a new Earth-like planet in a nearby solar system. The planet, located 100 light years away, shows signs of water and a breathable atmosphere.",
    "source": "Science News"
  }'
```

## 🐛 Troubleshooting

### "Cannot connect to backend"
- Check if backend is running on port 5000
- Check MongoDB is running
- Verify `.env` files are configured

### "Invalid credentials"
- Make sure you've created an account first
- Password must be at least 6 characters
- Email must be valid format

### "NewsAPI error"
- Check if NEWS_API_KEY is set in backend `.env`
- Free tier has 100 requests/day limit
- Verify API key at https://newsapi.org/

### "Token expired"
- Tokens expire after 7 days
- Login again to get new token
- Clear localStorage if needed

## 📝 Database Structure

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user/admin),
  createdAt: Date,
  lastLogin: Date
}
```

### Analysis Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  inputType: String (text/url),
  inputContent: String,
  title: String,
  source: String,
  credibilityScore: Number (0-100),
  verdict: String (Real/Fake/Uncertain),
  reasons: [{
    category: String,
    description: String,
    impact: String (positive/negative/neutral)
  }],
  newsApiResults: {
    totalResults: Number,
    relatedArticles: Array
  },
  createdAt: Date
}
```

## 🎉 You're All Set!

The application is now fully functional with:
- ✅ Real authentication (no more accepting any password)
- ✅ NewsAPI integration for verification
- ✅ Detailed analysis with reasoning
- ✅ Persistent storage in MongoDB
- ✅ Secure JWT tokens
- ✅ Rate limiting and security

Start the frontend with `npm start` in the frontend folder and test it out!
