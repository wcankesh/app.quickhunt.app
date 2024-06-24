import React, {useState} from 'react';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../ui/table";
import {Badge} from "../ui/badge";
import ComboBox from "../Comman/ComboBox";
import {Button} from "../ui/button";
import {Icon} from "../../utils/Icon";
import {BarChartBig, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Eye} from "lucide-react";

import SidebarSheet from "./SidebarSheet";
import {Card, CardContent, CardFooter} from "../ui/card";
import {DropdownMenu, DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";
import {DropdownMenuContent, DropdownMenuItem} from "../ui/dropdown-menu";
import {Separator} from "../ui/separator";
import NewCustomerSheet from "../Customers/NewCustomerSheet";

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
        color:"#389E0D"
    },
    {
        value: "draft",
        label: "Draft",
        color:"#CF1322"
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
                <CardContent className={"p-0 rounded-md"}>
                    <Table className={""}>
                        <TableHeader className={"py-8 px-5 bg-muted"}>
                            <TableRow className={""}>
                                <TableHead className={"text-base font-semibold py-5"}>Title</TableHead>
                                <TableHead className={"text-base font-semibold py-5"}>Last Updated</TableHead>
                                <TableHead className={"text-base font-semibold py-5"}>Published At</TableHead>
                                <TableHead  className={"text-base font-semibold py-5"}>Status</TableHead>
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
                                                <ComboBox isSearchBar={false} classNames={"w-[106px] h-7"} items={status} placeholder={x.status == 0 ? "Publish" : "Draft"} isSearchBox={false} isCommandItemBullet={true} />
                                            </TableCell>
                                            <TableCell>
                                                <Button onClick={openSheet} variant={"ghost"}><Eye size={18} /></Button>
                                            </TableCell>
                                            <TableCell>
                                                <Button variant={"ghost"} ><BarChartBig size={18} /></Button>
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
                </CardContent>
                <Separator/>
                <CardFooter className={"p-0"}>
                    <div className={"w-full p-5 bg-muted rounded-b-lg rounded-t-none flex justify-end pe-16 py-15px"}>
                        <div className={"flex flex-row gap-8 items-center"}>
                            <div>
                                <h5 className={"text-sm font-semibold"}>Page {dummyTable.page} of 10</h5>
                            </div>
                            <div className={"flex flex-row gap-2 items-center"}>
                                <Button variant={"outline"} className={"h-[30px] w-[30px] p-1.5 hover:none"}>
                                    <ChevronsLeft  className={`${dummyTable.preview === 0 ? "stroke-slate-300" : "stroke-primary"}`} />
                                </Button>
                                <Button variant={"outline"} className={"h-[30px] w-[30px] p-1.5 hover:none"}>
                                    <ChevronLeft  className={`${dummyTable.preview === 0 ? "stroke-slate-300" : "stroke-primary"}`} />
                                </Button>
                                <Button variant={"outline"} className={"h-[30px] w-[30px] p-1.5 hover:none"}>
                                    <ChevronRight  className={"stroke-primary"} />
                                </Button>
                                <Button variant={"outline"} className={"h-[30px] w-[30px] p-1.5 hover:none"}>
                                    <ChevronsRight className={"stroke-primary"} />
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default AnnouncementsTable;