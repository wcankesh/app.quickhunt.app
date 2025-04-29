import React, {Fragment, useEffect, useState} from 'react';
import {Button} from "../ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "../ui/table";
import {BarChart, Ellipsis, Plus} from "lucide-react";
import {useTheme} from "../theme-provider";
import {useSelector} from "react-redux";
import {DropdownMenu, DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";
import {DropdownMenuContent, DropdownMenuItem} from "../ui/dropdown-menu";
import {Card, CardContent} from "../ui/card";
import {useNavigate, useSearchParams} from "react-router-dom";
import {apiService, baseUrl, WIDGET_DOMAIN} from "../../utils/constent";
import {useToast} from "../ui/use-toast";
import WidgetAnalytics from "./WidgetAnalytics";
import {Skeleton} from "../ui/skeleton";
import EmptyData from "../Comman/EmptyData";
import moment from "moment";
import Pagination from "../Comman/Pagination";
import DeleteDialog from "../Comman/DeleteDialog";
import {EmptyDataContent} from "../Comman/EmptyDataContent";
import CopyCode from "../Comman/CopyCode";
import {EmptyInWidgetContent} from "../Comman/EmptyContentForModule";

const perPageLimit = 10;

const Widgets = () => {
    const {theme, onProModal} = useTheme()
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const getPageNo = searchParams.get("pageNo") || 1;
    const {toast} = useToast()
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const userDetailsReducer = useSelector(state => state.userDetailsReducer);

    const [widgetsSetting, setWidgetsSetting] = useState([])
    const [selectedRecordAnalytics, setSelectedRecordAnalytics] = useState({})
    const [isDeleteLoading, setDeleteIsLoading] = useState(false);
    const [isCopyLoading, setCopyIsLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSheetOpen, setSheetOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openCopyCode, setOpenCopyCode] = useState(false);
    const [selectedId, setSelectedId] = useState("");
    const [selectedType, setSelectedType] = useState("script");
    const [deleteRecord, setDeleteRecord] = useState(null);
    const [pageNo, setPageNo] = useState(Number(getPageNo));
    const [totalRecord, setTotalRecord] = useState(0);
    const [emptyContentBlock, setEmptyContentBlock] = useState(true);

    const emptyContent = (status) => {
        setEmptyContentBlock(status);
    };

    const openSheet = (id, type) => {
        if (type === "delete") {
            setDeleteRecord(id)
            setOpenDelete(true)
        } else {
            setSheetOpen(true);
            setSelectedRecordAnalytics(id)
        }
    }

    const closeSheet = () => {
        setSheetOpen(false);
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
            projectId: projectDetailsReducer.id,
            page: pageNo,
            limit: perPageLimit
        }
        const data = await apiService.getWidgetsSetting(payload)
        setIsLoading(false);
        if (data.success) {
            setWidgetsSetting(data.data?.widgets);
            setTotalRecord(data.data.total);
            if (!data.data?.widgets || data.data?.widgets.length === 0) {
                emptyContent(true);
            } else {
                emptyContent(false);
            }
        } else {
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
            if (id === "type") {
                navigate(`${baseUrl}/widget/${id}`);
            } else {
                navigate(`${baseUrl}/widget/${type}/${id}?pageNo=${getPageNo}`);
            }
            onProModal(false)
        }
    };

    const deleteWidget = async (id) => {
        setDeleteIsLoading(true);
        const data = await apiService.onDeleteWidget(id, deleteRecord)
        if (data.success) {
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
                toast({variant: "destructive", description: data?.error?.message});
            }
        }
    };

    const getCodeCopy = (id) => {
        setOpenCopyCode(!openCopyCode)
        setSelectedId(id)
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

    const embedLink = `https://${projectDetailsReducer.domain}/widget/ideas?widget='${selectedId}'`;

    const iFrame = `<iframe src="${embedLink}" style="border: 0px; outline: 0px; width: 450px; height: 400px;"></iframe>`;

    const callback = `window.Quickhunt('${selectedId}')`;

    const embed = `
    <div class="quickhunt-widget-embed" Quickhunt_Widget_Key='${selectedId}' widget-width="740px" widget-height="460px"></div>
    <script src="${WIDGET_DOMAIN}/widgetScript.js"></script>`;

    const script = `<script>
    window.Quickhunt_Config = window.Quickhunt_Config || [];
    window.Quickhunt_Config.push({ Quickhunt_Widget_Key: 
     "${selectedId}"});
</script>
<script src="${WIDGET_DOMAIN}/widgetScript.js"></script>`;

    const codeString = selectedType === "script" ? script : selectedType === "embedlink" ? embedLink : selectedType === "iframe" ? iFrame : callback;

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
                        codeString={codeString}
                        handleCopyCode={() => handleCopyCode(codeString)}
                        onOpenChange={() => getCodeCopy("")}
                        isCopyLoading={isCopyLoading}
                        isWidget={true}
                        setSelectedType={setSelectedType}
                        selectedType={selectedType}
                    />
                </Fragment>
            }

            <div
                className={"container xl:max-w-[1200px] lg:max-w-[992px] md:max-w-[768px] sm:max-w-[639px] pt-8 pb-5 px-3 md:px-4"}>
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
                            <p className={"text-sm text-muted-foreground"}>Enhance your site with different widgets:
                                Embed, Popover, Modal, and Sidebar, for improved interactivity and access.</p>
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
                                                    <TableHead key={i}
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
                                                                        className={"max-w-[373px] px-2 py-[10px] md:px-3"} key={i}>
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
                                                        className={"font-normal p-2 py-[10px] md:px-3"}>{moment(x.createdAt).format('D MMM, YYYY')}</TableCell>
                                                    <TableCell className={" p-2 py-[10px] md:px-3 text-center"}>
                                                        <Button
                                                            className={"py-[6px] px-3 h-auto text-xs font-medium hover:bg-primary"}
                                                            onClick={() => getCodeCopy(x.sortCode)}>Get code</Button>
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