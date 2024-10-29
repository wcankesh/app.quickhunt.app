import React, {Fragment} from 'react';
import {Card, CardContent} from "../ui/card";
import {useNavigate} from "react-router-dom";
import {baseUrl} from "../../utils/constent";
import post_img from "../../img/Post.png";
import checklist_img from "../../img/Checklist.png";
import banner_img from "../../img/banner.png";
import survey_img from "../../img/Survey.png";
import {Button} from "../ui/button";
import {ArrowLeft} from "lucide-react";

const MessageTypes = () => {
    const navigate = useNavigate();

    const handleCreateClick = (type) => {
        navigate(`${baseUrl}/app-message/${type}/new`);
    }

    const messageList = [
        {
            title: "Post",
            description : "Share important updates and tips with users directly in the app to keep them informed.",
            img: post_img,
            type: "1"
        },
        {
            title: "Banners",
            description : "Use banners to highlight key messages at the top of the screen for immediate attention",
            img: banner_img,
            type: "2"
        },
        {
            title: "Surveys",
            description :"Collect user feedback with quick surveys to enhance their experience and understand their needs.",
            img: survey_img,
            type: "3"
        },
        {
            title: "Checklist",
            description : "Guide users through tasks with interactive checklists to track their progress effectively.",
            img: checklist_img,
            type: "4"
        }
    ]

    return (
        <Fragment>
            <div className={"roadmap-container height-inherit h-svh overflow-y-auto container-secondary xl:max-w-[1605px] lg:max-w-[1230px] md:max-w-[960px] max-w-[639px] pt-6 pb-5 px-3 md:px-8"}>
                <div className={"flex flex-col gap-4"}>
                    <div className={"space-x-4 flex items-center"}>
                        <Button className={"h-8 w-8"} variant={"outline"} size={"icon"} onClick={() => navigate(`${baseUrl}/app-message`)}>
                            <ArrowLeft size={16} />
                        </Button>
                        <h1 className="text-2xl font-normal">Create New Content</h1>
                    </div>
                    <div className={"grid lg:grid-cols-4 md:grid-cols-2 gap-4"}>
                        {
                            messageList.map((x, i) => {
                                return(
                                    <Card key={i} className={"cursor-pointer flex flex-col h-full"} onClick={() => handleCreateClick(x.type)}>
                                        <div className={"border-b p-3 md:p-4 flex flex-col flex-1"}>
                                            <h2 className={"text-base font-normal mb-2"}>{x.title}</h2>
                                            <p className={"text-sm font-normal text-muted-foreground"}>{x.description}</p>
                                        </div>
                                        <CardContent className={"p-3 md:p-4 bg-muted/50 "}>
                                            <img className={"max-w-[706px] w-full"} src={x.img} alt=''/>
                                        </CardContent>
                                    </Card>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default MessageTypes;