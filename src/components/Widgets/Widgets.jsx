import React, {Fragment, useEffect, useState} from 'react';
import {Button} from "../ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "../ui/table";
import {BarChart, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Copy, Ellipsis, Loader2, X} from "lucide-react";
import {useTheme} from "../theme-provider";
import {useSelector} from "react-redux";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "../ui/dialog";
import {DropdownMenu, DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";
import {DropdownMenuContent, DropdownMenuItem} from "../ui/dropdown-menu";
import {Tabs, TabsContent, TabsList, TabsTrigger,} from "../ui/tabs";
import {Card, CardContent, CardFooter} from "../ui/card";
import {useNavigate} from "react-router-dom";
import {baseUrl} from "../../utils/constent";
import {ApiService} from "../../utils/ApiService";
import {useToast} from "../ui/use-toast";
import WidgetAnalyticsSideBarSheet from "./WidgetAnalyticsSideBarSheet";
import {Skeleton} from "../ui/skeleton";
import EmptyData from "../Comman/EmptyData";
import moment from "moment";

const perPageLimit = 10;

const Widgets = () => {
    const {theme, onProModal} = useTheme()
    const navigate = useNavigate();
    let apiSerVice = new ApiService();
    const {toast} = useToast()
    const [widgetsSetting, setWidgetsSetting] = useState([])
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const userDetailsReducer = useSelector(state => state.userDetailsReducer);
    const [isDeleteLoading, setDeleteIsLoading] = useState(false);
    const [isCopyLoading, setCopyIsLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSheetOpen, setSheetOpen] = useState(false);
    const [pageNo, setPageNo] = useState(1);
    const [totalRecord, setTotalRecord] = useState(0);
    const [openDelete, setOpenDelete] = useState(false);
    const [openCopyCode, setOpenCopyCode] = useState(false);
    const [selectedId, setSelectedId] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [deleteRecord, setDeleteRecord] = useState(null);
    const [analyticsObj, setAnalyticsObj] = useState({});
    const [selectedRecordAnalytics, setSelectedRecordAnalytics] = useState({})

    const openSheet = (id) => {
        setSheetOpen(true);
        setSelectedRecordAnalytics(id)
    }
    const closeSheet = () => {
        setSheetOpen(false);
        setAnalyticsObj({})
    }

    useEffect(() => {
        if(projectDetailsReducer?.id !== ""){
            getWidgetsSetting()
        }
    },[projectDetailsReducer.id])

    const getWidgetsSetting = async () => {
        setIsLoading(true)
        const data = await apiSerVice.getWidgetsSetting(projectDetailsReducer.id)
        if(data.status === 200){
            setWidgetsSetting(data.data);
            setTotalRecord(data.total);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }

    const handleCreateNew = (id) => {
        let length = widgetsSetting?.length;
        if(userDetailsReducer.plan === 0 && id === "new"){
            if(length < 1){
                navigate(`${baseUrl}/widget/${id}`);
                onProModal(false)
            }  else{
                onProModal(true)
            }
        } else{
            navigate(`${baseUrl}/widget/${id}`);
            onProModal(false)
        }

    };

    const deleteWidget = async (id) => {
        setDeleteIsLoading(true);
        const data = await apiSerVice.onDeleteWidget(id, deleteRecord)
        if (data.status === 200) {
            const clone = [...widgetsSetting];
            const index = clone.findIndex((x) => x.id === id)
            if (index !== -1) {
                clone.splice(index, 1)
                setWidgetsSetting(clone);
                setOpenDelete(false);
                setDeleteIsLoading(false);
                toast({description: data.message});
            } else {
                    toast({variant: "destructive", description: data.message});
                }
        }
    };

    const openDeleteWidget = (id) => {
        setDeleteRecord(id)
        setOpenDelete(true)
    }

    const getCodeCopy = (id, type) => {
        setOpenCopyCode(!openCopyCode)
        setSelectedId(id)
        setSelectedType(type)
    }

    const totalPages = Math.ceil(totalRecord / perPageLimit);

    const handlePaginationClick = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPageNo(newPage);
        }
    };

    const handleCopyCode = (id) => {
        setCopyIsLoading(true)
        navigator.clipboard.writeText(id).then(() => {
            setCopyIsLoading(false)
            toast({description: "Copied to clipboard"})
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };
    const codeString = selectedType === "embed" ? `
    <div class="quickhunt-widget-embed" Quickhunt_Widget_Key=${selectedId} widget-width="740px" widget-height="460px"></div>
    <script src="https://quickhunt.app/widgetScript.js"></script>
    ` : `<script>
    window.Quickhunt_Config = window.Quickhunt_Config || [];
    window.Quickhunt_Config.push({ Quickhunt_Widget_Key:  ${selectedId}});
</script>
<script src="https://quickhunt.app/widgetScript.js"></script>`;
    const embedLink = `https://${projectDetailsReducer.domain}/ideas?widget=${selectedId}`
    const iFrame = `<iframe src="${embedLink}" style="border: 0px; outline: 0px; width: 450px; height: 400px;"></iframe>`

    return (
        <Fragment>
            {
                openDelete &&
                <Fragment>
                    <Dialog open onOpenChange={() => setOpenDelete(!openDelete)}>
                        <DialogContent className={"max-w-[350px] w-full sm:max-w-[425px] p-3 md:p-6 rounded-lg"}>
                            <DialogHeader className={"flex flex-row justify-between gap-2"}>
                                <div className={"flex flex-col gap-2"}>
                                    <DialogTitle className={"text-left"}>Delete widget?</DialogTitle>
                                    <DialogDescription className={"text-left"}>Are you sure? This cannot be undone.</DialogDescription>
                                </div>
                                <X size={16} className={"m-0 cursor-pointer"} onClick={() => setOpenDelete(false)}/>
                            </DialogHeader>
                            <DialogFooter className={"flex-row justify-end space-x-2"}>
                                <Button variant={"outline hover:none"}
                                        className={"text-sm font-semibold border"}
                                        onClick={() => setOpenDelete(false)}>Cancel</Button>
                                <Button
                                    variant={"hover:bg-destructive"}
                                    className={`${theme === "dark" ? "text-card-foreground" : "text-card"} ${isDeleteLoading === true ? "py-2 px-6" : "py-2 px-6"} w-[76px] text-sm font-semibold bg-destructive`}
                                    onClick={() => deleteWidget(deleteRecord)}
                                >
                                    {isDeleteLoading ? <Loader2 size={16} className={"animate-spin"}/> : "Delete"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </Fragment>
            }
            {
                openCopyCode &&
                <Fragment>
                    <Dialog open onOpenChange={() => getCodeCopy("")}>
                        <DialogContent className="max-w-[350px] w-full sm:max-w-[580px] bg-white rounded-lg p-3 md:p-6">
                            <DialogHeader className={"flex flex-row justify-between gap-2"}>
                                <div className={"flex flex-col gap-2"}>
                                    <DialogTitle className={`text-left ${theme === "dark" ? "text-card" : ""}`}>Embed Widget</DialogTitle>
                                    <DialogDescription className={"text-left"}>Choose how you would like to embed your widget.</DialogDescription>
                                </div>
                                <X size={16} className={`${theme === "dark" ? "text-card" : ""} m-0 cursor-pointer`} onClick={() => getCodeCopy("")}/>
                            </DialogHeader>
                            <Tabs defaultValue="script">
                                <TabsList className="grid grid-cols-3 w-full bg-white">
                                    <TabsTrigger value="script">Script</TabsTrigger>
                                    <TabsTrigger value="embedlink">Embed Link</TabsTrigger>
                                    <TabsTrigger value="iframe">iFrame</TabsTrigger>
                                </TabsList>
                                <TabsContent value="script" className={"flex flex-col gap-2"}>
                                    <h4 className={`${theme === "dark" ? "text-muted-foreground" : "text-muted-foreground"} text-sm`}>
                                        Place the code below before the closing body tag on your site.
                                    </h4>
                                    <div>
                                        <div className={"relative px-6 rounded-md bg-black mb-2"}>
                                            <div className={"relative"}>
                                                <pre id="text"  className={"py-4 whitespace-pre overflow-x-auto scrollbars-none text-[10px] text-text-invert text-white max-w-[230px] w-full md:max-w-[450px]"}>
                                                      {codeString}
                                                  </pre>

                                                <Button
                                                    variant={"ghost hover:none"}
                                                    className={`absolute top-0 right-0 px-0`}
                                                    onClick={() => handleCopyCode(codeString)}
                                                >
                                                    {isCopyLoading ? <Loader2 size={16} className={"animate-spin"} color={"white"}/> : <Copy size={16} color={"white"}/>}
                                                </Button>

                                            </div>
                                        </div>

                                        <p className={`${theme === "dark" ? "text-muted-foreground" : "text-muted-foreground"} text-xs`}>Read the {" "}
                                            <Button variant={"ghost hover:none"} className={"p-0 h-auto text-xs text-primary font-semibold"}>
                                                Setup Guide
                                            </Button>
                                            {" "}for more information or {" "}
                                            <Button
                                                variant={"ghost hover:none"}
                                                className={"p-0 h-auto text-xs text-primary font-semibold"}
                                            >
                                                download the HTML example.
                                            </Button>
                                        </p>
                                    </div>
                                </TabsContent>
                                <TabsContent value="embedlink" className={"space-y-2"}>
                                    <div className={"space-y-2"}>
                                        <div className={`${theme === "dark" ? "text-muted-foreground" : "text-muted-foreground"} text-sm`}>
                                            Follow these simple steps to embed the widget on any {" "}
                                            <Button
                                                variant={"ghost hover:none"}
                                                className={"p-0 h-auto text-xs text-primary font-semibold"}
                                            >
                                                supported website.
                                            </Button>
                                        </div>
                                        <div>
                                            <p className={`text-xs ${theme === "dark" ? "text-muted-foreground" : "text-muted-foreground"} pb-1`}>1. Copy the link below</p>
                                            <p className={`text-xs ${theme === "dark" ? "text-muted-foreground" : "text-muted-foreground"} pb-1`}>2. Paste the link on any site where you want the widget to show.</p>
                                            <p className={`text-xs ${theme === "dark" ? "text-muted-foreground" : "text-muted-foreground"} pb-1`}>3. That's it!</p>
                                        </div>
                                    </div>
                                    <div>
                                        <div className={"relative px-6 rounded-md bg-black mb-2"}>
                                            <div className={"relative"}>
                                                <pre id="text" className={"py-4 whitespace-pre overflow-x-auto scrollbars-none text-[10px] text-text-invert text-white max-w-[230px] w-full md:max-w-[450px]"}>
                                                    {embedLink}
                                                  </pre>

                                                <Button
                                                    variant={"ghost hover:none"}
                                                    className={`absolute top-0 right-0 px-0`}
                                                    onClick={() => handleCopyCode(embedLink)}
                                                >
                                                    {isCopyLoading ? <Loader2 size={16} className={"animate-spin"} color={"white"}/> : <Copy size={16} color={"white"}/>}
                                                </Button>

                                            </div>
                                        </div>
                                        <p className={`text-xs ${theme === "dark" ? "text-muted-foreground" : "text-muted-foreground"}`}>Read the {" "}
                                            <Button
                                                variant={"ghost hover:none"}
                                                className={"p-0 h-auto text-xs text-primary font-semibold"}
                                            >
                                                Setup Guide
                                            </Button>
                                            {" "}for more information.
                                        </p>
                                    </div>
                                </TabsContent>
                                <TabsContent value="iframe"  className={"flex flex-col gap-2"}>
                                    <div className={`${theme === "dark" ? "text-muted-foreground" : "text-muted-foreground"} text-sm`}>
                                        Place the code below before the closing body tag on your site.
                                    </div>
                                    <div>
                                        <div className={"relative px-6 rounded-md bg-black"}>
                                            <div className={"relative"}>
                                                <pre id="text"  className={"py-4 whitespace-pre overflow-x-auto scrollbars-none text-[10px] text-text-invert text-white max-w-[230px] w-full md:max-w-[450px]"}>
                                                      {iFrame}
                                                  </pre>

                                                <Button
                                                    variant={"ghost hover:none"}
                                                    className={`absolute top-0 right-0 px-0`}
                                                    onClick={() => handleCopyCode(iFrame)}
                                                >
                                                    {isCopyLoading ? <Loader2 size={16} className={"animate-spin"} color={"white"}/> : <Copy size={16} color={"white"}/>}
                                                </Button>

                                            </div>
                                        </div>
                                    </div>
                                    <p className={`text-xs ${theme === "dark" ? "text-muted-foreground" : "text-muted-foreground"}`}>Read the {" "}
                                        <Button
                                            variant={"ghost hover:none"}
                                            className={"p-0 h-auto text-xs text-primary font-semibold"}
                                        >
                                            Setup Guide
                                        </Button>
                                        for more information.
                                    </p>

                                </TabsContent>
                            </Tabs>
                            <DialogFooter>
                                <Button variant={"outline hover:none"}
                                        className={`text-sm font-semibold border ${theme === "dark" ? "text-card" : "text-card-foreground"}`}
                                        onClick={() => getCodeCopy("")}>Cancel</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </Fragment>
            }
            <div
                className={"container xl:max-w-[1200px] lg:max-w-[992px] md:max-w-[768px] sm:max-w-[639px] pt-8 pb-5 px-3 md:px-4"}>

              <WidgetAnalyticsSideBarSheet
                    isOpen={isSheetOpen}
                    onOpen={openSheet}
                    onClose={closeSheet}
                    widgetsSetting={widgetsSetting}
                    selectedRecordAnalytics={selectedRecordAnalytics}
                />
                <div className={"flex mb-10 flex-col space-y-10"}>
                    <div className={"flex flex-col gap-2"}>
                        <div className={"flex items-center justify-between"}>
                            <h1 className={"text-2xl font-medium"}>Widgets</h1>
                            <Button
                                className={"text-sm font-semibold hover:bg-primary px-3 h-auto"}
                                onClick={() => handleCreateNew("new")}
                            >
                                Create New
                            </Button>
                        </div>
                        <div className={"flex flex-col space-y-4"}>
                            <p className={"text-base text-muted-foreground"}>Embed Ideas, Roadmap & Announcements inside
                                your site.</p>
                        </div>
                    </div>
                    <Card>
                        <CardContent className={"p-0 overflow-auto"}>
                            <Table>
                                <TableHeader className={`p-2 lg:py-5 lg:px-8 ${theme === "dark" ? "" : "bg-muted"}`}>
                                    <TableRow>
                                        {
                                            ["Name", "Sections", "Last Updated", "", "Analytics", "Actions"].map((x, i) => {
                                                return (
                                                    <TableHead className={"px-2 py-[10px] md:px-3 font-semibold"}>{x}</TableHead>
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
                                                                    <TableCell className={"max-w-[373px] px-2 py-[10px] md:px-3"}>
                                                                        <Skeleton className={"rounded-md  w-full h-8"}/>
                                                                    </TableCell>
                                                                )
                                                            })
                                                        }
                                                    </TableRow>
                                                )
                                            })
                                        ) : widgetsSetting.length > 0 ? <>
                                            {widgetsSetting.map((x, i) => (
                                                <TableRow key={i}>
                                                    <TableCell className={"font-medium p-2 px-2 py-[10px] md:px-3 cursor-pointer"} onClick={() => handleCreateNew(x.id)}>{x.name}</TableCell>
                                                    <TableCell className={"font-medium p-2 px-2 py-[10px] md:px-3"}>{x.type}</TableCell>
                                                    <TableCell className={"font-medium p-2 px-2 py-[10px] md:px-3"}>{moment(x.created_at).format('D MMM, YYYY')}</TableCell>
                                                    <TableCell className={" p-2 px-2 py-[10px] md:px-3"}>
                                                        <Button
                                                            className={"py-[6px] px-3 h-auto text-xs font-semibold hover:bg-primary"}
                                                            onClick={() => getCodeCopy(x.id)}>Get code</Button>
                                                    </TableCell>
                                                    <TableCell className={"font-medium p-2 px-2 py-[10px] md:px-3"}>
                                                        <BarChart
                                                            onClick={() => openSheet(x.id)} size={16}
                                                            className={"cursor-pointer"}
                                                        />
                                                    </TableCell>
                                                    <TableCell className={" p-2 px-2 py-[10px] md:px-3"}>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger>
                                                                <Ellipsis size={16} className={"cursor-pointer"}/>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align={"end"}>
                                                                <DropdownMenuItem
                                                                    className={"cursor-pointer"} onClick={() => handleCreateNew(x.id)}>Edit</DropdownMenuItem>
                                                                <DropdownMenuItem className={"cursor-pointer"}
                                                                                  onClick={() => openDeleteWidget(x.id)}>Delete</DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </>: <TableRow>
                                            <TableCell colSpan={6}>
                                                <EmptyData />
                                            </TableCell>
                                        </TableRow>
                                    }
                                </TableBody>
                            </Table>
                        </CardContent>
                        <CardFooter className={"p-0"}>
                            <div
                                className={`w-full ${theme === "dark" ? "" : "bg-muted"} rounded-b-lg rounded-t-none flex justify-end p-2 md:px-3 md:py-[10px]`}>
                                <div className={"w-full flex gap-2 items-center justify-between sm:justify-end"}>
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
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </Fragment>
    );
};

export default Widgets;