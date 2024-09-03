import React, {useState} from 'react';
import {ArrowLeft} from "lucide-react";
import {Progress} from "../ui/progress";
import {Card} from "../ui/card";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "../ui/accordion";
import {Checkbox} from "../ui/checkbox";
import {Button} from "../ui/button";
import {useParams} from "react-router-dom";
import {useTheme} from "../theme-provider";
import {useSelector} from "react-redux";
import moment from "moment";

const initialState = {
    project_id: "2",
    title: "In app message",
    type: 1, //1=post,2=banner,3=survey,4=checklist
    body_text: "",
    from: "",
    reply_to: "",
    bg_color: "#ffffff",
    text_color: "#000000",
    icon_color: "#FD6B65",
    btn_color: "#7c3aed",
    delay: 1, //time in seconds
    start_at: moment().toISOString(),
    end_at: moment().add(1, 'hour').toISOString(),
    position: "top", //top/bottom
    alignment: "left", //left/right
    is_close_button: "", //true/false
    reply_type: "", //1=Text,2=Reaction
    question_type: 1, //1=Net Promoter Score,2=Numeric Scale,3=Star rating scale,4=Emoji rating scale,5=Drop Down / List,6=Questions
    start_number: 1,
    end_number: 10,
    start_label: "",
    end_label: "",
    placeholder_text: "",
    options: [''],
    show_sender: "", //boolean
    action_type: 1, //1=Open URL,2=Ask for Reaction,3=Collect visitor email
    action_text: "",
    action_url: "",
    is_redirect: "", //boolean
    is_banner_close_button: "", //boolean
    banner_style: "", //1=Inline,2=Floating,3=Top,4=Bottom
    reaction: "",
}

const Checklist = () => {
    const {id, type} = useParams()
    const {theme} = useTheme();

    const [messageType, setMessageType] = useState(Number(type) || 1);
    const [inAppMsgSetting, setInAppMsgSetting] = useState(initialState);
    const [openItem,setOpenItem]=useState("");

    return (
        <div>
            {
                messageType == 4 && <div className={`py-16 border-t`}>
                    <div className={"flex justify-center"}>
                        <div className={`${theme == "dark" ? "bg-primary/15" : "bg-[#EEE4FF]"}  min-w-[408px] rounded-[10px] pt-4 pb-6`}>
                            <div className={"flex justify-between items-center px-4"}>
                                <ArrowLeft size={16}/>
                                <h5 className={`text-xl font-medium underline decoration-dashed underline-offset-4 ${theme == "dark" ? "" : "text-muted-foreground"}`}>Untitled</h5>
                                <div/>
                            </div>
                            <h5 className={`mt-3 text-sm text-center font-normal ${theme == "dark" ? "" : "text-muted-foreground"}`}>Enter
                                Description (Optional)</h5>
                            <div className={"px-6 pt-8"}>
                                <div className={"flex justify-between"}>
                                    <h5 className={"text-xs font-normal"}>20%</h5>
                                    <h5 className={"text-xs font-normal"}>1 of 5 step</h5>
                                </div>
                                <Progress value={20} className="w-full mt-[6px] mb-3 h-2"/>
                                <Card className={"rounded-[10px] gap-2 px-4 pb-6 pt-4"}>
                                    <Accordion type="single" collapsible
                                               className="w-full p-1 flex flex-col gap-2" value={openItem}
                                               onValueChange={(value) => setOpenItem(value)}>
                                        {
                                            [1, 2, 3, 4, 5].map((x) => {
                                                return (
                                                    <AccordionItem key={x}
                                                                   className={`my-1 px-4 border rounded-md ${x == openItem ? "border border-solid border-[#7C3AED]" : ""}`}
                                                                   value={x}>
                                                        <AccordionTrigger className={" "}>
                                                            <div className="flex items-center space-x-2">
                                                                <Checkbox id="terms"
                                                                          disabled={x == openItem ? false : true}
                                                                          className={"w-6 h-6"}/>
                                                                <label
                                                                    htmlFor="terms"
                                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                                >
                                                                    Step ({x})
                                                                </label>
                                                            </div>
                                                        </AccordionTrigger>
                                                        <AccordionContent>
                                                            <div className={"ml-8"}>
                                                                <h5 className={`${theme == "dark" ? "" : "text-muted-foreground"}`}>Enter
                                                                    Description</h5>
                                                                <Button className={"my-8"}>Add Button
                                                                    name</Button>
                                                            </div>
                                                            <h5 className={`text-[10px] ${theme == "dark" ? "" : "text-muted-foreground"}`}>*Complete
                                                                Step by clicking Checkbox </h5>
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                )
                                            })
                                        }
                                    </Accordion>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default Checklist;