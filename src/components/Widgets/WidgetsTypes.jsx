import React, {Fragment} from 'react';
import {Button} from "../ui/button";
import {baseUrl} from "../../utils/constent";
import {ArrowLeft} from "lucide-react";
import {Card, CardContent, CardDescription, CardFooter, CardTitle} from "../ui/card";
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

    return (
        <Fragment>
            {/*<div className="container xl:max-w-[1200px] lg:max-w-[992px] md:max-w-[768px] sm:max-w-[639px] pt-8 pb-5 px-3 md:px-4">*/}
            <div className={"roadmap-container height-inherit h-svh overflow-y-auto container-secondary xl:max-w-[1605px] lg:max-w-[1230px] md:max-w-[960px] max-w-[639px] pt-6 pb-5 px-3 md:px-4"}>
                <div className={"flex flex-col gap-4"}>
                    <div className={"space-x-4"}>
                        {/*<Button variant={"outline"} size={"icon"} onClick={() => navigate(`${baseUrl}/in-app-message`)}>*/}
                        {/*    <ArrowLeft className="h-4 w-4" />*/}
                        {/*</Button>*/}
                        {/*<span className={"font-medium text-lg"}>Back</span>*/}
                        <h2 className={"font-semibold"}>Create New Widget</h2>
                    </div>
                    <div className={"w-full flex flex-wrap md:flex-nowrap gap-4"}>
                        <Card className={"w-1/4 cursor-pointer"} onClick={() => handleCreateClick("embed")}>
                            <div className={"border-b p-6"}>
                            <h2 className={"text-base font-medium mb-2"}>Embed widget</h2>
                            <p className={"text-sm font-normal text-muted-foreground"}>Embed Ideas, Roadmap & Announcements inside your site.</p>
                            </div>
                            <CardContent className={"p-4 pb-0 bg-muted/50"}>
                                <img className={"w-[706px] rounded-tl-[5px] rounded-tr-[5px] border border-text-muted border-b-0"} src={embed_img} alt=''/>
                            </CardContent>
                        </Card>
                        <Card className={"w-1/4 cursor-pointer"} onClick={() => handleCreateClick("popover")}>
                            <div className={"border-b p-6"}>
                                <h2 className={"text-base font-medium mb-2"}>Popover Widget</h2>
                                <p className={"text-sm font-normal text-muted-foreground"}>Embed Ideas, Roadmap & Announcements inside your site.</p>
                            </div>
                            <CardContent className={"p-4 pb-0 bg-muted/50"}>
                                <img className={"w-[706px] rounded-tl-[5px] rounded-tr-[5px] border border-text-muted border-b-0"} src={popover_img} alt=''/>
                            </CardContent>
                        </Card>
                        <Card className={"w-1/4 cursor-pointer"}>
                            <div className={"border-b p-6"} onClick={() => handleCreateClick("modal")}>
                                <h2 className={"text-base font-medium mb-2"}>Modal Widget</h2>
                                <p className={"text-sm font-normal text-muted-foreground"}>Embed Ideas, Roadmap & Announcements inside your site.</p>
                            </div>
                            <CardContent className={"p-4 pb-0 bg-muted/50"}>
                                <img className={"w-[706px] rounded-tl-[5px] rounded-tr-[5px] border border-text-muted border-b-0"} src={modal_img} alt=''/>
                            </CardContent>
                        </Card>
                        <Card className={"w-1/4 cursor-pointer"}>
                            <div className={"border-b p-6"} onClick={() => handleCreateClick("sidebar")}>
                                <h2 className={"text-base font-medium mb-2"}>Sidebar Widget</h2>
                                <p className={"text-sm font-normal text-muted-foreground"}>Embed Ideas, Roadmap & Announcements inside your site.</p>
                            </div>
                            <CardContent className={"p-4 pb-0 bg-muted/50"}>
                                <img className={"w-[706px] rounded-tl-[5px] rounded-tr-[5px] border border-text-muted border-b-0"} src={sidebar_img} alt=''/>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};


export default WidgetsTypes;