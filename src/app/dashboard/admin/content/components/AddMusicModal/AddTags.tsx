import React from "react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";

const AddTags: React.FC = () => {
    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Add Tags
            </h3>
            <div>
                <Input type="text" placeholder="Placeholder" />
            </div>
        </div>
    );
};

export default AddTags;
