import React, {useState, useEffect, Fragment} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "../ui/card";
import {Circle, Plus} from "lucide-react";
import {Button} from "../ui/button";
import UpdateRoadMapIdea from "./UpdateRoadMapIdea";
import {useSelector} from "react-redux";
import {ApiService} from "../../utils/ApiService";
import Board, {moveCard} from '@asseinfo/react-kanban'
import "@asseinfo/react-kanban/dist/styles.css";
import CreateRoadmapIdea from "./CreateRoadmapIdea";
import {useToast} from "../ui/use-toast";
import {CommSkel} from "../Comman/CommSkel";

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
    const {toast} = useToast()
    const apiService = new ApiService();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);

    const [roadmapList, setRoadmapList] = useState({columns: []})
    const [selectedIdea, setSelectedIdea] = useState({});
    const [selectedRoadmap, setSelectedRoadmap] = useState({});
    const [isSheetOpen, setIsSheetOpen] = useState({ open: false, type: "" });
    const [isLoading, setIsLoading] = useState(false);

    const openSheet = (type) => setIsSheetOpen({ open: true, type });
    const closeSheet = () => setIsSheetOpen({ open: false, type: "" });

    const openDetailsSheet = (record) => {
        const findRoadmap = roadmapList.columns.find((x) => x.id === record.roadmap_id)
        setSelectedIdea(record)
        setSelectedRoadmap(findRoadmap)
        openSheet("update");
    };

    useEffect(() => {
        if(projectDetailsReducer.id){
            getRoadmapIdea()
        }
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
        setSelectedRoadmap(mainRecord)
        openSheet("create");
    }

    return (
        <div
            // className={"roadmap-container height-inherit h-svh overflow-y-auto container-secondary xl:max-w-[1605px] lg:max-w-[1230px] md:max-w-[960px] max-w-[639px]"}>
            className={"roadmap-container height-inherit h-svh max-w-[100%] pl-8 p-r"}>
            {isSheetOpen.open && isSheetOpen.type === "update" && (
            <UpdateRoadMapIdea
                isOpen={isSheetOpen.open}
                onClose={closeSheet}
                selectedIdea={selectedIdea}
                setSelectedIdea={setSelectedIdea}
                setSelectedRoadmap={setSelectedRoadmap}
                selectedRoadmap={selectedRoadmap}
                roadmapList={roadmapList}
                setRoadmapList={setRoadmapList}
            />
            )}
            {isSheetOpen.open && isSheetOpen.type === "create" && (
            <CreateRoadmapIdea
                isOpen={isSheetOpen.open}
                onClose={closeSheet}
                selectedRoadmap={selectedRoadmap}
                roadmapList={roadmapList}
                setRoadmapList={setRoadmapList}

            />
            )}
            <div className={"p-4 px-2.5"}>
                <div className={"flex flex-col gap-y-0.5"}>
                    <h1 className="text-2xl font-normal flex-initial w-auto">Roadmap</h1>
                    <p className={"text-sm text-muted-foreground"}>Create and display a roadmap on your website to keep users updated on the project's progress.</p>
                </div>
            </div>
            <div className={"py-[11px] pt-[3px]"}>
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
                        :  <Board
                            allowAddColumn
                            disableColumnDrag
                            onCardDragEnd={handleCardMove}
                            // onColumnDragEnd={handleColumnMove}
                            allowAddCard={{on: "bottom"}}
                            addCard={{on: "bottom"}}
                            renderCard={(y) => {
                                return (
                                    <Fragment>
                                        <Card onClick={() => openDetailsSheet(y)} className={"mb-3"}>
                                            <CardHeader className={"gap-2 p-2 pb-3"}>
                                                {
                                                    y && y?.cover_image &&
                                                    <img className="object-center object-cover w-full h-[125px]"
                                                         src={y?.cover_image} alt={""}/>
                                                }
                                                <div className={"flex gap-2"}>
                                                    <Button variant={"outline hover:transparent"}
                                                            className={"text-sm font-normal border px-[9px] py-1 w-[28px] h-[28px]"}>{y.vote}</Button>
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
                                    </Fragment>
                                )
                            }}

                            renderColumnHeader={({title, color_code, id}) => {

                                const column = roadmapList?.columns?.find(col => col.id === id);
                                const cardCount = column ? column?.cards?.length : 0;

                                return (
                                    <React.Fragment>
                                        <div className={"flex justify-between items-center gap-2 border-b pb-4"}>
                                        <CardTitle
                                            className={"flex items-center gap-2 text-sm font-medium px-[7px]"}>
                                            <Circle fill={color_code} stroke={color_code}
                                                    className={"w-[10px] h-[10px]"}/>
                                            {title} ({cardCount})
                                        </CardTitle>
                                        {/*<div className={"add-idea"}>*/}
                                        <div className={""}>
                                            <Button
                                                variant={"ghost hover:bg-transparent"}
                                                className={`p-1 h-auto border`}
                                                onClick={() => onCreateIdea(id)}
                                            >
                                                <Plus size={20} strokeWidth={2}/>
                                            </Button>
                                        </div>
                                        </div>
                                    </React.Fragment>
                                )
                            }}

                        >
                            {roadmapList}
                        </Board>
                }
            </div>

            {/*<div className={"flex gap-[18px] flex-col  items-start "}>*/}

            {/*{(roadmapList.columns || []).map((x, i) =>{*/}
            {/*    return(*/}
            {/*        <div key={i}>*/}
            {/*            <Card key={x.id} className={"w-[342px]"}>*/}
            {/*                <CardHeader className={"p-4 px-[9px]"}>*/}
            {/*                    <CardTitle className={"flex items-center gap-2 text-sm font-medium px-[7px]"}>*/}
            {/*                        <Circle fill={x.color_code} stroke={x.color_code} className={"w-[10px] h-[10px]"} />*/}
            {/*                        {x.title}*/}
            {/*                    </CardTitle>*/}
            {/*                </CardHeader>*/}
            {/*                <CardContent className={"px-[9px] pb-3 border-b gap-3 flex flex-col"}>*/}
            {/*                    {x.ideas.map((y, index) => {*/}
            {/*                        return(*/}
            {/*                            <Card key={index} onClick={openDetailsSheet} className={"mb-3"}>*/}
            {/*                                <CardHeader className={"flex-row gap-2 p-2 pb-3"}>*/}
            {/*                                    <Button variant={"outline hover:transparent"} className={"text-sm font-normal border px-[9px] py-1 w-[28px] h-[28px]"}>{y.vote}</Button>*/}
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
            {/*                        className={`gap-2 p-0 ${theme === "dark" ? "" : "text-muted-foreground"} text-sm font-medium h-auto`}*/}
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