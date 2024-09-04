import React from 'react';
import {useTheme} from "../theme-provider";
import {Button} from "../ui/button";
import {MessageCircleMore, Paperclip, Smile, X} from "lucide-react";
import {Card, CardContent, CardHeader} from "../ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "../ui/avatar";

const Post = ({inAppMsgSetting, userDetailsReducer}) => {
    const {theme} = useTheme();

    return (
        <div className={`p-16 border-t bg-muted`}>
            <Card className={`rounded-[10px] p-0`} style={{background: inAppMsgSetting?.bg_color}}>
                <CardHeader className={"flex px-4 pt-4 pb-0 flex-row justify-end"}>
                    <Button className={`h-4 w-4 p-0 ${theme === "dark" ? "" : "text-muted-foreground"}`}
                            variant={"ghost hover:none"}>
                        <X size={16} stroke={inAppMsgSetting?.btn_color} className={"h-5 w-5"}/>
                    </Button>
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
                                <h5 className={"text-xs leading-5 font-medium"}
                                    style={{color: inAppMsgSetting?.text_color}}>{userDetailsReducer?.user_first_name} {userDetailsReducer?.user_last_name}</h5>
                                <h5 className={`text-xs leading-5 font-medium ${theme === "dark" ? "" : "text-muted-foreground"}`}
                                    style={{color: inAppMsgSetting?.text_color}}>{userDetailsReducer?.user_email_id}</h5>
                            </div>
                            <h5 className={`text-xs leading-5 font-medium ${theme === "dark" ? "" : "text-muted-foreground"}`}>Active</h5>
                        </div>
                    </div>
                    <div className={"pl-16 pt-6 m-0"}>
                        <p className={"text-xs font-medium"}>Hi First name , Start Writing from here....</p>
                    </div>
                </CardHeader>
                <CardContent
                    className={`py-5 pl-8 pr-5 ${theme == "dark" ? "bg-primary/15" : "bg-[#EEE4FF]"}  rounded-b-lg flex flex-row justify-between`}>
                    <div className={""}>
                        <div className={"flex flex-row gap-3 items-center text-xs"}>
                            <MessageCircleMore size={20} stroke={inAppMsgSetting?.icon_color}/>
                            <h5 className={"text-[#7C3AED] font-medium"}>Write a reply...</h5>
                        </div>
                    </div>
                    <div className={"flex gap-3 items-center"}>
                        <Smile size={20} stroke={inAppMsgSetting?.icon_color}/>
                        <Paperclip size={20} stroke={inAppMsgSetting?.icon_color}/>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Post;