import React, {useState, useEffect, Fragment} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "../ui/card";
import {Circle, Plus} from "lucide-react";
import {Button} from "../ui/button";
import {useTheme} from "../theme-provider";
import RoadMapSidebarSheet from "./RoadMapSidebarSheet";
import {useSelector} from "react-redux";
import {ApiService} from "../../utils/ApiService";
import Board, {moveCard, allowAddColumn} from '@asseinfo/react-kanban'
import "@asseinfo/react-kanban/dist/styles.css";
import CreateIdea from "./CreateIdea";
import {useToast} from "../ui/use-toast";
import {CommSkel} from "../Comman/CommSkel";
import EmptyData from "../Comman/EmptyData";

const loading = {
    columns: Array.from({ length: 5 }, (_, index) => ({
        id: index + 1,
        title: "",
        cards: Array.from({ length: 5 }, (_, i) => ({
            id: i + 1,
            title: ""
        }))
    }))
};

const Roadmap = () => {
    const {theme} = useTheme()
    const {toast} = useToast()
    const apiService = new ApiService();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const [isSheetOpen, setSheetOpen] = useState(false);
    const [isSheetOpenCreate, setSheetOpenCreate] = useState(false);
    const [noStatus, setNoStatus] = useState([])
    const [roadmapList, setRoadmapList] = useState({columns: []})
    const [selectedIdea, setSelectedIdea] = useState({});
    const [isUpdateIdea, setIsUpdateIdea] = useState(false);
    const [isNoStatus, setIsNoStatus] = useState(false);
    const [ideasList, setIdeasList] = useState([]);
    const [selectedRoadmap, setSelectedRoadmap] = useState({});
    const [isCreateIdea, setIsCreateIdea] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const openSheet = () => setSheetOpen(true);
    const closeSheet = () => setSheetOpen(false);

    const openCreateIdea = () => setSheetOpenCreate(true);
    const closeCreateIdea = () => setSheetOpenCreate(false);

    const openDetailsSheet = (record) => {
        const findRoadmap = roadmapList.columns.find((x) => x.id === record.roadmap_id)
        setIsUpdateIdea(true);
        setSelectedIdea(record)
        setSelectedRoadmap(findRoadmap)
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
            toast({description: data.message})
        } else {

        }
    }

    const handleCardMove = (_card, source, destination) => {
        const updatedBoard = moveCard(roadmapList, source, destination)
        callApi(destination.toColumnId, _card.id)
        setRoadmapList(updatedBoard)
    }

    const onCreateIdea = (mainRecord) => {
        setIsCreateIdea(true);
        setIdeasList(mainRecord.ideas || []);
        setSelectedRoadmap(mainRecord)
        openCreateIdea()
    }

    return (
        <div
            // className={"roadmap-container height-inherit h-svh  overflow-y-auto xl:container-secondary xl:max-w-[1605px] lg:container lg:max-w-[992px] md:container md:max-w-[768px] sm:container max-w-[639px]"}>
            className={"roadmap-container height-inherit h-svh overflow-y-auto container-secondary xl:max-w-[1605px] lg:max-w-[1230px] md:max-w-[960px] max-w-[639px]"}>
            <RoadMapSidebarSheet
                isOpen={isSheetOpen}
                onOpen={openSheet}
                onClose={closeSheet}
                selectedIdea={selectedIdea}
                setSelectedIdea={setSelectedIdea}
                setSelectedRoadmap={setSelectedRoadmap}
                selectedRoadmap={selectedRoadmap}
                roadmapList={roadmapList}
                setRoadmapList={setRoadmapList}
            />
            <CreateIdea
                isOpen={isSheetOpenCreate}
                onOpen={openCreateIdea}
                onClose={closeCreateIdea}
                closeCreateIdea={closeCreateIdea}
                selectedRoadmap={selectedRoadmap}
                roadmapList={roadmapList}
                setRoadmapList={setRoadmapList}

            />
            <div className={"p-4"}><h1 className={"text-2xl font-medium"}>Roadmap</h1></div>
            <div className={"p-[11px] pt-[3px]"}>
            {
                isLoading ?
                     <Board
                        allowAddColumn
                        disableColumnDrag
                        allowAddCard={{on: "bottom"}}
                        addCard={{on: "bottom"}}
                        renderCard={(y) => {
                            return (
                                <Card  className={"mb-3"}>
                                    {CommSkel.commonParagraphThreeIcon}
                                </Card>
                            )
                        }}

                        renderColumnHeader={({ id}) => {
                            return (
                                <React.Fragment>
                                    {CommSkel.commonParagraphOne}
                                    <div className={"add-idea"}>
                                        {CommSkel.commonParagraphOne}
                                    </div>
                                </React.Fragment>

                            )
                        }}
                    >
                        {loading}
                    </Board>
                    : roadmapList.columns.length > 0 ? <Board
                    allowAddColumn
                    disableColumnDrag
                    onCardDragEnd={handleCardMove}
                    // onColumnDragEnd={handleColumnMove}
                    allowAddCard={{on: "bottom"}}
                    addCard={{on: "bottom"}}
                    renderCard={(y) => {
                        return (
                            <Card onClick={() => openDetailsSheet(y)} className={"mb-3"}>
                                            <CardHeader className={"gap-2 p-2 pb-3"}>
                                                {
                                                    y && y?.cover_image &&
                                                    <img className="object-center object-cover w-full h-[125px]"
                                                         src={y?.cover_image} alt={""}/>
                                                }
                                                <div className={"flex gap-2"}>
                                                    <Button variant={"outline hover:transparent"}
                                                            className={"text-sm font-medium border px-[9px] py-1 w-[28px] h-[28px]"}>{y.vote}</Button>
                                                    <h3 className={"text-sm font-normal m-0"}>{y.title}</h3>
                                                </div>
                                            </CardHeader>
                                            <CardContent className={"px-[20px] pb-4"}>
                                                <div className={"flex flex-wrap gap-1"}>
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

                    renderColumnHeader={({title, color_code, id}) => {
                        return (
                            <React.Fragment>
                                        <CardTitle
                                            className={"flex items-center gap-2 text-sm font-semibold px-[7px] mb-[16px]"}>
                                            <Circle fill={color_code} stroke={color_code}
                                                    className={"w-[10px] h-[10px]"}/>
                                            {title}
                                        </CardTitle>
                                <div className={"add-idea"}>
                                            <Button
                                                variant={"ghost hover:bg-transparent"}
                                                className={`gap-2 p-0 ${theme === "dark" ? "" : "text-muted-foreground"} text-sm font-semibold h-auto`}
                                                onClick={() => onCreateIdea(id)}
                                            >
                                                <Plus className={"w-[20px] h-[20px]"}/>Create Idea
                                            </Button>
                                </div>
                            </React.Fragment>

                        )
                    }}

                >
                    {roadmapList}
                </Board> : <span className={"font-medium"}>No Data</span>
            }
            </div>

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
};

export default Roadmap;