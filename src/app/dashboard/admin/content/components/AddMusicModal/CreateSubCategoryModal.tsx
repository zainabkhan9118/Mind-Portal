import React from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { X, Layers } from "lucide-react";

interface CreateSubCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateSubCategoryModal: React.FC<CreateSubCategoryModalProps> = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[480px] z-[999999]">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-0 overflow-hidden">
                {/* Header with Close Button */}
                <div className="flex justify-between items-center p-6 pb-0">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Create New Sub Category</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Icon Preview Placeholder */}
                    <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center border border-purple-100 dark:border-purple-800 shadow-sm">
                            <Layers className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>

                    {/* Category Input */}
                    <div className="space-y-1.5">
                        <Label htmlFor="parentCategory">Parent Category</Label>
                        <Input id="parentCategory" placeholder="Select Parent Category" className="bg-gray-50 dark:bg-gray-800" />
                    </div>

                    {/* Sub Category Name Input */}
                    <div className="space-y-1.5">
                        <Label htmlFor="subCategoryName">Sub Category Name</Label>
                        <Input id="subCategoryName" placeholder="Enter Sub Category Name" className="bg-gray-50 dark:bg-gray-800" />
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 p-6 pt-0">
                    <Button variant="outline" onClick={onClose} className="px-6">Cancel</Button>
                    <Button className="bg-[#9810FA] hover:bg-[#8000E0] text-white border-none px-6">Create</Button>
                </div>
            </div>
        </Modal>
    );
};

export default CreateSubCategoryModal;
