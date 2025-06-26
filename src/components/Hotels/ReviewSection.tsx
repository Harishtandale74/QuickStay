import React, { useState } from 'react';
import { Star, ThumbsUp, User } from 'lucide-react';

interface ReviewSectionProps {
  hotelId: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ hotelId }) => {
  const [showAllReviews, setShowAllReviews] = useState(false);

  const mockReviews = [
    {
      id: '1',
      userName: 'Sarah Johnson',
      userAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      rating: 5,
      date: '2024-01-15',
      title: 'Absolutely Perfect Stay!',
      comment: 'This hotel exceeded all my expectations. The staff was incredibly friendly, the room was spotless, and the ocean view was breathtaking. The spa services were world-class, and the restaurant had amazing food. Will definitely be returning!',
      helpful: 12,
    },
    {
      id: '2',
      userName: 'Michael Chen',
      userAvatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150',
      rating: 4,
      date: '2024-01-10',
      title: 'Great Location and Service',
      comment: 'Wonderful location right on the beach. The staff went above and beyond to make our family vacation special. The kids loved the pool area, and we enjoyed the evening entertainment. Only minor issue was the WiFi could be stronger in some areas.',
      helpful: 8,
    },
    {
      id: '3',
      userName: 'Emily Rodriguez',
      userAvatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150',
      rating: 5,
      date: '2024-01-05',
      title: 'Luxury at its Finest',
      comment: 'From check-in to check-out, everything was flawless. The concierge helped us plan amazing day trips, the room service was prompt, and the sunset views from our balcony were unforgettable. Worth every penny!',
      helpful: 15,
    },
  ];

  const averageRating = mockReviews.reduce((sum, review) => sum + review.rating, 0) / mockReviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: mockReviews.filter(review => review.rating === rating).length,
    percentage: (mockReviews.filter(review => review.rating === rating).length / mockReviews.length) * 100,
  }));

  const displayedReviews = showAllReviews ? mockReviews : mockReviews.slice(0, 2);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Guest Reviews</h3>

      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="text-center">
          <div className="text-4xl font-bold text-primary-600 mb-2">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex items-center justify-center mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.floor(averageRating)
                    ? 'fill-accent-400 text-accent-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <div className="text-gray-600">
            Based on {mockReviews.length} reviews
          </div>
        </div>

        <div className="space-y-2">
          {ratingDistribution.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 w-12">
                <span className="text-sm">{rating}</span>
                <Star className="h-3 w-3 fill-accent-400 text-accent-400" />
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-accent-400 h-2 rounded-full"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600 w-8">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {displayedReviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
            <div className="flex items-start space-x-4">
              <img
                src={review.userAvatar}
                alt={review.userName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{review.userName}</h4>
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? 'fill-accent-400 text-accent-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">{review.date}</span>
                    </div>
                  </div>
                </div>
                <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
                <p className="text-gray-700 leading-relaxed mb-3">{review.comment}</p>
                <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800">
                  <ThumbsUp className="h-4 w-4" />
                  <span>Helpful ({review.helpful})</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {mockReviews.length > 2 && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowAllReviews(!showAllReviews)}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            {showAllReviews ? 'Show Less Reviews' : `Show All ${mockReviews.length} Reviews`}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;