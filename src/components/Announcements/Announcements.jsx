import React,{useState} from 'react';
import {Button} from "../ui/button";
import ComboBox from "../Comman/ComboBox";
import {Input} from "../ui/input";
import AnnouncementsView from "./AnnouncementsView";
import AnnouncementsTable from "./AnnouncementsTable";
import {LayoutList, Plus, Text} from "lucide-react";
import CreateAnnouncementsLogSheet from "./CreateAnnouncementsLogSheet";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "../ui/select";
import {useTheme} from "../theme-provider";



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
        color:"#FF3C3C"
    },
    {
        value: "new",
        label: "New",
        color:"#3B82F6"
    },
    {
        value: "important",
        label: "Important",
        color:"#63C8D9"
    },
];

const status =[
    {
        label:"All",
        value:0
    },
    {
        label:"Draft",
        value:1
    },
    {
        label:"Published",
        value:2
    }
]

const Announcements = () => {
    const [selected, setSelected] = useState("");
    const [isSheetOpen, setSheetOpen] = useState(false);
    const [tab,setTab]=useState(0);
    const {theme}=useTheme();

    const handleSelect = (value) => {
        setSelected(value);
    };

    const openSheet = () => setSheetOpen(true);
    const closeSheet = () => setSheetOpen(false);

    return (
        <div className={"xl:container xl:max-w-[1200px] lg:container lg:max-w-[992px] md:container md:max-w-[768px] sm:container sm:max-w-[639px] xs:container xs:max-w-[475px] pt-8 "}>
            <CreateAnnouncementsLogSheet isOpen={isSheetOpen} onOpen={openSheet} onClose={closeSheet}/>
            <div className={"flex flex-row gap-6 items-center xl:flex-nowrap md:flex-wrap sm:flex-wrap"}>
                <div className="basis-1/4">
                    <h3 className={"text-2xl font-medium leading-8"}>testingapp</h3>
                </div>
                <div className="basis-2/4 gap-6">
                    <div className={"flex flex-row gap-6 items-center"}>
                        <Select>
                            <SelectTrigger className="h-9">
                                <SelectValue placeholder="All"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {
                                        (status || []).map((x, index) => {
                                            return (
                                                <SelectItem key={index} value={x.value}>{x.label}</SelectItem>
                                            )
                                        })
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <ComboBox items={items2} isSearchBox={true}  classNames={"w-[165px] custom-shadow"} value={selected} setValue={setSelected} onSelect={handleSelect} placeholder={"All Updates"}/>
                        <form>
                            <div
                                className="relative ml-auto flex-1 md:grow-0">
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
                        <Button onClick={()=>setTab(0)} variant={"outline"} className={`h-9 w-9 p-2 ${tab === 0 ? "bg-violet-600" : ""} ${tab === 0 ? "hover:bg-[#7C3AED]" : ""}`} >
                            <Text className={"w-5 h-5"} color={`${tab === 0 ? "#FFFFFF": "#5F5F5F"}`} />
                        </Button>
                        <Button onClick={ () =>setTab(1)} variant={"outline"} className={`h-9 w-9 p-2 ${tab === 1 ? "bg-violet-600" : ""} ${tab === 1 ? "hover:bg-[#7C3AED]" : ""}`}>
                            <LayoutList className={"w-5 h-5"} color={`${tab === 1 ? "#FFFFFF": "#5F5F5F"}`} />
                        </Button>
                        <Button onClick={openSheet} className={"hover:bg-violet-600"}>
                          <Plus className={"mr-4"} size={18} /> New Changelog
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