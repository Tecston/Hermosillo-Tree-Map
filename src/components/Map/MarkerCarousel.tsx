import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MarkerCarouselProps {
  items: Array<{
    id: string;
    title: string;
    description: string;
    category?: string;
    authorName?: string;
    contactPhone?: string;
    imageUrl?: string;
    supports?: number;
    institution?: string;
    likes?: number;
    dislikes?: number;
    type: "request" | "project";
  }>;
  onClose: () => void;
  onSupport?: (id: string) => void;
  onLike?: (id: string) => void;
  onDislike?: (id: string) => void;
}

const MarkerCarousel: React.FC<MarkerCarouselProps> = ({
  items,
  onClose,
  onSupport,
  onLike,
  onDislike,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentItem = items[currentIndex];

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-800"
        >
          ✕
        </button>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2">{currentItem.title}</h3>

          {currentItem.category && (
            <p className="text-sm text-gray-600 mb-2">
              <strong>Categoría:</strong> {currentItem.category}
            </p>
          )}

          <p className="text-gray-700 mb-4">{currentItem.description}</p>

          {currentItem.authorName && (
            <p className="text-sm text-gray-600">
              <strong>Autor:</strong> {currentItem.authorName}
            </p>
          )}

          {/*{currentItem.contactPhone && (*/}
          {/*  <p className="text-sm text-gray-600">*/}
          {/*    <strong>Tel:</strong> {currentItem.contactPhone}*/}
          {/*  </p>*/}
          {/*)}*/}

          {currentItem.institution && (
            <p className="text-sm text-gray-600">
              <strong>Institución:</strong> {currentItem.institution}
            </p>
          )}

          {currentItem.imageUrl && (
            <img
              src={currentItem.imageUrl}
              alt="Evidencia"
              className="w-full h-48 object-cover rounded-lg mt-4"
            />
          )}

          {/* Action buttons */}
          <div className="mt-4 flex gap-2">
            {currentItem.type === "request" && onSupport && (
              <button
                onClick={() => onSupport(currentItem.id)}
                className="flex-1 bg-brand-blue text-white px-4 py-2 rounded hover:bg-brand-blue-darker transition-colors"
              >
                Apoyar ({currentItem.supports || 0})
              </button>
            )}

            {currentItem.type === "project" && (
              <>
                <button
                  onClick={() => onLike?.(currentItem.id)}
                  className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                >
                  👍 ({currentItem.likes || 0})
                </button>
                <button
                  onClick={() => onDislike?.(currentItem.id)}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                >
                  👎 ({currentItem.dislikes || 0})
                </button>
              </>
            )}
          </div>
        </div>

        {/* Navigation */}
        {items.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-800"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-800"
            >
              <ChevronRight />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {items.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentIndex ? "bg-brand-blue" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MarkerCarousel;
