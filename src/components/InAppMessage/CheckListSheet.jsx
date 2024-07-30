import React,{Fragment} from 'react';
import {Sheet, SheetContent, SheetHeader} from "../ui/sheet";
import {ArrowLeft, Circle, X} from "lucide-react";
import {useTheme} from "../theme-provider";
import {Select, SelectGroup, SelectValue} from "@radix-ui/react-select";
import {SelectContent, SelectItem, SelectTrigger} from "../ui/select";
import {Button} from "../ui/button";

const status = [
    {name: "Any", value: 0, fillColor: "", strokeColor: "",},
    {name: "Draft", value: 1, fillColor: "#CF1322", strokeColor: "#CF1322",},
    {name: "Live", value: 2, fillColor: "#CEF291", strokeColor: "#CEF291",},
    {name: "Paused", value: 3, fillColor: "#6392D9", strokeColor: "#6392D9",},
    {name: "Scheduled", value: 4, fillColor: "#63C8D9", strokeColor: "#63C8D9",},
];

const initialState ={

}

const CheckListSheet = ({isOpen,onClose,onOpen}) => {
    const {theme} =useTheme();

    const handleStatusChange = () => {

    }

    return (
        <Sheet open={isOpen} onOpenChange={isOpen ? onClose : onOpen}>
            <SheetContent className={"sm:max-w-[1400px] sm:overflow-auto p-0"}>
                <SheetHeader className={"pl-8 pt-[17px] pb-[17px] pr-[33px] border-b"}>
                    <div className={"flex justify-between items-center"}>
                        <div className={"flex items-center gap-2"}>
                            <ArrowLeft className={`${theme === "dark" ? "" : "text-muted-foreground"}`} size={16} />
                            <div className={"flex items-center gap-4 "}>
                                <h4 className={`${theme === "dark" ? "" : "text-muted-foreground"} text-xl capitalize font-bold underline decoration-dashed underline-offset-4`}>Untitled</h4>
                            </div>
                        </div>
                        <div className={"flex flex-row gap-4 items-center"}>
                            <Select value={1} onValueChange={(value) => handleStatusChange()}>
                                <SelectTrigger className="w-[135px] h-7">
                                    <SelectValue placeholder="Publish"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {
                                            (   status || []).map((x, i) => {
                                                return (
                                                    <Fragment key={i}>
                                                        <SelectItem value={x.value}>
                                                            <div
                                                                className={"flex items-center gap-2"}>
                                                                {x.fillColor && <Circle fill={x.fillColor}
                                                                                        stroke={x.strokeColor}
                                                                                        className={`${theme === "dark" ? "" : "text-muted-foreground"} w-2 h-2`}/>}
                                                                {x.name}
                                                            </div>
                                                        </SelectItem>
                                                    </Fragment>
                                                )
                                            })
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <Button>Save Changes</Button>
                            <Button onClick={onClose} className={`h-5 w-5 p-0 ${theme === "dark" ? "" : "text-muted-foreground"}`} variant={"ghost"}><X size={18} className={"h-5 w-5"}/></Button>
                        </div>
                    </div>
                </SheetHeader>
                <div className={"grid lg:grid-cols-12 md:grid-cols-1 overflow-auto h-[100vh]"}>
                    <div className={`col-span-8 lg:block hidden border-r lg:overflow-auto pb-[100px]`}>
                        8
                    </div>
                    <div className={"col-span-4 lg:overflow-auto pb-[100px]"}>
                        <div className={"px-8 py-4 border-b"}>
                            <h5 className={"text-base font-medium leading-5"}>Content</h5>
                        </div>



                    </div>
                </div>

            </SheetContent>
        </Sheet>
    );
};

export default CheckListSheet;