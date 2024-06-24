import React, {useState} from 'react';
import {Sheet,
    SheetContent,
    SheetHeader,
} from "../ui/sheet";
import {Separator} from "../ui/separator";
import {Pin} from "lucide-react";
import {Label} from "../ui/label";
import {Input} from "../ui/input";
import {Textarea} from "../ui/textarea";
import ComboBox from "../Comman/ComboBox";
import {Switch} from "../ui/switch";
import clsx from "clsx";
import {Button} from "../ui/button";

const reaction ={
    data:[
        {
            author:"Ankesh",
            description:"“This  library has saved me countless hours of work and helped me deliver  stunning designs....”",
            email:"wc.ankesh112@gmail.com"
        },
        {
            author:"Ankesh",
            description:"“This  library has saved me countless hours of work and helped me deliver  stunning designs....”",
            email:"wc.ankesh112@gmail.com"
        },
        {
            author:"Ankesh",
            description:"“This  library has saved me countless hours of work and helped me deliver  stunning designs....”",
            email:"wc.ankesh112@gmail.com"
        }
    ],
    previous:0,
    next:true,
}

const labelItems = [
    {
        label:"Bug Fix",
        value:"bug_fix",
    },
    {
        label:"New",
        value:"new",
    },
    {
        label: "Imporatant",
        value:"important"
    }

]

const CreateAnnouncementsLogSheet = ({isOpen, onOpen, onClose }) => {
    return (

        <Sheet open={isOpen} onOpenChange={isOpen ? onClose : onOpen}>
                <SheetContent className={"pt-[24px] p-0 max-h-screen overflow-y-auto w-[662px] lg:max-w-[663px]"} >
                    <SheetHeader >
                        <div className={"py-[18px] px-8 flex flex-row justify-between items-center"} >
                            <h5 className={"text-xl font-medium leading-5 text-[#5F5F5F]"}>Create New Announcements</h5>
                            <Pin color="#5F5F5F" className={"h-4 w-4 mr-6"} />
                        </div>
                    </SheetHeader>
                    <Separator className={"mb-6"} />
                    <div className={"px-8"}>
                        <div className={"flex flex-col gap-6"}>
                            <div className="grid w-full gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input type="text" id="title" className={"h-9"}/>
                            </div>
                            <div className="grid w-full gap-2">
                                <Label className={"text-[14px] text=[#0F172A]"} htmlFor="link">Permalink / Slug</Label>
                                <Input type="text" className={"h-9"} id="link"/>
                                <p className={"text-[14px] font-normal leading-5"}>This release will be available at <span className={"text-violet-600 text-[14px]"}>https://testingapp.quickhunt.app/</span></p>
                            </div>
                            <div className="grid w-full gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea className={"min-h-[100px]"} type="text" id="description" placeholder={"Start writing..."}/>
                            </div>
                        </div>
                    </div>
                    <Separator className={"my-6"} />
                    <div className={"flex flex-col gap-4"}>
                        <div className={"px-8 flex flex-row gap-4 items-start"}>
                            <div className={"grid w-full gap-2 basis-1/2"}>
                                <Label htmlFor="label">Label</Label>
                                <ComboBox classNames={"w-full"} items={labelItems} placeholder={"adf"}/>
                            </div>
                            <div className="grid w-full gap-2 basis-1/2">
                                <Label htmlFor="label">Assign to</Label>
                                <ComboBox classNames={"w-full"} items={labelItems} placeholder={"adf"}/>
                            </div>
                        </div>
                        <div className={"px-8 flex flex-row gap-4 items-start"}>
                            <div className={"grid w-full gap-2 basis-1/2"}>
                                <Label htmlFor="label">Category</Label>
                                <ComboBox classNames={"w-full"} items={labelItems} placeholder={"adf"}/>
                            </div>
                            <div className="grid w-full gap-2 basis-1/2">
                                <Label htmlFor="date">Published at</Label>
                                <Input className={"h-9"} id={"date"} type={"date"}/>
                            </div>
                        </div>
                    </div>
                    <Separator className={"my-6"} />
                    <div className={"px-8"}>
                        <h5 className={"mb-3 text-[14px] font-medium leading-5"}>Featured Image</h5>
                        <div className={"flex flex-row gap-4"}>
                            <div className="flex items-center justify-center">
                                <label
                                    htmlFor="picture"
                                    className="flex w-[282px] h-[128px]  py-0 justify-center items-center flex-shrink-0 border-dashed border-[1px] border-gray-300 rounded cursor-pointer"
                                >
                                    <span className="text-center text-[#5F5F5F] font-semibold text-[14px]">Upload Image</span>
                                    <input
                                        id="picture"
                                        type="file"
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            <div className={"flex flex-col gap-[18px]"}>
                               <div className={"flex gap-6"}>
                                    <Switch/>
                                   <p className={"text-[14px] non-italic font-medium"}>Notify Customers</p>
                               </div>
                                <div className={"flex gap-6"}>
                                    <Switch/>
                                    <p className={"text-[14px] non-italic font-medium"}>Expire At</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Separator className={"my-6"} />
                    <div className={"pt-2 px-8 flex flex-row gap-4"}>
                        <Button variant={"outline "} className={"bg-violet-600 text-[#fff]"}>Publish Post</Button>
                        <Button variant={"outline "} className={"rounded-md border border-violet-600 text-violet-600 text-[14px] font-semibold"}>Save as Draft</Button>
                        <Button variant={"outline "} className={"rounded-md border border-violet-600 text-violet-600 text-[14px] font-semibold"}>Cancel</Button>
                    </div>
                </SheetContent>
        </Sheet>

    );
};

export default CreateAnnouncementsLogSheet;