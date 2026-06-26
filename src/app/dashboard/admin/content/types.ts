import React from "react";

export type ContentStatus = "Published" | "Scheduled" | "Unpublished" | "Unknown";
export type AccessType = "Premium" | "Free";
export type UploadStatus = "Uploaded" | "Pending";

export interface ContentItem {
    id: number;
    title: string;
    artist: string;
    url: string;
    state: string;
    effect: string;
    status: ContentStatus;
    accessType: AccessType;
    uploadStatus: UploadStatus;
    tags: string[];
}

export interface EnvironmentSoundItem {
    id: number;
    title: string;
    icon: React.ReactNode;
    category: string;
    frequency: string;
    type: string;
    goal: string;
    details: string;
    state: string;
    effect: string;
    status: Exclude<ContentStatus, "Unknown">;
    accessType: AccessType;
    uploadStatus: UploadStatus;
    tags: string[];
}

export interface MindSessionItem {
    id: number;
    title: string;
    category: string;
    voice: string;
    duration: string;
    goal: string;
    details: string;
    state: string;
    effect: string;
    status: Exclude<ContentStatus, "Unknown">;
    accessType: AccessType;
    uploadStatus: UploadStatus;
    tags: string[];
}

export interface EnvironmentVisualItem {
    id: number;
    title: string;
    icon: React.ReactNode;
    category: string;
    author: string;
    goal: string;
    details: string;
    state: string;
    effect: string;
    status: Exclude<ContentStatus, "Unknown">;
    accessType: AccessType;
    uploadStatus: UploadStatus;
    tags: string[];
}
