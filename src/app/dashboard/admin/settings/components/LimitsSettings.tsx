"use client";
import React, { useEffect, useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import accessLevelsApi from "@/lib/api/accessLevelsApi";
import monetizationApi from "@/lib/api/monetizationApi";
import { getApiErrorMessage } from "@/lib/api/errors";
import type { AILimitTier, AILimitsSettings, SubscriptionPlan } from "@/lib/api/types";

const AI_FIELDS: { key: keyof AILimitTier; label: string; hint: string }[] = [
    { key: "hourly", label: "Per hour", hint: "Interactions" },
    { key: "daily", label: "Per day", hint: "Interactions" },
    { key: "monthly", label: "Per month", hint: "Interactions" },
    { key: "max_input_chars", label: "Max message length", hint: "Characters" },
    { key: "max_response_chars", label: "Max reply length", hint: "Characters" },
];

const card = "bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 space-y-5";
const saveBtn = "flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#9810FA] hover:bg-[#8000E0] text-white text-sm font-semibold disabled:opacity-50";

type SaveState = { saving: boolean; saved: boolean; error: string | null };
const idle: SaveState = { saving: false, saved: false, error: null };

const SaveRow: React.FC<{ state: SaveState; onSave: () => void; disabled?: boolean }> = ({ state, onSave, disabled }) => (
    <div className="flex flex-wrap items-center gap-3">
        <button onClick={onSave} disabled={state.saving || disabled} className={saveBtn}>
            {state.saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Save
        </button>
        {state.saved && <span className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400"><CheckCircle className="w-4 h-4" /> Saved</span>}
        {state.error && <span className="text-sm text-red-500">{state.error}</span>}
    </div>
);

/** Admin Control → Limits: Free Mind limit, AI Mind Coach limits, launch offer progress. */
const LimitsSettings: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    const [mindLimit, setMindLimit] = useState("");
    const [mindState, setMindState] = useState<SaveState>(idle);

    const [ai, setAi] = useState<Record<"free" | "premium", Record<keyof AILimitTier, string>> | null>(null);
    const [aiState, setAiState] = useState<SaveState>(idle);

    const [plans, setPlans] = useState<SubscriptionPlan[] | null>(null);

    useEffect(() => {
        const toStrings = (t: AILimitTier) => Object.fromEntries(AI_FIELDS.map(f => [f.key, String(t?.[f.key] ?? "")])) as Record<keyof AILimitTier, string>;
        Promise.all([
            accessLevelsApi.getGeneralSettings(),
            accessLevelsApi.getAiLimits(),
            monetizationApi.getPlans({ size: 50 }).then(r => r.results ?? []).catch(() => null),
        ])
            .then(([general, limits, planList]) => {
                setMindLimit(general.free_mind_limit != null ? String(general.free_mind_limit) : "");
                setAi({ free: toStrings(limits.free), premium: toStrings(limits.premium) });
                setPlans(planList);
            })
            .catch(err => setLoadError(getApiErrorMessage(err, "Could not load limits.")))
            .finally(() => setIsLoading(false));
    }, []);

    const saveMindLimit = async () => {
        if (!/^\d+$/.test(mindLimit)) { setMindState({ ...idle, error: "Enter a whole number (0 or more)." }); return; }
        setMindState({ ...idle, saving: true });
        try {
            // PUT replaces the whole object, so send the latest feature flags back with it
            const current = await accessLevelsApi.getGeneralSettings();
            await accessLevelsApi.updateGeneralSettings({ ...current, free_mind_limit: Number(mindLimit) });
            setMindState({ ...idle, saved: true });
        } catch (err) {
            setMindState({ ...idle, error: getApiErrorMessage(err, "Failed to save.") });
        }
    };

    const saveAi = async () => {
        if (!ai) return;
        const payload = {} as AILimitsSettings;
        for (const tier of ["free", "premium"] as const) {
            const t = {} as AILimitTier;
            for (const f of AI_FIELDS) {
                const v = ai[tier][f.key];
                const min = f.key.startsWith("max_") ? 1 : 0;
                if (!/^\d+$/.test(v) || Number(v) < min) {
                    setAiState({ ...idle, error: `${tier === "free" ? "Free" : "Premium"} → ${f.label}: enter a whole number${min ? " of at least 1" : ""}.` });
                    return;
                }
                t[f.key] = Number(v);
            }
            payload[tier] = t;
        }
        setAiState({ ...idle, saving: true });
        try {
            await accessLevelsApi.updateAiLimits(payload);
            setAiState({ ...idle, saved: true });
        } catch (err) {
            setAiState({ ...idle, error: getApiErrorMessage(err, "Failed to save.") });
        }
    };

    if (isLoading) return <div className="py-20 text-center text-gray-400"><Loader2 className="w-5 h-5 animate-spin inline" /></div>;
    if (loadError) return <p className="py-20 text-center text-red-500">{loadError}</p>;

    const launchPlans = (plans ?? []).filter(p => (p.launch_offer_limit ?? 0) > 0);

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Free Mind limit */}
            <section className={card}>
                <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Free Mind limit</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">How many personal Minds a Free user can save. Premium users have no limit. Changes apply in the app straight away.</p>
                </div>
                <div className="max-w-[200px]">
                    <Label htmlFor="free-mind-limit">Minds per Free user</Label>
                    <Input id="free-mind-limit" type="number" min="0" value={mindLimit} onChange={e => { setMindLimit(e.target.value); setMindState(idle); }} />
                </div>
                <SaveRow state={mindState} onSave={saveMindLimit} />
            </section>

            {/* AI limits */}
            {ai && (
                <section className={card}>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">AI Mind Coach limits</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            One interaction = one message that gets an AI reply. Set Free to 0 to keep the AI Coach Premium-only.
                            Client access levels and individual users can override these.
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-xs text-gray-500 uppercase tracking-wider">
                                    <th className="py-2 pr-4 text-left font-semibold">Plan</th>
                                    {AI_FIELDS.map(f => (
                                        <th key={f.key} className="py-2 px-2 text-left font-semibold whitespace-nowrap">
                                            {f.label}<span className="block normal-case font-normal text-gray-400">{f.hint}</span>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {(["free", "premium"] as const).map(tier => (
                                    <tr key={tier}>
                                        <td className="py-2 pr-4 font-semibold text-gray-900 dark:text-white capitalize">{tier}</td>
                                        {AI_FIELDS.map(f => (
                                            <td key={f.key} className="py-2 px-2 min-w-[110px]">
                                                <Input
                                                    type="number"
                                                    min={f.key.startsWith("max_") ? "1" : "0"}
                                                    value={ai[tier][f.key]}
                                                    onChange={e => { const v = e.target.value; setAi(prev => prev && ({ ...prev, [tier]: { ...prev[tier], [f.key]: v } })); setAiState(idle); }}
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <SaveRow state={aiState} onSave={saveAi} />
                </section>
            )}

            {/* Launch offer */}
            <section className={card}>
                <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Launch offer</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Discounted annual price for the first subscribers of a plan.</p>
                </div>
                {plans === null ? (
                    <p className="text-sm text-red-500">Could not load subscription plans.</p>
                ) : plans.length === 0 ? (
                    <p className="text-sm text-amber-600 dark:text-amber-400">
                        No subscription plans are set up yet, so the app can&apos;t show prices. Plans (Premium Monthly / Annual and the launch offer) need to be created first.
                    </p>
                ) : launchPlans.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">None of the {plans.length} plans has a launch offer configured.</p>
                ) : (
                    <div className="space-y-4">
                        {launchPlans.map(p => {
                            const limit = p.launch_offer_limit ?? 0;
                            const claimed = p.launch_offer_claimed_count ?? 0;
                            const pct = limit ? Math.min(100, Math.round((claimed / limit) * 100)) : 0;
                            return (
                                <div key={p.id} className="space-y-2">
                                    <div className="flex flex-wrap justify-between gap-2 text-sm">
                                        <span className="font-semibold text-gray-900 dark:text-white">{p.name}</span>
                                        <span className="text-gray-500 dark:text-gray-400">
                                            {p.launch_offer_price_yearly ? `${p.launch_offer_price_yearly} ${p.currency?.toUpperCase() ?? ""}/year instead of ${p.price_yearly ?? "—"}` : ""}
                                        </span>
                                    </div>
                                    <div className="h-2.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                                        <div className="h-full bg-purple-600 rounded-full" style={{ width: `${pct}%` }} />
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        <span className="font-semibold">{claimed.toLocaleString()} / {limit.toLocaleString()}</span> claimed · {(p.launch_offer_remaining ?? Math.max(0, limit - claimed)).toLocaleString()} left
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
};

export default LimitsSettings;
