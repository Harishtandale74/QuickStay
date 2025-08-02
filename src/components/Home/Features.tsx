import React from 'react';
import { Shield, Clock, CreditCard, Headphones, Globe, Star } from 'lucide-react';

interface FeaturesProps {
  deviceType: 'mobile' | 'tablet' | 'desktop';
}

const Features: React.FC<FeaturesProps> = ({ deviceType }) => {
  const features = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Secure Booking',
      description: 'Your payments and personal information are protected with bank-level security.',
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: 'Instant Confirmation',
      description: 'Get immediate booking confirmation and never worry about availability.',
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: 'Best Price Guarantee',
      description: 'We match prices and ensure you get the best deals on every booking.',
    },
    {
      icon: <Headphones className="h-8 w-8" />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support to help you with any travel needs.',
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: 'Global Reach',
      description: 'Access to hotels and accommodations in over 200 countries worldwide.',
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: 'Premium Quality',
      description: 'Carefully vetted properties ensuring exceptional quality and service.',
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
          maxFeatures: 4
        };
      case 'tablet':
        return {
          padding: 'py-14',
          titleSize: 'text-3xl',
          subtitleSize: 'text-xl',
          gridCols: 'grid-cols-1 md:grid-cols-2',
          maxFeatures: 6
        };
      default:
        return {
          padding: 'py-16',
          titleSize: 'text-3xl md:text-4xl',
          subtitleSize: 'text-xl',
          gridCols: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
          maxFeatures: 6
        };
    }
  };

  const config = getResponsiveConfig();
  const displayFeatures = features.slice(0, config.maxFeatures);

  return (
    <section className={`${config.padding} bg-white`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-4">
          <h2 className={`${config.titleSize} font-bold text-gray-900`}>
            Why Choose QuickStay?
          </h2>
          <p className={`${config.subtitleSize} text-gray-600 max-w-2xl mx-auto`}>
            Experience the difference with our premium booking platform
          </p>
        </div>

        <div className={`${config.gridCols} gap-6 md:gap-8`}>
          {displayFeatures.map((feature, index) => (
            <div
              key={index}
              className={`text-center ${deviceType === 'mobile' ? 'p-4' : 'p-6'} rounded-2xl hover:bg-gray-50 transition-colors duration-300 group animate-fade-in`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`inline-flex items-center justify-center ${deviceType === 'mobile' ? 'w-12 h-12' : 'w-16 h-16'} bg-primary-100 text-primary-600 rounded-2xl mb-4 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300`}>
                {feature.icon}
              </div>
              <h3 className={`${deviceType === 'mobile' ? 'text-lg' : 'text-xl'} font-bold text-gray-900 mb-2`}>
                {feature.title}
              </h3>
              <p className={`text-gray-600 leading-relaxed ${deviceType === 'mobile' ? 'text-sm' : ''}`}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;