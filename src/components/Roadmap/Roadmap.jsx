import React, {useState, useEffect} from 'react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "../ui/card";
import {Circle, Plus} from "lucide-react";
import {Button} from "../ui/button";
import {useTheme} from "../theme-provider";
import RoadMapSidebarSheet from "./RoadMapSidebarSheet";
import {useSelector} from "react-redux";
import {ApiService} from "../../utils/ApiService";
import Board, {moveCard, allowAddColumn} from '@asseinfo/react-kanban'
import "@asseinfo/react-kanban/dist/styles.css";
import CreateIdea from "./CreateIdea";


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
        const {theme} = useTheme()
        const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
        const [isSheetOpen, setSheetOpen] = useState(false);
    const [isSheetOpenCreate, setSheetOpenCreate] = useState(false);
        const [sheetType, setSheetType] = useState('');
        const [statusCard, setStatusCard] = useState(roadMapCards);
        const [noStatus, setNoStatus] = useState([])
        const [roadmapList, setRoadmapList] = useState({columns: []})
        const [selectedIdea, setSelectedIdea] = useState({});
        const [isUpdateIdea, setIsUpdateIdea] = useState(false);
        const [isNoStatus, setIsNoStatus] = useState(false);
        const [ideasList, setIdeasList] = useState([]);
        const [selectedRoadmap, setSelectedRoadmap] = useState({});
        const [isCreateIdea, setIsCreateIdea] = useState(false);
        const [isLoading, setIsLoading] = useState(false);
    const [oldSelectedIdea, setOldSelectedIdea] = useState({});

        const apiService = new ApiService();

        const openSheet = () => setSheetOpen(true);
        const closeSheet = () => setSheetOpen(false);

    const openCreateIdea = () => setSheetOpenCreate(true);
    const closeCreateIdea = () => setSheetOpenCreate(false);

        const onType = (type) => {
            setSheetType(type)
            openSheet()
        }

    const openDetailsSheet = (mainRecord, record) => {
        setIsUpdateIdea(true);
        setIdeasList(mainRecord.ideas || []);
        setSelectedIdea(record)
        setSelectedRoadmap(mainRecord)
        openSheet();
    };

    useEffect(() => {
        getRoadmapIdea()
    }, [projectDetailsReducer.id])

    const getRoadmapIdea = async () => {
        setIsLoading(true)
        const payload = {
            project_id: projectDetailsReducer.id,
            roadmap_id: "",
            page: "",
            limit: "",
        }
        const data = await apiService.getRoadmapIdea(payload)
        if (data.status === 200) {
            const roadmapListClone = [];
            data.data.data.map((x) => {
                roadmapListClone.push({...x, cards: x.ideas})
            });
            setRoadmapList({columns: roadmapListClone})
            setNoStatus(data.data.no_status)
            setIsLoading(false)
        } else {
            setIsLoading(false)
        }
    }


        const callApi = async (columnId, payload) => {
            let formData = new FormData();
            formData.append("roadmap_id", columnId);
            const data = await apiService.updateIdea(formData, payload)
            if (data.status === 200) {
                // successMsg("Roadmap Update successfully")
            } else {

            }
        }

        const handleCardMove = (_card, source, destination) => {
            const updatedBoard = moveCard(roadmapList, source, destination)
            callApi(destination.toColumnId, _card.id)
            setRoadmapList(updatedBoard)
        }

    const onUpdateIdeaClose = () => {
        setIsUpdateIdea(false);
        setSelectedRoadmap({});
        setSelectedIdea({});
        setIdeasList([]);
        setIsNoStatus(false)
    }
    const onCreateIdea = (mainRecord) => {
        setIsCreateIdea(true);
        setIdeasList(mainRecord.ideas || []);
        setSelectedRoadmap(mainRecord)
        openCreateIdea()
    }

        return (
            <div
                className={"height-inherit h-svh  overflow-y-auto xl:container-secondary xl:max-w-[1605px] lg:container lg:max-w-[992px] md:container md:max-w-[768px] sm:container sm:max-w-[639px] xs:container xs:max-w-[475px] p-8"}>
                    <RoadMapSidebarSheet
                        isOpen={isSheetOpen}
                        onOpen={openSheet}
                        onClose={closeSheet}

                        isRoadmap={false}
                        isUpdateIdea={isUpdateIdea}
                        setIsUpdateIdea={setIsUpdateIdea}
                        setIdeasList={setIdeasList}
                        ideasList={ideasList}
                        selectedIdea={selectedIdea}
                        setSelectedIdea={setSelectedIdea}
                        oldSelectedIdea={oldSelectedIdea}
                        setOldSelectedIdea={setOldSelectedIdea}
                        onUpdateIdeaClose={onUpdateIdeaClose}
                        isNoStatus={isNoStatus}
                        setIsNoStatus={setIsNoStatus}
                        setSelectedRoadmap={setSelectedRoadmap}
                        selectedRoadmap={selectedRoadmap}
                    />
                <CreateIdea
                    isOpen={isSheetOpenCreate}
                    onOpen={openCreateIdea}
                    onClose={closeCreateIdea}

                    isRoadmap={false}
                    closeCreateIdea={closeCreateIdea}
                    setIdeasList={setIdeasList}
                    ideasList={ideasList}
                    isNoStatus={false}
                />
                <div className={"pb-4"}><h1 className={"text-2xl font-medium"}>Roadmap</h1></div>
                {
                    roadmapList.columns.length > 0 && <Board
                        allowAddColumn
                        disableColumnDrag
                        onCardDragEnd={handleCardMove}
                        // onColumnDragEnd={handleColumnMove}
                        allowAddCard={{on: "bottom"}}
                        addCard={{on: "bottom"}}
                        renderCard={(y) => {
                            console.log("y", y)
                            return (
                                <Card onClick={() => openDetailsSheet(y)} className={"mb-3"}>
                                    <CardHeader className={"flex-row items-center gap-2 p-2 pb-3"}>
                                        <Button variant={"outline hover:transparent"}
                                                className={"text-sm font-medium border px-[9px] py-1 w-[28px] h-[28px]"}>{y.vote}</Button>
                                        <h3 className={"text-sm font-normal m-0"}>{y.title}</h3>
                                    </CardHeader>
                                    <CardContent className={"px-[20px] pb-4"}>
                                        <div className={"flex"}>
                                            {
                                                ((y && y.topic) || []).map((x, i) => {
                                                    return (
                                                        <div className={"text-xs flex"}>{x.title}</div>
                                                    )
                                                })
                                            }
                                        </div>

                                    </CardContent>
                                </Card>
                            )
                        }}

                        renderColumnHeader={({title, color_code}) => {
                            return (
                                <React.Fragment>
                                    <CardTitle
                                        className={"flex items-center gap-2 text-sm font-semibold px-[7px] mb-[16px]"}>
                                        <Circle fill={color_code} stroke={color_code} className={"w-[10px] h-[10px]"}/>
                                        {title}
                                    </CardTitle>
                                    <div className={"add-idea"}>
                                        <Button
                                            variant={"ghost hover:bg-transparent"}
                                            className={`gap-2 p-0 ${theme === "dark" ? "" : "text-muted-foreground"} text-sm font-semibold h-auto`}
                                            onClick={onCreateIdea}
                                        >
                                            <Plus className={"w-[20px] h-[20px]"}/>Create Idea
                                        </Button>
                                    </div>
                                </React.Fragment>

                            )
                        }}

                        >
                        {roadmapList}
                    </Board>
                }


                {/*<div className={"flex gap-[18px] flex-col  items-start "}>*/}

                {/*{(roadmapList.columns || []).map((x, i) =>{*/}
                {/*    return(*/}
                {/*        <div key={i}>*/}
                {/*            <Card key={x.id} className={"w-[342px]"}>*/}
                {/*                <CardHeader className={"p-4 px-[9px]"}>*/}
                {/*                    <CardTitle className={"flex items-center gap-2 text-sm font-semibold px-[7px]"}>*/}
                {/*                        <Circle fill={x.color_code} stroke={x.color_code} className={"w-[10px] h-[10px]"} />*/}
                {/*                        {x.title}*/}
                {/*                    </CardTitle>*/}
                {/*                </CardHeader>*/}
                {/*                <CardContent className={"px-[9px] pb-3 border-b gap-3 flex flex-col"}>*/}
                {/*                    {x.ideas.map((y, index) => {*/}
                {/*                        return(*/}
                {/*                            <Card key={index} onClick={openDetailsSheet} className={"mb-3"}>*/}
                {/*                                <CardHeader className={"flex-row gap-2 p-2 pb-3"}>*/}
                {/*                                    <Button variant={"outline hover:transparent"} className={"text-sm font-medium border px-[9px] py-1 w-[28px] h-[28px]"}>{y.vote}</Button>*/}
                {/*                                    <h3 className={"text-sm font-normal"}>{y.title}</h3>*/}
                {/*                                </CardHeader>*/}
                {/*                                <CardContent className={"px-[20px] pb-4"}>*/}
                {/*                                    <div className={"flex"}>*/}
                {/*                                        {*/}
                {/*                                            ((y && y.topic) || []).map((x, i) => {*/}
                {/*                                                return (*/}

                {/*                                                    <div className={"text-xs flex"}>{x.title}</div>*/}

                {/*                                                )*/}
                {/*                                            })*/}
                {/*                                        }*/}
                {/*                                    </div>*/}

                {/*                                </CardContent>*/}
                {/*                            </Card>*/}
                {/*                        )*/}
                {/*                    })}*/}
                {/*                </CardContent>*/}
                {/*                <CardFooter className={"px-4 py-3"}>*/}
                {/*                    <Button*/}
                {/*                        variant={"ghost hover:bg-transparent"}*/}
                {/*                        className={`gap-2 p-0 ${theme === "dark" ? "" : "text-muted-foreground"} text-sm font-semibold h-auto`}*/}
                {/*                        onClick={() => onType('createNewRoadMapIdeas')}*/}
                {/*                    >*/}
                {/*                        <Plus className={"w-[20px] h-[20px]"} />Create Idea*/}
                {/*                    </Button>*/}
                {/*                </CardFooter>*/}
                {/*            </Card>*/}
                {/*        </div>*/}
                {/*    )*/}
                {/*})}*/}


                {/*</div>*/}

            </div>
    );
    }
;

export default Roadmap;