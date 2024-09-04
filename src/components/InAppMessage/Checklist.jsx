import React from 'react';
import {ArrowLeft} from "lucide-react";
import {Progress} from "../ui/progress";
import {Card} from "../ui/card";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "../ui/accordion";
import {Checkbox} from "../ui/checkbox";
import {Button} from "../ui/button";
import {useTheme} from "../theme-provider";

const Checklist = ({openItem, setOpenItem}) => {
    const {theme} = useTheme();

    return (
        <div className={`py-16 border-t bg-muted`}>
            <div className={"flex justify-center"}>
                <div
                    className={`${theme == "dark" ? "bg-primary/15" : "bg-[#EEE4FF]"}  min-w-[408px] rounded-[10px] pt-4 pb-6`}>
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
                                                                  // disabled={x == openItem ? false : true}
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
    );
};

export default Checklist;