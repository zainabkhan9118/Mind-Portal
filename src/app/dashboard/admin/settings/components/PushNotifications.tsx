'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Bell, Users, Send, CheckCircle } from 'lucide-react';
import { usersApi, settingsApi } from '@/lib/api';
import type { ApiUser, NotificationGroup } from '@/lib/api/types';

type TargetType = 'user' | 'group';

const GROUP_OPTIONS: { id: NotificationGroup; label: string; color: string }[] = [
    { id: 'all',         label: 'All Users',     color: 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600' },
    { id: 'free',        label: 'Free Users',     color: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-700' },
    { id: 'premium',     label: 'Premium',        color: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-700' },
    { id: 'mind_expert', label: 'Mind Experts',   color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700' },
    { id: 'b2b',         label: 'B2B',            color: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700' },
];

function UserSearchInput({
    value,
    onChange,
}: {
    value: ApiUser | null;
    onChange: (user: ApiUser | null) => void;
}) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<ApiUser[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    useEffect(() => {
        if (!query.trim()) { setResults([]); setIsOpen(false); return; }
        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                const res = await usersApi.getUsers({ search: query, size: 6 });
                setResults(res.results ?? []);
                setIsOpen(true);
            } catch {
                setResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 350);
        return () => clearTimeout(timer);
    }, [query]);

    if (value) {
        const name = [value.first_name, value.last_name].filter(Boolean).join(' ') || value.email;
        return (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-700">
                {value.avatar ? (
                    <img src={value.avatar} className="w-8 h-8 rounded-full object-cover" alt={name} />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-purple-200 dark:bg-purple-800 flex items-center justify-center text-purple-700 dark:text-purple-300 text-xs font-bold">
                        {name.charAt(0).toUpperCase()}
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{value.email}</p>
                </div>
                <button
                    onClick={() => { onChange(null); setQuery(''); }}
                    className="p-1 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800/50 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        );
    }

    return (
        <div className="relative" ref={ref}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="email"
                    placeholder="Search by email address..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => results.length > 0 && setIsOpen(true)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-colors"
                />
                {isSearching && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                )}
            </div>
            {isOpen && results.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">
                    {results.map((user) => {
                        const name = [user.first_name, user.last_name].filter(Boolean).join(' ') || user.email;
                        return (
                            <button
                                key={user.id}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => { onChange(user); setIsOpen(false); setQuery(''); }}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                            >
                                {user.avatar ? (
                                    <img src={user.avatar} className="w-8 h-8 rounded-full object-cover shrink-0" alt={name} />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 text-xs font-bold shrink-0">
                                        {name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                                </div>
                                <span className={`ml-auto shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium ${user.is_premium ? 'bg-orange-100 text-orange-600' : 'bg-purple-100 text-purple-600'}`}>
                                    {user.is_premium ? 'Premium' : 'Free'}
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}
            {isOpen && !isSearching && results.length === 0 && query.trim() && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg px-4 py-3 text-sm text-gray-400">
                    No users found for &ldquo;{query}&rdquo;
                </div>
            )}
        </div>
    );
}

export default function PushNotifications() {
    const [targetType, setTargetType] = useState<TargetType>('group');
    const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null);
    const [selectedGroup, setSelectedGroup] = useState<NotificationGroup>('all');

    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const canSend = () => {
        if (!title.trim() || !body.trim()) return false;
        if (targetType === 'user' && !selectedUser) return false;
        return true;
    };

    const handleSend = async () => {
        if (!canSend()) return;
        setIsLoading(true);
        setError(null);
        setSuccess(false);
        try {
            if (targetType === 'user' && selectedUser) {
                await usersApi.notifyUser(selectedUser.id, {
                    title: title.trim(),
                    message: body.trim(),
                });
            } else {
                await settingsApi.sendNotification({
                    title: title.trim(),
                    body: body.trim(),
                    target_group: selectedGroup,
                });
            }
            setSuccess(true);
            setTitle('');
            setBody('');
            setSelectedUser(null);
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { error?: { message?: string } } } })
                ?.response?.data?.error?.message;
            setError(msg ?? 'Failed to send notification. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl space-y-6">
            <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Push Notifications</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Send or schedule push notifications to specific users or groups.
                </p>
            </div>

            {success && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-400">
                    <CheckCircle className="w-5 h-5 shrink-0" />
                    <span className="text-sm font-medium">
                        Notification sent successfully.
                    </span>
                </div>
            )}

            {error && (
                <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 text-sm">
                    {error}
                </div>
            )}

            {/* ── Audience ── */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-purple-600" />
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Audience</h3>
                </div>

                {/* Target type toggle */}
                <div className="flex gap-3">
                    {(['group', 'user'] as TargetType[]).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTargetType(t)}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                                targetType === t
                                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-purple-300'
                            }`}
                        >
                            {t === 'group' ? 'Group of Users' : 'Specific User'}
                        </button>
                    ))}
                </div>

                {targetType === 'group' && (
                    <div className="space-y-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Select target group:</p>
                        <div className="flex flex-wrap gap-2">
                            {GROUP_OPTIONS.map((g) => (
                                <button
                                    key={g.id}
                                    onClick={() => setSelectedGroup(g.id)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                                        selectedGroup === g.id
                                            ? g.color + ' ring-2 ring-offset-1 ring-purple-400'
                                            : 'bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    {g.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {targetType === 'user' && (
                    <div className="space-y-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Search by email address:</p>
                        <UserSearchInput value={selectedUser} onChange={setSelectedUser} />
                    </div>
                )}
            </div>

            {/* ── Message ── */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                    <Bell className="w-4 h-4 text-purple-600" />
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Message</h3>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Title <span className="text-red-400">*</span></label>
                    <input
                        type="text"
                        placeholder="e.g. New session available"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={65}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-colors"
                    />
                    <p className="text-xs text-gray-400 text-right">{title.length}/65</p>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Message <span className="text-red-400">*</span></label>
                    <textarea
                        placeholder="Write your notification message..."
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        maxLength={200}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-colors resize-none"
                    />
                    <p className="text-xs text-gray-400 text-right">{body.length}/200</p>
                </div>

                {/* Preview */}
                {(title || body) && (
                    <div className="mt-2 p-4 rounded-xl bg-gray-900 text-white space-y-1 text-left">
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Preview</p>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center shrink-0">
                                <Bell className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold leading-tight">{title || 'Notification title'}</p>
                                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{body || 'Message body'}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Send button ── */}
            <button
                onClick={handleSend}
                disabled={!canSend() || isLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-purple-600 text-white font-semibold text-sm hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                    <Send className="w-4 h-4" />
                )}
                {isLoading ? 'Sending…' : 'Send Notification'}
            </button>
        </div>
    );
}
