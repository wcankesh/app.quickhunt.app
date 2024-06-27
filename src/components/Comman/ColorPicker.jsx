import React, {Fragment, useId} from 'react';

const ColorPicker = ({name, value, onChange, label, disabled}) => {
    const uniqId = useId();
    return (
        <Fragment>
            <div className={"flex justify-end"}>
                <div className="color_picker">
                    <input type="color" name={name} id={`color${uniqId}picker`} value={value} onChange={onChange} disabled={disabled && disabled}/>
                    <label htmlFor={`color${uniqId}picker`}>{value}</label>
                </div>
                {label && <label className="color-label">{label}</label>}
            </div>
        </Fragment>
    );
};

export default ColorPicker;