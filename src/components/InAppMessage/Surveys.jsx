import React, {Fragment, useState} from 'react';
import {useTheme} from "../theme-provider";
import {useSelector} from "react-redux";
import {Button} from "../ui/button";
import {Plus, Trash2, X} from "lucide-react";
import {Input} from "../ui/input";
import {Textarea} from "../ui/textarea";
import RatingStar from "../Comman/Star";
import {DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger} from "../ui/dropdown-menu";
import {DropdownMenuGroup} from "@radix-ui/react-dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "../ui/avatar";
import {Popover, PopoverContent} from "../ui/popover";
import {PopoverTrigger} from "@radix-ui/react-popover";
import EmojiPicker from "emoji-picker-react";
import {Select, SelectValue} from "@radix-ui/react-select";
import {SelectContent, SelectItem, SelectTrigger} from "../ui/select";

const Surveys = ({inAppMsgSetting, setInAppMsgSetting, selectedStepIndex, setSelectedStepIndex, setSelectedStep, selectedStep, isLoading}) => {
    const {theme} = useTheme();
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const userDetailsReducer = allStatusAndTypes.members.find((x) => x.user_id == inAppMsgSetting.from);
    const [starRating, setStarRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);


    const renderNumber = (x) => {
        const numbers = [];
        for (let i = Number(x?.question_type === 1 ? "0" : x?.start_number); i <= Number(x?.question_type === 1 ? "10" : x?.end_number); i++) {
            numbers.push(i);
        }
        return numbers
    }




    const handleClick = (value) => {
        setStarRating(value);
    };

    const handleMouseEnter = (value) => {
        setHoverRating(value);
    };

    const handleMouseLeave = () => {
        setHoverRating(0);
    };

    const updateStepRecord = (record) => {
        let clone = [...inAppMsgSetting.steps];
        clone[selectedStepIndex] = record;
        setInAppMsgSetting(prevState => ({
            ...prevState,
            steps: clone
        }));

    }

    const onChangeQuestion = (name, value) => {
        const obj = {...selectedStep, [name]: value}
        setSelectedStep(obj);
        updateStepRecord(obj)
    }

    const reactionPost = [
        {
            "id": "",
            "emoji": "👌",
            "emoji_url": "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f44c.png",
            is_active: 1,
        },
        {
            "id": "",
            "emoji": "🙏",
            "emoji_url": "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f64f.png",
            is_active: 1
        },
        {
            "id": "",
            "emoji": "👍",
            "emoji_url": "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f44d.png",
            is_active: 1
        },
        {
            "id": "",
            "emoji": "😀",
            "emoji_url": "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f600.png",
            is_active: 1
        },
        {
            "id": "",
            "emoji": "❤️",
            "emoji_url": "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/2764-fe0f.png",
            is_active: 1
        }
    ];
    const questionTypeOptions = [
        {label: "Net Promoter Score", value: 1, disabled: false},
        {label: "Numeric Scale", value: 2, disabled: false},
        {label: "Star Rating Scale", value: 3, disabled: false},
        {label: "Emoji Rating Scale", value: 4, disabled: false},
        {label: "Drop Down / List", value: 5, disabled: false},
        {label: "Short text entry", value: 6, disabled: false},
        {label: "Long text entry", value: 7, disabled: false},
        {label: "Thank you", value: 8, disabled: inAppMsgSetting.steps.filter((x) =>  x.question_type === 8).length > 0},
    ];

    const question = {
        1: "How likely are you to recommend us to family and friends?",
        2: "How satisfied are you with our product?",
        3: "How satisfied are you with our product?",
        4: "How satisfied are you with our product?",
        5: "",
        6: "",
        7: "",
        8: "Thanks for taking the survey!",
    }

    const handleSelectQuestionType = (value) => {
        let clone = [...inAppMsgSetting.steps];
        const stepBoj = {
            question_type: value,
            text: question[value],
            placeholder_text: value == 5 ? "Select one": "Enter text...",
            start_number: "1",
            end_number: "5",
            start_label: "Not likely",
            end_label: "Very likely",
            is_answer_required: "",
            step: value === 8 ? 1000 : clone.length + 1,
            options: value == 5 ? [
                {id: "", title: "", is_active: 1}
            ] : [],
            reactions: value == 4 ? reactionPost : [],
            is_active: 1,
            step_id: ""
        };
        const index = clone.findIndex(item => item.question_type === 8);
        if(index !== -1){
            clone.splice(index, 0, stepBoj);
        } else {
            clone.push(stepBoj);
        }
        setSelectedStep(stepBoj);
        setSelectedStepIndex(clone.length - 1);
        setInAppMsgSetting(prevState => ({
            ...prevState,
            steps: clone
        }));
    };

    const onSelectStep = (stepBoj, i) => {
        setSelectedStep(stepBoj);
        setSelectedStepIndex(i);
    }

    const handleEmojiSelect = (event) => {
        const clone = [...selectedStep.reactions];
        const obj = {
            "id": "",
            "emoji": event.emoji,
            "emoji_url": event.imageUrl,
            is_active: 1,
        }
        clone.push(obj)
        const objData = {...selectedStep,  reactions: clone}
        setSelectedStep(objData);
        updateStepRecord(objData)

    }

    const onDeleteReaction = (record, index) => {
        let clone = [...selectedStep.reactions];
        if (record.id) {
            clone[index] = {...record, is_active: 0}
        } else {
            clone.splice(index, 1)
        }
        const obj = {...selectedStep,  reactions: clone}
        setSelectedStep(obj);
        updateStepRecord(obj)
    }

    const onDeleteStep = (record, index) => {
        let clone = [...inAppMsgSetting.steps];
        if (record.step_id) {
            clone[index] = {...record, is_active: 0};
        } else {
            clone.splice(index, 1)
        }
        setInAppMsgSetting(prevState => ({
            ...prevState,
            steps: clone
        }));
        let newRecord = clone.filter((x) => x.is_active === 1);

        setSelectedStep({...newRecord[index]});
        setSelectedStepIndex(index);

    }


    return (
        <div className={"flex flex-col gap-4 py-8 bg-muted justify-start overflow-y-auto h-[calc(100%_-_94px)]"}>
            {
                inAppMsgSetting.steps.filter((x) => x.is_active === 1).map((x, i) => {
                    return(
                        <div className={`flex flex-col mx-auto gap-8 w-full max-w-[550px]`} key={i}>
                            <div onClick={(e) => onSelectStep(x, i)} className={"relative rounded-[10px] pt-8 p-6 cursor-pointer"} style={{backgroundColor: selectedStep.step === x.step ? inAppMsgSetting.bg_color : "#fff", color: selectedStep.step === x.step ?inAppMsgSetting.text_color : "#000"}}>
                                <div className={"absolute top-[8px] right-[8px]"}><X  size={16}/></div>
                                <div className={"flex gap-3"}>
                                    <div className={"flex-none pt-2 flex-1 w-8"}>
                                        {
                                            inAppMsgSetting.show_sender === 1 ? <Avatar className={"w-[32px] h-[32px]"}>
                                                {
                                                    userDetailsReducer?.user_photo ?
                                                        <AvatarImage src={userDetailsReducer?.user_photo} alt="@shadcn"/>
                                                        :
                                                        <AvatarFallback>{userDetailsReducer && userDetailsReducer?.name && userDetailsReducer?.name.substring(0, 1)}</AvatarFallback>
                                                }
                                            </Avatar> : <div>&nbsp;</div>
                                        }
                                    </div>
                                    <div className={`shrink p-2 border border-transparent hover:border hover:border-[#FFFFFF] w-full`} >
                                        <Input placeholder={"What's your question?"}
                                               value={x?.text || ""}
                                               onChange={(event) => onChangeQuestion("text", event.target.value)}
                                               className={"w-full text-sm border-none p-0 h-auto focus-visible:ring-offset-0 focus-visible:ring-0"}
                                               style={{backgroundColor: selectedStep.step === x.step ? inAppMsgSetting.bg_color : "#fff", color: selectedStep.step === x.step ?inAppMsgSetting.text_color : "#000"}}
                                        />
                                        {
                                            x?.question_type === 1 && <Fragment>
                                                <div className={"flex gap-3 px-[30px] pt-[18px]"}>
                                                    {
                                                        renderNumber(x).map(num => (
                                                            <Button key={num} variant={"outline"} className={"w-5 h-5 text-xs p-0"}>{num}</Button>
                                                        ))
                                                    }
                                                </div>
                                                <div className={"flex justify-between mt-[18px]"}>
                                                    <h5 className={"text-xs font-normal"}>{x?.start_label}</h5>
                                                    <h5 className={"text-xs font-normal"}>{x?.end_label}</h5>
                                                </div>
                                            </Fragment>
                                        }
                                        {
                                            x?.question_type === 2 &&
                                            <Fragment>
                                                <div
                                                    className={"flex justify-center gap-3 px-[30px] pt-[18px]"}>
                                                    {
                                                        renderNumber(x).map(num => (
                                                            <Button key={num} variant={"outline"} className={"w-5 h-5 text-xs p-0"}>{num}</Button>
                                                        ))
                                                    }
                                                </div>
                                                <div className={"flex justify-between mt-[18px]"}>
                                                    <h5 className={"text-xs font-normal"}>{x?.start_label}</h5>
                                                    <h5 className={"text-xs font-normal"}>{x?.end_label}</h5>
                                                </div>
                                            </Fragment>
                                        }
                                        {
                                            x?.question_type === 3 &&
                                            <Fragment>
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
                                            </Fragment>
                                        }
                                        {
                                            x?.question_type === 4 &&
                                            <Fragment>
                                                <div className={"flex justify-center gap-6 mt-6 mb-6 flex-wrap"}>
                                                        {
                                                            (x?.reactions || []).map((r, ind) => {
                                                                return (
                                                                    r.is_active === 1 ?
                                                                        <div className={"relative group hover:cursor-pointer"} key={ind}>
                                                                                <span onClick={() => onDeleteReaction(r, ind, i)}
                                                                                      className="absolute hidden group-hover:inline-block py-0.5 leading-none right-[-11px] top-[-13px] border rounded shadow -top-1 text-[9px] font-bold tracking-wide  px-0.5 text-background-accent dark:text-foreground/60 dark:border-gray-500/60  dark:bg-dark-accent bg-white">
                                                                                    <Trash2 size={16}/>
                                                                                </span>
                                                                            <img key={ind} className={"h-6 w-6 cursor-pointer"} src={r.emoji_url}/>
                                                                        </div> : ""
                                                                )
                                                            })
                                                        }
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <Button variant={"secondary"} className={"h-6 w-6 rounded-[100%] p-1"}><Plus
                                                                    size={16}/></Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-full p-0 border-none w-[310px]]">
                                                                <EmojiPicker theme={theme === "dark" ? "dark" : "light"} height={350}
                                                                             autoFocusSearch={true} open={true} searchDisabled={false}
                                                                             onEmojiClick={handleEmojiSelect}/>
                                                            </PopoverContent>
                                                        </Popover>
                                                    </div>

                                            </Fragment>
                                        }
                                        {
                                            x?.question_type === 5 &&
                                            <Fragment>
                                                <div className="mt-3">
                                                    <Select placeholder={x.placeholder_text} value={""}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={x.placeholder_text}/>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {x?.options.map((option, index) => (
                                                                option.is_active === 1 && <SelectItem key={index} value={index}>{option.title}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </Fragment>
                                        }
                                        {
                                            x?.question_type === 6 &&
                                            <Fragment>
                                                <div className="mt-3">
                                                    <Input placeholder={x.placeholder_text} value={""}/>
                                                </div>
                                            </Fragment>
                                        }
                                        {
                                            x?.question_type === 7 &&
                                            <Fragment>
                                                <div className="mt-3">
                                                    <Textarea placeholder={x.placeholder_text} value={""}/>
                                                </div>
                                            </Fragment>
                                        }
                                    </div>
                                    <div className={"flex-1 pt-2"}>
                                        <Button variant={"outline"} className={`p-0 h-6 w-6`} onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteStep(x, i)
                                        }}>
                                            <Trash2 size={12} className={""}/>
                                        </Button>
                                    </div>
                                </div>

                            </div>

                        </div>
                    )
                })
            }
            <div className={`flex justify-center mt-3`}>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className={"flex gap-[6px] font-semibold"}>
                            <Plus size={16} strokeWidth={3}/>
                            Add Steps
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuGroup>
                            {questionTypeOptions.map(option => (
                                <DropdownMenuCheckboxItem
                                    key={option.value}
                                    disabled={option.disabled}
                                    // checked={selectedQuestionTypes.includes(option.value)}
                                    // checked={selectedQuestionTypes === option.value}
                                    onCheckedChange={() => handleSelectQuestionType(option.value)}
                                >
                                    {option.label}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};
export default Surveys;