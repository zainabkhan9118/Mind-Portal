import { Modal } from "@/components/ui/modal";
import type { CommunityGroupSession } from "@/lib/api/types";
import SessionsTable from "./SessionsTable";
import SearchInput from "./SearchInput";

interface SessionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    sessions: CommunityGroupSession[];
    searchTerm: string;
    onSearchChange: (value: string) => void;
}

export default function SessionsModal({ isOpen, onClose, sessions, searchTerm, onSearchChange }: SessionsModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-5xl m-4">
            <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden p-6 space-y-5">
                <div className="flex items-center justify-between gap-4 pr-10">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">All Group Sessions</h2>
                    <SearchInput
                        value={searchTerm}
                        onChange={onSearchChange}
                        placeholder="Search sessions..."
                        className="w-64"
                    />
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                    <div className="max-h-[65vh] overflow-y-auto">
                        <SessionsTable sessions={sessions} emptyMessage="No sessions found" />
                    </div>
                </div>
            </div>
        </Modal>
    );
}
