// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
// import { 
//   Search, 
//   MapPin, 
//   Calendar, 
//   Users, 
//   Star, 
//   TrendingUp, 
//   Award,
//   Shield,
//   Clock,
//   Phone,
//   Wifi,
//   Car,
//   Coffee,
//   Dumbbell,
//   ArrowRight,
//   Play,
//   CheckCircle,
//   Heart,
//   Sparkles
// } from 'lucide-react';
// import { fetchFeaturedHotels } from '../store/slices/hotelSlice';
// import { RootState, AppDispatch } from '../store/store';
// import { NAGPUR_AREAS, POPULAR_HOTEL_AREAS } from '../data/nagpurData';
// import WeatherWidget from '../components/Nagpur/WeatherWidget';
// import useSocket from '../hooks/useSocket';
// import toast from 'react-hot-toast';

// const Home: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { featuredHotels, loading } = useSelector((state: RootState) => state.hotels);
//   const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [checkIn, setCheckIn] = useState('');
//   const [checkOut, setCheckOut] = useState('');
//   const [guests, setGuests] = useState('2');
//   const [selectedArea, setSelectedArea] = useState('');
//   const socket = useSocket();

//   useEffect(() => {
//     dispatch(fetchFeaturedHotels());
//     if (socket && isAuthenticated) {
//       socket.trackUserActivity('visited_home_page');
//     }
//   }, [dispatch, socket, isAuthenticated]);

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     const searchParams = new URLSearchParams({
//       q: searchQuery || selectedArea,
//       checkin: checkIn,
//       checkout: checkOut,
//       guests: guests,
//       area: selectedArea,
//     });
//     window.location.href = `/hotels?${searchParams.toString()}`;
//   };

//   const handleQuickAreaSearch = (area: string) => {
//     window.location.href = `/hotels?area=${encodeURIComponent(area)}`;
//   };

//   // Nagpur-specific featured hotels data
//   const nagpurFeaturedHotels = [
//     {
//       id: '1',
//       name: 'The Pride Hotel Nagpur',
//       area: 'Sitabuldi',
//       price: 3500,
//       originalPrice: 4200,
//       rating: 4.8,
//       reviewCount: 1234,
//       image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800',
//       amenities: ['WiFi', 'AC', 'Restaurant', 'Gym', 'Pool', 'Spa'],
//       description: 'Luxury hotel in the heart of Nagpur with world-class amenities',
//       discount: 17,
//       isAvailable: true,
//       specialOffer: 'Free Airport Transfer'
//     },
//     {
//       id: '2',
//       name: 'Radisson Blu Hotel Nagpur',
//       area: 'Wardha Road',
//       price: 4200,
//       rating: 4.7,
//       reviewCount: 987,
//       image: 'https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=800',
//       amenities: ['WiFi', 'AC', 'Restaurant', 'Gym', 'Conference Hall', 'Bar'],
//       description: 'Premium business hotel near airport with modern facilities',
//       isAvailable: true,
//       specialOffer: 'Business Lounge Access'
//     },
//     {
//       id: '3',
//       name: 'Hotel Centre Point Nagpur',
//       area: 'Civil Lines',
//       price: 2800,
//       originalPrice: 3200,
//       rating: 4.5,
//       reviewCount: 756,
//       image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800',
//       amenities: ['WiFi', 'AC', 'Restaurant', 'Parking', 'Room Service'],
//       description: 'Comfortable stay in government area with excellent connectivity',
//       discount: 13,
//       isAvailable: true,
//       specialOffer: 'Complimentary Breakfast'
//     },
//     {
//       id: '4',
//       name: 'Tuli Imperial Nagpur',
//       area: 'Dharampeth',
//       price: 3200,
//       rating: 4.6,
//       reviewCount: 892,
//       image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800',
//       amenities: ['WiFi', 'AC', 'Restaurant', 'Gym', 'Spa', 'Garden'],
//       description: 'Elegant hotel in upscale Dharampeth area with premium services',
//       isAvailable: true,
//       specialOffer: 'Spa Credit ₹500'
//     }
//   ];

//   const nagpurStats = {
//     totalHotels: 89,
//     areas: 18,
//     avgRating: 4.6,
//     happyGuests: '50K+'
//   };

//   const getAmenityIcon = (amenity: string) => {
//     switch (amenity.toLowerCase()) {
//       case 'wifi': return <Wifi className="h-4 w-4" />;
//       case 'gym': return <Dumbbell className="h-4 w-4" />;
//       case 'restaurant': case 'bar': return <Coffee className="h-4 w-4" />;
//       case 'parking': return <Car className="h-4 w-4" />;
//       default: return <Coffee className="h-4 w-4" />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Hero Section - Nagpur Focused */}
//       <section className="relative bg-gradient-to-br from-orange-500 via-red-600 to-pink-600 text-white overflow-hidden">
//         {/* Background Elements */}
//         <div className="absolute inset-0">
//           <div className="absolute inset-0 bg-black/20"></div>
//           <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
//           <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
//         </div>

//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//             {/* Left Content */}
//             <div className="space-y-8">
//               {/* Nagpur Badge */}
//               <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
//                 <MapPin className="h-4 w-4 text-orange-300" />
//                 <span className="text-sm font-medium">Nagpur, Maharashtra</span>
//                 <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//               </div>

//               {/* Main Heading */}
//               <div className="space-y-4">
//                 <h1 className="text-4xl md:text-6xl font-bold leading-tight">
//                   Discover
//                   <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
//                     Orange City
//                   </span>
//                   Hotels
//                 </h1>
//                 <p className="text-xl md:text-2xl text-orange-100 max-w-2xl leading-relaxed">
//                   Book the best hotels in Nagpur with instant confirmation, local expertise, and unbeatable prices
//                 </p>
//               </div>

//               {/* Nagpur Stats */}
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
//                 <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
//                   <div className="text-2xl font-bold">{nagpurStats.totalHotels}</div>
//                   <div className="text-orange-200 text-sm">Hotels</div>
//                 </div>
//                 <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
//                   <div className="text-2xl font-bold">{nagpurStats.areas}</div>
//                   <div className="text-orange-200 text-sm">Areas</div>
//                 </div>
//                 <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
//                   <div className="text-2xl font-bold">{nagpurStats.avgRating}</div>
//                   <div className="text-orange-200 text-sm">Avg Rating</div>
//                 </div>
//                 <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
//                   <div className="text-2xl font-bold">{nagpurStats.happyGuests}</div>
//                   <div className="text-orange-200 text-sm">Happy Guests</div>
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex flex-col sm:flex-row gap-4">
//                 <Link
//                   to="/hotels"
//                   className="group bg-white text-orange-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
//                 >
//                   <span>Book Hotels in Nagpur</span>
//                   <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
//                 </Link>
                
//                 <Link
//                   to="/explore"
//                   className="group border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2"
//                 >
//                   <MapPin className="h-5 w-5" />
//                   <span>Explore Nagpur</span>
//                 </Link>
//               </div>
//             </div>

//             {/* Right Content - Weather Widget */}
//             <div className="relative">
//               <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
//                 <WeatherWidget />
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Nagpur Hotel Search Section */}
//       <section className="bg-white py-16 -mt-8 relative z-10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="bg-white rounded-3xl shadow-2xl p-8 border border-orange-100">
//             <div className="text-center mb-8">
//               <h2 className="text-3xl font-bold text-gray-900 mb-2">Find Hotels in Nagpur</h2>
//               <p className="text-gray-600">Search across 18 areas of the Orange City</p>
//             </div>

//             <form onSubmit={handleSearch} className="space-y-6">
//               {/* Area Selection */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Select Area in Nagpur
//                 </label>
//                 <select
//                   value={selectedArea}
//                   onChange={(e) => setSelectedArea(e.target.value)}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                 >
//                   <option value="">All Areas in Nagpur</option>
//                   {NAGPUR_AREAS.map(area => (
//                     <option key={area} value={area}>{area}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Date and Guest Selection */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
//                   <div className="relative">
//                     <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                     <input
//                       type="date"
//                       value={checkIn}
//                       onChange={(e) => setCheckIn(e.target.value)}
//                       min={new Date().toISOString().split('T')[0]}
//                       className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
//                   <div className="relative">
//                     <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                     <input
//                       type="date"
//                       value={checkOut}
//                       onChange={(e) => setCheckOut(e.target.value)}
//                       min={checkIn || new Date().toISOString().split('T')[0]}
//                       className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
//                   <div className="relative">
//                     <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                     <select
//                       value={guests}
//                       onChange={(e) => setGuests(e.target.value)}
//                       className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none"
//                     >
//                       <option value="1">1 Guest</option>
//                       <option value="2">2 Guests</option>
//                       <option value="3">3 Guests</option>
//                       <option value="4">4 Guests</option>
//                       <option value="5">5+ Guests</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex justify-center">
//                 <button
//                   type="submit"
//                   className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-12 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 shadow-lg hover:shadow-xl"
//                 >
//                   <Search className="h-5 w-5" />
//                   <span>Search Nagpur Hotels</span>
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </section>

//       {/* Popular Areas in Nagpur */}
//       <section className="py-16 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Areas in Nagpur</h2>
//             <p className="text-xl text-gray-600">Explore hotels across different areas of the Orange City</p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {POPULAR_HOTEL_AREAS.slice(0, 6).map((area, index) => (
//               <div
//                 key={area.name}
//                 className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
//                 onClick={() => handleQuickAreaSearch(area.name)}
//               >
//                 <div className="relative h-48 bg-gradient-to-br from-orange-400 to-red-500">
//                   <div className="absolute inset-0 bg-black/20"></div>
//                   <div className="absolute bottom-4 left-4 text-white">
//                     <h3 className="text-xl font-bold">{area.name}</h3>
//                     <p className="text-orange-100">{area.hotels} hotels available</p>
//                   </div>
//                   <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
//                     <span className="text-white text-sm font-medium">₹{area.avgPrice.toLocaleString()}</span>
//                   </div>
//                 </div>
//                 <div className="p-6">
//                   <p className="text-gray-600 mb-4">{area.description}</p>
//                   <div className="flex flex-wrap gap-2">
//                     {area.highlights.map((highlight) => (
//                       <span
//                         key={highlight}
//                         className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium"
//                       >
//                         {highlight}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Featured Hotels in Nagpur */}
//       <section className="py-16 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Hotels in Nagpur</h2>
//             <p className="text-xl text-gray-600">Handpicked accommodations across the Orange City</p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {nagpurFeaturedHotels.map((hotel) => (
//               <div
//                 key={hotel.id}
//                 className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
//               >
//                 <div className="relative">
//                   <img
//                     src={hotel.image}
//                     alt={hotel.name}
//                     className="w-full h-48 object-cover"
//                   />
//                   {hotel.discount && (
//                     <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
//                       {hotel.discount}% OFF
//                     </div>
//                   )}
//                   <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center space-x-1">
//                     <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                     <span className="text-sm font-semibold">{hotel.rating}</span>
//                   </div>
//                   {hotel.specialOffer && (
//                     <div className="absolute bottom-4 left-4 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
//                       {hotel.specialOffer}
//                     </div>
//                   )}
//                 </div>

//                 <div className="p-6">
//                   <div className="mb-4">
//                     <h3 className="text-lg font-bold text-gray-900 mb-1">{hotel.name}</h3>
//                     <div className="flex items-center text-gray-600 space-x-1 mb-2">
//                       <MapPin className="h-4 w-4 text-orange-500" />
//                       <span className="text-sm">{hotel.area}, Nagpur</span>
//                     </div>
//                     <div className="flex items-center space-x-2 text-sm text-gray-600">
//                       <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                       <span>{hotel.rating} ({hotel.reviewCount} reviews)</span>
//                     </div>
//                   </div>

//                   <div className="flex flex-wrap gap-1 mb-4">
//                     {hotel.amenities.slice(0, 4).map((amenity) => (
//                       <div
//                         key={amenity}
//                         className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded text-xs text-gray-600"
//                       >
//                         {getAmenityIcon(amenity)}
//                         <span>{amenity}</span>
//                       </div>
//                     ))}
//                   </div>

//                   <div className="flex items-center justify-between mb-4">
//                     <div className="text-right">
//                       {hotel.originalPrice && (
//                         <div className="text-sm text-gray-500 line-through">
//                           ₹{hotel.originalPrice.toLocaleString()}
//                         </div>
//                       )}
//                       <div className="text-xl font-bold text-orange-600">
//                         ₹{hotel.price.toLocaleString()}
//                       </div>
//                       <div className="text-sm text-gray-600">per night</div>
//                     </div>
//                   </div>

//                   <Link
//                     to={`/hotels/${hotel.id}`}
//                     className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 text-center block"
//                   >
//                     Book Now
//                   </Link>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="text-center mt-12">
//             <Link
//               to="/hotels"
//               className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 inline-flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105"
//             >
//               <span>View All Nagpur Hotels</span>
//               <ArrowRight className="h-5 w-5" />
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* Why Choose Us for Nagpur */}
//       <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us for Nagpur Hotels?</h2>
//             <p className="text-xl text-gray-600">Local expertise meets modern technology</p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {[
//               {
//                 icon: <MapPin className="h-8 w-8" />,
//                 title: 'Local Expertise',
//                 description: 'Deep knowledge of all 18 areas in Nagpur with insider recommendations',
//                 color: 'text-orange-600 bg-orange-100'
//               },
//               {
//                 icon: <Shield className="h-8 w-8" />,
//                 title: 'Secure Booking',
//                 description: 'Bank-level security for all payments with instant confirmation',
//                 color: 'text-green-600 bg-green-100'
//               },
//               {
//                 icon: <Clock className="h-8 w-8" />,
//                 title: '24/7 Support',
//                 description: 'Round-the-clock customer support in Hindi, English & Marathi',
//                 color: 'text-blue-600 bg-blue-100'
//               },
//               {
//                 icon: <Award className="h-8 w-8" />,
//                 title: 'Best Prices',
//                 description: 'Guaranteed best rates for Nagpur hotels with price matching',
//                 color: 'text-purple-600 bg-purple-100'
//               }
//             ].map((feature, index) => (
//               <div key={index} className="text-center p-6 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300">
//                 <div className={`inline-flex items-center justify-center w-16 h-16 ${feature.color} rounded-2xl mb-4`}>
//                   {feature.icon}
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
//                 <p className="text-gray-600">{feature.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Nagpur Highlights */}
//       <section className="py-16 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl font-bold text-gray-900 mb-4">Discover Nagpur</h2>
//             <p className="text-xl text-gray-600">The Orange City has so much to offer</p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="text-center p-6">
//               <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <MapPin className="h-8 w-8 text-orange-600" />
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">18 Areas Covered</h3>
//               <p className="text-gray-600">From Sitabuldi to Seminary Hills, we cover every major area in Nagpur</p>
//               <Link to="/explore" className="text-orange-600 hover:text-orange-700 font-medium mt-2 inline-block">
//                 Explore Areas →
//               </Link>
//             </div>

//             <div className="text-center p-6">
//               <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Star className="h-8 w-8 text-orange-600" />
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">Top Attractions</h3>
//               <p className="text-gray-600">Visit Deekshabhoomi, Ambazari Lake, Sitabuldi Fort and more iconic places</p>
//               <Link to="/explore" className="text-orange-600 hover:text-orange-700 font-medium mt-2 inline-block">
//                 View Attractions →
//               </Link>
//             </div>

//             <div className="text-center p-6">
//               <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Coffee className="h-8 w-8 text-orange-600" />
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">Local Cuisine</h3>
//               <p className="text-gray-600">Experience authentic Saoji food, Tarri Poha and famous Nagpur oranges</p>
//               <Link to="/explore" className="text-orange-600 hover:text-orange-700 font-medium mt-2 inline-block">
//                 Food Guide →
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Testimonials from Nagpur Visitors */}
//       <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl font-bold text-gray-900 mb-4">What Nagpur Visitors Say</h2>
//             <p className="text-xl text-gray-600">Real experiences from travelers who explored the Orange City</p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {[
//               {
//                 name: 'Priya Sharma',
//                 role: 'Business Traveler from Mumbai',
//                 avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
//                 rating: 5,
//                 comment: 'Excellent hotels in Sitabuldi area. Perfect for business meetings and close to all major offices. The local Saoji food was amazing!',
//               },
//               {
//                 name: 'Rajesh Patel',
//                 role: 'Family Vacation from Gujarat',
//                 avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150',
//                 rating: 5,
//                 comment: 'Wonderful family trip to Nagpur. Visited Deekshabhoomi and Ambazari Lake. The hotel recommendations were spot-on for families.',
//               },
//               {
//                 name: 'Anita Deshmukh',
//                 role: 'Solo Traveler from Pune',
//                 avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150',
//                 rating: 5,
//                 comment: 'Safe and comfortable stay in Civil Lines area. Great connectivity to railway station and airport. Loved the local hospitality!',
//               },
//             ].map((testimonial, index) => (
//               <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
//                 <div className="flex mb-4">
//                   {[...Array(testimonial.rating)].map((_, i) => (
//                     <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
//                   ))}
//                 </div>
//                 <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.comment}"</p>
//                 <div className="flex items-center">
//                   <img
//                     src={testimonial.avatar}
//                     alt={testimonial.name}
//                     className="w-12 h-12 rounded-full object-cover mr-4"
//                   />
//                   <div>
//                     <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
//                     <p className="text-sm text-gray-600">{testimonial.role}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Call to Action */}
//       <section className="py-16 bg-gradient-to-r from-orange-500 to-red-600 text-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Explore Nagpur?</h2>
//           <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
//             Join thousands of travelers who have discovered the Orange City through our platform
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <Link
//               to="/hotels"
//               className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
//             >
//               <Search className="h-5 w-5" />
//               <span>Book Nagpur Hotels</span>
//             </Link>
//             <Link
//               to="/explore"
//               className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2"
//             >
//               <MapPin className="h-5 w-5" />
//               <span>Explore Orange City</span>
//             </Link>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Home;

import React, { useEffect, useMemo, useState, useCallback, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  Star, 
  Award,
  Shield,
  Clock,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { fetchFeaturedHotels } from '../store/slices/hotelSlice';
import { RootState, AppDispatch } from '../store/store';
import { NAGPUR_AREAS, POPULAR_HOTEL_AREAS } from '../data/nagpurData';
import useSocket from '../hooks/useSocket';
import toast from 'react-hot-toast';

// Lazy import for performance
const WeatherWidget = React.lazy(() => import('../components/Nagpur/WeatherWidget'));

// Types
interface Hotel {
  id: string;
  name: string;
  area: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  amenities: string[];
  description: string;
  discount?: number;
  isAvailable: boolean;
  specialOffer?: string;
}

interface FormData {
  searchQuery: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  selectedArea: string;
}

// Reusable Components
const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8'
  };
  
  return (
    <Loader2 className={`${sizeClasses[size]} animate-spin`} aria-hidden="true" />
  );
};

const ErrorBoundary: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = () => setHasError(true);
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="text-center py-8">
        {fallback || <p className="text-gray-600">Something went wrong. Please refresh the page.</p>}
      </div>
    );
  }

  return <>{children}</>;
};

const OptimizedImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  loading?: 'lazy' | 'eager';
}> = ({ src, alt, className = '', fallbackSrc, loading = 'lazy', ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
    if (fallbackSrc && imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
      setHasError(false);
    } else {
      setIsLoaded(true);
    }
  }, [fallbackSrc, imgSrc]);

  return (
    <div className="relative overflow-hidden">
      {/* Skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
      )}
      
      {/* Image */}
      <img
        src={imgSrc}
        alt={alt}
        className={`transition-all duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        onLoad={handleLoad}
        onError={handleError}
        loading={loading}
        decoding="async"
        {...props}
      />
      
      {/* Error state */}
      {hasError && !fallbackSrc && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Image unavailable</span>
        </div>
      )}
    </div>
  );
};

const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  role?: string;
  tabIndex?: number;
  'aria-label'?: string;
}> = ({ 
  children, 
  className = '', 
  hover = true,
  onClick,
  role,
  tabIndex,
  'aria-label': ariaLabel,
  ...props 
}) => {
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && onClick) {
      e.preventDefault();
      onClick();
    }
  }, [onClick]);

  return (
    <div
      className={`
        bg-white rounded-xl shadow-lg border border-gray-100
        ${hover ? 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300' : ''}
        ${onClick ? 'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500' : ''}
        ${className}
      `}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={role}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </div>
  );
};

const Button: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  'aria-label'?: string;
}> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  'aria-label': ariaLabel,
  ...props
}) => {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white focus-visible:ring-orange-500 hover:scale-105',
    secondary: 'bg-white text-orange-600 border-2 border-orange-500 hover:bg-orange-50 focus-visible:ring-orange-500 hover:scale-105',
    outline: 'border-2 border-white text-white hover:bg-white hover:text-orange-600 focus-visible:ring-white'
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      aria-label={ariaLabel}
      {...props}
    >
      {loading ? <LoadingSpinner size="sm" /> : children}
    </button>
  );
};

// Main Component
const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading } = useSelector((state: RootState) => state.hotels);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const socket = useSocket();

  // Form state using a single object for better organization
  const [formData, setFormData] = useState<FormData>({
    searchQuery: '',
    checkIn: '',
    checkOut: '',
    guests: '2',
    selectedArea: ''
  });

  // Memoized values
  const todayISO = useMemo(() => new Date().toISOString().split('T')[0], []);
  const minCheckOut = useMemo(() => formData.checkIn || todayISO, [formData.checkIn, todayISO]);

  // Static data
  const nagpurFeaturedHotels: Hotel[] = useMemo(() => [
    {
      id: '1',
      name: 'The Pride Hotel Nagpur',
      area: 'Sitabuldi',
      price: 3500,
      originalPrice: 4200,
      rating: 4.8,
      reviewCount: 1234,
      image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800',
      amenities: ['WiFi', 'AC', 'Restaurant', 'Gym', 'Pool', 'Spa'],
      description: 'Luxury hotel in the heart of Nagpur with world-class amenities',
      discount: 17,
      isAvailable: true,
      specialOffer: 'Free Airport Transfer'
    },
    {
      id: '2',
      name: 'Radisson Blu Hotel Nagpur',
      area: 'Wardha Road',
      price: 4200,
      rating: 4.7,
      reviewCount: 987,
      image: 'https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=800',
      amenities: ['WiFi', 'AC', 'Restaurant', 'Gym', 'Conference Hall', 'Bar'],
      description: 'Premium business hotel near airport with modern facilities',
      isAvailable: true,
      specialOffer: 'Business Lounge Access'
    },
    {
      id: '3',
      name: 'Hotel Centre Point Nagpur',
      area: 'Civil Lines',
      price: 2800,
      originalPrice: 3200,
      rating: 4.5,
      reviewCount: 756,
      image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800',
      amenities: ['WiFi', 'AC', 'Restaurant', 'Parking', 'Room Service'],
      description: 'Comfortable stay in government area with excellent connectivity',
      discount: 13,
      isAvailable: true,
      specialOffer: 'Complimentary Breakfast'
    },
    {
      id: '4',
      name: 'Tuli Imperial Nagpur',
      area: 'Dharampeth',
      price: 3200,
      rating: 4.6,
      reviewCount: 892,
      image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800',
      amenities: ['WiFi', 'AC', 'Restaurant', 'Gym', 'Spa', 'Garden'],
      description: 'Elegant hotel in upscale Dharampeth area with premium services',
      isAvailable: true,
      specialOffer: 'Spa Credit ₹500'
    }
  ], []);

  const nagpurStats = useMemo(() => ({
    totalHotels: 89,
    areas: 18,
    avgRating: 4.6,
    happyGuests: '50K+'
  }), []);

  // Effects
  useEffect(() => {
    dispatch(fetchFeaturedHotels());
    if (socket && isAuthenticated) {
      socket.trackUserActivity('visited_home_page');
    }
  }, [dispatch, socket, isAuthenticated]);

  // Date validation effect
  useEffect(() => {
    if (formData.checkIn && formData.checkOut && formData.checkOut < formData.checkIn) {
      setFormData(prev => ({ ...prev, checkOut: formData.checkIn }));
    }
  }, [formData.checkIn, formData.checkOut]);

  // Utility functions
  const getAmenityIcon = useCallback((amenity: string) => {
    const iconProps = { className: "h-4 w-4", 'aria-hidden': true };
    const iconMap: Record<string, React.ReactElement> = {
      wifi: <Wifi {...iconProps} />,
      gym: <Dumbbell {...iconProps} />,
      restaurant: <Coffee {...iconProps} />,
      bar: <Coffee {...iconProps} />,
      parking: <Car {...iconProps} />
    };
    return iconMap[amenity.toLowerCase()] || <Coffee {...iconProps} />;
  }, []);

  const updateFormData = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Event handlers
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.searchQuery.trim() && !formData.selectedArea) {
      toast.error('Please select an area or enter a search query');
      return;
    }

    const searchParams = new URLSearchParams({
      q: formData.searchQuery || formData.selectedArea,
      checkin: formData.checkIn,
      checkout: formData.checkOut,
      guests: formData.guests,
      area: formData.selectedArea,
    });
    
    navigate(`/hotels?${searchParams.toString()}`);
  }, [formData, navigate]);

  const handleQuickAreaSearch = useCallback((area: string) => {
    navigate(`/hotels?area=${encodeURIComponent(area)}`);
  }, [navigate]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-orange-500 via-red-600 to-pink-600 text-white overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl opacity-60" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl opacity-60" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                {/* Nagpur Badge */}
                <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                  <MapPin className="h-4 w-4 text-orange-300" aria-hidden="true" />
                  <span className="text-sm font-medium">Nagpur, Maharashtra</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                </div>

                {/* Main Heading */}
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                    Discover
                    <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                      Orange City
                    </span>
                    Hotels
                  </h1>
                  <p className="text-xl md:text-2xl text-orange-100 max-w-2xl leading-relaxed">
                    Book the best hotels in Nagpur with instant confirmation, local expertise, and unbeatable prices
                  </p>
                </div>

                {/* Nagpur Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  {Object.entries(nagpurStats).map(([key, value]) => (
                    <div key={key} className="bg-white/10 backdrop-blur-sm p-4 rounded-lg hover:bg-white/15 transition-colors duration-300">
                      <div className="text-2xl font-bold">{value}</div>
                      <div className="text-orange-200 text-sm capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => navigate('/hotels')}
                    aria-label="Book hotels in Nagpur"
                  >
                    <span>Book Hotels in Nagpur</span>
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => navigate('/explore')}
                    aria-label="Explore Nagpur attractions"
                  >
                    <MapPin className="h-5 w-5" />
                    <span>Explore Nagpur</span>
                  </Button>
                </div>
              </div>

              {/* Right Content - Weather Widget */}
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors duration-300">
                  <Suspense fallback={<LoadingSpinner />}>
                    <WeatherWidget />
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hotel Search Section */}
        <section className="bg-white py-16 -mt-8 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Find Hotels in Nagpur</h2>
                <p className="text-gray-600">Search across 18 areas of the Orange City</p>
              </div>

              <form onSubmit={handleSearch} className="space-y-6" aria-label="Hotel search form">
                {/* Area Selection */}
                <div>
                  <label htmlFor="area-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Select Area in Nagpur
                  </label>
                  <select
                    id="area-select"
                    value={formData.selectedArea}
                    onChange={(e) => updateFormData('selectedArea', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    aria-label="Select area in Nagpur"
                  >
                    <option value="">All Areas in Nagpur</option>
                    {NAGPUR_AREAS.map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>

                {/* Date and Guest Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="checkin" className="block text-sm font-medium text-gray-700 mb-2">
                      Check-in
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="checkin"
                        type="date"
                        value={formData.checkIn}
                        onChange={(e) => updateFormData('checkIn', e.target.value)}
                        min={todayISO}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="checkout" className="block text-sm font-medium text-gray-700 mb-2">
                      Check-out
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="checkout"
                        type="date"
                        value={formData.checkOut}
                        onChange={(e) => updateFormData('checkOut', e.target.value)}
                        min={minCheckOut}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-2">
                      Guests
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <select
                        id="guests"
                        value={formData.guests}
                        onChange={(e) => updateFormData('guests', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none transition-all duration-200"
                        aria-label="Number of guests"
                      >
                        <option value="1">1 Guest</option>
                        <option value="2">2 Guests</option>
                        <option value="3">3 Guests</option>
                        <option value="4">4 Guests</option>
                        <option value="5">5+ Guests</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button
                    type="submit"
                    size="lg"
                    loading={loading}
                    aria-label="Search hotels in Nagpur"
                  >
                    <Search className="h-5 w-5" />
                    <span>Search Nagpur Hotels</span>
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </section>

        {/* Popular Areas */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Areas in Nagpur</h2>
              <p className="text-xl text-gray-600">Explore hotels across different areas of the Orange City</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {POPULAR_HOTEL_AREAS.slice(0, 6).map((area) => (
                <Card
                  key={area.name}
                  onClick={() => handleQuickAreaSearch(area.name)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Search hotels in ${area.name}`}
                  className="overflow-hidden"
                >
                  <div className="relative h-48 bg-gradient-to-br from-orange-400 to-red-500">
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold">{area.name}</h3>
                      <p className="text-orange-100">{area.hotels} hotels available</p>
                    </div>
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-white text-sm font-medium">₹{area.avgPrice.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-4">{area.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {area.highlights.map((highlight) => (
                        <span
                          key={highlight}
                          className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Hotels */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Hotels in Nagpur</h2>
              <p className="text-xl text-gray-600">Handpicked accommodations across the Orange City</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {nagpurFeaturedHotels.map((hotel) => (
                <Card key={hotel.id} className="overflow-hidden">
                  <div className="relative">
                    <OptimizedImage
                      src={hotel.image}
                      alt={`${hotel.name} in ${hotel.area}, Nagpur`}
                      className="w-full h-48 object-cover"
                      fallbackSrc="https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800"
                    />
                    
                    {hotel.discount && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                        {hotel.discount}% OFF
                      </div>
                    )}
                    
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center space-x-1 shadow-lg">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                      <span className="text-sm font-semibold" aria-label={`Rating ${hotel.rating}`}>
                        {hotel.rating}
                      </span>
                    </div>
                    
                    {hotel.specialOffer && (
                      <div className="absolute bottom-4 left-4 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium shadow-lg">
                        {hotel.specialOffer}
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{hotel.name}</h3>
                      <div className="flex items-center text-gray-600 space-x-1 mb-2">
                        <MapPin className="h-4 w-4 text-orange-500" />
                        <span className="text-sm">{hotel.area}, Nagpur</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                        <span>{hotel.rating} ({hotel.reviewCount.toLocaleString()} reviews)</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {hotel.amenities.slice(0, 4).map((amenity) => (
                        <div
                          key={amenity}
                          className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded text-xs text-gray-600"
                          title={amenity}
                          aria-label={amenity}
                        >
                          {getAmenityIcon(amenity)}
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mb-4">
                      {hotel.originalPrice && (
                        <div className="text-sm text-gray-500 line-through">
                          ₹{hotel.originalPrice.toLocaleString()}
                        </div>
                      )}
                      <div className="text-xl font-bold text-orange-600">
                        ₹{hotel.price.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">per night</div>
                    </div>

                    <Link
                      to={`/hotels/${hotel.id}`}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 text-center block focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                      aria-label={`Book ${hotel.name}`}
                    >
                      Book Now
                    </Link>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button
                size="lg"
                onClick={() => navigate('/hotels')}
                aria-label="View all Nagpur hotels"
              >
                <span>View All Nagpur Hotels</span>
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us for Nagpur Hotels?</h2>
              <p className="text-xl text-gray-600">Local expertise meets modern technology</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <MapPin className="h-8 w-8" />,
                  title: 'Local Expertise',
                  description: 'Deep knowledge of all 18 areas in Nagpur with insider recommendations',
                  color: 'text-orange-600 bg-orange-100'
                },
                {
                  icon: <Shield className="h-8 w-8" />,
                  title: 'Secure Booking',
                  description: 'Bank-level security for all payments with instant confirmation',
                  color: 'text-green-600 bg-green-100'
                },
                {
                  icon: <Clock className="h-8 w-8" />,
                  title: '24/7 Support',
                  description: 'Round-the-clock customer support in Hindi, English & Marathi',
                  color: 'text-blue-600 bg-blue-100'
                },
                {
                  icon: <Award className="h-8 w-8" />,
                  title: 'Best Prices',
                  description: 'Guaranteed best rates for Nagpur hotels with price matching',
                  color: 'text-purple-600 bg-purple-100'
                }
              ].map((feature, index) => (
                <Card
                  key={index}
                  className="text-center p-6 hover:bg-white hover:shadow-lg"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${feature.color} rounded-2xl mb-4 hover:rotate-12 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-orange-500 to-red-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Explore Nagpur?</h2>
            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
              Join thousands of travelers who have discovered the Orange City through our platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate('/hotels')}
                aria-label="Book Nagpur hotels"
              >
                <Search className="h-5 w-5" />
                <span>Book Nagpur Hotels</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/explore')}
                aria-label="Explore Orange City"
              >
                <MapPin className="h-5 w-5" />
                <span>Explore Orange City</span>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </ErrorBoundary>
  );
};

export default Home;
