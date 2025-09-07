import React, { useState } from 'react';
import { Search, Star, TrendingUp, TrendingDown, Minus, Loader2, BarChart3, PieChart } from 'lucide-react';
import SentimentPieChart from './components/SentimentPieChart';
import ReviewDashboard from './components/ReviewDashboard';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError('');
    setReviews([]);
    setStats(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/reviews?product=${encodeURIComponent(searchTerm)}`);
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Backend server returned ${response.status}. Please ensure the backend is running on ${API_BASE_URL}`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch reviews');
      }

      setReviews(data.reviews || []);
      setStats({
        totalReviews: data.total_reviews,
        product: data.product,
        stored: data.stored
      });
    } catch (err) {
      if (err.message.includes('Unexpected token')) {
        setError(`Backend connection error. Please ensure the Flask server is running on ${API_BASE_URL}`);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'negative':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPolarityColor = (polarity) => {
    if (polarity > 0.1) return 'text-green-600';
    if (polarity < -0.1) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Search className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Product Review Scraper</h1>
            </div>
            <div className="text-sm text-gray-500">
              Amazon Reviews with Sentiment Analysis
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for products (e.g., iPhone, laptop, headphones)..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !searchTerm.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <TrendingDown className="w-5 h-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        {stats && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Search Results</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">{stats.totalReviews}</div>
                <div className="text-sm text-blue-800">Total Reviews</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">{stats.stored?.reviews_inserted || 0}</div>
                <div className="text-sm text-green-800">Stored in Database</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-sm font-medium text-purple-800 truncate">{stats.product}</div>
                <div className="text-sm text-purple-600">Search Query</div>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard with Charts */}
        {reviews.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
            </div>
            
            {/* Pie Chart */}
            <div className="mb-8">
              <SentimentPieChart reviews={reviews} />
            </div>
            
            {/* Advanced Dashboard */}
            <ReviewDashboard reviews={reviews} />
          </div>
        )}

        {/* Reviews List */}
        {reviews.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
            {reviews.map((review, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {review.title || 'Product Review'}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{review.product}</p>
                    {review.rating && (
                      <div className="flex items-center mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">{review.rating}/5</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {getSentimentIcon(review.sentiment)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSentimentColor(review.sentiment)}`}>
                      {review.sentiment}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 leading-relaxed">{review.review}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span>Polarity: <span className={`font-medium ${getPolarityColor(review.polarity)}`}>
                      {review.polarity?.toFixed(3)}
                    </span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && reviews.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
            <p className="text-gray-500">Try searching for a different product or check your search term.</p>
          </div>
        )}

        {/* Initial State */}
        {!loading && !error && reviews.length === 0 && !searchTerm && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Search for Product Reviews</h3>
            <p className="text-gray-500">Enter a product name above to scrape Amazon reviews with sentiment analysis.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>Product Review Scraper with Sentiment Analysis</p>
            <p className="mt-1">Powered by ScraperAPI and TextBlob</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
