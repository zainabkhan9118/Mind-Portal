'use client'
import { useState, useEffect, useCallback } from "react";
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
import { contentApi } from "@/lib/api";
import apiClient from "@/lib/api/axiosInstance";
import type {
  AdminMusic,
  AdminMindSession,
  AdminEnvironmentSound,
  AdminEnvironmentVisual,
  AdminCategory,
  ContentStatus,
  ContentType,
} from "@/lib/api/types";
import type { ContentItem, EnvironmentSoundItem, MindSessionItem, EnvironmentVisualItem } from "./types";

const tabs = [
  "Music",
  "Environment Sound",
  "Mind Sessions",
  "Environment Visual",
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function getContentType(activeTab: string): ContentType {
  switch (activeTab) {
    case "Environment Sound": return "env_sound";
    case "Mind Sessions": return "guided_session";
    case "Environment Visual": return "env_visual";
    default: return "music";
  }
}

function mapApiStatus(apiStatus?: ContentStatus): "Published" | "Scheduled" | "Unpublished" {
  switch (apiStatus) {
    case "published": return "Published";
    case "review":    return "Scheduled";
    default:          return "Unpublished";
  }
}

function mapUiStatusToApi(uiStatus: string): ContentStatus | undefined {
  switch (uiStatus) {
    case "Published":   return "published";
    case "Scheduled":   return "review";
    case "Unpublished": return "draft";
    default:            return undefined;
  }
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// ── API → UI adapters ─────────────────────────────────────────────────────────

function adaptMusic(item: AdminMusic): ContentItem {
  return {
    id: item.id,
    title: item.name,
    artist: item.artist,
    url: item.audio_clip,
    status: mapApiStatus(item.status),
    accessType: item.is_premium ? "Premium" : "Free",
    uploadStatus: "Uploaded",
    tags: item.tags ?? [],
  };
}

function mapGoalNames(ids: number[], goalsMap: Record<number, string>): string {
  return ids.map((id) => goalsMap[id] ?? String(id)).join(", ");
}

function adaptEnvSound(item: AdminEnvironmentSound, goalsMap: Record<number, string>): EnvironmentSoundItem {
  return {
    id: item.id,
    title: item.name,
    icon: null,
    category: item.category_names ?? "",
    frequency: item.frequency ?? "",
    type: item.environment_sound_type ?? "",
    goal: mapGoalNames(item.goals ?? [], goalsMap),
    details: item.description ?? "",
    status: mapApiStatus(item.status),
    accessType: item.is_premium ? "Premium" : "Free",
    uploadStatus: "Uploaded",
    tags: item.tags ?? [],
  };
}

function adaptMindSession(item: AdminMindSession, goalsMap: Record<number, string>): MindSessionItem {
  return {
    id: item.id,
    title: item.name,
    category: item.category_names ?? "",
    voice: item.instructor_name ?? item.artist,
    duration: formatDuration(item.duration),
    goal: mapGoalNames(item.goals ?? [], goalsMap),
    details: item.description,
    status: mapApiStatus(item.status),
    accessType: item.is_premium ? "Premium" : "Free",
    uploadStatus: "Uploaded",
    tags: item.tags ?? [],
  };
}

function adaptEnvVisual(item: AdminEnvironmentVisual, goalsMap: Record<number, string>): EnvironmentVisualItem {
  return {
    id: item.id,
    title: item.name,
    icon: null,
    category: item.category_names ?? "",
    author: item.mood ?? "",
    goal: mapGoalNames(item.goals ?? [], goalsMap),
    details: item.description ?? "",
    status: mapApiStatus(item.status),
    accessType: item.is_premium ? "Premium" : "Free",
    uploadStatus: "Uploaded",
    tags: item.tags ?? [],
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

type AnyRow = ContentItem | EnvironmentSoundItem | MindSessionItem | EnvironmentVisualItem;

export default function ContentManagementPage() {
  const [activeTab, setActiveTab] = useState("Music");
  const [searchTerm, setSearchTerm] = useState("");
  const [accessFilter, setAccessFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewContentModalOpen, setIsNewContentModalOpen] = useState(false);

  const [data, setData] = useState<AnyRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [goalsMap, setGoalsMap] = useState<Record<number, string>>({});

  const PAGE_SIZE = 10;

  const fetchCategories = useCallback(async () => {
    try {
      if (activeTab === "Music") {
        const res = await contentApi.categories.list({ size: 100, type: "music" });
        setCategories(res.results);
        return;
      }

      // For other tabs the shared categories endpoint doesn't return their categories,
      // so extract unique {id, name} pairs directly from the content list.
      let items: Array<{ category?: number[]; mind_session_category?: number[]; category_names: string }> = [];

      if (activeTab === "Mind Sessions") {
        const res = await contentApi.guidedSessions.list({ size: 100 });
        items = res.results;
      } else if (activeTab === "Environment Sound") {
        const res = await contentApi.envSounds.list({ size: 100 });
        items = res.results;
      } else if (activeTab === "Environment Visual") {
        const res = await contentApi.envVisuals.list({ size: 100 });
        items = res.results;
      }

      const seen = new Set<number>();
      const cats: AdminCategory[] = [];
      for (const item of items) {
        const ids = item.mind_session_category ?? item.category ?? [];
        const names = (Array.isArray(item.category_names) ? item.category_names : []) as string[];
        ids.forEach((id, i) => {
          if (!seen.has(id) && names[i]) {
            seen.add(id);
            cats.push({ id, name: names[i], item_count: 0 });
          }
        });
      }
      setCategories(cats);
    } catch {
      setCategories([]);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    apiClient
      .get<{ results: { id: number; name: string }[] }>("explore/goals/", { params: { size: 100 } })
      .then((res) => {
        const map: Record<number, string> = {};
        for (const g of res.data.results ?? []) map[g.id] = g.name;
        setGoalsMap(map);
      })
      .catch(() => {});
  }, []);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        q: searchTerm || undefined,
        status: mapUiStatusToApi(statusFilter),
        is_premium: accessFilter === "Premium" ? true : accessFilter === "Free" ? false : undefined,
        category: categoryFilter ? Number(categoryFilter) : undefined,
        page: currentPage,
        size: PAGE_SIZE,
      };

      switch (activeTab) {
        case "Music": {
          const res = await contentApi.music.list(params);
          setData(res.results.map(adaptMusic));
          setTotalCount(res.count);
          setTotalPages(res.pages_count ?? Math.ceil(res.count / PAGE_SIZE));
          break;
        }
        case "Environment Sound": {
          const res = await contentApi.envSounds.list(params);
          setData(res.results.map((item) => adaptEnvSound(item, goalsMap)));
          setTotalCount(res.count);
          setTotalPages(res.pages_count ?? Math.ceil(res.count / PAGE_SIZE));
          break;
        }
        case "Mind Sessions": {
          const res = await contentApi.guidedSessions.list(params);
          setData(res.results.map((item) => adaptMindSession(item, goalsMap)));
          setTotalCount(res.count);
          setTotalPages(res.pages_count ?? Math.ceil(res.count / PAGE_SIZE));
          break;
        }
        case "Environment Visual": {
          const res = await contentApi.envVisuals.list(params);
          setData(res.results.map((item) => adaptEnvVisual(item, goalsMap)));
          setTotalCount(res.count);
          setTotalPages(res.pages_count ?? Math.ceil(res.count / PAGE_SIZE));
          break;
        }
      }
    } catch (err) {
      console.error("Failed to fetch content:", err);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, searchTerm, accessFilter, statusFilter, categoryFilter, currentPage, goalsMap]);

  // Reset to page 1 when filters or tab change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm, accessFilter, statusFilter, categoryFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Action handlers ─────────────────────────────────────────────────────────

  const handleDelete = async (id: number) => {
    try {
      switch (activeTab) {
        case "Music":               await contentApi.music.delete(id); break;
        case "Environment Sound":   await contentApi.envSounds.delete(id); break;
        case "Mind Sessions":       await contentApi.guidedSessions.delete(id); break;
        case "Environment Visual":  await contentApi.envVisuals.delete(id); break;
      }
      fetchData();
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const handleDuplicate = async (id: number) => {
    try {
      await contentApi.duplicate(getContentType(activeTab), id);
      fetchData();
    } catch (err) {
      console.error("Failed to duplicate:", err);
    }
  };

  const handleChangeStatus = async (id: number, status: "published" | "draft" | "archived") => {
    try {
      await contentApi.changeStatus(getContentType(activeTab), id, { status });
      fetchData();
    } catch (err) {
      console.error("Failed to change status:", err);
    }
  };

  // ── Pagination ───────────────────────────────────────────────────────────────

  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(currentPage * PAGE_SIZE, totalCount);

  const pageNumbers = (() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  })();

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
          categories={categories}
          onSearchChange={setSearchTerm}
          onAccessChange={setAccessFilter}
          onStatusChange={setStatusFilter}
          onCategoryChange={setCategoryFilter}
          onAddClick={() => setIsModalOpen(true)}
        />

        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
            Loading...
          </div>
        ) : (
          <ContentTable
            activeTab={activeTab}
            data={data}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            onChangeStatus={handleChangeStatus}
          />
        )}

        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium">{startItem}-{endItem}</span> of <span className="font-medium">{totalCount}</span>
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {pageNumbers.map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors
                  ${page === currentPage
                    ? "bg-[#9810FA] text-white"
                    : "hover:bg-gray-50 text-gray-700 border border-gray-200 dark:border-gray-700 dark:text-gray-300"
                  }`}
              >
                {page}
              </button>
            ))}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className="px-2 text-gray-400">...</span>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700 hover:bg-gray-50 text-gray-700 dark:text-gray-300"
                >
                  {totalPages}
                </button>
              </>
            )}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
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
        categories={categories}
        onSuccess={fetchData}
      />

      <AddNewContentModal
        isOpen={isNewContentModalOpen}
        onClose={() => setIsNewContentModalOpen(false)}
        onSuccess={fetchCategories}
        activeTab={activeTab}
      />
    </div>
  );
}