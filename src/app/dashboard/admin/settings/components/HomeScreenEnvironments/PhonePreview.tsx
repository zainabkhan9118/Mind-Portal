import React from "react";
import { Smartphone, Volume2, VolumeX, Target, Leaf, Moon, TrendingUp, Menu, ChevronLeft, ChevronRight } from "lucide-react";

const GOAL_CHIPS = [
    { label: "Focus", icon: Target },
    { label: "Relax", icon: Leaf },
    { label: "Sleep", icon: Moon },
    { label: "Productivity", icon: TrendingUp },
];

interface PhonePreviewProps {
    visualImage: string;
    soundNames: string[];
    isMuted: boolean;
    onToggleMute: () => void;
    volume: number;
    onVolumeChange: (volume: number) => void;
    /** When more than one saved environment is checked, the real app rotates through
     * whichever ones are active each login — these let the admin step through each
     * checked one here instead of only ever previewing the first. */
    currentIndex: number;
    totalCount: number;
    onPrev: () => void;
    onNext: () => void;
}

/** Live mockup of the app's real Home Screen, so admins can sanity-check a visual
 * (text legibility, cropping) before publishing instead of having to publish and
 * check the live app. The parent only renders this once there's actually something
 * to preview — a composer-selected visual, or a checked saved environment. */
const PhonePreview: React.FC<PhonePreviewProps> = ({
    visualImage,
    soundNames,
    isMuted,
    onToggleMute,
    volume,
    onVolumeChange,
    currentIndex,
    totalCount,
    onPrev,
    onNext,
}) => {
    const hasSound = soundNames.length > 0;
    const hasMultiple = totalCount > 1;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-8 space-y-5 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Smartphone className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Preview</h2>
                </div>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-300 text-[10px] font-bold uppercase tracking-wider rounded-full">Live</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                See how this looks on the Home Screen before you publish.
                {hasMultiple && ` Environment ${currentIndex + 1} of ${totalCount}.`}
            </p>

            <div className="mx-auto w-[220px]">
                <div className="relative aspect-[9/19.5] rounded-[2rem] border-[6px] border-gray-900 bg-black overflow-hidden shadow-xl">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-4 bg-gray-900 rounded-b-xl z-20" />

                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={visualImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/70" />

                    {hasMultiple && (
                        <>
                            <button type="button" onClick={onPrev}
                                className="absolute left-1 top-1/2 -translate-y-1/2 z-30 w-6 h-6 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button type="button" onClick={onNext}
                                className="absolute right-1 top-1/2 -translate-y-1/2 z-30 w-6 h-6 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </>
                    )}

                    <div className="absolute inset-0 flex flex-col p-3 pt-7">
                        <div className="flex items-center gap-1.5 bg-black/40 rounded-full pl-1.5 pr-2 py-1 self-start">
                            <button type="button" onClick={onToggleMute} disabled={!hasSound}
                                className="w-4 h-4 flex items-center justify-center text-white shrink-0 disabled:opacity-50">
                                {hasSound && !isMuted ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                            </button>
                            {hasSound && (
                                <input type="range" min={0} max={100} step={1} value={volume} disabled={isMuted}
                                    onChange={(e) => onVolumeChange(Number(e.target.value))}
                                    className="w-12 h-1 accent-white cursor-pointer disabled:opacity-40" />
                            )}
                        </div>

                        <h3 className="text-white font-bold text-[13px] leading-tight mt-3">
                            What do you need right now?
                        </h3>

                        <div className="flex gap-1.5 mt-3">
                            {GOAL_CHIPS.map(({ label, icon: Icon }) => (
                                <div key={label} className="flex-1 min-w-0 bg-white/10 rounded-lg py-1.5 flex flex-col items-center gap-0.5">
                                    <Icon className="w-3 h-3 text-white" />
                                    <span className="text-[6px] font-medium text-white/90 truncate">{label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                            <span className="text-[8px] font-semibold text-white">Continue your journey</span>
                            <span className="text-[7px] text-white/70">See all</span>
                        </div>
                        <div className="flex gap-1.5 mt-1.5">
                            {[0, 1].map((i) => (
                                <div key={i} className="flex-1 aspect-[4/5] rounded-lg bg-gradient-to-br from-purple-500/40 to-indigo-500/40 border border-white/10" />
                            ))}
                        </div>

                        <div className="flex-1" />

                        <div className="mb-1 rounded-full bg-black/40 flex items-center justify-between px-2.5 py-1.5">
                            <span className="text-[7px] font-semibold text-white">Mind Player</span>
                            <Menu className="w-2.5 h-2.5 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {hasSound && (
                <p className="text-[11px] text-gray-400 text-center">
                    🔊 {soundNames.join(", ")}
                </p>
            )}
        </div>
    );
};

export default PhonePreview;
