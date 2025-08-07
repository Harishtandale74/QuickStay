import React from 'react';
import { Link } from 'react-router-dom';
import { Hotel, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-primary-600 p-2 rounded-lg">
                <Hotel className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">QuickStay</span>
            </Link>
            <p className="text-gray-300">
              Your premier hotel booking platform for seamless travel experiences worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/hotels" className="block text-gray-300 hover:text-white transition-colors">
                Find Hotels
              </Link>
              <Link to="/about" className="block text-gray-300 hover:text-white transition-colors">
                About Us
              </Link>
              <Link to="/contact" className="block text-gray-300 hover:text-white transition-colors">
                Contact
              </Link>
              <Link to="/support" className="block text-gray-300 hover:text-white transition-colors">
                Support
              </Link>
            </div>
          </div>

          {/* For Business */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">For Business</h3>
            <div className="space-y-2">
              <Link to="/register" className="block text-gray-300 hover:text-white transition-colors">
                List Your Property
              </Link>
              <Link to="/partner" className="block text-gray-300 hover:text-white transition-colors">
                Partner with Us
              </Link>
              <Link to="/business" className="block text-gray-300 hover:text-white transition-colors">
                Business Travel
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="h-4 w-4" />
                <span>support@quickstay.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPin className="h-4 w-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2025 QuickStay. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;