import React from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { Moon, X } from "lucide-react";

interface UploadIconModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const UploadIconModal: React.FC<UploadIconModalProps> = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[480px] z-[999999]">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-0 overflow-hidden">
                {/* Header with Close Button */}
                <div className="flex justify-between items-center p-6 pb-0">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Upload Custom Icon</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Icon Preview */}
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Upload Icon</p>
                        <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center border border-gray-100 dark:border-gray-700 shadow-sm">
                            <Moon className="w-8 h-8 text-gray-700 dark:text-gray-300" />
                        </div>
                    </div>

                    {/* Name Input */}
                    <div className="space-y-1.5">
                        <Label htmlFor="iconName">Name Icon</Label>
                        <Input id="iconName" placeholder="Night Peace" className="bg-gray-50 dark:bg-gray-800" />
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 p-6 pt-0">
                    <Button variant="outline" onClick={onClose} className="px-6">Cancel</Button>
                    <Button className="bg-[#9810FA] hover:bg-[#8000E0] text-white border-none px-6">Upload Icon</Button>
                </div>
            </div>
        </Modal>
    );
};

export default UploadIconModal;
