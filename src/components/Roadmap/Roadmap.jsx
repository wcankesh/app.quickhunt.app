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
import {EmptyDataContent} from "../Comman/EmptyDataContent";

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
    const [emptyContentBlock, setEmptyContentBlock] = useState(true);
    const [originalIdea, setOriginalIdea] = useState({});

    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);

    const emptyContent = (status) => {setEmptyContentBlock(status);};

    const openSheet = (type) => setIsSheetOpen({ open: true, type });
    const closeSheet = () => setIsSheetOpen({ open: false, type: "" });

    const openDetailsSheet = (record) => {
        const findRoadmap = roadmapList.columns.find((x) => x.id === record.roadmap_id)
        setSelectedIdea(record)
        setOriginalIdea(record)
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
            const hasNoCards = roadmapListClone.every((item) => !item.cards || item.cards.length === 0);
            if (hasNoCards || !data.data || data.data.length === 0) {
                emptyContent(true);
            } else {
                emptyContent(false);
            }
        } else {
            setIsLoading(false)
            emptyContent(true);
        }
    }

    const setRoadmapRank = async (updatedCards, columnId) => {
        const rankPayload = updatedCards.map((card, index) => ({
            id: card.id,
            roadmap_id: columnId,
            rank: index,
        }));
        const data = await apiService.setRoadmapRank({ rank: rankPayload });
        if (data.status === 200) {
           // toast({ description: data.message });
        } else {
            toast({ variant: "destructive", description: data.message });
        }
    };

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
        const updatedBoard = moveCard(roadmapList, source, destination);
        const updatedColumns = [...updatedBoard.columns];

        const sourceIndex = updatedColumns.findIndex((col) => col.id == source.fromColumnId);
        const destinationIndex = updatedColumns.findIndex((col) => col.id == destination.toColumnId);

        if (source.fromColumnId !== destination.toColumnId) {
            if (sourceIndex !== -1) {
                const updatedSourceCards = updatedColumns[sourceIndex].cards.filter(
                    (card) => card.id !== _card.id
                );
                updatedColumns[sourceIndex] = {
                    ...updatedColumns[sourceIndex],
                    cards: updatedSourceCards,
                    ideas: updatedSourceCards,
                };
            }
        }
        if (destinationIndex !== -1) {
            let destinationCards = [...updatedColumns[destinationIndex].cards];
            destinationCards = destinationCards.map((card, index) => ({
                ...card,
                rank: index,
                roadmap_id: destination.toColumnId
            }));
            updatedColumns[destinationIndex] = {
                ...updatedColumns[destinationIndex],
                cards: destinationCards,
                ideas: destinationCards,
            };
        }
        setRoadmapList({ columns: updatedColumns });
        callApi(destination.toColumnId, _card.id);
        setRoadmapRank(updatedColumns[destinationIndex].cards, destination.toColumnId);

        const updatedCard = {
            ..._card,
            roadmap_id: destination.toColumnId,
        };
        setSelectedIdea(updatedCard);
    };

    const onCreateIdea = (mainRecord) => {
        setSelectedRoadmap(mainRecord)
        openSheet("create");
    }

    const EmptyRoadmapContent = [
        {
            title: "Create First Roadmap",
            description: `Don’t keep users guessing! Start your roadmap to outline future plans and showcase it on your website for everyone to see.`,
            btnText: [
                {title: "Create Roadmap", redirect: "", icon: <Plus size={18} className={"mr-1"} strokeWidth={3}/>},
            ],
        },
        {
            title: "Create Roadmap Statuses",
            description: `Define statuses like "Planned," "In Progress," and "Completed" to keep users informed about the progress of your roadmap items.`,
            btnText: [
                {title: "Create Statuses", redirect: "", icon: <Plus size={18} className={"mr-1"} strokeWidth={3}/>},
            ],
        },
        {
            title: "Turn Ideas into a Roadmap",
            description: `Easily transform shared ideas into actionable roadmap items to plan and showcase your product's future.`,
            btnText: [
                {title: "Move Ideas to Roadmap", redirect: "", icon: <Plus size={18} className={"mr-1"} strokeWidth={3}/>},
            ],
        },
        {
            title: "Create Widget",
            description: `Add a widget to display your Roadmap on your website with options like embed, popover, modal, or sidebar.`,
            btnText: [
                {title: "Create Widget", redirect: "", icon: <Plus size={18} className={"mr-1"} strokeWidth={3}/>},
            ],
        },
        {
            title: "Create Announcement",
            description: `Share updates or milestones from your roadmap with users to keep them engaged and in the loop.`,
            btnText: [
                {title: "Create Announcement", redirect: "", icon: <Plus size={18} className={"mr-1"} strokeWidth={3}/>},
            ],
        },
        {
            title: "Explore Examples",
            description: `Discover how platforms like Utterbond, Webform, and Rivyo effectively manage their roadmaps.`,
            btnText: [
                {title: "Utterbond", redirect: ""},
                {title: "Webform", redirect: ""},
                {title: "Rivyo", redirect: ""},
            ],
        },
    ];

    return (
        <div
            // className={"roadmap-container height-inherit h-svh overflow-y-auto container-secondary xl:max-w-[1605px] lg:max-w-[1230px] md:max-w-[960px] max-w-[639px]"}>
            className={"roadmap-container height-inherit h-svh max-w-[100%] pl-8 p-r"}>
            {isSheetOpen.open && isSheetOpen.type === "update" && (
            <UpdateRoadMapIdea
                isOpen={isSheetOpen.open}
                onClose={closeSheet}
                selectedIdea={selectedIdea}
                originalIdea={originalIdea}
                setOriginalIdea={setOriginalIdea}
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
                        :  roadmapList.columns.length === 0 ? (
                            <div className="text-center mt-8 text-gray-500">
                                No data available.
                            </div>
                        ) : <Board
                            allowAddColumn
                            disableColumnDrag
                            onCardDragEnd={handleCardMove}
                            // onColumnDragEnd={handleColumnMove}
                            allowAddCard={{on: "bottom"}}
                            addCard={{on: "bottom"}}
                            renderCard={(y) => {
                                const boardTitle =
                                    allStatusAndTypes?.boards?.find((board) => board.id === y.board)?.title || "";
                                return (
                                    <Fragment>
                                        <Card onClick={() => openDetailsSheet(y)} className={"mb-3"}>
                                            <CardHeader className={"gap-2 p-2 pb-3"}>
                                                {
                                                    y && y?.cover_image &&
                                                    <img className="object-center object-cover w-full h-[125px]"
                                                         src={y?.cover_image} alt={""}/>
                                                }
                                                <div className={"space-y-1"}>
                                                    <h3 className={"text-sm font-normal m-0"}>{y.title}</h3>
                                                    <div className={"flex justify-between gap-2"}>
                                                        {
                                                            boardTitle?.length ? <div className={"h-7 p-1 px-2 text-xs font-medium text-muted-foreground border border-input rounded-lg"}>{boardTitle}</div> : ""
                                                        }
                                                    <Button variant={"outline hover:transparent"}
                                                            className={"text-sm font-normal border px-[9px] py-1 w-7 h-7"}>{y.vote}</Button>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className={"px-[20px] pb-4"}>
                                                <div className={"flex flex-wrap gap-1"}>
                                                    {
                                                        ((y && y.topic) || []).map((x, i) => {
                                                            return (
                                                                <div key={i} className={"text-xs flex"}>{x.title}</div>
                                                            )
                                                        })
                                                    }
                                                </div>

                                            </CardContent>
                                        </Card>
                                    </Fragment>
                                )
                            }}

                            renderColumnHeader={({title, color_code, id, cards}) => {

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
                                            <Button
                                                variant={"ghost hover:bg-transparent"}
                                                className={`p-1 h-auto border`}
                                                onClick={() => onCreateIdea(id)}
                                            >
                                                <Plus size={20} strokeWidth={2}/>
                                            </Button>
                                        </div>
                                        {cardCount === 0 ? (
                                            <div className="text-center mt-4 text-gray-500">
                                                No data.
                                            </div>
                                        ) : ""}
                                    </React.Fragment>
                                )
                            }}
                        >
                            {roadmapList}
                        </Board>
                }
            </div>
            {
                (isLoading || !emptyContentBlock) ? "" :
                    <div className={"max-w-[1600px] w-full pl-[10px]"}>
                        <EmptyDataContent data={EmptyRoadmapContent} onClose={() => emptyContent(false)}/>
                    </div>
            }
        </div>
    );
};

export default Roadmap;