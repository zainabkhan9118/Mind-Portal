import { Modal } from "@/components/ui/modal";
import type { CommunityGroup } from "@/lib/api/types";
import GroupsTable from "./GroupsTable";
import SearchInput from "./SearchInput";

interface GroupsModalProps {
    isOpen: boolean;
    onClose: () => void;
    groups: CommunityGroup[];
    searchTerm: string;
    onSearchChange: (value: string) => void;
}

export default function GroupsModal({ isOpen, onClose, groups, searchTerm, onSearchChange }: GroupsModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl m-4">
            <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden p-6 space-y-5">
                <div className="flex items-center justify-between gap-4 pr-10">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">All Community Groups</h2>
                    <SearchInput
                        value={searchTerm}
                        onChange={onSearchChange}
                        placeholder="Search groups..."
                        className="w-64"
                    />
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                    <div className="max-h-[65vh] overflow-y-auto">
                        <GroupsTable groups={groups} emptyMessage="No groups found" />
                    </div>
                </div>
            </div>
        </Modal>
    );
}
