import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "@radix-ui/react-icons";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface PhotoSelectionProps {
  photos: string[];
  onComplete: (selectedPhotos: string[]) => void;
  onBack: () => void;
}

const PhotoSelection = ({
  photos = [],
  onComplete = () => {},
  onBack = () => {},
}: PhotoSelectionProps) => {
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);

  const togglePhotoSelection = (photo: string) => {
    if (selectedPhotos.includes(photo)) {
      setSelectedPhotos(selectedPhotos.filter((p) => p !== photo));
    } else if (selectedPhotos.length < 4) {
      setSelectedPhotos([...selectedPhotos, photo]);
    }
  };

  const handleComplete = () => {
    onComplete(selectedPhotos);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto w-full">
        <header className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Select Your Favorites
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Choose 4 photos to create your collage
          </p>
          <div className="mt-3">
            <Badge
              variant="secondary"
              className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full"
            >
              {selectedPhotos.length}/4 selected
            </Badge>
          </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {photos.length > 0 ? (
            photos.map((photo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <Card
                  className={`overflow-hidden cursor-pointer transition-all duration-200 ${selectedPhotos.includes(photo) ? "ring-4 ring-gray-600" : "hover:ring-2 hover:ring-gray-400"}`}
                  onClick={() => togglePhotoSelection(photo)}
                >
                  <div className="aspect-square relative">
                    <img
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {selectedPhotos.includes(photo) && (
                      <div className="absolute top-2 right-2 bg-gray-700 rounded-full p-1">
                        <CheckIcon className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                      {index + 1}/8
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">
                No photos captured yet. Please go back and take some photos
                first.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={onBack}
            className="bg-white hover:bg-gray-100"
          >
            Back
          </Button>
          <Button
            onClick={handleComplete}
            disabled={selectedPhotos.length !== 4 || photos.length === 0}
            className="bg-gray-800 hover:bg-gray-900 text-white disabled:bg-gray-300"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PhotoSelection;
