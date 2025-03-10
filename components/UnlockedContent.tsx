"use client";

import type React from "react";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInView } from "react-intersection-observer";

// Type definition for S3Object
type S3Object = {
  key: string;
  lastModified: Date | string;
  size: number;
  url: string;
};

// Memoized utility functions
const fileTypeUtils = {
  isImage: (url: string): boolean => {
    const imageExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".bmp",
      ".svg",
    ];
    return imageExtensions.some((ext) => url.toLowerCase().endsWith(ext));
  },

  isVideo: (url: string): boolean => {
    const videoExtensions = [
      ".mp4",
      ".webm",
      ".ogg",
      ".mov",
      ".m4v",
      ".avi",
      ".wmv",
      ".flv",
    ];
    return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext));
  },

  getFilename: (key: string): string => {
    const parts = key.split("/");
    return parts[parts.length - 1];
  },

  estimateAspectRatio: (filename: string): number => {
    const lowerFilename = filename.toLowerCase();
    if (lowerFilename.includes("panorama") || lowerFilename.includes("wide")) {
      return 16 / 9;
    } else if (lowerFilename.includes("portrait")) {
      return 3 / 4;
    } else if (lowerFilename.endsWith(".png")) {
      return 1;
    }
    // Default to 4:3 for standard photos
    return 4 / 3;
  },

  // New function to generate thumbnail URL for videos
  getVideoThumbnailUrl: (videoUrl: string): string => {
    const urlWithoutExtension = videoUrl.substring(
      0,
      videoUrl.lastIndexOf(".")
    );
    console.log(`${urlWithoutExtension}-thumbnail.jpg`);
    return `${urlWithoutExtension}-thumbnail.jpg`;
  },
};

// Optimized image component with intersection observer hook
const AspectRatioImage = ({
  src,
  alt,
  onClick,
  aspectRatio = 4 / 3,
  className = "",
}: {
  src: string;
  alt: string;
  onClick: () => void;
  aspectRatio?: number;
  className?: string;
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: "200px",
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const [naturalAspectRatio, setNaturalAspectRatio] = useState<number | null>(
    null
  );

  const handleLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      setIsLoaded(true);

      if (img.naturalWidth && img.naturalHeight) {
        setNaturalAspectRatio(img.naturalWidth / img.naturalHeight);
      }
    },
    []
  );

  // Use the natural aspect ratio if available, otherwise use the provided one
  const finalAspectRatio = naturalAspectRatio || aspectRatio;

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      onClick={onClick}
      style={{
        paddingBottom: `${(1 / finalAspectRatio) * 100}%`,
      }}
    >
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
      )}
      {inView && (
        <img
          src={src || "/placeholder.svg"}
          alt={alt}
          className={cn(
            "absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={handleLoad}
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
};

// Replace the VideoThumbnail component with this updated version
const VideoThumbnail = ({
  video,
  onClick,
}: {
  video: S3Object;
  onClick: () => void;
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: "200px",
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Generate the thumbnail URL based on the video URL
  const thumbnailUrl = fileTypeUtils.getVideoThumbnailUrl(video.url);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  return (
    <div
      ref={ref}
      className="relative cursor-pointer group overflow-hidden rounded-lg aspect-video"
      onClick={onClick}
    >
      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
        {inView && (
          <>
            {!isLoaded && !hasError && (
              <div className="absolute inset-0 bg-gray-300 animate-pulse flex items-center justify-center">
                <span className="text-gray-500">Loading...</span>
              </div>
            )}

            <img
              src={thumbnailUrl || "/placeholder.svg"}
              alt={fileTypeUtils.getFilename(video.key)}
              className={cn(
                "w-full h-full object-cover",
                isLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={handleLoad}
              onError={handleError}
              loading="lazy"
            />

            {hasError && (
              <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                <span className="text-gray-500">Thumbnail unavailable</span>
              </div>
            )}
          </>
        )}

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="bg-black/50 rounded-full p-3 text-white group-hover:bg-black/70 transition-colors">
            <Play size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Lightbox component for displaying images in fullscreen
const Lightbox = ({
  isOpen,
  onClose,
  currentMedia,
  onPrev,
  onNext,
  hasNext,
  hasPrev,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentMedia: S3Object | null;
  onPrev: () => void;
  onNext: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoNaturalSize, setVideoNaturalSize] = useState({
    width: 0,
    height: 0,
  });

  // Handle video metadata loading to get its natural dimensions
  const handleVideoMetadata = useCallback(() => {
    if (videoRef.current) {
      setVideoNaturalSize({
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight,
      });
    }
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          if (hasPrev) onPrev();
          break;
        case "ArrowRight":
          if (hasNext) onNext();
          break;
        case "Escape":
          onClose();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onPrev, onNext, onClose, hasPrev, hasNext]);

  if (!isOpen || !currentMedia) return null;

  const isImageFile = fileTypeUtils.isImage(currentMedia.url);
  const isVideoFile = fileTypeUtils.isVideo(currentMedia.url);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 focus:outline-none z-50"
        aria-label="Close lightbox"
      >
        <X size={24} />
      </button>

      <div className="relative w-full h-full flex items-center justify-center p-4">
        {isImageFile && (
          <img
            src={currentMedia.url || "/placeholder.svg"}
            alt={fileTypeUtils.getFilename(currentMedia.key)}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
        )}

        {isVideoFile && (
          <div className="relative flex items-center justify-center">
            <video
              ref={videoRef}
              src={currentMedia.url}
              controls
              autoPlay
              onLoadedMetadata={handleVideoMetadata}
              className="max-h-[90vh] max-w-[90vw]"
              style={{
                width:
                  videoNaturalSize.width > 0
                    ? Math.min(
                        videoNaturalSize.width,
                        window.innerWidth * 0.9
                      ) + "px"
                    : "auto",
                height:
                  videoNaturalSize.height > 0
                    ? Math.min(
                        videoNaturalSize.height,
                        window.innerHeight * 0.9
                      ) + "px"
                    : "auto",
              }}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>

      {hasPrev && (
        <button
          onClick={onPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 focus:outline-none"
          aria-label="Previous image"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {hasNext && (
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 focus:outline-none"
          aria-label="Next image"
        >
          <ChevronRight size={24} />
        </button>
      )}
    </div>
  );
};

// Main gallery component
export function UnlockedContent({
  content,
}: {
  content: S3Object[] | null | undefined;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [columns, setColumns] = useState(5);
  const videosRef = useRef<HTMLDivElement>(null);

  // Update the mediaItems useMemo to ensure videos aren't included in images
  const mediaItems = useMemo(() => {
    if (!content) return { images: [], videos: [] };

    const images: S3Object[] = [];
    const videos: S3Object[] = [];

    content.forEach((item) => {
      if (fileTypeUtils.isVideo(item.url)) {
        videos.push(item);
      } else if (
        fileTypeUtils.isImage(item.url) &&
        !item.url.includes("-thumbnail.jpg")
      ) {
        // Only include in images if it's an image AND not a video thumbnail
        images.push(item);
      }
    });

    return { images, videos };
  }, [content]);

  // Scroll to videos section
  const scrollToVideos = useCallback(() => {
    if (videosRef.current) {
      videosRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, []);

  // Responsive columns based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setColumns(2);
      } else if (window.innerWidth < 768) {
        setColumns(3);
      } else if (window.innerWidth < 1024) {
        setColumns(4);
      } else {
        setColumns(5);
      }
    };

    handleResize();

    // Use ResizeObserver instead of window resize event for better performance
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(document.body);

    return () => resizeObserver.disconnect();
  }, []);

  // Memoize column distribution for masonry layout
  const columnItems = useMemo(() => {
    const columnArrays: S3Object[][] = Array.from(
      { length: columns },
      () => []
    );
    const columnHeights = Array(columns).fill(0);

    // Store image aspect ratios to better estimate heights
    const imageAspectRatios = new Map<string, number>();

    // Pre-process to estimate aspect ratios based on file extensions
    mediaItems.images.forEach((item) => {
      const filename = fileTypeUtils.getFilename(item.key);
      const aspectRatio = fileTypeUtils.estimateAspectRatio(filename);
      // Store the inverse of aspect ratio since we care about height
      imageAspectRatios.set(item.key, 1 / aspectRatio);
    });

    // Distribute images to the shortest column
    mediaItems.images.forEach((item) => {
      // Find the column with the smallest height
      const shortestColumnIndex = columnHeights.indexOf(
        Math.min(...columnHeights)
      );

      // Add the item to the shortest column
      columnArrays[shortestColumnIndex].push(item);

      // Get estimated height factor based on aspect ratio
      const heightFactor = imageAspectRatios.get(item.key) || 1;

      // Update the column height with a more accurate estimate
      columnHeights[shortestColumnIndex] += 300 * heightFactor;
    });

    return columnArrays;
  }, [mediaItems.images, columns]);

  // Lightbox navigation
  const openLightbox = useCallback((index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => {
      const totalItems = mediaItems.images.length + mediaItems.videos.length;
      return prev < totalItems - 1 ? prev + 1 : prev;
    });
  }, [mediaItems.images.length, mediaItems.videos.length]);

  const getCurrentMedia = useCallback(() => {
    if (currentIndex < mediaItems.images.length) {
      return mediaItems.images[currentIndex];
    } else {
      return mediaItems.videos[currentIndex - mediaItems.images.length];
    }
  }, [currentIndex, mediaItems.images, mediaItems.videos]);

  if (!content || content.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">No content available</div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Images</h2>
        {mediaItems.videos.length > 0 && (
          <button
            onClick={scrollToVideos}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Play size={16} />
            Go to Videos
          </button>
        )}
      </div>

      {/* Masonry image gallery */}
      <div className="flex gap-4 mb-12">
        {columnItems.map((column, columnIndex) => (
          <div
            key={`column-${columnIndex}`}
            className="flex-1 flex flex-col gap-4"
          >
            {column.map((item) => {
              const filename = fileTypeUtils.getFilename(item.key);
              const estimatedAspectRatio =
                fileTypeUtils.estimateAspectRatio(filename);

              return (
                <div
                  key={item.key}
                  className="relative overflow-hidden rounded-lg cursor-pointer transition-transform hover:scale-[1.02]"
                >
                  <AspectRatioImage
                    src={item.url || "/placeholder.svg"}
                    alt={filename}
                    onClick={() => {
                      // Find the index of this item in the images array
                      const index = mediaItems.images.findIndex(
                        (img) => img.key === item.key
                      );
                      if (index !== -1) {
                        openLightbox(index);
                      }
                    }}
                    aspectRatio={estimatedAspectRatio}
                    className="w-full"
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Video section */}
      {mediaItems.videos.length > 0 && (
        <div ref={videosRef} className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Videos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {mediaItems.videos.map((video, index) => (
              <VideoThumbnail
                key={video.key}
                video={video}
                onClick={() => {
                  setCurrentIndex(mediaItems.images.length + index);
                  setLightboxOpen(true);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        currentMedia={getCurrentMedia()}
        onPrev={goToPrevious}
        onNext={goToNext}
        hasPrev={currentIndex > 0}
        hasNext={
          currentIndex < mediaItems.images.length + mediaItems.videos.length - 1
        }
      />
    </div>
  );
}
