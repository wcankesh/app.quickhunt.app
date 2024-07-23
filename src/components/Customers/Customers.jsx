import React, {useState,useEffect} from 'react';
import {Button} from "../ui/button";
import {ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Plus, Trash2} from "lucide-react";
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
import {toast} from "../ui/use-toast";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "../ui/alert-dialog";
// import {create} from "domain";

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
    {label:"Action"},
];

const perPageLimit = 10;

const Customers = () => {
    const [isSheetOpen, setSheetOpen] = useState(false);
    const {theme} =useTheme();
    const apiService = new ApiService();
    const [customerList, setCustomerList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const [pageNo, setPageNo] = useState(1);
    const [totalRecord, setTotalRecord] = useState(0);
    const [deleteId,setDeleteId]=useState(null);
    const [deleteIndex,setDeleteIndex]=useState(null);

    useEffect(() => {
        getAllCustomers();
    }, [projectDetailsReducer.id])

    const openSheet = () => setSheetOpen(true);
    const closeSheet = (createRecord) => {
        if(createRecord?.id){
            const clone = [...customerList];
            clone.push(createRecord);
            setCustomerList(clone);
        }
        setSheetOpen(false);
    };

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

    const deleteCustomer =  (id,index) => {
        setDeleteId(id);
        setDeleteIndex(index);
    }

    const handleDelete = async () =>{
        const data = await apiService.deleteCustomers(deleteId);
        if(data.status === 200) {
            const clone = [...customerList];
            clone.splice(deleteIndex,1);
            setCustomerList(clone);
            toast({
                description: "Customer deleted successfully"
            })
        }
        else{
            toast({
                description:"Something went wrong",
                variant: "destructive",
            })
        };
        setDeleteId(null);
        setDeleteIndex(null);
    }

    return (
        <div className={"pt-8  xl:container xl:max-w-[1622px] lg:container lg:max-w-[796px] md:container md:max-w-[530px] sm:container sm:max-w-[639px] max-[639px]:container max-[639px]:max-w-[639px] xs:container xs:max-w-[475px] "}>
            <NewCustomerSheet isOpen={isSheetOpen} onOpen={openSheet} callback={getAllCustomers} onClose={closeSheet}/>
            <AlertDialog open={deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>You really want delete customer ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action can't be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteId(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className={"bg-red-600 hover:bg-red-600"}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
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
                        isLoading ? <SkeletonTable tableHeadings={tableHeadingsArray} arrayLength={3} numberOfCells={11}/> : customerList.length === 0 ? <EmptyDataTable tableHeadings={tableHeadingsArray}/>:
                            <Card>
                                <CardContent className={"p-0 rounded-md"}>
                                    <Table>
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
                                                (customerList || []).map((x,index)=>{
                                                    return(
                                                        <TableRow key={x.id} className={"font-medium"}>
                                                            <TableCell className={`py-3 ${theme === "dark" ? "" : "text-muted-foreground"}`}>{x.customer_name ? x.customer_name : "-"}</TableCell>
                                                            <TableCell className={`py-3 ${theme === "dark" ? "" : "text-muted-foreground"}`}>{x.customer_email_id ? x.customer_email_id : "-"}</TableCell>
                                                            <TableCell className={`py-3 flex flex-row gap-2 ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                                <img className={"rounded-full mr-2"} src={x?.avatar} alt={"not_found"}/>
                                                                <p>{x.company ? x.company : "-"}</p>
                                                            </TableCell>
                                                            <TableCell className={`py-3 ${theme === "dark" ? "" : "text-muted-foreground"}`}>{x.added_via ? x.added_via : "-"}</TableCell>
                                                            <TableCell className={`py-3 ${theme === "dark" ? "" : "text-muted-foreground"}`}>{x.segment ? x.segment : "-"}</TableCell>
                                                            <TableCell className={`py-3 ${theme === "dark" ? "" : "text-muted-foreground"}`}>{x.designation ? x.designation : "-"}</TableCell>
                                                            <TableCell className={`py-3 ${theme === "dark" ? "" : "text-muted-foreground"}`}>{x.tags ? x.tags : "-"}</TableCell>
                                                            <TableCell className={`py-3 ${theme === "dark" ? "" : "text-muted-foreground"}`}>{x.country ? x.country : "-"}</TableCell>
                                                            <TableCell className={`py-3 ${theme === "dark" ? "" : "text-muted-foreground"}`}>{x.browser ? x.browser : "-"}</TableCell>
                                                            <TableCell className={`py-3 ${theme === "dark" ? "" : "text-muted-foreground"}`}>{x.os ? x.os : "-"}</TableCell>
                                                            <TableCell className={`py-3 ${theme === "dark" ? "" : "text-muted-foreground flex justify-center"}`}>
                                                                <Button onClick={() => deleteCustomer(x.id,index)} variant={"outline hover:bg-transparent"} className={`p-1 border w-[30px] h-[30px]`}>
                                                                    <Trash2 size={16}/>
                                                                </Button>
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