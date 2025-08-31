"use client";
import React from "react";

interface CircularLoaderProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

const CircularLoader: React.FC<CircularLoaderProps> = ({ 
  size = "medium", 
  className = ""
}) => {
  // Size mapping
  const sizeClasses = {
    small: "w-6 h-6 border-2",
    medium: "w-10 h-10 border-3",
    large: "w-25 h-25 border-10",
  };
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        className={`${sizeClasses[size]} rounded-full border-t-[#15eb9e] border-r-[#6a00b8] border-b-[#15eb9e] border-l-[#6a00b8] animate-spin`}
        style={{ 
          borderTopColor: '#15eb9e',
          borderRightColor: '#6a00b8',
          borderBottomColor: '#15eb9e',
          borderLeftColor: '#6a00b8'
        }}
      ></div>
    </div>
  );
};

export default CircularLoader;