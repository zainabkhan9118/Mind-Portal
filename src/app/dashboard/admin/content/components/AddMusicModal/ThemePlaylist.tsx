import React from "react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";

interface ThemePlaylistProps {
    isEnvironmentSound?: boolean;
    isMindSession?: boolean;
    isEnvironmentVisual?: boolean;
}

const ThemePlaylist: React.FC<ThemePlaylistProps> = ({
    isEnvironmentSound = false,
    isMindSession = false,
    isEnvironmentVisual = false,
}) => {
    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Theme Playlist
            </h3>

            {isMindSession ? (
                // Mind Session Layout
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <Label htmlFor="goal">Goal</Label>
                        <Input type="text" id="goal" placeholder="Placeholder" />
                    </div>
                    <div>
                        <Label htmlFor="type">Type</Label>
                        <Input type="text" id="type" placeholder="Placeholder" />
                    </div>
                </div>
            ) : isEnvironmentVisual ? (
                // Environment Visual Layout
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <Label htmlFor="goal">Goal</Label>
                        <Input type="text" id="goal" placeholder="Placeholder" />
                    </div>
                    <div>
                        <Label htmlFor="type">Type</Label>
                        <Input type="text" id="type" placeholder="Placeholder" />
                    </div>
                </div>
            ) : isEnvironmentSound ? (
                // Environment Sound Layout
                <>
                    <div>
                        <Label htmlFor="goal">Goal</Label>
                        <Input type="text" id="goal" placeholder="Sleep & Dreams" />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <Label htmlFor="frequency">Frequency</Label>
                            <Input type="text" id="frequency" placeholder="Placeholder" />
                        </div>
                        <div>
                            <Label htmlFor="type">Type</Label>
                            <Input type="text" id="type" placeholder="Placeholder" />
                        </div>
                    </div>
                </>
            ) : (
                // Music Layout
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <Label htmlFor="goal">Goal</Label>
                        <Input type="text" id="goal" placeholder="Sleep & Dreams" />
                    </div>
                    <div>
                        <Label htmlFor="style">Style</Label>
                        <Input type="text" id="style" placeholder="Lullabies" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThemePlaylist;
