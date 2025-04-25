import React, {Fragment, useState, useEffect} from 'react';
import {baseUrl} from "../../utils/constent";
import {Card, CardContent} from "../ui/card";
import embedImg from "../../img/embed_widget.png";
import popoverImg from "../../img/popover_widget.png";
import modalImg from "../../img/modal_widget.png";
import sidebarImg from "../../img/sidebar_widget.png";
import {useNavigate} from "react-router-dom";
import {Button} from "../ui/button";
import {ArrowLeft} from "lucide-react";
import {Skeleton} from "../ui/skeleton";

const WidgetsTypes = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsLoading(false);
        }, 1500);
        return () => clearTimeout(timeout);
    }, []);

    const handleCreateClick = (type) => {
        navigate(`${baseUrl}/widget/${type}/new`);
    }

    const widgetsList = [
        {
            title: "Embed Widget",
            description : "Integrate content directly into your website for seamless user interaction.",
            img: embedImg,
            type: "embed"
        },
        {
            title: "Popover Widget",
            description : "Display interactive content in a small overlay for quick access without leaving the page.",
            img: popoverImg,
            type: "popover"
        },
        {
            title: "Modal Widget",
            description : "Present focused content in a popup window, requiring user action before returning to the main page.",
            img: modalImg,
            type: "modal"
        },
        {
            title: "Sidebar Widget",
            description : "Add a persistent sidebar for easy access to additional features or information on your website.",
            img: sidebarImg,
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
                                            {isLoading ? (
                                                <div className="space-y-2">
                                                    <Skeleton className="h-4" />
                                                    <Skeleton className="h-4" />
                                                    <Skeleton className="h-4" />
                                                </div>
                                            ) : (
                                                <>
                                                    <h2 className="text-base font-normal mb-2">{x.title}</h2>
                                                    <p className="text-sm font-normal text-muted-foreground">{x.description}</p>
                                                </>
                                            )}
                                        </div>
                                        <CardContent className={"p-3 md:p-4 bg-muted/50"}>
                                            {isLoading ? (
                                                <Skeleton className="h-[224px] bg-muted-foreground/[0.2]" />
                                            ) : (
                                                <img className="max-w-[706px] w-full" src={x.img} alt={x.title} height={225} />
                                            )}
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