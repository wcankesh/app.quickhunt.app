import React, {Fragment, useState, useEffect} from 'react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "../ui/card";
import {Circle, Plus} from "lucide-react";
import {Button} from "../ui/button";
import {useTheme} from "../theme-provider";
import RoadMapSidebarSheet from "./RoadMapSidebarSheet";
import {useSelector} from "react-redux";
import {ApiService} from "../../utils/ApiService";
import { Container, Draggable } from "react-smooth-dnd";
import cloneDeep from "lodash.clonedeep"
import CreateIdea from "../Ideas/CreateIdea";

const Roadmap = () => {
    const { theme } = useTheme()
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const [isSheetOpen, setSheetOpen] = useState(false);
    const [isSheetOpenCreate, setSheetOpenCreate] = useState(false);
    const [noStatus, setNoStatus] = useState([])
    const [roadmapList, setRoadmapList] = useState([])
    const [selectedIdea, setSelectedIdea] = useState({});
    const [isUpdateIdea, setIsUpdateIdea] = useState(false);
    const [oldSelectedIdea, setOldSelectedIdea] = useState({});
    const [isNoStatus, setIsNoStatus] = useState(false);
    const [ideasList, setIdeasList] = useState([]);
    const [selectedRoadmap, setSelectedRoadmap] = useState({});
    const [isCreateIdea, setIsCreateIdea] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const apiService = new ApiService();

    const openSheet = () => setSheetOpen(true);
    const closeSheet = () => setSheetOpen(false);

    const openCreateIdea = () => setSheetOpenCreate(true);
    const closeCreateIdea = () => setSheetOpenCreate(false);

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
        if(data.status === 200){
            setRoadmapList(data.data.data)
            setNoStatus(data.data.no_status)
            setIsLoading(false)
        } else {
            setIsLoading(false)
        }
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

    const applyDrag = (arr, dragResult, columnId) => {
        const { removedIndex, addedIndex, payload } = dragResult;
        if (removedIndex === null && addedIndex === null) return arr;

        const result = cloneDeep([...arr]);
        let itemToAdd = {...payload, roadmap_id: columnId};

        if (removedIndex !== null) {
            itemToAdd = result.splice(removedIndex, 1)[0];
        }

        if (addedIndex !== null) {
            result.splice(addedIndex, 0, itemToAdd);

        }

        return result;
    };

    const callApi = async (columnId, payload) => {
        let formData = new FormData();
        formData.append("roadmap_id", columnId );
        const data = await apiService.updateIdea(formData, payload.id)
        if(data.status === 200){
           // successMsg("Roadmap Update successfully")
        } else {

        }
    }

    const onColumnDrop = (dropResult) => {
        let clone = cloneDeep([...roadmapList]);
        clone = applyDrag(clone, dropResult, '');
        setRoadmapList(clone)
    }

    const onCardDrop = (columnId, dropResult) => {
        if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
            let clone = cloneDeep([...roadmapList]);
            const column = clone.filter((p) => p.id === columnId)[0];
            const columnIndex = clone.indexOf(column);
            const newColumn = cloneDeep(Object.assign({}, column));
            newColumn.ideas = cloneDeep(applyDrag(newColumn.ideas, dropResult, columnId));
            clone.splice(columnIndex, 1, newColumn);

            setRoadmapList(cloneDeep(clone))
            if (dropResult.addedIndex !== null) {
                console.log("clone",clone)
                callApi(columnId, dropResult.payload)
            }


        }
    }

    const getCardPayload = (columnId, index) => {
        return cloneDeep(roadmapList).filter((p) => p.id === columnId)[0].ideas[index];
    };

    return (
        <div className={"height-inherit h-svh overflow-scroll overflow-y-auto xl:container-secondary xl:max-w-[1605px] lg:container lg:max-w-[992px] md:container md:max-w-[768px] sm:container sm:max-w-[639px] xs:container xs:max-w-[475px] p-8"}>
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
            <Container
                orientation="horizontal"
                onDrop={onColumnDrop}
                dragHandleSelector=".column-drag-handle"
                dropPlaceholder={{
                    animationDuration: 150,
                    showOnTop: true,
                    className: "cards-drop-preview"
                }}
            >
            <div className={"flex gap-[18px] items-start width-fit-content"}>
                {(roadmapList || []).map((x, i) =>{
                    return(
                        <div key={i}>
                            <Draggable key={x.id}>
                                <Card key={x.id} className={"w-[342px]"}>
                                    <CardHeader className={"p-4 px-[9px]"}>
                                        <CardTitle className={"flex items-center gap-2 text-sm font-semibold px-[7px]"}>
                                            <Circle fill={x.color_code} stroke={x.color_code} className={"w-[10px] h-[10px]"} />
                                            {x.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className={"px-[9px] pb-3 border-b gap-3 flex flex-col"}>
                                        <Container
                                            {...x.props}
                                            groupName="col"
                                            onDrop={(e) => onCardDrop(x.id, e)}
                                            //    onDragEnd={(e) => onCardDropEnd(x.id, e)}
                                            getChildPayload={(index) =>
                                                getCardPayload(x.id, index)
                                            }
                                            dragClass="card-ghost"
                                            dropClass="card-ghost-drop"
                                            dropPlaceholder={{
                                                animationDuration: 150,
                                                showOnTop: true,
                                                className: "drop-preview"
                                            }}
                                            dropPlaceholderAnimationDuration={200}
                                        >

                                            {(x && x.ideas || []).map((y, index) => {
                                                return(
                                                    <Draggable key={y.id}>
                                                        <Card key={index} onClick={() => openDetailsSheet(x, y)} className={"mb-3 cursor-grab"}>
                                                            <CardHeader className={"flex-row gap-2 p-2 pb-3"}>
                                                                <Button variant={"outline hover:transparent"} className={"text-sm font-medium border px-[9px] py-1 w-[28px] h-[28px]"}>{y.vote}</Button>
                                                                <h3 className={"text-sm font-normal"}>{y.title}</h3>
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
                                                    </Draggable>
                                                )
                                            })}
                                        </Container>
                                    </CardContent>
                                    <CardFooter className={"px-4 py-3"}>
                                        <Button
                                            variant={"ghost hover:bg-transparent"}
                                            className={`gap-2 p-0 ${theme === "dark" ? "" : "text-muted-foreground"} text-sm font-semibold h-auto`}
                                            onClick={() => onCreateIdea(x)}
                                        >
                                            <Plus className={"w-[20px] h-[20px]"} />Create Idea
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </Draggable>
                        </div>
                    )
                })}

            </div>
            </Container>

        </div>
    );
};

export default Roadmap;