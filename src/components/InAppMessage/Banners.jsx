import React, {Fragment} from 'react';
import {useTheme} from "../theme-provider";
import {X} from "lucide-react";

const Banners = ({inAppMsgSetting}) => {
    const {theme} = useTheme();

    return (
        <Fragment>
            <div
                className={`flex flex-row items-center justify-between px-6 py-[26px] ${theme == "dark" ? "bg-primary/15" : "bg-[#EEE4FF]"}`}>
                <p className={"text-xs font-muted-foreground"}>Start your message from here.....</p>
                <X size={12} stroke={inAppMsgSetting?.btn_color}/>
            </div>
            <div className={`w-full h-[113px] border-t bg-muted`}/>
        </Fragment>
    );
};

export default Banners;