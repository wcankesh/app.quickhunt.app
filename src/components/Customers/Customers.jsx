import React, {useState, useEffect, Fragment} from 'react';
import {Button} from "../ui/button";
import {ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2, Plus, Trash2, X} from "lucide-react";
import {Card, CardContent, CardFooter} from "../ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../ui/table";
import NewCustomerSheet from "./NewCustomerSheet";
import {useTheme} from "../theme-provider";
import {Separator} from "../ui/separator";
import {ApiService} from "../../utils/ApiService";
import {useSelector} from "react-redux";
import {toast} from "../ui/use-toast";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle
} from "../ui/alert-dialog";
import {Skeleton} from "../ui/skeleton";
import EmptyData from "../Comman/EmptyData";
import {Dialog} from "@radix-ui/react-dialog";
import {DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "../ui/dialog";

const tableHeadingsArray = [
    {label:"Name"},
    {label:"Email"},
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
    const [openDelete,setOpenDelete]=useState(false);

    useEffect(() => {
        if(projectDetailsReducer.id){
            getAllCustomers();
        }
    }, [projectDetailsReducer.id,pageNo])

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
        setOpenDelete(true);
    }

    const handleDelete = async () =>{
        setIsLoading(true);
        const data = await apiService.deleteCustomers(deleteId);
        if(data.status === 200) {
            const clone = [...customerList];
            clone.splice(deleteIndex,1);
            setCustomerList(clone);
            toast({
                description: "Customer deleted successfully"
            });
            setOpenDelete(false);
            setIsLoading(false);
        }
        else{
            toast({
                description:"Something went wrong",
                variant: "destructive",
            });
            setOpenDelete(false);
            setIsLoading(false);
        };
        setDeleteId(null);
        setDeleteIndex(null);
    }

    return (
        <div className={"pt-8 container xl:max-w-[1574px]  lg:max-w-[992px]  md:max-w-[768px] sm:max-w-[639px] px-4"}>
            <NewCustomerSheet isOpen={isSheetOpen} onOpen={openSheet} callback={getAllCustomers} onClose={closeSheet}/>
            {
                openDelete &&
                <Fragment>
                    <Dialog open onOpenChange={()=> setOpenDelete(false)}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader className={"flex flex-row justify-between gap-2"}>
                                <div className={"flex flex-col gap-2"}>
                                    <DialogTitle className={"text-start"}>You really want delete this customer ?</DialogTitle>
                                    <DialogDescription className={"text-start"}>This action can't be undone.</DialogDescription>
                                </div>
                                <X size={16} className={"m-0 cursor-pointer"} onClick={() => setOpenDelete(false)}/>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant={"outline hover:none"}
                                        className={"text-sm font-semibold border"}
                                        onClick={() => setOpenDelete(false)}>Cancel</Button>
                                <Button
                                    variant={"hover:bg-destructive"}
                                    className={`${theme === "dark" ? "text-card-foreground" : "text-card"} ${isLoading === true ? "py-2 px-6" : "py-2 px-6"} w-[76px] text-sm font-semibold bg-destructive`}
                                    onClick={handleDelete}
                                >
                                    {isLoading ? <Loader2 size={16} className={"animate-spin"}/> : "Delete"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </Fragment>
            }

            {/*<AlertDialog open={deleteId} onOpenChange={() => setDeleteId(null)}>*/}
            {/*    <AlertDialogContent className={"w-[310px] md:w-full rounded-lg"}>*/}
            {/*        <AlertDialogHeader>*/}
            {/*            <AlertDialogTitle>You really want delete customer ?</AlertDialogTitle>*/}
            {/*            <AlertDialogDescription>*/}
            {/*                This action can't be undone.*/}
            {/*            </AlertDialogDescription>*/}
            {/*        </AlertDialogHeader>*/}
            {/*        <div className={"flex justify-end gap-2"}>*/}
            {/*            <AlertDialogCancel onClick={() => setDeleteId(null)}>Cancel</AlertDialogCancel>*/}
            {/*            <AlertDialogAction onClick={handleDelete} className={"bg-red-600 hover:bg-red-600"}>Delete</AlertDialogAction>*/}
            {/*        </div>*/}
            {/*    </AlertDialogContent>*/}
            {/*</AlertDialog>*/}
            <div className={""}>
                <div className={"flex flex-row gap-x-4 flex-wrap justify-between gap-y-2 items-center"}>
                    <div>
                        <h4 className={"font-medium text-lg sm:text-2xl leading-8"}>Customers</h4>
                        <h5 className={"text-muted-foreground text-base leading-5"}>Last updates</h5>
                    </div>
                    <Button onClick={openSheet} className={"hover:bg-violet-600"}> <Plus className={"mr-4"} />New Customer</Button>
                </div>
                <div className={"pt-4 sm:pt-8"}>
                            <Card className={""}>
                                <CardContent className={"p-0 "}>
                                    <div className={"rounded-md grid grid-cols-1 overflow-auto whitespace-nowrap"}>
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
                                            {
                                                isLoading ? <TableBody>
                                                        {
                                                            [...Array(10)].map((_, index) => {
                                                                return (
                                                                    <TableRow key={index}>
                                                                        {
                                                                            [...Array(6)].map((_, i) => {
                                                                                return (
                                                                                    <TableCell key={i} className={"px-2"}>
                                                                                        <Skeleton className={"rounded-md  w-full h-[24px]"}/>
                                                                                    </TableCell>
                                                                                )
                                                                            })
                                                                        }
                                                                    </TableRow>
                                                                )
                                                            })
                                                        }
                                                    </TableBody> :
                                                    <TableBody className={""}>
                                                        {
                                                            (customerList || []).map((x,index)=>{
                                                                return(
                                                                    <TableRow key={x.id} className={"font-medium"}>
                                                                        <TableCell className={`py-3 ${theme === "dark" ? "" : "text-muted-foreground"}`}>{x.customer_name ? x.customer_name : "-"}</TableCell>
                                                                        <TableCell className={`py-3 ${theme === "dark" ? "" : "text-muted-foreground"}`}>{x.customer_email_id ? x.customer_email_id : "-"}</TableCell>
                                                                        <TableCell className={`py-3 ${theme === "dark" ? "" : "text-muted-foreground"}`}>{x.customer_country ? x.customer_country : "-"}</TableCell>
                                                                        <TableCell className={`py-3 ${theme === "dark" ? "" : "text-muted-foreground"}`}>{x.customer_browser ? x.customer_browser : "-"}</TableCell>
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
                                            }

                                    </Table>
                                        {isLoading ? null : (isLoading === false && customerList?.length > 0 ? "" : <EmptyData/>)}

                                    </div>
                                </CardContent>
                                <Separator/>
                                <CardFooter className={"p-0"}>
                                    <div
                                        className={`w-full p-5 ${theme === "dark" ? "" : "bg-muted"} rounded-b-lg rounded-t-none flex justify-end px-4 py-4 md:px-16 md:py-15px`}>
                                        <div className={"w-full flex gap-8 items-center justify-between sm:justify-end"}>
                                            <div>
                                                <h5 className={"text-xs md:text-sm font-semibold"}>Page {pageNo} of {totalPages}</h5>
                                            </div>
                                            <div className={"flex flex-row gap-2 items-center"}>
                                                <Button variant={"outline"}
                                                        className={"h-[30px] w-[30px] p-1.5"}
                                                        onClick={() => handlePaginationClick(1)} disabled={pageNo === 1}>
                                                    <ChevronsLeft className={pageNo === 1 ? "stroke-muted-foreground" : "stroke-primary"}/>
                                                </Button>
                                                <Button variant={"outline"}
                                                        className={"h-[30px] w-[30px] p-1.5"}
                                                        onClick={() => handlePaginationClick(pageNo - 1)}
                                                        disabled={pageNo === 1}>
                                                    <ChevronLeft className={pageNo === 1 ? "stroke-muted-foreground" : "stroke-primary"}/>
                                                </Button>
                                                <Button variant={"outline"}
                                                        className={" h-[30px] w-[30px] p-1.5"}
                                                        onClick={() => handlePaginationClick(pageNo + 1)}
                                                        disabled={pageNo === totalPages}>
                                                    <ChevronRight className={pageNo === totalPages ? "stroke-muted-foreground" : "stroke-primary"}/>
                                                </Button>
                                                <Button variant={"outline"}
                                                        className={"h-[30px] w-[30px] p-1.5"}
                                                        onClick={() => handlePaginationClick(totalPages)}
                                                        disabled={pageNo === totalPages}>
                                                    <ChevronsRight className={pageNo === totalPages ? "stroke-muted-foreground" : "stroke-primary"}/>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    </CardFooter>
                            </Card>
                </div>
            </div>
        </div>
    );
}

export default Customers;