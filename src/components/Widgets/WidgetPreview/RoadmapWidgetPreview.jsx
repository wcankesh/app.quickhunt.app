import React, {Fragment, useEffect, useState} from 'react';
import {Card} from "../../ui/card";
import {Skeleton} from "../../ui/skeleton";
import {AspectRatio} from "@radix-ui/react-aspect-ratio";
import {useSelector} from "react-redux";
import {apiService} from "../../../utils/constent";

const RoadmapWidgetPreview = ({widgetsSetting}) => {
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);

    const [roadmapList, setRoadmapList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (projectDetailsReducer.id) {
            getRoadmapIdea()
        }
    }, [projectDetailsReducer.id])

    const getRoadmapIdea = async () => {
        setIsLoading(true)
        const payload = {
            projectId: projectDetailsReducer.id,
            roadmapId: "",
            page: "",
            limit: "",
        }
        const data = await apiService.getRoadmapIdea(payload)
        setIsLoading(false)
        if (data.success) {
            setRoadmapList(data.data.data);
        }
    }

    const cardClass = `bg-white text-black border-[#e2e8f0]`

    return (
        <div className={"px-3 flex flex-col h-full"}>
            <Card className={`p-4 ${cardClass} max-h-full`}>
                {
                    isLoading ? <div className="flex gap-4 items-start overflow-auto max-h-full">
                            {Array.from(Array(5)).map((_, r) => {
                                const loadCount = (r === 0 || r === 3) ? 3 : (r === 2 || r === 5) ? 5 : 4;
                                return (
                                    <div key={`roadmapLoad_${r}`} className="shrink-0">
                                        <Card className={`${cardClass} py-3 px-2 shadow-inner min-w-60`}>
                                            <h4 className={`text-sm text-slate-700 font-medium flex gap-2 items-center`}>
                                                <Skeleton className="h-3 w-3/5 bg-[#f1f5f9]"/></h4>
                                            <div className={"flex gap-2 flex-col mt-4"}>
                                                {
                                                    Array.from(Array(loadCount)).map((_, p) => {
                                                        return (
                                                            <Card className={`p-2 ${cardClass}`}
                                                                  key={`roadmapLoad_${r}_${p}`}>
                                                                <div className="flex gap-2 items-center">
                                                                    <Skeleton className="w-7 h-7 rounded bg-[#f1f5f9]"/>
                                                                    <Skeleton className="h-4 w-4/5 bg-[#f1f5f9]"/>
                                                                </div>
                                                                <div className="flex flex-col gap-2 mt-3 mb-1">
                                                                    <Skeleton className="h-2 w-full bg-[#f1f5f9]"/>
                                                                    <Skeleton className="h-2 w-3/5 bg-[#f1f5f9]"/>
                                                                </div>
                                                            </Card>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </Card>
                                    </div>
                                )
                            })}
                        </div> :
                        <div className="flex gap-4 items-start overflow-auto max-h-full">
                            {
                                (roadmapList || []).map((data) => {
                                    return (
                                        <div key={`roadmap_${data.id}`} className="shrink-0 ">
                                            <Card className={`py-3 px-2 shadow-inner ${cardClass}`}>
                                                <h4 className={"text-sm text-slate-700 font-medium flex gap-2 items-center"}>
                                                    <span className={"w-2.5 h-2.5 rounded-full"}
                                                          style={{backgroundColor: data.colorCode}}/>{data.title} ({data.ideas.length})
                                                </h4>
                                                <div className={"flex gap-2 flex-col mt-4"}>
                                                    {
                                                        data.ideas.length ? <Fragment>
                                                            {
                                                                (data.ideas || []).map((idea) => {
                                                                    return (
                                                                        <Card
                                                                            className={`cursor-pointer w-[320px] ${cardClass}`}
                                                                            key={`roadmap_idea_${idea.id}`}>
                                                                            {
                                                                                (idea.coverImage !== '' && widgetsSetting.roadmapImage === 1) &&
                                                                                <AspectRatio ratio={10 / 5}
                                                                                             className={`bg-muted rounded-ss-md rounded-se-md mb-1 ${cardClass}`}>
                                                                                    <img src={idea.coverImage} alt={idea.title}
                                                                                         className="w-full h-full object-contain object-center"/>
                                                                                </AspectRatio>
                                                                            }
                                                                            <div className="flex gap-2 items-center px-2 my-2">
                                                                                <div className={"w-7 h-7 border border-slate-300 rounded font-normal flex items-center justify-center text-slate-700"}>{idea.vote}</div>
                                                                                <div className="flex-1 w-full text-sm text-slate-900">{idea.title}</div>
                                                                            </div>
                                                                            {
                                                                                idea.topic.length ?
                                                                                    <div
                                                                                        className="flex flex-wrap gap-2 items-center mt-1 mb-3 px-2">
                                                                                        {
                                                                                            (idea.topic || []).map((topic) => {
                                                                                                return (
                                                                                                    <span
                                                                                                        key={`idea_topic_${topic.id}`}
                                                                                                        className="text-xs text-slate-700">{topic.title}</span>
                                                                                                )
                                                                                            })
                                                                                        }
                                                                                    </div> : ''
                                                                            }
                                                                        </Card>
                                                                    )
                                                                })
                                                            }
                                                        </Fragment> : <span className="text-sm text-slate-300">No In Review posts</span>
                                                    }
                                                </div>
                                            </Card>
                                        </div>
                                    )
                                })
                            }
                        </div>
                }
            </Card>
        </div>
    );
};

export default RoadmapWidgetPreview;