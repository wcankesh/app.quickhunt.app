import React, {useState} from 'react';
import {Button} from "../ui/button";
import {ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Plus} from "lucide-react";
import {Card, CardContent, CardFooter} from "../ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../ui/table";
import NoDataThumbnail from "../../img/Frame.png"
import NewCustomerSheet from "./NewCustomerSheet";

const tableHeadings = [
    {label:"Name"},
    {label:"Email"},
    {label:"Company"},
    {label:"Added Via"},
    {label:"Segments"},
    {label:"Designation"},
    {label:"Tags"},
    {label:"Country"},
    {label:"Browser"},
    {label:"Os"},
];

const dummyTable = {
        data: [{
            name: "Darshan Jiyani",
            email: "wc.darshan2003@gmail.com",
            company: "Testtingapp",
            added_via: "",
            segment: "",
            designation: "",
            tags: "",
            country: "",
            browser: "",
            os: "",
            avatar: "https://avatars.githubusercontent.com/u/124599?v=4&size=20",
            id: 1
        },
            {
                name: "Darshan Jiyani",
                email: "wc.darshan2003@gmail.com",
                company: "Testtingapp",
                added_via: "",
                segment: "",
                designation: "",
                tags: "",
                country: "",
                browser: "",
                os: "",
                avatar: "https://avatars.githubusercontent.com/u/124599?v=4&size=20",
                id: 2
            },
            {
                name: "Darshan Jiyani",
                email: "wc.darshan2003@gmail.com",
                company: "Testtingapp",
                added_via: "",
                segment: "",
                designation: "",
                tags: "",
                country: "",
                browser: "",
                os: "",
                avatar: "https://avatars.githubusercontent.com/u/124599?v=4&size=20",
                id: 3
            }],
        page:1,
        preview:0
    }

const Customers = () => {
    const [isSheetOpen, setSheetOpen] = useState(false);
    const openSheet = () => setSheetOpen(true);
    const closeSheet = () => setSheetOpen(false);

    return (
        <div className={"container-secondary pt-8"}>
            <NewCustomerSheet isOpen={isSheetOpen} onOpen={openSheet} onClose={closeSheet}/>
            <div className={"xl:container xl:max-w-[1200px] lg:container lg:max-w-[992px] md:container md:max-w-[768px] sm:container sm:max-w-[639px] xs:container xs:max-w-[475px]"}>
                <div className={"flex flex-row justify-between items-center"}>
                    <div>
                        <h4 className={"font-medium text-2xl leading-8"}>Customers</h4>
                        <h5 className={"text-muted-foreground text-base leading-5"}>Last updates</h5>
                    </div>
                    <Button onClick={openSheet} className={"hover:bg-violet-600"}> <Plus className={"mr-4"} />New Customer</Button>
                </div>
                <div className={"pt-8"}>
                    <Card>
                        <CardContent className={"p-0 rounded-md"}>
                            <Table className={""}>
                                <TableHeader className={"py-8 px-5"}>
                                    <TableRow className={""}>
                                        {
                                            (tableHeadings || []).map((x,i)=>{
                                                return(
                                                    <TableHead className={`text-base font-semibold py-5 bg-muted ${i == 0 ? "rounded-tl-lg" : i == 9 ? "rounded-tr-lg" : ""}`} key={x.label}>{x.label}</TableHead>
                                                )
                                            })
                                        }
                                    </TableRow>
                                </TableHeader>
                                 <TableBody className={"px-5"}>
                                        {
                                            (dummyTable.data || []).map((x)=>{
                                                return(
                                                    <TableRow className={"text-muted-foreground font-medium"}>
                                                        <TableCell className={"py-3"}>{x.name ? x.name : "-"}</TableCell>
                                                        <TableCell className={"py-3"}>{x.name ? x.name : "-"}</TableCell>
                                                        <TableCell className={"py-3 flex flex-row gap-2"}>
                                                            <img className={"rounded-full mr-2"} src={x.avatar} alt={"not_found"}/>
                                                            <p>{x.company}</p>
                                                        </TableCell>
                                                        <TableCell>{x.added_via ? x.added_via : "-"}</TableCell>
                                                        <TableCell>{x.segment ? x.segment : "-"}</TableCell>
                                                        <TableCell>{x.designation ? x.designation : "-"}</TableCell>
                                                        <TableCell>{x.tags ? x.tags : "-"}</TableCell>
                                                        <TableCell>{x.country ? x.country : "-"}</TableCell>
                                                        <TableCell>{x.browser ? x.browser : "-"}</TableCell>
                                                        <TableCell>{x.os ? x.os : "-"}</TableCell>
                                                    </TableRow>
                                                )
                                            })
                                        }

                                    </TableBody>
                            </Table>
                        </CardContent>
                        {dummyTable.data.length > 0 ? <CardFooter className={"p-0"}>
                            <div className={"w-full p-5 bg-muted rounded-b-lg rounded-t-none flex justify-end pe-16 py-15px"}>
                                <div className={"flex flex-row gap-8 items-center"}>
                                    <div>
                                        <h5 className={"text-sm font-semibold"}>Page {dummyTable.page} of 10</h5>
                                    </div>
                                    <div className={"flex flex-row gap-2 items-center"}>
                                        <Button variant={"outline"} className={"h-[30px] w-[30px] p-1.5 hover:none"}>
                                            <ChevronsLeft  className={`${dummyTable.preview === 0 ? "stroke-slate-300" : "stroke-primary"}`} />
                                        </Button>
                                        <Button variant={"outline"} className={" h-[30px] w-[30px] p-1.5 hover:none"}>
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
                        </CardFooter> :
                            <div className={"flex flex-row justify-center py-[45px]"}>
                                <div className={"flex flex-col items-center gap-2"}>
                                    <img src={NoDataThumbnail} className={"flex items-center"}/>
                                    <h5 className={"text-center text-2xl font-medium leading-8 text-[#A4BBDB]"}>No Data</h5>
                                </div>
                            </div>}
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default Customers;