import React, {Fragment} from 'react';
import {Card, CardContent} from "../ui/card";
import {useNavigate} from "react-router-dom";
import {baseUrl} from "../../utils/constent";
import embed_img from "../../img/widget_embed.png";
import popover_img from "../../img/widget_popover.png";
import modal_img from "../../img/widget_modal.png";
import sidebar_img from "../../img/widget_sidebar.png";
import {Button} from "../ui/button";
import {ArrowLeft} from "lucide-react";

const MessageTypes = () => {
    const navigate = useNavigate();

    const handleCreateClick = (type) => {
        navigate(`${baseUrl}/in-app-message/${type}/new`);
    }

    const messageList = [
        {
            title: "Post",
            description : "Embed Ideas, Roadmap & Announcements inside your site.",
            img: embed_img,
            type: "1"
        },
        {
            title: "Banners",
            description : "Embed Ideas, Roadmap & Announcements inside your site.",
            img: popover_img,
            type: "2"
        },
        {
            title: "Surveys",
            description :"Embed Ideas, Roadmap & Announcements inside your site.",
            img: modal_img,
            type: "3"
        },
        {
            title: "Checklist",
            description : "Embed Ideas, Roadmap & Announcements inside your site.",
            img: sidebar_img,
            type: "4"
        }
    ]

    return (
        <Fragment>
            <div className={"roadmap-container height-inherit h-svh overflow-y-auto container-secondary xl:max-w-[1605px] lg:max-w-[1230px] md:max-w-[960px] max-w-[639px] pt-6 pb-5 px-3 md:px-4"}>
                <div className={"flex flex-col gap-4"}>
                    <div className={"space-x-4 flex items-center"}>
                        <Button className={"h-8 w-8"} variant={"outline"} size={"icon"} onClick={() => navigate(`${baseUrl}/in-app-message`)}>
                            <ArrowLeft size={16} />
                        </Button>
                        <h1 className="text-2xl font-medium">Create New Content</h1>
                    </div>
                    <div className={"w-full flex flex-wrap md:flex-nowrap gap-4"}>
                        {
                            messageList.map((x, i) => {
                                return(
                                    <Card key={i} className={"w-1/4 cursor-pointer"} onClick={() => handleCreateClick(x.type)}>
                                        <div className={"border-b p-6"}>
                                            <h2 className={"text-base font-medium mb-2"}>{x.title}</h2>
                                            <p className={"text-sm font-normal text-muted-foreground"}>{x.description}</p>
                                        </div>
                                        <CardContent className={"p-4 pb-0 bg-muted/50"}>
                                            <img className={"w-[706px] rounded-tl-[5px] rounded-tr-[5px] border border-text-muted border-b-0"} src={x.img} alt=''/>
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