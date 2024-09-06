import React, {useState} from 'react';
import {useTheme} from "../theme-provider";
import {useSelector} from "react-redux";
import {Button} from "../ui/button";
import {Trash2, X} from "lucide-react";
import {Input} from "../ui/input";
import {Card} from "../ui/card";
import RatingStar from "../Comman/Star";

const Surveys = ({inAppMsgSetting, setInAppMsgSetting}) => {
        const {theme} = useTheme();
        const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
        const [starRating, setStarRating] = useState(0);
        const [hoverRating, setHoverRating] = useState(0);

        const numbers = [];
        for (let i = inAppMsgSetting.start_number; i <= inAppMsgSetting.end_number; i++) {
            numbers.push(i);
        }

        const addOption = () => {
            setInAppMsgSetting({
                ...inAppMsgSetting,
                options: [...inAppMsgSetting.options || [], ""]
            });
        };

        const handleClick = (value) => {
            setStarRating(value);
        };

        const handleMouseEnter = (value) => {
            setHoverRating(value);
        };

        const handleMouseLeave = () => {
            setHoverRating(0);
        };

        return (
            <div className={"my-6 flex flex-col gap-8"}>
                <div className={"pt-8 px-4 pb-10 border-t"}>
                    <Card className={"rounded-md border-b bg-muted"}>
                        <div className={`py-16 flex justify-center`}>
                            <div
                                className={`${theme == "dark" ? "bg-primary/15" : "bg-[#EEE4FF]"}  w-[498px] px-4 pb-4 rounded-[10px]`}>
                                <div className={"flex justify-end"}><X className={"my-2"} size={12}/></div>
                                <div
                                    className={` rounded-[10px] ${theme == "dark" ? "bg-[#020817]" : "bg-[#fff]"}`}>
                                    {inAppMsgSetting.question_type == 5 ?
                                        <div className={"px-4 pb-8 pt-6 space-y-6"}>
                                            <div>
                                                <Card className={"py-2 px-4 pb-6 relative mb-4"}>
                                                    <Button variant={"outline"}
                                                            className={`absolute right-[-12px] top-[40%] p-0 h-6 w-6 ${theme == "dark" ? "" : "text-muted-foregrounds"}`}>
                                                        <Trash2 size={12} className={""}/>
                                                    </Button>
                                                    <h5 className={"text-sm font-normal"}>Ask question here?</h5>
                                                    <div className="mt-3">
                                                        <ul className={"space-y-3"}>
                                                            {inAppMsgSetting.options.map((option, index) => (
                                                                <li key={index}>
                                                                    <Input value={option || "Select one"}/>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </Card>
                                                <Button variant={"outline"} className={"h-8"} onClick={addOption}>Add
                                                    question</Button>
                                            </div>
                                            <div>
                                                <Button className={"h-8"}>Submit</Button>
                                            </div>
                                        </div>
                                        : inAppMsgSetting.question_type == 1 ?
                                            <div className={"px-4 pb-8 pt-6 space-y-6"}>
                                                <div>
                                                    <Card className={"py-2 px-4 relative mb-4"}>
                                                        <Button variant={"outline"}
                                                                className={`absolute right-[-12px] top-[40%] p-0 h-6 w-6 ${theme == "dark" ? "" : "text-muted-foregrounds"}`}>
                                                            <Trash2 size={12} className={""}/>
                                                        </Button>
                                                        <h5 className={"text-sm font-normal"}>How satisfied are you with
                                                            our product?</h5>
                                                        <div className={"flex gap-3 px-[30px] pt-[18px]"}>
                                                            {numbers.map(num => (
                                                                <Button key={num} variant={"outline"}
                                                                        className={"w-5 h-5 text-xs p-0"}>{num}</Button>
                                                            ))}
                                                        </div>
                                                        <div className={"flex justify-between mt-[18px]"}>
                                                            <h5 className={"text-xs font-normal"}>{inAppMsgSetting?.start_number} -
                                                                very bad</h5>
                                                            <h5 className={"text-xs font-normal"}>{inAppMsgSetting?.end_number} -
                                                                very good</h5>
                                                        </div>
                                                    </Card>
                                                    <Button variant={"outline"} className={"h-8"}>Add question</Button>
                                                </div>
                                                <div>
                                                    <Button className={"h-8"}>Submit</Button>
                                                </div>
                                            </div>
                                            : inAppMsgSetting.question_type == 2 ?
                                                <div className={"px-4 pb-8 pt-6 space-y-6"}>
                                                    <div>
                                                        <Card className={"py-2 px-4 relative mb-4"}>
                                                            <Button variant={"outline"}
                                                                    className={`absolute right-[-12px] top-[40%] p-0 h-6 w-6 ${theme == "dark" ? "" : "text-muted-foregrounds"}`}>
                                                                <Trash2 size={12} className={""}/>
                                                            </Button>
                                                            <h5 className={"text-sm font-normal"}>How satisfied are you
                                                                with our product?</h5>
                                                            <div
                                                                className={"flex justify-center gap-3 px-[30px] pt-[18px]"}>
                                                                {numbers.map(num => (
                                                                    <Button key={num} variant={"outline"}
                                                                            className={"w-5 h-5 text-xs p-0"}>{num}</Button>
                                                                ))}
                                                            </div>
                                                            <div className={"flex justify-between mt-[18px]"}>
                                                                <h5 className={"text-xs font-normal"}>{inAppMsgSetting?.start_number} -
                                                                    very bad</h5>
                                                                <h5 className={"text-xs font-normal"}>{inAppMsgSetting?.end_number} -
                                                                    very good</h5>
                                                            </div>
                                                        </Card>
                                                    </div>
                                                    <div>
                                                        <Button className={"h-8"}>Submit</Button>
                                                    </div>
                                                </div>
                                                : inAppMsgSetting.question_type == 3 ?
                                                    <div className={"px-4 pb-8 pt-6 space-y-6"}>
                                                        <div>
                                                            <Card className={"py-2 px-4 relative mb-4"}>
                                                                <Button variant={"outline"} className={`absolute right-[-12px] top-[40%] p-0 h-6 w-6 ${theme == "dark" ? "" : "text-muted-foregrounds"}`}>
                                                                    <Trash2 size={12} className={""}/>
                                                                </Button>
                                                                <h5 className={"text-sm font-normal"}>How satisfied are you with our product?</h5>
                                                                <div className={"flex gap-4 mt-4 justify-center"}>
                                                                    {Array.from({length: 5}, (_, index) => (
                                                                        <RatingStar
                                                                            key={index}
                                                                            filled={index < (hoverRating || starRating)}
                                                                            onClick={() => handleClick(index + 1)}
                                                                            onMouseEnter={() => handleMouseEnter(index + 1)}
                                                                            onMouseLeave={handleMouseLeave}
                                                                        />
                                                                    ))}
                                                                </div>

                                                                <div className={"flex justify-between mt-[18px]"}>
                                                                    <h5 className={"text-xs font-normal"}>{inAppMsgSetting?.start_number} - very bad</h5>
                                                                    <h5 className={"text-xs font-normal"}>{inAppMsgSetting?.end_number} - very good</h5>
                                                                </div>
                                                            </Card>
                                                            <Button variant={"outline"} className={"h-8"}>Add question</Button>
                                                        </div>
                                                        <div>
                                                            <Button className={"h-8"}>Submit</Button>
                                                        </div>
                                                    </div>
                                                    : inAppMsgSetting.question_type == 4 ?
                                                        <div className={"px-4 pb-8 pt-6 space-y-6"}>
                                                            <div>
                                                                <Card className={"py-2 px-4 relative mb-4"}>
                                                                    <Button variant={"outline"} className={`absolute right-[-12px] top-[40%] p-0 h-6 w-6 ${theme == "dark" ? "" : "text-muted-foregrounds"}`}>
                                                                        <Trash2 size={12} className={""}/>
                                                                    </Button>
                                                                    <h5 className={"text-sm font-normal"}>How satisfied are you with our product?</h5>
                                                                    <div
                                                                        className={"flex justify-center gap-6 mt-6 mb-6"}>
                                                                        {
                                                                            (allStatusAndTypes?.emoji || []).slice(0, 5).map((x, i) => {
                                                                                return (
                                                                                    <img key={i} className={"h-8 w-8"} src={x?.emoji_url}/>
                                                                                )
                                                                            })
                                                                        }
                                                                    </div>
                                                                </Card>
                                                                <Button variant={"outline"} className={"h-8"}>Add question</Button>
                                                            </div>
                                                            <div>
                                                                <Button className={"h-8"}>Submit</Button>
                                                            </div>
                                                        </div>
                                                        : ""}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }
;

export default Surveys;