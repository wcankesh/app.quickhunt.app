import React, {Fragment, useEffect, useState} from 'react';
import {Card} from "../../ui/card";
import {Skeleton} from "../../ui/skeleton";
import {AspectRatio} from "@radix-ui/react-aspect-ratio";
import {useSelector} from "react-redux";
import {ApiService} from "../../../utils/ApiService";

const RoadmapWidgetPreview = ({widgetsSetting}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [roadmapList, setRoadmapList] = useState([]);
    const apiService = new ApiService();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
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
            setRoadmapList(data.data.data);
            setIsLoading(false)
        } else {
            setIsLoading(false)
        }
    }
    return (
        <div className={" px-3"}>
            <Card className="p-4">
                {
                    isLoading ? <div className="flex gap-4 items-start overflow-auto ">
                            {Array.from(Array(5)).map((_, r) => {
                                const loadCount = (r === 0 || r === 3) ? 3 : (r === 2 || r === 5) ? 5 : 4;
                                return (
                                    <div key={`roadmapLoad_${r}`} className="shrink-0">
                                        <Card className="py-3 px-2 shadow-inner min-w-60">
                                            <h4 className={"text-sm text-slate-700 font-semibold flex gap-2 items-center"}><Skeleton className="h-3 w-3/5"/></h4>
                                            <div className={"flex gap-2 flex-col mt-4"}>
                                                {
                                                    Array.from(Array(loadCount)).map((_, p) => {
                                                        return (
                                                            <Card className="p-2" key={`roadmapLoad_${r}_${p}`}>
                                                                <div className="flex gap-2 items-center">
                                                                    <Skeleton className="w-7 h-7 rounded"/>
                                                                    <Skeleton className="h-4 w-4/5"/>
                                                                </div>
                                                                <div className="flex flex-col gap-2 mt-3 mb-1">
                                                                    <Skeleton className="h-2 w-full"/>
                                                                    <Skeleton className="h-2 w-3/5"/>
                                                                </div>
                                                            </Card>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </Card>
                                    </div>
                                )
                            })
                            }
                        </div> :
                        <div className="flex gap-4 items-start overflow-auto">
                            {
                                (roadmapList || []).map((data, Rindex) => {
                                    return (
                                        <div key={`roadmap_${data.id}`} className="shrink-0 ">
                                            <Card className="py-3 px-2 shadow-inner ">
                                                <h4 className={"text-sm text-slate-700 font-semibold flex gap-2 items-center"}>
                                                    <span className={"w-2.5 h-2.5 rounded-full"} style={{backgroundColor: data.color_code}}/>{data.title} ({data.ideas.length})</h4>
                                                <div className={"flex gap-2 flex-col mt-4"}>
                                                    {
                                                        data.ideas.length ? <Fragment>
                                                            {
                                                                (data.ideas || []).map((idea, Dindex) => {
                                                                    return (
                                                                        <Card className="cursor-pointer w-[320px]" key={`roadmap_idea_${idea.id}`}>
                                                                            {
                                                                                (idea.cover_image !== '' && widgetsSetting.roadmap_image === 1) &&
                                                                                <AspectRatio ratio={10 / 5} className="bg-muted rounded-ss-md rounded-se-md mb-1">
                                                                                    <img src={idea.cover_image} alt={idea.title} className="w-full h-full object-contain object-center"/>
                                                                                </AspectRatio>
                                                                            }
                                                                            <div className="flex gap-2 items-center px-2 my-2">
                                                                                <div className={"w-7 h-7 border border-slate-300 rounded font-medium flex items-center justify-center text-slate-700"}>{idea.vote}</div>
                                                                                <div className="flex-1 w-full text-sm text-slate-900">{idea.title}</div>
                                                                            </div>
                                                                            {
                                                                                idea.topic.length ?
                                                                                    <div className="flex flex-wrap gap-2 items-center mt-1 mb-3 px-2">
                                                                                        {
                                                                                            (idea.topic || []).map((topic, Tindex) => {
                                                                                                return (
                                                                                                    <span key={`idea_topic_${topic.id}`} className="text-xs text-slate-700">{topic.title}</span>
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