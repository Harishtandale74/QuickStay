import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Star, MapPin, Wifi, Car, Coffee, Dumbbell, Calendar, Users, ArrowLeft, Heart, Share2, Phone, Mail } from 'lucide-react';
import { RootState } from '../store/store';
import BookingForm from '../components/Hotels/BookingForm';
import ImageGallery from '../components/Hotels/ImageGallery';
import ReviewSection from '../components/Hotels/ReviewSection';
import toast from 'react-hot-toast';

const HotelDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState('overview');
  const [showBookingForm, setShowBookingForm] = useState(false);

  // Mock hotel data - in real app, fetch from API
  const hotel = {
    id: '1',
    name: 'Grand Luxury Resort',
    location: 'Malibu, California',
    price: 299,
    originalPrice: 374,
    rating: 4.9,
    reviewCount: 1234,
    images: [
      'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    amenities: ['Wifi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Parking', 'Beach Access', 'Room Service'],
    description: 'Experience luxury at its finest at Grand Luxury Resort, where breathtaking ocean views meet world-class amenities. Our beachfront property offers an unparalleled escape with elegantly appointed rooms, multiple dining options, and a full-service spa.',
    longDescription: `Nestled along the pristine coastline of Malibu, Grand Luxury Resort stands as a beacon of sophistication and comfort. Each of our 150 meticulously designed rooms and suites offers panoramic ocean views, premium amenities, and thoughtful touches that ensure an unforgettable stay.

    Our resort features three distinct dining venues, from casual beachside fare to fine dining experiences crafted by renowned chefs. The full-service spa offers rejuvenating treatments inspired by the natural beauty of the California coast, while our state-of-the-art fitness center and infinity pool provide the perfect balance of relaxation and recreation.

    Whether you're planning a romantic getaway, family vacation, or corporate retreat, our dedicated concierge team is committed to creating personalized experiences that exceed your expectations.`,
    discount: 20,
    isAvailable: true,
    rooms: 150,
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    policies: [
      'Free cancellation up to 24 hours before check-in',
      'No smoking policy throughout the property',
      'Pets allowed with additional fee',
      'Valid ID required at check-in',
    ],
    contact: {
      phone: '+1 (555) 123-4567',
      email: 'reservations@grandluxuryresort.com',
    },
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi className="h-5 w-5" />;
      case 'gym':
        return <Dumbbell className="h-5 w-5" />;
      case 'restaurant':
      case 'room service':
        return <Coffee className="h-5 w-5" />;
      case 'parking':
        return <Car className="h-5 w-5" />;
      default:
        return <Coffee className="h-5 w-5" />;
    }
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to book a hotel');
      navigate('/login');
      return;
    }
    setShowBookingForm(true);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: hotel.name,
        text: hotel.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Hotels</span>
            </button>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleShare}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Share2 className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-red-500 transition-colors">
                <Heart className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <ImageGallery images={hotel.images} hotelName={hotel.name} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hotel Info */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {hotel.name}
                  </h1>
                  <div className="flex items-center text-gray-600 space-x-1 mb-4">
                    <MapPin className="h-5 w-5" />
                    <span>{hotel.location}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="h-5 w-5 fill-accent-400 text-accent-400" />
                      <span className="font-semibold text-lg">{hotel.rating}</span>
                      <span className="text-gray-600">({hotel.reviewCount} reviews)</span>
                    </div>
                    {hotel.discount && (
                      <div className="bg-accent-100 text-accent-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {hotel.discount}% OFF
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  {hotel.originalPrice && (
                    <div className="text-lg text-gray-500 line-through">
                      ${hotel.originalPrice}
                    </div>
                  )}
                  <div className="text-3xl font-bold text-primary-600">
                    ${hotel.price}
                  </div>
                  <div className="text-gray-600">per night</div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-8">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'amenities', label: 'Amenities' },
                    { id: 'policies', label: 'Policies' },
                    { id: 'contact', label: 'Contact' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="space-y-6">
                {activeTab === 'overview' && (
                  <div>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {hotel.description}
                    </p>
                    <div className="prose prose-gray max-w-none">
                      {hotel.longDescription.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="text-gray-700 leading-relaxed mb-4">
                          {paragraph.trim()}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'amenities' && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {hotel.amenities.map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                      >
                        {getAmenityIcon(amenity)}
                        <span className="text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'policies' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-primary-600" />
                        <div>
                          <div className="font-medium text-gray-900">Check-in</div>
                          <div className="text-gray-600">{hotel.checkInTime}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-primary-600" />
                        <div>
                          <div className="font-medium text-gray-900">Check-out</div>
                          <div className="text-gray-600">{hotel.checkOutTime}</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Hotel Policies</h4>
                      <ul className="space-y-2">
                        {hotel.policies.map((policy, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{policy}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'contact' && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-primary-600" />
                      <div>
                        <div className="font-medium text-gray-900">Phone</div>
                        <a
                          href={`tel:${hotel.contact.phone}`}
                          className="text-primary-600 hover:text-primary-700"
                        >
                          {hotel.contact.phone}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-primary-600" />
                      <div>
                        <div className="font-medium text-gray-900">Email</div>
                        <a
                          href={`mailto:${hotel.contact.email}`}
                          className="text-primary-600 hover:text-primary-700"
                        >
                          {hotel.contact.email}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews */}
            <ReviewSection hotelId={hotel.id} />
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <BookingForm
                hotel={hotel}
                onBookNow={handleBookNow}
                showForm={showBookingForm}
                onCloseForm={() => setShowBookingForm(false)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;