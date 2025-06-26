import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  hotelName: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, hotelName }) => {
  const [showLightbox, setShowLightbox] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setShowLightbox(true);
  };

  const closeLightbox = () => {
    setShowLightbox(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-2 h-96 mb-8">
        <div className="col-span-2 row-span-2">
          <img
            src={images[0]}
            alt={`${hotelName} - Main`}
            className="w-full h-full object-cover rounded-l-2xl cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => openLightbox(0)}
          />
        </div>
        {images.slice(1, 5).map((image, index) => (
          <div key={index} className="relative">
            <img
              src={image}
              alt={`${hotelName} - ${index + 2}`}
              className={`w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity ${
                index === 1 ? 'rounded-tr-2xl' : ''
              } ${index === 3 ? 'rounded-br-2xl' : ''}`}
              onClick={() => openLightbox(index + 1)}
            />
            {index === 3 && images.length > 5 && (
              <div
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer rounded-br-2xl"
                onClick={() => openLightbox(index + 1)}
              >
                <span className="text-white font-semibold text-lg">
                  +{images.length - 5} more
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="h-8 w-8" />
            </button>
            
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
            >
              <ChevronRight className="h-8 w-8" />
            </button>

            <img
              src={images[currentImageIndex]}
              alt={`${hotelName} - ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;