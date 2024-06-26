import React, {Fragment, useState} from 'react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "../ui/card";
import {Circle, Plus} from "lucide-react";
import {Button} from "../ui/button";
import {useTheme} from "../theme-provider";
import RoadMapSidebarSheet from "./RoadMapSidebarSheet";

const roadMapCards = [
    {
        id: 1,
        circleFill: "#64676B",
        circleStroke: "#64676B",
        statusTitle: "No Status (2)",
        children: [
            {
                id: 1,
                ideaTitle: "Welcome To Our Release Notes",
                ideaTopic: "# Welcome 👋",
                review: "5",
            }
        ],
    },
    {
        id: 2,
        circleFill: "#EB765D",
        circleStroke: "#EB765D",
        statusTitle: "Under consideration (1)",
        children: [
            {
                id: 2,
                ideaTitle: "Welcome To Our Release Notes",
                ideaTopic: "# Welcome 👋",
                review: "3",
            }
        ],
    },
    {
        id: 3,
        circleFill: "#6392D9",
        circleStroke: "#6392D9",
        statusTitle: "Planned (7)",
        children: [
            {
                id: 3,
                ideaTitle: "Welcome To Our Release Notes",
                ideaTopic: "# Welcome 👋",
                review: "9",
            }
        ],
    },
    {
        id: 4,
        circleFill: "#D96363",
        circleStroke: "#D96363",
        statusTitle: "In Development (4)",
        children: [
            {
                id: 4,
                ideaTitle: "Welcome To Our Release Notes",
                ideaTopic: "# Welcome 👋",
                review: "1",
            }
        ],
    },
    {
        id: 5,
        circleFill: "#63C8D9",
        circleStroke: "#63C8D9",
        statusTitle: "Shipped (6)",
        children: [
            {
                id: 5,
                ideaTitle: "Welcome To Our Release Notes",
                ideaTopic: "# Welcome 👋",
                review: "1",
            }
        ],
    },
]

const Roadmap = () => {
    const { theme } = useTheme()
    const [isSheetOpen, setSheetOpen] = useState(false);
    const [sheetType, setSheetType] = useState('');
    const [statusCard, setStatusCard] = useState(roadMapCards);

    const openSheet = () => setSheetOpen(true);
    const closeSheet = () => setSheetOpen(false);

    const onType = (type) => {
        setSheetType(type)
        openSheet()
    }

    const openDetailsSheet = () => {
        setSheetType('viewDetails');
        openSheet();
    };

    const handleDragStart = (e, sourceStatusId, sourceIndex) => {
        e.dataTransfer.setData("text/plain", JSON.stringify({ sourceStatusId, sourceIndex }));
    };

    const handleDragOver = (e) => {e.preventDefault();};

    const handleDrop = (e, targetStatusId, targetIndex) => {
        e.preventDefault();
        const data = JSON.parse(e.dataTransfer.getData("text/plain"));
        const { sourceStatusId, sourceIndex } = data;

        if (sourceStatusId === targetStatusId && sourceIndex === targetIndex) {
            return;
        }

        const updatedCards = roadMapCards.map(status => {
            if (status.id === sourceStatusId) {
                const draggedItem = status.children[sourceIndex];
                status.children.splice(sourceIndex, 1);

                const targetStatus = roadMapCards.find(s => s.id === targetStatusId);
                if (targetStatus) {
                    targetStatus.children.splice(targetIndex, 0, draggedItem);
                }
            }
            return status;
        });

        setStatusCard(updatedCards);
    };


    return (
        // <div className={"xl:container xl:max-w-[1200px] lg:container lg:max-w-[992px] md:container md:max-w-[768px] sm:container sm:max-w-[639px] xs:container xs:max-w-[475px]"}>
        <div className={"p-8"}>
            <RoadMapSidebarSheet isOpen={isSheetOpen} onOpen={openSheet} onClose={closeSheet} sheetType={sheetType}/>
            <div className={"pb-4"}><h1 className={"text-2xl font-medium"}>Roadmap</h1></div>
            <div className={"flex gap-[18px]"}>

                {(statusCard || []).map(status => (
                    <Card key={status.id} className={"w-[342px]"}>
                        <CardHeader className={"p-4 px-[9px]"}>
                            <CardTitle className={"flex items-center gap-2 text-sm font-semibold px-[7px]"}>
                                <Circle fill={status.circleFill} stroke={status.circleStroke} className={"w-[10px] h-[10px]"} />
                                {status.statusTitle}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className={"px-[9px] pb-3 border-b"}>
                            {status.children.map((child, index) => (
                                <div
                                    key={child.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, status.id, index)}
                                    onDragOver={(e) => handleDragOver(e, status.id, index)}
                                    onDrop={(e) => handleDrop(e, status.id, index)}
                                    className={"cursor-pointer"}
                                >
                                    <Card onClick={openDetailsSheet}>
                                        <CardHeader className={"flex-row gap-2 p-2 pb-3"}>
                                            <Button variant={"outline hover:transparent"} className={"text-sm font-medium border px-[9px] py-1 w-[28px] h-[28px]"}>{child.review}</Button>
                                            <h3 className={"text-sm font-normal"}>{child.ideaTitle}</h3>
                                        </CardHeader>
                                        <CardContent className={"px-[20px] pb-4"}>
                                            <div>{child.ideaTopic}</div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter className={"px-4 py-3"}>
                            <Button
                                variant={"ghost hover:bg-transparent"}
                                className={`gap-2 p-0 ${theme === "dark" ? "" : "text-muted-foreground"} text-sm font-semibold h-auto`}
                                onClick={() => onType('createNewRoadMapIdeas')}
                            >
                                <Plus className={"w-[20px] h-[20px]"} />Create Idea
                            </Button>
                        </CardFooter>
                    </Card>
                ))}

            </div>
        </div>
    );
};

export default Roadmap;