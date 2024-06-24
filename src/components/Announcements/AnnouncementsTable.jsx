import React, {useState} from 'react';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../ui/table";
import {Badge} from "../ui/badge";
import ComboBox from "../Comman/ComboBox";
import {Button} from "../ui/button";
import {Icon} from "../../utils/Icon";
import {ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight} from "lucide-react";

import SidebarSheet from "./SidebarSheet";
import {Card} from "../ui/card";
import {DropdownMenu, DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";
import {DropdownMenuContent, DropdownMenuItem} from "../ui/dropdown-menu";
import {Separator} from "../ui/separator";

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

const AnnouncementsTable = () => {
    const [isSheetOpen, setSheetOpen] = useState(false);

    const openSheet = () => setSheetOpen(true);
    const closeSheet = () => setSheetOpen(false);
    return (
        <div className={"mt-9"}>
            <SidebarSheet isOpen={isSheetOpen} onOpen={openSheet} onClose={closeSheet}/>
            <Card>
                <Table className={"border-inherit rounded-2xl"}>
                    <TableHeader className={"py-8 px-5 rounded"}>
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
                                        <TableCell className={""}>{x.title}
                                            <Badge variant={"outline"} className={"ml-4 h-[20px] py-0 px-2 text-xs rounded-[5px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.09)] font-medium text-blue-500 border-blue-500"}>New</Badge>
                                        </TableCell>
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
                                            <DropdownMenu>
                                                <DropdownMenuTrigger><Button variant={"outline hover:none"} className={"p-2 h-9 w-9 "}>{Icon.threeDots}</Button></DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                                    <DropdownMenuItem>Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
                <Separator/>
                <div className={"pt-4 pb-4 w-full rounded-b-lg rounded-t-none flex justify-end pe-16 py-[15px] bg-[--background]"}>
                    <div className={"flex flex-row gap-9 items-center"}>
                        <div>
                            <h5 className={"text-[#5F5F5F] text-sm font-semibold leading-[20px]"}>Page {dummyTable.page} of 10</h5>
                        </div>
                        <div className={"flex flex-row gap-2 items-center"}>
                            <Button variant={"outline"} className={"h-[30px] w-[30px] p-1.5"}>
                                <ChevronsLeft  className={dummyTable.preview === 0 ? "text-[#D6D6D6]" : "text-[7c3aed]"}  size={18}  strokeWidth={1.75} />
                            </Button>
                            <Button variant={"outline"} className={"h-[30px] w-[30px] p-1.5 "}>
                                <ChevronLeft  className={dummyTable.preview === 0 ? "text-[#D6D6D6]" : "text-violet-600"} size={18} color={dummyTable.preview === 0 ? "#D6D6D6" : "7c3aed" } strokeWidth={1.75} />
                            </Button>
                            <Button variant={"outline"} className={" h-[30px] w-[30px] p-1.5"}>
                                <ChevronRight  className={"text-violet-600"}  size={18}  />
                            </Button>
                            <Button variant={"outline"} className={"h-[30px] w-[30px] p-1.5 "}>
                                <ChevronsRight className={"text-violet-600"} size={18}/>
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default AnnouncementsTable;