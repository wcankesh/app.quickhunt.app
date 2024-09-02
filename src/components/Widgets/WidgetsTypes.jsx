import React, {Fragment} from 'react';
import {baseUrl} from "../../utils/constent";
import {Card, CardContent} from "../ui/card";
import embed_img from "../../img/widget_embed.png";
import popover_img from "../../img/widget_popover.png";
import modal_img from "../../img/widget_modal.png";
import sidebar_img from "../../img/widget_sidebar.png";
import {useNavigate} from "react-router-dom";


const WidgetsTypes = () => {
    const navigate = useNavigate();

    const handleCreateClick = (type) => {
        navigate(`${baseUrl}/widget/${type}/new`);
    }

    const widgetsList = [
        {
            title: "Embed widget",
            description : "Embed Ideas, Roadmap & Announcements inside your site.",
            img: embed_img,
            type: "embed"
        },
        {
            title: "Popover widget",
            description : "Embed Ideas, Roadmap & Announcements inside your site.",
            img: popover_img,
            type: "popover"
        },
        {
            title: "Modal widget",
            description : "Embed Ideas, Roadmap & Announcements inside your site.",
            img: modal_img,
            type: "modal"
        },
        {
            title: "Sidebar widget",
            description : "Embed Ideas, Roadmap & Announcements inside your site.",
            img: sidebar_img,
            type: "sidebar"
        }
    ];

    return (
        <Fragment>
            <div className={"roadmap-container height-inherit h-svh overflow-y-auto container-secondary xl:max-w-[1605px] lg:max-w-[1230px] md:max-w-[960px] max-w-[639px] pt-6 pb-5 px-3 md:px-4"}>
                <div className={"flex flex-col gap-4"}>
                    <div className={"space-x-4"}>
                        <h2 className={"font-semibold"}>Create New Widget</h2>
                    </div>
                    <div className={"w-full flex flex-wrap md:flex-nowrap gap-4"}>
                        {
                            widgetsList.map((x, i) => {
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


export default WidgetsTypes;