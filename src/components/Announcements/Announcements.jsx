import React,{useState} from 'react';
import {Button} from "../ui/button";
import ComboBox from "../Comman/ComboBox";
import {Input} from "../ui/input";
import AnnouncementsView from "./AnnouncementsView";
import AnnouncementsTable from "./AnnouncementsTable";
import {LayoutList, Plus, Text} from "lucide-react";
import CreateAnnouncementsLogSheet from "./CreateAnnouncementsLogSheet";


const items = [
    {
        value: "all",
        label: "All",
    },
    {
        value: "draft",
        label: "Draft",
    },
    {
        value: "published",
        label: "Published",
    },

];

const items2 =[
    {
        value: "bug_fix",
        label: "Bug Fix",
    },
    {
        value: "new",
        label: "New",
    },
    {
        value: "important",
        label: "Important",
    },
]

const Announcements = () => {
    const [selected, setSelected] = useState("");
    const [isSheetOpen, setSheetOpen] = useState(false);
    const [tab,setTab]=useState(0);

    const handleSelect = (value) => {
        setSelected(value);
    };

    const openSheet = () => setSheetOpen(true);
    const closeSheet = () => setSheetOpen(false);

    return (
        <div className={"container pt-8"}>
            <CreateAnnouncementsLogSheet isOpen={isSheetOpen} onOpen={openSheet} onClose={closeSheet}/>
            <div className={"flex flex-row gap-6 items-center"}>
                <div className="basis-1/4">
                    <h3 className={"text-2xl font-medium leading-8 text-[#0F172A]"}>testingapp</h3>
                </div>
                <div className="basis-2/4 gap-6">
                    <div className={"flex flex-row gap-6 items-center"}>
                        <ComboBox className={"h-8"} classNames={"w-[106px] custom-shadow"} items={items}  value={selected} setValue={setSelected} onSelect={handleSelect} placeholder={"All"}/>
                        <ComboBox items={items2} isSearchBox={true}  classNames={"w-[165px] custom-shadow"}   value={selected} setValue={setSelected} onSelect={""} placeholder={"All Updates"}/>
                        <form>
                            <div
                                className="relative ml-auto flex-1 md:grow-0 bg-white rounded-md shadow border-slate-300">
                                <Input
                                    type="search"
                                    placeholder="Search..."
                                    className="w-full pl-4 pr-14 w-[198px] text-slate-400 text-sm font-normal h-9"
                                />
                            </div>
                        </form>

                    </div>
                </div>
                <div className="basis-1/4">
                    <div className={"flex flex-grow gap-2 items-center"}>
                        <Button onClick={()=>setTab(0)} variant={"outline"} className={`h-9 w-9 p-2 ${tab === 0 ? "bg-violet-600" : "bg-white"} ${tab === 0 ? "hover:bg-[#7C3AED]" : "hover:bg-white"}`} >
                            <Text className={"w-5 h-5"} color={`${tab === 0 ? "#FFFFFF": "#5F5F5F"}`} />
                        </Button>
                        <Button onClick={ () =>setTab(1)} variant={"outline"} className={`h-9 w-9 shadow-3xl bg-white hover:bg-gray-200 p-2 ${tab === 1 ? "bg-violet-600" : "bg-white"} ${tab === 1 ? "hover:bg-[#7C3AED]" : "hover:bg-white"}`}>
                            <LayoutList className={"w-5 h-5"} color={`${tab === 1 ? "#FFFFFF": "#5F5F5F"}`} />
                        </Button>
                        <Button onClick={openSheet} variant={"outline hover:none"} className="h-10 w-10 bg-violet-600 text-[#fff] w-48">
                          <Plus className={"mr-4"} /> New Changelog
                        </Button>
                    </div>
                </div>
            </div>
            {
                tab === 0 ? <AnnouncementsTable/> : <AnnouncementsView/>
            }
        </div>
    );
}

export default Announcements;