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
  instructor: string;
  progress: number;
  image: string;
  category: string;
  lastAccessed: string;
}

interface Assignment {
  id: number;
  title: string;
  course: string;
  dueDate: string;
  status: string;
}

interface DashboardData {
  studentStats: {
    completedCourses: number;
    inProgressCourses: number;
    totalAssignments: number;
    completedAssignments: number;
  };
  enrolledCourses: Course[];
  upcomingAssignments: Assignment[];
}

export default function StudentDashboard() {
  const { isLoading, withLoading } = useLoading(true);
  // Mock data for the dashboard with proper typing
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    studentStats: {
      completedCourses: 0,
      inProgressCourses: 0,
      totalAssignments: 0,
      completedAssignments: 0
    },
    enrolledCourses: [],
    upcomingAssignments: []
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
                studentStats: {
                  completedCourses: 3,
                  inProgressCourses: 2,
                  totalAssignments: 12,
                  completedAssignments: 8
                },
                enrolledCourses: [
                  {
                    id: 1,
                    title: "Introduction to Mathematics",
                    instructor: "Dr. Sarah Johnson",
                    progress: 85,
                    image: "/images/grid-image/image-04.png",
                    category: "Mathematics",
                    lastAccessed: "2 days ago"
                  },
                  {
                    id: 2,
                    title: "Advanced English Literature",
                    instructor: "Prof. Michael Brown",
                    progress: 45,
                    image: "/images/grid-image/image-05.png",
                    category: "Language Arts",
                    lastAccessed: "Yesterday"
                  },
                  {
                    id: 3,
                    title: "Physics Fundamentals",
                    instructor: "Dr. Robert Chen",
                    progress: 30,
                    image: "/images/grid-image/image-06.png",
                    category: "Science",
                    lastAccessed: "4 days ago"
                  },
                  {
                    id: 4,
                    title: "World History: Modern Era",
                    instructor: "Dr. Emma Wilson",
                    progress: 15,
                    image: "/images/country/country-01.svg",
                    category: "Social Studies",
                    lastAccessed: "1 week ago"
                  }
                ],
                upcomingAssignments: [
                  { id: 1, title: "Mathematics Quiz", course: "Introduction to Mathematics", dueDate: "Tomorrow", status: "pending" },
                  { id: 2, title: "English Essay", course: "Advanced English Literature", dueDate: "Apr 24, 2025", status: "pending" },
                  { id: 3, title: "Physics Lab Report", course: "Physics Fundamentals", dueDate: "Apr 27, 2025", status: "pending" }
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

  const { studentStats, enrolledCourses } = dashboardData;

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
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#15eb9e] to-[#6a00b8] mb-1">Welcome back, Student!</h1>
          <p className="text-gray-600 dark:text-gray-300">Your learning journey continues here</p>
        </div>
        <div className="mt-4 lg:mt-0">
          <Link href="/dashboard/student/profile">
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
              <p className="text-sm text-gray-600 dark:text-gray-300">Completed Courses</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{studentStats.completedCourses}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#15eb9e]/20 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16.2L4.8 12L3.4 13.4L9 19L21 7L19.6 5.6L9 16.2Z" fill="#15eb9e" className="dark:fill-[#15eb9e]" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700/50 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">In Progress</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{studentStats.inProgressCourses}</h3>
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
              <p className="text-sm text-gray-600 dark:text-gray-300">Assignments</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{studentStats.completedAssignments}/{studentStats.totalAssignments}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#15eb9e]/20 to-[#6a00b8]/20 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM7 10H9V17H7V10ZM11 7H13V17H11V7ZM15 13H17V17H15V13Z" fill="url(#paint0_linear)" />
                <defs>
                  <linearGradient id="paint0_linear" x1="3" y1="12" x2="21" y2="12" gradientUnits="userSpaceOnUse">
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
              <p className="text-sm text-gray-600 dark:text-gray-300">Overall Progress</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">67%</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#15eb9e]/20 to-[#6a00b8]/20 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="url(#paint0_linear)" />
                <path d="M12 11.39C11.39 11.39 10.89 11.89 10.89 12.5C10.89 13.11 11.39 13.61 12 13.61C12.61 13.61 13.11 13.11 13.11 12.5C13.11 11.89 12.61 11.39 12 11.39ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM14.19 14.19L6 18L9.81 9.81L18 6L14.19 14.19Z" fill="url(#paint1_linear)" />
                <defs>
                  <linearGradient id="paint0_linear" x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#15eb9e" />
                    <stop offset="1" stopColor="#6a00b8" />
                  </linearGradient>
                  <linearGradient id="paint1_linear" x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
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
        <Link href="/dashboard/student/all-courses">
          <span className="text-[#6a00b8] hover:text-purple-700 dark:text-[#15eb9e] dark:hover:text-green-400 text-sm font-medium cursor-pointer">View All</span>
        </Link>
      </div>

      {/* Course cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
        {enrolledCourses.map(course => (
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
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{course.instructor}</p>
              
              <div className="mb-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 dark:text-gray-300">Progress</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div 
                    className="h-1.5 rounded-full bg-gradient-to-r from-[#15eb9e] to-[#6a00b8]" 
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <span className="text-xs text-gray-600 dark:text-gray-300">Last accessed: {course.lastAccessed}</span>
                <Link href={`/dashboard/student/course/${course.id}`}>
                  <button className="px-3 py-1 text-white text-sm font-medium rounded-lg bg-gradient-to-r from-[#15eb9e] to-[#6a00b8] hover:shadow-md hover:shadow-purple-500/20 transition-all">Continue</button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recommended courses */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#15eb9e] to-[#6a00b8]">Recommended For You</h2>
        <Link href="/dashboard/student/explore">
          <span className="text-[#6a00b8] hover:text-purple-700 dark:text-[#15eb9e] dark:hover:text-green-400 text-sm font-medium cursor-pointer">Explore More</span>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white/80 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/50 rounded-xl p-4 flex items-center shadow-sm backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/10 transition-all">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#15eb9e]/20 to-[#6a00b8]/20 flex items-center justify-center flex-shrink-0 mr-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 5C19.89 4.65 18.67 4.5 17.5 4.5C15.55 4.5 13.45 4.9 12 6C10.55 4.9 8.45 4.5 6.5 4.5C4.55 4.5 2.45 4.9 1 6V20.65C1 20.9 1.25 21.15 1.5 21.15C1.6 21.15 1.65 21.1 1.75 21.1C3.1 20.45 5.05 20 6.5 20C8.45 20 10.55 20.4 12 21.5C13.35 20.65 15.8 20 17.5 20C19.15 20 20.85 20.3 22.25 21.05C22.35 21.1 22.4 21.1 22.5 21.1C22.75 21.1 23 20.85 23 20.6V6C22.4 5.55 21.75 5.25 21 5ZM21 18.5C19.9 18.15 18.7 18 17.5 18C15.8 18 13.35 18.65 12 19.5V8C13.35 7.15 15.8 6.5 17.5 6.5C18.7 6.5 19.9 6.65 21 7V18.5Z" fill="url(#paint0_linear_chemistry)" />
              <defs>
                <linearGradient id="paint0_linear_chemistry" x1="1" y1="12" x2="23" y2="12" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#15eb9e" />
                  <stop offset="1" stopColor="#6a00b8" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Chemistry 101</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Complete your science electives</p>
          </div>
        </div>
        
        <div className="bg-white/80 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/50 rounded-xl p-4 flex items-center shadow-sm backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/10 transition-all">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#15eb9e]/20 to-[#6a00b8]/20 flex items-center justify-center flex-shrink-0 mr-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" fill="url(#paint0_linear_cs)" />
              <defs>
                <linearGradient id="paint0_linear_cs" x1="4" y1="12" x2="20" y2="12" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#15eb9e" />
                  <stop offset="1" stopColor="#6a00b8" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Computer Science</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Popular among your peers</p>
          </div>
        </div>
        
        <div className="bg-white/80 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/50 rounded-xl p-4 flex items-center shadow-sm backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/10 transition-all">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#15eb9e]/20 to-[#6a00b8]/20 flex items-center justify-center flex-shrink-0 mr-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="url(#paint0_linear_art)" />
              <defs>
                <linearGradient id="paint0_linear_art" x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#15eb9e" />
                  <stop offset="1" stopColor="#6a00b8" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Art History</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Complete your humanities requirement</p>
          </div>
        </div>
      </div>
      
      {/* Animated background elements */}
      <div className="fixed top-20 right-20 w-64 h-64 bg-[#15eb9e]/5 rounded-full blur-3xl opacity-30 -z-10 animate-float-slow"></div>
      <div className="fixed bottom-20 left-20 w-64 h-64 bg-[#6a00b8]/5 rounded-full blur-3xl opacity-30 -z-10 animate-float-medium"></div>
    </div>
  );
}