import React, {Fragment, useEffect, useState} from 'react';
import {Button} from "../ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "../ui/table";
import {BarChart, Copy, Ellipsis, Loader2, Plus, X} from "lucide-react";
import {useTheme} from "../theme-provider";
import {useSelector} from "react-redux";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "../ui/dialog";
import {DropdownMenu, DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";
import {DropdownMenuContent, DropdownMenuItem} from "../ui/dropdown-menu";
import {Tabs, TabsContent, TabsList, TabsTrigger,} from "../ui/tabs";
import {Card, CardContent} from "../ui/card";
import {useNavigate} from "react-router-dom";
import {baseUrl} from "../../utils/constent";
import {ApiService} from "../../utils/ApiService";
import {useToast} from "../ui/use-toast";
import WidgetAnalytics from "./WidgetAnalytics";
import {Skeleton} from "../ui/skeleton";
import EmptyData from "../Comman/EmptyData";
import moment from "moment";
import Pagination from "../Comman/Pagination";
import DeleteDialog from "../Comman/DeleteDialog";
import {EmptyDataContent} from "../Comman/EmptyDataContent";
import CopyCode from "../Comman/CopyCode";

const perPageLimit = 10;

const Widgets = () => {
    const {theme, onProModal} = useTheme()
    const navigate = useNavigate();
    const UrlParams = new URLSearchParams(location.search);
    const getPageNo = UrlParams.get("pageNo") || 1;
    let apiSerVice = new ApiService();
    const {toast} = useToast()
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const userDetailsReducer = useSelector(state => state.userDetailsReducer);

    const [widgetsSetting, setWidgetsSetting] = useState([])
    const [analyticsObj, setAnalyticsObj] = useState({});
    const [selectedRecordAnalytics, setSelectedRecordAnalytics] = useState({})
    const [isDeleteLoading, setDeleteIsLoading] = useState(false);
    const [isCopyLoading, setCopyIsLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSheetOpen, setSheetOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openCopyCode, setOpenCopyCode] = useState(false);
    const [selectedId, setSelectedId] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [deleteRecord, setDeleteRecord] = useState(null);
    const [pageNo, setPageNo] = useState(Number(getPageNo));
    const [totalRecord, setTotalRecord] = useState(0);
    const [emptyContentBlock, setEmptyContentBlock] = useState(true);

    const emptyContent = (status) => {setEmptyContentBlock(status);};

    const openSheet = (id, type) => {
        if(type === "delete") {
            setDeleteRecord(id)
            setOpenDelete(true)
        } else {
            setSheetOpen(true);
            setSelectedRecordAnalytics(id)
        }
    }
    const closeSheet = () => {
        setSheetOpen(false);
        setAnalyticsObj({})
    }

    useEffect(() => {
        if (projectDetailsReducer?.id !== "") {
            getWidgetsSetting(pageNo, perPageLimit);
        }
        navigate(`${baseUrl}/widget?pageNo=${pageNo}`)
    }, [projectDetailsReducer.id, pageNo, perPageLimit]);

    const getWidgetsSetting = async () => {
        setIsLoading(true)
        const payload = {
            project_id: projectDetailsReducer.id,
            page: pageNo,
            limit: perPageLimit
        }
        const data = await apiSerVice.getWidgetsSetting(payload)
        if (data.status === 200) {
            setWidgetsSetting(data.data);
            setTotalRecord(data.total);
            setIsLoading(false);
            if (!data.data || data.data.length === 0) {
                emptyContent(true);
            } else {
                emptyContent(false);
            }
        } else {
            setIsLoading(false);
            emptyContent(true);
        }
    }

    const handleCreateNew = (id, type) => {
        let length = widgetsSetting?.length;
        if (userDetailsReducer.plan === 0 && id === "type") {
            if (length < 1) {
                navigate(`${baseUrl}/widget/${id}`);
                onProModal(false)
            } else {
                onProModal(true)
            }
        } else {
            if(id === "type"){
                navigate(`${baseUrl}/widget/${id}`);
            } else {
                navigate(`${baseUrl}/widget/${type}/${id}?pageNo=${getPageNo}`);
            }

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
                if (clone.length === 0 && pageNo > 1) {
                    setPageNo(pageNo - 1);
                    getWidgetsSetting(pageNo - 1);
                } else {
                    getWidgetsSetting(pageNo);
                }
                setOpenDelete(false);
                setDeleteIsLoading(false);
                toast({description: data.message});
            } else {
                toast({variant: "destructive", description: data.message});
            }
        }
    };

    const getCodeCopy = (id, type) => {
        setOpenCopyCode(!openCopyCode)
        setSelectedId(id)
        setSelectedType(type)
    }

    const totalPages = Math.ceil(totalRecord / perPageLimit);

    const handlePaginationClick = async (newPage) => {
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

    const EmptyInWidgetContent = [
        {
            title: "Embed Widget",
            description: `Easily embed a widget on your website to display key information or engage users without disrupting the browsing experience.`,
            btnText: [
                {title: "Create Embed Widget", navigateTo: "embed/new", icon: <Plus size={18} className={"mr-1"} strokeWidth={3}/>},
            ],
        },
        {
            title: "Popover Widget",
            description: `Use a popover widget to show important updates or offers in a small, non-intrusive popup that appears on the screen.`,
            btnText: [
                {title: "Create Popover Widget", navigateTo: "popover/new", icon: <Plus size={18} className={"mr-1"} strokeWidth={3}/>},
            ],
        },
        {
            title: "Modal Widget",
            description: `Create a modal widget to display more detailed information or prompts in a full-screen overlay, ensuring user attention.`,
            btnText: [
                {title: "Create Modal Widget", navigateTo: "modal/new", icon: <Plus size={18} className={"mr-1"} strokeWidth={3}/>},
            ],
        },
        {
            title: "Sidebar Widget",
            description: `Add a sidebar widget to your website to showcase updates, product features, or quick links, offering easy access without overwhelming the page.`,
            btnText: [
                {title: "Create Sidebar Widget", navigateTo: "sidebar/new", icon: <Plus size={18} className={"mr-1"} strokeWidth={3}/>},
            ],
        },
        {
            title: "General Settings",
            description: `Customize the appearance and behavior of your widgets to match your website design and provide a seamless user experience.`,
            btnText: [
                {title: "Manage General Settings", navigateTo: `${baseUrl}/settings/general-settings`, icon: <Plus size={18} className={"mr-1"} strokeWidth={3}/>},
            ],
        },
        {
            title: "Social Links",
            description: `Integrate social media links directly into your widget to encourage user engagement and promote your online presence.`,
            btnText: [
                {title: "Add Social Links", navigateTo: `${baseUrl}/settings/social`, icon: <Plus size={18} className={"mr-1"} strokeWidth={3}/>},
            ],
        },
    ];

    const codeString = selectedType === "embed" ? `
    <div class="quickhunt-widget-embed" Quickhunt_Widget_Key=${selectedId} widget-width="740px" widget-height="460px"></div>
    <script src="https://fw.quickhunt.app/widgetScript.js"></script>
    ` : `<script>
    window.Quickhunt_Config = window.Quickhunt_Config || [];
    window.Quickhunt_Config.push({ Quickhunt_Widget_Key:  ${selectedId}});
</script>
<script src="https://fw.quickhunt.app/widgetScript.js"></script>`;
    const embedLink = `https://${projectDetailsReducer.domain}/widget/ideas?widget=${selectedId}`
    const iFrame = `<iframe src="${embedLink}" style="border: 0px; outline: 0px; width: 450px; height: 400px;"></iframe>`
    const callback = `window.Quickhunt('${selectedId}')`

    return (
        <Fragment>
            {
                openDelete &&
                <DeleteDialog
                    title={"You really want to delete this Widget?"}
                    isOpen={openDelete}
                    onOpenChange={() => setOpenDelete(false)}
                    onDelete={deleteWidget}
                    isDeleteLoading={isDeleteLoading}
                    deleteRecord={deleteRecord}
                />
            }
            {
                openCopyCode &&
                <Fragment>
                    <CopyCode
                        open={openCopyCode}
                        onClick={() => getCodeCopy("")}
                        title={"Embed Widget"}
                        description={"Choose how you would like to embed your Widget."}
                        iFrame={iFrame}
                        codeString={codeString}
                        callback={callback}
                        handleCopyCode={() => handleCopyCode(codeString)}
                        embedLink={embedLink}
                        onOpenChange={() => getCodeCopy("")}
                        isCopyLoading={isCopyLoading}
                        isWidget={true}
                    />
                </Fragment>
            }
            <div className={"container xl:max-w-[1200px] lg:max-w-[992px] md:max-w-[768px] sm:max-w-[639px] pt-8 pb-5 px-3 md:px-4"}>

                <WidgetAnalytics
                    isOpen={isSheetOpen}
                    onOpen={openSheet}
                    onClose={closeSheet}
                    widgetsSetting={widgetsSetting}
                    selectedRecordAnalytics={selectedRecordAnalytics}
                />
                <div className={"flex flex-col"}>
                    <div className={"flex items-center justify-between flex-wrap gap-2"}>
                        <div className={"flex flex-col gap-y-0.5"}>
                            <h1 className="text-2xl font-normal flex-initial w-auto">Widgets ({totalRecord})</h1>
                            <p className={"text-sm text-muted-foreground"}>Enhance your site with different widgets: Embed, Popover, Modal, and Sidebar, for improved interactivity and access.</p>
                        </div>
                        <div className={"w-full lg:w-auto flex sm:flex-nowrap flex-wrap gap-2 items-center"}>
                            <Button
                                className={"gap-2 font-medium hover:bg-primary"}
                                onClick={() => handleCreateNew("type")}
                            >
                                <Plus size={20} strokeWidth={3}/><span className={"text-xs md:text-sm font-medium"}>Create New</span>
                            </Button>
                        </div>
                    </div>
                    <Card className={"my-6"}>
                        <CardContent className={"p-0 overflow-auto"}>
                            <Table>
                                <TableHeader className={`p-2 lg:py-5 lg:px-8 ${theme === "dark" ? "" : "bg-muted"}`}>
                                    <TableRow>
                                        {
                                            ["Name", "Type", "Last Updated", "", "Analytics", "Actions"].map((x, i) => {
                                                return (
                                                    <TableHead
                                                        className={`px-2 py-[10px] md:px-3 font-medium text-card-foreground ${i > 1 ? "max-w-[140px] truncate text-ellipsis overflow-hidden whitespace-nowrap" : ""} ${i >= 4 ? 'text-center' : ''}`}>{x}</TableHead>
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
                                                                    <TableCell
                                                                        className={"max-w-[373px] px-2 py-[10px] md:px-3"}>
                                                                        <Skeleton className={"rounded-md  w-full h-7"}/>
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
                                                    <TableCell
                                                        className={"font-normal p-2 py-[10px] md:px-3 cursor-pointer capitalize max-w-[120px] cursor-pointer truncate text-ellipsis overflow-hidden whitespace-nowrap"}
                                                        onClick={() => handleCreateNew(x.id, x.type)}>{x.name}</TableCell>
                                                    <TableCell
                                                        className={"font-normal p-2 py-[10px] md:px-3 capitalize"}>{x.type}</TableCell>
                                                    <TableCell
                                                        className={"font-normal p-2 py-[10px] md:px-3"}>{moment(x.created_at).format('D MMM, YYYY')}</TableCell>
                                                    <TableCell className={" p-2 py-[10px] md:px-3 text-center"}>
                                                        <Button
                                                            className={"py-[6px] px-3 h-auto text-xs font-medium hover:bg-primary"}
                                                            onClick={() => getCodeCopy(x.id)}>Get code</Button>
                                                    </TableCell>
                                                    <TableCell className={"font-normal p-2 py-[10px] md:px-3"}>
                                                        <div className={"flex justify-center"}>
                                                        <BarChart
                                                            onClick={() => openSheet(x.id)} size={16}
                                                            className={"cursor-pointer"}
                                                        />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className={" p-2 py-[10px] md:px-3 text-center"}>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger>
                                                                <Ellipsis size={16} className={"cursor-pointer"}/>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align={"end"}>
                                                                <DropdownMenuItem
                                                                    className={"cursor-pointer"}
                                                                    onClick={() => handleCreateNew(x.id, x.type)}>Edit</DropdownMenuItem>
                                                                <DropdownMenuItem className={"cursor-pointer"}
                                                                                  onClick={() => openSheet(x.id, "delete")}>Delete</DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </> : <TableRow>
                                            <TableCell colSpan={6}>
                                                <EmptyData/>
                                            </TableCell>
                                        </TableRow>
                                    }
                                </TableBody>
                            </Table>
                        </CardContent>
                        {
                            widgetsSetting.length > 0 ?
                                <Pagination
                                    pageNo={pageNo}
                                    totalPages={totalPages}
                                    isLoading={isLoading}
                                    handlePaginationClick={handlePaginationClick}
                                    stateLength={widgetsSetting.length}
                                /> : ""
                        }
                    </Card>
                    {
                        (isLoading || !emptyContentBlock) ? "" :
                            <EmptyDataContent data={EmptyInWidgetContent} onClose={() => emptyContent(false)}/>
                    }
                </div>
            </div>
        </Fragment>
    );
};

export default Widgets;