import React, { useRef, useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { Upload, X } from "lucide-react";

interface UploadIconModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const UploadIconModal: React.FC<UploadIconModalProps> = ({ isOpen, onClose }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [iconFile, setIconFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [iconName, setIconName] = useState("");

    const handleFile = (file: File) => {
        setIconFile(file);
        if (preview) URL.revokeObjectURL(preview);
        setPreview(URL.createObjectURL(file));
    };

    const handleClose = () => {
        setIconFile(null);
        if (preview) URL.revokeObjectURL(preview);
        setPreview(null);
        setIconName("");
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} className="max-w-[480px] z-[999999]">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-0 overflow-hidden">
                <div className="flex justify-between items-center p-6 pb-0">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Upload Custom Icon</h3>
                    <button type="button" onClick={handleClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Icon Preview / Upload */}
                    <div className="flex flex-col items-center justify-center gap-3">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Upload Icon</p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFile(file);
                                e.target.value = "";
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-[#9810FA] hover:bg-[#9810FA]/5 transition-colors overflow-hidden"
                        >
                            {preview ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={preview} alt="Icon preview" className="w-full h-full object-cover" />
                            ) : (
                                <Upload className="w-8 h-8 text-gray-400" />
                            )}
                        </button>
                        {iconFile && (
                            <p className="text-xs text-gray-500 truncate max-w-[200px]">{iconFile.name}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="iconName">Name Icon</Label>
                        <Input
                            id="iconName"
                            placeholder="Night Peace"
                            value={iconName}
                            onChange={(e) => setIconName(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 p-6 pt-0">
                    <Button variant="outline" onClick={handleClose} className="px-6">Cancel</Button>
                    <Button
                        onClick={handleClose}
                        className="bg-[#9810FA] hover:bg-[#8000E0] text-white border-none px-6"
                        disabled={!iconFile}
                    >
                        Upload Icon
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default UploadIconModal;
