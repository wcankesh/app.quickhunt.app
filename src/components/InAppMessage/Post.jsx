import React,{useCallback, useRef, useEffect} from 'react';
import {useTheme} from "../theme-provider";
import {useSelector} from "react-redux";
import {Button} from "../ui/button";
import {MessageCircleMore, Paperclip, Smile, X} from "lucide-react";
import {Card, CardContent, CardHeader} from "../ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "../ui/avatar";

import { createReactEditorJS } from 'react-editor-js';
import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import List from "@editorjs/list";
import Warning from "@editorjs/warning";
import Code from "@editorjs/code";
import LinkTool from "@editorjs/link";
import Image from "@editorjs/image";
import Raw from "@editorjs/raw";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import CheckList from "@editorjs/checklist";
import Delimiter from "@editorjs/delimiter";
import InlineCode from "@editorjs/inline-code";
import SimpleImage from "@editorjs/simple-image";
//import CustomImageTool from "../../utils/CustomImageTool";
const EditorJs = createReactEditorJS();

const Post = ({inAppMsgSetting, setInAppMsgSetting, isLoading}) => {
    const editorCore = useRef(null);
    const {theme} = useTheme();
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const userDetailsReducer =  allStatusAndTypes.members.find((x) => x.id == inAppMsgSetting.from);;

    const handleInitialize = useCallback((instance) => {
        editorCore.current = instance;
    }, []);

    const handleSave = React.useCallback(async () => {
        const savedData = await editorCore.current.save();
        setInAppMsgSetting(prevState => ({
            ...prevState,
            body_text: JSON.stringify({blocks: savedData.blocks})
        }));
    }, []);


    const handleImageDelete = async (editorCore,blockId) => {
        debugger
        const block = await editorCore.current.blocks.getBlockById(blockId);
        const imageUrl = block.data.file.url;

        // Make a DELETE request to your API to delete the image
        try {
            await fetch('https://your-api.com/deleteFile', {
                method: 'DELETE',
                body: JSON.stringify({ url: imageUrl }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Image deleted:', imageUrl);

            // Remove the block from the editor
            editorCore.current.blocks.delete(blockId);
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };

    const editorConstants = {
        embed: Embed,
        table: Table,
        marker: Marker,
        list: List,
        warning: Warning,
        code: Code,
        linkTool: LinkTool,
        image: {
            class: Image,

            inlineToolbar : true,

            config: {
                endpoints: {
                    byFile: 'https://code.quickhunt.app/public/api/upload', // Your file upload endpoint
                    byUrl: 'https://code.quickhunt.app/public/storage/post', // Your endpoint that provides image by URL
                },
                field: 'image',
                types: 'image/*',

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
        raw: Raw,
        header: Header,
        quote: Quote,
        checklist: CheckList,
        delimiter: Delimiter,
        inlineCode: InlineCode,
        simpleImage: SimpleImage
    }

    return (
        <div>
            <div className={`p-16 border-t bg-muted`}>
                <Card className={`rounded-[10px] p-0`} >
                    <CardHeader className={"flex px-4 pt-4 pb-0 flex-row justify-end"}>
                        <Button className={`h-4 w-4 p-0 ${theme === "dark" ? "" : "text-muted-foreground"}`}
                                variant={"ghost hover:none"}><X size={16} stroke={inAppMsgSetting?.btn_color} className={"h-5 w-5"}/></Button>
                    </CardHeader>
                    <CardHeader className={"pt-0"}>
                        {
                            inAppMsgSetting.from ? <div className={"pt-0 flex flex-row gap-2"}>
                                <Avatar className={"w-[32px] h-[32px]"}>
                                    {
                                        userDetailsReducer?.user_photo ?
                                            <AvatarImage src={userDetailsReducer?.user_photo} alt="@shadcn"/>
                                            :
                                            <AvatarFallback>{userDetailsReducer && userDetailsReducer?.name && userDetailsReducer?.name.substring(0, 1)}</AvatarFallback>
                                    }
                                </Avatar>
                                <div className={""}>
                                    <div className={"flex flex-row gap-1"}>
                                        <h5 className={"text-xs leading-5 font-medium"}>{userDetailsReducer?.user_first_name} {userDetailsReducer?.user_last_name}</h5>
                                        <h5 className={`text-xs leading-5 font-medium ${theme === "dark" ? "" : "text-muted-foreground"}`}>from {projectDetailsReducer?.project_name}</h5>
                                    </div>
                                    <h5 className={`text-xs leading-5 font-medium ${theme === "dark" ? "" : "text-muted-foreground"}`}>Active</h5>
                                </div>
                            </div> : ""
                        }

                        <div className={"pl-14 pt-6 m-0 w-full"}>
                            {
                                isLoading ? "" : <EditorJs
                                    onInitialize={handleInitialize}
                                    tools={editorConstants}
                                    enableReInitialize={true}
                                    onChange={handleSave}
                                    data={{
                                        time: new Date().getTime(),
                                        blocks: inAppMsgSetting.body_text.blocks || [],
                                        version: "2.12.4"
                                    }}
                                />
                            }

                        </div>
                    </CardHeader>
                    {
                        inAppMsgSetting.reply_type === 1 ? <CardContent className={`py-5 pl-8 pr-5 rounded-b-lg flex flex-row justify-between`} style={{background: inAppMsgSetting.bg_color}}>
                            <div className={""}>
                                <div className={"flex flex-row gap-3 items-center text-xs"}>
                                    <MessageCircleMore size={20} stroke={inAppMsgSetting?.icon_color} />
                                    <h5 className={"font-medium"} style={{color: inAppMsgSetting.text_color}}>Write a reply...</h5>
                                </div>
                            </div>
                            <div className={"flex gap-3 items-center"}>
                                <Smile size={20} stroke={inAppMsgSetting?.icon_color}/>
                                <Paperclip size={20} stroke={inAppMsgSetting?.icon_color}/>
                            </div>
                        </CardContent> : inAppMsgSetting.reply_type === 2 ? <CardContent className={`py-5 pl-8 pr-5   rounded-b-lg flex flex-row justify-between`} style={{background: inAppMsgSetting.bg_color}}>
                            <div className={"flex justify-center gap-5 w-full"}>
                                {
                                    (allStatusAndTypes.emoji || []).map((x,i)=>{
                                        return(
                                            <img key={i} className={"h-6 w-6 cursor-pointer"} src={x.emoji_url}/>
                                        )
                                    })
                                }
                            </div>
                        </CardContent> : inAppMsgSetting.reply_type === 3 ? "" : ""
                    }

                </Card>
            </div>
        </div>
    );
};

export default Post;