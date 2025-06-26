import React from 'react';
import { Shield, Clock, CreditCard, Headphones, Globe, Star } from 'lucide-react';

const Features: React.FC = () => {
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

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Why Choose QuickStay?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the difference with our premium booking platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors duration-300 group animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl mb-4 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
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