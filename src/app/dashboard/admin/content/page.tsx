'use client'
import React, { useState } from "react";
import AddMusicModal from "./components/AddMusicModal";
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
  AudioWaveform,
  CloudRain,
  Trees,
  Waves,
  CloudLightning,
  Flame,
  Wind,
  Sparkles,
  CloudDrizzle,
  Bell,
} from "lucide-react";

interface ContentItem {
  id: number;
  title: string;
  artist: string;
  url: string;
  status: "Published" | "Scheduled" | "Unpublished" | "Unknown";
  accessType: "Premium" | "Free";
}

interface EnvironmentSoundItem {
  id: number;
  title: string;
  icon: React.ReactNode;
  category: string;
  frequency: string;
  type: string;
  goal: string;
  details: string;
  status: "Published" | "Scheduled" | "Unpublished";
  accessType: "Premium" | "Free";
}

interface MindSessionItem {
  id: number;
  title: string;
  category: string;
  voice: string;
  duration: string;
  goal: string;
  details: string;
  status: "Published" | "Scheduled" | "Unpublished";
  accessType: "Premium" | "Free";
}

interface EnvironmentVisualItem {
  id: number;
  title: string;
  icon: React.ReactNode;
  category: string;
  author: string;
  goal: string;
  details: string;
  status: "Published" | "Scheduled" | "Unpublished";
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
  { id: 12, title: "Header", artist: "Guy Hawkins", url: "alma.lawson@example.com", status: "Published", accessType: "Premium" },
];

const environmentSoundData: EnvironmentSoundItem[] = [
  { id: 1, title: "White Noise", icon: <AudioWaveform className="w-5 h-5" />, category: "Solfeggio Fre...", frequency: "174 Hz", type: "Brushing & Stro...", goal: "Relax & Unwin...", details: "MIND PLAYER...", status: "Published", accessType: "Premium" },
  { id: 2, title: "Rainfall", icon: <CloudRain className="w-5 h-5" />, category: "Solfeggio Fre...", frequency: "174 Hz", type: "Brushing & Stro...", goal: "Relax & Unwin...", details: "Wade Warren", status: "Scheduled", accessType: "Premium" },
  { id: 3, title: "Forest Bird", icon: <Trees className="w-5 h-5" />, category: "Solfeggio Fre...", frequency: "174 Hz", type: "Brushing & Stro...", goal: "Relax & Unwin...", details: "Esther Howard", status: "Published", accessType: "Free" },
  { id: 4, title: "Ocean Waves", icon: <Waves className="w-5 h-5" />, category: "Solfeggio Fre...", frequency: "174 Hz", type: "Brushing & Stro...", goal: "Relax & Unwin...", details: "Jenny Wilson", status: "Published", accessType: "Free" },
  { id: 5, title: "Thunderstorm", icon: <CloudLightning className="w-5 h-5" />, category: "Solfeggio Fre...", frequency: "174 Hz", type: "Brushing & Stro...", goal: "Relax & Unwin...", details: "Guy Hawkins", status: "Unpublished", accessType: "Premium" },
  { id: 6, title: "Crackling Fire", icon: <Flame className="w-5 h-5" />, category: "Solfeggio Fre...", frequency: "174 Hz", type: "Brushing & Stro...", goal: "Relax & Unwin...", details: "Jacob Jones", status: "Unpublished", accessType: "Premium" },
  { id: 7, title: "Mountain Air", icon: <Wind className="w-5 h-5" />, category: "Solfeggio Fre...", frequency: "174 Hz", type: "Brushing & Stro...", goal: "Relax & Unwin...", details: "Ronald Richards", status: "Scheduled", accessType: "Premium" },
  { id: 8, title: "Ocean Breeze", icon: <Waves className="w-5 h-5" />, category: "Solfeggio Fre...", frequency: "174 Hz", type: "Brushing & Stro...", goal: "Relax & Unwin...", details: "Devon Lane", status: "Scheduled", accessType: "Free" },
  { id: 9, title: "City Night", icon: <Sparkles className="w-5 h-5" />, category: "Solfeggio Fre...", frequency: "174 Hz", type: "Brushing & Stro...", goal: "Relax & Unwin...", details: "Devon Lane", status: "Unpublished", accessType: "Free" },
  { id: 10, title: "Jungle Rain", icon: <CloudDrizzle className="w-5 h-5" />, category: "Solfeggio Fre...", frequency: "174 Hz", type: "Brushing & Stro...", goal: "Relax & Unwin...", details: "Jacob Jones", status: "Published", accessType: "Free" },
  { id: 11, title: "Ding dong", icon: <Bell className="w-5 h-5" />, category: "Solfeggio Fre...", frequency: "174 Hz", type: "Brushing & Stro...", goal: "Relax & Unwin...", details: "Guy Hawkins", status: "Published", accessType: "Premium" },
];

const mindSessionData: MindSessionItem[] = [
  { id: 1, title: "Sacred Winds", category: "Breathwork", voice: "Tony Green", duration: "00:05:48", goal: "Focus", details: "Breathwork...", status: "Published", accessType: "Premium" },
  { id: 2, title: "Drift into Peace", category: "Meditation", voice: "Tony Green", duration: "00:05:48", goal: "Focus", details: "A guided br...", status: "Scheduled", accessType: "Premium" },
  { id: 3, title: "Sacred Winds", category: "Breathwork", voice: "Alamay Aq...", duration: "00:05:48", goal: "Relax & Un...", details: "A guided br...", status: "Published", accessType: "Free" },
  { id: 4, title: "Echoes of the Bla...", category: "Breathwork", voice: "Tony Green", duration: "00:05:48", goal: "Focus", details: "A guided br...", status: "Published", accessType: "Free" },
  { id: 5, title: "Neural Drift", category: "Breathwork", voice: "Alamay Aq...", duration: "00:05:48", goal: "Focus", details: "A guided br...", status: "Unpublished", accessType: "Premium" },
  { id: 6, title: "Digital Stillness", category: "Breathwork", voice: "Alamay Aq...", duration: "00:05:48", goal: "Relax & Un...", details: "A guided br...", status: "Unpublished", accessType: "Premium" },
  { id: 7, title: "Through the Thre...", category: "Breathwork", voice: "Alamay Aq...", duration: "00:05:48", goal: "Relax & Un...", details: "A guided br...", status: "Scheduled", accessType: "Premium" },
  { id: 8, title: "Shadow Trails", category: "Meditation", voice: "Tony Green", duration: "00:05:48", goal: "Focus", details: "A guided br...", status: "Scheduled", accessType: "Free" },
  { id: 9, title: "Whispers Beyond", category: "Meditation", voice: "Tony Green", duration: "00:05:48", goal: "Relax & Un...", details: "A guided br...", status: "Unpublished", accessType: "Free" },
  { id: 10, title: "Gentle Horizon", category: "Meditation", voice: "Tony Green", duration: "00:05:48", goal: "Relax & Un...", details: "A guided br...", status: "Published", accessType: "Free" },
  { id: 11, title: "Still Thinking", category: "Meditation", voice: "Tony Green", duration: "00:05:48", goal: "Focus", details: "A guided br...", status: "Published", accessType: "Premium" },
];

const environmentVisualData: EnvironmentVisualItem[] = [
  { id: 1, title: "White Noise", icon: <AudioWaveform className="w-5 h-5" />, category: "Breathwork", author: "Visual Artist", goal: "Focus", details: "Breathwork Sessio...", status: "Published", accessType: "Premium" },
  { id: 2, title: "Rainfall", icon: <CloudRain className="w-5 h-5" />, category: "Meditation", author: "Visual Artist", goal: "Focus", details: "A guided breathin...", status: "Scheduled", accessType: "Premium" },
  { id: 3, title: "Forest Birds", icon: <Trees className="w-5 h-5" />, category: "Breathwork", author: "Visual Artist", goal: "Relax & Unwind", details: "A guided breathin...", status: "Published", accessType: "Free" },
  { id: 4, title: "Ocean Waves", icon: <Waves className="w-5 h-5" />, category: "Breathwork", author: "Visual Artist", goal: "Focus", details: "A guided breathin...", status: "Published", accessType: "Free" },
  { id: 5, title: "Thunderstorm", icon: <CloudLightning className="w-5 h-5" />, category: "Breathwork", author: "Visual Artist", goal: "Focus", details: "A guided breathin...", status: "Unpublished", accessType: "Premium" },
  { id: 6, title: "Crackling Fire", icon: <Flame className="w-5 h-5" />, category: "Breathwork", author: "Visual Artist", goal: "Relax & Unwind", details: "A guided breathin...", status: "Unpublished", accessType: "Premium" },
  { id: 7, title: "Mountain Wi...", icon: <Wind className="w-5 h-5" />, category: "Breathwork", author: "Visual Artist", goal: "Relax & Unwind", details: "A guided breathin...", status: "Scheduled", accessType: "Premium" },
  { id: 8, title: "Ocean Breeze", icon: <Waves className="w-5 h-5" />, category: "Meditation", author: "Visual Artist", goal: "Focus", details: "A guided breathin...", status: "Scheduled", accessType: "Free" },
  { id: 9, title: "City Night", icon: <Sparkles className="w-5 h-5" />, category: "Meditation", author: "Visual Artist", goal: "Relax & Unwind", details: "A guided breathin...", status: "Unpublished", accessType: "Free" },
  { id: 10, title: "Jungle Rain", icon: <CloudDrizzle className="w-5 h-5" />, category: "Meditation", author: "Visual Artist", goal: "Relax & Unwind", details: "A guided breathin...", status: "Published", accessType: "Free" },
  { id: 11, title: "Ding dong Bell", icon: <Bell className="w-5 h-5" />, category: "Meditation", author: "Visual Artist", goal: "Focus", details: "A guided breathin...", status: "Published", accessType: "Premium" },
];

const tabs = [
  "Music",
  "Environment Sound",
  "Mind Sessions",
  "Environment Visual",
];

export default function ContentManagementPage() {
  const [activeTab, setActiveTab] = useState("Music");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-colors whitespace-nowrap"
          >
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
              {tab === "Environment Sound" && <Activity className="w-4 h-4" />}
              {tab === "Mind Sessions" && <Brain className="w-4 h-4" />}
              {tab === "Environment Visual" && <Glasses className="w-4 h-4" />}
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Filters and Table Container */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
        {/* Filters Row */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-4 justify-end items-center">
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
              {activeTab === "Music" ? "Artist" : (activeTab === "Environment Sound" ? "Type" : (activeTab === "Mind Sessions" ? "Category" : "Category"))}
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#9810FA] hover:bg-[#8000E0] text-white rounded-lg text-sm font-medium transition-colors"
            >
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
                <th className="p-4 text-xs font-semibold text-gray-500 tracking-wider">ID</th>
                <th className="p-4 text-xs font-semibold text-gray-500 tracking-wider">
                  <div className="flex items-center gap-1 cursor-pointer">
                    Title
                    <SlidersHorizontal className="w-3 h-3 rotate-90" />
                  </div>
                </th>

                {/* Dynamic Columns */}
                {activeTab === "Environment Sound" && (
                  <>
                    <th className="p-4 text-xs font-semibold text-gray-500 tracking-wider">Category</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 tracking-wider">Frequency</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 tracking-wider">Type</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 tracking-wider">Goal</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 tracking-wider">Details</th>
                  </>
                )}
                {activeTab === "Music" && (
                  <>
                    <th className="p-4 text-xs font-semibold text-gray-500 tracking-wider">Artist</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 tracking-wider">URL</th>
                  </>
                )}
                {activeTab === "Mind Sessions" && (
                  <>
                    <th className="p-4 text-xs font-semibold text-gray-500 tracking-wider">Category</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 tracking-wider">Voice</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 tracking-wider">Duration</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 tracking-wider">Goal</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 tracking-wider">Details</th>
                  </>
                )}
                {activeTab === "Environment Visual" && (
                  <>
                    <th className="p-4 text-xs font-semibold text-gray-500 tracking-wider">Category</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 tracking-wider">Author</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 tracking-wider">Goal</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 tracking-wider">Details</th>
                  </>
                )}


                <th className="p-4 text-xs font-semibold text-gray-500 tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-gray-500 tracking-wider">Access Type</th>
                {(activeTab === "Environment Sound" || activeTab === "Mind Sessions" || activeTab === "Environment Visual") && (
                  <th className="p-4 text-xs font-semibold text-gray-500 tracking-wider">URL</th>
                )}
                <th className="p-4 text-xs font-semibold text-gray-500 tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">

              {/* Music Data */}
              {activeTab === "Music" && contentData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                  <td className="p-4 text-center">
                    <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                  </td>
                  <td className="p-4 text-xs text-gray-500">
                    {item.id < 10 ? `0${item.id}` : item.id}
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

              {/* Environment Sound Data */}
              {activeTab === "Environment Sound" && environmentSoundData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                  <td className="p-4 text-center">
                    <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                  </td>
                  <td className="p-4 text-xs text-gray-500">
                    {item.id < 10 ? `0${item.id}` : item.id}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 group-hover:bg-white group-hover:!text-[#9810FA] transition-colors flex items-center justify-center text-gray-600 dark:text-gray-400">
                        {item.icon}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white whitespace-nowrap">{item.title}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{item.category}</td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{item.frequency}</td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{item.type}</td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{item.goal}</td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{item.details}</td>

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
                  <td className="p-4 text-sm text-[#9810FA] whitespace-nowrap">Link</td>
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

              {/* Mind Sessions Data */}
              {activeTab === "Mind Sessions" && mindSessionData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                  <td className="p-4 text-center">
                    <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                  </td>
                  <td className="p-4 text-xs text-gray-500">
                    {item.id < 10 ? `0${item.id}` : item.id}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 group-hover:bg-white group-hover:!text-[#9810FA] transition-colors flex items-center justify-center text-gray-600 dark:text-gray-400">
                        <Music className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white whitespace-nowrap">{item.title}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{item.category}</td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{item.voice}</td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{item.duration}</td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{item.goal}</td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{item.details}</td>

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
                  <td className="p-4 text-sm text-[#9810FA] whitespace-nowrap">Link</td>
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

              {/* Environment Visual Data */}
              {activeTab === "Environment Visual" && environmentVisualData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                  <td className="p-4 text-center">
                    <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                  </td>
                  <td className="p-4 text-xs text-gray-500">
                    {item.id < 10 ? `0${item.id}` : item.id}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 group-hover:bg-white group-hover:!text-[#9810FA] transition-colors flex items-center justify-center text-gray-600 dark:text-gray-400">
                        {item.icon}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white whitespace-nowrap">{item.title}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{item.category}</td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{item.author}</td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{item.goal}</td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{item.details}</td>

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
                  <td className="p-4 text-sm text-[#9810FA] whitespace-nowrap">Link</td>
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
                        ${page === 1 ? 'bg-[#9810FA] text-white' : 'hover:bg-gray-50 text-gray-700 border border-gray-200 dark:border-gray-700 dark:text-gray-300'}`}>
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
      <AddMusicModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isEnvironmentSound={activeTab === "Environment Sound"}
        isMindSession={activeTab === "Mind Sessions"}
        isEnvironmentVisual={activeTab === "Environment Visual"}
      />
    </div>
  );
}

