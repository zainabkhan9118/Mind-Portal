"use client";
import React from "react";
import { Trash2, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
    onConfirm: () => void;
    onClose: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
    isOpen,
    title,
    message,
    confirmText = "Delete",
    cancelText = "Cancel",
    isLoading = false,
    onConfirm,
    onClose,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[400px] m-4" showCloseButton={false}>
            <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden p-6 space-y-5">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-2xl shrink-0">
                        <Trash2 className="w-5 h-5 text-red-500" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
                <div className="flex items-center gap-3 pt-1">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 py-3 rounded-2xl font-bold text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 py-3 rounded-2xl font-bold text-sm text-white bg-red-500 hover:bg-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        {isLoading ? "Deleting…" : confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmDeleteModal;
