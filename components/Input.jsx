import React, { useState, useEffect } from 'react';

export default function Input({ type, label, initialValue, onChange, name, options, disabled }) {
    const [value, setValue] = useState(initialValue);
    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);


    let correctLable = (type == "datetime-local" || options > 0) ? true : false;

    const [isFocused, setIsFocused] = useState(false);

    if (type == "datetime") {
        type = "datetime-local";
    }

    const handleInputChange = (e) => {
        setValue(e.target.value);
        onChange({ target: { name, value: e.target.value } });
    };

    const commonAttributes = {
        type: type || "text",
        name: name,
        value: value || '',
        onChange: handleInputChange,
        onFocus: () => setIsFocused(true),
        onBlur: () => setIsFocused(false),
        className: "w-full p-2 border rounded transition " + (isFocused ? "border-blue-500" : "border-gray-300"),
        disabled: disabled,
    };


    let input;
    if (options && options.length > 0) {
        input = (<select {...commonAttributes}>
            <option key="padrao" value="" disabled>
                Selecione uma opção
            </option>
            {options.map((option) => (
                <option key={option.id} value={option.id}>
                    {option.name}
                </option>
            ))}
        </select>);
        correctLable = true;
    } else if (type == "textarea") {
        input = (<textarea {...commonAttributes} />);
    } else {
        input = (<input {...commonAttributes} />);
    }


    return (
        <div className="relative w-full component" name={value}>
            {input}
            <label className={`absolute left-2 transition-all bg-white ${(isFocused || value || correctLable) ? '-top-2 text-xs  px-1' : 'top-2 text-base'}`} style={{ zIndex: 1 }}>
                {label}
            </label>
        </div>
    );

}
