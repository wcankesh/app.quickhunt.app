import React from 'react';
import {Icon} from "../../utils/Icon";

const EmptyData = () => {
    return (
        <div className={"p-6 flex justify-center"}>
            {Icon.emptyData}
        </div>
    );
};

export default EmptyData;