import type { CommunityGroup } from "@/lib/api/types";
import SelectCheckbox from "@/components/common/SelectCheckbox";

interface GroupsTableProps {
    groups: CommunityGroup[];
    emptyMessage: string;
    selectedIds?: Set<number>;
    onToggleSelect?: (id: number) => void;
    onToggleSelectAll?: (ids: number[]) => void;
}

export default function GroupsTable({ groups, emptyMessage, selectedIds, onToggleSelect, onToggleSelectAll }: GroupsTableProps) {
    const selectable = !!selectedIds && !!onToggleSelect && !!onToggleSelectAll;
    const selectedCount = selectable ? groups.filter(g => selectedIds!.has(g.id)).length : 0;
    const allSelected = groups.length > 0 && selectedCount === groups.length;
    return (
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {selectable && (
                        <th className="p-4 pl-6 w-10">
                            <SelectCheckbox
                                label="Select all groups shown"
                                checked={allSelected}
                                indeterminate={selectedCount > 0 && !allSelected}
                                onChange={() => onToggleSelectAll!(groups.map(g => g.id))}
                            />
                        </th>
                    )}
                    <th className={selectable ? "p-4" : "p-4 pl-6"}>Rank</th>
                    <th className="p-4">Group Name</th>
                    <th className="p-4 text-center">Members</th>
                    <th className="p-4 text-center">Created</th>
                    <th className="p-4 pr-6 text-center">Status</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-800">
                {groups.length === 0 ? (
                    <tr>
                        <td colSpan={selectable ? 6 : 5} className="p-8 text-center text-gray-400 text-sm">
                            {emptyMessage}
                        </td>
                    </tr>
                ) : (
                    groups.map((group, index) => (
                        <tr
                            key={group.id}
                            className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${selectable && selectedIds!.has(group.id) ? "bg-purple-50/60 dark:bg-purple-900/10" : ""}`}
                        >
                            {selectable && (
                                <td className="p-4 pl-6 w-10">
                                    <SelectCheckbox
                                        label={`Select ${group.name}`}
                                        checked={selectedIds!.has(group.id)}
                                        onChange={() => onToggleSelect!(group.id)}
                                    />
                                </td>
                            )}
                            <td className={selectable ? "p-4" : "p-4 pl-6"}>
                                <span className="w-8 h-8 rounded-full bg-[#9810FA]/10 text-[#9810FA] flex items-center justify-center text-xs font-bold">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                            </td>
                            <td className="p-4 text-sm font-semibold text-gray-900 dark:text-white">
                                {group.name}
                            </td>
                            <td className="p-4 text-center text-sm text-gray-600 dark:text-gray-400">
                                {group.members_count.toLocaleString()}
                            </td>
                            <td className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                {new Date(group.created_at).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </td>
                            <td className="p-4 pr-6 text-center">
                                {group.is_hidden ? (
                                    <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-[#F2F4F7] text-[#344054] dark:bg-gray-700 dark:text-gray-400">
                                        Hidden
                                    </span>
                                ) : (
                                    <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-[#ECFDF3] text-[#027A48] dark:bg-green-900/20 dark:text-green-400">
                                        Active
                                    </span>
                                )}
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
}
