import React from 'react';
import { Modal } from '@/components/ui/modal';
import { HelpCircle } from 'lucide-react';

interface SwitchExpertModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    userName?: string;
    isLoading?: boolean;
    error?: string | null;
}

const SwitchExpertModal: React.FC<SwitchExpertModalProps> = ({ isOpen, onClose, onConfirm, userName, isLoading, error }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[480px] p-8">
            <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white">
                        <HelpCircle className="w-8 h-8" />
                    </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Are you sure you want to<br />switch{userName ? ` ${userName}` : ""} to Mind Expert?
                </h3>

                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 max-w-sm">
                    You can always switch back later. Mind Expert unlocks more detailed understanding and expert-level support.
                </p>

                {error && (
                    <p className="text-red-500 text-xs mb-4">{error}</p>
                )}

                <div className="flex gap-4 w-full mt-4">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/30 disabled:opacity-60"
                    >
                        {isLoading ? "Switching…" : "Confirm"}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default SwitchExpertModal;
