import React, {useState} from 'react';
import {ArrowLeft, ChevronDown, Trash2} from "lucide-react";
import {Progress} from "../ui/progress";
import {Card} from "../ui/card";
import {Checkbox} from "../ui/checkbox";
import {Button} from "../ui/button";
import {useTheme} from "../theme-provider";
import {Input} from "../ui/input";
import {Avatar, AvatarFallback, AvatarImage} from "../ui/avatar";
import {useSelector} from "react-redux";
import Editor from "./Editor";
import {Collapsible, CollapsibleContent, CollapsibleTrigger,} from "../ui/collapsible"

const checklists = ({inAppMsgSetting, setInAppMsgSetting, isLoading, selectedStep, setSelectedStep, setSelectedStepIndex, selectedStepIndex}) => {
    const {theme} = useTheme();
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const userDetailsReducer =  allStatusAndTypes.members.find((x) => x.user_id == inAppMsgSetting.from);

    const onChange = (name, value) => {
        setInAppMsgSetting({...inAppMsgSetting, [name]: value});
    };

    const onSelectchecklists = (i, obj) => {
        setSelectedStep(obj)
        setSelectedStepIndex(i)
    }
    const updateStepRecord = (record) => {
        let clone =[...inAppMsgSetting.checklists];
        clone[selectedStepIndex] = record;
        setInAppMsgSetting({...inAppMsgSetting, checklists: clone});
    }

    const onChangechecklists = (name, value, record) => {
        const obj = {...record, [name]: value};
        setSelectedStep(obj)
        updateStepRecord(obj)

    };

    const handleAddStep = () => {
        let clone = [...inAppMsgSetting.checklists];
        const stepBoj = {
            title: "",
            description: [{type: "paragraph", data: {text: ""}}],
            action_type: 0,
            action_text: "Open",
            action_url: "",
            is_redirect: 0,
            is_active: 1,
            checklist_id: ""
        };
        clone.push(stepBoj);
        setSelectedStep(stepBoj);
        setSelectedStepIndex(clone.length - 1);
        setInAppMsgSetting(prevState => ({
            ...prevState,
            checklists: clone
        }));
    };

    const onDeleteStep = (record, index) => {
        let clone = [...inAppMsgSetting.checklists];
        if (record.checklist_id) {
            const indexFind =  clone.findIndex((x) => x.checklist_id === record.checklist_id)
            clone[indexFind] = {...record, is_active: 0};
        } else {
            clone.splice(index, 1)
        }
        setInAppMsgSetting(prevState => ({
            ...prevState,
            checklists: clone
        }));
        let newRecord = clone.filter((x) => x.is_active === 1);
        setSelectedStep({...newRecord[index]});
        setSelectedStepIndex(index);
    }

    return (
        <div className={`py-16 bg-muted overflow-y-auto h-[calc(100%_-_94px)]`}>
            <div className={"flex justify-center"}>
                <div className={`max-w-[450px] mx-auto w-full rounded-[10px] pt-4 pb-6`} style={{backgroundColor:inAppMsgSetting.bg_color}}>
                    <div className={"flex justify-between items-center px-4 gap-2"}>
                        <ArrowLeft size={16}/>
                        <Input placeholder={"checklists title"}
                               value={inAppMsgSetting.checklist_title}
                               style={{backgroundColor:inAppMsgSetting.bg_color}}
                               onChange={(event) => onChange("checklist_title", event.target.value)}
                               className={"w-full text-center border-none p-0 h-auto focus-visible:ring-offset-0 focus-visible:ring-0 text-xl font-medium"}
                        />
                    </div>
                    <div className={"flex flex-col justify-between items-center px-4 mt-3 gap-3"}>
                        <Input placeholder={"checklists description (optional)"}
                               value={inAppMsgSetting.checklist_description}
                               style={{backgroundColor:inAppMsgSetting.bg_color}}
                               onChange={(event) => onChange("checklist_description", event.target.value)}
                               className={"w-full  text-center text-sm border-none p-0 h-auto focus-visible:ring-offset-0 focus-visible:ring-0 font-medium"}
                        />
                        {
                            inAppMsgSetting.from ? <div className={"pt-0 flex flex-row gap-2 items-center"}>
                                <Avatar className={"w-[22px] h-[22px]"}>
                                    {
                                        userDetailsReducer?.user_photo ?
                                            <AvatarImage src={userDetailsReducer?.user_photo} alt="@shadcn"/>
                                            :
                                            <AvatarFallback>{userDetailsReducer && userDetailsReducer?.name && userDetailsReducer?.name.substring(0, 1)}</AvatarFallback>
                                    }
                                </Avatar>
                                <div className={""}>
                                    <div className={"flex flex-row gap-1"}>
                                        <h5 className={"text-xs leading-5 font-medium"}>{userDetailsReducer?.user_first_name} {userDetailsReducer?.user_last_name}</h5>
                                        <h5 className={`text-xs leading-5 font-medium ${theme === "dark" ? "" : "text-muted-foreground"}`}>from {projectDetailsReducer?.project_name}</h5>
                                    </div>
                                </div>
                            </div> : ""
                        }
                    </div>

                    <div className={"px-6 pt-8"}>
                        <div className={"flex justify-between"}>
                            <h5 className={"text-xs font-normal"}>{(inAppMsgSetting?.checklists || []).filter((x) =>x.is_active === 1).length} steps</h5>
                            <h5 className={"text-xs font-normal"}>1 of {(inAppMsgSetting?.checklists || []).filter((x) =>x.is_active === 1).length} step</h5>
                        </div>
                        <Progress value={0} className="w-full mt-[6px] mb-3 h-2"/>
                        <Card className={"rounded-[10px] gap-4 px-4 pb-6 pt-4 flex flex-col"}>
                            {
                                (inAppMsgSetting?.checklists || []).filter((x) =>x.is_active === 1).map((x, i) => {
                                    return (
                                        <Collapsible open={i == selectedStepIndex}  className={`p-4 text-sm w-full border rounded-md ${i == selectedStepIndex ? "border border-solid border-[#7C3AED]" : ""}`}>
                                            <CollapsibleTrigger asChild>
                                                <div className="flex items-center space-x-2 w-full"  >
                                                    <Checkbox className={"w-6 h-6"}/>
                                                    <Input placeholder={"Step title"}
                                                           value={x.title}
                                                           onChange={(e) => {
                                                               e.stopPropagation()
                                                               onChangechecklists("title", e.target.value, x);
                                                           }}
                                                           className={"w-full  text-sm border-none py-[10px] h-auto focus-visible:ring-offset-0 focus-visible:ring-0 font-medium"}
                                                    />
                                                    {
                                                        i == selectedStepIndex ? <Trash2 className={"cursor-pointer"} onClick={() => onDeleteStep(i)}/> :   <ChevronDown onClick={() => onSelectchecklists(i, x)} className={"cursor-pointer"}/>
                                                    }
                                                </div>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <div className={"ml-8"}>
                                                    <Editor id={`checklists-${i}`} blocks={x.description} onChange={(e) => onChangechecklists("description", e, x)} />
                                                    {selectedStep?.action_type === 1 && <Button style={{backgroundColor:inAppMsgSetting.btn_color,  color: inAppMsgSetting.text_color}} className={"mt-2"}>{selectedStep?.action_text}</Button>}
                                                </div>
                                            </CollapsibleContent>
                                        </Collapsible>

                                    )
                                })
                            }
                            <Button onClick={handleAddStep}>Add Step</Button>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default checklists;