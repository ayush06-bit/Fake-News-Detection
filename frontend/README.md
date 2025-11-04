# NewsAuth - News Authentication Platform

A professional React-based web application for verifying news authenticity using AI-powered analysis.

## Features

- **Landing Page**: Comprehensive information about the platform with modern UI
- **User Authentication**: Secure login and registration system
- **News Analysis**: Submit news via text or URL for credibility verification
- **Detailed Results**: Get comprehensive analysis with credibility scores and recommendations
- **Responsive Design**: Fully responsive across all devices
- **Modern UI/UX**: Professional design with smooth animations and transitions

## Tech Stack

- **React 18.2.0**: Modern React with hooks
- **React Router DOM 6.20.0**: Client-side routing
- **CSS3**: Custom styling with CSS variables and animations
- **Google Fonts**: Inter font family for professional typography

## Project Structure

```
fake_news_detect/
├── public/
│   └── index.html
├── src/
│   ├── pages/
│   │   ├── LandingPage.js
│   │   ├── LandingPage.css
│   │   ├── LoginPage.js
│   │   ├── LoginPage.css
│   │   ├── MainPage.js
│   │   ├── MainPage.css
│   │   ├── ResultsPage.js
│   │   └── ResultsPage.css
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## Usage

1. **Landing Page**: Visit the home page to learn about the platform
2. **Sign In/Sign Up**: Click "Get Started" to access the login page
3. **Analyze News**: 
   - Choose between text input or URL input
   - Paste news content or provide a URL
   - Click "Analyze News" to get results
4. **View Results**: Review the comprehensive analysis with credibility scores and recommendations

## Pages

### 1. Landing Page (`/`)
- Hero section with call-to-action
- Features showcase
- How it works section
- Statistics display
- Footer with branding

### 2. Login Page (`/login`)
- Email/password authentication
- Toggle between login and signup
- Form validation
- Error handling
- Back to home navigation

### 3. Main Analysis Page (`/analyze`)
- Protected route (requires authentication)
- Toggle between text and URL input
- Real-time character count
- Loading states with progress indicators
- Input validation

### 4. Results Page (`/results`)
- Protected route (requires authentication)
- Credibility score visualization
- Analysis breakdown with metrics
- Key findings list
- Recommendations section
- Option to analyze another article

## Authentication

The current implementation uses a simple client-side authentication system for demonstration purposes. In a production environment, you should:

- Implement proper backend authentication
- Use secure password hashing
- Implement JWT tokens or session management
- Add password reset functionality
- Implement OAuth providers (Google, Facebook, etc.)

## Styling

The application uses:
- CSS Variables for consistent theming
- Flexbox and Grid for layouts
- CSS animations for smooth transitions
- Responsive design with media queries
- Custom scrollbar styling

## Color Scheme

- Primary: `#2563eb` (Blue)
- Secondary: `#10b981` (Green)
- Danger: `#ef4444` (Red)
- Warning: `#f59e0b` (Orange)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- Backend API integration
- Real AI/ML model integration
- User dashboard with history
- Export results as PDF
- Social sharing features
- Dark mode support
- Multi-language support
- Advanced analytics

## License

This project is created for educational purposes.

## Author

Professional Frontend Developer

---

**Note**: This is a frontend demonstration. For production use, integrate with a real backend API and AI/ML service for news verification.
