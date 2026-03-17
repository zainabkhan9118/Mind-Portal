import React from "react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { Upload } from "lucide-react";
import Button from "@/components/ui/button/Button";

interface BasicInfoProps {
    isEnvironmentSound?: boolean;
    isMindSession?: boolean;
    isEnvironmentVisual?: boolean;
    onCreateSubCategory?: () => void;
    title: string;
    onTitleChange: (v: string) => void;
    artist: string;
    onArtistChange: (v: string) => void;
    categoryId: string;
    onCategoryChange: (v: string) => void;
    categories: { id: number; name: string }[];
    goal: string;
    onGoalChange: (v: string) => void;
    details: string;
    onDetailsChange: (v: string) => void;
}

const BasicInfo: React.FC<BasicInfoProps> = ({
    isEnvironmentSound = false,
    isMindSession = false,
    isEnvironmentVisual = false,
    onCreateSubCategory,
    title,
    onTitleChange,
    artist,
    onArtistChange,
    categoryId,
    onCategoryChange,
    categories,
    goal,
    onGoalChange,
    details,
    onDetailsChange,
}) => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                    Basic Info
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                            type="text"
                            id="title"
                            placeholder="Placeholder"
                            value={title}
                            onChange={(e) => onTitleChange(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="artist">
                            {isEnvironmentSound ? "Type" : (isMindSession ? "Voice (Name of Professional)" : (isEnvironmentVisual ? "Author" : "Artist"))}
                        </Label>
                        <Input
                            type="text"
                            id="artist"
                            placeholder="Placeholder"
                            value={artist}
                            onChange={(e) => onArtistChange(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Add Files Section */}
            <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                    Add Files
                </h3>
                <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50/30 dark:bg-gray-800/30 hover:bg-gray-50 transition-colors group cursor-pointer">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-3 group-hover:scale-110 transition-transform">
                            <Upload className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Drag & drop a file here, or click to upload</p>
                        <Button className="bg-[#9810FA] hover:bg-[#8000E0] text-white border-none py-2 px-6 text-sm rounded-xl">
                            Browse Files
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <Label htmlFor="category">Category</Label>
                    <select
                        id="category"
                        value={categoryId}
                        onChange={(e) => onCategoryChange(e.target.value)}
                        className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 bg-transparent text-gray-800 dark:text-white border-gray-300 dark:border-gray-700 dark:bg-gray-900"
                    >
                        <option value="">Select category...</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <div className="flex items-center justify-between mb-0">
                        <Label htmlFor="subCategory" className="mb-0">Sub Category</Label>
                        {(isEnvironmentSound || isMindSession || isEnvironmentVisual) && onCreateSubCategory && (
                            <button
                                type="button"
                                onClick={onCreateSubCategory}
                                className="text-[11px] font-medium text-[#9810FA] hover:text-[#8000E0]"
                            >
                                Create new Sub Category
                            </button>
                        )}
                    </div>
                    <Input type="text" id="subCategory" placeholder="Placeholder" />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <Label htmlFor="goal">Goal</Label>
                    <Input
                        type="text"
                        id="goal"
                        placeholder="Sleep & Dreams"
                        value={goal}
                        onChange={(e) => onGoalChange(e.target.value)}
                    />
                </div>
                <div>
                    <Label htmlFor="addDetail">Add Detail</Label>
                    <Input
                        type="text"
                        id="addDetail"
                        placeholder="Placeholder"
                        value={details}
                        onChange={(e) => onDetailsChange(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default BasicInfo;