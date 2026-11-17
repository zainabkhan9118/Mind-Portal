import React from "react";

export type ContentStatus = "Published" | "Scheduled" | "Unpublished" | "Unknown";
export type AccessType = "Premium" | "Free";
export type UploadStatus = "Uploaded" | "Pending";

export interface ContentItem {
    id: number;
    title: string;
    /** Cover image (or icon for Minds) shown as the row thumbnail. */
    coverUrl?: string | null;
    artist: string;
    url: string;
    state?: string | null;
    effect?: string | null;
    status: ContentStatus;
    accessType: AccessType;
    uploadStatus: UploadStatus;
    tags: string[];
}

export interface EnvironmentSoundItem {
    id: number;
    title: string;
    /** Cover image (or icon for Minds) shown as the row thumbnail. */
    coverUrl?: string | null;
    icon: React.ReactNode;
    category: string;
    frequency: string;
    type: string;
    goal: string;
    details: string;
    state?: string | null;
    effect?: string | null;
    status: Exclude<ContentStatus, "Unknown">;
    accessType: AccessType;
    uploadStatus: UploadStatus;
    tags: string[];
}

export interface MindSessionItem {
    id: number;
    title: string;
    /** Cover image (or icon for Minds) shown as the row thumbnail. */
    coverUrl?: string | null;
    category: string;
    voice: string;
    duration: string;
    goal: string;
    details: string;
    state?: string | null;
    effect?: string | null;
    status: Exclude<ContentStatus, "Unknown">;
    accessType: AccessType;
    uploadStatus: UploadStatus;
    tags: string[];
}

export interface MindItem {
    id: number;
    title: string;
    /** Cover image (or icon for Minds) shown as the row thumbnail. */
    coverUrl?: string | null;
    description: string;
    goals: string;
    author: string;
    state?: string | null;
    effect?: string | null;
    status: Exclude<ContentStatus, "Unknown">;
    accessType: AccessType;
    tags: string[];
}

export interface EnvironmentVisualItem {
    id: number;
    title: string;
    /** Cover image (or icon for Minds) shown as the row thumbnail. */
    coverUrl?: string | null;
    icon: React.ReactNode;
    category: string;
    author: string;
    goal: string;
    details: string;
    state?: string | null;
    effect?: string | null;
    status: Exclude<ContentStatus, "Unknown">;
    accessType: AccessType;
    uploadStatus: UploadStatus;
    tags: string[];
}
