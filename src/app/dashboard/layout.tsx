// app/dashboard/layout.tsx
"use client";
import Sidebar from '../../layout/AppSidebar'
import Header from '../../layout/AppHeader'
import { useSidebar } from '@/context/SidebarContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <div className="min-h-screen w-full">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className={`transition-all duration-300 ease-in-out ${mainContentMargin}`}>
        {/* Header */}
        <Header />
        {/* Page Content */}
        <main className="p-4 md:p-6 overflow-x-hidden">{children}</main>
      </div>
    </div>
  )
}
