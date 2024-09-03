import React, {Fragment} from 'react';
import {Card, CardContent, CardFooter} from "../ui/card";
import carousel_1 from "../../img/carousel1.png";
import {Button} from "../ui/button";
import {useNavigate} from "react-router-dom";
import {ArrowLeft} from "lucide-react";
import {baseUrl} from "../../utils/constent";
import embed_img from "../../img/widget_embed.png";
import popover_img from "../../img/widget_popover.png";
import modal_img from "../../img/widget_modal.png";
import sidebar_img from "../../img/widget_sidebar.png";

const MessageTypes = () => {
    const navigate = useNavigate();

    const handleCreateClick = (type) => {
        navigate(`${baseUrl}/in-app-message/${type}/new`);
    }

    const widgetsList = [
        {
            title: "Post",
            img: embed_img,
            type: 1
        },
        {
            title: "Banners",
            img: popover_img,
            type: 2
        },
        {
            title: "Surveys",
            img: modal_img,
            type: 3
        },
        {
            title: "Checklist",
            img: sidebar_img,
            type: 4
        }
    ];

    return (
        <Fragment>
            {/*<div className="container xl:max-w-[1200px] lg:max-w-[992px] md:max-w-[768px] sm:max-w-[639px] pt-8 pb-5 px-3 md:px-4">*/}
            <div className={"roadmap-container height-inherit h-svh overflow-y-auto container-secondary xl:max-w-[1605px] lg:max-w-[1230px] md:max-w-[960px] max-w-[639px] pt-6 pb-5 px-3 md:px-4"}>
                <div className={"flex flex-col gap-4"}>
                    <div className={"space-x-4"}>
                        <Button className={"h-8 w-8"} variant={"outline"} size={"icon"} onClick={() => navigate(`${baseUrl}/in-app-message`)}>
                            <ArrowLeft size={16} />
                        </Button>
                        <span className={"font-medium text-lg"}>Back</span>
                    </div>

                    <div className={"w-full flex flex-wrap md:flex-nowrap gap-4"}>
                        {
                            widgetsList.map((x, i) => {
                                return(
                                    <Card key={i} className={"w-1/4 cursor-pointer"} /*onClick={() => handleCreateClick(x.type)}*/>
                                        <div className={"border-b p-3"}>
                                            <h2 className={"text-base font-medium mb-2"}>{x.title}</h2>
                                        </div>
                                        <CardContent className={"p-4 pb-0 bg-muted/50"}>
                                            <img className={"w-[706px] rounded-tl-[5px] rounded-tr-[5px] border border-text-muted border-b-0"} src={x.img} alt=''/>
                                        </CardContent>
                                        <CardFooter className={"p-3"}>
                                            <Button size={"sm"} className={"font-semibold"} onClick={() => handleCreateClick(x.type)}>Create</Button>
                                        </CardFooter>
                                    </Card>
                                )
                            })
                        }
                    </div>

                    {/*<div className={"w-full flex gap-4"}>*/}
                    {/*    <Card className={"w-1/2"}>*/}
                    {/*        <CardTitle className={"text-[20px] border-b px-6 py-3"}>Post</CardTitle>*/}
                    {/*        <CardContent className={"border-b"}>*/}
                    {/*            <img className={"w-[706px]"} src={carousel_1} alt=''/>*/}
                    {/*        </CardContent>*/}
                    {/*        <CardFooter className={"pt-6"}>*/}
                    {/*            <Button className={"font-semibold"} onClick={() => handleCreateClick(1)}>Create</Button>*/}
                    {/*        </CardFooter>*/}
                    {/*    </Card>*/}
                    {/*    <Card className={"w-1/2"}>*/}
                    {/*        <CardTitle className={"text-[20px] border-b px-6 py-3"}>Banners</CardTitle>*/}
                    {/*        <CardContent className={"border-b"}>*/}
                    {/*            <img className={"w-[706px]"} src={carousel_1} alt=''/>*/}
                    {/*        </CardContent>*/}
                    {/*        <CardFooter className={"pt-6"}>*/}
                    {/*            <Button className={"font-semibold"} onClick={() => handleCreateClick(2)}>Create</Button>*/}
                    {/*        </CardFooter>*/}
                    {/*    </Card>*/}
                    {/*</div>*/}
                    {/*<div className={"w-full flex gap-4"}>*/}
                    {/*    <Card className={"w-1/2"}>*/}
                    {/*        <CardTitle className={"text-[20px] border-b px-6 py-3"}>Surveys</CardTitle>*/}
                    {/*        <CardContent className={"border-b"}>*/}
                    {/*            <img className={"w-[706px]"} src={carousel_1} alt=''/>*/}
                    {/*        </CardContent>*/}
                    {/*        <CardFooter className={"pt-6"}>*/}
                    {/*            <Button className={"font-semibold"} onClick={() => handleCreateClick(3)}>Create</Button>*/}
                    {/*        </CardFooter>*/}
                    {/*    </Card>*/}
                    {/*    <Card className={"w-1/2"}>*/}
                    {/*        <CardTitle className={"text-[20px] border-b px-6 py-3"}>Checklist</CardTitle>*/}
                    {/*        <CardContent className={"border-b"}>*/}
                    {/*            <img className={"w-[706px]"} src={carousel_1} alt=''/>*/}
                    {/*        </CardContent>*/}
                    {/*        <CardFooter className={"pt-6"}>*/}
                    {/*            <Button className={"font-semibold"} onClick={() => handleCreateClick(4)}>Create</Button>*/}
                    {/*        </CardFooter>*/}
                    {/*    </Card>*/}
                    {/*</div>*/}
                </div>
            </div>
        </Fragment>
    );
};

export default MessageTypes;