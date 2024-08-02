import React, {useState} from 'react';
import {ArrowLeft, ArrowRight, GripVertical, RotateCcw, Trash2, X} from "lucide-react";
import {Card, CardContent} from "../ui/card";
import {useTheme} from "../theme-provider";
import {Button} from "../ui/button";
import {SelectContent, SelectItem, SelectTrigger} from "../ui/select";
import {Select, SelectGroup, SelectValue} from "@radix-ui/react-select";
import RatingStar from "../Comman/Star";

const emoji = [
    {
        url:"https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f620.png",
        id:1
    },
    {
        url:"https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/2639-fe0f.png",
        id:2
    },
    {
        url:"https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f611.png",
        id:3
    },
    {
        url:"https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f604.png",
        id:4
    },
    {
        url:"https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f929.png",
        id:5
    },
]

const CommanQuestion = ({data}) => {
    const {theme}=useTheme();
    const [rating,setRating]=useState(null);
    const [starRating, setStarRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    const handleClick = (value) => {
        setStarRating(value);
    };

    const handleMouseEnter = (value) => {
        setHoverRating(value);
    };

    const handleMouseLeave = () => {
        setHoverRating(0);
    };

    console.log(starRating);

    return (
        <Card className={"my-6 mx-4 rounded-md "}>
            <div className={"border-b"}>
                <div className={"flex justify-between px-6 py-3"}>
                    <div className={"flex gap-4 items-center"}>
                        <GripVertical size={20} className={`${theme === "dark" ? "" : "text-muted-foreground"}`} />
                        <h5 className={"text-base font-medium leading-5"}>Step-1</h5>
                    </div>
                    <Trash2 size={16} />
                </div>
            </div>

            <div className={"py-8  px-4"}>
                <Card className={""}>
                    <div className={"p-4 flex gap-2 border-b"}>
                        <div className={"w-3 h-3 rounded-full border border-inherit"}/>
                        <div className={"w-3 h-3 rounded-full border border-inherit"}/>
                        <div className={"w-3 h-3 rounded-full border border-inherit"}/>
                    </div>
                    <div className={"p-2"}>
                        <div className="flex items-center space-x-3">
                            <ArrowLeft className={`${theme === "dark" ? "" : "text-muted-foreground"}`}/>
                            <ArrowRight className={`${theme === "dark" ? "" : "text-muted-foreground"}`} />
                            <RotateCcw className={`${theme === "dark" ? "" : "text-muted-foreground"}`} />
                            <div className="flex-grow border border-inherit h-8 rounded-2xl"/>
                            <div className={"h-7 w-7 rounded-full border border-inherit"}/>
                        </div>
                    </div>

                    <CardContent className={"w-full py-16 bg-[#4e4e4e] rounded-b-lg flex justify-center"}>
                        <div className={"w-[498px] border-[#EEE4FF] rounded-lg border-[16px] border-t-[32px] box-border"}>

                                {data.question_type === 5 ? <div className={` p-8  ${theme === "dark" ? "" : "bg-[#fff]"}`}>
                                                                <Button className={"h-8"} variant={"outline"}>Add Question</Button>
                                                                <br/>
                                                                <Button className={"h-8 mt-6"}>Submit</Button>
                                                             </div>
                                : data.question_type === 0 ? <div className={` box-border  px-4 pt-6 pb-8  ${theme === "dark" ? "" : "bg-[#fff]"}`}>
                                                                <Card className={"rounded-[10px] py-2 px-4"}>
                                                                    <h5 className={"text-sm font-normal leading-5"}>How satisfied are you with our product?</h5>
                                                                    <div className={"flex justify-center gap-3 pt-[18px] pb-[18px]"}>
                                                                        {
                                                                            ["0","1","2","3","4","5","6","7","8","9","10"].map((x,i)=>{
                                                                                return(
                                                                                    <Button variant={`${rating === x ? "" : "outline"}`} onClick={()=>setRating(x)} className={"w-5 h-5 p-0 text-xs"}>{x}</Button>
                                                                                )
                                                                            })
                                                                        }
                                                                    </div>
                                                                    <div className={"flex justify-between"}>
                                                                        <h6 className={"text-xs leading-5 font-normal"}>0 - {data.start_label}</h6>
                                                                        <h6 className={"text-xs leading-5 font-normal"}>10 - {data.end_label}</h6>
                                                                    </div>

                                                                </Card>
                                                                <div className={"px-4 pt-4"}>
                                                                    <Button className={"h-8"} variant={"outline"}>Add question</Button>
                                                                    <br/>
                                                                    <Button className={"h-8 mt-8"}>Submit</Button>
                                                                </div>
                                                            </div>
                                : data.question_type === 1 ? <div className={`box-border px-4 pt-6 pb-8  ${theme === "dark" ? "" : "bg-[#fff]"}`}>
                                                                <Card className={"rounded-[10px] py-2 px-4"}>
                                                                    <h5 className={"text-sm font-normal leading-5"}>How satisfied are you with our product?</h5>
                                                                    <div className={"flex justify-center gap-3 pt-[18px] pb-[18px]"}>
                                                                        {
                                                                            [0,1,2,3,4,5,6].map((x,i)=>{
                                                                                return(
                                                                                    <Button variant={`${rating === x ? "" : "outline"}`} onClick={()=>setRating(x)} className={"w-5 h-5 p-0 text-xs"}>{x}</Button>
                                                                                )
                                                                            })
                                                                        }
                                                                    </div>
                                                                    <div className={"flex justify-between"}>
                                                                        <h6 className={"text-xs leading-5 font-normal"}>0 - {data.start_label}</h6>
                                                                        <h6 className={"text-xs leading-5 font-normal"}>10 - {data.end_label}</h6>
                                                                    </div>

                                                                </Card>
                                                                <div className={"px-4 pt-4"}>
                                                                    <Button className={"h-8"} variant={"outline"}>Add question</Button>
                                                                    <br/>
                                                                    <Button className={"h-8 mt-6"}>Submit</Button>
                                                                </div>
                                                            </div>
                                : data.question_type === 2 ?
                                                            <div className={`box-border px-4 pt-6 pb-8  ${theme === "dark" ? "" : "bg-[#fff]"}`}>
                                                                <Card className={"rounded-[10px] py-2 px-4 relative"}>
                                                                    <h5 className={"text-sm font-normal leading-5"}>How satisfied are you with our product?</h5>
                                                                    <div className={"flex justify-center mt-4 gap-4"}>
                                                                        {Array.from({ length: 5 }, (_, index) => (
                                                                                <RatingStar
                                                                                    key={index}
                                                                                    filled={index < (hoverRating || starRating)}
                                                                                    onClick={() => handleClick(index + 1)}
                                                                                    onMouseEnter={() => handleMouseEnter(index + 1)}
                                                                                    onMouseLeave={handleMouseLeave}
                                                                                />
                                                                            ))}
                                                                    </div>
                                                                    <div className={"flex justify-between pt-4"}>
                                                                        <h6 className={"text-xs leading-5 font-normal"}>1 - {data.start_label}</h6>
                                                                        <h6 className={"text-xs leading-5 font-normal"}>5 - {data.end_label}</h6>
                                                                    </div>
                                                                </Card>
                                                                <div className={"px-4 pt-4"}>
                                                                    <Button className={"h-8"} variant={"outline"}>Add question</Button>
                                                                    <br/>
                                                                    <Button className={"h-8 mt-6"}>Submit</Button>
                                                                </div>
                                                            </div>
                                : data.question_type === 4 ? <div className={`box-border px-4 pt-6 pb-8  ${theme === "dark" ? "" : "bg-[#fff]"}`}>
                                                               <Card className={"rounded-[10px] pt-2 pb-6 px-4 relative"}>
                                                                   <Trash2 className={"absolute top-[46%] left-[98%]"} size={16}/>
                                                                   <h5 className={"text-sm font-normal leading-5"}>Ask question here?</h5>
                                                                   <Select>
                                                                       <SelectTrigger className="w-full h-7 mt-3">
                                                                           <SelectValue placeholder="Select One..." />
                                                                       </SelectTrigger>
                                                                       <SelectContent>
                                                                           <SelectGroup>
                                                                               {
                                                                                   (data.answer_option || []).map((x,i)=>{
                                                                                       return(
                                                                                           <SelectItem key={i} value={x.label} >{x.label}</SelectItem>
                                                                                       )
                                                                                   })
                                                                               }
                                                                           </SelectGroup>
                                                                       </SelectContent>
                                                                   </Select>
                                                               </Card>
                                                                <div className={"px-4 pt-4 "}>
                                                                    <Button className={"h-8"} variant={"outline"}>Add question</Button>
                                                                    <br/>
                                                                    <Button className={"h-8 mt-6"} >Submit</Button>
                                                                </div>
                                                               </div>
                                : data.question_type === 3 ? <div className={`box-border px-4 pt-6 pb-8  ${theme === "dark" ? "" : "bg-[#fff]"}`}>
                                                                    <Card className={"rounded-[10px] pt-2 pb-2 px-4"}>
                                                                        <h5 className={"text-sm font-normal leading-5"}>How satisfied are you with our product?</h5>
                                                                        <div className={"flex justify-center gap-6 mt-6"}>
                                                                            {
                                                                                (emoji || []).map((x,i)=>{
                                                                                    return(
                                                                                        <img className={"h-8 w-8"} src={x.url}/>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </div>
                                                                        <div className={"flex justify-between pt-4"}>
                                                                            <h6 className={"text-xs leading-5 font-normal"}>1 - {data.start_label}</h6>
                                                                            <h6 className={"text-xs leading-5 font-normal"}>5 - {data.end_label}</h6>
                                                                        </div>
                                                                    </Card>
                                                                    <div className={"px-4 pt-4 "}>
                                                                        <Button className={"h-8"} variant={"outline"}>Add question</Button>
                                                                        <br/>
                                                                        <Button className={"h-8 mt-6"} >Submit</Button>
                                                                    </div>
                                                             </div> :""}
                        </div>
                    </CardContent>

                </Card>
            </div>

        </Card>
    );
};

export default CommanQuestion;