'use client';
import React, { useEffect, useState } from 'react';
import { ChevronDown, KeyRound, Loader2, Mail, Receipt, Trash2 } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import { monetizationApi, usersApi } from '@/lib/api';
import accessLevelsApi, { accessLevelIds } from '@/lib/api/accessLevelsApi';
import { getApiErrorMessage } from '@/lib/api/errors';
import { isPastDay, todayLocal } from '@/lib/dates';
import type { AccessLevel, ApiUser, Transaction } from '@/lib/api/types';

interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: ApiUser | null;
    onSaved: () => void;
}

type Duration = 'keep' | '1w' | '1m' | '1y' | 'custom';

const DURATION_OPTIONS: { value: Duration; label: string }[] = [
    { value: '1w', label: '1 week' },
    { value: '1m', label: '1 month' },
    { value: '1y', label: '1 year' },
    { value: 'custom', label: 'Custom end date' },
];

const selectClass =
    'w-full h-11 pl-4 pr-10 appearance-none rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent dark:bg-gray-900 text-sm text-gray-800 dark:text-white/90 focus:outline-hidden focus:ring-3 focus:ring-purple-500/20';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** End of premium for a preset duration, counted from now. */
function computeExpiry(duration: Duration, customDate: string): string | null | undefined {
    const d = new Date();
    switch (duration) {
        case 'keep': return undefined; // don't send — leave as-is
        case '1w': d.setDate(d.getDate() + 7); return d.toISOString();
        case '1m': d.setMonth(d.getMonth() + 1); return d.toISOString();
        case '1y': d.setFullYear(d.getFullYear() + 1); return d.toISOString();
        case 'custom': return customDate ? new Date(`${customDate}T23:59:59`).toISOString() : null;
    }
}

const formatDate = (iso?: string | null) =>
    iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

const txnStatusClass: Record<string, string> = {
    completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    refunded: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, user, onSaved }) => {
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [isPremium, setIsPremium] = useState(false);
    const [duration, setDuration] = useState<Duration>('1m');
    const [customDate, setCustomDate] = useState('');
    const [clientLevels, setClientLevels] = useState<number[]>([]);
    const [allLevels, setAllLevels] = useState<AccessLevel[]>([]);

    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [confirmDelete, setConfirmDelete] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [resetState, setResetState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [txnLoading, setTxnLoading] = useState(false);
    const [txnError, setTxnError] = useState<string | null>(null);

    const currentExpiry = user?.premium_expires_at ?? user?.subscription?.expires_at ?? null;

    // Populate form whenever a user is opened
    useEffect(() => {
        if (!isOpen || !user) return;
        setUsername(user.username ?? '');
        setFirstName(user.first_name ?? '');
        setLastName(user.last_name ?? '');
        setEmail(user.email ?? '');
        setIsPremium(user.is_premium);
        setDuration(user.is_premium ? 'keep' : '1m');
        setCustomDate('');
        setClientLevels(accessLevelIds(user.access_levels));
        setError(null);
        setResetState('idle');
        setConfirmDelete(false);
    }, [isOpen, user]);

    // Custom access levels (client groups) for the picker
    useEffect(() => {
        if (!isOpen) return;
        accessLevelsApi.listAll().then(setAllLevels).catch(err => console.error('Failed to load access levels:', err));
    }, [isOpen]);

    // Payment history — only relevant for users who are currently premium
    useEffect(() => {
        if (!isOpen || !user?.is_premium) { setTransactions([]); return; }
        let cancelled = false;
        setTxnLoading(true);
        setTxnError(null);
        monetizationApi
            .getTransactions({ user: user.id, size: 50 })
            .then(res => { if (!cancelled) setTransactions(res.results ?? []); })
            .catch(() => { if (!cancelled) setTxnError('Could not load payment history.'); })
            .finally(() => { if (!cancelled) setTxnLoading(false); });
        return () => { cancelled = true; };
    }, [isOpen, user]);

    const handleSendReset = async () => {
        if (!user) return;
        setResetState('sending');
        try {
            await usersApi.sendPasswordReset(user.id);
            setResetState('sent');
        } catch {
            setResetState('error');
        }
    };

    const handleSave = async () => {
        if (!user) return;
        if (!email.trim() || !EMAIL_RE.test(email.trim())) { setError('Please enter a valid email address.'); return; }
        if (isPremium && duration === 'custom') {
            if (!customDate) { setError('Please pick an end date for premium access.'); return; }
            if (isPastDay(customDate)) { setError('The premium end date can\'t be a day that has already ended.'); return; }
        }
        setError(null);
        setIsSaving(true);
        try {
            const payload: Parameters<typeof usersApi.updateUser>[1] = {
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                email: email.trim(),
                is_premium: isPremium,
            };
            if (username.trim() !== (user.username ?? '')) payload.username = username.trim();
            const original = accessLevelIds(user.access_levels);
            const levelsChanged = original.length !== clientLevels.length || original.some(id => !clientLevels.includes(id));
            if (levelsChanged) payload.access_levels = clientLevels;
            if (isPremium) {
                const expiry = computeExpiry(duration, customDate);
                if (expiry !== undefined) payload.premium_expires_at = expiry;
            } else if (user.is_premium) {
                payload.premium_expires_at = null;
            }
            await usersApi.updateUser(user.id, payload);
            onSaved();
            onClose();
        } catch (err: unknown) {
            setError(getApiErrorMessage(err, 'Failed to save changes. Please try again.'));
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!user) return;
        setIsDeleting(true);
        setError(null);
        try {
            await usersApi.deleteUser(user.id);
            onSaved();
            onClose();
        } catch (err) {
            setError(getApiErrorMessage(err, 'Failed to delete user. Please try again.'));
            setConfirmDelete(false);
        } finally {
            setIsDeleting(false);
        }
    };

    if (!user) return null;
    const displayName = [user.first_name, user.last_name].filter(Boolean).join(' ') || user.email;

    const durationOptions = user.is_premium
        ? [{ value: 'keep' as Duration, label: `Keep current (${currentExpiry ? `until ${formatDate(currentExpiry)}` : 'no end date'})` }, ...DURATION_OPTIONS]
        : DURATION_OPTIONS;

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[640px] m-4">
            <div className="flex flex-col w-full bg-white dark:bg-gray-900 rounded-3xl p-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Edit User</h2>

                <div className="space-y-8 overflow-y-auto max-h-[65vh] pr-2 custom-scrollbar">
                    {/* Profile */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Profile</h3>
                        <div>
                            <Label htmlFor="edit-username">Username</Label>
                            <Input id="edit-username" value={username} onChange={e => setUsername(e.target.value)} placeholder="username" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="edit-first-name">First name</Label>
                                <Input id="edit-first-name" value={firstName} onChange={e => setFirstName(e.target.value)} />
                            </div>
                            <div>
                                <Label htmlFor="edit-last-name">Last name</Label>
                                <Input id="edit-last-name" value={lastName} onChange={e => setLastName(e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="edit-email">Email <span className="text-red-500">*</span></Label>
                            <Input id="edit-email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                    </section>

                    {/* Password */}
                    <section className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Password</h3>
                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                onClick={handleSendReset}
                                disabled={resetState === 'sending'}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors"
                            >
                                {resetState === 'sending' ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                                Send password reset email
                            </button>
                            {resetState === 'sent' && (
                                <span className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400">
                                    <Mail className="w-4 h-4" /> Sent to {user.email}
                                </span>
                            )}
                            {resetState === 'error' && <span className="text-sm text-red-500">Failed to send. Please try again.</span>}
                        </div>
                        <p className="text-xs text-gray-400">Emails {user.email} a one-time link to create a new password. The link expires after 24 hours.</p>
                    </section>

                    {/* Access */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Access</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="edit-access">Access level</Label>
                                <div className="relative">
                                    <select id="edit-access" value={isPremium ? 'premium' : 'free'} onChange={e => setIsPremium(e.target.value === 'premium')} className={selectClass}>
                                        <option value="free">Free</option>
                                        <option value="premium">Premium</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                            {isPremium && (
                                <div>
                                    <Label htmlFor="edit-duration">Duration</Label>
                                    <div className="relative">
                                        <select id="edit-duration" value={duration} onChange={e => setDuration(e.target.value as Duration)} className={selectClass}>
                                            {durationOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            )}
                        </div>
                        {isPremium && duration === 'custom' && (
                            <div className="sm:w-1/2 sm:ml-auto sm:pl-2">
                                <Label htmlFor="edit-custom-date">Premium until</Label>
                                <Input id="edit-custom-date" type="date" value={customDate} onChange={e => setCustomDate(e.target.value)} min={todayLocal()} />
                            </div>
                        )}
                        {isPremium && duration !== 'keep' && duration !== 'custom' && (
                            <p className="text-xs text-gray-400">Premium until {formatDate(computeExpiry(duration, ''))}.</p>
                        )}

                        <div className="space-y-2">
                            <Label>Client access levels</Label>
                            {allLevels.length === 0 ? (
                                <p className="text-xs text-gray-400">No client access levels yet. Create them in Admin Control → Access Levels.</p>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {allLevels
                                        .filter(l => l.is_active !== false || clientLevels.includes(l.id))
                                        .map(l => {
                                            const on = clientLevels.includes(l.id);
                                            const expired = !!l.expires_at && new Date(l.expires_at) <= new Date();
                                            return (
                                                <button
                                                    key={l.id}
                                                    type="button"
                                                    onClick={() => setClientLevels(prev => on ? prev.filter(x => x !== l.id) : [...prev, l.id])}
                                                    className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${on
                                                        ? 'bg-purple-600 border-purple-600 text-white'
                                                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                                                >
                                                    {l.name}{expired ? ' (expired)' : l.is_active === false ? ' (inactive)' : ''}
                                                </button>
                                            );
                                        })}
                                </div>
                            )}
                            <p className="text-xs text-gray-400">Members get Free content plus the content assigned to these levels (and Premium, if the level includes it).</p>
                        </div>
                    </section>

                    {/* Payment history */}
                    {user.is_premium && (
                        <section className="space-y-3">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <Receipt className="w-4 h-4 text-purple-600" /> Payment History
                            </h3>
                            {txnLoading ? (
                                <div className="flex items-center gap-2 text-sm text-gray-400 py-4"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div>
                            ) : txnError ? (
                                <p className="text-sm text-red-500">{txnError}</p>
                            ) : transactions.length === 0 ? (
                                <p className="text-sm text-gray-400 py-2">No payments found — premium may have been granted manually.</p>
                            ) : (
                                <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50 dark:bg-gray-800 text-xs text-gray-500 uppercase tracking-wider">
                                            <tr>
                                                <th className="px-4 py-2.5 text-left font-semibold">Date</th>
                                                <th className="px-4 py-2.5 text-left font-semibold">Amount</th>
                                                <th className="px-4 py-2.5 text-left font-semibold">Status</th>
                                                <th className="px-4 py-2.5 text-left font-semibold">Provider</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                            {transactions.map(t => (
                                                <tr key={t.id}>
                                                    <td className="px-4 py-2.5 text-gray-600 dark:text-gray-300 whitespace-nowrap">{formatDate(t.created_at)}</td>
                                                    <td className="px-4 py-2.5 text-gray-900 dark:text-white font-medium whitespace-nowrap">{t.amount} {t.currency?.toUpperCase()}</td>
                                                    <td className="px-4 py-2.5">
                                                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${txnStatusClass[t.status] ?? txnStatusClass.refunded}`}>{t.status}</span>
                                                    </td>
                                                    <td className="px-4 py-2.5 text-gray-600 dark:text-gray-300 capitalize">{t.payment_provider || '—'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>
                    )}
                </div>

                {error && <p className="text-sm text-red-500 mt-4">{error}</p>}

                {confirmDelete ? (
                    <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                        <p className="text-sm text-red-600 dark:text-red-400">
                            Delete <span className="font-semibold">{displayName}</span>? They&apos;ll lose access to the app.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setConfirmDelete(false)}
                                disabled={isDeleting}
                                className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold disabled:opacity-50 transition-colors"
                            >
                                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                                Yes, delete user
                            </button>
                        </div>
                    </div>
                ) : (
                <div className="flex justify-between gap-3 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <button
                        onClick={() => setConfirmDelete(true)}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-red-600 dark:text-red-400 font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete user
                    </button>
                    <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isSaving}
                        className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#9810FA] hover:bg-[#8000E0] text-white font-semibold shadow-lg shadow-purple-500/20 disabled:opacity-50 transition-colors"
                    >
                        {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                        Save Changes
                    </button>
                    </div>
                </div>
                )}
            </div>
        </Modal>
    );
};

export default EditUserModal;
