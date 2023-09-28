import React, { useState, useEffect } from 'react';

export default function Input({ type, label, initialValue, onChange, name, options, disabled }) {
    const [value, setValue] = useState(initialValue);
    const [formattedValue, setFormattedValue] = useState(initialValue);
    useEffect(() => {
        setValue(initialValue);
        setFormattedValue(initialValue);
    }, [initialValue]);

    //Needed only in industriAll project
    if (type == "datetime") {
        type = "datetime-local";
    }

    const handleInputChange = (e) => {
        setValue(e.target.value);
        onChange({ target: { name, value: e.target.value } });
    };

    const [isFocused, setIsFocused] = useState(false);
    const commonAttributes = {
        type: type || "text",
        name: name,
        value: value || '',
        onChange: handleInputChange,
        onFocus: () => setIsFocused(true),
        onBlur: () => setIsFocused(false),
        className: "w-full p-2 outline-none border rounded transition  " + (isFocused ? "border-blue-500" : "border-gray-300"),
        outline: "none",
        disabled: disabled,
    };

    let correctLable = (type == "datetime-local" || options > 0) ? true : false;
    let input;
    if (options && options.length > 0) {
        input = (<select id={name} {...commonAttributes}>
            <option key="padrao" value="" disabled>Selecione uma opção</option>

            {options.map((option) => (
                <option key={option.id} value={option.id}>
                    {option.name}
                </option>
            ))}
        </select>);
        correctLable = true;
    } else if (type == "textarea") {

        const handleFormat = (formatTag) => {
            const textarea = document.getElementById(name);
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const selectedText = value.substring(start, end);

            // Wrap the selected text in the specified HTML tag
            const formattedText = `<${formatTag}>${selectedText}</${formatTag}>`;

            // Create a new value with the formatted text
            const newValue =
                value.substring(0, start) +
                formattedText +
                value.substring(end);

            // Update the textarea value
            setValue(newValue);

            // Trigger the input change event
            onChange({ target: { name, value: newValue } });

            // Set the selection range to include the formatted text
            textarea.setSelectionRange(start, end + formatTag.length * 2);
            textarea.focus();
        };

        input = (<>
            <textarea id={name} {...commonAttributes} style={{ minHeight: "80px", paddingTop: "45px" }} >{value}</textarea>
            <div className={'w-full h-10 border-b absolute top-0 flex flex-row gap-5 justify-start items-center pl-4 child:h-6 child:min-w-3 ' + (isFocused ? "border-blue-500" : "border-b-gray-300")}>
                <div className='font-bold'>B</div>
                <div className='italic'>I</div>
                <div className='underline'>U</div>

                <div>{/* Separator */}</div>

                <div><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 18H9V16H4V18ZM4 11V13H14V11H4ZM4 6V8H19V6H4Z" fill="#312F2F" /></svg></div>
                <div><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.5 18H14.5V16H9.5V18ZM7 11V13H17V11H7ZM4.5 6V8H12H19.5V6H4.5Z" fill="#312F2F"/></svg></div>
                <div><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 18H21V16H16V18ZM11 11V13H16H21V11H11ZM6 6V8H13.5H21V6H6Z" fill="#312F2F"/></svg></div>
                <div><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 18H19V16H4V18ZM4 11V13H19V11H4ZM4 6V8H19V6H4Z" fill="#312F2F" /></svg></div>

                <div>{/* Separator */}</div>
            </div>
        </>);
        correctLable = true;
    } else {
        input = (<input id={name} {...commonAttributes} />);
    }

    return (
        <div className="relative w-full component" name={value}>
            {input}
            <label htmlFor={name} className={`absolute left-2 transition-all bg-white ${(isFocused || value || correctLable) ? '-top-2 text-xs  px-1 cursor-default' : 'top-2 text-base cursor-text'}`} style={{ zIndex: 1 }}>
                {label}
            </label>
        </div>
    );
}
