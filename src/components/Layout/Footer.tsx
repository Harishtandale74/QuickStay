import React from 'react';
import { Link } from 'react-router-dom';
import {
  Hotel, Mail, Phone, MapPin, Globe,
  Facebook, Twitter, Instagram, Linkedin,
  Star, Shield, Award
} from 'lucide-react';

type SectionLink = { name: string; href: string };
type FooterSection = { title: string; links: SectionLink[] };
type TrustIndicator = { icon: React.ReactNode; text: string };
type SocialLink = { name: string; icon: React.ReactNode; href: string };

const footerSections: FooterSection[] = [
  {
    title: 'QuickStay',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'How it Works', href: '/how-it-works' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press & Media', href: '/press' },
      { name: 'Investor Relations', href: '/investors' },
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

const trustIndicators: TrustIndicator[] = [
  { icon: <Shield className="h-5 w-5" />, text: 'SSL Secured' },
  { icon: <Award className="h-5 w-5" />, text: 'Award Winning' },
  { icon: <Star className="h-5 w-5" />, text: '4.9/5 Rating' }
];

const socialLinks: SocialLink[] = [
  { name: 'Facebook', icon: <Facebook className="h-5 w-5" />, href: 'https://facebook.com/quickstay' },
  { name: 'Twitter', icon: <Twitter className="h-5 w-5" />, href: 'https://twitter.com/quickstay' },
  { name: 'Instagram', icon: <Instagram className="h-5 w-5" />, href: 'https://instagram.com/quickstay' },
  { name: 'LinkedIn', icon: <Linkedin className="h-5 w-5" />, href: 'https://linkedin.com/company/quickstay' }
];

const contactInfo = [
  {
    title: '24/7 Support',
    value: '+91-712-QUICKSTAY',
    icon: <Phone className="h-5 w-5 text-white" />,
    aria: 'Call QuickStay Support',
  },
  {
    title: 'Email Support',
    value: 'support@quickstay.com',
    icon: <Mail className="h-5 w-5 text-white" />,
    aria: 'Email QuickStay Support',
  },
  {
    title: 'Headquarters',
    value: 'Sitabuldi, Nagpur, Maharashtra',
    icon: <MapPin className="h-5 w-5 text-white" />,
    aria: 'QuickStay location',
  }
];

const currentYear = new Date().getFullYear();

const Footer: React.FC = () => (
  <footer className="bg-gray-900 text-white" aria-label="Footer">
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" aria-label="QuickStay site links">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Brand + Trust Indicators */}
        <section className="lg:col-span-1 space-y-6">
          <Link to="/" className="flex items-center space-x-3 group" aria-label="Go to homepage">
            <span className="bg-gradient-to-r from-orange-500 to-red-600 p-3 rounded-xl group-hover:from-orange-600 group-hover:to-red-700 transition-all duration-300">
              <Hotel className="h-8 w-8 text-white" aria-hidden />
            </span>
            <span>
              <span className="text-2xl font-bold">QuickStay</span>
              <div className="flex items-center space-x-1 text-sm text-orange-400">
                <MapPin className="h-3 w-3" aria-hidden />
                <span>Nagpur</span>
              </div>
            </span>
          </Link>
          <p className="text-gray-300 leading-relaxed" id="footer-desc">
            Your premier hotel booking platform for seamless travel experiences in Nagpur, the Orange City of India.
          </p>
          <ul className="space-y-3" aria-label="Our Trust Indicators">
            {trustIndicators.map((item, idx) => (
              <li key={item.text} className="flex items-center space-x-2 text-sm text-gray-400">
                <span className="text-orange-500">{item.icon}</span>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
          <nav>
            <ul className="flex space-x-4" aria-label="QuickStay social links">
              {socialLinks.map(link => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit us on ${link.name}`}
                    className="bg-gray-800 hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-600 p-3 rounded-lg transition-all duration-300 transform hover:scale-110"
                  >
                    {link.icon}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </section>
        {/* Navigation Sections */}
        {footerSections.map(section => (
          <section key={section.title} aria-labelledby={`footer-${section.title.replace(/\s/g, '').toLowerCase()}`}>
            <h3 className="text-lg font-semibold text-white" id={`footer-${section.title.replace(/\s/g, '').toLowerCase()}`}>
              {section.title}
            </h3>
            <ul className="space-y-3">
              {section.links.map(link => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-orange-400 transition-colors duration-300 text-sm"
                    aria-label={link.name}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </nav>

    {/* Contact Information */}
    <section className="border-t border-gray-800" aria-label="QuickStay contact information">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactInfo.map(info => (
            <li key={info.title} className="flex items-center space-x-3">
              <span className="bg-orange-500 p-2 rounded-lg" aria-hidden>
                {info.icon}
              </span>
              <span>
                <span className="font-medium text-white">{info.title}</span>
                <span className="block text-gray-300 text-sm">{info.value}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>

    {/* Bottom Bar */}
    <div className="border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <nav className="flex items-center space-x-6 text-sm text-gray-400" aria-label="Footer policies">
            <span>&copy; {currentYear} QuickStay. All rights reserved.</span>
            <Link to="/terms" className="hover:text-orange-400 transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-orange-400 transition-colors">Privacy</Link>
            <Link to="/cookies" className="hover:text-orange-400 transition-colors">Cookies</Link>
          </nav>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span className="flex items-center space-x-2">
              <Globe className="h-4 w-4" aria-hidden />
              <span>English (India)</span>
            </span>
            <span>₹ INR</span>
          </div>
        </div>
      </div>
    </div>

    {/* Nagpur Pride Section */}
    <section className="bg-gradient-to-r from-orange-600 to-red-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <p className="text-orange-100 text-sm text-center" aria-label="Nagpur Pride">
          🍊 Proudly serving the Orange City of India - Nagpur, Maharashtra 🍊
        </p>
      </div>
    </section>
  </footer>
);

export default Footer;
