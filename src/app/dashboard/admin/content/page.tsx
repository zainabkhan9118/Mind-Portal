"use client";
import React, { useState } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  Trash2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Music,
  SlidersHorizontal,
  Filter,
  Activity,
  Brain,
  Glasses,
  MessageSquare,
  ListMusic,
} from "lucide-react";

interface ContentItem {
  id: number;
  title: string;
  artist: string;
  url: string;
  status: "Published" | "Scheduled" | "Unpublished" | "Unknown";
  accessType: "Premium" | "Free";
}

const contentData: ContentItem[] = [
  { id: 1, title: "Header", artist: "Jane Cooper", url: "jessica.hanson@example.com", status: "Published", accessType: "Premium" },
  { id: 2, title: "Header", artist: "Wade Warren", url: "willie.jennings@example.com", status: "Scheduled", accessType: "Premium" },
  { id: 3, title: "Header", artist: "Esther Howard", url: "d.chambers@example.com", status: "Published", accessType: "Free" },
  { id: 4, title: "Header", artist: "Jenny Wilson", url: "willie.jennings@example.com", status: "Published", accessType: "Free" },
  { id: 5, title: "Header", artist: "Guy Hawkins", url: "michael.mitc@example.com", status: "Unpublished", accessType: "Premium" },
  { id: 6, title: "Header", artist: "Jacob Jones", url: "michael.mitc@example.com", status: "Unpublished", accessType: "Premium" },
  { id: 7, title: "Header", artist: "Ronald Richards", url: "deanna.curtis@example.com", status: "Scheduled", accessType: "Premium" },
  { id: 8, title: "Header", artist: "Devon Lane", url: "alma.lawson@example.com", status: "Scheduled", accessType: "Free" },
  { id: 9, title: "Header", artist: "Devon Lane", url: "alma.lawson@example.com", status: "Unpublished", accessType: "Free" },
  { id: 10, title: "Header", artist: "Jacob Jones", url: "alma.lawson@example.com", status: "Published", accessType: "Free" },
  { id: 11, title: "Header", artist: "Guy Hawkins", url: "alma.lawson@example.com", status: "Published", accessType: "Premium" },
  { id: 12, title: "Header", artist: "Guy Hawkins", url: "alma.lawson@example.com", status: "Unknown", accessType: "Premium" } as ContentItem,
];

const tabs = [
  "Music",
  "Soundscapes",
  "Mind Sessions",
  "VR Environments",
  "Subliminal Messages",
  "Playlists",
];

export default function ContentManagementPage() {
  const [activeTab, setActiveTab] = useState("Music");
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Content Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage and track your content here.
          </p>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64 md:w-80">
            <input
              type="text"
              placeholder="Search content"
              className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-colors whitespace-nowrap">
            <Plus className="w-4 h-4" />
            Add Content
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-6 overflow-x-auto no-scrollbar pb-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 pb-3 px-1 text-sm font-medium transition-all border-b-2 whitespace-nowrap ${activeTab === tab
                ? "border-purple-600 text-purple-600 dark:text-purple-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
            >
              {tab === "Music" && <Music className="w-4 h-4" />}
              {tab === "Soundscapes" && <Activity className="w-4 h-4" />}
              {tab === "Mind Sessions" && <Brain className="w-4 h-4" />}
              {tab === "VR Environments" && <Glasses className="w-4 h-4" />}
              {tab === "Subliminal Messages" && <MessageSquare className="w-4 h-4" />}
              {tab === "Playlists" && <ListMusic className="w-4 h-4" />}
              {tab}
            </button>
          ))}
          <button className="ml-auto text-gray-400 hover:text-gray-600">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filters and Table Container */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
        {/* Filters Row */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search here"
              className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:border-purple-500"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>

          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-900 hover:bg-gray-50">
              Access Type
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-900 hover:bg-gray-50">
              Visibility Status
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-900 hover:bg-gray-50">
              Artist
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors">
              <Plus className="w-4 h-4" />
              Add New
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <th className="p-4 w-10">
                  <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                </th>
                <th className="p-4 text-xs font-semibold text-gray-500 tracking-wider">
                  <div className="flex items-center gap-1 cursor-pointer">
                    Title
                    <SlidersHorizontal className="w-3 h-3 rotate-90" />
                  </div>
                </th>
                <th className="p-4 text-xs font-semibold text-gray-500 tracking-wider">Artist</th>
                <th className="p-4 text-xs font-semibold text-gray-500 tracking-wider">URL</th>
                <th className="p-4 text-xs font-semibold text-gray-500 tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-gray-500 tracking-wider">Access Type</th>
                <th className="p-4 text-xs font-semibold text-gray-500 tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {contentData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                  <td className="p-4 text-center">
                    <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                        <Music className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{item.title}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{item.artist}</td>
                  <td className="p-4 text-sm text-gray-500 dark:text-gray-400 font-mono">{item.url}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                            ${item.status === 'Published' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' :
                        item.status === 'Scheduled' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' :
                          'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
                      }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                             ${item.accessType === 'Premium' ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800' :
                        'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800'
                      }`}>
                      {item.accessType}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full border border-gray-300 dark:border-gray-600 text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                      <button className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md text-gray-400 hover:text-red-600">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing <span className="font-medium">1-12</span> of <span className="font-medium">100</span></p>

          <div className="flex items-center gap-1">
            <button className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {[1, 2, 3].map(page => (
              <button key={page} className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors
                        ${page === 1 ? 'bg-purple-600 text-white' : 'hover:bg-gray-50 text-gray-700 border border-gray-200 dark:border-gray-700 dark:text-gray-300'}`}>
                {page}
              </button>
            ))}
            <span className="px-2 text-gray-400">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700 hover:bg-gray-50 text-gray-700 dark:text-gray-300">
              15
            </button>
            <button className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
