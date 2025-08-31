"use client";
import React from "react";
import ContentDropdown from "@/components/adminDashboard/ContentDropdown";

export default function ContentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-6 flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Content Management</h1>
      <ContentDropdown />
      <div className="mt-4">{children}</div>
    </div>
  );
}