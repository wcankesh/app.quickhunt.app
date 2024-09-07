import React, {Fragment, useEffect, useState} from "react";
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Filter,
    GalleryVerticalEnd,
    Plus,
    Search,
    Triangle
} from "lucide-react";
import {Card} from "../../ui/card";
import {Button} from "../../ui/button";
import {Skeleton} from "../../ui/skeleton"
import {Icon} from "../../../utils/Icon";
import ReadMoreText from "../../Comman/ReadMoreText";
import {getDateFormat} from "../../../utils/constent";
import {ApiService} from "../../../utils/ApiService";
import {useSelector} from "react-redux";

const IdeaWidgetPreview = ({widgetsSetting}) => {
    let apiSerVice = new ApiService();
    const [isLoading, setIsLoading] = useState(true);
    const [ideasList, setIdeasList] = useState([]);
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    useEffect(() => {
        if(projectDetailsReducer.id){
            getAllIdea()
        }
    }, [projectDetailsReducer.id])

    const getAllIdea = async () => {
        const data = await apiSerVice.getAllIdea({
            project_id: projectDetailsReducer.id,
            page: 1,
            limit: 10
        })
        if (data.status === 200) {
            setIdeasList(data.data)
            setIsLoading(false)
        } else {
            setIsLoading(false)
        }
    }
    const btnClass = `bg-[#f8fafc] border-[#e2e8f0] text-black hover:bg-[#f8fafc] hover:text-black`;
    const cardClass = `bg-white text-black border-[#e2e8f0]`
    return (
        <div className={"px-3"}>
            <div className="flex flex-wrap items-center gap-2 mb-3 justify-between">

                <div className="flex gap-1 flex-1 w-full justify-start relative">
                    <Button size="icon" variant="outline"  className={`w-9 h-9 flex ${btnClass}`}><Search className='w-4 h-4'/></Button>
                    <Button variant="outline" size="icon" className={`w-9 h-9 flex ${btnClass}`}><Filter fill="true" className='w-4 h-4'/></Button>
                    <Button size="icon" variant="outline" className={`w-9 h-9 flex ${btnClass}`}><GalleryVerticalEnd fill="true" className='w-4 -h4'/></Button>
                </div>
                <Button size="sm" className="gap-2 inset-0 shadow-none outline-none" style={{
                    backgroundColor: widgetsSetting?.btn_background_color,
                    color: widgetsSetting?.btn_text_color
                }}><Plus className="w-5 h-5"/> Create Idea</Button>

            </div>

            <div className="block max-h-[385px] overflow-y-auto">
                {
                    isLoading ? <Card className={cardClass}>
                        {Array.from(Array(8)).map((_, r) => {
                            return (
                                <div key={`idea_${r}`}
                                     className={`box-border flex flex-col gap-2 p-3 ${r != 0 ? 'border-t border-zinc-200' : ''}`}>
                                    <Skeleton className="h-2 w-full bg-[#f1f5f9]"/>
                                    <Skeleton className="h-2 w-full bg-[#f1f5f9]"/>
                                    <Skeleton className="h-2 w-6/12 bg-[#f1f5f9]"/>
                                </div>
                            )
                        })}
                    </Card> : ideasList.length ? <Fragment>
                        <Card className={cardClass}>
                            {
                                (ideasList || []).map((idea, index) => {
                                    return (
                                        <div key={`idea_${idea.id}`}
                                             className={`box-border p-3 ${index != 0 ? 'border-t border-zinc-200' : ''}`}>
                                            <div className="flex flex-wrap gap-2 items-start">
                                                <div className="w-auto flex-initial  flex gap-4 items-center">
                                                    <Button variant={'outline'} size="icon"
                                                            className={`w-12 h-12 ${btnClass} flex-col cursor-pointer ${idea.user_vote === 1 ? 'text-primary' : 'text-slate-400'}`}
                                                            style={idea.user_vote === 1 ? {
                                                                color: widgetsSetting?.btn_background_color,
                                                                fill: widgetsSetting?.btn_background_color
                                                            } : {fill: 'rgb(148 163 184)'}}
                                                           >
                                                        <Triangle fill="true" className="w-3 h-3"/>
                                                        <div className="w-full text-sm font-semibold tracking-tight">{idea.vote}</div>
                                                    </Button>
                                                </div>

                                                <div className={"flex-1 w-full flex gap-4 items-center"}>
                                                    <div className="flex w-full flex-wrap gap-1 items-center">
                                                        <div className="w-full flex gap-4 items-center">
                                                            <h2
                                                                className="text-xs cursor-pointer font-semibold ">{idea.title}</h2>
                                                        </div>
                                                        {widgetsSetting?.idea_description === 1 ?
                                                            <div className={'inline-block w-full text-xs'}><ReadMoreText
                                                                html={idea.description} isWidget={true}/></div> : ''}

                                                        <div
                                                            className=" w-full flex flex-wrap gap-3 items-center justify-between mt-1">
                                                            <div
                                                                className="flex-initial w-auto flex items-center gap-2">
                                                                <div
                                                                    className="text-xs leading-5 text-gray-600 font-medium">{idea.name}</div>
                                                                <div
                                                                    className="text-xs leading-5 text-muted-foreground">{getDateFormat(idea.created_at)}</div>
                                                            </div>
                                                            {idea.roadmap_id && <span style={{
                                                                borderColor: idea.roadmap_color,
                                                                color: idea.roadmap_color
                                                            }}  className="border px-2 py-1 rounded text-exm font-semibold">{idea.roadmap_title}</span>}
                                                        </div>
                                                    </div>
                                                </div>


                                            </div>

                                        </div>
                                    )
                                })
                            }
                            <div className="box-border px-3 py-3 border-t border-zinc-200 bg-slate-50 rounded-b-md">
                                <div className="flex md:justify-end justify-between items-center gap-8">
                                    <small
                                        className="text-sm font-medium text-pageCount">Page 1 of 1</small>
                                    <div className="flex gap-2 ">
                                        <Button variant="outline" size="icon"
                                              className={`w-8 h-8 text-primary ${btnClass}`}
                                                style={{color: widgetsSetting?.btn_background_color}}><ChevronsLeft
                                            className="w-5 h-5"/></Button>
                                        <Button variant="outline" size="icon"
                                                className={`w-8 h-8 text-primary ${btnClass}`}
                                                style={{color: widgetsSetting?.btn_background_color}}><ChevronLeft
                                            className="w-5 h-5"/></Button>
                                        <Button variant="outline" size="icon"
                                                 className={`w-8 h-8 text-primary ${btnClass}`}
                                                style={{color: widgetsSetting?.btn_background_color}}><ChevronRight
                                            className="w-5 h-5"/></Button>
                                        <Button variant="outline" size="icon"
                                                className={`w-8 h-8 text-primary ${btnClass}`}
                                                style={{color: widgetsSetting?.btn_background_color}}><ChevronsRight
                                            className="w-5 h-5"/></Button>

                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Fragment> : <Card className={`${cardClass} px-6 py-3`}>
                        <div className="flex items-center justify-center bg-white py-6">
                            <div className="max-w-md w-full text-center">
                                {Icon.noData}
                                <h3 className="mt-5 sm:text-2xl text-lg font-medium text-slate-900">No Items Found</h3>
                                <p className="mt-2 text-sm text-gray-500">It looks like you haven't added any items yet.
                                    Start by adding new items to see them here.</p>
                                <div className="mt-6">
                                    <Button size="sm" className="gap-2 inset-0 shadow-none outline-none" style={{
                                        backgroundColor: widgetsSetting?.btn_background_color,
                                        color: widgetsSetting?.btn_text_color
                                    }}><Plus className="w-5 h-5"/> Add New Idea</Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                }
            </div>
        </div>

    );
};

export default IdeaWidgetPreview;