import React from "react";
import { X, Music2, Brain, Calendar, Clock, ChevronDown } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { ValidationItemData } from "./ValidationItem";

interface PlaylistReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: ValidationItemData | null;
}

const PlaylistReviewModal: React.FC<PlaylistReviewModalProps> = ({ isOpen, onClose, item }) => {
    if (!item) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
            <div className="relative flex flex-col w-full bg-white dark:bg-gray-900 rounded-[32px] p-10 overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex justify-between items-start mb-10">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Review Playlist: <span className="text-purple-600 font-extrabold">{item.title}</span>
                    </h2>
                    {/* <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-400">
                        <X className="w-6 h-6" />
                    </button> */}
                </div>

                {/* Item Details Card */}
                <div className="flex gap-8 mb-12">
                    <div className="w-24 h-24 rounded-3xl bg-purple-100/50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0 shadow-theme-sm border border-purple-50 dark:border-purple-900/30">
                        <Music2 className="w-12 h-12" />
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{item.title}</h3>
                        <div className="flex items-center gap-2">
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                by <span className="font-bold text-gray-800 dark:text-gray-200">{item.creator}</span>
                            </p>
                            <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[9px] font-bold rounded-md shadow-theme-xs uppercase tracking-wider border border-gray-200 dark:border-gray-700">
                                Minds
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg">
                            {item.description}
                        </p>
                        <div className="flex items-center gap-2 pt-2 text-[11px] text-gray-400 font-bold uppercase tracking-widest">
                            <span>{item.itemCount} items</span>
                            <span className="w-1.5 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full"></span>
                            <span>Created: {item.createdAt}</span>
                        </div>
                    </div>
                </div>

                {/* Form Sections */}
                <div className="space-y-10">
                    {/* Basic Info */}
                    <div className="space-y-5">
                        <h4 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Basic Info</h4>
                        <div className="space-y-3">
                            <Label htmlFor="category" className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1">
                                Category <span className="text-red-500 leading-none">*</span>
                            </Label>
                            <div className="relative group">
                                <select
                                    id="category"
                                    defaultValue=""
                                    className="w-full h-14 pl-6 pr-14 appearance-none bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm font-medium text-gray-400 dark:text-gray-500 hover:border-purple-200 transition-all outline-none cursor-pointer focus:ring-4 focus:ring-purple-500/5"
                                >
                                    <option value="" disabled>Select a category</option>
                                    <option>Meditation</option>
                                    <option>Yoga</option>
                                    <option>Deep Focus</option>
                                    <option>Relaxation</option>
                                </select>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-purple-500 transition-colors">
                                    <ChevronDown className="w-5 h-5" />
                                </div>
                            </div>
                            <p className="text-[11px] text-gray-400 font-medium pl-1">Select the appropriate category for this music playlist</p>
                        </div>
                    </div>

                    {/* Schedule Publishing */}
                    <div className="bg-blue-50/20 dark:bg-blue-900/5 p-10 rounded-[40px] border border-blue-100/40 dark:border-blue-900/20 space-y-8">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-purple-600" />
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Schedule Publishing</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                                    Publish Date <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative group">
                                    <Input
                                        type="text"
                                        placeholder="dd/mm/yyyy"
                                        className="bg-white dark:bg-gray-800 rounded-2xl h-14 pr-14 shadow-theme-xs border-gray-100"
                                    />
                                    <Calendar className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 group-hover:text-purple-400 transition-colors w-5 h-5" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                                    Publish Time <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative group">
                                    <Input
                                        type="text"
                                        placeholder="--:-- --"
                                        className="bg-white dark:bg-gray-800 rounded-2xl h-14 pr-14 shadow-theme-xs border-gray-100"
                                    />
                                    <Clock className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 group-hover:text-purple-400 transition-colors w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-4 mt-12 pt-8 border-t border-gray-50 dark:border-gray-800">
                    <Button variant="outline" onClick={onClose} className="px-10 rounded-2xl py-4 h-auto font-bold border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all">
                        Cancel
                    </Button>
                    <Button className="px-10 bg-[#9810FA] hover:bg-[#8000E0] text-white rounded-2xl py-4 h-auto font-bold border-none shadow-2xl shadow-purple-500/30 transform hover:-translate-y-1 transition-all">
                        Approve & Schedule
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default PlaylistReviewModal;
