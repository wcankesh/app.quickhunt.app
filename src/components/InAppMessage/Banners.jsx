import React, {useEffect, useRef} from 'react';
import {useTheme} from "../theme-provider";
import {Plus, Trash2, X, ChevronRight} from "lucide-react";
import {Input} from "../ui/input";
import {useSelector} from "react-redux";
import {Avatar, AvatarFallback, AvatarImage} from "../ui/avatar";
import {Popover, PopoverContent} from "../ui/popover";
import {PopoverTrigger} from "@radix-ui/react-popover";
import {Button} from "../ui/button";
import EmojiPicker from "emoji-picker-react";
import {DO_SPACES_ENDPOINT} from "../../utils/constent";

const Banners = ({inAppMsgSetting, setInAppMsgSetting}) => {
    const {theme} = useTheme();
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const userDetailsReducer = allStatusAndTypes.members.find((x) => x.userId == inAppMsgSetting.from);
    const inputRef = useRef(null);
    const spanRef = useRef(null);

    const onChange = (name, value) => {
        setInAppMsgSetting(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const adjustWidth = () => {
        const span = spanRef.current;
        const input = inputRef.current;
        span.textContent = inAppMsgSetting.bodyText || input.placeholder;
        const textWidth = span.offsetWidth;
        input.style.width = `${textWidth}px`;
    };

    useEffect(() => {
        adjustWidth();
    }, [inAppMsgSetting.bodyText]);

    const handleEmojiSelect = (event) => {
        const clone = [...inAppMsgSetting.reactions];
        const obj = {
            id: "",
            emoji: event.emoji,
            emojiUrl: event.imageUrl,
            isActive: true,
        }
        clone.push(obj)
        setInAppMsgSetting(prevState => ({
            ...prevState,
            reactions: clone
        }));
    }

    const onDeleteReaction = (record, index) => {
        let clone = [...inAppMsgSetting.reactions];
        if (record.id) {
            clone[index] = {...record, isActive: false}
        } else {
            clone.splice(index, 1)
        }
        setInAppMsgSetting(prevState => ({...prevState, reactions: clone}));
    }

    return (
        <div
            className={"relative bg-muted px-[5px] md:px-16 flex flex-col gap-4 py-8 bg-muted justify-start overflow-y-auto h-[calc(100%_-_94px)]"}>
            <div
                className={`absolute w-full flex flex-row items-center justify-between gap-3 px-6 py-[18px] ${inAppMsgSetting.position === "bottom" ? "bottom-0" : "top-0"} left-0`}
                style={{backgroundColor: inAppMsgSetting.bgColor}}>
                <div
                    className={`flex flex-row items-center gap-3 w-full ${inAppMsgSetting.alignment === "left" ? "justify-start" : inAppMsgSetting.alignment === "right" ? "justify-end" : inAppMsgSetting.alignment === "center" ? "justify-center" : "justify-start"}`}>
                    {
                        (inAppMsgSetting.showSender && inAppMsgSetting.from) &&
                        <Avatar className={"w-[32px] h-[32px]"}>
                            <AvatarImage src={userDetailsReducer?.profileImage ? `${DO_SPACES_ENDPOINT}/${userDetailsReducer?.profileImage}` : null} alt={`${userDetailsReducer?.firstName}${userDetailsReducer?.lastName}`}/>
                            <AvatarFallback
                                className={`${theme === "dark" ? "bg-card-foreground text-card" : ""} text-xs`}>
                                {userDetailsReducer?.firstName?.substring(0, 1)}{userDetailsReducer?.lastName?.substring(0, 1)}
                            </AvatarFallback>
                        </Avatar>
                    }
                    <div>
                        <span ref={spanRef}
                              className="absolute invisible whitespace-pre p-2">{inAppMsgSetting?.bodyText}</span>
                        <Input ref={inputRef} placeholder={"Your message..."} autofocus
                               value={inAppMsgSetting.bodyText}
                               onChange={(event) => onChange("bodyText", event.target.value)}
                               className={"w-auto text-sm border-none p-0 h-auto focus-visible:ring-offset-0 focus-visible:ring-0"}
                               style={{backgroundColor: inAppMsgSetting.bgColor, color: inAppMsgSetting.textColor}}/>
                    </div>

                    {
                        inAppMsgSetting.actionType == 1 && <div><a className={"text-sm font-medium underline"}
                                                                   style={{color: inAppMsgSetting.textColor}}>{inAppMsgSetting.actionText}</a>
                        </div>
                    }
                    {
                        inAppMsgSetting.actionType == 2 && <div className={"flex gap-3"}>
                            {
                                (inAppMsgSetting.reactions || []).map((x, i) => {
                                    return (
                                        x.isActive ?
                                            <div className={"relative group hover:cursor-pointer"} key={i}>
                                                    <span onClick={() => onDeleteReaction(x, i)}
                                                          className="absolute hidden group-hover:inline-block py-0.5 leading-none right-[-11px] top-[-13px] border rounded shadow -top-1 text-[9px] font-medium tracking-wide  px-0.5 text-background-accent dark:text-foreground/60 dark:border-gray-500/60  dark:bg-dark-accent bg-white">
                                                        <Trash2 size={16}
                                                                className={`${theme === "dark" ? "stroke-muted" : ""}`}/>
                                                    </span>
                                                <img className={"h-6 w-6 cursor-pointer"} src={x.emojiUrl}/>
                                            </div> : ""
                                    )
                                })
                            }
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"secondary"} className={"h-6 w-6 rounded-[100%] p-1"}><Plus
                                        size={16}/></Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0 border-none w-[310px]]">
                                    <EmojiPicker theme={theme === "dark" ? "dark" : "light"} height={350}
                                                 autoFocusSearch={true} open={true} searchDisabled={false}
                                                 onEmojiClick={handleEmojiSelect}/>
                                </PopoverContent>
                            </Popover>
                        </div>
                    }
                    {
                        inAppMsgSetting.actionType == 3 &&
                        <div className={"relative"}>
                            <Input placeholder={"you@company.com"} autofocus readOnly
                                   className={"w-auto h-9 py-1 px-3 focus-visible:ring-offset-0 focus-visible:ring-0"}
                                   style={{
                                       backgroundColor: inAppMsgSetting.bgColor,
                                       color: inAppMsgSetting.textColor,
                                       borderColor: inAppMsgSetting.textColor
                                   }}/>
                            <Button variant={"ghost hover:none"}
                                    className={"absolute top-[4px] right-0 py-0 px-3 h-7"}>
                                <ChevronRight size={16} color={inAppMsgSetting.textColor}/>
                            </Button>
                        </div>
                    }

                </div>
                {
                    inAppMsgSetting.isCloseButton ? <X size={16} stroke={inAppMsgSetting?.btnColor}/> : ""
                }
            </div>
        </div>
    );
};

export default Banners;