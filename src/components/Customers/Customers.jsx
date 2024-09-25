import React, {useState, useEffect, Fragment} from 'react';
import {Button} from "../ui/button";
import {ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2, Plus, Trash2, X} from "lucide-react";
import {Card, CardContent, CardFooter} from "../ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../ui/table";
import {useTheme} from "../theme-provider";
import {ApiService} from "../../utils/ApiService";
import {useSelector} from "react-redux";
import {toast} from "../ui/use-toast";
import {Skeleton} from "../ui/skeleton";
import EmptyData from "../Comman/EmptyData";
import {Dialog} from "@radix-ui/react-dialog";
import {DialogContent, DialogDescription, DialogHeader, DialogTitle} from "../ui/dialog";
import {Sheet, SheetContent, SheetHeader, SheetOverlay} from "../ui/sheet";
import {Label} from "../ui/label";
import {Input} from "../ui/input";
import {Switch} from "../ui/switch";

const tableHeadingsArray = [
    {label:"Name"},
    {label:"Email"},
    {label:"Country"},
    {label:"Browser"},
    {label:"Os"},
    {label:"Action"},
];

const perPageLimit = 10;

const initialState = {
    project_id: '',
    customer_name: '',
    customer_email_id: '',
    customer_email_notification: false,
    customer_first_seen: '',
    customer_last_seen: '',
    user_browser: '',
    user_ip_address : '',
}
const initialStateError = {
    customer_name: "",
    customer_email_id: "",
}

const Customers = () => {
    const [isSheetOpen, setSheetOpen] = useState(false);
    const [customerList, setCustomerList] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingDelete,setIsLoadingDelete] = useState(false);
    const [pageNo, setPageNo] = useState(1);
    const [totalRecord, setTotalRecord] = useState(0);
    const [deleteId,setDeleteId]=useState(null);
    const [openDelete,setOpenDelete]=useState(false);
    const [isSave,setIsSave]=useState(false);

    const [formError, setFormError] = useState(initialStateError);
    const [customerDetails, setCustomerDetails] = useState(initialState);
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const {theme} =useTheme();
    const apiService = new ApiService();

    useEffect(() => {
        if(projectDetailsReducer.id){
            getAllCustomers();
        }
    }, [projectDetailsReducer.id,pageNo])

    const onChangeText = (event) => {
        setCustomerDetails({...customerDetails, [event.target.name]: event.target.value});
        setFormError(formError => ({...formError, [event.target.name]: ""}));
    }

    const onBlur = (event,) => {
        const { name, value } = event.target;
        setFormError({
            ...formError,
            [name]: formValidate(name, value)
        });
    }

    const formValidate = (name, value) => {
        switch (name) {
            case "customer_name":
                if (!value || value.trim() === "") {
                    return "Customer name is required.";
                } else {
                    return "";
                }
            case "customer_email_id":
                if (!value || value.trim() === "") {
                    return "Customer e-mail is required.";
                } else if (!value.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
                    return "Enter a valid email address.";
                }
                else {
                    return "";
                }
            default: {
                return "";
            }
        }
    };

    const openSheet = () => setSheetOpen(true);

    const closeSheet = () => {
        setSheetOpen(false);
        setCustomerDetails(initialState);
        setFormError(initialStateError);
    };

    const getAllCustomers = async () => {
        setIsLoading(true);
        const payload = {
            project_id: projectDetailsReducer.id,
            page: pageNo,
            limit: perPageLimit
        }
        const data = await apiService.getAllCustomers(payload);
        if (data.status === 200) {
            setCustomerList(data.data);
            setTotalRecord(data?.total);
            // setIsLoading(false);
        }
        setIsLoading(false)
    };

    const deleteCustomer =  (id) => {
        setDeleteId(id);
        setOpenDelete(true);
    };

    const handleDelete = async () =>{
        setIsLoadingDelete(true);
        const data = await apiService.deleteCustomers(deleteId);
        const clone = [...customerList];
        const indexToDelete = clone.findIndex((x)=> x.id == deleteId);
        if(data.status === 200) {
            clone.splice(indexToDelete,1);
            setCustomerList(clone);
            toast({
                description: data.message
            });
            setIsLoadingDelete(false);
        }
        else{
            toast({
                description:data.message,
                variant: "destructive",
            });
            setIsLoadingDelete(false);
        };
        setOpenDelete(false);
        setDeleteId(null);
    };

    const addCustomer = async () => {
        let validationErrors = {};
        Object.keys(customerDetails).forEach(name => {
            const error = formValidate(name, customerDetails[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
            return;
        }
        const clone = [...customerList];
        setIsSave(true);
        const payload = {
            ...customerDetails,
            project_id: projectDetailsReducer.id,
            customer_first_seen: new Date(),
            customer_last_seen: new Date(),
        }
        const data = await apiService.createCustomers(payload)
        if(data.status === 200) {
            setIsSave(false);
            setCustomerDetails(initialState);
            toast({
                description: data.message,
            });
            clone.push(data.data);
            setCustomerList(clone);
        } else {
            setIsSave(false);
            toast({
                description:"Something went wrong",
                variant: "destructive",
            })
        }
        closeSheet();
    };

    const totalPages = Math.ceil(totalRecord / perPageLimit);

    const handlePaginationClick = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setIsLoading(true);
            setPageNo(newPage);
            setIsLoading(false);
        }
    };


    return (
        <Fragment>

            {isSheetOpen && <Sheet open={isSheetOpen} onOpenChange={isSheetOpen ? closeSheet : openSheet}>
                <SheetOverlay className={"inset-0"}/>
                <SheetContent className={"sm:max-w-[662px] p-0"}>
                    <SheetHeader className={"px-3 py-4 lg:px-8 lg:py-[20px] flex flex-row justify-between items-center border-b"}>
                        <h5 className={"text-sm md:text-xl font-medium"}>Add New Customer</h5>
                        <X onClick={closeSheet} size={18} className={"cursor-pointer m-0"}/>
                    </SheetHeader>
                    <div className={"sm:px-8 sm:py-6 px-3 py-4 border-b"}>
                        <div className="grid w-full gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input value={customerDetails.customer_name} name="customer_name" onChange={onChangeText} type="text" id="name" className={"h-9"} placeholder={"Enter the full name of customer..."}/>
                            {formError.customer_name && <span className="text-sm text-red-500">{formError.customer_name}</span>}
                        </div>

                        <div className="grid w-full gap-2 mt-6">
                            <Label htmlFor="email">E-mail</Label>
                            <Input value={customerDetails.customer_email_id} name="customer_email_id" onChange={onChangeText} onBlur={onBlur} type="email" id="email" className={"h-9"} placeholder={"Enter the email of customer"}/>
                            {formError.customer_email_id && <span className="text-sm text-red-500">{formError.customer_email_id}</span>}
                        </div>

                        <div className={"announce-create-switch mt-6 flex items-center"}>
                            <Switch className={"w-[38px] h-[20px]"} id={"switch"} checked={customerDetails.customer_email_notification == 1} onCheckedChange={(checked) => onChangeText({target: {name: "customer_email_notification", value:checked}})} htmlFor={"switch"} />
                            <Label htmlFor={"switch"} className={"ml-[9px] text-sm font-medium"}>Receive Notifications</Label>
                        </div>
                    </div>
                    <div className={"px-3 py-4 sm:p-8"}>
                        <Button onClick={addCustomer} className={` border w-[127px] font-semibold hover:bg-primary`}>{isSave ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Customer"}</Button>
                    </div>
                </SheetContent>
            </Sheet>}

            <div className={"container xl:max-w-[1200px] lg:max-w-[992px] md:max-w-[768px] sm:max-w-[639px] pt-8 pb-5 px-3 md:px-4"}>
                {/*<NewCustomerSheet isOpen={isSheetOpen} onOpen={openSheet} callback={getAllCustomers} onClose={closeSheet}/>*/}

                {
                    openDelete &&
                    <Fragment>
                        <Dialog open onOpenChange={()=> setOpenDelete(false)}>
                            <DialogContent className="w-[310px] md:w-full rounded-lg">
                                <DialogHeader className={"flex flex-row justify-between gap-2"}>
                                    <div className={"flex flex-col gap-2"}>
                                        <DialogTitle className={"text-start"}>You really want delete this customer ?</DialogTitle>
                                        <DialogDescription className={"text-start"}>This action can't be undone.</DialogDescription>
                                    </div>
                                    <X size={16} className={"m-0 cursor-pointer"} onClick={() => setOpenDelete(false)}/>
                                </DialogHeader>
                                <div className={"flex justify-end gap-2"}>
                                    <Button variant={"outline hover:none"}
                                            className={"text-sm font-semibold border"}
                                            onClick={() => setOpenDelete(false)}>Cancel</Button>
                                    <Button
                                        variant={"hover:bg-destructive"}
                                        className={`${theme === "dark" ? "text-card-foreground" : "text-card"} ${isLoadingDelete === true ? "py-2 px-6" : "py-2 px-6"} w-[76px] text-sm font-semibold bg-destructive`}
                                        onClick={handleDelete}
                                    >
                                        {isLoadingDelete ? <Loader2 size={16} className={"animate-spin"}/> : "Delete"}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </Fragment>
                }

                <div className={""}>
                    <div className={"flex flex-row gap-x-4 flex-wrap justify-between gap-y-2 items-center"}>
                        <div>
                            <h4 className={"font-medium text-lg sm:text-2xl"}>Customers ({totalRecord})</h4>
                            <h5 className={"text-muted-foreground text-base"}>Last updates</h5>
                        </div>
                        <Button size="sm" onClick={openSheet} className={"gap-2 font-semibold hover:bg-primary"}> <Plus size={20} strokeWidth={3} />New Customer</Button>
                    </div>
                    <div className={"mt-4 sm:mt-6"}>
                                <Card className={""}>
                                    <CardContent className={"p-0"}>
                                        <div className={"rounded-md grid grid-cols-1 overflow-auto whitespace-nowrap"}>
                                            <Table>
                                                <TableHeader className={"py-8 px-5"}>
                                                    <TableRow className={""}>
                                                        {
                                                            (tableHeadingsArray || []).map((x,i)=>{
                                                                return(
                                                                    <TableHead className={`font-semibold px-2 py-[10px] md:px-3 ${i >= 2 ? "text-center" : ""}  ${theme === "dark"? "text-[]" : "bg-muted"} `} key={x.label}>{x.label}</TableHead>
                                                                )
                                                            })
                                                        }
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                {
                                                    isLoading ? (
                                                                [...Array(10)].map((_, index) => {
                                                                    return (
                                                                        <TableRow key={index}>
                                                                            {
                                                                                [...Array(6)].map((_, i) => {
                                                                                    return (
                                                                                        <TableCell key={i} className={"px-2 py-[9px] md:px-3"}>
                                                                                            <Skeleton className={"rounded-md  w-full h-8"}/>
                                                                                        </TableCell>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </TableRow>
                                                                    )
                                                                })
                                                        )
                                                         : customerList.length > 0 ? <>
                                                            {
                                                                (customerList || []).map((x,index)=>{
                                                                    return(
                                                                        <TableRow key={x.id} className={"font-medium"}>
                                                                            <TableCell className={`px-2 py-[10px] md:px-3 ${theme === "dark" ? "" : "text-muted-foreground"}`}>{x.customer_name ? x.customer_name : "-"}</TableCell>
                                                                            <TableCell className={`px-2 py-[10px] md:px-3 ${theme === "dark" ? "" : "text-muted-foreground"}`}>{x?.customer_email_id}</TableCell>
                                                                            <TableCell className={`px-2 py-[10px] md:px-3 ${theme === "dark" ? "" : "text-muted-foreground"} text-center`}>{x.customer_country ? x.customer_country : "-"}</TableCell>
                                                                            <TableCell className={`px-2 py-[10px] md:px-3 ${theme === "dark" ? "" : "text-muted-foreground"} text-center`}>{x.customer_browser ? x.customer_browser : "-"}</TableCell>
                                                                            <TableCell className={`px-2 py-[10px] md:px-3 ${theme === "dark" ? "" : "text-muted-foreground"} text-center`}>{x.os ? x.os : "-"}</TableCell>
                                                                            <TableCell className={`px-2 py-[10px] md:px-3 ${theme === "dark" ? "" : "text-muted-foreground flex justify-center"}`}>
                                                                                <Button onClick={() => deleteCustomer(x.id,index)} variant={"outline hover:bg-transparent"} className={`p-1 border w-[30px] h-[30px]`}>
                                                                                    <Trash2 size={16}/>
                                                                                </Button>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    )
                                                                })
                                                            }
                                                            </> : <TableRow>
                                                            <TableCell colSpan={6}>
                                                                <EmptyData/>
                                                            </TableCell>
                                                        </TableRow>
                                                }
                                                </TableBody>
                                        </Table>

                                        </div>
                                    </CardContent>
                                    {
                                        customerList.length > 0 ?
                                            <CardFooter className={`p-0 ${theme === "dark" ? "border-t" : ""}`}>
                                                <div
                                                    className={`w-full ${theme === "dark" ? "" : "bg-muted"} rounded-b-lg rounded-t-none flex justify-end p-2 md:px-3 md:py-[10px]`}>
                                                    <div className={"w-full flex gap-2 items-center justify-between sm:justify-end"}>
                                                        <div>
                                                            <h5 className={"text-sm font-semibold"}>Page {customerList.length <= 0 ? 0 : pageNo} of {totalPages}</h5>
                                                        </div>
                                                        <div className={"flex flex-row gap-2 items-center"}>
                                                            <Button variant={"outline"} className={"h-[30px] w-[30px] p-1.5"}
                                                                    onClick={() => handlePaginationClick(1)}
                                                                    disabled={pageNo === 1 || isLoading}>
                                                                <ChevronsLeft
                                                                    className={pageNo === 1 || isLoading ? "stroke-muted-foreground" : "stroke-primary"} />
                                                            </Button>
                                                            <Button variant={"outline"} className={"h-[30px] w-[30px] p-1.5"}
                                                                    onClick={() => handlePaginationClick(pageNo - 1)}
                                                                    disabled={pageNo === 1 || isLoading}>
                                                                <ChevronLeft
                                                                    className={pageNo === 1 || isLoading ? "stroke-muted-foreground" : "stroke-primary"} />
                                                            </Button>
                                                            <Button variant={"outline"} className={" h-[30px] w-[30px] p-1.5"}
                                                                    onClick={() => handlePaginationClick(pageNo + 1)}
                                                                    disabled={pageNo === totalPages || isLoading || customerList.length <= 0}>
                                                                <ChevronRight
                                                                    className={pageNo === totalPages || isLoading || customerList.length <= 0 ? "stroke-muted-foreground" : "stroke-primary"} />
                                                            </Button>
                                                            <Button variant={"outline"} className={"h-[30px] w-[30px] p-1.5"}
                                                                    onClick={() => handlePaginationClick(totalPages)}
                                                                    disabled={pageNo === totalPages || isLoading || customerList.length <= 0}>
                                                                <ChevronsRight
                                                                    className={pageNo === totalPages || isLoading || customerList.length <= 0 ? "stroke-muted-foreground" : "stroke-primary"} />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardFooter> : ""
                                    }
                                </Card>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default Customers;