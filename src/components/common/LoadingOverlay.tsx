"use client";
import React from "react";
import CircularLoader from "./CircularLoader";

interface LoadingOverlayProps {
  isLoading: boolean;
  fullScreen?: boolean;
  withLogo?: boolean; // Keeping this for future use
  text?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  fullScreen = false,
  text
}) => {
  if (!isLoading) return null;

  return (
    <div
      className={`flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 ${
        fullScreen
          ? "fixed inset-0"
          : "absolute inset-0"
      }`}
    >
      <CircularLoader size="large" />
      {text && (
        <p className="mt-4 text-sm font-medium text-gray-700 dark:text-gray-300">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingOverlay;