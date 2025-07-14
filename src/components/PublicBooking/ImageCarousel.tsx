import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import prop from "../assets/prop1.svg";

interface ImageCarouselProps {
  images: string[];
  className?: string;
  fallbackImage?: string;
  showNavigation?: boolean;
  showPagination?: boolean;
  navigationSize?: "small" | "medium" | "large";
  paginationSize?: "small" | "medium" | "large";
}

const ImageCarousel = ({
  images,
  className = "",
  fallbackImage = prop,
  showNavigation = true,
  showPagination = true,
  navigationSize = "medium",
  paginationSize = "medium",
}: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIndex(index);
  };

  // Navigation size configurations
  const navigationConfig = {
    small: { buttonSize: "w-8 h-8", iconSize: 16, spacing: "left-2 right-2" },
    medium: {
      buttonSize: "w-10 h-10",
      iconSize: 20,
      spacing: "left-4 right-4",
    },
    large: { buttonSize: "w-12 h-12", iconSize: 24, spacing: "left-6 right-6" },
  };

  // Pagination size configurations
  const paginationConfig = {
    small: { dotSize: "w-2 h-2" },
    medium: { dotSize: "w-3 h-3" },
    large: { dotSize: "w-4 h-4" },
  };

  const navConfig = navigationConfig[navigationSize];
  const pagConfig = paginationConfig[paginationSize];

  if (!images || images.length === 0) {
    return (
      <div
        className={`${className} bg-gray-200 flex items-center justify-center rounded-lg`}
      >
        <img
          src={fallbackImage}
          alt="Default property image"
          className="object-cover max-w-screen-2xl w-full rounded-lg"
        />
      </div>
    );
  }

  return (
    <div className={`${className} relative overflow-hidden rounded-lg`}>
      {/* Main Image */}
      <div className="w-full h-full">
        <img
          src={images[currentIndex]}
          className="w-full h-full object-cover transition-transform duration-300"
        />
      </div>

      {/* Navigation Arrows */}
      {showNavigation && images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className={`absolute ${
              navConfig.spacing.split(" ")[0]
            } top-1/2 transform -translate-y-1/2 z-10 ${
              navConfig.buttonSize
            } bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all duration-200`}
            aria-label="Previous image"
          >
            <ChevronLeft size={navConfig.iconSize} className="text-gray-700" />
          </button>
          <button
            onClick={nextSlide}
            className={`absolute ${
              navConfig.spacing.split(" ")[1]
            } top-1/2 transform -translate-y-1/2 z-10 ${
              navConfig.buttonSize
            } bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all duration-200`}
            aria-label="Next image"
          >
            <ChevronRight size={navConfig.iconSize} className="text-gray-700" />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {showPagination && images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => goToSlide(index, e)}
              className={`${
                pagConfig.dotSize
              } rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? "bg-white shadow-md"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
