import React, {useState} from 'react';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../ui/table";
import {Badge} from "../ui/badge";
import ComboBox from "../Comman/ComboBox";
import {Button} from "../ui/button";
import {Icon} from "../../utils/Icon";
import {Popover, PopoverTrigger} from "@radix-ui/react-popover";
import {PopoverContent} from "../ui/popover";
import {ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight} from "lucide-react";

import SidebarSheet from "./SidebarSheet";
import {Card} from "../ui/card";

const items = [
    {
        value: "all",
        label: "All",
    },
    {
        value: "none",
        label: "None",
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
]

const ChangelogTable = () => {
    const [isSheetOpen, setSheetOpen] = useState(false);

    const openSheet = () => setSheetOpen(true);
    const closeSheet = () => setSheetOpen(false);
    return (
        <div className={"mt-9"}>
            <SidebarSheet isOpen={isSheetOpen} onOpen={openSheet} onClose={closeSheet}/>
            <Card>
                <Table className={"border-inherit rounded-2xl"}>
                    <TableHeader className={"bg-[#F8F9FC] py-8 px-5"}>
                        <TableRow className={""}>
                            <TableHead className={"text-base font-semibold "}>Title</TableHead>
                            <TableHead className={"text-base font-semibold "}>Last Updated</TableHead>
                            <TableHead className={"text-base font-semibold "}>Published At</TableHead>
                            <TableHead  className={"text-base font-semibold "}>Status</TableHead>
                            <TableHead  className={"text-base font-semibold "}></TableHead>
                            <TableHead  className={"text-base font-semibold "}></TableHead>
                            <TableHead  className={"text-base font-semibold "}></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            (dummyTable.data || []).map((x,index)=>{
                                return(
                                    <TableRow>
                                        <TableCell className={""}>{x.title}&nbsp;&nbsp; <Badge  variant={"outline"} className={"bg-white border-blue text-xs text-blue rounded-[5px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.09)] font-medium"}>New</Badge></TableCell>
                                        <TableCell>{x.updated_at ? x.updated_at : "-"}</TableCell>
                                        <TableCell>{x.published_at ? x.published_at : "-"}</TableCell>
                                        <TableCell>
                                            <ComboBox classNames={"custom-shadow w-[106px] h-7"} items={status} placeholder={x.status === 0 ? "Publish" : "Draft"} isSearchBox={false} isCommandItemBullet={true} />
                                        </TableCell>
                                        <TableCell><Button className={"bg-slat-50 hover:bg-slat-50"}>{Icon.eye}</Button></TableCell>
                                        <TableCell>
                                            <Button className={"bg-slat-50 hover:bg-slat-50"} onClick={openSheet}>{Icon.analysis}</Button>

                                        </TableCell>
                                        <TableCell>
                                            <Popover>
                                                <PopoverTrigger>{Icon.threeDots}</PopoverTrigger>
                                                <PopoverContent className={"w-22 p-1"}>
                                                    <div className={"flex flex-col gap-1"}>
                                                        <Button className={"bg-white text-sm font-medium text-slate-700 text-start hover:bg-[#7C3AED] hover:text-white"}>Edit</Button>
                                                        <Button className={"bg-white text-sm font-medium text-slate-700 text-start hover:bg-[#7C3AED] hover:text-white"}>Delete</Button>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
                <div className={"w-full bg-[#F8F9FC] rounded-b-lg rounded-t-none flex justify-end pe-16 py-15px"}>
                    <div className={"flex flex-row gap-9 items-center"}>
                        <div>
                            <h5 className={"text-[#5F5F5F] text-sm font-semibold leading-[20px]"}>Page {dummyTable.page} of 10</h5>
                        </div>
                        <div className={"flex flex-row gap-2 items-center"}>
                            <Button className={"bg-[#fff] h-30px w-30px p-1.5 hover:bg-gray-200"}>
                                <ChevronsLeft  className={""} size={20} color={dummyTable.preview === 0 ? "#D6D6D6" : "7c3aed" } strokeWidth={1.75} />
                            </Button>
                            <Button className={"bg-[#fff] h-30px w-30px p-1.5 hover:bg-gray-200"}>
                                <ChevronLeft  className={""} size={20} color={dummyTable.preview === 0 ? "#D6D6D6" : "7c3aed" } strokeWidth={1.75} />
                            </Button>
                            <Button className={"bg-[#fff] h-30px w-30px p-1.5 hover:bg-gray-200"}>
                                <ChevronRight  className={""} size={20} color="#7c3aed" strokeWidth={1.75} />
                            </Button>
                            <Button className={"bg-[#fff] h-30px w-30px p-1.5 hover:bg-gray-200"}>
                                <ChevronsRight className={""} size={20} color="#7c3aed" strokeWidth={1.75} />
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>




        </div>
    );
};

export default ChangelogTable;