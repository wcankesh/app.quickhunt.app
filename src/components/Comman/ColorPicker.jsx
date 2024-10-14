import React, { useEffect, useRef, useState, Fragment } from 'react';
import { SketchPicker } from 'react-color';
import { Input } from "../ui/input";

const ColorInput = ({ value, name, onChange, style, hideInput  }) => {
    const [clickedOutside, setClickedOutside] = useState(false);
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


    const handleColorChange = (color) => {
        const newColor = color.hex;
        onChange(name, newColor);
    };

    return (
        <Fragment>
            {
                hideInput ?
                    <div className={"tiptap-color-picker"}>
                    <SketchPicker
                        color={value}
                        onChange={handleColorChange}
                    /> </div>
                 : <div
                    className={`color_picker py-2 px-3 bg-card border border-border rounded-lg`}
                    style={style}
                    onClick={handleClickInside}
                    ref={myRef}
                >
                    <div className="flex gap-1 items-center">
                        <div style={{background: value}} className="color_picker_color"/>
                        <Input
                            className={"text-sm border-none p-0 h-auto focus-visible:ring-offset-0 focus-visible:ring-0"}
                            id={name}
                            value={value}
                            onChange={(e) => handleColorChange({hex: e.target.value})}
                        />
                        {/*<span className="text-sm" id={name}>{inputValue}</span>*/}
                    </div>
                    {
                        clickedOutside &&
                        <SketchPicker
                            color={value}
                            onChange={handleColorChange}
                        />
                    }
                </div>
            }
        </Fragment>
    );
};

export default ColorInput;
