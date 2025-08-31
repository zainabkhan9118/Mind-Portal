'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const UserRoles = () => {
  const router = useRouter();

  const handleRoleSelect = (role: string) => {
    // Navigate to the signup page with the selected role as a query parameter
    router.push(`/signup?role=${role}`);
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto no-scrollbar min-h-screen">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-purple-500/20 blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl animate-float-medium"></div>
        <div className="absolute top-1/3 -right-20 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl animate-float-fast"></div>
      </div>
      
      <div className="flex flex-col justify-center items-center flex-1 w-full max-w-md mx-auto relative z-10 px-4">
        <div className="mb-8 text-center">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Choose Your Role
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Select your role to continue with registration
          </p>
        </div>
        
        <div className="w-full space-y-4">
          <button
            onClick={() => handleRoleSelect('teacher')}
            className="w-full py-4 font-medium text-white transition-all rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 focus:ring-2 focus:ring-purple-400 flex items-center justify-center"
          >
            Teacher
          </button>
          
          <button
            onClick={() => handleRoleSelect('student')}
            className="w-full py-4 font-medium text-white transition-all rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-purple-400 flex items-center justify-center"
          >
            Student
          </button>
          
          <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-6">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="font-medium text-purple-600 transition-colors hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default UserRoles