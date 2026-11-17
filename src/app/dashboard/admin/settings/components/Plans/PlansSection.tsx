"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Check, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import monetizationApi from "@/lib/api/monetizationApi";
import { getApiErrorMessage } from "@/lib/api/errors";
import type { SubscriptionPlan } from "@/lib/api/types";
import { ConfirmDeleteModal } from "@/components/ui/modal/ConfirmDeleteModal";
import PlanFormModal, { planFeatures } from "./PlanFormModal";

const money = (amount: string | null | undefined, currency?: string) =>
    amount != null && amount !== "" ? `${currency?.toUpperCase() === "EUR" ? "€" : currency?.toUpperCase() === "USD" || !currency ? "$" : `${currency} `}${amount}` : null;

/** Admin-managed subscription plans: prices, launch offer and the "what's included" list. */
const PlansSection: React.FC<{ className?: string }> = ({ className }) => {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState<SubscriptionPlan | null>(null);
    const [deleting, setDeleting] = useState<SubscriptionPlan | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const load = useCallback(() => {
        setIsLoading(true);
        setLoadError(null);
        monetizationApi.getPlans({ size: 50 })
            .then(res => setPlans(res.results ?? []))
            .catch(err => setLoadError(getApiErrorMessage(err, "Could not load subscription plans.")))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleDelete = async () => {
        if (!deleting) return;
        setIsDeleting(true);
        setDeleteError(null);
        try {
            await monetizationApi.deletePlan(deleting.id);
            setDeleting(null);
            load();
        } catch (err) {
            setDeleteError(getApiErrorMessage(err, "Failed to delete the plan."));
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <section className={className}>
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Subscription plans</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">The plans and prices users see in the app, including the launch offer and what each plan includes.</p>
                </div>
                <button
                    onClick={() => { setEditing(null); setFormOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#9810FA] hover:bg-[#8000E0] text-white text-sm font-semibold"
                >
                    <Plus className="w-4 h-4" /> New plan
                </button>
            </div>

            {isLoading ? (
                <div className="py-10 text-center text-gray-400"><Loader2 className="w-5 h-5 animate-spin inline" /></div>
            ) : loadError ? (
                <p className="text-sm text-red-500">{loadError}</p>
            ) : plans.length === 0 ? (
                <div className="rounded-xl border border-dashed border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-900/10 p-5 text-sm text-amber-700 dark:text-amber-400">
                    No plans yet, so the app can&apos;t show prices. Click <span className="font-semibold">New plan</span> to add Premium (e.g. $12.99/month, $69.99/year, launch offer $59.99/year for the first 250).
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {plans.map(p => {
                        const features = planFeatures(p.features);
                        const limit = p.launch_offer_limit ?? 0;
                        const claimed = p.launch_offer_claimed_count ?? 0;
                        const pct = limit ? Math.min(100, Math.round((claimed / limit) * 100)) : 0;
                        const yearly = money(p.price_yearly, p.currency);
                        return (
                            <div key={p.id} className="rounded-2xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-gray-900 dark:text-white truncate">{p.name}</h3>
                                            <span className="px-2 py-0.5 rounded-full text-xs font-medium capitalize bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300">{p.tier}</span>
                                            {!p.is_active && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">Inactive</span>}
                                        </div>
                                        {p.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{p.description}</p>}
                                    </div>
                                    <div className="flex gap-1 shrink-0">
                                        <button onClick={() => { setEditing(p); setFormOpen(true); }} title="Edit" className="p-2 rounded-lg text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"><Pencil className="w-4 h-4" /></button>
                                        <button onClick={() => { setDeleteError(null); setDeleting(p); }} title="Delete" className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                                    <span className="text-xl font-bold text-gray-900 dark:text-white">{money(p.price_monthly, p.currency)}<span className="text-sm font-normal text-gray-500">/month</span></span>
                                    {yearly && <span className="text-sm text-gray-600 dark:text-gray-300">or {yearly}/year</span>}
                                </div>

                                {limit > 0 && (
                                    <div className="space-y-1.5">
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            Launch offer: <span className="font-semibold">{money(p.launch_offer_price_yearly, p.currency)}/year</span> for the first {limit.toLocaleString()}
                                        </p>
                                        <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                                            <div className="h-full bg-purple-600 rounded-full" style={{ width: `${pct}%` }} />
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{claimed.toLocaleString()} / {limit.toLocaleString()} claimed · {(p.launch_offer_remaining ?? Math.max(0, limit - claimed)).toLocaleString()} left</p>
                                    </div>
                                )}

                                {features.length > 0 && (
                                    <ul className="space-y-1">
                                        {features.slice(0, 6).map((f, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"><Check className="w-4 h-4 mt-0.5 text-green-500 shrink-0" />{f}</li>
                                        ))}
                                        {features.length > 6 && <li className="text-xs text-gray-400 pl-6">+{features.length - 6} more</li>}
                                    </ul>
                                )}

                                <p className="text-xs text-gray-400">{p.subscriber_count ?? 0} subscribers{p.stripe_price_id ? "" : " · No Stripe price ID yet"}</p>
                            </div>
                        );
                    })}
                </div>
            )}

            <PlanFormModal isOpen={formOpen} plan={editing} onClose={() => setFormOpen(false)} onSaved={load} />
            <ConfirmDeleteModal
                isOpen={deleting !== null}
                title={`Delete "${deleting?.name ?? ""}"?`}
                message={deleteError ?? ((deleting?.subscriber_count ?? 0) > 0
                    ? `${deleting?.subscriber_count} users are subscribed to this plan. Consider marking it inactive instead, so it's hidden from new users.`
                    : "The plan will be removed from the app. This can't be undone.")}
                confirmText="Delete plan"
                isLoading={isDeleting}
                onConfirm={handleDelete}
                onClose={() => !isDeleting && setDeleting(null)}
            />
        </section>
    );
};

export default PlansSection;
