import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Camera, RefreshCw, Aperture } from "lucide-react";
import { motion } from "framer-motion";

interface PhotoCaptureProps {
  onComplete?: (photos: string[]) => void;
  maxPhotos?: number;
}

const PhotoCapture = ({
  onComplete = () => {},
  maxPhotos = 8,
}: PhotoCaptureProps) => {
  const [photos, setPhotos] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(
    null,
  );
  const [cameraFacing, setCameraFacing] = useState<"user" | "environment">(
    "user",
  );
  const [showFlash, setShowFlash] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Request camera permission and setup video stream
  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: cameraFacing },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          setCameraPermission(true);
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setCameraPermission(false);
      }
    };

    setupCamera();

    return () => {
      // Cleanup: stop all video tracks when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraFacing]);

  const startCapture = () => {
    setIsCapturing(true);
    capturePhoto();
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to data URL
    const photoDataUrl = canvas.toDataURL("image/jpeg", 0.8);

    // Show flash effect
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 200);

    // Add photo to collection
    const newPhotos = [...photos, photoDataUrl];
    setPhotos(newPhotos);

    // Reset capturing state to allow next photo
    setIsCapturing(false);

    // Don't automatically navigate - let user click Next button
  };

  const retakeLastPhoto = () => {
    if (photos.length > 0) {
      setPhotos((prev) => prev.slice(0, -1));
    }
  };

  const toggleCamera = async () => {
    // Stop current stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    // Toggle camera facing mode
    setCameraFacing((prev) => (prev === "user" ? "environment" : "user"));
  };

  const progress = (photos.length / maxPhotos) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-md mx-auto bg-white rounded-xl p-4 shadow-lg">
        {cameraPermission === false && (
          <div className="text-center p-4 bg-red-50 rounded-lg mb-4">
            <h3 className="text-red-600 font-medium">Camera Access Required</h3>
            <p className="text-sm text-red-500 mt-1">
              Please allow camera access to use the photo booth.
            </p>
            <Button
              onClick={() => setCameraPermission(null)}
              className="mt-3 bg-red-500 hover:bg-red-600"
            >
              Try Again
            </Button>
          </div>
        )}

        {cameraPermission !== false && (
          <Card className="w-full overflow-hidden relative">
            <CardContent className="p-0 relative">
              {/* Camera preview */}
              <div className="relative aspect-[3/4] bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                {/* Flash effect */}
                {showFlash && (
                  <div className="absolute inset-0 bg-white animate-flash z-10"></div>
                )}

                {/* Countdown overlay */}
                {countdown !== null && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center bg-black/30 z-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.span
                      className="text-6xl font-bold text-white"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      key={countdown}
                    >
                      {countdown}
                    </motion.span>
                  </motion.div>
                )}

                {/* Progress indicator */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 z-10">
                  <span className="text-xs font-medium text-white bg-black/50 px-2 py-1 rounded-full">
                    {photos.length}/{maxPhotos}
                  </span>
                  <Progress value={progress} className="h-2" />
                </div>
              </div>

              {/* Hidden canvas for capturing photos */}
              <canvas ref={canvasRef} className="hidden" />
            </CardContent>
          </Card>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between w-full mt-4 gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleCamera}
            disabled={isCapturing}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          <Button
            onClick={startCapture}
            disabled={
              isCapturing ||
              photos.length >= maxPhotos ||
              cameraPermission === false
            }
            className="rounded-full h-16 w-16 flex items-center justify-center bg-pink-500 hover:bg-pink-600"
          >
            <Aperture className="h-8 w-8" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={retakeLastPhoto}
            disabled={photos.length === 0 || isCapturing}
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>

        {/* Next Button - only show when all photos are taken */}
        {photos.length >= maxPhotos && (
          <div className="mt-4 w-full">
            <Button
              onClick={() => {
                // Stop camera stream before navigating
                if (streamRef.current) {
                  streamRef.current
                    .getTracks()
                    .forEach((track) => track.stop());
                }
                onComplete(photos);
              }}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3"
            >
              Next - Select Photos ({photos.length}/{maxPhotos})
            </Button>
          </div>
        )}

        {/* Thumbnail preview */}
        {photos.length > 0 && (
          <div className="grid grid-cols-4 gap-1 mt-4 w-full">
            {photos.map((photo, index) => (
              <div
                key={index}
                className="aspect-[3/4] rounded-md overflow-hidden"
              >
                <img
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {/* Placeholder thumbnails */}
            {Array.from({ length: maxPhotos - photos.length }).map(
              (_, index) => (
                <div
                  key={`placeholder-${index}`}
                  className="aspect-[3/4] bg-gray-100 rounded-md flex items-center justify-center"
                >
                  <span className="text-gray-400 text-xs">
                    {photos.length + index + 1}
                  </span>
                </div>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoCapture;
