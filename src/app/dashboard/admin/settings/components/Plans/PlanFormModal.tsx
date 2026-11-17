"use client";
import React, { useEffect, useState } from "react";
import { ChevronDown, Loader2, Plus, X } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import monetizationApi from "@/lib/api/monetizationApi";
import { getApiErrorMessage } from "@/lib/api/errors";
import type { SubscriptionPlan, SubscriptionTier } from "@/lib/api/types";

interface Props {
    isOpen: boolean;
    /** null = create a new plan */
    plan: SubscriptionPlan | null;
    onClose: () => void;
    onSaved: () => void;
}

const PRICE_RE = /^\d{1,8}(\.\d{1,2})?$/;

const AI_FIELDS = [
    { key: "ai_hourly_limit", label: "Per hour" },
    { key: "ai_daily_limit", label: "Per day" },
    { key: "ai_monthly_limit", label: "Per month" },
    { key: "ai_max_input_chars", label: "Max message (chars)" },
    { key: "ai_max_response_chars", label: "Max reply (chars)" },
] as const;
type AiKey = typeof AI_FIELDS[number]["key"];

const selectClass =
    "w-full h-11 pl-4 pr-10 appearance-none rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent dark:bg-gray-900 text-sm text-gray-800 dark:text-white/90 focus:outline-hidden focus:ring-3 focus:ring-purple-500/20";

/** Plan features are stored as free JSON; the dashboard keeps them as a list of lines. */
export function planFeatures(features: unknown): string[] {
    if (Array.isArray(features)) return features.map(f => (typeof f === "string" ? f : JSON.stringify(f)));
    if (features && typeof features === "object") return Object.keys(features as object);
    return [];
}

const PlanFormModal: React.FC<Props> = ({ isOpen, plan, onClose, onSaved }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [tier, setTier] = useState<SubscriptionTier>("premium");
    const [currency, setCurrency] = useState("USD");
    const [priceMonthly, setPriceMonthly] = useState("");
    const [priceYearly, setPriceYearly] = useState("");
    const [launchLimit, setLaunchLimit] = useState("");
    const [launchPrice, setLaunchPrice] = useState("");
    const [features, setFeatures] = useState<string[]>([]);
    const [newFeature, setNewFeature] = useState("");
    const [stripePriceId, setStripePriceId] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [ai, setAi] = useState<Record<AiKey, string>>({ ai_hourly_limit: "", ai_daily_limit: "", ai_monthly_limit: "", ai_max_input_chars: "", ai_max_response_chars: "" });
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) return;
        setName(plan?.name ?? "");
        setDescription(plan?.description ?? "");
        setTier(plan?.tier ?? "premium");
        setCurrency(plan?.currency?.toUpperCase() ?? "USD");
        setPriceMonthly(plan?.price_monthly ?? "");
        setPriceYearly(plan?.price_yearly ?? "");
        setLaunchLimit(plan?.launch_offer_limit ? String(plan.launch_offer_limit) : "");
        setLaunchPrice(plan?.launch_offer_price_yearly ?? "");
        setFeatures(planFeatures(plan?.features));
        setNewFeature("");
        setStripePriceId(plan?.stripe_price_id ?? "");
        setIsActive(plan?.is_active ?? true);
        setAi(Object.fromEntries(AI_FIELDS.map(f => [f.key, plan?.[f.key] != null ? String(plan[f.key]) : ""])) as Record<AiKey, string>);
        setShowAdvanced(false);
        setError(null);
    }, [isOpen, plan]);

    const addFeature = () => {
        const f = newFeature.trim();
        if (!f) return;
        setFeatures(prev => [...prev, f]);
        setNewFeature("");
    };
    const moveFeature = (i: number, dir: -1 | 1) => setFeatures(prev => {
        const j = i + dir;
        if (j < 0 || j >= prev.length) return prev;
        const next = [...prev];
        [next[i], next[j]] = [next[j], next[i]];
        return next;
    });

    const handleSave = async () => {
        if (!name.trim()) { setError("Please enter a plan name."); return; }
        if (!/^[A-Za-z]{3}$/.test(currency.trim())) { setError("Currency must be a 3-letter code, e.g. USD or EUR."); return; }
        if (!PRICE_RE.test(priceMonthly.trim())) { setError("Enter the monthly price as a number, e.g. 12.99 (0 for free)."); return; }
        if (priceYearly.trim() && !PRICE_RE.test(priceYearly.trim())) { setError("Enter the yearly price as a number, e.g. 69.99, or leave it empty."); return; }
        const hasLaunch = launchLimit.trim() !== "" && launchLimit.trim() !== "0";
        if (launchLimit.trim() && !/^\d+$/.test(launchLimit.trim())) { setError("The launch offer limit must be a whole number."); return; }
        if (hasLaunch) {
            if (!priceYearly.trim()) { setError("A launch offer needs a yearly price to discount."); return; }
            if (!PRICE_RE.test(launchPrice.trim())) { setError("Enter the launch offer yearly price, e.g. 59.99."); return; }
            if (Number(launchPrice) >= Number(priceYearly)) { setError("The launch offer price should be lower than the normal yearly price."); return; }
        }
        for (const f of AI_FIELDS) {
            if (ai[f.key] !== "" && !/^\d+$/.test(ai[f.key])) { setError(`AI limit "${f.label}" must be a whole number, or left empty.`); return; }
        }
        setError(null);
        setIsSaving(true);
        const pendingFeature = newFeature.trim();
        const payload: Partial<SubscriptionPlan> = {
            name: name.trim(),
            description: description.trim(),
            tier,
            currency: currency.trim().toUpperCase(),
            price_monthly: priceMonthly.trim(),
            price_yearly: priceYearly.trim() || null,
            trial_days: 0, // no free trial (client's pricing)
            features: pendingFeature ? [...features, pendingFeature] : features,
            stripe_price_id: stripePriceId.trim(),
            is_active: isActive,
            launch_offer_limit: hasLaunch ? Number(launchLimit) : 0,
            launch_offer_price_yearly: hasLaunch ? launchPrice.trim() : null,
        };
        AI_FIELDS.forEach(f => { payload[f.key] = ai[f.key] === "" ? null : Number(ai[f.key]); });
        try {
            if (plan) await monetizationApi.updatePlan(plan.id, payload);
            else await monetizationApi.createPlan(payload);
            onSaved();
            onClose();
        } catch (err) {
            setError(getApiErrorMessage(err, "Failed to save the plan."));
        } finally {
            setIsSaving(false);
        }
    };

    const monthlyEquivalent = priceYearly && PRICE_RE.test(priceYearly) ? (Number(priceYearly) / 12).toFixed(2) : null;

    return (
        <Modal isOpen={isOpen} onClose={() => !isSaving && onClose()} className="max-w-[640px] m-4">
            <div className="flex flex-col bg-white dark:bg-gray-900 rounded-3xl p-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{plan ? "Edit plan" : "New plan"}</h2>

                <div className="space-y-6 overflow-y-auto max-h-[65vh] pr-2 custom-scrollbar">
                    {/* Basics */}
                    <section className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="plan-name">Plan name <span className="text-red-500">*</span></Label>
                                <Input id="plan-name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Premium" />
                            </div>
                            <div>
                                <Label htmlFor="plan-tier">Type</Label>
                                <div className="relative">
                                    <select id="plan-tier" value={tier} onChange={e => setTier(e.target.value as SubscriptionTier)} className={selectClass}>
                                        <option value="free">Free</option>
                                        <option value="premium">Premium</option>
                                        <option value="enterprise">Enterprise</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="plan-desc">Short description</Label>
                            <textarea
                                id="plan-desc"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                rows={2}
                                placeholder="e.g. Unlock the complete Mind Player experience."
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent dark:bg-gray-900 px-4 py-2.5 text-sm text-gray-800 dark:text-white/90 focus:outline-hidden focus:ring-3 focus:ring-purple-500/20"
                            />
                        </div>
                    </section>

                    {/* Pricing */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Pricing</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="plan-currency">Currency</Label>
                                <Input id="plan-currency" value={currency} onChange={e => setCurrency(e.target.value.toUpperCase().slice(0, 3))} placeholder="USD" />
                            </div>
                            <div>
                                <Label htmlFor="plan-monthly">Monthly price <span className="text-red-500">*</span></Label>
                                <Input id="plan-monthly" value={priceMonthly} onChange={e => setPriceMonthly(e.target.value)} placeholder="12.99" />
                            </div>
                            <div>
                                <Label htmlFor="plan-yearly">Yearly price</Label>
                                <Input id="plan-yearly" value={priceYearly} onChange={e => setPriceYearly(e.target.value)} placeholder="69.99" />
                            </div>
                        </div>
                        {monthlyEquivalent && <p className="text-xs text-gray-400">Yearly works out to {monthlyEquivalent} {currency}/month.</p>}
                        <p className="text-xs text-gray-400">No free trial is applied to plans.</p>
                    </section>

                    {/* Launch offer */}
                    <section className="space-y-4">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Launch offer (optional)</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">A discounted yearly price for the first subscribers. Leave empty for no offer.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="plan-launch-limit">First how many yearly subscribers</Label>
                                <Input id="plan-launch-limit" type="number" min="0" value={launchLimit} onChange={e => setLaunchLimit(e.target.value)} placeholder="250" />
                            </div>
                            <div>
                                <Label htmlFor="plan-launch-price">Launch yearly price</Label>
                                <Input id="plan-launch-price" value={launchPrice} onChange={e => setLaunchPrice(e.target.value)} placeholder="59.99" />
                            </div>
                        </div>
                        {plan && (plan.launch_offer_claimed_count ?? 0) > 0 && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">{plan.launch_offer_claimed_count} already claimed.</p>
                        )}
                    </section>

                    {/* Features */}
                    <section className="space-y-3">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">What&apos;s included</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">The list of benefits shown for this plan, in this order.</p>
                        </div>
                        {features.length > 0 && (
                            <ul className="space-y-2">
                                {features.map((f, i) => (
                                    <li key={`${f}-${i}`} className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2">
                                        <input
                                            value={f}
                                            onChange={e => setFeatures(prev => prev.map((x, k) => (k === i ? e.target.value : x)))}
                                            className="flex-1 bg-transparent text-sm text-gray-800 dark:text-white/90 outline-none"
                                        />
                                        <button type="button" onClick={() => moveFeature(i, -1)} disabled={i === 0} className="px-1 text-gray-400 hover:text-gray-700 disabled:opacity-30" aria-label="Move up">↑</button>
                                        <button type="button" onClick={() => moveFeature(i, 1)} disabled={i === features.length - 1} className="px-1 text-gray-400 hover:text-gray-700 disabled:opacity-30" aria-label="Move down">↓</button>
                                        <button type="button" onClick={() => setFeatures(prev => prev.filter((_, k) => k !== i))} className="p-1 text-gray-400 hover:text-red-500" aria-label="Remove">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className="flex gap-2">
                            <input
                                value={newFeature}
                                onChange={e => setNewFeature(e.target.value)}
                                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addFeature(); } }}
                                placeholder="e.g. Full Music library"
                                className="flex-1 h-11 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent dark:bg-gray-900 px-4 text-sm text-gray-800 dark:text-white/90 focus:outline-hidden focus:ring-3 focus:ring-purple-500/20"
                            />
                            <button type="button" onClick={addFeature} className="flex items-center gap-1.5 px-4 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                                <Plus className="w-4 h-4" /> Add
                            </button>
                        </div>
                    </section>

                    <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="mt-0.5 w-4 h-4 accent-purple-600" />
                        <span>
                            <span className="block text-sm font-medium text-gray-900 dark:text-white">Active</span>
                            <span className="block text-xs text-gray-500 dark:text-gray-400">Only active plans are shown in the app.</span>
                        </span>
                    </label>

                    {/* Advanced */}
                    <section className="border-t border-gray-100 dark:border-gray-800 pt-4">
                        <button type="button" onClick={() => setShowAdvanced(v => !v)} className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-200">
                            <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? "" : "-rotate-90"}`} />
                            Advanced: payment ID and AI limits
                        </button>
                        {showAdvanced && (
                            <div className="mt-4 space-y-4">
                                <div>
                                    <Label htmlFor="plan-stripe">Stripe price ID</Label>
                                    <Input id="plan-stripe" value={stripePriceId} onChange={e => setStripePriceId(e.target.value)} placeholder="price_..." />
                                    <p className="text-xs text-gray-400 mt-1">From the Stripe dashboard. Needed for checkout to charge this plan.</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">AI Mind Coach limits for this plan. Leave empty to use the defaults on the Limits tab.</p>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {AI_FIELDS.map(f => (
                                            <div key={f.key}>
                                                <Label htmlFor={`plan-${f.key}`}>{f.label}</Label>
                                                <Input id={`plan-${f.key}`} type="number" min="0" value={ai[f.key]} onChange={e => setAi(prev => ({ ...prev, [f.key]: e.target.value }))} placeholder="Default" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                </div>

                {error && <p className="text-sm text-red-500 mt-4">{error}</p>}

                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <button onClick={onClose} disabled={isSaving} className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50">
                        Cancel
                    </button>
                    <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#9810FA] hover:bg-[#8000E0] text-white font-semibold disabled:opacity-50">
                        {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                        {plan ? "Save changes" : "Create plan"}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default PlanFormModal;
