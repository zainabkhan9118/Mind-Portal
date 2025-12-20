import React from "react";
import Select from "@/components/form/Select";
import DatePicker from "@/components/form/date-picker";
import Label from "@/components/form/Label";

const VisibilitySettings: React.FC = () => {
    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Visibility Settings
            </h3>

            <div>
                <Label htmlFor="status">Visibility Status</Label>
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
        </div>
    );
};

export default VisibilitySettings;
