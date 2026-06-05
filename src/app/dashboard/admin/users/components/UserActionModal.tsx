'use client';
import React from 'react';
import { Modal } from '@/components/ui/modal';
import { ShieldAlert, ShieldX, ShieldCheck } from 'lucide-react';
import type { UserStatus } from '@/lib/api/types';

interface UserActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    userName?: string;
    action: UserStatus;
    isLoading?: boolean;
    error?: string | null;
}

const CONFIG: Record<UserStatus, {
    icon: React.ReactNode;
    iconBg: string;
    iconRing: string;
    btnClass: string;
    title: (name: string) => string;
    description: string;
    confirmLabel: string;
}> = {
    banned: {
        icon: <ShieldX className="w-8 h-8" />,
        iconBg: 'bg-red-100 dark:bg-red-900/20',
        iconRing: 'bg-red-500 text-white',
        btnClass: 'bg-red-600 hover:bg-red-700 shadow-red-500/30',
        title: (name) => `Ban ${name}?`,
        description: 'This user will be permanently banned and lose access to the platform.',
        confirmLabel: 'Ban User',
    },
    suspended: {
        icon: <ShieldAlert className="w-8 h-8" />,
        iconBg: 'bg-yellow-100 dark:bg-yellow-900/20',
        iconRing: 'bg-yellow-500 text-white',
        btnClass: 'bg-yellow-600 hover:bg-yellow-700 shadow-yellow-500/30',
        title: (name) => `Suspend ${name}?`,
        description: 'This user will be temporarily suspended and cannot log in until reactivated.',
        confirmLabel: 'Suspend User',
    },
    active: {
        icon: <ShieldCheck className="w-8 h-8" />,
        iconBg: 'bg-green-100 dark:bg-green-900/20',
        iconRing: 'bg-green-500 text-white',
        btnClass: 'bg-green-600 hover:bg-green-700 shadow-green-500/30',
        title: (name) => `Activate ${name}?`,
        description: 'This will restore the user\'s access to the platform.',
        confirmLabel: 'Activate User',
    },
    inactive: {
        icon: <ShieldCheck className="w-8 h-8" />,
        iconBg: 'bg-gray-100 dark:bg-gray-800',
        iconRing: 'bg-gray-500 text-white',
        btnClass: 'bg-gray-600 hover:bg-gray-700',
        title: (name) => `Deactivate ${name}?`,
        description: 'This user will be marked as inactive.',
        confirmLabel: 'Confirm',
    },
};

const UserActionModal: React.FC<UserActionModalProps> = ({
    isOpen, onClose, onConfirm, userName, action, isLoading, error,
}) => {
    const cfg = CONFIG[action];
    const name = userName ?? 'this user';

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[480px] p-8">
            <div className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-full ${cfg.iconBg} flex items-center justify-center mb-6`}>
                    <div className={`w-12 h-12 rounded-full ${cfg.iconRing} flex items-center justify-center`}>
                        {cfg.icon}
                    </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {cfg.title(name)}
                </h3>

                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 max-w-sm">
                    {cfg.description}
                </p>

                {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

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
                        className={`flex-1 px-4 py-2.5 rounded-xl text-white font-semibold transition-colors shadow-lg ${cfg.btnClass} disabled:opacity-60`}
                    >
                        {isLoading ? 'Processing…' : cfg.confirmLabel}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default UserActionModal;
