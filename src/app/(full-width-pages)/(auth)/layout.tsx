"use client";

import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";

import { ThemeProvider } from "@/context/ThemeContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <ThemeProvider>
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col dark:bg-gray-900 sm:p-0 overflow-hidden">
          <div className="lg:w-1/2 w-full relative z-10">
            {/* Animated background elements for the form side */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
            
            {/* Children (sign-in/sign-up forms) with enhanced styling */}
            <div className="h-full flex items-center backdrop-blur-sm">
              {children}
            </div>
          </div>
          
          {/* Right side video content */}
          <div className="lg:w-1/2 w-full h-full flex items-center justify-center hidden lg:flex relative overflow-hidden bg-white dark:bg-gray-900">
            <div className="relative flex items-center justify-center w-full h-full">
                {/* <video
                  src="/videos/HOlographic Sphere.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster="/videos/Background.png"
                  className="object-cover w-full h-full"
                  style={{ height: '100%', width: '100%' }}
                /> */}

                <Image
                  src="/videos/Feature 3.jpg"
                  // src="/videos/vr.png"
                  alt="Background"
                  layout="fill"
                  objectFit="cover"
                  className="absolute"
                />
            </div>
          </div>
          
          <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
            <ThemeTogglerTwo />
          </div>
        </div>
      </ThemeProvider>
      

    </div>
  );
}
