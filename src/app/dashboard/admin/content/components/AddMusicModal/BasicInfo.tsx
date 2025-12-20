import React from "react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";

interface BasicInfoProps {
    isEnvironmentSound?: boolean;
    isMindSession?: boolean;
    isEnvironmentVisual?: boolean;
}

const BasicInfo: React.FC<BasicInfoProps> = ({
    isEnvironmentSound = false,
    isMindSession = false,
    isEnvironmentVisual = false,
}) => {
    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Basic Info
            </h3>

            {isMindSession ? (
                // Mind Session Layout
                <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <Label htmlFor="title">Title</Label>
                            <Input type="text" id="title" placeholder="Placeholder" />
                        </div>
                        <div>
                            <Label htmlFor="voice">Voice (Name of Professional)</Label>
                            <Input type="text" id="voice" placeholder="Placeholder" />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="musicLink">Music Link (URL)</Label>
                        <Input type="url" id="musicLink" placeholder="Placeholder" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <Label htmlFor="category">Category</Label>
                            <Input type="text" id="category" placeholder="Placeholder" />
                        </div>
                        <div>
                            <Label htmlFor="subCategory">Sub Category</Label>
                            <Input type="text" id="subCategory" placeholder="Placeholder" />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="addDetail">Add Detail</Label>
                        <Input type="text" id="addDetail" placeholder="Placeholder" />
                    </div>
                </>
            ) : isEnvironmentVisual ? (
                // Environment Visual Layout
                <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <Label htmlFor="title">Title</Label>
                            <Input type="text" id="title" placeholder="Placeholder" />
                        </div>
                        <div>
                            <Label htmlFor="author">Author</Label>
                            <Input type="text" id="author" placeholder="Placeholder" />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="musicLink">Music Link (URL)</Label>
                        <Input type="url" id="musicLink" placeholder="Placeholder" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <Label htmlFor="category">Category</Label>
                            <Input type="text" id="category" placeholder="Placeholder" />
                        </div>
                        <div>
                            <Label htmlFor="subCategory">Sub Category</Label>
                            <Input type="text" id="subCategory" placeholder="Placeholder" />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="addDetail">Add Detail</Label>
                        <Input type="text" id="addDetail" placeholder="Placeholder" />
                    </div>
                </>
            ) : isEnvironmentSound ? (
                // Environment Sound Layout
                <>
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input type="text" id="title" placeholder="Placeholder" />
                    </div>
                    <div>
                        <Label htmlFor="musicLink">Music Link (URL)</Label>
                        <Input type="url" id="musicLink" placeholder="Placeholder" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <Label htmlFor="category">Category</Label>
                            <Input type="text" id="category" placeholder="Placeholder" />
                        </div>
                        <div>
                            <Label htmlFor="subCategory">Sub Category</Label>
                            <Input type="text" id="subCategory" placeholder="Placeholder" />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="addDetail">Add Detail</Label>
                        <Input type="text" id="addDetail" placeholder="Placeholder" />
                    </div>
                </>
            ) : (
                // Standard Music Layout
                <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <Label htmlFor="title">Title</Label>
                            <Input type="text" id="title" placeholder="Placeholder" />
                        </div>
                        <div>
                            <Label htmlFor="artist">Artist</Label>
                            <Input type="text" id="artist" placeholder="Placeholder" />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="musicLink">Music Link (URL)</Label>
                        <Input type="url" id="musicLink" placeholder="Placeholder" />
                    </div>
                </>
            )}
        </div>
    );
};

export default BasicInfo;
