"use client";

import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Camera, RotateCcw, Check, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CameraCaptureProps {
  onCapture: (imageSrc: string) => void;
}

export function CameraCapture({ onCapture }: CameraCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [hasPermissionError, setHasPermissionError] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const videoConstraints = {
    facingMode: "environment",
    width: { ideal: 1280 },
    height: { ideal: 720 },
  };

  const handleCapture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
      }
    }
  }, []);

  const handleRetake = useCallback(() => {
    setCapturedImage(null);
  }, []);

  const handleUsePhoto = useCallback(() => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  }, [capturedImage, onCapture]);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCapturedImage(result);
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const handleUserMediaError = useCallback(() => {
    setHasPermissionError(true);
  }, []);

  const handleUserMedia = useCallback(() => {
    setIsCameraReady(true);
  }, []);

  // Fallback: file upload when camera is not available
  if (hasPermissionError) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-64 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/30">
          {capturedImage ? (
            <img
              src={capturedImage}
              alt="Captured"
              className="h-full w-full rounded-xl object-cover"
            />
          ) : (
            <>
              <Camera className="mb-3 h-12 w-12 text-muted-foreground" />
              <p className="mb-1 text-sm text-muted-foreground">
                Camera access unavailable
              </p>
              <p className="mb-4 text-xs text-muted-foreground/70">
                Upload a photo from your device instead
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Photo
              </Button>
            </>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileUpload}
        />

        {capturedImage && (
          <div className="flex w-full gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleRetake}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Retake
            </Button>
            <Button className="flex-1" onClick={handleUsePhoto}>
              <Check className="mr-2 h-4 w-4" />
              Use Photo
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Camera viewfinder or preview */}
      <div className="relative w-full overflow-hidden rounded-xl bg-black">
        {capturedImage ? (
          <img
            src={capturedImage}
            alt="Captured"
            className="h-64 w-full object-cover"
          />
        ) : (
          <>
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              onUserMedia={handleUserMedia}
              onUserMediaError={handleUserMediaError}
              className="h-64 w-full object-cover"
            />
            {!isCameraReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            )}
            {/* Viewfinder overlay */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-48 w-48 rounded-lg border-2 border-white/30" />
            </div>
          </>
        )}
      </div>

      {/* Controls */}
      {capturedImage ? (
        <div className="flex w-full gap-3">
          <Button variant="outline" className="flex-1" onClick={handleRetake}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Retake
          </Button>
          <Button className="flex-1" onClick={handleUsePhoto}>
            <Check className="mr-2 h-4 w-4" />
            Use Photo
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-5 w-5" />
          </Button>

          {/* Capture button */}
          <button
            onClick={handleCapture}
            disabled={!isCameraReady}
            className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-primary bg-transparent transition-all hover:bg-primary/20 active:scale-95 disabled:opacity-50"
            aria-label="Capture photo"
          >
            <div className="h-12 w-12 rounded-full bg-primary" />
          </button>

          {/* Spacer to balance layout */}
          <div className="h-10 w-10" />
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />
    </div>
  );
}
