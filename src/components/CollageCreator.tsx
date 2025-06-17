import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import {
  Download,
  Share2,
  Undo2,
  Sparkles,
  Sticker,
  Type,
  ImagePlus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CollageCreatorProps {
  selectedPhotos?: string[];
  onComplete?: (collageUrl: string) => void;
  onBack?: () => void;
}

type Template = {
  id: string;
  name: string;
  layout: string;
  thumbnail: string;
};

type Sticker = {
  id: string;
  url: string;
  category: string;
};

const CollageCreator = ({
  selectedPhotos = [
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&q=80",
    "https://images.unsplash.com/photo-1514315384763-ba401779410f?w=300&q=80",
    "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=300&q=80",
    "https://images.unsplash.com/photo-1502323777036-f29e3972d82f?w=300&q=80",
  ],
  onComplete = () => {},
  onBack = () => {},
}: CollageCreatorProps) => {
  const [activeTemplate, setActiveTemplate] = useState("vertical1x4");
  const [activeTab, setActiveTab] = useState("templates");
  const [draggedPhoto, setDraggedPhoto] = useState<string | null>(null);
  const [photoPositions, setPhotoPositions] = useState<Record<string, number>>(
    {},
  );
  const collageRef = useRef<HTMLDivElement>(null);

  // Sample templates
  const templates: Template[] = [
    {
      id: "vertical1x4",
      name: "1x4 세로",
      layout: "vertical1x4",
      thumbnail:
        "https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=200&q=80",
    },
    {
      id: "grid2x2",
      name: "2x2 Grid",
      layout: "grid",
      thumbnail:
        "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=200&q=80",
    },
    {
      id: "vertical",
      name: "Vertical Strip",
      layout: "vertical",
      thumbnail:
        "https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=200&q=80",
    },
    {
      id: "polaroid",
      name: "Polaroid",
      layout: "polaroid",
      thumbnail:
        "https://images.unsplash.com/photo-1579546929586-3159cd8964f7?w=200&q=80",
    },
    {
      id: "asymmetric",
      name: "Asymmetric",
      layout: "asymmetric",
      thumbnail:
        "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=200&q=80",
    },
  ];

  // Sample stickers
  const stickers: Sticker[] = [
    {
      id: "s1",
      url: "https://api.dicebear.com/7.x/avataaars/svg?seed=heart",
      category: "hearts",
    },
    {
      id: "s2",
      url: "https://api.dicebear.com/7.x/avataaars/svg?seed=star",
      category: "stars",
    },
    {
      id: "s3",
      url: "https://api.dicebear.com/7.x/avataaars/svg?seed=flower",
      category: "flowers",
    },
    {
      id: "s4",
      url: "https://api.dicebear.com/7.x/avataaars/svg?seed=emoji",
      category: "emoji",
    },
    {
      id: "s5",
      url: "https://api.dicebear.com/7.x/avataaars/svg?seed=bubble",
      category: "bubbles",
    },
    {
      id: "s6",
      url: "https://api.dicebear.com/7.x/avataaars/svg?seed=crown",
      category: "misc",
    },
  ];

  // Sample filters
  const filters = ["Original", "Vintage", "B&W", "Sepia", "Pastel", "Vivid"];

  // Handle drag start
  const handleDragStart = (photo: string) => {
    setDraggedPhoto(photo);
  };

  // Handle drop on frame slot
  const handleDrop = (slotIndex: number) => {
    if (draggedPhoto) {
      setPhotoPositions((prev) => ({
        ...prev,
        [draggedPhoto]: slotIndex,
      }));
      setDraggedPhoto(null);
    }
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Generate collage
  const generateCollage = () => {
    // In a real implementation, this would create an actual image from the collage
    // For now, we'll just simulate it with a timeout
    setTimeout(() => {
      onComplete("collage-url.jpg");
    }, 1000);
  };

  // Render template preview based on active template
  const renderTemplatePreview = () => {
    switch (activeTemplate) {
      case "vertical1x4":
        return (
          <div className="flex flex-col gap-3 bg-white p-6 rounded-lg shadow-md max-w-sm mx-auto">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className="w-full aspect-square overflow-hidden rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
              >
                {getPhotoForSlot(index) ? (
                  <img
                    src={getPhotoForSlot(index)}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImagePlus className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        );
      case "grid2x2":
        return (
          <div className="grid grid-cols-2 gap-2 bg-white p-4 rounded-lg shadow-md">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className="aspect-square overflow-hidden rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
              >
                {getPhotoForSlot(index) ? (
                  <img
                    src={getPhotoForSlot(index)}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImagePlus className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        );
      case "vertical":
        return (
          <div className="flex flex-col gap-2 bg-white p-4 rounded-lg shadow-md">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className="w-full aspect-[4/1] overflow-hidden rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
              >
                {getPhotoForSlot(index) ? (
                  <img
                    src={getPhotoForSlot(index)}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImagePlus className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        );
      case "polaroid":
        return (
          <div className="flex flex-col gap-6 bg-white p-6 rounded-lg shadow-md">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className="w-full aspect-[1/1.2] overflow-hidden rounded-sm border-8 border-white shadow-lg flex items-center justify-center bg-gray-50"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
              >
                {getPhotoForSlot(index) ? (
                  <img
                    src={getPhotoForSlot(index)}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImagePlus className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        );
      case "asymmetric":
        return (
          <div className="grid grid-cols-3 grid-rows-3 gap-2 bg-white p-4 rounded-lg shadow-md">
            <div
              className="col-span-2 row-span-2 overflow-hidden rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(0)}
            >
              {getPhotoForSlot(0) ? (
                <img
                  src={getPhotoForSlot(0)}
                  alt="Photo 1"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImagePlus className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            <div
              className="col-span-1 row-span-1 overflow-hidden rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(1)}
            >
              {getPhotoForSlot(1) ? (
                <img
                  src={getPhotoForSlot(1)}
                  alt="Photo 2"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImagePlus className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            <div
              className="col-span-1 row-span-1 overflow-hidden rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(2)}
            >
              {getPhotoForSlot(2) ? (
                <img
                  src={getPhotoForSlot(2)}
                  alt="Photo 3"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImagePlus className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            <div
              className="col-span-3 row-span-1 overflow-hidden rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(3)}
            >
              {getPhotoForSlot(3) ? (
                <img
                  src={getPhotoForSlot(3)}
                  alt="Photo 4"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImagePlus className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Helper to get photo for a specific slot
  const getPhotoForSlot = (slotIndex: number) => {
    // Find which photo is assigned to this slot
    for (const [photo, position] of Object.entries(photoPositions)) {
      if (position === slotIndex) {
        return photo;
      }
    }
    // If no photo is explicitly assigned, use the default order
    return selectedPhotos[slotIndex];
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen p-4 md:p-8 flex flex-col">
      <header className="flex justify-between items-center mb-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <Undo2 className="h-4 w-4" />
          <span>Back</span>
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800">
          더함네컷{" "}
          <span className="text-sm font-normal text-gray-500">
            Collage Creator
          </span>
        </h1>
        <div className="w-[72px]"></div> {/* Spacer for alignment */}
      </header>

      <div className="flex flex-col lg:flex-row gap-6 flex-1">
        {/* Collage Preview Area */}
        <div className="flex-1 flex flex-col">
          <Card className="flex-1 flex flex-col bg-white/80 backdrop-blur-sm">
            <CardContent className="flex-1 flex flex-col p-6">
              <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-gray-600" />
                <span>Your Collage</span>
              </h2>

              <div
                ref={collageRef}
                className="flex-1 flex items-center justify-center p-4 bg-white/50 rounded-lg border border-dashed border-gray-300"
              >
                {renderTemplatePreview()}
              </div>
            </CardContent>
          </Card>

          {/* Photo Selection Area */}
          <Card className="mt-4 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium mb-3 text-gray-600">
                Your Photos
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {selectedPhotos.map((photo, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-md overflow-hidden cursor-move relative group"
                    draggable
                    onDragStart={() => handleDragStart(photo)}
                  >
                    <img
                      src={photo}
                      alt={`Selected photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                      <DragHandleDots2Icon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Editing Tools */}
        <Card className="w-full lg:w-80 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4 text-center text-gray-800">
                프레임 디자인 선택
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-3 rounded-lg cursor-pointer border-2 transition-all text-center ${
                      activeTemplate === template.id
                        ? "border-gray-600 bg-gray-100"
                        : "border-gray-200 hover:border-gray-400 bg-white"
                    }`}
                    onClick={() => setActiveTemplate(template.id)}
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {template.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 mb-4 w-full">
                <TabsTrigger value="stickers">Stickers</TabsTrigger>
                <TabsTrigger value="filters">Filters</TabsTrigger>
              </TabsList>

              <TabsContent value="stickers" className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {stickers.map((sticker) => (
                    <div
                      key={sticker.id}
                      className="aspect-square rounded-lg bg-gray-50 p-2 cursor-pointer hover:bg-gray-100 transition-colors flex items-center justify-center"
                    >
                      <img
                        src={sticker.url}
                        alt={`Sticker ${sticker.id}`}
                        className="w-full h-full object-contain"
                        draggable
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="filters" className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {filters.map((filter, index) => (
                    <div
                      key={index}
                      className="rounded-lg overflow-hidden cursor-pointer border hover:border-gray-600 transition-all"
                    >
                      <div className="aspect-video bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
                        <span className="text-xs font-medium">{filter}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <Separator className="my-4" />

            <div className="flex justify-center gap-2 mt-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="outline">
                      <Type className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add Text</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="outline">
                      <Sticker className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add Stickers</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="outline">
                      <Sparkles className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add Effects</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="mt-8 space-y-3">
              <Button className="w-full" onClick={generateCollage}>
                <Download className="mr-2 h-4 w-4" /> Download Collage
              </Button>
              <Button variant="outline" className="w-full">
                <Share2 className="mr-2 h-4 w-4" /> Share
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CollageCreator;
