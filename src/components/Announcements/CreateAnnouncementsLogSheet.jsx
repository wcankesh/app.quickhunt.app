import React, {Fragment, useState} from 'react';
import {Sheet, SheetContent, SheetHeader,} from "../ui/sheet";
import {Separator} from "../ui/separator";
import {Circle, Pin, X} from "lucide-react";
import {Label} from "../ui/label";
import {Input} from "../ui/input";
import {Textarea} from "../ui/textarea";
import {Switch} from "../ui/switch";
import {Button} from "../ui/button";
// import {Select, SelectValue} from "@radix-ui/react-select";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue,} from "../ui/select";

const reaction = {
    data: [
        {
            author: "Ankesh",
            description: "“This  library has saved me countless hours of work and helped me deliver  stunning designs....”",
            email: "wc.ankesh112@gmail.com"
        },
        {
            author: "Ankesh",
            description: "“This  library has saved me countless hours of work and helped me deliver  stunning designs....”",
            email: "wc.ankesh112@gmail.com"
        },
        {
            author: "Ankesh",
            description: "“This  library has saved me countless hours of work and helped me deliver stunning designs....”",
            email: "wc.ankesh112@gmail.com"
        }
    ],
    previous: 0,
    next: true,
}

const label = [
    {name: "Bug Fix", value: "bug_fix", fillColor: "#FF3C3C", strokeColor: "#FF3C3C"},
    {name: "New", value: "new", fillColor: "#3B82F6", strokeColor: "#3B82F6"},
    {name: "Important", value: "important", fillColor: "#63C8D9", strokeColor: "#63C8D9"},
]
const category = [
    {name: "Website", value: "1"},
    {name: "Public Api", value: "2"},
    {name: "iOS App", value: "3"},
    {name: "Android App", value: "4"},
    {name: "Web App", value: "5"},

]

const CreateAnnouncementsLogSheet = ({isOpen, onOpen, onClose}) => {
    const [previewImage,setPreviewImage] = useState("");

    const handleFileChange = (event) => {
        setPreviewImage(URL.createObjectURL(event.target.files[0]));
    };
    return (
        <Sheet open={isOpen} onOpenChange={isOpen ? onClose : onOpen}>
            <SheetContent className={"pt-[24px] p-0 overflow-y-auto w-[662px] lg:max-w-[663px] h-full h-screen"}>
                <SheetHeader className={"px-8 py-6 flex flex-row justify-between items-center"}>
                    <h5 className={"text-xl font-medium leading-5"}>Create New Announcements</h5>
                    <div className={"flex items-center gap-6"}>
                        <Button className={"h-5 w-5 p-0"} variant={"ghost"}><Pin className={"h-4 w-4"} size={18}/></Button>
                        <Button className={"h-5 w-5 p-0"} onClick={onClose} onClick={onClose} variant={"ghost"}><X size={18} className={"h-5 w-5"}/></Button>
                    </div>
                </SheetHeader>
                <Separator className={"mb-6"}/>
                <div className={"px-8"}>
                    <div className={"flex flex-col gap-6"}>
                        <div className="grid w-full gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input type="text" id="title" className={"h-9"}/>
                        </div>
                        <div className="grid w-full gap-2">
                            <Label className={"text-[14px] text=[#0F172A]"} htmlFor="link">Permalink / Slug</Label>
                            <Input type="text" className={"h-9"} id="link"/>
                            <p className={"text-[14px] font-normal leading-5"}>This release will be available at <span
                                className={"text-violet-600 text-[14px]"}>https://testingapp.quickhunt.app/</span></p>
                        </div>
                        <div className="grid w-full gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea className={"min-h-[100px]"} type="text" id="description"
                                      placeholder={"Start writing..."}/>
                        </div>
                    </div>
                </div>
                <Separator className={"my-6"}/>
                <div className={"flex flex-col gap-4"}>
                    <div className={"px-8 flex flex-row gap-4 items-start"}>
                        <div className="grid w-full gap-2 basis-1/2">
                            <Label htmlFor="label">Label</Label>
                            <Select>
                                <SelectTrigger className="h-9">
                                    <SelectValue placeholder="Nothing Selected"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {
                                            (label || []).map((x, i) => {
                                                return (
                                                    <Fragment key={i}>
                                                        <SelectItem value={x.value}>
                                                            <div className={"flex items-center gap-2"}>
                                                                <Circle className={`w-[10px] h-[10px]`}
                                                                        fill={x.fillColor} stroke={x.strokeColor}/>
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
                        </div>
                        <div className="grid w-full gap-2 basis-1/2">
                            <Label htmlFor="label">Assign to</Label>
                            <Select>
                                <SelectTrigger className={"h-9"}>
                                    <SelectValue className={"text-muted-foreground text-sm"} placeholder="Assign to"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="ankesh_ramani">Ankesh Ramani</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className={"px-8 flex flex-row gap-4 items-start"}>
                        <div className={"grid w-full gap-2 basis-1/2"}>
                            <Label htmlFor="label">Category</Label>
                            <Select>
                                <SelectTrigger className="h-9">
                                    <SelectValue placeholder="Category"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {
                                            (category || []).map((x, i) => {
                                                return (
                                                    <SelectItem key={i} value={x.value}>{x.name}</SelectItem>
                                                )
                                            })
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid w-full gap-2 basis-1/2">
                            <Label htmlFor="date">Published at</Label>
                            <Input className={"h-9"} id={"date"} type={"date"}/>
                        </div>
                    </div>
                </div>
                <Separator className={"my-6"}/>
                <div className={"px-8"}>
                    <h5 className={"mb-3 text-[14px] font-medium leading-5"}>Featured Image</h5>
                    <div className={"flex flex-row flex-wrap gap-4"}>
                        <div className="flex items-center justify-center">
                                <label
                                    htmlFor="picture"
                                    className="flex w-[282px] h-[128px] py-0 justify-center items-center flex-shrink-0 border-dashed border-[1px] border-gray-300 rounded cursor-pointer"
                                >
                                  {previewImage ? <img className={"h-[70px] w-[70px] rounded-md object-cover"} src={previewImage} alt={"not_found"} /> : <span className="text-center text-muted-foreground font-semibold text-[14px]">Upload Image</span>}
                                  <input
                                        id="picture"
                                        type="file"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        accept="image/*"
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
                <Separator className={"my-6"}/>
                <div className={"pt-2 pb-8 px-8 flex flex-row gap-4 flex-wrap"}>
                    <Button variant={"outline "} className={"bg-violet-600 text-[#fff]"}>Publish Post</Button>
                    <Button variant={"outline "}
                            className={"rounded-md border border-violet-600 text-violet-600 text-[14px] font-semibold"}>Save as Draft</Button>
                    <Button variant={"outline "}
                            className={"rounded-md border border-violet-600 text-violet-600 text-[14px] font-semibold"}>Cancel</Button>
                </div>
            </SheetContent>
        </Sheet>

    );
};

export default CreateAnnouncementsLogSheet;