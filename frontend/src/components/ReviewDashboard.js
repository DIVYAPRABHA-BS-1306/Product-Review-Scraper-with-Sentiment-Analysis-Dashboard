import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';
import { TrendingUp, TrendingDown, Minus, Star } from 'lucide-react';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);

const ReviewDashboard = ({ reviews = [] }) => {
  // Calculate sentiment distribution
  const sentimentCounts = reviews.reduce((acc, review) => {
    const sentiment = review.sentiment || 'neutral';
    acc[sentiment] = (acc[sentiment] || 0) + 1;
    return acc;
  }, {});

  // Calculate average polarity
  const avgPolarity = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + (review.polarity || 0), 0) / reviews.length 
    : 0;

  // Prepare bar chart data
  const barChartData = {
    labels: ['Positive', 'Negative', 'Neutral'],
    datasets: [
      {
        label: 'Number of Reviews',
        data: [
          sentimentCounts.positive || 0,
          sentimentCounts.negative || 0,
          sentimentCounts.neutral || 0
        ],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(107, 114, 128, 0.8)'
        ],
        borderColor: [
          'rgb(16, 185, 129)',
          'rgb(239, 68, 68)',
          'rgb(107, 114, 128)'
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Sentiment Distribution (Bar Chart)',
        font: {
          size: 16,
          weight: 'bold'
        },
        color: '#111827'
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const value = context.parsed.y;
            const total = reviews.length;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${context.label}: ${value} reviews (${percentage}%)`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: '#6B7280'
        },
        grid: {
          color: 'rgba(107, 114, 128, 0.1)'
        }
      },
      x: {
        ticks: {
          color: '#374151',
          font: {
            weight: '500'
          }
        },
        grid: {
          display: false
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'negative':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      default:
        return <Minus className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPolarityColor = (polarity) => {
    if (polarity > 0.1) return 'text-green-600';
    if (polarity < -0.1) return 'text-red-600';
    return 'text-gray-600';
  };

  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Analytics</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Star className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm">No analytics available</p>
            <p className="text-xs text-gray-400">Search for products to see detailed analytics</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">Positive Reviews</p>
              <p className="text-2xl font-bold text-green-900">{sentimentCounts.positive || 0}</p>
              <p className="text-xs text-green-700">
                {reviews.length > 0 ? (((sentimentCounts.positive || 0) / reviews.length) * 100).toFixed(1) : 0}% of total
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-800">Negative Reviews</p>
              <p className="text-2xl font-bold text-red-900">{sentimentCounts.negative || 0}</p>
              <p className="text-xs text-red-700">
                {reviews.length > 0 ? (((sentimentCounts.negative || 0) / reviews.length) * 100).toFixed(1) : 0}% of total
              </p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">Neutral Reviews</p>
              <p className="text-2xl font-bold text-gray-900">{sentimentCounts.neutral || 0}</p>
              <p className="text-xs text-gray-700">
                {reviews.length > 0 ? (((sentimentCounts.neutral || 0) / reviews.length) * 100).toFixed(1) : 0}% of total
              </p>
            </div>
            <Minus className="w-8 h-8 text-gray-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">Avg. Polarity</p>
              <p className={`text-2xl font-bold ${getPolarityColor(avgPolarity)}`}>
                {avgPolarity.toFixed(3)}
              </p>
              <p className="text-xs text-blue-700">
                {avgPolarity > 0.1 ? 'Positive' : avgPolarity < -0.1 ? 'Negative' : 'Neutral'} overall
              </p>
            </div>
            <Star className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="h-80">
          <Bar data={barChartData} options={barChartOptions} />
        </div>
      </div>

      {/* Recent Reviews Summary */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reviews Summary</h3>
        <div className="space-y-3">
          {reviews.slice(0, 5).map((review, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                {getSentimentIcon(review.sentiment)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {review.title || 'Product Review'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{review.product}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  review.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                  review.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {review.sentiment}
                </span>
                <span className={`text-sm font-medium ${getPolarityColor(review.polarity)}`}>
                  {review.polarity?.toFixed(3)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewDashboard;
