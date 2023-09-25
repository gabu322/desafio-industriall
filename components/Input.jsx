import React, { useState, useEffect } from 'react';

export default function Input({ type, label, initialValue, onChange, name, options, disabled}) {
    const [value, setValue] = useState(initialValue);
    const [isFocused, setIsFocused] = useState(
        (options || type === "date" || type === "datetime-local")
            ? true
            : false
    );


    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);


    if(type == "datetime") {
        type = "datetime-local";
    }

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setValue(newValue);
        onChange({ target: { name, value: newValue } });
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    if (type == "textarea") {
        // Render as a textarea
        return (
            <div className="relative w-full component" name={value} >
                <textarea
                    value={value ?? ''}
                    name={name}
                    onChange={handleInputChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={handleBlur}
                    className={"w-full p-2 border rounded transition " + (isFocused ? "border-blue-500" : "border-gray-300")}
                    disabled={disabled}
                />
                <label className={`absolute left-2 transition-all ${isFocused || value ? '-top-2 text-xs bg-white px-1' : 'top-2 text-base bg-transparent'}`}>
                    {label}
                </label>
            </div>
        );
    } else if (options && options.length > 0) {
        // Render as an input with a dropdown
        return (
            <div className="relative w-full component" name={value}>
                <select
                    name={name}
                    value={value ?? ''}
                    onChange={handleInputChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={handleBlur}
                    className={"w-full p-2 border rounded transition " + (isFocused ? "border-blue-500" : "border-gray-300")}
                    disabled={disabled}
                >
                    <option key="padrao" value="" disabled>
                        Selecione uma opção
                    </option>
                    {options.map((option) => (
                        <option key={option.id} value={option.id}>
                            {option.name}
                        </option>
                    ))}
                </select>
                <label className={`absolute left-2 transition-all bg-white ${isFocused || value ? '-top-2 text-xs  px-1' : 'top-2 text-base w-24'}`}>
                    {label}
                </label>
            </div>
        );
    } else {
        // Render as a regular input
        return (
            <div className="relative w-full component" name={value}>
                <input
                    type={type ?? "text"}
                    value={value ?? ''}
                    name={name}
                    onChange={handleInputChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={handleBlur}
                    className={"w-full p-2 border rounded transition " + (isFocused ? "border-blue-500" : "border-gray-300")}
                    disabled={disabled}
                />
                <label className={`absolute left-2 transition-all bg-white ${isFocused || value ? '-top-2 text-xs  px-1' : 'top-2 text-base'}`} style={{zIndex: 1}}>
                    {label}
                </label>
            </div>
        );
    }
}
