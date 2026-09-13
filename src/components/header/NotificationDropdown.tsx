"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Bell, Brain, Music2, ShieldCheck } from "lucide-react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import contentApi from "@/lib/api/contentApi";
import usersApi from "@/lib/api/usersApi";

interface PendingGroup {
  key: "minds" | "playlists" | "mind_experts";
  label: string;
  count: number;
  icon: React.ReactNode;
  href: string;
}

const POLL_INTERVAL_MS = 60_000;

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [mindsPending, setMindsPending] = useState(0);
  const [playlistsPending, setPlaylistsPending] = useState(0);
  const [expertsPending, setExpertsPending] = useState(0);

  const loadCounts = async () => {
    try {
      const [mindsRes, playlistsRes, expertsRes] = await Promise.all([
        contentApi.getAll({ status: "review", type: "mind_session", size: 1 }),
        contentApi.getAll({ status: "review", type: "music", size: 1 }),
        usersApi.getMindExpertApplications({ size: 1 }),
      ]);
      setMindsPending(mindsRes.count ?? 0);
      setPlaylistsPending(playlistsRes.count ?? 0);
      setExpertsPending(expertsRes.count ?? 0);
    } catch {
      // Leave counts as-is; the bell simply won't glow if the checks fail.
    }
  };

  useEffect(() => {
    loadCounts();
    const interval = setInterval(loadCounts, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  const groups: PendingGroup[] = [
    {
      key: "minds",
      label: "Minds awaiting validation",
      count: mindsPending,
      icon: <Brain className="w-4 h-4 text-purple-500" />,
      href: "/dashboard/admin/settings?tab=content-validation&subtab=minds",
    },
    {
      key: "playlists",
      label: "Playlists awaiting validation",
      count: playlistsPending,
      icon: <Music2 className="w-4 h-4 text-purple-500" />,
      href: "/dashboard/admin/settings?tab=content-validation&subtab=playlists",
    },
    {
      key: "mind_experts",
      label: "Mind Expert applications",
      count: expertsPending,
      icon: <ShieldCheck className="w-4 h-4 text-purple-500" />,
      href: "/dashboard/admin/settings?tab=content-validation&subtab=mind_experts",
    },
  ];

  const pendingGroups = groups.filter((g) => g.count > 0);
  const totalPending = pendingGroups.reduce((sum, g) => sum + g.count, 0);
  const notifying = totalPending > 0;

  function toggleDropdown() {
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="relative">
      <button
        className="relative dropdown-toggle flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={toggleDropdown}
        aria-label="Notifications"
      >
        {notifying && (
          <span className="absolute -right-0.5 -top-0.5 z-10 flex h-3 w-3">
            <span className="absolute inline-flex w-full h-full bg-purple-500 rounded-full opacity-75 animate-ping" />
            <span className="relative inline-flex w-3 h-3 rounded-full bg-purple-600 shadow-[0_0_8px_2px_rgba(147,51,234,0.6)]" />
          </span>
        )}
        <Bell className="w-5 h-5" />
      </button>
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute -right-[240px] mt-[17px] flex max-h-[420px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] lg:right-0"
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Notifications
          </h5>
          <button
            onClick={toggleDropdown}
            className="text-gray-500 transition dropdown-toggle dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
        <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar gap-1">
          {pendingGroups.length === 0 ? (
            <li className="py-10 text-center text-sm text-gray-400">
              Nothing needs your attention right now.
            </li>
          ) : (
            pendingGroups.map((group) => (
              <li key={group.key}>
                <DropdownItem
                  onItemClick={closeDropdown}
                  href={group.href}
                  className="flex items-center gap-3 rounded-lg p-3 px-4 hover:bg-gray-100 dark:hover:bg-white/5"
                >
                  <span className="flex items-center justify-center w-9 h-9 rounded-full bg-purple-50 dark:bg-purple-900/20 shrink-0">
                    {group.icon}
                  </span>
                  <span className="flex-1 text-sm font-medium text-gray-800 dark:text-white/90">
                    {group.label}
                  </span>
                  <span className="flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-purple-600 text-white text-xs font-semibold">
                    {group.count}
                  </span>
                </DropdownItem>
              </li>
            ))
          )}
        </ul>
        <Link
          href="/dashboard/admin/settings?tab=content-validation"
          onClick={closeDropdown}
          className="block px-4 py-2 mt-3 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          View All Notifications
        </Link>
      </Dropdown>
    </div>
  );
}
