import type { CommunityGroupSession } from "@/lib/api/types";

interface SessionsTableProps {
    sessions: CommunityGroupSession[];
    emptyMessage: string;
}

const STATUS_STYLES: Record<string, string> = {
    live: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400",
    scheduled: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
    completed: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
    cancelled: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
};

export default function SessionsTable({ sessions, emptyMessage }: SessionsTableProps) {
    return (
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <th className="p-4 pl-6">Rank</th>
                    <th className="p-4">Session</th>
                    <th className="p-4">Group</th>
                    <th className="p-4">Host</th>
                    <th className="p-4 text-center min-w-[160px]">Participants</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 pr-6 text-center">Date</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-800">
                {sessions.length === 0 ? (
                    <tr>
                        <td colSpan={7} className="p-8 text-center text-gray-400 text-sm">
                            {emptyMessage}
                        </td>
                    </tr>
                ) : (
                    sessions.map((session, index) => {
                        const fill = session.max_participants
                            ? Math.min((session.participants_count / session.max_participants) * 100, 100)
                            : null;
                        const statusLabel = session.status ?? "—";
                        const statusClass = STATUS_STYLES[session.status ?? ""] ?? "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400";
                        const dateStr = session.scheduled_at ?? session.started_at ?? session.created_at;
                        return (
                            <tr key={session.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td className="p-4 pl-6">
                                    <span className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center text-xs font-bold">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                </td>
                                <td className="p-4 text-sm font-semibold text-gray-900 dark:text-white max-w-[200px] truncate">
                                    {session.title}
                                </td>
                                <td className="p-4 text-sm text-gray-500 dark:text-gray-400">
                                    {session.group_name ?? "—"}
                                </td>
                                <td className="p-4 text-sm text-gray-500 dark:text-gray-400">
                                    {session.host_name ?? "—"}
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2 justify-center">
                                        {fill !== null && (
                                            <div className="w-20 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden flex-shrink-0">
                                                <div
                                                    className="h-full bg-blue-500 rounded-full"
                                                    style={{ width: `${fill}%` }}
                                                />
                                            </div>
                                        )}
                                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 tabular-nums whitespace-nowrap">
                                            {session.participants_count.toLocaleString()}
                                            {session.max_participants ? `/${session.max_participants}` : ""}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-4 text-center">
                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${statusClass}`}>
                                        {statusLabel}
                                    </span>
                                </td>
                                <td className="p-4 pr-6 text-center text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(dateStr).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </td>
                            </tr>
                        );
                    })
                )}
            </tbody>
        </table>
    );
}
