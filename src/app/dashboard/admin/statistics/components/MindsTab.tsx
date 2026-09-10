"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Download } from 'lucide-react';
import analyticsApi from '@/lib/api/analyticsApi';
import type {
    MindsAnalyticsParams,
    MindsOverviewKPI,
    MindsHelpfulRateByGoal,
    MindsTopStatePathway,
    MindsStateResponseRow,
    MindDetail,
    MindStateEntryPoint,
    MindPerformanceRow,
} from '@/lib/api/types';
import MindsFilterBar from './minds/MindsFilterBar';
import MindsKpiRow from './minds/MindsKpiRow';
import HelpfulRateByGoalCard from './minds/HelpfulRateByGoalCard';
import TopStatePathwaysCard from './minds/TopStatePathwaysCard';
import StateResponseOverviewCard from './minds/StateResponseOverviewCard';
import SelectedMindPanel from './minds/SelectedMindPanel';
import MindPerformanceTable from './minds/MindPerformanceTable';

interface MindsTabProps {
    /** Jumps the parent page to the "Mind Coverage" tab, used by the "Top State Pathways" card's "See All" link. */
    onNavigateToMindCoverage?: () => void;
}

/** Builds a placeholder MindDetail from the row data we already have client-side,
 * so the detail card updates instantly on click instead of waiting on (or failing
 * to reach) `GET admin/analytics/minds/{id}/`, which doesn't exist on the backend yet. */
function fallbackDetailFromRow(row: MindPerformanceRow): MindDetail {
    return {
        id: row.id,
        name: row.name,
        image: null,
        primary_goal: row.primary_goal,
        primary_state: row.primary_state,
        primary_effect: '—',
        total_plays: row.plays,
        helpful_rate: row.helpful_rate,
    };
}

const MindsTab: React.FC<MindsTabProps> = ({ onNavigateToMindCoverage }) => {
    const [filterParams, setFilterParams] = useState<MindsAnalyticsParams>({});
    const [selectedMindId, setSelectedMindId] = useState<number | null>(null);
    const [selectedRow, setSelectedRow] = useState<MindPerformanceRow | null>(null);
    const detailSectionRef = useRef<HTMLDivElement>(null);

    const [kpi, setKpi] = useState<MindsOverviewKPI | null>(null);
    const [isKpiLoading, setIsKpiLoading] = useState(true);

    const [helpfulByGoal, setHelpfulByGoal] = useState<MindsHelpfulRateByGoal[]>([]);
    const [isHelpfulByGoalLoading, setIsHelpfulByGoalLoading] = useState(true);

    const [topPathways, setTopPathways] = useState<MindsTopStatePathway[]>([]);
    const [isTopPathwaysLoading, setIsTopPathwaysLoading] = useState(true);

    const [stateResponse, setStateResponse] = useState<MindsStateResponseRow[]>([]);
    const [isStateResponseLoading, setIsStateResponseLoading] = useState(true);

    const [performanceRows, setPerformanceRows] = useState<MindPerformanceRow[]>([]);
    const [isPerformanceLoading, setIsPerformanceLoading] = useState(true);

    const [selectedMind, setSelectedMind] = useState<MindDetail | null>(null);
    const [isMindDetailLoading, setIsMindDetailLoading] = useState(false);

    const [entryPoints, setEntryPoints] = useState<MindStateEntryPoint[]>([]);
    const [isEntryPointsLoading, setIsEntryPointsLoading] = useState(false);

    const dateKey = `${filterParams.start_date ?? ''}|${filterParams.end_date ?? ''}|${filterParams.goal_id ?? ''}|${filterParams.state_id ?? ''}|${filterParams.effect_id ?? ''}|${(filterParams.components ?? []).join(',')}`;

    // Top KPI cards
    useEffect(() => {
        setIsKpiLoading(true);
        analyticsApi.getMindsOverview(filterParams)
            .then(setKpi)
            .catch(() => setKpi(null))
            .finally(() => setIsKpiLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateKey]);

    // Helpful Rate by Goal
    useEffect(() => {
        setIsHelpfulByGoalLoading(true);
        analyticsApi.getMindsHelpfulRateByGoal(filterParams)
            .then(setHelpfulByGoal)
            .catch(() => setHelpfulByGoal([]))
            .finally(() => setIsHelpfulByGoalLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateKey]);

    // Top State Pathways
    useEffect(() => {
        setIsTopPathwaysLoading(true);
        analyticsApi.getMindsTopStatePathways({ ...filterParams, limit: 7 })
            .then(setTopPathways)
            .catch(() => setTopPathways([]))
            .finally(() => setIsTopPathwaysLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateKey]);

    // State Response Overview
    useEffect(() => {
        setIsStateResponseLoading(true);
        analyticsApi.getMindsStateResponseOverview(filterParams)
            .then(setStateResponse)
            .catch(() => setStateResponse([]))
            .finally(() => setIsStateResponseLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateKey]);

    // Mind Performance table
    useEffect(() => {
        setIsPerformanceLoading(true);
        analyticsApi.getMindsPerformance({ ...filterParams, size: 100 })
            .then((res) => {
                setPerformanceRows(res.results ?? []);
            })
            .catch(() => setPerformanceRows([]))
            .finally(() => setIsPerformanceLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateKey]);

    // Selected Mind detail + state entry points
    useEffect(() => {
        if (selectedMindId == null) { setSelectedMind(null); setEntryPoints([]); return; }
        // Clear the previous mind's full detail (image, secondary fields) right away so we
        // never show stale data from the old selection while the new one is still loading —
        // the panel falls back to the freshly-clicked row's data in the meantime.
        setSelectedMind(null);
        setEntryPoints([]);
        setIsMindDetailLoading(true);
        analyticsApi.getMindDetail(selectedMindId, filterParams)
            .then(setSelectedMind)
            .catch(() => setSelectedMind(null))
            .finally(() => setIsMindDetailLoading(false));

        setIsEntryPointsLoading(true);
        analyticsApi.getMindStateEntryPoints(selectedMindId, filterParams)
            .then(setEntryPoints)
            .catch(() => setEntryPoints([]))
            .finally(() => setIsEntryPointsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedMindId, dateKey]);

    const handleExport = () => {
        analyticsApi.exportMinds(filterParams).catch(() => {});
    };

    const handleSelectMind = (row: MindPerformanceRow) => {
        setSelectedMindId(row.id);
        setSelectedRow(row);
        detailSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleCloseDetail = () => {
        setSelectedMindId(null);
        setSelectedRow(null);
        setSelectedMind(null);
        setEntryPoints([]);
    };

    // Show the real fetched detail once it's in; until then (or if the endpoint fails),
    // fall back to what we already know from the table row so the card never looks stuck.
    const displayedMind = selectedMind ?? (selectedRow ? fallbackDetailFromRow(selectedRow) : null);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <MindsFilterBar onFilterChange={setFilterParams} />
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#9810FA] hover:bg-[#8000E0] transition-colors shrink-0"
                >
                    <Download className="w-4 h-4" />
                    Export
                </button>
            </div>

            <MindsKpiRow kpi={kpi} isLoading={isKpiLoading} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <HelpfulRateByGoalCard data={helpfulByGoal} isLoading={isHelpfulByGoalLoading} />
                <TopStatePathwaysCard data={topPathways} isLoading={isTopPathwaysLoading} onSeeAll={onNavigateToMindCoverage} />
                <StateResponseOverviewCard data={stateResponse} isLoading={isStateResponseLoading} />
            </div>

            <div ref={detailSectionRef} className="scroll-mt-6">
                <SelectedMindPanel
                    mind={displayedMind}
                    isMindLoading={isMindDetailLoading && !displayedMind}
                    isRefreshing={isMindDetailLoading}
                    entryPoints={entryPoints}
                    isEntryPointsLoading={isEntryPointsLoading}
                    onClose={handleCloseDetail}
                />
            </div>

            <MindPerformanceTable
                rows={performanceRows}
                isLoading={isPerformanceLoading}
                selectedMindId={selectedMindId}
                onSelectMind={handleSelectMind}
            />
        </div>
    );
};

export default MindsTab;
