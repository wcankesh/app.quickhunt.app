import React, {useState,useEffect} from 'react';
import {Button} from "../ui/button";
import {ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Plus} from "lucide-react";
import {Card, CardContent, CardFooter} from "../ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../ui/table";
import NoDataThumbnail from "../../img/Frame.png"
import NewCustomerSheet from "./NewCustomerSheet";
import {useTheme} from "../theme-provider";
import {Separator} from "../ui/separator";
import {ApiService} from "../../utils/ApiService";
import {useSelector} from "react-redux";
import EmptyDataTable from "../Comman/EmptyDataTable";
import SkeletonTable from "../Comman/SkeletonTable";

const tableHeadingsArray = [
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
    const perPageLimit = 10;

const Customers = () => {
    const [isSheetOpen, setSheetOpen] = useState(false);
    const openSheet = () => setSheetOpen(true);
    const closeSheet = () => setSheetOpen(false);
    const {theme} =useTheme();
    const apiService = new ApiService();
    const [customerList, setCustomerList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const [pageNo, setPageNo] = useState(1);
    const [totalRecord, setTotalRecord] = useState(0);

    console.log(projectDetailsReducer);

    useEffect(() => {
        getAllCustomers();
    }, [projectDetailsReducer.id])

    const getAllCustomers = async () => {
        setIsLoading(true)
        const payload = {
            project_id: projectDetailsReducer.id,
            page: pageNo,
            limit: perPageLimit
        }
        const data = await apiService.getAllCustomers(payload);
        if (data.status === 200) {
            setCustomerList(data.data);
            setTotalRecord(data?.total);
            setIsLoading(false);
        } else {
            setIsLoading(false)
        }
    }

    const totalPages = Math.ceil(totalRecord / perPageLimit);

    const handlePaginationClick = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPageNo(newPage);
        }
    };


    return (
        <div className={"pt-8  xl:container xl:max-w-[1622px] lg:container lg:max-w-[796px] md:container md:max-w-[530px] sm:container sm:max-w-[639px] max-[639px]:container max-[639px]:max-w-[639px] xs:container xs:max-w-[475px] "}>
            <NewCustomerSheet isOpen={isSheetOpen} onOpen={openSheet} callback={getAllCustomers} onClose={closeSheet}/>
            <div className={""}>
                <div className={"flex flex-row justify-between items-center"}>
                    <div>
                        <h4 className={"font-medium text-2xl leading-8"}>Customers</h4>
                        <h5 className={"text-muted-foreground text-base leading-5"}>Last updates</h5>
                    </div>
                    <Button onClick={openSheet} className={"hover:bg-violet-600"}> <Plus className={"mr-4"} />New Customer</Button>
                </div>
                <div className={"pt-8"}>
                    {
                        isLoading ? <SkeletonTable tableHeadings={tableHeadingsArray} arrayLength={3} numberOfCells={10}/> : customerList.length === 0 ? <EmptyDataTable tableHeadings={tableHeadingsArray}/>:
                            <Card>
                                <CardContent className={"p-0 rounded-md"}>
                                    <Table className={""}>
                                        <TableHeader className={"py-8 px-5"}>
                                            <TableRow className={""}>
                                                {
                                                    (tableHeadingsArray || []).map((x,i)=>{
                                                        return(
                                                            <TableHead className={`text-base font-semibold py-5 ${theme === "dark"? "text-[]" : "bg-muted"} ${i == 0 ? "rounded-tl-lg" : i == 9 ? "rounded-tr-lg" : ""}`} key={x.label}>{x.label}</TableHead>
                                                        )
                                                    })
                                                }
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody className={""}>
                                            {
                                                (customerList || []).map((x)=>{
                                                    return(
                                                        <TableRow key={x.id} className={"font-medium"}>
                                                            <TableCell className={`py-3 ${theme === "dark" ? "" : "text-muted-foreground"}`}>{x.customer_name ? x.customer_name : "-"}</TableCell>
                                                            <TableCell className={`py-3 ${theme === "dark" ? "" : "text-muted-foreground"}`}>{x.customer_email_id ? x.customer_email_id : "-"}</TableCell>
                                                            <TableCell className={`py-3 flex flex-row gap-2 ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                                <img className={"rounded-full mr-2"} src={x.avatar} alt={"not_found"}/>
                                                                <p>{x.company ? x.company : "-"}</p>
                                                            </TableCell>
                                                            <TableCell className={`py-3 ${theme === "dark" ? "" : "text-muted-foreground"}`}>{x.added_via ? x.added_via : "-"}</TableCell>
                                                            <TableCell className={`py-3 ${theme === "dark" ? "" : "text-muted-foreground"}`}>{x.segment ? x.segment : "-"}</TableCell>
                                                            <TableCell className={`py-3 ${theme === "dark" ? "" : "text-muted-foreground"}`}>{x.designation ? x.designation : "-"}</TableCell>
                                                            <TableCell className={`py-3 ${theme === "dark" ? "" : "text-muted-foreground"}`}>{x.tags ? x.tags : "-"}</TableCell>
                                                            <TableCell className={`py-3 ${theme === "dark" ? "" : "text-muted-foreground"}`}>{x.country ? x.country : "-"}</TableCell>
                                                            <TableCell className={`py-3 ${theme === "dark" ? "" : "text-muted-foreground"}`}>{x.browser ? x.browser : "-"}</TableCell>
                                                            <TableCell className={`py-3 ${theme === "dark" ? "" : "text-muted-foreground"}`}>{x.os ? x.os : "-"}</TableCell>
                                                        </TableRow>
                                                    )
                                                })
                                            }

                                        </TableBody>
                                    </Table>
                                </CardContent>
                                <Separator/>
                                <CardFooter className={"p-0"}>
                                        <div className={`w-full p-5 rounded-b-sm rounded-t-none flex justify-end pe-16 py-15px ${theme === "dark"? "" : "bg-muted"}`}>
                                            <div className={"flex flex-row gap-8 items-center"}>
                                                <div>
                                                    <h5 className={"text-sm font-semibold"}>Page {pageNo} of 10</h5>
                                                </div>
                                                <div className={"flex flex-row gap-2 items-center"}>
                                                    <Button variant={"outline"} className={"h-[30px] w-[30px] p-1.5"} onClick={() => handlePaginationClick(1)} disabled={pageNo === 1}>
                                                        <ChevronsLeft className={pageNo === 1 ? "stroke-muted-foreground" : "stroke-primary"}/>
                                                    </Button>
                                                    <Button variant={"outline"} className={"h-[30px] w-[30px] p-1.5"} onClick={() => handlePaginationClick(pageNo - 1)} disabled={pageNo === 1}>
                                                        <ChevronLeft className={pageNo === 1 ? "stroke-muted-foreground" : "stroke-primary"}/>
                                                    </Button>
                                                    <Button variant={"outline"} className={" h-[30px] w-[30px] p-1.5"} onClick={() => handlePaginationClick(pageNo + 1)} disabled={pageNo === totalPages}>
                                                        <ChevronRight className={pageNo === totalPages ? "stroke-muted-foreground" : "stroke-primary"}/>
                                                    </Button>
                                                    <Button variant={"outline"} className={"h-[30px] w-[30px] p-1.5"} onClick={() => handlePaginationClick(totalPages)} disabled={pageNo === totalPages}>
                                                        <ChevronsRight className={pageNo === totalPages ? "stroke-muted-foreground" : "stroke-primary"}/>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardFooter>
                            </Card>
                    }

                </div>
            </div>
        </div>
    );
}

export default Customers;