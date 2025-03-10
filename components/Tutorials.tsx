"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

export default function Tutorials() {
  const router = useRouter();
  const [tutorialType, setTutorialType] = useState<"mobile" | "desktop">(
    "desktop"
  );

  useEffect(() => {
    const initialTutorialType = window.innerWidth < 768 ? "mobile" : "desktop";
    setTutorialType(initialTutorialType);

    const handleResize = () => {
      if (!document.fullscreenElement && !document.exitFullscreen) {
        setTutorialType(window.innerWidth < 768 ? "mobile" : "desktop");
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const videoSources = {
    mobile: "https://d20j5ua5yqolxe.cloudfront.net/tutorial-mobile.mp4",
    desktop: "https://d20j5ua5yqolxe.cloudfront.net/tutorial-desktop.mp4",
  };

  return (
    <Card className="w-full max-w-3xl text-gray-200 mx-auto">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center w-full">
          <div
            className={`flex-1 p-4 text-center cursor-pointer transition-all ${
              tutorialType === "mobile" ? "text-gray-900" : "text-gray-400"
            }`}
            onClick={() => setTutorialType("mobile")}
          >
            <h2 className="text-lg font-semibold">Mobile tutorial</h2>
            <p className="text-sm">For smartphone users</p>
            {tutorialType === "mobile" && (
              <div className="mt-2 border-b-2 border-pink-400 mx-auto w-full"></div>
            )}
          </div>
          <div
            className={`flex-1 p-4 text-center cursor-pointer transition-all ${
              tutorialType === "desktop" ? "text-gray-900" : "text-gray-400"
            }`}
            onClick={() => setTutorialType("desktop")}
          >
            <h2 className="text-lg font-semibold">Desktop tutorial</h2>
            <p className="text-sm">For computer users</p>
            {tutorialType === "desktop" && (
              <div className="mt-2 border-b-2 border-pink-400 mx-auto w-full"></div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div
          className={`w-full ${
            tutorialType === "mobile"
              ? "aspect-[9/16] max-w-[300px]"
              : "aspect-video"
          } mx-auto bg-gray-900 rounded-lg overflow-hidden`}
        >
          <video
            className={`w-full h-full ${
              tutorialType === "mobile" ? "object-contain" : "object-cover"
            }`}
            key={tutorialType}
            controls
            autoPlay
          >
            <source src={videoSources[tutorialType]} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <p className="text-center mt-4">
          <Button
            onClick={() => router.back()}
            variant="link"
            className="font-normal w-full text-blue-600 underline"
            size="sm"
          >
            <ArrowLeftIcon className="w-4 h-4 pr-1" />
            Go back
          </Button>
        </p>
      </CardContent>
    </Card>
  );
}
