import React from "react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";

interface ThemePlaylistProps {
    isEnvironmentSound?: boolean;
    isMindSession?: boolean;
    isEnvironmentVisual?: boolean;
    frequency: string;
    onFrequencyChange: (v: string) => void;
    contentType: string;
    onContentTypeChange: (v: string) => void;
}

const ThemePlaylist: React.FC<ThemePlaylistProps> = ({
    isEnvironmentSound = false,
    isMindSession = false,
    isEnvironmentVisual = false,
    frequency,
    onFrequencyChange,
    contentType,
    onContentTypeChange,
}) => {
    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Theme Playlist
            </h3>

            {isMindSession ? (
                // Mind Session Layout
                <div>
                    <Label htmlFor="mindSessionType">Type</Label>
                    <Input
                        type="text"
                        id="mindSessionType"
                        placeholder="Placeholder"
                        value={contentType}
                        onChange={(e) => onContentTypeChange(e.target.value)}
                    />
                </div>
            ) : isEnvironmentVisual ? (
                // Environment Visual Layout
                <div>
                    <Label htmlFor="visualType">Type</Label>
                    <Input
                        type="text"
                        id="visualType"
                        placeholder="Placeholder"
                        value={contentType}
                        onChange={(e) => onContentTypeChange(e.target.value)}
                    />
                </div>
            ) : isEnvironmentSound ? (
                // Environment Sound Layout
                <div>
                    <Label htmlFor="frequency">Frequency</Label>
                    <Input
                        type="text"
                        id="frequency"
                        placeholder="Placeholder"
                        value={frequency}
                        onChange={(e) => onFrequencyChange(e.target.value)}
                    />
                    {/* <div>
                        <Label htmlFor="type">Type</Label>
                        <Input type="text" id="type" placeholder="Placeholder" />
                    </div> */}
                </div>
            ) : null}
        </div>
    );
};

export default ThemePlaylist;
