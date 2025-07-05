// Nagpur-specific data and constants

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

export const NAGPUR_LANDMARKS = [
  'Nagpur Railway Station',
  'Dr. Babasaheb Ambedkar International Airport',
  'Deekshabhoomi',
  'Sitabuldi Fort',
  'Raman Science Centre',
  'Ambazari Lake',
  'Futala Lake',
  'Maharaj Bagh Zoo',
  'Nagpur Central Mall',
  'Empress City Mall',
  'Zero Mile Stone',
  'Vidhan Bhavan',
  'High Court of Bombay (Nagpur Bench)',
  'AIIMS Nagpur',
  'IIM Nagpur',
  'VNIT Nagpur'
];

export const POPULAR_HOTEL_AREAS = [
  {
    name: 'Sitabuldi',
    description: 'Central business district with shopping and commercial areas',
    hotels: 25,
    avgPrice: 2500,
    highlights: ['Shopping', 'Business', 'Transport Hub']
  },
  {
    name: 'Civil Lines',
    description: 'Government area with administrative offices',
    hotels: 18,
    avgPrice: 3200,
    highlights: ['Government Offices', 'Quiet Area', 'Well Connected']
  },
  {
    name: 'Dharampeth',
    description: 'Upscale residential area with modern amenities',
    hotels: 22,
    avgPrice: 3800,
    highlights: ['Upscale', 'Restaurants', 'Modern']
  },
  {
    name: 'Sadar',
    description: 'Commercial hub with markets and business centers',
    hotels: 20,
    avgPrice: 2800,
    highlights: ['Commercial', 'Markets', 'Business']
  },
  {
    name: 'Seminary Hills',
    description: 'Educational area with colleges and peaceful environment',
    hotels: 15,
    avgPrice: 2200,
    highlights: ['Educational', 'Peaceful', 'Green Area']
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
    description: 'Comfortable rooms with basic amenities',
    capacity: { adults: 2, children: 1 },
    priceRange: { min: 1000, max: 2500 }
  },
  {
    type: 'Deluxe',
    description: 'Spacious rooms with premium amenities',
    capacity: { adults: 2, children: 2 },
    priceRange: { min: 2000, max: 4000 }
  },
  {
    type: 'Suite',
    description: 'Luxury suites with separate living area',
    capacity: { adults: 3, children: 2 },
    priceRange: { min: 3500, max: 7000 }
  },
  {
    type: 'Executive',
    description: 'Business-class rooms with work facilities',
    capacity: { adults: 2, children: 1 },
    priceRange: { min: 3000, max: 6000 }
  },
  {
    type: 'Presidential',
    description: 'Ultra-luxury suites with premium services',
    capacity: { adults: 4, children: 2 },
    priceRange: { min: 8000, max: 15000 }
  }
];

export const NAGPUR_WEATHER = {
  summer: {
    months: ['March', 'April', 'May', 'June'],
    temperature: '25°C - 45°C',
    description: 'Hot and dry weather'
  },
  monsoon: {
    months: ['July', 'August', 'September'],
    temperature: '22°C - 35°C',
    description: 'Rainy season with pleasant weather'
  },
  winter: {
    months: ['October', 'November', 'December', 'January', 'February'],
    temperature: '10°C - 30°C',
    description: 'Pleasant and cool weather - best time to visit'
  }
};

export const TRAVEL_TIPS = [
  'Best time to visit Nagpur is from October to March',
  'Nagpur is famous for its oranges - try local orange-based dishes',
  'Auto-rickshaws and taxis are readily available for local transport',
  'Nagpur Airport is well-connected to major Indian cities',
  'Local language is Marathi, but Hindi and English are widely spoken',
  'Try local specialties like Saoji cuisine and Tarri Poha'
];

export const EMERGENCY_CONTACTS = {
  police: '100',
  fire: '101',
  ambulance: '108',
  touristHelpline: '1363',
  nagpurPoliceControl: '0712-2563344',
  airportEnquiry: '0712-2328888'
};