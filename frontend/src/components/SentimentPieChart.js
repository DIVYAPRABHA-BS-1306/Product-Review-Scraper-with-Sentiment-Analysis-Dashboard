import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const SentimentPieChart = ({ reviews = [] }) => {
  // Calculate sentiment distribution
  const sentimentCounts = reviews.reduce((acc, review) => {
    const sentiment = review.sentiment || 'neutral';
    acc[sentiment] = (acc[sentiment] || 0) + 1;
    return acc;
  }, {});

  const totalReviews = reviews.length;

  // Prepare data for the chart
  const chartData = {
    labels: ['Positive', 'Negative', 'Neutral'],
    datasets: [
      {
        data: [
          sentimentCounts.positive || 0,
          sentimentCounts.negative || 0,
          sentimentCounts.neutral || 0
        ],
        backgroundColor: [
          '#10B981', // Green for positive
          '#EF4444', // Red for negative
          '#6B7280'  // Gray for neutral
        ],
        borderColor: [
          '#059669', // Darker green
          '#DC2626', // Darker red
          '#4B5563'  // Darker gray
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          '#34D399', // Lighter green on hover
          '#F87171', // Lighter red on hover
          '#9CA3AF'  // Lighter gray on hover
        ],
        hoverBorderColor: [
          '#10B981',
          '#EF4444',
          '#6B7280'
        ],
        hoverBorderWidth: 3
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 14,
            weight: '500'
          },
          color: '#374151'
        }
      },
      title: {
        display: true,
        text: 'Sentiment Distribution',
        font: {
          size: 18,
          weight: 'bold'
        },
        color: '#111827',
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const percentage = totalReviews > 0 ? ((value / totalReviews) * 100).toFixed(1) : 0;
            return `${label}: ${value} reviews (${percentage}%)`;
          }
        }
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
      easing: 'easeInOutQuart'
    },
    elements: {
      arc: {
        borderWidth: 2
      }
    }
  };

  // If no reviews, show empty state
  if (totalReviews === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Distribution</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-sm">No data available</p>
            <p className="text-xs text-gray-400">Search for products to see sentiment analysis</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="h-80">
        <Pie data={chartData} options={chartOptions} />
      </div>
      
      {/* Summary Statistics */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {sentimentCounts.positive || 0}
          </div>
          <div className="text-sm text-gray-600">Positive</div>
          <div className="text-xs text-gray-400">
            {totalReviews > 0 ? (((sentimentCounts.positive || 0) / totalReviews) * 100).toFixed(1) : 0}%
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">
            {sentimentCounts.negative || 0}
          </div>
          <div className="text-sm text-gray-600">Negative</div>
          <div className="text-xs text-gray-400">
            {totalReviews > 0 ? (((sentimentCounts.negative || 0) / totalReviews) * 100).toFixed(1) : 0}%
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-600">
            {sentimentCounts.neutral || 0}
          </div>
          <div className="text-sm text-gray-600">Neutral</div>
          <div className="text-xs text-gray-400">
            {totalReviews > 0 ? (((sentimentCounts.neutral || 0) / totalReviews) * 100).toFixed(1) : 0}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentimentPieChart;
