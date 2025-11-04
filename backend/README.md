# Fake News Detection Backend API

A robust Node.js backend API for fake news detection with user authentication and NewsAPI integration.

## Features

- 🔐 **User Authentication**: JWT-based authentication with bcrypt password hashing
- 📰 **NewsAPI Integration**: Verify news authenticity using NewsAPI
- 🔍 **Intelligent Analysis**: Multi-factor news credibility analysis
- 📊 **Detailed Reasoning**: Provides comprehensive reasons for credibility scores
- 📝 **Analysis History**: Track and manage past analyses
- 🛡️ **Security**: Rate limiting, helmet security headers, input validation
- 💾 **MongoDB Database**: Persistent storage for users and analyses

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken) + bcrypt
- **External API**: NewsAPI
- **Validation**: express-validator
- **Security**: helmet, express-rate-limit, cors

## Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── authController.js    # Authentication logic
│   └── analysisController.js # News analysis logic
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   ├── errorHandler.js      # Global error handler
│   └── rateLimiter.js       # Rate limiting configuration
├── models/
│   ├── User.js              # User schema
│   └── Analysis.js          # Analysis schema
├── routes/
│   ├── authRoutes.js        # Authentication routes
│   ├── analysisRoutes.js    # Analysis routes
│   └── newsRoutes.js        # NewsAPI routes
├── services/
│   ├── newsApiService.js    # NewsAPI integration
│   └── newsAnalyzer.js      # News analysis engine
├── .env.example             # Environment variables template
├── .gitignore
├── package.json
├── server.js                # Application entry point
└── README.md
```

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   - Copy `.env.example` to `.env`
   - Fill in your configuration:
     ```env
     PORT=5000
     NODE_ENV=development
     MONGODB_URI=mongodb://localhost:27017/fake_news_detect
     JWT_SECRET=your_super_secret_jwt_key
     JWT_EXPIRE=7d
     NEWS_API_KEY=your_newsapi_key_here
     FRONTEND_URL=http://localhost:3000
     ```

3. **Get NewsAPI Key**:
   - Visit [https://newsapi.org/](https://newsapi.org/)
   - Sign up for a free account
   - Copy your API key to `.env`

4. **Install and start MongoDB**:
   - Download from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
   - Start MongoDB service

## Running the Server

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | Login user | No |
| GET | `/me` | Get current user | Yes |
| PUT | `/updatedetails` | Update user details | Yes |
| PUT | `/updatepassword` | Update password | Yes |

### Analysis Routes (`/api/analysis`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/text` | Analyze news from text | Yes |
| POST | `/url` | Analyze news from URL | Yes |
| GET | `/history` | Get analysis history | Yes |
| GET | `/stats` | Get analysis statistics | Yes |
| GET | `/:id` | Get single analysis | Yes |
| DELETE | `/:id` | Delete analysis | Yes |

### News Routes (`/api/news`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/search` | Search news articles | Yes |
| GET | `/headlines` | Get top headlines | Yes |
| POST | `/verify-source` | Verify news source | Yes |

## API Usage Examples

### 1. Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### 2. Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### 3. Analyze News Text
```bash
POST /api/analysis/text
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "Breaking: Major Discovery in Science",
  "content": "Scientists have made a groundbreaking discovery...",
  "source": "Science Daily"
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "analysis": {
      "credibilityScore": 75,
      "verdict": "Real",
      "reasons": [
        {
          "category": "Language Analysis",
          "description": "No sensational or clickbait language detected",
          "impact": "positive"
        },
        {
          "category": "Cross-Reference Check",
          "description": "Found 15 similar articles from verified sources",
          "impact": "positive"
        }
      ],
      "relatedArticles": [...],
      "confidence": 85
    }
  }
}
```

### 4. Analyze URL
```bash
POST /api/analysis/url
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "url": "https://www.bbc.com/news/article-123"
}
```

## Analysis Algorithm

The news analyzer uses multiple factors to determine credibility:

1. **Language Analysis** (-15 to +10 points)
   - Checks for sensational/clickbait keywords
   - Evaluates tone and writing style

2. **Cross-Reference Check** (-20 to +20 points)
   - Searches NewsAPI for similar articles
   - Verifies with multiple sources

3. **Source Verification** (-20 to +25 points)
   - Checks against known credible sources
   - Validates domain reputation

4. **Content Quality** (-10 to +10 points)
   - Analyzes article length
   - Checks grammar and structure

5. **URL Analysis** (-15 to +5 points)
   - Validates HTTPS protocol
   - Checks for suspicious domains

**Verdict Thresholds**:
- **Real**: Score ≥ 70
- **Uncertain**: Score 40-69
- **Fake**: Score < 40

## Security Features

- JWT authentication with secure token generation
- Password hashing with bcrypt (10 salt rounds)
- Rate limiting on sensitive endpoints
- Input validation and sanitization
- Helmet security headers
- CORS configuration
- MongoDB injection prevention

## Error Handling

All errors return consistent JSON format:
```json
{
  "status": "error",
  "message": "Error description"
}
```

## Rate Limits

- **Authentication routes**: 5 requests per 15 minutes
- **Analysis routes**: 10 requests per minute

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment mode | development |
| MONGODB_URI | MongoDB connection string | - |
| JWT_SECRET | JWT signing secret | - |
| JWT_EXPIRE | JWT expiration time | 7d |
| NEWS_API_KEY | NewsAPI key | - |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:3000 |

## Development

Install nodemon for auto-reload:
```bash
npm install -g nodemon
npm run dev
```

## Testing

The API can be tested using:
- Postman
- Thunder Client (VS Code extension)
- curl commands
- Frontend application

## Troubleshooting

**MongoDB Connection Error**:
- Ensure MongoDB is running
- Check MONGODB_URI in `.env`

**NewsAPI Errors**:
- Verify API key is valid
- Check rate limits (free tier: 100 requests/day)

**JWT Errors**:
- Ensure JWT_SECRET is set
- Check token format: `Bearer <token>`

## License

ISC

## Support

For issues and questions, please create an issue in the repository.
