import React from "react";
import { X, Brain, Calendar, Clock, ChevronDown } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { ValidationItemData } from "./ValidationItem";

interface MindReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: ValidationItemData | null;
}

const MindReviewModal: React.FC<MindReviewModalProps> = ({ isOpen, onClose, item }) => {
    if (!item) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
            <div className="relative flex flex-col w-full bg-white dark:bg-gray-900 rounded-3xl p-8 overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Review Mind: <span className="text-purple-600 font-extrabold">{item.title}</span>
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-400">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Item Details Card */}
                <div className="flex gap-6 mb-10">
                    <div className="w-20 h-20 rounded-2xl bg-purple-100/50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0 shadow-theme-xs">
                        <Brain className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{item.title}</h3>
                            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] font-bold rounded-lg uppercase tracking-wide border border-gray-200 dark:border-gray-700">
                                Mind Session
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            by <span className="font-bold text-gray-700 dark:text-gray-200">{item.creator}</span>
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg">
                            {item.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
                            <span>{item.itemCount} items</span>
                            <span className="w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full"></span>
                            <span>Created: {item.createdAt}</span>
                        </div>
                    </div>
                </div>

                {/* Form Sections */}
                <div className="space-y-8">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Basic Info</h4>
                        <div>
                            <Label htmlFor="accessLevel" className="text-gray-700 dark:text-gray-300 font-semibold mb-2 flex items-center gap-1">
                                Access Level <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <select
                                    id="accessLevel"
                                    className="w-full h-14 pl-5 pr-12 appearance-none bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm font-medium text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-purple-500/20 transition-all outline-hidden"
                                >
                                    <option>Free - All Users</option>
                                    <option>Premium - Paid Only</option>
                                    <option>Restricted - Invite Only</option>
                                </select>
                                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                            </div>
                            <p className="text-[11px] text-gray-400 mt-2 ml-1">Select the appropriate category for this mind session</p>
                        </div>
                    </div>

                    {/* Schedule Publishing */}
                    <div className="bg-blue-50/30 dark:bg-blue-900/10 p-8 rounded-[32px] border border-blue-100/50 dark:border-blue-900/30 space-y-6">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-purple-600" />
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Schedule Publishing</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                                    Publish Date <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <Input
                                        type="text"
                                        placeholder="dd/mm/yyyy"
                                        className="bg-white dark:bg-gray-800 rounded-xl h-12 pr-12"
                                    />
                                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                                    Publish Time <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <Input
                                        type="text"
                                        placeholder="--:-- --"
                                        className="bg-white dark:bg-gray-800 rounded-xl h-12 pr-12"
                                    />
                                    <Clock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 mt-10">
                    <Button variant="outline" onClick={onClose} className="px-8 rounded-xl py-3 h-auto font-bold border-gray-200 text-gray-600 hover:bg-gray-50">
                        Cancel
                    </Button>
                    <Button className="px-8 bg-[#9810FA] hover:bg-[#8000E0] text-white rounded-xl py-3 h-auto font-bold border-none shadow-xl shadow-purple-500/20">
                        Approve & Schedule
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default MindReviewModal;
