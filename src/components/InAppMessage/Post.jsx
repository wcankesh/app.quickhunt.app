import React, {useRef, useEffect, useCallback} from 'react';
import {useTheme} from "../theme-provider";
import {useSelector} from "react-redux";
import {Button} from "../ui/button";
import {MessageCircleMore, Paperclip, Plus, Smile, Trash2, X} from "lucide-react";
import {Card, CardContent, CardHeader} from "../ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "../ui/avatar";
import EmojiPicker from "emoji-picker-react";
import EditorJS from '@editorjs/editorjs';
import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import List from "@editorjs/list";
import Warning from "@editorjs/warning";
import Code from "@editorjs/code";
import LinkTool from "@editorjs/link";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import {PopoverTrigger} from "@radix-ui/react-popover";
import {Popover, PopoverContent} from "../ui/popover";
import {DO_SPACES_ENDPOINT, fileUploaderOnEditor} from "../../utils/constent";

const Post = ({inAppMsgSetting, setInAppMsgSetting, isLoading}) => {
    const editorCore = useRef(null);
    const {theme} = useTheme();
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const userDetailsReducer = allStatusAndTypes.members.find((x) => x.userId == inAppMsgSetting.from);

    const handleSave = useCallback(async () => {
        const savedData = await editorCore.current.save();
        setInAppMsgSetting(prevState => ({
            ...prevState,
            bodyText: {blocks: savedData.blocks}
        }));
    }, []);

    const editorConstants = {
        embed: Embed,
        header: {
            class: Header,
            inlineToolbar: true,
            config: {
                placeholder: 'Enter a header',
                levels: [2, 3, 4], // Available header levels
                defaultLevel: 2,   // Default level
            },
        },
        table: Table,
        marker: Marker,
        list: List,
        warning: Warning,
        code: Code,
        linkTool: LinkTool,
        image: {
            class: Image,
            inlineToolbar: true,
            config: {
                uploader: fileUploaderOnEditor({ uploadFolder: 'post', moduleName: 'post' })
            },
            // actions: [
            //     {
            //         icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-trash-2">
            //             <path d="M3 6h18"/>
            //             <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
            //             <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
            //             <line x1="10" x2="10" y1="11" y2="17"/>
            //             <line x1="14" x2="14" y1="11" y2="17"/>
            //         </svg>,
            //         title: 'Delete',
            //         action: (block) => {
            //             handleImageDelete(editorCore, block.id);
            //         },
            //     },
            // ],
        },
        quote: Quote,
        inlineCode: InlineCode,
    }

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
        setInAppMsgSetting(prevState => ({
            ...prevState,
            reactions: clone
        }));
    }

    useEffect(() => {
        if (!isLoading) {
            let editorData = {
                blocks: [{ type: "paragraph", data: { text: "Hey" } }]
            };

            if (inAppMsgSetting?.bodyText?.blocks) {
                const parsedData = inAppMsgSetting.bodyText;
                if (parsedData && parsedData.blocks) {
                    editorData.blocks = parsedData.blocks.map(block => {
                        if (block.type === 'image' && block.data?.file?.url) {
                            const filename = block.data.file.url;
                            return {
                                ...block,
                                data: {
                                    ...block.data,
                                    file: {
                                        ...block.data.file,
                                        url: `${DO_SPACES_ENDPOINT}/${filename}`
                                    }
                                }
                            };
                        }
                        return block;
                    });
                }
            }

            editorCore.current = new EditorJS({
                holder: 'editorjs',
                autofocus: true,
                tools: editorConstants,
                enableReInitialize: true,
                onChange: handleSave,
                data: {
                    time: new Date().getTime(),
                    blocks: editorData.blocks,
                    version: "2.12.4"
                }
            });

            return () => {
                if (editorCore.current && typeof editorCore.current.destroy === 'function') {
                    editorCore.current.destroy();
                }
            };
        }
    }, [isLoading]);


    return (
        <div
            className={`p-4 md:px-16 md:py-8 flex flex-col gap-4 bg-muted justify-start overflow-y-auto h-[calc(100%_-_94px)]`}>
            <Card className={`rounded-[10px] p-0`}>
                <CardHeader className={"flex px-4 pt-4 pb-0 flex-row justify-end"}>
                    <Button className={`h-4 w-4 p-0 ${theme === "dark" ? "" : "text-muted-foreground"}`}
                            variant={"ghost hover:none"}><X size={16} stroke={inAppMsgSetting?.btnColor} className={"h-5 w-5"}/></Button>
                </CardHeader>
                <CardHeader className={"p-4 pt-0"}>
                        <div className={"pt-0 flex flex-row gap-2 items-center"}>
                            {
                                (inAppMsgSetting.showSender && inAppMsgSetting.from) ?
                                <Avatar className={"w-[32px] h-[32px]"}>
                                    <AvatarImage src={userDetailsReducer?.profileImage ? `${DO_SPACES_ENDPOINT}/${userDetailsReducer?.profileImage}` : null}
                                                 alt={`${userDetailsReducer?.firstName}${userDetailsReducer?.lastName}`}/>
                                    <AvatarFallback
                                        className={`${theme === "dark" ? "bg-card-foreground text-card" : ""} text-xs`}>
                                        {userDetailsReducer?.firstName?.substring(0, 1)}
                                        {userDetailsReducer?.lastName?.substring(0, 1)}
                                    </AvatarFallback>
                                </Avatar> : ""
                            }
                            <div className={"flex flex-row gap-1"}>
                                {(inAppMsgSetting.showSender && inAppMsgSetting.from) ? <h5 className={"text-sm font-medium"}>{userDetailsReducer?.firstName} {userDetailsReducer?.lastName} <span className={'text-muted-foreground font-normal'}>from</span></h5> : ""}
                                <h5 className={`text-sm font-medium`}> {projectDetailsReducer?.name}</h5>
                            </div>
                        </div>
                    <div className={"pl-4 pt-4 md:pl-14 md:pt-6 m-0 w-full"}>{isLoading ? "" :
                        <div id="editorjs"></div>}</div>
                </CardHeader>
                {
                    inAppMsgSetting.replyType === 1 ? <CardContent
                        className={`p-4 md:py-5 md:pl-8 md:pr-5 rounded-b-lg flex flex-row justify-between`}
                        style={{background: inAppMsgSetting.bgColor}}>
                        <div className={""}>
                            <div className={"flex flex-row gap-3 items-center text-xs"}>
                                <MessageCircleMore size={20} stroke={inAppMsgSetting?.iconColor}/>
                                <h5 className={"font-normal"} style={{color: inAppMsgSetting.textColor}}>Write a reply...</h5>
                            </div>
                        </div>
                        <div className={"flex gap-3 items-center"}>
                            <Smile size={20} stroke={inAppMsgSetting?.iconColor}/>
                            <Paperclip size={20} stroke={inAppMsgSetting?.iconColor}/>
                        </div>
                    </CardContent> : inAppMsgSetting.replyType === 2 ?
                        <CardContent className={`py-5 pl-8 pr-5 rounded-b-lg flex flex-row justify-between`}
                                     style={{background: inAppMsgSetting.bgColor}}>
                            <div className={"flex justify-center gap-5 w-full"}>
                                {
                                    (inAppMsgSetting.reactions || []).map((x, i) => {
                                        return (
                                            x.isActive ?
                                                <div className={"relative group hover:cursor-pointer"}>
                                                <span onClick={() => onDeleteReaction(x, i)}
                                                      className="absolute hidden group-hover:inline-block py-0.5 leading-none right-[-11px] top-[-13px] border rounded shadow -top-1 text-[9px] font-semibold tracking-wide px-0.5 text-background-accent dark:text-foreground/60 dark:border-gray-500/60 dark:bg-dark-accent bg-white">
                                                    <Trash2 size={16}
                                                            className={`${theme === "dark" ? "stroke-muted" : ""}`}/>
                                                </span>
                                                    <img key={i} className={"h-6 w-6 cursor-pointer"} src={x.emojiUrl}/>
                                                </div> : ""
                                        )
                                    })
                                }
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant={"secondary"} className={"h-6 w-6 rounded-[100%] p-1"}><Plus size={16}/></Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0 border-none w-[310px]]">
                                        <EmojiPicker theme={theme === "dark" ? "dark" : "light"} height={350}
                                                     autoFocusSearch={true} open={true} searchDisabled={false}
                                                     onEmojiClick={handleEmojiSelect}/>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </CardContent> : inAppMsgSetting.replyType === 3 ? "" : ""
                }
            </Card>
        </div>
    );
};

export default Post;