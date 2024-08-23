import React, { useEffect, useRef, useState, Fragment } from 'react';
import { SketchPicker } from 'react-color';
import { Input } from "../ui/input";

const ColorInput = ({ value, name, onChange, style }) => {
    const [clickedOutside, setClickedOutside] = useState(false);
    const [inputValue, setInputValue] = useState(value || "#000000");
    const myRef = useRef();

    const handleClickOutside = (e) => {
        if (!myRef.current.contains(e.target)) {
            setClickedOutside(false);
        }
    };

    const handleClickInside = () => setClickedOutside(true);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        onChange({ [name]: newValue });
    };

    const handleColorChange = (color) => {
        const newColor = color.hex;
        setInputValue(newColor);
        onChange({ [name]: newColor });
    };

    return (
        <Fragment>
            <div
                className="color_picker py-2 px-3 bg-card border border-border rounded-lg"
                style={style}
                onClick={handleClickInside}
                ref={myRef}
            >
                <div className="flex gap-1 items-center">
                    <div style={{background: inputValue}} className="color_picker_color"/>
                    <Input
                        className="text-sm border-none p-0 h-auto"
                        id={name}
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                    {/*<span className="text-sm" id={name}>{inputValue}</span>*/}
                </div>
                {
                    clickedOutside &&
                    <SketchPicker
                        color={inputValue}
                        onChange={handleColorChange}
                    />
                }
            </div>
        </Fragment>
    );
};

export default ColorInput;
