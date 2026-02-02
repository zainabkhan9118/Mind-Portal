import React from "react";
import {
    AudioWaveform,
    CloudRain,
    Trees,
    Waves,
    CloudLightning,
    Flame,
    Wind,
    Sparkles,
    CloudDrizzle,
    Bell
} from "lucide-react";
import { ContentItem, EnvironmentSoundItem, MindSessionItem, EnvironmentVisualItem } from "../types";

export const musicData: ContentItem[] = [
    { id: 1, title: "Header", artist: "Jane Cooper", url: "jessica.hanson@example.com", status: "Published", accessType: "Premium", uploadStatus: "Uploaded", tags: ["Relax", "Think"] },
    { id: 2, title: "Header", artist: "Wade Warren", url: "willie.jennings@example.com", status: "Scheduled", accessType: "Premium", uploadStatus: "Uploaded", tags: ["Calm", "Think"] },
    { id: 3, title: "Header", artist: "Esther Howard", url: "d.chambers@example.com", status: "Published", accessType: "Free", uploadStatus: "Pending", tags: ["Calm", "Think"] },
    { id: 4, title: "Header", artist: "Jenny Wilson", url: "willie.jennings@example.com", status: "Published", accessType: "Free", uploadStatus: "Uploaded", tags: ["Calm", "Think"] },
    { id: 5, title: "Header", artist: "Guy Hawkins", url: "michael.mitc@example.com", status: "Unpublished", accessType: "Premium", uploadStatus: "Pending", tags: ["Calm", "Think"] },
    { id: 6, title: "Header", artist: "Jacob Jones", url: "michael.mitc@example.com", status: "Unpublished", accessType: "Premium", uploadStatus: "Uploaded", tags: ["Calm", "Think"] },
    { id: 7, title: "Header", artist: "Ronald Richards", url: "deanna.curtis@example.com", status: "Scheduled", accessType: "Premium", uploadStatus: "Pending", tags: ["Calm", "Think"] },
    { id: 8, title: "Header", artist: "Devon Lane", url: "alma.lawson@example.com", status: "Scheduled", accessType: "Free", uploadStatus: "Uploaded", tags: ["Calm", "Think"] },
    { id: 9, title: "Header", artist: "Devon Lane", url: "alma.lawson@example.com", status: "Unpublished", accessType: "Free", uploadStatus: "Pending", tags: ["Calm", "Think"] },
    { id: 10, title: "Header", artist: "Jacob Jones", url: "alma.lawson@example.com", status: "Published", accessType: "Free", uploadStatus: "Pending", tags: ["Calm", "Think"] },
    { id: 11, title: "Header", artist: "Guy Hawkins", url: "alma.lawson@example.com", status: "Published", accessType: "Premium", uploadStatus: "Pending", tags: ["Calm", "Think"] },
    { id: 12, title: "Header", artist: "Guy Hawkins", url: "alma.lawson@example.com", status: "Published", accessType: "Premium", uploadStatus: "Uploaded", tags: ["Calm", "Think"] },
];

export const environmentSoundData: EnvironmentSoundItem[] = [
    { id: 1, title: "White Noise", icon: <AudioWaveform className="w-5 h-5" />, category: "Solfeggio Fre...", frequency: "174 Hz", type: "Brushing & Stro...", goal: "Relax & Unwin...", details: "MIND PLAYER...", status: "Published", accessType: "Premium", uploadStatus: "Uploaded", tags: ["Relax", "Focus"] },
    { id: 2, title: "Rainfall", icon: <CloudRain className="w-5 h-5" />, category: "Solfeggio Fre...", frequency: "174 Hz", type: "Brushing & Stro...", goal: "Relax & Unwin...", details: "Wade Warren", status: "Scheduled", accessType: "Premium", uploadStatus: "Uploaded", tags: ["Calm", "Sleep"] },
    { id: 3, title: "Forest Bird", icon: <Trees className="w-5 h-5" />, category: "Solfeggio Fre...", frequency: "174 Hz", type: "Brushing & Stro...", goal: "Relax & Unwin...", details: "Esther Howard", status: "Published", accessType: "Free", uploadStatus: "Pending", tags: ["Nature", "Calm"] },
    { id: 4, title: "Ocean Waves", icon: <Waves className="w-5 h-5" />, category: "Solfeggio Fre...", frequency: "174 Hz", type: "Brushing & Stro...", goal: "Relax & Unwin...", details: "Jenny Wilson", status: "Published", accessType: "Free", uploadStatus: "Uploaded", tags: ["Nature", "Peace"] },
    { id: 5, title: "Thunderstorm", icon: <CloudLightning className="w-5 h-5" />, category: "Solfeggio Fre...", frequency: "174 Hz", type: "Brushing & Stro...", goal: "Relax & Unwin...", details: "Guy Hawkins", status: "Unpublished", accessType: "Premium", uploadStatus: "Pending", tags: ["Intense", "Focus"] },
    { id: 6, title: "Crackling Fire", icon: <Flame className="w-5 h-5" />, category: "Solfeggio Fre...", frequency: "174 Hz", type: "Brushing & Stro...", goal: "Relax & Unwin...", details: "Jacob Jones", status: "Unpublished", accessType: "Premium", uploadStatus: "Uploaded", tags: ["Cozy", "Relax"] },
    { id: 7, title: "Mountain Air", icon: <Wind className="w-5 h-5" />, category: "Solfeggio Fre...", frequency: "174 Hz", type: "Brushing & Stro...", goal: "Relax & Unwin...", details: "Ronald Richards", status: "Scheduled", accessType: "Premium", uploadStatus: "Pending", tags: ["Nature", "Focus"] },
    { id: 8, title: "Ocean Breeze", icon: <Waves className="w-5 h-5" />, category: "Solfeggio Fre...", frequency: "174 Hz", type: "Brushing & Stro...", goal: "Relax & Unwin...", details: "Devon Lane", status: "Scheduled", accessType: "Free", uploadStatus: "Uploaded", tags: ["Nature", "Calm"] },
    { id: 9, title: "City Night", icon: <Sparkles className="w-5 h-5" />, category: "Solfeggio Fre...", frequency: "174 Hz", type: "Brushing & Stro...", goal: "Relax & Unwin...", details: "Devon Lane", status: "Unpublished", accessType: "Free", uploadStatus: "Pending", tags: ["Ambient", "Think"] },
    { id: 10, title: "Jungle Rain", icon: <CloudDrizzle className="w-5 h-5" />, category: "Solfeggio Fre...", frequency: "174 Hz", type: "Brushing & Stro...", goal: "Relax & Unwin...", details: "Jacob Jones", status: "Published", accessType: "Free", uploadStatus: "Pending", tags: ["Nature", "Calm"] },
    { id: 11, title: "Ding dong", icon: <Bell className="w-5 h-5" />, category: "Solfeggio Fre...", frequency: "174 Hz", type: "Brushing & Stro...", goal: "Relax & Unwin...", details: "Guy Hawkins", status: "Published", accessType: "Premium", uploadStatus: "Pending", tags: ["Alert", "Focus"] },
];

export const mindSessionData: MindSessionItem[] = [
    { id: 1, title: "Sacred Winds", category: "Breathwork", voice: "Tony Green", duration: "00:05:48", goal: "Focus", details: "Breathwork...", status: "Published", accessType: "Premium", uploadStatus: "Uploaded", tags: ["Breath", "Focus"] },
    { id: 2, title: "Drift into Peace", category: "Meditation", voice: "Tony Green", duration: "00:05:48", goal: "Focus", details: "A guided br...", status: "Scheduled", accessType: "Premium", uploadStatus: "Uploaded", tags: ["Peace", "Drift"] },
    { id: 3, title: "Sacred Winds", category: "Breathwork", voice: "Alamay Aq...", duration: "00:05:48", goal: "Relax & Un...", details: "A guided br...", status: "Published", accessType: "Free", uploadStatus: "Pending", tags: ["Breath", "Relax"] },
    { id: 4, title: "Echoes of the Bla...", category: "Breathwork", voice: "Tony Green", duration: "00:05:48", goal: "Focus", details: "A guided br...", status: "Published", accessType: "Free", uploadStatus: "Uploaded", tags: ["Echo", "Deep"] },
    { id: 5, title: "Neural Drift", category: "Breathwork", voice: "Alamay Aq...", duration: "00:05:48", goal: "Focus", details: "A guided br...", status: "Unpublished", accessType: "Premium", uploadStatus: "Pending", tags: ["Brain", "Focus"] },
    { id: 6, title: "Digital Stillness", category: "Breathwork", voice: "Alamay Aq...", duration: "00:05:48", goal: "Relax & Un...", details: "A guided br...", status: "Unpublished", accessType: "Premium", uploadStatus: "Uploaded", tags: ["Still", "Calm"] },
    { id: 7, title: "Through the Thre...", category: "Breathwork", voice: "Alamay Aq...", duration: "00:05:48", goal: "Relax & Un...", details: "A guided br...", status: "Scheduled", accessType: "Premium", uploadStatus: "Pending", tags: ["Portal", "Relax"] },
    { id: 8, title: "Shadow Trails", category: "Meditation", voice: "Tony Green", duration: "00:05:48", goal: "Focus", details: "A guided br...", status: "Scheduled", accessType: "Free", uploadStatus: "Uploaded", tags: ["Mystic", "Focus"] },
    { id: 9, title: "Whispers Beyond", category: "Meditation", voice: "Tony Green", duration: "00:05:48", goal: "Relax & Un...", details: "A guided br...", status: "Unpublished", accessType: "Free", uploadStatus: "Pending", tags: ["Voice", "Calm"] },
    { id: 10, title: "Gentle Horizon", category: "Meditation", voice: "Tony Green", duration: "00:05:48", goal: "Relax & Un...", details: "A guided br...", status: "Published", accessType: "Free", uploadStatus: "Pending", tags: ["Light", "Peace"] },
    { id: 11, title: "Still Thinking", category: "Meditation", voice: "Tony Green", duration: "00:05:48", goal: "Focus", details: "A guided br...", status: "Published", accessType: "Premium", uploadStatus: "Pending", tags: ["Active", "Think"] },
];

export const environmentVisualData: EnvironmentVisualItem[] = [
    { id: 1, title: "White Noise", icon: <AudioWaveform className="w-5 h-5" />, category: "Breathwork", author: "Visual Artist", goal: "Focus", details: "Breathwork Sessio...", status: "Published", accessType: "Premium", uploadStatus: "Uploaded", tags: ["Visual", "Focus"] },
    { id: 2, title: "Rainfall", icon: <CloudRain className="w-5 h-5" />, category: "Meditation", author: "Visual Artist", goal: "Focus", details: "A guided breathin...", status: "Scheduled", accessType: "Premium", uploadStatus: "Uploaded", tags: ["Art", "Relax"] },
    { id: 3, title: "Forest Birds", icon: <Trees className="w-5 h-5" />, category: "Breathwork", author: "Visual Artist", goal: "Relax & Unwind", details: "A guided breathin...", status: "Published", accessType: "Free", uploadStatus: "Pending", tags: ["Color", "Calm"] },
    { id: 4, title: "Ocean Waves", icon: <Waves className="w-5 h-5" />, category: "Breathwork", author: "Visual Artist", goal: "Focus", details: "A guided breathin...", status: "Published", accessType: "Free", uploadStatus: "Uploaded", tags: ["Flow", "Focus"] },
    { id: 5, title: "Thunderstorm", icon: <CloudLightning className="w-5 h-5" />, category: "Breathwork", author: "Visual Artist", goal: "Focus", details: "A guided breathin...", status: "Unpublished", accessType: "Premium", uploadStatus: "Pending", tags: ["Storm", "Focus"] },
    { id: 6, title: "Crackling Fire", icon: <Flame className="w-5 h-5" />, category: "Breathwork", author: "Visual Artist", goal: "Relax & Unwind", details: "A guided breathin...", status: "Unpublished", accessType: "Premium", uploadStatus: "Uploaded", tags: ["Glow", "Warm"] },
    { id: 7, title: "Mountain Wi...", icon: <Wind className="w-5 h-5" />, category: "Breathwork", author: "Visual Artist", goal: "Relax & Unwind", details: "A guided breathin...", status: "Scheduled", accessType: "Premium", uploadStatus: "Pending", tags: ["Air", "Fresh"] },
    { id: 8, title: "Ocean Breeze", icon: <Waves className="w-5 h-5" />, category: "Meditation", author: "Visual Artist", goal: "Focus", details: "A guided breathin...", status: "Scheduled", accessType: "Free", uploadStatus: "Uploaded", tags: ["Sea", "Focus"] },
    { id: 9, title: "City Night", icon: <Sparkles className="w-5 h-5" />, category: "Meditation", author: "Visual Artist", goal: "Relax & Unwind", details: "A guided breathin...", status: "Unpublished", accessType: "Free", uploadStatus: "Pending", tags: ["Lights", "Active"] },
    { id: 10, title: "Jungle Rain", icon: <CloudDrizzle className="w-5 h-5" />, category: "Meditation", author: "Visual Artist", goal: "Relax & Unwind", details: "A guided breathin...", status: "Published", accessType: "Free", uploadStatus: "Pending", tags: ["Rain", "Deep"] },
    { id: 11, title: "Ding dong Bell", icon: <Bell className="w-5 h-5" />, category: "Meditation", author: "Visual Artist", goal: "Focus", details: "A guided breathin...", status: "Published", accessType: "Premium", uploadStatus: "Pending", tags: ["Rhythm", "Focus"] },
];
