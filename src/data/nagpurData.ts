// Comprehensive Nagpur-specific data and constants

export const NAGPUR_AREAS = [
  'Sitabuldi',
  'Sadar', 
  'Dharampeth',
  'Civil Lines',
  'Ramdaspeth',
  'Mahal',
  'Gandhibagh',
  'Itwari',
  'Kamptee Road',
  'Wardha Road',
  'Amravati Road',
  'Katol Road',
  'Seminary Hills',
  'Hingna Road',
  'Koradi Road',
  'Manish Nagar',
  'Pratap Nagar',
  'Trimurti Nagar'
];

export const POPULAR_HOTEL_AREAS = [
  {
    name: 'Sitabuldi',
    description: 'Central business district with shopping and commercial areas',
    hotels: 25,
    avgPrice: 3200,
    highlights: ['Shopping Hub', 'Business Center', 'Transport Hub', 'Restaurants'],
    landmarks: ['Sitabuldi Fort', 'Central Mall', 'GPO', 'Railway Station'],
    bestFor: ['Business Travel', 'Shopping', 'Connectivity']
  },
  {
    name: 'Civil Lines',
    description: 'Government area with administrative offices and peaceful environment',
    hotels: 18,
    avgPrice: 3800,
    highlights: ['Government Offices', 'Quiet Area', 'Well Connected', 'Green Spaces'],
    landmarks: ['Vidhan Bhavan', 'High Court', 'Raj Bhavan', 'Club'],
    bestFor: ['Government Work', 'Peaceful Stay', 'Official Visits']
  },
  {
    name: 'Dharampeth',
    description: 'Upscale residential area with modern amenities and restaurants',
    hotels: 22,
    avgPrice: 4200,
    highlights: ['Upscale Area', 'Fine Dining', 'Modern Amenities', 'Safe'],
    landmarks: ['Dharampeth Square', 'Modern Restaurants', 'Shopping Centers'],
    bestFor: ['Luxury Stay', 'Fine Dining', 'Shopping']
  },
  {
    name: 'Sadar',
    description: 'Commercial hub with markets and business centers',
    hotels: 20,
    avgPrice: 3000,
    highlights: ['Commercial Hub', 'Markets', 'Business Centers', 'Connectivity'],
    landmarks: ['Sadar Market', 'Commercial Buildings', 'Banks'],
    bestFor: ['Business', 'Market Access', 'Commercial Activities']
  },
  {
    name: 'Seminary Hills',
    description: 'Educational area with colleges and peaceful green environment',
    hotels: 15,
    avgPrice: 2800,
    highlights: ['Educational Hub', 'Peaceful', 'Green Area', 'Student Friendly'],
    landmarks: ['Colleges', 'Educational Institutions', 'Parks'],
    bestFor: ['Educational Visits', 'Peaceful Stay', 'Budget Travel']
  },
  {
    name: 'Wardha Road',
    description: 'Airport connectivity with modern hotels and business facilities',
    hotels: 16,
    avgPrice: 4000,
    highlights: ['Airport Access', 'Modern Hotels', 'Business Facilities', 'Connectivity'],
    landmarks: ['Airport Road', 'AIIMS Nagpur', 'Business Parks'],
    bestFor: ['Airport Transit', 'Business Travel', 'Medical Tourism']
  }
];

export const NAGPUR_COORDINATES = {
  center: {
    latitude: 21.1458,
    longitude: 79.0882
  },
  bounds: {
    north: 21.3,
    south: 21.0,
    east: 79.3,
    west: 78.8
  }
};

export const NAGPUR_LANDMARKS = [
  {
    name: 'Deekshabhoomi',
    area: 'Nagpur Central',
    type: 'Religious',
    description: 'Sacred Buddhist monument',
    coordinates: { lat: 21.1138, lng: 79.0861 }
  },
  {
    name: 'Sitabuldi Fort',
    area: 'Sitabuldi',
    type: 'Historical',
    description: 'Historic fort with city views',
    coordinates: { lat: 21.1498, lng: 79.0806 }
  },
  {
    name: 'Ambazari Lake',
    area: 'Ambazari',
    type: 'Nature',
    description: 'Largest lake in Nagpur',
    coordinates: { lat: 21.1307, lng: 79.0270 }
  },
  {
    name: 'Futala Lake',
    area: 'Futala',
    type: 'Nature',
    description: 'Beautiful lake with musical fountain',
    coordinates: { lat: 21.1307, lng: 79.0270 }
  },
  {
    name: 'Raman Science Centre',
    area: 'Civil Lines',
    type: 'Educational',
    description: 'Interactive science museum',
    coordinates: { lat: 21.1458, lng: 79.0882 }
  },
  {
    name: 'Maharaj Bagh Zoo',
    area: 'Sitabuldi',
    type: 'Entertainment',
    description: 'One of oldest zoos in India',
    coordinates: { lat: 21.1458, lng: 79.0882 }
  },
  {
    name: 'Zero Mile Stone',
    area: 'Sitabuldi',
    type: 'Historical',
    description: 'Geographical center of India',
    coordinates: { lat: 21.1458, lng: 79.0882 }
  },
  {
    name: 'Nagpur Railway Station',
    area: 'Sitabuldi',
    type: 'Transport',
    description: 'Major railway junction',
    coordinates: { lat: 21.1458, lng: 79.0882 }
  },
  {
    name: 'Dr. Babasaheb Ambedkar International Airport',
    area: 'Wardha Road',
    type: 'Transport',
    description: 'Main airport serving Nagpur',
    coordinates: { lat: 21.0922, lng: 79.0472 }
  }
];

export const NAGPUR_ATTRACTIONS = [
  {
    id: '1',
    name: 'Deekshabhoomi',
    description: 'Sacred Buddhist monument where Dr. B.R. Ambedkar converted to Buddhism',
    category: 'Religious',
    area: 'Nagpur Central',
    rating: 4.8,
    reviewCount: 2456,
    distance: '5 km from city center',
    timings: '6:00 AM - 8:00 PM',
    entryFee: 'Free',
    image: 'https://images.pexels.com/photos/161401/fushimi-inari-taisha-shrine-kyoto-japan-161401.jpeg?auto=compress&cs=tinysrgb&w=400',
    tips: ['Best visited during early morning or evening', 'Photography allowed', 'Dress modestly', 'Peaceful environment'],
    coordinates: { lat: 21.1138, lng: 79.0861 },
    highlights: ['Sacred Buddhist site', 'Historical significance', 'Peaceful meditation'],
    bestTime: 'Early morning or evening',
    duration: '2-3 hours',
    accessibility: 'Wheelchair accessible',
    nearbyHotels: ['Hotel Centre Point', 'The Nagpur Ashok', 'Hotel Skylark']
  },
  {
    id: '2',
    name: 'Ambazari Lake',
    description: 'Largest lake in Nagpur, perfect for boating, picnics and sunset views',
    category: 'Nature',
    area: 'Ambazari',
    rating: 4.5,
    reviewCount: 1834,
    distance: '8 km from city center',
    timings: '5:00 AM - 10:00 PM',
    entryFee: '₹10 per person',
    image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=400',
    tips: ['Boating available ₹50-100', 'Best sunset views', 'Food stalls nearby', 'Parking available'],
    coordinates: { lat: 21.1307, lng: 79.0270 },
    highlights: ['Boating facilities', 'Sunset photography', 'Family picnic spot', 'Food courts'],
    bestTime: 'Evening for sunset',
    duration: '3-4 hours',
    accessibility: 'Partially accessible',
    nearbyHotels: ['Radisson Blu', 'Hotel Hardeo', 'Tuli Imperial']
  },
  {
    id: '3',
    name: 'Sitabuldi Fort',
    description: 'Historic fort offering panoramic views of Nagpur city',
    category: 'Historical',
    area: 'Sitabuldi',
    rating: 4.3,
    reviewCount: 987,
    distance: '2 km from city center',
    timings: '9:00 AM - 6:00 PM',
    entryFee: '₹25 per person',
    image: 'https://images.pexels.com/photos/1583582/pexels-photo-1583582.jpeg?auto=compress&cs=tinysrgb&w=400',
    tips: ['Climb to top for city views', 'Carry water bottle', 'Closed on Mondays', 'Best photography spot'],
    coordinates: { lat: 21.1498, lng: 79.0806 },
    highlights: ['Panoramic city views', 'Historical architecture', 'Photography spot', 'Heritage site'],
    bestTime: 'Morning or late afternoon',
    duration: '2-3 hours',
    accessibility: 'Not wheelchair accessible',
    nearbyHotels: ['The Pride Hotel', 'Hotel Skylark', 'Hotel Centre Point']
  }
];

export const NAGPUR_RESTAURANTS = [
  {
    id: '1',
    name: 'Saoji Bhojnalaya',
    cuisine: 'Traditional Saoji',
    specialty: 'Spicy mutton curry and authentic Saoji dishes',
    area: 'Sitabuldi',
    rating: 4.7,
    reviewCount: 3456,
    priceRange: '₹200-400 per person',
    timings: '11:00 AM - 11:00 PM',
    contact: '+91-712-2345678',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    mustTry: ['Saoji Mutton', 'Saoji Chicken', 'Bhakri', 'Solkadhi'],
    ambiance: 'Traditional and authentic',
    features: ['Authentic Nagpur cuisine', 'Family-friendly', 'Air-conditioned', 'Parking available']
  },
  {
    name: 'Tarri Poha Center',
    cuisine: 'Local Street Food',
    specialty: 'Famous Nagpur breakfast - Tarri Poha with Jalebi',
    area: 'Sadar',
    rating: 4.5,
    reviewCount: 1567,
    priceRange: '₹50-150 per person',
    timings: '7:00 AM - 11:00 AM',
    contact: '+91-712-4567890',
    image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400',
    mustTry: ['Tarri Poha', 'Jalebi', 'Samosa', 'Kachori'],
    ambiance: 'Street food style',
    features: ['Authentic breakfast', 'Budget-friendly', 'Quick service', 'Local favorite']
  },
  {
    name: 'Orange County Restaurant',
    cuisine: 'Multi-cuisine',
    specialty: 'Orange-themed dishes and continental cuisine',
    area: 'Dharampeth',
    rating: 4.4,
    reviewCount: 892,
    priceRange: '₹300-600 per person',
    timings: '12:00 PM - 11:00 PM',
    contact: '+91-712-5678901',
    image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400',
    mustTry: ['Orange Chicken', 'Orange Desserts', 'Continental Dishes'],
    ambiance: 'Modern and elegant',
    features: ['Orange-themed menu', 'Fine dining', 'Air-conditioned', 'Valet parking']
  }
];

export const NAGPUR_WEATHER = {
  summer: {
    months: ['March', 'April', 'May', 'June'],
    temperature: '25°C - 45°C',
    description: 'Hot and dry weather. Early morning and evening activities recommended. Stay hydrated and book hotels with good AC.'
  },
  monsoon: {
    months: ['July', 'August', 'September'],
    temperature: '22°C - 35°C',
    description: 'Rainy season with pleasant weather. Great time for indoor attractions and enjoying hotel amenities.'
  },
  winter: {
    months: ['October', 'November', 'December', 'January', 'February'],
    temperature: '10°C - 30°C',
    description: 'Pleasant and cool weather - perfect time to visit Nagpur. Ideal for sightseeing and outdoor activities.'
  }
};

export const TRAVEL_TIPS = [
  'Best time to visit Nagpur is from October to March (winter season)',
  'Nagpur is famous for its oranges - try local orange-based dishes and sweets',
  'Auto-rickshaws and taxis are readily available for local transport',
  'Dr. Babasaheb Ambedkar International Airport connects to major Indian cities',
  'Local languages are Marathi and Hindi, English is widely understood',
  'Try local specialties like Saoji cuisine and Tarri Poha for breakfast',
  'Carry cash as many local vendors don\'t accept cards',
  'Book hotels in advance during winter season (peak tourist time)',
  'Use official taxi services or ride-sharing apps (Ola/Uber) for safety',
  'Stay hydrated, especially during summer months (March-June)',
  'Respect local customs and dress modestly when visiting religious sites',
  'Nagpur is the geographical center of India - visit Zero Mile Stone',
  'Try famous Nagpur oranges available from November to February',
  'Visit Deekshabhoomi early morning or evening for peaceful experience',
  'Ambazari Lake is perfect for evening walks and boating'
];

export const EMERGENCY_CONTACTS = {
  police: '100',
  fire: '101',
  ambulance: '108',
  touristHelpline: '1363',
  nagpurPoliceControl: '0712-2563344',
  airportEnquiry: '0712-2328888',
  railwayEnquiry: '139',
  medicalEmergency: '102',
  womenHelpline: '1091',
  childHelpline: '1098',
  roadAccident: '1073',
  gasLeakage: '1906'
};

export const NAGPUR_HOTELS_DATA = [
  {
    id: '1',
    name: 'The Pride Hotel Nagpur',
    area: 'Sitabuldi',
    address: 'Sitabuldi Square, Nagpur, Maharashtra 440012',
    coordinates: { lat: 21.1458, lng: 79.0882 },
    priceRange: { min: 3000, max: 6000 },
    rating: 4.8,
    reviewCount: 1234,
    amenities: ['WiFi', 'AC', 'Restaurant', 'Gym', 'Pool', 'Spa', 'Conference Hall', 'Parking'],
    roomTypes: ['Standard', 'Deluxe', 'Suite', 'Executive'],
    specialties: ['Business Hotel', 'Central Location', 'Premium Service'],
    nearbyAttractions: ['Sitabuldi Fort', 'Central Mall', 'Railway Station']
  },
  {
    id: '2',
    name: 'Radisson Blu Hotel Nagpur',
    area: 'Wardha Road',
    address: 'Wardha Road, Near Airport, Nagpur, Maharashtra 440015',
    coordinates: { lat: 21.1200, lng: 79.0500 },
    priceRange: { min: 4000, max: 8000 },
    rating: 4.7,
    reviewCount: 987,
    amenities: ['WiFi', 'AC', 'Restaurant', 'Gym', 'Pool', 'Spa', 'Airport Shuttle', 'Business Center'],
    roomTypes: ['Deluxe', 'Suite', 'Executive', 'Presidential'],
    specialties: ['Airport Hotel', 'Business Facilities', 'International Chain'],
    nearbyAttractions: ['Airport', 'AIIMS Nagpur', 'Business Parks']
  },
  {
    id: '3',
    name: 'Hotel Centre Point Nagpur',
    area: 'Civil Lines',
    address: 'Central Avenue Road, Civil Lines, Nagpur, Maharashtra 440001',
    coordinates: { lat: 21.1500, lng: 79.0900 },
    priceRange: { min: 2500, max: 5000 },
    rating: 4.5,
    reviewCount: 756,
    amenities: ['WiFi', 'AC', 'Restaurant', 'Parking', 'Room Service', 'Laundry'],
    roomTypes: ['Standard', 'Deluxe', 'Suite'],
    specialties: ['Government Area', 'Budget Friendly', 'Good Connectivity'],
    nearbyAttractions: ['Vidhan Bhavan', 'High Court', 'Raj Bhavan']
  }
];

export const NAGPUR_TRANSPORT = [
  {
    mode: 'Auto Rickshaw',
    description: 'Most convenient for short distances within Nagpur city',
    fare: '₹15-20 per km',
    availability: '24/7',
    tips: 'Use meter or negotiate fare beforehand. Widely available.',
    pros: ['Door-to-door service', 'Easily available', 'Good for short trips', 'Can navigate narrow lanes'],
    cons: ['No AC', 'Can be expensive for long distances', 'Traffic dependent']
  },
  {
    mode: 'City Bus (MSRTC)',
    description: 'Economical option connecting all major areas of Nagpur',
    fare: '₹8-25 per trip',
    availability: '6:00 AM - 10:00 PM',
    tips: 'MSRTC buses connect all areas. Buy tickets from conductor.',
    pros: ['Very economical', 'Connects all areas', 'Frequent service', 'Environment friendly'],
    cons: ['Can be crowded', 'Limited AC buses', 'Fixed routes only']
  },
  {
    mode: 'Taxi/Cab (Ola/Uber)',
    description: 'Comfortable AC transport with GPS tracking and cashless payment',
    fare: '₹12-15 per km',
    availability: '24/7',
    tips: 'Book through app for transparent pricing. Good for airport transfers.',
    pros: ['AC comfort', 'GPS tracking', 'Cashless payment', 'Professional drivers'],
    cons: ['More expensive', 'Surge pricing during peak', 'App dependency']
  },
  {
    mode: 'Nagpur Metro (Upcoming)',
    description: 'Modern rapid transit system currently under construction',
    fare: 'Expected ₹10-40 per trip',
    availability: 'Coming Soon',
    tips: 'Phase 1 expected to start operations soon. Will connect major areas.',
    pros: ['Fast and efficient', 'Environment friendly', 'Fixed timings', 'Modern facilities'],
    cons: ['Limited coverage initially', 'Still under construction', 'Fixed routes']
  }
];

export const HOTEL_AMENITIES = [
  'WiFi',
  'AC',
  'TV',
  'Parking',
  'Restaurant',
  'Room Service',
  'Gym',
  'Swimming Pool',
  'Spa',
  'Conference Hall',
  'Laundry',
  'Airport Shuttle',
  'Bar',
  'Garden',
  'Terrace',
  'Elevator',
  'Power Backup',
  'CCTV',
  '24/7 Reception',
  'Housekeeping'
];

export const ROOM_TYPES = [
  {
    type: 'Standard',
    description: 'Comfortable rooms with basic amenities and city views',
    capacity: { adults: 2, children: 1 },
    priceRange: { min: 1500, max: 3000 },
    features: ['AC', 'WiFi', 'TV', 'Attached Bathroom']
  },
  {
    type: 'Deluxe',
    description: 'Spacious rooms with premium amenities and better views',
    capacity: { adults: 2, children: 2 },
    priceRange: { min: 2500, max: 4500 },
    features: ['AC', 'WiFi', 'TV', 'Minibar', 'City View', 'Premium Bathroom']
  },
  {
    type: 'Suite',
    description: 'Luxury suites with separate living area and premium services',
    capacity: { adults: 3, children: 2 },
    priceRange: { min: 4000, max: 8000 },
    features: ['AC', 'WiFi', 'TV', 'Minibar', 'Living Area', 'Premium View', 'Butler Service']
  },
  {
    type: 'Executive',
    description: 'Business-class rooms with work facilities and lounge access',
    capacity: { adults: 2, children: 1 },
    priceRange: { min: 3500, max: 6500 },
    features: ['AC', 'WiFi', 'TV', 'Work Desk', 'Business Lounge', 'Express Check-in']
  },
  {
    type: 'Presidential',
    description: 'Ultra-luxury suites with premium services and city views',
    capacity: { adults: 4, children: 2 },
    priceRange: { min: 8000, max: 15000 },
    features: ['AC', 'WiFi', 'TV', 'Butler Service', 'Premium View', 'Separate Dining', 'Luxury Amenities']
  }
];

export const NAGPUR_FOOD_SPECIALTIES = [
  {
    name: 'Saoji Cuisine',
    description: 'Spicy traditional cuisine unique to Nagpur region',
    mustTry: ['Saoji Mutton', 'Saoji Chicken', 'Bhakri', 'Solkadhi'],
    whereToFind: ['Saoji Bhojnalaya', 'Shree Saoji Hotel', 'Jai Hind Saoji']
  },
  {
    name: 'Tarri Poha',
    description: 'Famous Nagpur breakfast dish with spicy curry',
    mustTry: ['Tarri Poha', 'Jalebi', 'Samosa'],
    whereToFind: ['Tarri Poha Center', 'Street vendors in Sadar', 'Local breakfast joints']
  },
  {
    name: 'Nagpur Oranges',
    description: 'World-famous oranges available from November to February',
    mustTry: ['Fresh oranges', 'Orange juice', 'Orange sweets', 'Orange ice cream'],
    whereToFind: ['Itwari Market', 'Local fruit vendors', 'Orange orchards nearby']
  }
];

export const NAGPUR_SHOPPING = [
  {
    name: 'Sitabuldi Main Road',
    type: 'Street Shopping',
    specialty: 'Clothes, electronics, local items, street food',
    area: 'Sitabuldi',
    timing: '10:00 AM - 9:00 PM',
    highlights: ['Bargaining allowed', 'Local items', 'Street food', 'Traditional clothes'],
    priceRange: 'Budget to Mid-range'
  },
  {
    name: 'Empress City Mall',
    type: 'Shopping Mall',
    specialty: 'Branded stores, food court, cinema, entertainment',
    area: 'Nagpur Central',
    timing: '11:00 AM - 10:00 PM',
    highlights: ['Air-conditioned', 'Food court', 'Cinema', 'Branded stores'],
    priceRange: 'Mid to High-range'
  },
  {
    name: 'Itwari Market',
    type: 'Traditional Market',
    specialty: 'Famous for Nagpur oranges, local produce, handicrafts',
    area: 'Itwari',
    timing: '8:00 AM - 8:00 PM',
    highlights: ['Fresh oranges', 'Local handicrafts', 'Traditional items', 'Wholesale prices'],
    priceRange: 'Budget-friendly'
  }
];

// Nagpur-specific booking flow
export const BOOKING_FLOW = {
  steps: [
    'Select Area in Nagpur',
    'Choose Hotel',
    'Select Dates & Guests',
    'Review Booking',
    'Payment (INR)',
    'Confirmation'
  ],
  paymentMethods: ['UPI', 'Credit/Debit Card', 'Net Banking', 'Wallet'],
  cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
  taxes: {
    gst: 12, // 12% GST in India
    serviceFee: 2 // 2% service fee
  }
};

export const NAGPUR_CONTACT_INFO = {
  office: {
    address: 'Sitabuldi Square, Nagpur, Maharashtra 440012',
    phone: '+91-712-QUICKSTAY',
    email: 'support@quickstay-nagpur.com',
    timings: 'Mon-Sun: 9:00 AM - 9:00 PM IST'
  },
  support: {
    phone: '+91-712-SUPPORT',
    whatsapp: '+91-98765-43210',
    email: 'help@quickstay-nagpur.com',
    languages: ['Hindi', 'English', 'Marathi']
  }
};