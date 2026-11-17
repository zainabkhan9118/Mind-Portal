"use client";
import React, { useEffect, useRef } from "react";

/** Row/header selection checkbox for tables. Supports the "some selected" (indeterminate) state. */
const SelectCheckbox: React.FC<{ checked: boolean; indeterminate?: boolean; onChange: () => void; label: string; disabled?: boolean }> = ({ checked, indeterminate = false, onChange, label, disabled = false }) => {
    const ref = useRef<HTMLInputElement>(null);
    useEffect(() => { if (ref.current) ref.current.indeterminate = indeterminate; }, [indeterminate]);
    return (
        <input
            ref={ref}
            type="checkbox"
            aria-label={label}
            checked={checked}
            disabled={disabled}
            onChange={onChange}
            className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-purple-600 accent-purple-600 cursor-pointer disabled:opacity-50"
        />
    );
};

export default SelectCheckbox;
