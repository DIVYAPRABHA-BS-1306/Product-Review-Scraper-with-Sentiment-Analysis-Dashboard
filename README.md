# 🛍️ Product Review Scraper with Sentiment Analysis & Analytics Dashboard

A full-stack web application that scrapes Amazon product reviews and performs sentiment analysis using machine learning. The application features a modern React frontend and a Flask backend with MongoDB integration.

## 🚀 Features

- **Amazon Review Scraping**: Scrape product reviews from Amazon India using ScraperAPI
- **Sentiment Analysis**: Analyze review sentiment using TextBlob (positive, negative, neutral)
- **Real-time Search**: Search for any product and get instant results
- **Modern UI**: Clean, responsive React frontend with Tailwind CSS
- **Database Storage**: Store reviews and sentiment data in MongoDB
- **RESTful API**: Well-structured Flask API with CORS support

## 🏗️ Architecture

```
Product_Scraper/
├── backend/                 # Flask API server
│   ├── app.py              # Main Flask application
│   ├── db.py               # MongoDB connection utilities
│   ├── sentiment.py        # Sentiment analysis using TextBlob
│   ├── scrapers/           # Web scraping modules
│   │   └── scraper_api.py  # Amazon scraper using ScraperAPI
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── App.js          # Main React component
│   │   ├── index.js        # React entry point
│   │   └── index.css       # Global styles
│   ├── public/
│   │   └── index.html      # HTML template
│   ├── package.json        # Node.js dependencies
│   └── tailwind.config.js  # Tailwind CSS configuration
└── README.md               # This file
```

## 🛠️ Tech Stack

### Backend
- **Flask**: Python web framework
- **MongoDB**: NoSQL database for storing reviews
- **ScraperAPI**: Web scraping service
- **TextBlob**: Natural language processing for sentiment analysis
- **BeautifulSoup**: HTML parsing
- **Flask-CORS**: Cross-origin resource sharing

### Frontend
- **React 18**: Modern JavaScript library
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icons
- **Axios**: HTTP client for API calls

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **MongoDB** (running locally or accessible remotely)
- **ScraperAPI Account** (for web scraping)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Product_Scraper
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\\Scripts\\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install
```

### 4. Environment Configuration

Create a `.env` file in the `backend` directory with the following variables:

```env
# ScraperAPI Configuration
SCRAPER_API_KEY=your_scraper_api_key_here

# MongoDB Configuration
MONGO_HOST=127.0.0.1
MONGO_PORT=27017
MONGO_DB=reviews_db
MONGO_USER=your_mongo_username
MONGO_PASSWORD=your_mongo_password
```

### 5. MongoDB Setup

Make sure MongoDB is running on your system:

```bash
# Start MongoDB service
# On Windows (if installed as service):
net start MongoDB

# On macOS (using Homebrew):
brew services start mongodb-community

# On Linux:
sudo systemctl start mongod
```

## 🚀 Running the Application

### 1. Start the Backend Server

```bash
# From the backend directory
cd backend
python app.py
```

The API will be available at `http://localhost:5000`

### 2. Start the Frontend Development Server

```bash
# From the frontend directory
cd frontend
npm start
```

The frontend will be available at `http://localhost:3000`

## 📖 API Documentation

### Endpoints

#### `GET /`
Returns API status and usage information.

**Response:**
```json
{
  "message": "Amazon Review Scraper API is running!",
  "usage": {
    "search_by_name": "/api/reviews?product=iphone"
  }
}
```

#### `GET /api/reviews?product={product_name}`
Scrapes Amazon reviews for the specified product and performs sentiment analysis.

**Parameters:**
- `product` (required): Product name to search for

**Example:**
```bash
GET /api/reviews?product=iphone
```

**Response:**
```json
{
  "product": "iphone",
  "query_type": "search",
  "reviews": [
    {
      "product": "Apple iPhone 15",
      "title": "Product Review",
      "review": "Great phone with excellent camera quality...",
      "rating": null,
      "sentiment": "positive",
      "polarity": 0.8
    }
  ],
  "total_reviews": 1,
  "stored": {
    "product_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "reviews_inserted": 1
  }
}
```

## 🎯 Usage

1. **Open the Application**: Navigate to `http://localhost:3000` in your browser
2. **Search for Products**: Enter a product name in the search box (e.g., "iPhone", "laptop", "headphones")
3. **View Results**: Browse through the scraped reviews with sentiment analysis
4. **Analyze Sentiment**: Each review shows:
   - Sentiment label (positive, negative, neutral)
   - Polarity score (-1 to 1)
   - Visual indicators for easy understanding

## 🔍 Features in Detail

### Sentiment Analysis
- **Positive**: Polarity > 0.1 (green indicators)
- **Negative**: Polarity < -0.1 (red indicators)  
- **Neutral**: Polarity between -0.1 and 0.1 (gray indicators)

### Data Storage
- Reviews are automatically stored in MongoDB
- Each search creates a product document with metadata
- Individual reviews are linked to their parent product

### Error Handling
- Graceful handling of API failures
- User-friendly error messages
- Network timeout protection

## 🛡️ Security Considerations

- API keys are stored in environment variables
- CORS is properly configured for frontend-backend communication
- Input validation and sanitization
- Rate limiting considerations for production use

## 🚀 Deployment

### Backend Deployment
1. Set up a production MongoDB instance
2. Configure environment variables
3. Deploy to platforms like Heroku, AWS, or DigitalOcean
4. Use a production WSGI server like Gunicorn

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or AWS S3
3. Update API URLs for production environment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env` file
   - Verify network connectivity

2. **ScraperAPI Errors**
   - Verify API key is correct
   - Check API quota and limits
   - Ensure proper internet connectivity

3. **Frontend Not Loading**
   - Check if backend is running on port 5000
   - Verify CORS configuration
   - Check browser console for errors

4. **No Reviews Found**
   - Try different search terms
   - Check if ScraperAPI is working
   - Verify Amazon product availability

### Getting Help

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the error messages in the console
3. Ensure all dependencies are properly installed
4. Verify environment variables are set correctly

## 🔮 Future Enhancements

- [ ] Add more e-commerce platforms (Flipkart, eBay)
- [ ] Implement user authentication
- [ ] Add review filtering and sorting options
- [ ] Create data visualization dashboards
- [ ] Add export functionality (CSV, PDF)
- [ ] Implement caching for better performance
- [ ] Add unit and integration tests
- [ ] Create Docker containers for easy deployment

---

**Happy Scraping! 🕷️📊**
