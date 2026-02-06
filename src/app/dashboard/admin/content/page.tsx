'use client'
import React, { useState, useMemo } from "react";
import AddMusicModal from "./components/AddMusicModal";
import AddNewContentModal from "./components/AddMusicModal/AddNewContentModal";
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Music,
  Activity,
  Brain,
  Glasses,
} from "lucide-react";
import ContentTable from "./components/ContentTable";
import ContentFilter from "./components/ContentFilter";
import { musicData, environmentSoundData, mindSessionData, environmentVisualData } from "./data/mockData";

const tabs = [
  "Music",
  "Environment Sound",
  "Mind Sessions",
  "Environment Visual",
];

export default function ContentManagementPage() {
  const [activeTab, setActiveTab] = useState("Music");
  const [searchTerm, setSearchTerm] = useState("");
  const [accessFilter, setAccessFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewContentModalOpen, setIsNewContentModalOpen] = useState(false);

  const filteredData = useMemo(() => {
    let currentData = [];
    switch (activeTab) {
      case "Music":
        currentData = musicData;
        break;
      case "Environment Sound":
        currentData = environmentSoundData;
        break;
      case "Mind Sessions":
        currentData = mindSessionData;
        break;
      case "Environment Visual":
        currentData = environmentVisualData;
        break;
      default:
        currentData = musicData;
    }

    return currentData.filter((item: any) => {
      const matchesSearch = !searchTerm ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.artist && item.artist.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesAccess = !accessFilter || item.accessType === accessFilter;
      const matchesStatus = !statusFilter || item.status === statusFilter;
      const matchesCategory = !categoryFilter ||
        (activeTab === "Music" ? item.artist === categoryFilter : item.category === categoryFilter);

      return matchesSearch && matchesAccess && matchesStatus && matchesCategory;
    });
  }, [activeTab, searchTerm, accessFilter, statusFilter, categoryFilter]);

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
          <button
            onClick={() => setIsNewContentModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#9810FA] hover:bg-[#8000E0] text-white rounded-xl text-sm font-medium transition-colors whitespace-nowrap"
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
        <ContentFilter
          activeTab={activeTab}
          searchTerm={searchTerm}
          accessFilter={accessFilter}
          statusFilter={statusFilter}
          categoryFilter={categoryFilter}
          onSearchChange={setSearchTerm}
          onAccessChange={setAccessFilter}
          onStatusChange={setStatusFilter}
          onCategoryChange={setCategoryFilter}
          onAddClick={() => setIsModalOpen(true)}
        />

        <ContentTable
          activeTab={activeTab}
          data={filteredData}
        />

        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing <span className="font-medium">1-{filteredData.length}</span> of <span className="font-medium">{filteredData.length}</span></p>

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

      <AddNewContentModal
        isOpen={isNewContentModalOpen}
        onClose={() => setIsNewContentModalOpen(false)}
      />
    </div>
  );
}
