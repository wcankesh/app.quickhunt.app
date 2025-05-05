import React from 'react';
import {ChevronDown, Trash2} from "lucide-react";
import {Progress} from "../ui/progress";
import {Card} from "../ui/card";
import {Checkbox} from "../ui/checkbox";
import {Button} from "../ui/button";
import {useTheme} from "../theme-provider";
import {Input} from "../ui/input";
import {Avatar, AvatarFallback, AvatarImage} from "../ui/avatar";
import {useSelector} from "react-redux";
import Editor from "../Comman/Editor";
import {Collapsible, CollapsibleContent, CollapsibleTrigger,} from "../ui/collapsible"
import {DO_SPACES_ENDPOINT} from "../../utils/constent";

const checklists = ({
                        inAppMsgSetting,
                        setInAppMsgSetting,
                        selectedStep,
                        setSelectedStep,
                        setSelectedStepIndex,
                        selectedStepIndex
                    }) => {
    const {theme} = useTheme();
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const userDetailsReducer = allStatusAndTypes.members.find((x) => x.userId == inAppMsgSetting.from);

    const onChange = (name, value) => {
        setInAppMsgSetting({...inAppMsgSetting, [name]: value});
    };

    const onSelectChecklists = (i, obj) => {
        setSelectedStep(obj)
        setSelectedStepIndex(i)
    }

    const updateStepRecord = (record) => {
        let clone = [...inAppMsgSetting.checklists];
        clone[selectedStepIndex] = record;
        setInAppMsgSetting({...inAppMsgSetting, checklists: clone});
    }

    const onChangeChecklists = (name, value, record) => {
        const obj = {...record, [name]: value};
        setSelectedStep(obj)
        updateStepRecord(obj)
    };

    const handleAddStep = () => {
        let clone = [...inAppMsgSetting.checklists].filter((x) => x.isActive);
        const stepBoj = {
            title: "",
            description: [{type: "paragraph", data: {text: ""}}],
            actionType: 0,
            actionText: "Open",
            actionUrl: "",
            isRedirect: false,
            isActive: true,
            checklistId: ""
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
        if (record.checklistId) {
            const indexFind = clone.findIndex((x) => x.checklistId === record.checklistId)
            clone[indexFind] = {...record, isActive: false};
        } else {
            clone.splice(index, 1)
        }
        setInAppMsgSetting(prevState => ({
            ...prevState,
            checklists: clone
        }));
        let newRecord = clone.filter((x) => x.isActive);
        setSelectedStep({...newRecord[index]});
        setSelectedStepIndex(index);
    }

    const handleEditorChange = (id, newData) => {
        setInAppMsgSetting((prev) => ({
            ...prev,
            checklists: prev.checklists.map((x, i) => {
                if (i === id) {
                    return {...x, description: newData.blocks};
                }
                return {...x};
            }),
        }));
    };

    return (
        <div className={`py-16 px-[5px] md:px-0 bg-muted overflow-y-auto h-[calc(100%_-_94px)]`}>
            <div className={"flex justify-center"}>
                <div className={`max-w-[450px] mx-auto w-full rounded-[10px] pt-4 pb-6`}
                     style={{backgroundColor: inAppMsgSetting.bgColor}}>
                    <div className={"flex justify-between items-center px-4 gap-2"}>
                        <Input placeholder={"checklists title"}
                               value={inAppMsgSetting.checklistTitle || ''}
                               style={{backgroundColor: inAppMsgSetting.bgColor, color: inAppMsgSetting.textColor}}
                               onChange={(event) => onChange("checklistTitle", event.target.value)}
                               className={"w-full text-center border-none p-0 h-auto focus-visible:ring-offset-0 focus-visible:ring-0 text-xl font-normal"}
                        />
                    </div>
                    <div className={"flex flex-col justify-between items-center px-4 mt-3 gap-3"}>
                        <Input placeholder={"checklists description (optional)"}
                               value={inAppMsgSetting.checklistDescription || ''}
                               style={{backgroundColor: inAppMsgSetting.bgColor, color: inAppMsgSetting.textColor}}
                               onChange={(event) => onChange("checklistDescription", event.target.value)}
                               className={"w-full text-center text-sm border-none p-0 h-auto focus-visible:ring-offset-0 focus-visible:ring-0 font-normal"}
                        />
                        {
                            inAppMsgSetting.from ? <div className={"pt-0 flex flex-row gap-2 items-center"}>
                                <Avatar className={"w-[32px] h-[32px]"}>
                                    <AvatarImage src={userDetailsReducer?.profileImage ? `${DO_SPACES_ENDPOINT}/${userDetailsReducer?.profileImage}` : null}
                                                 alt={`${userDetailsReducer?.firstName}${userDetailsReducer?.lastName}`}/>
                                    <AvatarFallback
                                        className={`${theme === "dark" ? "bg-card-foreground text-card" : ""} text-xs`}
                                        style={{color: inAppMsgSetting.textColor}}>
                                        {userDetailsReducer?.firstName?.substring(0, 1)}{userDetailsReducer?.lastName?.substring(0, 1)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className={"flex flex-row gap-1"}>
                                    <h5 className={`text-xs font-normal text-muted-foreground`}
                                        style={{color: inAppMsgSetting.textColor}}>{userDetailsReducer?.firstName} {userDetailsReducer?.lastName}</h5>
                                    <h5 className={`text-xs font-normal text-muted-foreground`}
                                        style={{color: inAppMsgSetting.textColor}}>from {projectDetailsReducer?.name}</h5>
                                </div>
                            </div> : ""
                        }
                    </div>

                    <div className={"px-6 pt-8"}>
                        <div className={"flex justify-between"}>
                            <h5 className={`text-xs font-normal ${theme === "dark" ? "text-muted" : "text-muted-foreground"}`}
                                style={{color: inAppMsgSetting.textColor}}>{(inAppMsgSetting?.checklists || []).filter((x) => x.isActive).length} steps</h5>
                            <h5 className={`text-xs font-normal ${theme === "dark" ? "text-muted" : "text-muted-foreground"}`}
                                style={{color: inAppMsgSetting.textColor}}>1
                                of {(inAppMsgSetting?.checklists || []).filter((x) => x.isActive).length} step</h5>
                        </div>
                        <Progress value={0}
                                  className={`${theme === "dark" ? "bg-card-foreground" : ""} w-full mt-[6px] mb-3 h-2`}/>
                        <Card className={"rounded-[10px] gap-4 px-4 pb-6 pt-4 flex flex-col"}>
                            {
                                (inAppMsgSetting?.checklists || []).filter((x) => x.isActive).map((x, i) => {
                                    return (
                                        <Collapsible key={i} open={i == selectedStepIndex}
                                                     className={`p-4 text-sm w-full border rounded-md ${i == selectedStepIndex ? "border border-solid border-[#7C3AED]" : ""}`}>
                                            <CollapsibleTrigger asChild>
                                                <div className="flex items-center space-x-2 w-full">
                                                    <Checkbox className={"w-6 h-6"}/>
                                                    <Input placeholder={"Step title"}
                                                           value={x.title}
                                                           onClick={() => onSelectChecklists(i, x)}
                                                           onChange={(e) => {
                                                               e.stopPropagation()
                                                               onChangeChecklists("title", e.target.value, x);
                                                           }}
                                                           className={"w-full  text-sm border-none py-[10px] h-auto focus-visible:ring-offset-0 focus-visible:ring-0 font-normal"}
                                                    />
                                                    {
                                                        i == selectedStepIndex ? <Trash2 className={"cursor-pointer"}
                                                                                         onClick={() => onDeleteStep(x, i)}/> :
                                                            <ChevronDown onClick={() => onSelectChecklists(i, x)}
                                                                         className={"cursor-pointer"}/>
                                                    }
                                                </div>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <div className={"ml-8"}>
                                                    <Editor
                                                        blocks={x.description}
                                                        onChange={(newData) => handleEditorChange(i, newData)}
                                                    />
                                                    {selectedStep?.actionType === 1 && <Button style={{
                                                        backgroundColor: inAppMsgSetting.btnColor,
                                                        color: inAppMsgSetting.btnTextColor
                                                    }} className={"mt-2"}>{selectedStep?.actionText}</Button>}
                                                </div>
                                            </CollapsibleContent>
                                        </Collapsible>

                                    )
                                })
                            }
                            <Button className={"hover:bg-primary"} onClick={handleAddStep}>Add Step</Button>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default checklists;