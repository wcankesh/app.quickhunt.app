import React from 'react';
import {Star} from "lucide-react";

const RatingStar = ({ filled, onClick, onMouseEnter, onMouseLeave }) => {
    return (
        <span
            style={{
                cursor: 'pointer',
                color: filled ? '#FFD700' : '#DDDDDD',
                fontSize: '24px'
            }}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={"flex flex-row"}
        >
            <Star className={`${filled ? "fill-[#FFD700]" : ""}`}  />
    </span>
    );
};

export default RatingStar;
