import React, {useState, Fragment} from 'react';
import {Button} from "../ui/button";
import {Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow,} from "../ui/table";
import {
    BarChart,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight, Copy,
    Ellipsis,
    Eye,
    EyeOff,
    Loader2
} from "lucide-react";
import WidgetSideBarSheet from "./WidgetSideBarSheet";
import {useTheme} from "../theme-provider";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "../ui/dialog";
import {DropdownMenu, DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";
import {DropdownMenuContent, DropdownMenuItem} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import {Tabs, TabsContent, TabsList, TabsTrigger,} from "../ui/tabs";
import {Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter} from "../ui/card";
import {Icon} from "../../utils/Icon";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {baseUrl} from "../../utils/constent";
import WidgetSideBar from "./WidgetSideBar";

const invoices = [
    {
        id: 1,
        invoice: "My new widget",
        paymentStatus: "Ideas, Roadmap, announcement",
        totalAmount: "17 Jul, 2024",
        paymentMethod: "Credit Card",
    },
];

const perPageLimit = 10;

const Widgets = () => {
    let navigate = useNavigate();
    let location = useLocation();
    const {id} = useParams();
    const {theme} = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    const [isSheetOpen, setSheetOpen] = useState(false);
    const [sideBar, setSheetOpenSideBar] = useState(false);
    const [pageNo, setPageNo] = useState(1);
    const [totalRecord, setTotalRecord] = useState(0);
    const [openDelete, setOpenDelete] = useState(false);
    const [openCopyCode, setOpenCopyCode] = useState(false);
    const [deleteRecord, setDeleteRecord] = useState(null);

    const openSheet = () => setSheetOpen(true);
    const closeSheet = () => setSheetOpen(false);

    const openSheetSideBar = () => setSheetOpenSideBar(true);
    const closeSheetSideBar = () => setSheetOpenSideBar(false);

    const handleCreateNew = (id) => {
        navigate(`${baseUrl}/widgets/${id}`);
        setSheetOpenSideBar(true)
    };

    const onDeleteIdea = async (id) => {
        // if (id) {
        //     setIsLoading(true)
        //     const data = await apiSerVice.onDeleteIdea(id);
        //     if (data.status === 200) {
        //         const filteredIdeas = ideasList.filter((idea) => idea.id !== id);
        //         setIdeasList(filteredIdeas);
        //         setOpenDelete(false)
        //         setIsLoading(false)
        //         setDeleteRecord(null)
        //         toast({description: "Idea deleted successfully"});
        //     } else {
        //         toast({variant: "destructive", description: "Failed to delete idea"});
        //     }
        // }
    };

    const deleteIdea = () => {
        setOpenDelete(!openDelete)
    }

    const getCodeCopy = () => {
        setOpenCopyCode(!openCopyCode)
    }

    const totalPages = Math.ceil(totalRecord / perPageLimit);

    const handlePaginationClick = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPageNo(newPage);
        }
    };

    return (
        <Fragment>
            {
                openDelete &&
                <Fragment>
                    <Dialog open onOpenChange={deleteIdea}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader className={"flex flex-col gap-2"}>
                                <DialogTitle>Delete widget?</DialogTitle>
                                <DialogDescription>Are you sure? This cannot be undone.</DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant={"outline hover:none"}
                                        className={"text-sm font-semibold border"}
                                        onClick={() => setOpenDelete(false)}>Cancel</Button>
                                <Button
                                    variant={"hover:bg-destructive"}
                                    className={`${theme === "dark" ? "text-card-foreground" : "text-card"} ${isLoading === true ? "py-2 px-6" : "py-2 px-6"} w-[76px] text-sm font-semibold bg-destructive`}
                                    onClick={() => onDeleteIdea(deleteRecord)}
                                >
                                    {isLoading ? <Loader2 size={16} className={"animate-spin"}/> : "Delete"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </Fragment>
            }
            {
                openCopyCode &&
                <Fragment>
                    <Dialog open onOpenChange={getCodeCopy}>
                        <DialogContent className="sm:max-w-[580px]">
                            <DialogHeader className={"flex flex-col gap-2"}>
                                <DialogTitle>Embed Widget</DialogTitle>
                                <DialogDescription>Choose how you would like to embed your widget.</DialogDescription>
                            </DialogHeader>
                            <Tabs defaultValue="script">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="script">Script</TabsTrigger>
                                    <TabsTrigger value="embedlink">Embed Link</TabsTrigger>
                                    <TabsTrigger value="iframe">iFrame</TabsTrigger>
                                </TabsList>
                                <TabsContent value="script" className={"flex flex-col gap-2"}>
                                    <Card>
                                        <CardHeader>
                                            <CardDescription>
                                                Place the code below before the closing body tag on your site.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex flex-col gap-2">
                                            <div>
                                                <div className={"relative"}>
                                                    <Input
                                                        id="text"
                                                        type={"text"}
                                                        placeholder={"Copy"}
                                                        name={'copy'}
                                                        className={"border-slate-300 placeholder:text-slate-400"}
                                                    />
                                                    <Button variant={"ghost hover:none"}
                                                            className={"absolute top-0 right-0"}>
                                                        <Copy size={16}/>
                                                    </Button>
                                                </div>
                                                <p className={"text-xs"}>Read the {" "}
                                                    <Button
                                                        variant={"ghost hover:none"}
                                                        className={"p-0 text-xs text-primary font-semibold"}
                                                    >
                                                        Setup Guide
                                                    </Button>
                                                    {" "}for more information or {" "}
                                                    <Button
                                                        variant={"ghost hover:none"}
                                                        className={"p-0 text-xs text-primary font-semibold"}
                                                    >
                                                        download the HTML example.
                                                    </Button>
                                                </p>
                                            </div>
                                            <div className={"flex flex-col gap-2"}>
                                                <h3 className={"text-sm font-semibold"}>Code Examples</h3>
                                                <div className={"flex justify-between"}>
                                                    <Button variant={"ghost"}
                                                            className={"flex gap-2"}>{Icon.htmlIcon} Html</Button>
                                                    <Button variant={"ghost"}
                                                            className={"flex gap-2"}>{Icon.vueIcon}Vue</Button>
                                                    <Button variant={"ghost"}
                                                            className={"flex gap-2"}>{Icon.reactIcon}React</Button>
                                                    <Button variant={"ghost"}
                                                            className={"flex gap-2"}>{Icon.angularIcon} Angular</Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="embedlink">
                                    <Card>
                                        <CardHeader className={"pb-0"}>
                                            <CardDescription>
                                                Follow these simple steps to embed the widget on any {" "}
                                                <Button
                                                    variant={"ghost hover:none"}
                                                    className={"p-0 text-xs text-primary font-semibold"}
                                                >
                                                    supported website.
                                                </Button>
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex flex-col gap-2">
                                            <div>
                                                <p className={"text-xs text-muted-foreground"}>1. Copy the link
                                                    below</p>
                                                <p className={"text-xs text-muted-foreground"}>2. Paste the link on any
                                                    site where you want the widget to show.</p>
                                                <p className={"text-xs text-muted-foreground"}>3. That's it!</p>
                                            </div>
                                            <div>
                                                <Input id="current" type=""/>
                                            </div>
                                            <p className={"text-xs"}>Read the {" "}
                                                <Button
                                                    variant={"ghost hover:none"}
                                                    className={"p-0 text-xs text-primary font-semibold"}
                                                >
                                                    Setup Guide
                                                </Button>
                                                {" "}for more information.
                                            </p>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="iframe">
                                    <Card>
                                        <CardHeader>
                                            <CardDescription>
                                                Paste the code below on your site where you want the widget to appear.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            <div className={"relative"}>
                                                <Input
                                                    id="text"
                                                    type={"text"}
                                                    placeholder={"Copy"}
                                                    name={'copy'}
                                                    className={"border-slate-300 placeholder:text-slate-400"}
                                                />
                                                <Button variant={"ghost hover:none"}
                                                        className={"absolute top-0 right-0"}>
                                                    <Copy size={16}/>
                                                </Button>
                                            </div>
                                            <p className={"text-xs text-muted-foreground"}>Read the {" "}
                                                <Button
                                                    variant={"ghost hover:none"}
                                                    className={"p-0 text-xs text-primary font-semibold"}
                                                >
                                                    Setup Guide
                                                </Button>
                                                for more information.
                                            </p>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                            <DialogFooter>
                                <Button variant={"outline hover:none"}
                                        className={"text-sm font-semibold border"}
                                        onClick={() => setOpenDelete(false)}>Cancel</Button>
                                <Button
                                    variant={"hover:none"}
                                    className={`${theme === "dark" ? "text-card-foreground" : "text-card"} ${isLoading === true ? "py-2 px-6" : "py-2 px-6"} w-[106px] text-sm font-semibold bg-primary`}

                                >
                                    {isLoading ? <Loader2 size={16} className={"animate-spin"}/> : "Copy code"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </Fragment>
            }
            <div
                className={"xl:container xl:max-w-[1200px] lg:container lg:max-w-[992px] md:container md:max-w-[768px] sm:container sm:max-w-[639px] xs:container xs:max-w-[475px] pt-8 pb-5"}>
                <WidgetSideBar
                    isOpen={sideBar}
                    onOpen={openSheetSideBar}
                    onClose={closeSheetSideBar}
                />
                <WidgetSideBarSheet
                    isOpen={isSheetOpen}
                    onOpen={openSheet}
                    onClose={closeSheet}
                />
                <div className={"flex mb-10 flex-col space-y-10"}>
                    <div className={"flex flex-col gap-1"}>
                        <div className={"flex items-center justify-between"}>
                            <h1 className={"text-2xl font-medium"}>Widgets</h1>
                            <Button
                                className={"text-sm font-semibold hover:bg-primary px-3 h-auto"}
                                // onClick={() => navigate(`${baseUrl}/widgets/new`)}
                                onClick={() => handleCreateNew("new")}
                                // onClick={() => navigate(`${baseUrl}/widgets/${id}`)}
                            >
                                Create New
                            </Button>
                        </div>
                        <div className={"flex flex-col space-y-4"}>
                            <p className={"text-base text-muted-foreground"}>Embed Ideas, Roadmap & Announcements inside
                                your site.</p>
                        </div>
                    </div>
                    <div className={"flex flex-col"}>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Sections</TableHead>
                                    <TableHead>Last Updated</TableHead>
                                    <TableHead>Analytics</TableHead>
                                    <TableHead className={"text-right"}>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoices.map((invoice) => (
                                    <TableRow key={invoice.invoice.id}>
                                        <TableCell className="font-medium">{invoice.invoice}</TableCell>
                                        <TableCell>{invoice.paymentStatus}</TableCell>
                                        <TableCell>{invoice.totalAmount}</TableCell>
                                        <TableCell><BarChart onClick={() => openSheet(invoice.id)} size={13}
                                                             className={"cursor-pointer"}/></TableCell>
                                        <TableCell className={"flex gap-2 items-center justify-end"}>
                                            <Button
                                                className={"py-[6px] px-3 h-auto text-xs font-semibold hover:bg-primary"}
                                                onClick={() => getCodeCopy(invoice.id)}>Get code</Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger>
                                                    <Ellipsis size={16} className={"cursor-pointer"}/>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem
                                                        className={"cursor-pointer"}>Edit</DropdownMenuItem>
                                                    <DropdownMenuItem className={"cursor-pointer"}
                                                                      onClick={deleteIdea}>Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {/*<TableFooter>*/}
                        <div
                            className={`w-full p-5 ${theme === "dark" ? "" : "bg-muted"} rounded-b-lg rounded-t-none flex justify-end px-16 py-15px`}>
                            <div className={"flex flex-row gap-8 items-center"}>
                                <div>
                                    <h5 className={"text-sm font-semibold"}>Page {pageNo} of {totalPages}</h5>
                                </div>
                                <div className={"flex flex-row gap-2 items-center"}>
                                    <Button variant={"outline"} className={"h-[30px] w-[30px] p-1.5"}
                                            onClick={() => handlePaginationClick(1)} disabled={pageNo === 1}>
                                        <ChevronsLeft
                                            className={pageNo === 1 ? "stroke-muted-foreground" : "stroke-primary"}/>
                                    </Button>
                                    <Button variant={"outline"} className={"h-[30px] w-[30px] p-1.5"}
                                            onClick={() => handlePaginationClick(pageNo - 1)}
                                            disabled={pageNo === 1}>
                                        <ChevronLeft
                                            className={pageNo === 1 ? "stroke-muted-foreground" : "stroke-primary"}/>
                                    </Button>
                                    <Button variant={"outline"} className={" h-[30px] w-[30px] p-1.5"}
                                            onClick={() => handlePaginationClick(pageNo + 1)}
                                            disabled={pageNo === totalPages}>
                                        <ChevronRight
                                            className={pageNo === totalPages ? "stroke-muted-foreground" : "stroke-primary"}/>
                                    </Button>
                                    <Button variant={"outline"} className={"h-[30px] w-[30px] p-1.5"}
                                            onClick={() => handlePaginationClick(totalPages)}
                                            disabled={pageNo === totalPages}>
                                        <ChevronsRight
                                            className={pageNo === totalPages ? "stroke-muted-foreground" : "stroke-primary"}/>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        {/*</TableFooter>*/}
                        {/*</Table>*/}
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default Widgets;