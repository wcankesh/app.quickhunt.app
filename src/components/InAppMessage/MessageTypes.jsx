import React, {Fragment} from 'react';
import {Card, CardContent, CardFooter, CardTitle} from "../ui/card";
import carousel_1 from "../../img/carousel1.png";
import {Button} from "../ui/button";
import {useNavigate} from "react-router-dom";
import {ArrowLeft} from "lucide-react";
import {baseUrl} from "../../utils/constent";

const MessageTypes = () => {
    const navigate = useNavigate();

    const handleCreateClick = (type) => {
        navigate(`${baseUrl}/in-app-message/${type}/new`);
    }


    return (
        <Fragment>
            <div className="container xl:max-w-[1200px] lg:max-w-[992px] md:max-w-[768px] sm:max-w-[639px] pt-8 pb-5 px-3 md:px-4">
                <div className={"flex flex-col gap-4"}>
                    <div className={"space-x-4"}>
                        <Button variant={"outline"} size={"icon"} onClick={() => navigate(`${baseUrl}/in-app-message`)}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <span className={"font-medium text-lg"}>Back</span>
                    </div>
                    <div className={"w-full flex gap-4"}>
                        <Card className={"w-1/2"}>
                            <CardTitle className={"text-[20px] border-b px-6 py-3"}>Post</CardTitle>
                            <CardContent className={"border-b"}>
                                <img className={"w-[706px]"} src={carousel_1} alt=''/>
                            </CardContent>
                            <CardFooter className={"pt-6"}>
                                <Button className={"font-semibold"} onClick={() => handleCreateClick(1)}>Create</Button>
                            </CardFooter>
                        </Card>
                        <Card className={"w-1/2"}>
                            <CardTitle className={"text-[20px] border-b px-6 py-3"}>Banners</CardTitle>
                            <CardContent className={"border-b"}>
                                <img className={"w-[706px]"} src={carousel_1} alt=''/>
                            </CardContent>
                            <CardFooter className={"pt-6"}>
                                <Button className={"font-semibold"} onClick={() => handleCreateClick(2)}>Create</Button>
                            </CardFooter>
                        </Card>
                    </div>
                    <div className={"w-full flex gap-4"}>
                        <Card className={"w-1/2"}>
                            <CardTitle className={"text-[20px] border-b px-6 py-3"}>Surveys</CardTitle>
                            <CardContent className={"border-b"}>
                                <img className={"w-[706px]"} src={carousel_1} alt=''/>
                            </CardContent>
                            <CardFooter className={"pt-6"}>
                                <Button className={"font-semibold"} onClick={() => handleCreateClick(3)}>Create</Button>
                            </CardFooter>
                        </Card>
                        <Card className={"w-1/2"}>
                            <CardTitle className={"text-[20px] border-b px-6 py-3"}>Checklist</CardTitle>
                            <CardContent className={"border-b"}>
                                <img className={"w-[706px]"} src={carousel_1} alt=''/>
                            </CardContent>
                            <CardFooter className={"pt-6"}>
                                <Button className={"font-semibold"} onClick={() => handleCreateClick(4)}>Create</Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default MessageTypes;