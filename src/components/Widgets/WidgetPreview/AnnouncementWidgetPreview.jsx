import React,{useState, useEffect, Fragment} from 'react';
import {Card} from "../../ui/card";
import {Skeleton} from "../../ui/skeleton";
import {AspectRatio} from "../../ui/aspect-ratio";
import {apiService, getDateFormat} from "../../../utils/constent";
import moment from "moment";
import {Badge} from "../../ui/badge";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "../../ui/accordion"
import {Avatar, AvatarImage} from "../../ui/avatar";
import {Button} from "../../ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "../../ui/popover";
import {ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Filter, Search, SmilePlus} from "lucide-react";
import {Textarea} from "../../ui/textarea";
import {useSelector} from "react-redux";
import {Icon} from "../../../utils/Icon";
import ReadMoreText from "../../Comman/ReadMoreText";

const AnnouncementWidgetPreview = ({widgetsSetting}) => {
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const [announcementsList, setAnnouncementsList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if(projectDetailsReducer.id){
            getAllPosts()
        }
    }, [projectDetailsReducer.id])

    const getAllPosts = async () => {
        const data = await apiService.getAllPosts({
            projectId: projectDetailsReducer.id,
            page: 1,
            limit: 10
        })
        setIsLoading(false)
        if (data.success) {
            setAnnouncementsList(data.data.data)
        }
    }

    const isLimitEmoji = 1;
    const btnClass = `bg-[#f8fafc] border-[#e2e8f0] text-black hover:bg-[#f8fafc] hover:text-black`;
    const cardClass = `bg-white text-black border-[#e2e8f0]`

    return (
        <div className={"px-3 flex flex-col h-full"}>
            <div className="flex items-center gap-2 mb-3 justify-between relative">
                <div className="flex gap-2 flex-1 w-full justify-end">
                    <Button size="icon" variant="outline" className={`w-9 h-9 ${btnClass}`}><Search className='w-4 h-4'/></Button>
                    <Button variant="outline" size="icon" className={`w-9 h-9 ${btnClass}`}><Filter fill="true" className='w-4 -h4'/></Button>
                </div>
            </div>

            <div className={"block overflow-y-auto"}>
                {
                    isLoading ? <Card className={cardClass}>
                        {Array.from(Array(8)).map((_, r) => {
                            return (
                                <div key={`idea_${r}`} className={`box-border flex flex-col gap-2 p-3 ${r != 0 ? 'border-t border-zinc-200' : ''}`}>
                                    <Skeleton className="h-2 w-full bg-[#f1f5f9]"/>
                                    <Skeleton className="h-2 w-full bg-[#f1f5f9]"/>
                                    <Skeleton className="h-2 w-6/12 bg-[#f1f5f9]"/>
                                </div>
                            )
                        })}
                    </Card> : announcementsList.length ? <Fragment>
                        <Card className={"bg-white text-black border-[#e2e8f0]"}>
                            {
                                (announcementsList || []).map((x, index) => {
                                    return (
                                        <div key={`announcement_${x.id}`} className={`box-border  ${index != 0 ? 'border-t border-zinc-200' : ''}`}>
                                            {
                                                (x.featureImage && widgetsSetting?.announcementImage) &&
                                                <AspectRatio ratio={10 / 5} className="bg-muted dark:bg-slate-50 rounded-ss-md rounded-se-md mb-1">
                                                    <img src={x.featureImage} alt={x.title} className="w-full h-full object-contain object-center"/>
                                                </AspectRatio>
                                            }
                                            <div className="p-3">
                                                <div className="flex flex-wrap gap-2 items-center">
                                                    <div className="w-full flex-initial  flex gap-4 items-center">
                                                        <h2 className="text-xs cursor-pointer font-medium">{x.title}</h2>
                                                    </div>
                                                    <div className="flex-1 w-full flex flex-wrap gap-4 items-center justify-between">
                                                        <div className="flex-initial w-auto flex items-center gap-2">
                                                            <div className="text-xs leading-5 text-gray-600 font-normal">{x?.contributors[0]?.firstName} {x?.contributors[0]?.lastName}</div>
                                                            <div className="text-xs leading-5 text-muted-foreground">{getDateFormat(moment(x.publishedAt).format("YYYY-MM-DD HH:mm:ss"))}</div>
                                                        </div>
                                                        {
                                                            (x?.labels.length || x?.categoryName) ?
                                                                <div className="flex gap-1">
                                                                    {x?.categoryName && <Badge variant="outline" style={{borderColor: "#7c3aed", color: "#7c3aed"}} size={"small"} className="rounded">{x.categoryName}</Badge>}
                                                                    {
                                                                        (x?.labels || []).map((y, i) => {
                                                                            return (
                                                                                <Badge key={`badge-${index}-${y.labelColorCode}`} style={{borderColor: y.labelColorCode, color: y.labelColorCode}} variant="outline" className="rounded">{y.labelName}</Badge>
                                                                            )
                                                                        })
                                                                    }
                                                                </div> : ''
                                                        }
                                                    </div>
                                                </div>
                                                {widgetsSetting?.announcementDescription ? <div className="inline-block pt-4 text-xs">
                                                    <ReadMoreText html={x.description}/>
                                                </div> : ''
                                                }

                                                {widgetsSetting?.changelogReaction || widgetsSetting?.isComment ? <div className={"pt-6"}>
                                                    <Accordion type="single"  className={"border-t border-b  rounded-lg border-[#e2e8f0]"}>
                                                        <AccordionItem value="item-1" className={"border-0 border-l border-r rounded-lg py-2 border-[#e2e8f0]"}>
                                                            <div className={"flex items-center justify-between gap-3 pl-2 pr-3"}>
                                                                {
                                                                    widgetsSetting?.changelogReaction ? <div className={"flex gap-2.5 items-center"}>
                                                                        {
                                                                            (allStatusAndTypes.emoji || []).map((e, i) => {
                                                                                const findEmoji = (x.reactions || []).find((r) => r.reactionId == e.id) || {count: 0};
                                                                                return (
                                                                                    i <= isLimitEmoji ? <Button
                                                                                        key={`emoji_${x.id}_${e.id}`}
                                                                                        variant={"ghost"}
                                                                                        className={`light:hover:text-card dark:hover:text-card px-2 w-8 h-8 py-0 z-10 text-center items-center justify-center text-base rounded-lg border border-transparent relative hover:bg-white hover:border-gray-100 dark:hover:bg-dark-accent dark:hover:border-dark-accent border-gray-100`}>
                                                                                        <span className={`absolute py-0.5 leading-none -right-1 border rounded shadow -top-1 text-[9px] font-bold tracking-wide  px-0.5 text-background-accent dark:border-white  dark:bg-dark-accent bg-white`}>{findEmoji?.count}</span>
                                                                                        <Avatar className="w-[22px] h-[22px]">
                                                                                            <AvatarImage src={e.emojiUrl}/>
                                                                                        </Avatar>
                                                                                    </Button> : ""
                                                                                )
                                                                            })
                                                                        }
                                                                        <Popover>
                                                                            <PopoverTrigger className="w-8 h-8 px-1 z-10 text-center flex items-center justify-center text-base rounded-lg border relative hover:bg-white hover:border-gray-100 dark:hover:bg-dark-accent dark:hover:border-dark-accent border-gray-100">
                                                                                <SmilePlus width={"22"} height={"22"}/>
                                                                            </PopoverTrigger>
                                                                            <PopoverContent className={`w-full p-2 ${cardClass}`}>
                                                                                <div className="flex gap-2">
                                                                                    {
                                                                                        (allStatusAndTypes.emoji || []).map((e, i) => {
                                                                                            const findEmoji = (x.reactions || []).find((r) => r.reactionId == e.id) || {count: 0};
                                                                                            return (
                                                                                                i > isLimitEmoji ?
                                                                                                    <Button
                                                                                                        key={`emoji_${x.id}_${e.id}`}
                                                                                                        variant={"ghost"}
                                                                                                        className={`w-8 h-8 px-2 py-0 z-10 text-center items-center justify-center text-base rounded-lg border border-transparent relative hover:bg-white light:hover:text-card dark:hover:text-card hover:border-gray-100 dark:hover:bg-dark-accent dark:hover:border-dark-accent border-gray-100`}>
                                                                                                        <span className={`absolute py-0.5 leading-none -right-1 border rounded shadow -top-1 text-[9px] font-bold tracking-wide  px-0.5 text-background-accent dark:border-white dark:bg-dark-accent bg-white`}>{findEmoji?.count}</span>
                                                                                                        <Avatar className="w-[22px] h-[22px]">
                                                                                                            <AvatarImage src={e.emojiUrl}/>
                                                                                                        </Avatar>
                                                                                                    </Button> : ""
                                                                                            )
                                                                                        })
                                                                                    }
                                                                                </div>
                                                                            </PopoverContent>
                                                                        </Popover>
                                                                    </div> : ''
                                                                }
                                                                {
                                                                    widgetsSetting?.isComment ? <AccordionTrigger className={`flex w-full relative items-center justify-end no-underline hover:no-underline py-1 `}>
                                                                        <div className={`text-left ${widgetsSetting?.changelogReaction === false ? 'border-l px-3' : 'px-3'} text-sm leading-5 truncate absolute -left-15 right-5`} style={{overflow: "visible"}}>Write a comment...</div>
                                                                    </AccordionTrigger> : ''
                                                                }
                                                            </div>
                                                            {
                                                                widgetsSetting?.isComment ?
                                                                    <AccordionContent className={"p-0"}>
                                                                        <div className="relative overflow-hidden  border-t mt-2 border-[#e2e8f0]">
                                                                            <Textarea on id="message" placeholder="Type your message here..." className={`${cardClass} min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0 ring-offset-color-0`}/>
                                                                            <div className="flex items-center p-3 pt-0">
                                                                                <Button className="ml-auto gap-1.5"  style={{backgroundColor: widgetsSetting?.btnBackgroundColor, color: widgetsSetting?.btnTextColor}}>Send</Button>
                                                                            </div>
                                                                        </div>
                                                                    </AccordionContent> : ''
                                                            }
                                                        </AccordionItem>
                                                    </Accordion>
                                                </div> : ''
                                                }
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            <div className="box-border px-3 py-3 border-t border-zinc-200 bg-slate-50 rounded-b-md">
                                <div className="flex justify-between items-center gap-8">
                                    <small className="text-sm font-normal text-pageCount">Page 1 of 1</small>
                                    <div className="flex gap-2 ">
                                        <Button variant="outline" size="icon"  className={`w-8 h-8 ${btnClass}`} style={{color: widgetsSetting?.btnBackgroundColor}}><ChevronsLeft className="w-5 h-5"/></Button>
                                        <Button variant="outline" size="icon"  className={`w-8 h-8 ${btnClass}`} style={{color: widgetsSetting?.btnBackgroundColor}}><ChevronLeft className="w-5 h-5"/></Button>
                                        <Button variant="outline" size="icon" className={`w-8 h-8 ${btnClass}`} style={{color: widgetsSetting?.btnBackgroundColor}}><ChevronRight className="w-5 h-5"/></Button>
                                        <Button variant="outline" size="icon" className={`w-8 h-8 ${btnClass}`} style={{color: widgetsSetting?.btnBackgroundColor}}><ChevronsRight className="w-5 h-5"/></Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Fragment> : <Card className={`px-6 py-3 ${cardClass}`}>
                        <div className="flex items-center justify-center bg-white py-6">
                            <div className="max-w-md w-full text-center">
                                {Icon.noData}
                                <h3 className="mt-2 text-xl font-normal text-gray-900">No Items Found</h3>
                                <p className="mt-1 text-sm text-gray-500">It looks like you haven't added any items yet. Start by adding new items to see them here.</p>
                            </div>
                        </div>
                    </Card>
                }
            </div>
        </div>
    );
};

export default AnnouncementWidgetPreview;