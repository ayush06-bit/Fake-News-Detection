// test-newsapi.js
const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const NEWS_API_KEY = process.env.NEWS_API_KEY || '623e2a6edad64f6a897bdca877ef5e3a';
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

console.log('🔍 Testing NewsAPI Connection...\n');
console.log('Using API Key:', NEWS_API_KEY ? `${NEWS_API_KEY.substring(0, 10)}...` : 'NOT FOUND');

async function testNewsAPI() {
  try {
    console.log('\n1. Testing search for "technology" articles...');
    const response = await axios.get(`${NEWS_API_BASE_URL}/everything`, {
      params: {
        q: 'technology',
        apiKey: NEWS_API_KEY,
        pageSize: 3,
        language: 'en'
      }
    });

    if (response.data.status === 'ok') {
      console.log('✅ Success! NewsAPI is working correctly.');
      console.log(`📰 Found ${response.data.totalResults} articles`);
      
      if (response.data.articles.length > 0) {
        console.log('\nSample Article:');
        const article = response.data.articles[0];
        console.log(`Title: ${article.title}`);
        console.log(`Source: ${article.source.name}`);
        console.log(`URL: ${article.url}`);
      }
    }

  } catch (error) {
    console.error('\n❌ Error testing NewsAPI:');
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data.message);
      
      if (error.response.status === 401) {
        console.log('\n🔑 Invalid API Key!');
        console.log('Please check your NEWS_API_KEY in the .env file');
      } else if (error.response.status === 429) {
        console.log('\n⏳ API Rate Limit Reached!');
        console.log('Free tier allows 100 requests/day');
      }
    } else {
      console.log('Error:', error.message);
    }
  }
}

testNewsAPI();