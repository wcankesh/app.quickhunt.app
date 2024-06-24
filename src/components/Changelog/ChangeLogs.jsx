import React,{useState} from 'react';
import {Button} from "../ui/button";
import ComboBox from "../Comman/ComboBox";
import {Input} from "../ui/input";
import {Icon} from "../../utils/Icon"

import ChangeLogView from "./ChangeLogView";
import ChangelogTable from "./ChangelogTable";


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

const dummyTable = {
    data: [{
        title: "Welcome To Our Release Notes",
        updated_at: "11 hour ago",
        published_at: "2 hours ago",
        status: 0,
        id: 1,
        isNew: 1,
    },
        {
            title: "Welcome To Our Release Notes",
            updated_at: "",
            published_at: "",
            status: 0,
            id: 1,
            isNew: 0
        },
        {
            title: "Welcome To Our Release Notes",
            updated_at: "",
            published_at: "2 hours ago",
            status: 1,
            id: 1,
            isNew: 0
        }],
    page:1,
    preview:0
};

const status =[
    {
        value: "publish",
        label: "Publish",
    },
    {
        value: "draft",
        label: "Draft",
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

const ChangeLogs = () => {
    const [selected, setSelected] = useState("");
    const [tab,setTab]=useState(0);
    console.log(tab)

    const handleSelect = (value) => {
        setSelected(value);
        console.log(value);
    };

    return (
        <div className={"container pt-8"}>
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
                    <div className={"flex flex-grow gap-2"}>
                        <Button onClick={()=>setTab(0)} className={`custom-shadow h-9 w-9 border-[#000017]  p-2 ${tab === 0 ? "bg-[#7C3AED]" : "bg-white"} ${tab === 0 ? "hover:bg-[#7C3AED]" : "hover:bg-white"}`} >{tab === 0 ? Icon.menu : Icon.menuBlack}</Button>
                        <Button onClick={()=>setTab(1)} className={`custom-shadow h-9 w-9 shadow-3xl bg-white border-[#000017] hover:bg-gray-200 p-2 ${tab === 1 ? "bg-[#7C3AED]" : "bg-white"} ${tab === 1 ? "hover:bg-[#7C3AED]" : "hover:bg-white"}`}>
                            {tab === 1 ? Icon.detailViewWhite : Icon.detailView}
                        </Button>
                        <Button className="custom-shadow h-10 w-10 bg-violet-600 hover:bg-violet-800 w-48">
                            {Icon.plusWhite} &nbsp;&nbsp; New Changelog
                        </Button>
                    </div>
                </div>
            </div>
            {
                tab === 0 ? <ChangelogTable/> : <ChangeLogView/>
            }
        </div>
    );
}

export default ChangeLogs;