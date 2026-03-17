import React from "react";
import Radio from "@/components/form/input/Radio";

interface AccessLevelsProps {
    accessLevel: string;
    onAccessLevelChange: (v: string) => void;
}

const AccessLevels: React.FC<AccessLevelsProps> = ({ accessLevel, onAccessLevelChange }) => {
    return (
        <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Access Levels
            </h3>
            <div className="flex gap-4">
                <Radio
                    id="access-free"
                    name="accessLevel"
                    value="free"
                    label="Free"
                    checked={accessLevel === "free"}
                    onChange={onAccessLevelChange}
                />
                <Radio
                    id="access-premium"
                    name="accessLevel"
                    value="premium"
                    label="Premium"
                    checked={accessLevel === "premium"}
                    onChange={onAccessLevelChange}
                />
            </div>
        </div>
    );
};

export default AccessLevels;