// src/components/adminDashboard/ContentDropdown.tsx
"use client";
import React, { useState } from "react";
import { Music, Volume, Brain, Globe, ListMusic, MessageCircle, UploadCloud, Star, CalendarClock } from "lucide-react";
import { useRouter } from "next/navigation";

const contentOptions = [
  { label: "Music", value: "/dashboard/admin/content/music", icon: <Music className="w-5 h-5" /> },
  { label: "Sounds", value: "/dashboard/admin/content/sounds", icon: <Volume className="w-5 h-5" /> },
  { label: "Mind Sessions", value: "/dashboard/admin/content/sessions", icon: <Brain className="w-5 h-5" /> },
  { label: "VR Environments", value: "/dashboard/admin/content/vr", icon: <Globe className="w-5 h-5" /> },
  { label: "Subliminal Messages", value: "/dashboard/admin/content/environments/sounds", icon: <MessageCircle className="w-5 h-5" /> },
  { label: "Playlists", value: "/dashboard/admin/content/playlists", icon: <ListMusic className="w-5 h-5" /> },
  { label: "Publish/Unpublish", value: "/dashboard/admin/content/publish", icon: <UploadCloud className="w-5 h-5" /> },
  { label: "Premium/Free", value: "/dashboard/admin/content/premium", icon: <Star className="w-5 h-5" /> },
  { label: "Schedule Release", value: "/dashboard/admin/content/schedule", icon: <CalendarClock className="w-5 h-5" /> },
];

export default function ContentDropdown() {
  const router = useRouter();
  const [selected, setSelected] = useState(contentOptions[0].value);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelected(e.target.value);
    router.push(e.target.value);
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="content-dropdown" className="font-semibold text-gray-700 dark:text-gray-200">Content Type:</label>
      <select
        id="content-dropdown"
        value={selected}
        onChange={handleChange}
        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
      >
        {contentOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {/* Optionally show icon for selected */}
      <span className="ml-2">
        {contentOptions.find((o) => o.value === selected)?.icon}
      </span>
    </div>
  );
}
