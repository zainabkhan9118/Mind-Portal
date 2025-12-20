export interface User {
    id: string;
    name: string;
    email: string;
    joined: string;
    access: UserAccess;
    type: UserType;
    avatar?: string;
}

export type UserType = 'Music' | '360' | 'VR' | 'Sound' | 'Free';
export type UserAccess = 'Premium' | 'Free';

export interface KPI {
    label: string;
    value: string;
    change: string; // e.g., "+12.5% this month"
    changeType: 'positive' | 'negative' | 'neutral';
    icon: React.ReactNode;
    iconClassName?: string;
    subText?: string; // e.g. "Above avg. of 125"
}

// For charts
export interface ChartDataPoint {
    x: string | number;
    y: number;
}
