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
import {DO_SPACES_ENDPOINT} from "../../utils/constent";

const Surveys = ({inAppMsgSetting, setInAppMsgSetting, selectedStepIndex, setSelectedStepIndex, setSelectedStep, selectedStep, isLoading}) => {
    const {theme} = useTheme();
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const userDetailsReducer = allStatusAndTypes.members.find((x) => x.userId == inAppMsgSetting.from);

    const [starRating, setStarRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    const renderNumber = (x) => {
        const numbers = [];
        for (let i = Number(x?.questionType === 1 ? "0" : x?.startNumber); i <= Number(x?.questionType === 1 ? "10" : x?.endNumber); i++) {
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
            "emoji": "😣",
            "emojiUrl": "https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.1.2/img/apple/64/1f623.png",
            isActive: true,
        },
        {
            "id": "",
            "emoji": "😔",
            "emojiUrl": "https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.1.2/img/apple/64/1f614.png",
            isActive: true
        },
        {
            "id": "",
            "emoji": "😑",
            "emojiUrl": "https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.1.2/img/apple/64/1f610.png",
            isActive: true
        },
        {
            "id": "",
            "emoji": "🙂",
            "emojiUrl": "https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.1.2/img/apple/64/1f642.png",
            isActive: true
        },
        {
            "id": "",
            "emoji": "😍️",
            "emojiUrl": "https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.1.2/img/apple/64/1f60d.png",
            isActive: true
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
        {label: "Thank you", value: 8, disabled: inAppMsgSetting.steps?.filter((x) =>  x.questionType === 8).length > 0},
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
        let clone = [...inAppMsgSetting.steps].filter((x) => x.isActive);
        let existingQuestionType8 = clone.find((x) => x.questionType === 8);
        if (existingQuestionType8) {
            clone = clone.filter((x) => x.questionType !== 8);
        }
        const nextStepNumber = clone.length > 0 ? Math.max(...clone.map((step) => step.step)) + 1 : 1;
        const stepBoj = {
            questionType: value,
            text: question[value],
            placeholderText: value == 5 ? "Select one" : "Enter text...",
            startNumber: "1",
            endNumber: "5",
            startLabel: "Not likely",
            endLabel: "Very likely",
            isAnswerRequired: true,
            step: nextStepNumber,
            options: value == 5 ? [{ id: "", title: "", isActive: true }] : [],
            reactions: value == 4 ? reactionPost : [],
            isActive: true,
            stepId: ""
        };
        if (value !== 8) {
            clone.push(stepBoj);
        }
        if (existingQuestionType8 || value === 8) {
            const type8StepObj = existingQuestionType8 || {
                ...stepBoj,
                step: clone.length + 1,
            };
            type8StepObj.step = clone.length + 1;
            clone.push(type8StepObj);
        }
        setSelectedStep(stepBoj);
        const newStepIndex = clone.findIndex((x) => x.step === stepBoj.step);
        setSelectedStepIndex(newStepIndex);
        setInAppMsgSetting((prevState) => ({
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
            id: "",
            emoji: event.emoji,
            emojiUrl: event.imageUrl,
            isActive: true,
        }
        clone.push(obj)
        const objData = {...selectedStep,  reactions: clone}
        setSelectedStep(objData);
        updateStepRecord(objData)
    }

    const onDeleteReaction = (record, index) => {
        let clone = [...selectedStep.reactions];
        if (record.id) {
            clone[index] = {...record, isActive: false}
        } else {
            clone.splice(index, 1)
        }
        const obj = {...selectedStep,  reactions: clone}
        setSelectedStep(obj);
        updateStepRecord(obj)
    }

    const onDeleteStep = (record, index) => {
        let clone = [...inAppMsgSetting.steps];
        if (record.stepId) {
            const indexFind = clone.findIndex((x) => x.stepId === record.stepId);
            clone[indexFind] = { ...record, isActive: false };
        } else {
            clone.splice(index, 1);
        }
        let activeSteps = clone.filter((x) => x.isActive);
        activeSteps = activeSteps
            .filter((x) => x.questionType !== 8)
            .map((step, idx) => ({
                ...step,
                step: idx + 1,
            }));
        const questionType8Step = clone.find((x) => x.questionType === 8 && x.isActive);
        if (questionType8Step) {
            questionType8Step.step = activeSteps.length + 1;
            activeSteps.push(questionType8Step);
        }
        setInAppMsgSetting((prevState) => ({
            ...prevState,
            steps: activeSteps,
        }));
        const newSelectedIndex = Math.min(index, activeSteps.length - 1);
        setSelectedStep({ ...activeSteps[newSelectedIndex] });
        setSelectedStepIndex(newSelectedIndex);
    };

    return (
        <div className={"flex flex-col gap-4 py-8 px-[5px] md:px-0 bg-muted justify-start overflow-y-auto h-[calc(100%_-_94px)]"}>
            {
                inAppMsgSetting.steps.filter((x) => x.isActive).map((x, i) => {
                    return(
                        <div className={`flex items-center mx-auto gap-2 md:gap-8 w-full max-w-[623px] w-full`} key={i}>
                            <div className={"flex gap-1"}><span>Step</span> <span>{x.step}</span></div>
                            <div onClick={(e) => onSelectStep(x, i)} className={"relative rounded-[10px] p-4 md:pt-8 md:p-6 cursor-pointer w-full"} style={{backgroundColor: selectedStep.step === x.step ? inAppMsgSetting.bgColor : "#fff", color: selectedStep.step === x.step ?inAppMsgSetting.textColor : "#000"}}>
                                <div className={"absolute top-[8px] right-[8px]"}>
                                {
                                    inAppMsgSetting.isCloseButton ? <X size={16} stroke={inAppMsgSetting?.btnColor}/> : ""
                                }</div>
                                <div className={"flex gap-1 md:gap-3"}>
                                    {
                                        (inAppMsgSetting.from) ?
                                            <div className={"flex-none pt-2 flex-1 w-8"}>
                                                {
                                                    (inAppMsgSetting.showSender && inAppMsgSetting.from) ?
                                                        <Avatar className={"w-[32px] h-[32px]"}>
                                                            <AvatarImage src={userDetailsReducer?.profileImage ? `${DO_SPACES_ENDPOINT}/${userDetailsReducer?.profileImage}` : null} alt={`${userDetailsReducer?.firstName}${userDetailsReducer?.lastName}`}/>
                                                            <AvatarFallback
                                                                className={`${theme === "dark" ? "bg-card-foreground text-card" : ""} text-xs`}>
                                                                {userDetailsReducer?.firstName?.substring(0, 1)}{userDetailsReducer?.lastName?.substring(0, 1)}
                                                            </AvatarFallback>
                                                        </Avatar> : <div>&nbsp;</div>
                                                }
                                            </div> : ""
                                    }
                                    <div className={`shrink p-2 border border-transparent hover:border hover:border-[#FFFFFF] w-full`}>
                                        {
                                            (selectedStep.step === x.step) ? <Textarea
                                                placeholder="What's your question?"
                                                value={x?.text || ""}
                                                onChange={(event) => onChangeQuestion("text", event.target.value)}
                                                className={`w-full text-sm border-none p-0 h-auto focus-visible:ring-offset-0 focus-visible:ring-0 text-wrap`}
                                                style={{
                                                    backgroundColor: selectedStep.step === x.step ? inAppMsgSetting.bgColor : "#fff",
                                                    color: selectedStep.step === x.step ? inAppMsgSetting.textColor : "#000"
                                                }}
                                            /> : <span className={"text-wrap text-sm"}>{x.text}</span>
                                        }
                                        {
                                            x?.questionType === 1 && <Fragment>
                                                <div className={"flex flex-wrap gap-3 px-3 pt-3 md:px-[30px] md:pt-[18px]"}>
                                                    {
                                                        renderNumber(x).map(num => (
                                                            <Button key={num} variant={"outline"}
                                                                    className={`${theme === "dark" ? "bg-card-foreground hover:bg-card-foreground hover:text-muted" : ""} w-5 h-5 text-xs p-0`}
                                                            >{num}</Button>
                                                        ))
                                                    }
                                                </div>
                                                <div className={"flex justify-between gap-4 mt-[18px]"}>
                                                    <h5 className={"text-xs font-normal"}>{x?.startLabel}</h5>
                                                    <h5 className={"text-xs font-normal"}>{x?.endLabel}</h5>
                                                </div>
                                            </Fragment>
                                        }
                                        {
                                            x?.questionType === 2 &&
                                            <Fragment>
                                                <div
                                                    className={"flex justify-center flex-wrap gap-3 px-[30px] pt-[18px]"}>
                                                    {
                                                        renderNumber(x).map(num => (
                                                            <Button key={num} variant={"outline"} className={`${theme === "dark" ? "bg-card-foreground hover:bg-card-foreground hover:text-muted" : ""} w-5 h-5 text-xs p-0`}>{num}</Button>
                                                        ))
                                                    }
                                                </div>
                                                <div className={"flex justify-between gap-4 mt-[18px]"}>
                                                    <h5 className={"text-xs font-normal"}>{x?.startLabel}</h5>
                                                    <h5 className={"text-xs font-normal"}>{x?.endLabel}</h5>
                                                </div>
                                            </Fragment>
                                        }
                                        {
                                            x?.questionType === 3 &&
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
                                            x?.questionType === 4 &&
                                            <Fragment>
                                                <div className={"flex justify-center gap-6 my-6 flex-wrap"}>
                                                        {
                                                            (x?.reactions || []).map((r, ind) => {
                                                                return (
                                                                    r.isActive ?
                                                                        <div className={"relative group hover:cursor-pointer"} key={ind}>
                                                                                <span onClick={() => onDeleteReaction(r, ind, i)}
                                                                                      className="absolute hidden group-hover:inline-block py-0.5 leading-none right-[-11px] top-[-13px] border rounded shadow -top-1 text-[9px] font-bold tracking-wide  px-0.5 text-background-accent dark:text-foreground/60 dark:border-gray-500/60  dark:bg-dark-accent bg-white">
                                                                                    <Trash2 size={16} className={`${theme === "dark" ? "stroke-muted" : ""}`}/>
                                                                                </span>
                                                                            <img key={ind} className={"h-6 w-6 cursor-pointer"} src={r.emojiUrl}/>
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
                                            x?.questionType === 5 &&
                                            <Fragment>
                                                <div className="mt-3">
                                                    <Select placeholder={x.placeholderText} value={""}>
                                                        <SelectTrigger className={`${theme === "dark" ? "bg-card-foreground" : "border-card"} ring-offset-background-0`}>
                                                            <SelectValue placeholder={x.options.length ? x.placeholderText : "No data"} />
                                                        </SelectTrigger>
                                                        {x.options.length > 0 ? (
                                                            <SelectContent className={`max-w-[404px] ${theme === "dark" ? "bg-card-foreground" : ""}`}>
                                                                {x?.options.map((option, index) => (
                                                                    option.isActive &&
                                                                    <SelectItem className={`${theme === "dark" ? "focus:bg-card-foreground" : ""}`} key={index} value={index}>
                                                                        <span className={"block max-w-[300px] overflow-hidden whitespace-nowrap text-ellipsis"}>
                                                                            {option.title}
                                                                        </span>
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        ) : (
                                                            <SelectContent className={`max-w-[404px] ${theme === "dark" ? "bg-card-foreground" : ""}`}>
                                                                <SelectItem disabled>
                                                                    <span className="text-muted-foreground">No data</span>
                                                                </SelectItem>
                                                            </SelectContent>
                                                        )}
                                                    </Select>
                                                </div>
                                            </Fragment>
                                        }
                                        {
                                            x?.questionType === 6 &&
                                            <Fragment>
                                                <div className="mt-3">
                                                    <Input placeholder={x.placeholderText} value={""} className={`${theme === "dark" ? "bg-card-foreground" : ""}`}/>
                                                </div>
                                            </Fragment>
                                        }
                                        {
                                            x?.questionType === 7 &&
                                            <Fragment>
                                                <div className="mt-3">
                                                    <Textarea placeholder={x.placeholderText} value={""} className={`${theme === "dark" ? "bg-card-foreground" : ""}`}/>
                                                </div>
                                            </Fragment>
                                        }
                                    </div>
                                    <div className={"flex-1 pt-2"}>
                                        <Button variant={"outline"} className={`${theme === "dark" ? "bg-card-foreground hover:bg-card-foreground" : ""} p-0 h-6 w-6`} onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteStep(x, i)
                                        }}>
                                            <Trash2 size={12} className={`${theme === "dark" ? "stroke-muted" : ""}`}/>
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