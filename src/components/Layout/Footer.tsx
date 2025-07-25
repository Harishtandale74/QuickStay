import React from 'react';
import { Link } from 'react-router-dom';
import { Hotel, Mail, Phone, MapPin, Globe, Facebook, Twitter, Instagram, Linkedin, Star, Shield, Award } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'QuickStay',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'How it Works', href: '/how-it-works' },
        { name: 'Careers', href: '/careers' },
        { name: 'Press & Media', href: '/press' },
        { name: 'Investor Relations', href: '/investors' }
      ]
    },
    {
      title: 'For Travelers',
      links: [
        { name: 'Find Hotels', href: '/hotels' },
        { name: 'Explore Nagpur', href: '/explore' },
        { name: 'Travel Guides', href: '/guides' },
        { name: 'Mobile App', href: '/mobile' },
        { name: 'Gift Cards', href: '/gift-cards' }
      ]
    },
    {
      title: 'For Partners',
      links: [
        { name: 'List Your Property', href: '/register?role=hotelOwner' },
        { name: 'Partner Portal', href: '/partner-portal' },
        { name: 'Marketing Tools', href: '/marketing' },
        { name: 'API Documentation', href: '/api-docs' },
        { name: 'Affiliate Program', href: '/affiliates' }
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Safety & Security', href: '/safety' },
        { name: 'Accessibility', href: '/accessibility' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' }
      ]
    }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: <Facebook className="h-5 w-5" />, href: 'https://facebook.com/quickstay' },
    { name: 'Twitter', icon: <Twitter className="h-5 w-5" />, href: 'https://twitter.com/quickstay' },
    { name: 'Instagram', icon: <Instagram className="h-5 w-5" />, href: 'https://instagram.com/quickstay' },
    { name: 'LinkedIn', icon: <Linkedin className="h-5 w-5" />, href: 'https://linkedin.com/company/quickstay' }
  ];

  const trustIndicators = [
    { icon: <Shield className="h-5 w-5" />, text: 'SSL Secured' },
    { icon: <Award className="h-5 w-5" />, text: 'Award Winning' },
    { icon: <Star className="h-5 w-5" />, text: '4.9/5 Rating' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-6">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 p-3 rounded-xl group-hover:from-orange-600 group-hover:to-red-700 transition-all duration-300">
                <Hotel className="h-8 w-8 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold">QuickStay</span>
                <div className="flex items-center space-x-1 text-sm text-orange-400">
                  <MapPin className="h-3 w-3" />
                  <span>Nagpur</span>
                </div>
              </div>
            </Link>
            
            <p className="text-gray-300 leading-relaxed">
              Your premier hotel booking platform for seamless travel experiences in Nagpur, the Orange City of India.
            </p>

            {/* Trust Indicators */}
            <div className="space-y-3">
              {trustIndicators.map((indicator, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-gray-400">
                  <div className="text-orange-500">
                    {indicator.icon}
                  </div>
                  <span>{indicator.text}</span>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-600 p-3 rounded-lg transition-all duration-300 transform hover:scale-110"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-lg font-semibold text-white">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-300 hover:text-orange-400 transition-colors duration-300 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-500 p-2 rounded-lg">
                <Phone className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-medium text-white">24/7 Support</div>
                <div className="text-gray-300 text-sm">+91-712-QUICKSTAY</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-orange-500 p-2 rounded-lg">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-medium text-white">Email Support</div>
                <div className="text-gray-300 text-sm">support@quickstay.com</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-orange-500 p-2 rounded-lg">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-medium text-white">Headquarters</div>
                <div className="text-gray-300 text-sm">Sitabuldi, Nagpur, Maharashtra</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>&copy; {currentYear} QuickStay. All rights reserved.</span>
              <Link to="/terms" className="hover:text-orange-400 transition-colors">Terms</Link>
              <Link to="/privacy" className="hover:text-orange-400 transition-colors">Privacy</Link>
              <Link to="/cookies" className="hover:text-orange-400 transition-colors">Cookies</Link>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>English (India)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>₹ INR</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nagpur Pride Section */}
      <div className="bg-gradient-to-r from-orange-600 to-red-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center">
            <p className="text-orange-100 text-sm">
              🍊 Proudly serving the Orange City of India - Nagpur, Maharashtra 🍊
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;