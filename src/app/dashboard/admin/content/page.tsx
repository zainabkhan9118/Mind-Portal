'use client'
import { Suspense, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AddMusicModal from "./components/AddMusicModal";
import AddNewContentModal from "./components/AddMusicModal/AddNewContentModal";
import ManageCategoriesModal from "./components/ManageCategoriesModal";
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Music,
  Activity,
  Brain,
  Glasses,
  Sparkles,
} from "lucide-react";
import ContentTable from "./components/ContentTable";
import ContentFilter from "./components/ContentFilter";
import BulkActionBar, { type BulkAction } from "./components/BulkActionBar";
import { contentApi } from "@/lib/api";
import apiClient from "@/lib/api/axiosInstance";
import { getApiErrorMessage } from "@/lib/api/errors";
import { HOME_SCREEN_ONLY_TAG } from "@/lib/contentTags";
import type {
  AdminMusic,
  AdminMindSession,
  AdminEnvironmentSound,
  AdminEnvironmentVisual,
  AdminMind,
  AdminCategory,
  ContentStatus,
  ContentType,
  BulkActionName,
} from "@/lib/api/types";
import type { ContentItem, EnvironmentSoundItem, MindSessionItem, EnvironmentVisualItem, MindItem } from "./types";

const tabs = [
  "Music",
  "Sounds",
  "Guided",
  "Visuals",
  "Minds",
];

function tabToSlug(tab: string): string {
  return tab.toLowerCase();
}

function slugToTab(slug: string | null): string | null {
  return tabs.find((t) => tabToSlug(t) === slug) ?? null;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getContentType(activeTab: string): ContentType {
  switch (activeTab) {
    case "Sounds": return "env_sound";
    case "Guided": return "mind_session";
    case "Visuals": return "env_visual";
    case "Minds": return "minds";
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
    coverUrl: item.image || item.icon_url || null,
    artist: item.artist,
    url: item.audio_clip,
    state: item.state ?? "",
    effect: item.effect ?? "",
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
    coverUrl: item.image || item.icon_url || null,
    icon: null,
    category: item.category_names ?? "",
    frequency: item.frequency ?? "",
    type: item.environment_sound_type ?? "",
    goal: mapGoalNames(item.goals ?? [], goalsMap),
    details: item.description ?? "",
    state: item.state ?? "",
    effect: item.effect ?? "",
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
    coverUrl: item.image || item.icon_url || null,
    category: item.category_names ?? "",
    voice: item.instructor_name ?? item.artist,
    duration: formatDuration(item.duration),
    goal: mapGoalNames(item.goals ?? [], goalsMap),
    details: item.description,
    state: item.state ?? "",
    effect: item.effect ?? "",
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
    coverUrl: item.image || item.icon_url || null,
    icon: null,
    category: item.category_names ?? "",
    author: item.mood ?? "",
    goal: mapGoalNames(item.goals ?? [], goalsMap),
    details: item.description ?? "",
    state: item.state ?? "",
    effect: item.effect ?? "",
    status: mapApiStatus(item.status),
    accessType: item.is_premium ? "Premium" : "Free",
    uploadStatus: "Uploaded",
    tags: item.tags ?? [],
  };
}

// Mind id → cover URL (null = has none). Kept for the session so paging back doesn't refetch.
const mindCoverCache = new Map<number, string | null>();

async function loadMindCovers(ids: number[]): Promise<Record<number, string>> {
  const toFetch = ids.filter((id) => !mindCoverCache.has(id));
  await Promise.all(toFetch.map(async (id) => {
    try {
      const detail = await apiClient.get<{ image?: string | null }>(`admin/analytics/minds/${id}/`);
      mindCoverCache.set(id, detail.data?.image || null);
    } catch {
      mindCoverCache.set(id, null);
    }
  }));
  const out: Record<number, string> = {};
  ids.forEach((id) => { const url = mindCoverCache.get(id); if (url) out[id] = url; });
  return out;
}

function adaptMind(item: AdminMind, goalsMap: Record<number, string>): MindItem {
  return {
    id: item.id,
    title: item.name,
    // Cover image first (once the admin endpoint returns it), otherwise the Mind's icon
    coverUrl: item.image || item.icon_url || null,
    description: item.description ?? "",
    goals: mapGoalNames(item.goals ?? [], goalsMap),
    author: item.author ?? "",
    state: item.state ?? "",
    effect: item.effect ?? "",
    status: mapApiStatus(item.status),
    accessType: item.is_premium ? "Premium" : "Free",
    tags: item.tags ?? [],
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

type AnyRow = ContentItem | EnvironmentSoundItem | MindSessionItem | EnvironmentVisualItem | MindItem;

export default function ContentManagementPage() {
  return (
    <Suspense fallback={null}>
      <ContentManagementPageInner />
    </Suspense>
  );
}

function ContentManagementPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(slugToTab(tabParam) ?? "Music");

  // Keep in sync with the URL — a Link to this same route only changes the query
  // string, it doesn't remount the page, so the initial useState value won't update.
  useEffect(() => {
    const tab = slugToTab(tabParam);
    if (tab) setActiveTab(tab);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabParam]);

  const selectTab = (tab: string) => {
    setActiveTab(tab);
    router.replace(`/dashboard/admin/content?tab=${tabToSlug(tab)}`, { scroll: false });
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [accessFilter, setAccessFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewContentModalOpen, setIsNewContentModalOpen] = useState(false);
  const [isManageCategoriesOpen, setIsManageCategoriesOpen] = useState(false);
  const [editItemId, setEditItemId] = useState<number | null>(null);
  // Captured at the moment Edit is clicked — if the admin switches tabs while the modal is
  // still open, `activeTab` changes but the item being edited doesn't, so deriving the
  // modal's content-type props live from `activeTab` would send e.g. a Music item's id to
  // the Minds endpoint. Falls back to `activeTab` for the "Add New" (no id) case.
  const [editItemTab, setEditItemTab] = useState<string | null>(null);

  const [data, setData] = useState<AnyRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [goalsMap, setGoalsMap] = useState<Record<number, string>>({});

  const PAGE_SIZE = 10;

  // ── Bulk selection ──────────────────────────────────────────────────────────
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isBulkRunning, setIsBulkRunning] = useState(false);
  const [bulkMessage, setBulkMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchCategories = useCallback(async () => {
    // Minds have no Category concept at all (no Category UI, no "Add Category" button).
    if (activeTab === "Minds") { setCategories([]); return; }
    const contentType = getContentType(activeTab);
    let direct: AdminCategory[] = [];
    try {
      const res = await contentApi.categories.list({ size: 100, type: contentType });
      direct = res.results ?? [];
    } catch {
      direct = [];
    }

    if (direct.length > 0 || activeTab === "Music") {
      setCategories(direct);
      return;
    }

    // Fallback for Guided/Sounds/Visuals: the direct `type`-filtered endpoint came back
    // empty even though these items clearly have categories assigned (their own detail
    // responses include real `category`/`category_names`) — reported to backend as a
    // likely filter bug on `admin/content/categories/?type=...` for non-music types (see
    // API_SPEC.md). Derive categories from the content items themselves so the picker
    // still works while that's investigated. Won't surface a category with zero items yet.
    try {
      let items: Array<{ category?: number[]; mind_session_category?: number[]; category_names?: string | string[] }> = [];
      if (activeTab === "Guided") items = (await contentApi.guidedSessions.list({ size: 100 })).results;
      else if (activeTab === "Sounds") items = (await contentApi.envSounds.list({ size: 100 })).results;
      else if (activeTab === "Visuals") items = (await contentApi.envVisuals.list({ size: 100 })).results;

      const seen = new Set<number>();
      const derived: AdminCategory[] = [];
      for (const item of items) {
        const ids = item.mind_session_category ?? item.category ?? [];
        const names = Array.isArray(item.category_names) ? item.category_names : [];
        ids.forEach((id, i) => {
          if (!seen.has(id) && names[i]) {
            seen.add(id);
            derived.push({ id, name: names[i], item_count: 0 });
          }
        });
      }
      setCategories(derived);
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
        case "Sounds": {
          const res = await contentApi.envSounds.list(params);
          // Hide quick-uploads made from the Home Screen Environments composer (Settings) —
          // those are building blocks for one specific home screen, not curated library
          // content, and shouldn't mix into this list. See src/lib/contentTags.ts.
          const visible = res.results.filter((item) => !item.tags?.includes(HOME_SCREEN_ONLY_TAG));
          setData(visible.map((item) => adaptEnvSound(item, goalsMap)));
          setTotalCount(res.count - (res.results.length - visible.length));
          setTotalPages(res.pages_count ?? Math.ceil(res.count / PAGE_SIZE));
          break;
        }
        case "Guided": {
          const res = await contentApi.guidedSessions.list(params);
          setData(res.results.map((item) => adaptMindSession(item, goalsMap)));
          setTotalCount(res.count);
          setTotalPages(res.pages_count ?? Math.ceil(res.count / PAGE_SIZE));
          break;
        }
        case "Visuals": {
          const res = await contentApi.envVisuals.list(params);
          // Same as Sounds above — hide Home Screen Environments quick-uploads.
          const visible = res.results.filter((item) => !item.tags?.includes(HOME_SCREEN_ONLY_TAG));
          setData(visible.map((item) => adaptEnvVisual(item, goalsMap)));
          setTotalCount(res.count - (res.results.length - visible.length));
          setTotalPages(res.pages_count ?? Math.ceil(res.count / PAGE_SIZE));
          break;
        }
        case "Minds": {
          const res = await contentApi.minds.list(params);
          const minds = res.results.map((item) => adaptMind(item, goalsMap));
          setData(minds);
          // The admin Minds list doesn't return the cover image yet (BACKEND_REQUESTS.md item 12),
          // so fill it in from the Mind analytics detail, which does — 10 small requests per page.
          const missing = res.results.filter((m) => !m.image).map((m) => m.id);
          if (missing.length) {
            loadMindCovers(missing).then((covers) => {
              setData((prev) => prev.map((item) =>
                // Only Mind rows (the admin may have switched tabs while covers loaded)
                covers[item.id] && "goals" in item && "description" in item ? { ...item, coverUrl: covers[item.id] } : item));
            });
          }
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

  // Selection only covers what's visible — clear it whenever the visible set changes
  useEffect(() => {
    setSelectedIds(new Set());
    setBulkMessage(null);
  }, [activeTab, searchTerm, accessFilter, statusFilter, categoryFilter, currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Action handlers ─────────────────────────────────────────────────────────

  const deleteOne = async (id: number) => {
    switch (activeTab) {
      case "Music":   await contentApi.music.delete(id); break;
      case "Sounds":  await contentApi.envSounds.delete(id); break;
      case "Guided":  await contentApi.guidedSessions.delete(id); break;
      case "Visuals": await contentApi.envVisuals.delete(id); break;
      case "Minds":   await contentApi.minds.delete(id); break;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteOne(id);
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

  const handleEdit = (id: number) => {
    setEditItemId(id);
    setEditItemTab(activeTab);
    setIsModalOpen(true);
  };

  const handleChangeStatus = async (id: number, status: "published" | "draft" | "archived") => {
    try {
      await contentApi.changeStatus(getContentType(activeTab), id, { status });
      fetchData();
    } catch (err) {
      console.error("Failed to change status:", err);
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedIds(prev => (data.length > 0 && data.every(item => prev.has(item.id)) ? new Set() : new Set(data.map(item => item.id))));
  };

  const handleBulkAction = async (action: BulkAction) => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    const type = getContentType(activeTab);
    setIsBulkRunning(true);
    setBulkMessage(null);

    // One request to the backend's bulk endpoint (max 500 items; selection is one page)
    const request = ((): { action: BulkActionName; data?: Record<string, unknown> } => {
      switch (action.kind) {
        case "delete":
          return { action: "delete" };
        case "access":
          return {
            action: "set_access",
            data: typeof action.level === "number"
              ? { is_premium: false, access_levels: [action.level] }
              : { is_premium: action.level === "premium", access_levels: [] },
          };
        case "status":
          return { action: "set_status", data: action.status === "draft" ? { status: "draft", published_at: null } : { status: "published" } };
        case "schedule":
          return { action: "set_status", data: { status: "review", published_at: action.publishedAt } };
      }
    })();

    let failedIds: number[];
    let firstError: string | undefined;
    try {
      const res = await contentApi.bulkAction({ ...request, items: ids.map(id => ({ type, id })) });
      const failed = (res.results ?? []).filter(r => !r.ok);
      failedIds = failed.map(r => r.id);
      firstError = failed.find(r => r.error)?.error;
    } catch (err) {
      console.error("Bulk action failed:", err);
      failedIds = ids;
      firstError = getApiErrorMessage(err);
    }
    const succeeded = ids.length - failedIds.length;

    const verb = { delete: "Deleted", access: "Updated access for", status: "Updated status for", schedule: "Scheduled" }[action.kind];
    if (failedIds.length === 0) {
      setBulkMessage({ type: "success", text: `${verb} ${succeeded} item${succeeded === 1 ? "" : "s"}.` });
    } else {
      const titles = data.filter(item => failedIds.includes(item.id)).map(item => item.title).join(", ");
      setBulkMessage({ type: "error", text: `${verb} ${succeeded} of ${ids.length}. Failed: ${titles}${firstError ? ` (${firstError})` : ""}` });
    }

    // Keep only the failures selected so they can be retried
    setSelectedIds(new Set(failedIds));
    setIsBulkRunning(false);
    fetchData();
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
              className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
          {activeTab !== "Minds" && (
          <button
            onClick={() => setIsManageCategoriesOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#9810FA] hover:bg-[#8000E0] text-white rounded-xl text-sm font-medium transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-6 overflow-x-auto no-scrollbar pb-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => selectTab(tab)}
              className={`flex items-center gap-2 pb-3 px-1 text-sm font-medium transition-all border-b-2 whitespace-nowrap ${activeTab === tab
                ? "border-purple-600 text-purple-600 dark:text-purple-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
            >
              {tab === "Music" && <Music className="w-4 h-4" />}
              {tab === "Sounds" && <Activity className="w-4 h-4" />}
              {tab === "Guided" && <Brain className="w-4 h-4" />}
              {tab === "Visuals" && <Glasses className="w-4 h-4" />}
              {tab === "Minds" && <Sparkles className="w-4 h-4" />}
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
          onManageCategoriesClick={() => setIsManageCategoriesOpen(true)}
        />

        <BulkActionBar
          selectedCount={selectedIds.size}
          isRunning={isBulkRunning}
          onRun={handleBulkAction}
          onClear={() => setSelectedIds(new Set())}
        />
        {bulkMessage && (
          <div className={`flex items-start justify-between gap-3 px-4 py-2.5 text-sm border-b ${bulkMessage.type === "success"
              ? "bg-green-50 text-green-700 border-green-100 dark:bg-green-900/10 dark:text-green-400 dark:border-green-900/30"
              : "bg-red-50 text-red-600 border-red-100 dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/30"}`}>
            <span>{bulkMessage.text}</span>
            <button onClick={() => setBulkMessage(null)} className="shrink-0 opacity-70 hover:opacity-100" aria-label="Dismiss">✕</button>
          </div>
        )}

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
            onEdit={handleEdit}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onToggleSelectAll={toggleSelectAll}
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
        onClose={() => { setIsModalOpen(false); setEditItemId(null); setEditItemTab(null); }}
        isEnvironmentSound={(editItemTab ?? activeTab) === "Sounds"}
        isMindSession={(editItemTab ?? activeTab) === "Guided"}
        isEnvironmentVisual={(editItemTab ?? activeTab) === "Visuals"}
        isMind={(editItemTab ?? activeTab) === "Minds"}
        categories={categories}
        onSuccess={fetchData}
        editItemId={editItemId}
        activeTab={editItemTab ?? activeTab}
      />

      <AddNewContentModal
        isOpen={isNewContentModalOpen}
        onClose={() => setIsNewContentModalOpen(false)}
        onSuccess={fetchCategories}
        activeTab={activeTab}
      />

      <ManageCategoriesModal
        isOpen={isManageCategoriesOpen}
        onClose={() => setIsManageCategoriesOpen(false)}
        activeTab={activeTab}
        onCategoriesChanged={fetchCategories}
      />
    </div>
  );
}