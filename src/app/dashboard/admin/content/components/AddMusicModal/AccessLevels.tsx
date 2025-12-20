import React, { useState } from "react";
import Radio from "@/components/form/input/Radio";
import Label from "@/components/form/Label";

const AccessLevels: React.FC = () => {
    const [accessLevel, setAccessLevel] = useState("free");

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
                    onChange={setAccessLevel}
                />
                <Radio
                    id="access-premium"
                    name="accessLevel"
                    value="premium"
                    label="Premium"
                    checked={accessLevel === "premium"}
                    onChange={setAccessLevel}
                />
            </div>
        </div>
    );
};

export default AccessLevels;
