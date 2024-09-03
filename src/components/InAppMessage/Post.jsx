import React, {useState, Fragment} from 'react';
import moment from "moment";
import {useParams} from "react-router-dom";
import {useTheme} from "../theme-provider";
import {useSelector} from "react-redux";
import {Button} from "../ui/button";
import {MessageCircleMore, Paperclip, Smile, X} from "lucide-react";
import {Card, CardContent, CardHeader} from "../ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "../ui/avatar";

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

const Post = () => {
    const {id, type} = useParams()
    const {theme} = useTheme();
    const userDetailsReducer = useSelector(state => state.userDetailsReducer);

    const [messageType, setMessageType] = useState(Number(type) || 1);
    const [inAppMsgSetting, setInAppMsgSetting] = useState(initialState);

    return (
        <div>
            {messageType == 1 && <div className={`p-16 border-t`}>
                <Card className={`rounded-[10px] p-0`} style={{background: inAppMsgSetting.bg_color}}>
                    <CardHeader className={"flex px-4 pt-4 pb-0 flex-row justify-end"}>
                        <Button className={`h-4 w-4 p-0 ${theme === "dark" ? "" : "text-muted-foreground"}`}
                                variant={"ghost hover:none"}><X size={16} stroke={inAppMsgSetting?.btn_color} className={"h-5 w-5"}/></Button>
                    </CardHeader>
                    <CardHeader className={"pt-0"}>
                        <div className={"pt-0 flex flex-row items-center gap-2"}>
                            <Avatar className={"w-[20px] h-[20px]"}>
                                {
                                    userDetailsReducer?.user_photo ?
                                        <AvatarImage src={userDetailsReducer?.user_photo}
                                                     alt="@shadcn"/>
                                        :
                                        <AvatarFallback>{userDetailsReducer && userDetailsReducer?.name && userDetailsReducer?.name.substring(0, 1)}</AvatarFallback>
                                }
                            </Avatar>
                            <div className={""}>
                                <div className={"flex flex-row gap-1"}>
                                    <h5 className={"text-xs leading-5 font-medium"} style={{color: inAppMsgSetting.text_color}}>{userDetailsReducer?.user_first_name} {userDetailsReducer?.user_last_name}</h5>
                                    <h5 className={`text-xs leading-5 font-medium ${theme === "dark" ? "" : "text-muted-foreground"}`} style={{color: inAppMsgSetting.text_color}}>{userDetailsReducer?.user_email_id}</h5>
                                </div>
                                <h5 className={`text-xs leading-5 font-medium ${theme === "dark" ? "" : "text-muted-foreground"}`}>Active</h5>
                            </div>
                        </div>
                        <div className={"pl-16 pt-6 m-0"}>
                            <p className={"text-xs font-medium"}>
                                Hi First name , Start Writing from here....
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent className={`py-5 pl-8 pr-5 ${theme == "dark" ? "bg-primary/15" : "bg-[#EEE4FF]"}  rounded-b-lg flex flex-row justify-between`}>
                        <div className={""}>
                            <div className={"flex flex-row gap-3 items-center text-xs"}>
                                <MessageCircleMore size={20} stroke={inAppMsgSetting?.icon_color} />
                                <h5 className={"text-[#7C3AED] font-medium"}>Write a reply...</h5>
                            </div>
                        </div>
                        <div className={"flex gap-3 items-center"}>
                            <Smile size={20} stroke={inAppMsgSetting?.icon_color}/>
                            <Paperclip size={20} stroke={inAppMsgSetting?.icon_color}/>
                        </div>
                    </CardContent>
                </Card>
            </div>}
        </div>
    );
};

export default Post;