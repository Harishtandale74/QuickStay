import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  ArrowLeft, 
  Upload, 
  X, 
  MapPin, 
  DollarSign, 
  Home,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  Waves,
  Utensils
} from 'lucide-react';
import toast from 'react-hot-toast';
import { hotelSchema, HotelFormData } from '../../utils/validation';

const AddHotel: React.FC = () => {
  const navigate = useNavigate();
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<HotelFormData>({
    resolver: zodResolver(hotelSchema),
  });

  const amenitiesList = [
    { name: 'Wifi', icon: <Wifi className="h-5 w-5" /> },
    { name: 'Parking', icon: <Car className="h-5 w-5" /> },
    { name: 'Restaurant', icon: <Utensils className="h-5 w-5" /> },
    { name: 'Gym', icon: <Dumbbell className="h-5 w-5" /> },
    { name: 'Pool', icon: <Waves className="h-5 w-5" /> },
    { name: 'Spa', icon: <Coffee className="h-5 w-5" /> },
    { name: 'Room Service', icon: <Home className="h-5 w-5" /> },
    { name: 'Bar', icon: <Coffee className="h-5 w-5" /> },
  ];

  const sampleImages = [
    'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=800',
  ];

  const handleImageSelect = (imageUrl: string) => {
    if (selectedImages.includes(imageUrl)) {
      const newImages = selectedImages.filter(img => img !== imageUrl);
      setSelectedImages(newImages);
      setValue('images', newImages);
    } else if (selectedImages.length < 6) {
      const newImages = [...selectedImages, imageUrl];
      setSelectedImages(newImages);
      setValue('images', newImages);
    } else {
      toast.error('Maximum 6 images allowed');
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    let newAmenities;
    if (selectedAmenities.includes(amenity)) {
      newAmenities = selectedAmenities.filter(a => a !== amenity);
    } else {
      newAmenities = [...selectedAmenities, amenity];
    }
    setSelectedAmenities(newAmenities);
    setValue('amenities', newAmenities);
  };

  const onSubmit = async (data: HotelFormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Hotel data:', { ...data, amenities: selectedAmenities, images: selectedImages });
      toast.success('Hotel added successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to add hotel. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Add New Hotel</h1>
          <p className="text-gray-600 mt-2">Fill in the details to list your property</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hotel Name *
                </label>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    {...register('name')}
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter hotel name"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    {...register('location')}
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="City, State, Country"
                  />
                </div>
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per Night *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    {...register('price', { valueAsNumber: true })}
                    type="number"
                    min="1"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Rooms *
                </label>
                <input
                  {...register('rooms', { valueAsNumber: true })}
                  type="number"
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0"
                />
                {errors.rooms && (
                  <p className="mt-1 text-sm text-red-600">{errors.rooms.message}</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Describe your hotel, its features, and what makes it special..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Amenities</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {amenitiesList.map((amenity) => (
                <label
                  key={amenity.name}
                  className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedAmenities.includes(amenity.name)
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity.name)}
                    onChange={() => handleAmenityToggle(amenity.name)}
                    className="sr-only"
                  />
                  <div className={`${
                    selectedAmenities.includes(amenity.name) ? 'text-primary-600' : 'text-gray-400'
                  }`}>
                    {amenity.icon}
                  </div>
                  <span className={`text-sm font-medium ${
                    selectedAmenities.includes(amenity.name) ? 'text-primary-900' : 'text-gray-700'
                  }`}>
                    {amenity.name}
                  </span>
                </label>
              ))}
            </div>
            {errors.amenities && (
              <p className="mt-2 text-sm text-red-600">{errors.amenities.message}</p>
            )}
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Hotel Images</h2>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4">
                Select up to 6 images for your hotel. Click on images to select/deselect them.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {sampleImages.map((imageUrl, index) => (
                  <div
                    key={index}
                    onClick={() => handleImageSelect(imageUrl)}
                    className={`relative cursor-pointer rounded-lg overflow-hidden border-4 transition-all ${
                      selectedImages.includes(imageUrl)
                        ? 'border-primary-500 ring-2 ring-primary-200'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={imageUrl}
                      alt={`Hotel option ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                    {selectedImages.includes(imageUrl) && (
                      <div className="absolute inset-0 bg-primary-600 bg-opacity-20 flex items-center justify-center">
                        <div className="bg-primary-600 text-white rounded-full p-1">
                          <X className="h-4 w-4" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {selectedImages.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Selected Images ({selectedImages.length}/6)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedImages.map((imageUrl, index) => (
                    <div key={index} className="relative">
                      <img
                        src={imageUrl}
                        alt={`Selected ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleImageSelect(imageUrl)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {errors.images && (
              <p className="mt-2 text-sm text-red-600">{errors.images.message}</p>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Adding Hotel...' : 'Add Hotel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHotel;