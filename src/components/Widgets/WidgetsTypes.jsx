import React, {Fragment} from 'react';
import {baseUrl} from "../../utils/constent";
import {Card, CardContent} from "../ui/card";
import embed_img from "../../img/embed_widget.png";
import popover_img from "../../img/popover_widget.png";
import modal_img from "../../img/modal_widget.png";
import sidebar_img from "../../img/sidebar_widget.png";
import {useNavigate} from "react-router-dom";
import {Button} from "../ui/button";
import {ArrowLeft} from "lucide-react";

const WidgetsTypes = () => {
    const navigate = useNavigate();

    const handleCreateClick = (type) => {
        navigate(`${baseUrl}/widget/${type}/new`);
    }

    const widgetsList = [
        {
            title: "Embed Widget",
            description : "Integrate content directly into your website for seamless user interaction.",
            img: embed_img,
            type: "embed"
        },
        {
            title: "Popover Widget",
            description : "Display interactive content in a small overlay for quick access without leaving the page.",
            img: popover_img,
            type: "popover"
        },
        {
            title: "Modal Widget",
            description : "Present focused content in a popup window, requiring user action before returning to the main page.",
            img: modal_img,
            type: "modal"
        },
        {
            title: "Sidebar Widget",
            description : "Add a persistent sidebar for easy access to additional features or information on your website.",
            img: sidebar_img,
            type: "sidebar"
        }
    ];

    return (
        <Fragment>
            <div className={"roadmap-container height-inherit h-svh overflow-y-auto container-secondary xl:max-w-[1605px] lg:max-w-[1230px] md:max-w-[960px] max-w-[639px] pt-6 pb-5 px-3 md:px-8"}>
                <div className={"flex flex-col gap-4"}>
                    <div className={"space-x-4 flex items-center"}>
                        <Button className={"h-8 w-8"} variant={"outline"} size={"icon"} onClick={() => navigate(`${baseUrl}/widget`)}>
                            <ArrowLeft size={16} />
                        </Button>
                        <h1 className="text-2xl font-normal">Create New Widget</h1>
                    </div>
                    <div className={"grid lg:grid-cols-4 md:grid-cols-2 gap-4"}>
                        {
                            widgetsList.map((x, i) => {
                                return(
                                    <Card key={i} className={"cursor-pointer flex flex-col h-full"} onClick={() => handleCreateClick(x.type)}>
                                        <div className={"border-b p-3 md:p-4 flex flex-col flex-1"}>
                                            <h2 className={"text-base font-normal mb-2"}>{x.title}</h2>
                                            <p className={"text-sm font-normal text-muted-foreground"}>{x.description}</p>
                                        </div>
                                        <CardContent className={"p-3 md:p-4 bg-muted/50"}>
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

export default WidgetsTypes;