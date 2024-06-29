import React, {useState} from 'react';
import {Sheet, SheetContent, SheetHeader} from "../../ui/sheet";
import {X} from "lucide-react";
import {Label} from "../../ui/label";
import {Input} from "../../ui/input";
import {Separator} from "../../ui/separator";
import {Button} from "../../ui/button";

const initialState ={
    name:""
}

const TopicsSheet = ({ isOpen, onOpen, onClose }) => {
    const [topicDetails,setTopicDetails]=useState(initialState);
    const onChange = (e) => {
        setTopicDetails({...topicDetails,[e.target.name]:e.target.value});
    }

    return (
        <Sheet open={isOpen} onOpenChange={isOpen ? onClose : onOpen}>
            <SheetContent className={"lg:max-w-[661px] sm:max-w-[520px] p-0"} >
                <SheetHeader className={"px-8 py-6 border-b"}>
                    <div className={"flex justify-between items-center w-full"}>
                        <h2 className={"text-xl font-medium capitalize"}>Add New Topics</h2>
                        <X onClick={onClose} className={"cursor-pointer"}/>
                    </div>
                </SheetHeader>
                <div className={"px-8 py-6"}>
                      <div className="grid w-full gap-2">
                          <Label htmlFor="name">Name</Label>
                          <Input onChange={onChange} name="name" placeholder={"Enter the name of Category"} type="text" id="name" className={"h-9"}/>
                      </div>
                </div>
                <Separator/>
                <div className={"px-8 py-6"}>
                    <Button>Add Category</Button>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default TopicsSheet;