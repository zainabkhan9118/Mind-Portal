"use client";
import React, { useState, useRef } from "react";
import { Camera, Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import globalApi from "@/lib/api/globalApi";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();

  const [firstName, setFirstName] = useState(user?.first_name ?? "");
  const [lastName, setLastName] = useState(user?.last_name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar ?? null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);

  const initials = ((user?.first_name?.[0] ?? "") + (user?.last_name?.[0] ?? "")).toUpperCase()
    || (user?.email?.[0]?.toUpperCase() ?? "A");

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setProfileSuccess(false);
    setProfileError(null);
    try {
      const form = new FormData();
      form.append("first_name", firstName.trim());
      form.append("last_name", lastName.trim());
      form.append("email", email.trim());
      if (avatarFile) form.append("avatar", avatarFile);
      await updateProfile(form);
      setAvatarFile(null);
      setProfileSuccess(true);
    } catch {
      setProfileError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setChangingPw(true);
    setPwSuccess(false);
    setPwError(null);
    try {
      await globalApi.setPassword(user.id, password);
      setPassword("");
      setPwSuccess(true);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: { details?: { message: string }[] } } } })
        ?.response?.data?.error?.details?.[0]?.message;
      setPwError(msg ?? "Failed to change password. Please try again.");
    } finally {
      setChangingPw(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Profile</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your account information</p>
      </div>

      {/* Avatar card */}
      <div className="flex items-center gap-5 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-700 dark:text-purple-300 text-2xl font-bold select-none">
            {avatarPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
            ) : initials}
          </div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#9810FA] text-white flex items-center justify-center shadow-md hover:bg-[#8000E0] transition-colors"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-800 dark:text-white">{user?.name ?? "Admin"}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
          <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 capitalize">
            {user?.role ?? "admin"}
          </span>
          {avatarFile && (
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">{avatarFile.name} — click Save to upload</p>
          )}
        </div>
      </div>

      {/* Personal info form */}
      <form
        onSubmit={handleProfileSave}
        className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-5"
      >
        <h2 className="text-base font-semibold text-gray-800 dark:text-white">Personal Information</h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {profileError && <p className="text-sm text-red-500">{profileError}</p>}
        {profileSuccess && <p className="text-sm text-green-600 dark:text-green-400">Profile updated successfully.</p>}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#9810FA] text-white text-sm font-medium hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>

      {/* Password change form */}
      <form
        onSubmit={handlePasswordChange}
        className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-5"
      >
        <h2 className="text-base font-semibold text-gray-800 dark:text-white">Change Password</h2>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="At least 8 characters, not entirely numeric"
              className="w-full px-3.5 py-2.5 pr-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(p => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {pwError && <p className="text-sm text-red-500">{pwError}</p>}
        {pwSuccess && <p className="text-sm text-green-600 dark:text-green-400">Password changed successfully.</p>}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={changingPw || password.length < 8}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#9810FA] text-white text-sm font-medium hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {changingPw && <Loader2 className="w-4 h-4 animate-spin" />}
            {changingPw ? "Changing…" : "Change Password"}
          </button>
        </div>
      </form>
    </div>
  );
}
