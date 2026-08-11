"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();

  const [firstName, setFirstName] = useState(user?.first_name ?? "");
  const [lastName, setLastName] = useState(user?.last_name ?? "");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nameInitials = (user?.first_name?.[0] ?? "") + (user?.last_name?.[0] ?? "");
  const initials = nameInitials.length > 0 ? nameInitials : (user?.email?.[0]?.toUpperCase() ?? "A");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError(null);
    try {
      await updateProfile({ first_name: firstName.trim(), last_name: lastName.trim() });
      setSuccess(true);
    } catch {
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Profile</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your account information
        </p>
      </div>

      {/* Avatar + meta */}
      <div className="flex items-center gap-4 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
        <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-700 dark:text-purple-300 text-2xl font-bold select-none">
          {initials}
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-800 dark:text-white">
            {user?.name ?? "Admin"}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
          <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 capitalize">
            {user?.role ?? "admin"}
          </span>
        </div>
      </div>

      {/* Edit form */}
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-5"
      >
        <h2 className="text-base font-semibold text-gray-800 dark:text-white">
          Personal Information
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              value={user?.email ?? ""}
              disabled
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-sm text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400">Email cannot be changed here.</p>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
        {success && (
          <p className="text-sm text-green-600 dark:text-green-400">Profile updated successfully.</p>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-lg bg-[#9810FA] text-white text-sm font-medium hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
