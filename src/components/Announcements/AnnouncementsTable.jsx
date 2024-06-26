import React, {useState,Fragment} from 'react';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../ui/table";
import {Badge} from "../ui/badge";
import ComboBox from "../Comman/ComboBox";
import {Button} from "../ui/button";
import {Icon} from "../../utils/Icon";
import {
    BarChart,
    BarChartBig,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight, Circle,
    Ellipsis,
    Eye
} from "lucide-react";

import SidebarSheet from "./SidebarSheet";
import {Card, CardContent, CardFooter} from "../ui/card";
import {DropdownMenu, DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";
import {DropdownMenuContent, DropdownMenuItem} from "../ui/dropdown-menu";
import {Separator} from "../ui/separator";
import NewCustomerSheet from "../Customers/NewCustomerSheet";
import CreateAnnouncementsLogSheet from "./CreateAnnouncementsLogSheet";
import {Select, SelectItem, SelectGroup, SelectContent, SelectTrigger, SelectValue} from "../ui/select";

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

const status = [
    {name: "Public", value: "public", fillColor: "#389E0D", strokeColor: "#389E0D",},
    {name: "Draft", value: "draft", fillColor: "#CF1322", strokeColor: "#CF1322",},
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
                        <TableHeader className={"py-8 px-5"}>
                            <TableRow className={""}>
                                <TableHead className={"text-base font-semibold py-5 bg-muted rounded-tl-sm"}>Title</TableHead>
                                <TableHead className={"text-base font-semibold py-5 bg-muted"}>Last Updated</TableHead>
                                <TableHead className={"text-base font-semibold py-5 bg-muted"}>Published At</TableHead>
                                <TableHead  className={"text-base font-semibold py-5 bg-muted"}>Status</TableHead>
                                <TableHead  className={"text-base font-semibold bg-muted"}></TableHead>
                                <TableHead  className={"text-base font-semibold bg-muted"}></TableHead>
                                <TableHead  className={"text-base font-semibold bg-muted rounded-tr-sm"}></TableHead>
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
                                                <Select>
                                                    <SelectTrigger className="w-[106px] h-7">
                                                        <SelectValue placeholder="Publish" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {
                                                                (status || []).map((x, i) => {
                                                                    return (
                                                                        <Fragment key={i}>
                                                                            <SelectItem value={x.value}>
                                                                                <div className={"flex items-center gap-2"}>
                                                                                    <Circle fill={x.fillColor} stroke={x.strokeColor} className={` w-[10px] h-[10px]`}/>
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
                                            </TableCell>
                                            <TableCell>
                                                <Button onClick={openSheet} variant={"ghost"}><Eye size={18} /></Button>
                                            </TableCell>
                                            <TableCell>
                                                <Button variant={"ghost"} ><BarChart size={18} /></Button>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger><Button variant={"ghost"} ><Ellipsis size={18} /></Button></DropdownMenuTrigger>
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
                    <div className={"w-full p-5 bg-muted rounded-b-sm rounded-t-none flex justify-end pe-16 py-15px"}>
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