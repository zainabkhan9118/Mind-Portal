"use client";
import React, { useState } from "react";
import {
    Image as ImageIcon,
    Volume2,
    Plus,
    Save,
    Trash2,
    ArrowRight,
    Check,
    CloudRain,
    Music,
    Trees,
    AudioWaveform,
    Activity,
    Upload,
    LayoutGrid,
    Monitor,
    Brain,
    Layers,
    VolumeX
} from "lucide-react";

const visualEnvironments = [
    { id: 1, name: "Serene Beach Sunset", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=300&h=200" },
    { id: 2, name: "Mountain Peak", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=300&h=200" },
    { id: 3, name: "Deep Forest", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=300&h=200" },
    { id: 4, name: "Urban Night", image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=300&h=200" },
    { id: 5, name: "Desert Dunes", image: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&q=80&w=300&h=200" },
    { id: 6, name: "Arctic Aurora", image: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&q=80&w=300&h=200" },
];

const ambientSounds = [
    { id: 1, name: "Rain on Roof", category: "Nature", icon: <CloudRain className="w-5 h-5" /> },
    { id: 2, name: "Soft Piano", category: "Music", icon: <Music className="w-5 h-5" /> },
    { id: 3, name: "Forest Birds", category: "Nature", icon: <Trees className="w-5 h-5" /> },
    { id: 4, name: "White Noise", category: "Ambience", icon: <AudioWaveform className="w-5 h-5" /> },
    { id: 5, name: "Theta Waves", category: "Binaural", icon: <Activity className="w-5 h-5" />, hasVolume: true },
];

export default function HomeScreenEnvironments() {
    const [selectedVisual, setSelectedVisual] = useState(3); // Deep Forest
    const [selectedSounds, setSelectedSounds] = useState<number[]>([5]); // Theta Waves
    const [activeEnvironments, setActiveEnvironments] = useState<number[]>([1]); // Serene Beach Sunset

    const toggleSound = (id: number) => {
        setSelectedSounds(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const toggleEnvironment = (id: number) => {
        setActiveEnvironments(prev =>
            prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
        );
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1: Select Visual Environment */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-8 space-y-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                            <ImageIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Select Visual Environment</h2>
                    </div>
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 text-[10px] font-bold uppercase tracking-wider rounded-full">Step 1</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Choose a 360° panoramic image</p>

                <div className="grid grid-cols-2 gap-4 pt-4">
                    {visualEnvironments.map((env) => (
                        <button
                            key={env.id}
                            onClick={() => setSelectedVisual(env.id)}
                            className={`group relative aspect-[1.4/1] rounded-2xl overflow-hidden transition-all duration-300 ${selectedVisual === env.id
                                ? 'ring-4 ring-purple-600 ring-offset-2 dark:ring-offset-gray-800 scale-[1.02]'
                                : 'hover:scale-[1.02]'
                                }`}
                        >
                            <img src={env.image} alt={env.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                            <span className="absolute bottom-3 left-3 text-[11px] font-semibold text-white tracking-tight leading-none">{env.name}</span>
                        </button>
                    ))}
                    <button className="aspect-[1.4/1] rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-purple-600 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-all flex flex-col items-center justify-center gap-3 group">
                        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl group-hover:bg-white dark:group-hover:bg-purple-900/30 transition-colors shadow-sm">
                            <Upload className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
                        </div>
                        <span className="text-[11px] font-bold text-gray-500 group-hover:text-purple-600 uppercase tracking-widest">Upload New</span>
                    </button>
                </div>
            </div>

            {/* Column 2: Select Ambient Sounds */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-8 space-y-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                            <Volume2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Select Ambient Sounds</h2>
                    </div>
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 text-[10px] font-bold uppercase tracking-wider rounded-full">Step 2</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Layer sounds and adjust volumes to create the perfect atmosphere.</p>

                <div className="space-y-4 pt-4">
                    {ambientSounds.map((sound) => (
                        <div key={sound.id} className="p-1 transition-all">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedSounds.includes(sound.id)}
                                        onChange={() => toggleSound(sound.id)}
                                        className="w-5 h-5 rounded-md border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-purple-600 transition-all cursor-pointer"
                                    />
                                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl text-gray-400 group-hover:text-purple-600 transition-colors">
                                        {sound.icon}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">{sound.name}</p>
                                        <p className="text-xs text-gray-400 font-medium">{sound.category}</p>
                                    </div>
                                </div>

                                {sound.hasVolume && selectedSounds.includes(sound.id) && (
                                    <div className="flex items-center gap-2 flex-1 max-w-[120px]">
                                        <VolumeX className="w-3.5 h-3.5 text-gray-400" />
                                        <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full relative">
                                            <div className="absolute left-0 top-0 h-full w-[60%] bg-purple-600 rounded-full" />
                                            <div className="absolute left-[60%] top-1/2 -translate-y-1/2 w-4 h-4 bg-purple-600 border-2 border-white dark:border-gray-800 rounded-full shadow-lg" />
                                        </div>
                                        <Volume2 className="w-3.5 h-3.5 text-gray-400" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-8 space-y-4">
                    <p className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">Choose from Your Sounds</p>
                    <button className="w-full py-4 px-6 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-purple-600 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-all flex items-center justify-center gap-3 group">
                        <div className="p-1.5 bg-gray-900 dark:bg-gray-700 rounded-lg text-white">
                            <Plus className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-bold text-gray-500 group-hover:text-purple-600">Add New</span>
                    </button>
                </div>
            </div>

            {/* Column 3: Create & Summary */}
            <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-8 space-y-4 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Brain className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create Environment</h2>
                        </div>
                        <span className="px-3 py-1 bg-purple-100/50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 text-[10px] font-bold uppercase tracking-wider rounded-full">Step 3</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Review your composition and Save this Environment</p>

                    <div className="border-t border-gray-100 dark:border-gray-700 my-2" />

                    <div className="p-8 bg-gray-50/50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-6">
                        <div className="flex items-center gap-3 text-gray-900 dark:text-white font-bold text-sm">
                            <Layers className="w-5 h-5" />
                            <span className="font-bold">Composition Summary</span>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-8 flex items-center justify-center min-h-[120px]">
                            <p className="text-sm text-gray-400 font-medium">No environment selected yet</p>
                        </div>

                        <div className="space-y-2">
                            <p className="text-[13px] text-gray-500 font-medium">Active Sounds ( <span className="mx-4 text-gray-900 dark:text-white">0</span>)</p>
                            <p className="text-[13px] text-gray-400 mt-1">No sounds added</p>
                        </div>
                    </div>

                    <button className="w-full py-4 px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] mt-2">
                        <Save className="w-5 h-5" />
                        Save this Environment
                        <ArrowRight className="w-5 h-5 ml-auto" />
                    </button>
                </div>

                {/* Your Screen Environments */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-8 space-y-8 shadow-sm">
                    <div className="flex justify-center border-b-2 border-purple-600 pb-4 relative">
                        <div className="flex items-center gap-3">
                            <Monitor className="w-6 h-6 text-purple-600" />
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Screen Environments</h2>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {visualEnvironments.slice(0, 4).filter((_, i) => i % 3 === 0).map((env, idx) => (
                            <div key={env.id} className="flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <input
                                        type="checkbox"
                                        checked={idx === 0}
                                        onChange={() => { }}
                                        className="w-5 h-5 rounded-md border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-purple-600 transition-all cursor-pointer"
                                    />
                                    <img src={env.image} alt="" className="w-14 h-10 rounded-xl object-cover shadow-md" />
                                    <span className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">{env.name}</span>
                                </div>
                                <button className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>

                    <button className="w-full py-4 px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] shadow-[0_4px_20px_rgba(147,51,234,0.3)] mt-4">
                        <Activity className="w-5 h-5" />
                        Save Home Screen Environments
                    </button>
                </div>
            </div>
        </div>
    );
}
