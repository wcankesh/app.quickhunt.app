import React, {useEffect, useRef, useState, Fragment} from 'react';
import { SketchPicker } from 'react-color'

const ColorInput = ({ value, name, onChange}) => {
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
    });
    return (
        <Fragment>
            <div className="color_picker" onClick={handleClickInside} ref={myRef}>
                <div style={{background: value}} className="color_picker_color"></div>
                <span id={name}>{value ? value: "#000000"}</span>
                {
                    clickedOutside &&
                    <SketchPicker
                        presetColors={[]}
                        color={ value ? value: "#000000" }
                        onChange={(color) => onChange({[name]: color.hex})
                    }/>
                }
            </div>
        </Fragment>
    );
};

export default ColorInput;
