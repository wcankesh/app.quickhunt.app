import React, {useState} from 'react';
import moment from "moment";
import {useParams} from "react-router-dom";
import {useTheme} from "../theme-provider";
import {X} from "lucide-react";

const initialState = {
    project_id: "2",
    title: "In app message",
    type: 1, //1=post,2=banner,3=survey,4=checklist
    body_text: "",
    from: "",
    reply_to: "",
    bg_color: "#ffffff",
    text_color: "#000000",
    icon_color: "#FD6B65",
    btn_color: "#7c3aed",
    delay: 1, //time in seconds
    start_at: moment().toISOString(),
    end_at: moment().add(1, 'hour').toISOString(),
    position: "top", //top/bottom
    alignment: "left", //left/right
    is_close_button: "", //true/false
    reply_type: "", //1=Text,2=Reaction
    question_type: 1, //1=Net Promoter Score,2=Numeric Scale,3=Star rating scale,4=Emoji rating scale,5=Drop Down / List,6=Questions
    start_number: 1,
    end_number: 10,
    start_label: "",
    end_label: "",
    placeholder_text: "",
    options: [''],
    show_sender: "", //boolean
    action_type: 1, //1=Open URL,2=Ask for Reaction,3=Collect visitor email
    action_text: "",
    action_url: "",
    is_redirect: "", //boolean
    is_banner_close_button: "", //boolean
    banner_style: "", //1=Inline,2=Floating,3=Top,4=Bottom
    reaction: "",
}

const Banners = () => {
    const {id, type} = useParams()
    const {theme} = useTheme();

    const [messageType, setMessageType] = useState(Number(type) || 1);
    const [inAppMsgSetting, setInAppMsgSetting] = useState(initialState);

    return (
        <div>
            {
                messageType == 2 && <div>
                    <div
                        className={`flex flex-row items-center justify-between px-6 py-[26px] ${theme == "dark" ? "bg-primary/15" : "bg-[#EEE4FF]"}`}>
                        <p className={"text-xs font-muted-foreground"}>Start your message from here.....</p>
                        <X size={12} stroke={inAppMsgSetting?.btn_color}/>
                    </div>
                    <div className={`w-full h-[113px] border-t`}/>
                </div>
            }
        </div>
    );
};

export default Banners;