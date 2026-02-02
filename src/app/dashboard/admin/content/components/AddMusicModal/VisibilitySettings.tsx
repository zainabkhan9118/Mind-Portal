import React from "react";
import Select from "@/components/form/Select";
import DatePicker from "@/components/form/date-picker";
import Label from "@/components/form/Label";
import { Clock } from "lucide-react";

const VisibilitySettings: React.FC = () => {
    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Visibility Settings
            </h3>

            <div>
                <Label htmlFor="status">Status</Label>
                <Select
                    options={[
                        { value: "published", label: "Published" },
                        { value: "scheduled", label: "Scheduled" },
                        { value: "unpublished", label: "Unpublished" },
                    ]}
                    placeholder="Scheduled"
                    onChange={(value) => console.log(value)}
                    defaultValue="scheduled"
                />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <Label htmlFor="releaseDate">Release Date</Label>
                    <DatePicker
                        id="releaseDate"
                        placeholder="Select one..."
                    />
                </div>
                <div>
                    <Label htmlFor="releaseTime">Release Time</Label>
                    <div className="relative">
                        <input
                            type="text"
                            id="releaseTime"
                            placeholder="Select one..."
                            className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
                        />
                        <span className="absolute text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                            <Clock className="w-5 h-5" />
                        </span>
                        <div className="absolute right-9 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisibilitySettings;
