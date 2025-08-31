"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Badge from '@/components/ui/badge/Badge';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import useLoading from '@/hooks/useLoading';

// Define types for the dashboard data
interface Course {
  id: number;
  title: string;
  enrolled: number;
  image: string;
  category: string;
  lastUpdated: string;
  rating: number;
}

interface DashboardData {
  teacherStats: {
    totalCourses: number;
    activeCourses: number;
    totalStudents: number;
    averageRating: number;
  };
  taughtCourses: Course[];
}

export default function TeacherDashboard() {
  const { isLoading, withLoading } = useLoading(true);
  // Mock data for the dashboard with proper typing
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    teacherStats: {
      totalCourses: 0,
      activeCourses: 0,
      totalStudents: 0,
      averageRating: 0
    },
    taughtCourses: []
  });

  // Simulate fetching data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simulate API call with delay
        await withLoading(
          new Promise<void>((resolve) => {
            setTimeout(() => {
              setDashboardData({
                teacherStats: {
                  totalCourses: 4,
                  activeCourses: 3,
                  totalStudents: 87,
                  averageRating: 4.8
                },
                taughtCourses: [
                  {
                    id: 1,
                    title: "Introduction to Mathematics",
                    enrolled: 28,
                    image: "/images/grid-image/image-04.png",
                    category: "Mathematics",
                    lastUpdated: "2 days ago",
                    rating: 4.9
                  },
                  {
                    id: 2,
                    title: "Advanced English Literature",
                    enrolled: 24,
                    image: "/images/grid-image/image-05.png",
                    category: "Language Arts",
                    lastUpdated: "Yesterday",
                    rating: 4.7
                  },
                  {
                    id: 3,
                    title: "Physics Fundamentals",
                    enrolled: 22,
                    image: "/images/grid-image/image-06.png",
                    category: "Science",
                    lastUpdated: "4 days ago",
                    rating: 4.6
                  },
                  {
                    id: 4,
                    title: "World History: Modern Era",
                    enrolled: 19,
                    image: "/images/country/country-01.svg",
                    category: "Social Studies",
                    lastUpdated: "1 week ago",
                    rating: 4.8
                  }
                ]
              });
              resolve();
            }, 2000); // 2 second delay to simulate loading
          })
        );
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, [withLoading]);

  const { teacherStats, taughtCourses } = dashboardData;

  return (
    <div className="relative px-4 py-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-950">
      {/* Loading overlay - centered and larger */}
      <LoadingOverlay 
        isLoading={isLoading} 
        withLogo={true}
        text="Loading dashboard data..."
        fullScreen={true} // Make it full screen for better visibility
      />

      {/* Welcome header with gradient text */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#15eb9e] to-[#6a00b8] mb-1">Welcome back, Professor!</h1>
          <p className="text-gray-600 dark:text-gray-300">Your teaching dashboard overview</p>
        </div>
        <div className="mt-4 lg:mt-0">
          <Link href="/dashboard/teacher/profile">
            <button className="px-5 py-2.5 bg-gradient-to-r from-[#15eb9e] to-[#6a00b8] text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/20 transition-all">
              View Profile
            </button>
          </Link>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white dark:bg-gray-800/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700/50 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Total Courses</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{teacherStats.totalCourses}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#15eb9e]/20 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 5C19.89 4.65 18.67 4.5 17.5 4.5C15.55 4.5 13.45 4.9 12 6C10.55 4.9 8.45 4.5 6.5 4.5C4.55 4.5 2.45 4.9 1 6V20.65C1 20.9 1.25 21.15 1.5 21.15C1.6 21.15 1.65 21.1 1.75 21.1C3.1 20.45 5.05 20 6.5 20C8.45 20 10.55 20.4 12 21.5C13.35 20.65 15.8 20 17.5 20C19.15 20 20.85 20.3 22.25 21.05C22.35 21.1 22.4 21.1 22.5 21.1C22.75 21.1 23 20.85 23 20.6V6C22.4 5.55 21.75 5.25 21 5ZM21 18.5C19.9 18.15 18.7 18 17.5 18C15.8 18 13.35 18.65 12 19.5V8C13.35 7.15 15.8 6.5 17.5 6.5C18.7 6.5 19.9 6.65 21 7V18.5Z" fill="#15eb9e" className="dark:fill-[#15eb9e]" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700/50 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Active Courses</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{teacherStats.activeCourses}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#6a00b8]/20 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 7H13V13H11V7ZM11 15H13V17H11V15Z" fill="#6a00b8" className="dark:fill-[#6a00b8]" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700/50 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Total Students</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{teacherStats.totalStudents}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#15eb9e]/20 to-[#6a00b8]/20 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 17V19H2V17C2 17 2 13 9 13C16 13 16 17 16 17ZM12.5 7.5C12.5 9.433 10.933 11 9 11C7.067 11 5.5 9.433 5.5 7.5C5.5 5.567 7.067 4 9 4C10.933 4 12.5 5.567 12.5 7.5ZM17.5 4C19.433 4 21 5.567 21 7.5C21 9.433 19.433 11 17.5 11C17.446 11 17.393 10.997 17.34 10.994C18.001 9.988 18.5 8.809 18.5 7.5C18.5 6.191 18.001 5.012 17.34 4.006C17.393 4.003 17.446 4 17.5 4ZM22 17C22 14.34 19.67 13 17.5 13C17.292 13 17.093 13.009 16.9 13.024C18.24 14.245 19 15.9 19 17V19H22V17Z" fill="url(#paint0_linear)" />
                <defs>
                  <linearGradient id="paint0_linear" x1="2" y1="11.5" x2="22" y2="11.5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#15eb9e" />
                    <stop offset="1" stopColor="#6a00b8" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700/50 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Overall Rating</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{teacherStats.averageRating}/5</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#15eb9e]/20 to-[#6a00b8]/20 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" fill="url(#paint0_linear)" />
                <defs>
                  <linearGradient id="paint0_linear" x1="2" y1="11.5" x2="22" y2="11.5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#15eb9e" />
                    <stop offset="1" stopColor="#6a00b8" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Course section heading with gradient text */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#15eb9e] to-[#6a00b8]">My Courses</h2>
        <Link href="/dashboard/teacher/all-courses">
          <span className="text-[#6a00b8] hover:text-purple-700 dark:text-[#15eb9e] dark:hover:text-green-400 text-sm font-medium cursor-pointer">Manage All</span>
        </Link>
      </div>

      {/* Course cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
        {taughtCourses.map(course => (
          <div key={course.id} className="bg-white/80 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/50 rounded-xl overflow-hidden transition-all hover:shadow-lg hover:shadow-purple-500/10 backdrop-blur-sm">
            <div className="h-44 relative">
              <Image 
                src={course.image}
                alt={course.title}
                className="object-cover"
                fill
              />
              <div className="absolute top-3 right-3">
                <Badge variant="solid" color="primary" size="sm" className="bg-gradient-to-r from-[#15eb9e] to-[#6a00b8] border-none">
                  {course.category}
                </Badge>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm sm:text-base overflow-hidden text-ellipsis" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>{course.title}</h3>
              
              <div className="flex justify-between mt-2 mb-3">
                <div className="flex items-center">
                  <svg width="16" height="16" className="mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" fill="#15eb9e" />
                  </svg>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{course.rating}</span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300">{course.enrolled} students</span>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <span className="text-xs text-gray-600 dark:text-gray-300">Updated: {course.lastUpdated}</span>
                <Link href={`/dashboard/teacher/course/${course.id}`}>
                  <button className="px-3 py-1 text-white text-sm font-medium rounded-lg bg-gradient-to-r from-[#15eb9e] to-[#6a00b8] hover:shadow-md hover:shadow-purple-500/20 transition-all">Manage</button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Animated background elements */}
      <div className="fixed top-20 right-20 w-64 h-64 bg-[#15eb9e]/5 rounded-full blur-3xl opacity-30 -z-10 animate-float-slow"></div>
      <div className="fixed bottom-20 left-20 w-64 h-64 bg-[#6a00b8]/5 rounded-full blur-3xl opacity-30 -z-10 animate-float-medium"></div>
    </div>
  );
}