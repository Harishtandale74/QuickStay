import React from 'react';
import { Star, Quote } from 'lucide-react';

interface TestimonialsProps {
  deviceType: 'mobile' | 'tablet' | 'desktop';
}

const Testimonials: React.FC<TestimonialsProps> = ({ deviceType }) => {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Business Traveler',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      rating: 5,
      comment: 'QuickStay made my business trip seamless. The booking process was incredibly smooth, and the hotel exceeded my expectations. Will definitely use again!',
    },
    {
      id: 2,  
      name: 'Michael Chen',
      role: 'Family Vacation',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150',
      rating: 5,
      comment: 'Found the perfect family resort through QuickStay. The real-time availability feature saved us so much time, and the customer service was outstanding.',
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Solo Traveler',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150',
      rating: 5,
      comment: 'As a solo female traveler, I appreciate the detailed hotel information and reviews. QuickStay helps me make informed decisions and feel safe.',
    },
  ];

  // Responsive configurations
  const getResponsiveConfig = () => {
    switch (deviceType) {
      case 'mobile':
        return {
          padding: 'py-12',
          titleSize: 'text-2xl md:text-3xl',
          subtitleSize: 'text-lg',
          gridCols: 'grid-cols-1',
          maxTestimonials: 2
        };
      case 'tablet':
        return {
          padding: 'py-14',
          titleSize: 'text-3xl',
          subtitleSize: 'text-xl',
          gridCols: 'grid-cols-1 md:grid-cols-2',
          maxTestimonials: 2
        };
      default:
        return {
          padding: 'py-16',
          titleSize: 'text-3xl md:text-4xl',
          subtitleSize: 'text-xl',
          gridCols: 'grid-cols-1 md:grid-cols-3',
          maxTestimonials: 3
        };
    }
  };

  const config = getResponsiveConfig();
  const displayTestimonials = testimonials.slice(0, config.maxTestimonials);

  return (
    <section className={`${config.padding} bg-gradient-to-br from-primary-50 to-secondary-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-4">
          <h2 className={`${config.titleSize} font-bold text-gray-900`}>
            What Our Travelers Say
          </h2>
          <p className={`${config.subtitleSize} text-gray-600 max-w-2xl mx-auto`}>
            Real experiences from real travelers who trust QuickStay
          </p>
        </div>

        <div className={`${config.gridCols} gap-6 md:gap-8`}>
          {displayTestimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`bg-white rounded-2xl ${deviceType === 'mobile' ? 'p-6' : 'p-8'} shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex items-center mb-6">
                <Quote className="h-8 w-8 text-primary-600 opacity-20" />
              </div>
              
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-accent-400 text-accent-400" />
                ))}
              </div>

              <p className={`text-gray-700 mb-6 leading-relaxed ${deviceType === 'mobile' ? 'text-sm' : ''}`}>
                "{testimonial.comment}"
              </p>

              <div className="flex items-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className={`${deviceType === 'mobile' ? 'w-10 h-10' : 'w-12 h-12'} rounded-full object-cover mr-4`}
                />
                <div>
                  <h4 className={`font-semibold text-gray-900 ${deviceType === 'mobile' ? 'text-sm' : ''}`}>
                    {testimonial.name}
                  </h4>
                  <p className={`${deviceType === 'mobile' ? 'text-xs' : 'text-sm'} text-gray-600`}>
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;