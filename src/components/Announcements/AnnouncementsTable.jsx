import React, {useState, Fragment, useEffect} from 'react';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../ui/table";
import {Badge} from "../ui/badge";
import {Button} from "../ui/button";
import {BarChart, ChevronDown, ChevronUp, Circle, Ellipsis, Eye, Loader2, Pin, X,} from "lucide-react";
import {useTheme} from "../theme-provider"
import {CardContent} from "../ui/card";
import {DropdownMenu, DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";
import {DropdownMenuContent, DropdownMenuItem} from "../ui/dropdown-menu";
import {Select, SelectItem, SelectGroup, SelectContent, SelectTrigger, SelectValue} from "../ui/select";
import moment from "moment";
import {apiService, baseUrl} from "../../utils/constent";
import {Toaster} from "../ui/toaster";
import {toast} from "../ui/use-toast";
import {Skeleton} from "../ui/skeleton";
import {Dialog} from "@radix-ui/react-dialog";
import {DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "../ui/dialog";
import EmptyData from "../Comman/EmptyData";
import {useNavigate} from "react-router";
import {useLocation} from "react-router-dom";

const status = [
    {name: "Publish", value: 1, fillColor: "#389E0D", strokeColor: "#389E0D",},
    {name: "Draft", value: 4, fillColor: "#CF1322", strokeColor: "#CF1322",},
];
const status2 = [
    {name: "Publish", value: 1, fillColor: "#389E0D", strokeColor: "#389E0D",},
    {name: "Scheduled", value: 2, fillColor: "#63C8D9", strokeColor: "#63C8D9",},
    {name: "Draft", value: 4, fillColor: "#CF1322", strokeColor: "#CF1322",},
]

const AnnouncementsTable = ({data, isLoading, setSelectedRecord, handleDelete, setAnalyticsObj,isLoadingDelete, currentPage, setCurrentPage}) => {

    const location = useLocation();
    const UrlParams = new URLSearchParams(location.search);
    const getPageNo = UrlParams.get("pageNo");

    const navigate = useNavigate();
    const {theme} = useTheme();
    const [announcementData, setAnnouncementData] = useState(data);
    const [idToDelete, setIdToDelete] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortedColumn, setSortedColumn] = useState('');

    useEffect(() => {
        // const updatedData = data.map(item => ({
        //     ...item,
        //     post_status: item.post_status ?? 1,
        // }));
        // setAnnouncementData(updatedData);
        setAnnouncementData(data.map((item) => ({...item, post_status: item.post_status ?? 1})));
        navigate(`${baseUrl}/announcements?pageNo=${getPageNo}`);
    }, [data]);

    const toggleSort = (column) => {
        let sortedData = [...announcementData];
        if (sortedColumn === column) {
            setSortOrder((prev) => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortedColumn(column);
            setSortOrder('asc');
        }
        if (column === "Published At") {
            sortedData.sort((a, d) => {
                const dateA = new Date(a.post_published_at);
                const dateD = new Date(d.post_published_at);
                return sortOrder === 'asc' ? dateA - dateD : dateD - dateA;
            });
        }
        setAnnouncementData(sortedData);
    };

    const openSheet = (x) => {
        setAnalyticsObj(x);
    };

    const handleStatusChange = async (object, value) => {
        setAnnouncementData(announcementData.map(x => x.id === object.id ? {
            ...x,
            post_status: value,
            post_published_at: value === 1 ? moment(new Date()).format("YYYY-MM-DD") : object.post_published_at
        } : x));
        const payload = {
            ...object,
            post_status: value,
            post_published_at: value === 1 ? moment(new Date()).format("YYYY-MM-DD") : object.post_published_at
        }
        const data = await apiService.updatePosts(payload, object.id);
        if (data.status === 200) {
            toast({
                description: data.message,
            });
        } else {
            toast({
                description: data.message,
                variant: "destructive",
            });
        }

    };

    const onEdit = (record) => {
        navigate(`${baseUrl}/announcements/${record.id}?pageNo=${getPageNo}`);
    };

    const shareFeedback = (domain, slug) => {
        window.open(`https://${domain}/announcements/${slug}`, "_blank")
    }

    const deleteRow = (id) => {
        setIdToDelete(id);
        setOpenDelete(true);
    }

    const deleteParticularRow = async () => {
       await handleDelete(idToDelete);
        setOpenDelete(false);
    }

    return (
        <Fragment>
            <Toaster/>

            {
                openDelete &&
                <Fragment>
                    <Dialog open onOpenChange={() => setOpenDelete(false)}>
                        <DialogContent className="max-w-[350px] w-full sm:max-w-[525px] p-3 md:p-6 rounded-lg">
                            <DialogHeader className={"flex flex-row justify-between gap-2"}>
                                <div className={"flex flex-col gap-2"}>
                                    <DialogTitle className={"text-start"}>You really want delete this
                                        announcement?</DialogTitle>
                                    <DialogDescription className={"text-start"}>This action can't be
                                        undone.</DialogDescription>
                                </div>
                                <X size={16} className={"m-0 cursor-pointer"} onClick={() => setOpenDelete(false)}/>
                            </DialogHeader>
                            <DialogFooter className={"flex-row justify-end space-x-2"}>
                                <Button variant={"outline hover:none"}
                                        className={"text-sm font-semibold border"}
                                        onClick={() => setOpenDelete(false)}>Cancel</Button>
                                <Button
                                    variant={"hover:bg-destructive"}
                                    className={` ${theme === "dark" ? "text-card-foreground" : "text-card"} ${isLoadingDelete ? "py-2 px-6" : "py-2 px-6"} w-[76px] text-sm font-semibold bg-destructive`}
                                    onClick={deleteParticularRow}
                                >
                                    {isLoadingDelete ? <Loader2 size={16} className={"animate-spin"}/> : "Delete"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </Fragment>
            }


            <CardContent className={"p-0 overflow-auto"}>
                <Table>
                    <TableHeader className={`${theme === "dark" ? "" : "bg-muted"}`}>
                        <TableRow>
                            {
                                ["Title", "Last Updated", "Published At", "Status", "", "", ""].map((x, i) => {
                                    return (
                                        <TableHead className={`font-semibold px-2 py-[10px] md:px-3 `} key={i}
                                                   onClick={() => x === "Published At" && toggleSort("Published At")}>
                                            {x}
                                            {x === "Published At" && (
                                                sortOrder === 'asc' ?
                                                    <ChevronUp size={18} className="inline ml-1"/> :
                                                    <ChevronDown size={18} className="inline ml-1"/>)
                                            }
                                        </TableHead>
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
                                                [...Array(7)].map((_, i) => {
                                                    return (
                                                        <TableCell className={"max-w-[373px] px-2 py-[10px] md:px-3"}>
                                                            <Skeleton className={"rounded-md  w-full h-7"}/>
                                                        </TableCell>
                                                    )
                                                })
                                            }
                                        </TableRow>
                                    )
                                })
                            ) : announcementData.length > 0 ? <>
                                {(announcementData || []).map((x, index) => {
                                    return (
                                        <TableRow key={x?.id} className={""}>
                                            <TableCell
                                                className={`inline-flex gap-2 md:gap-1 flex-wrap items-center px-2 py-[10px] md:px-3 font-medium`}>
                                                {/*className={`inline-flex gap-2 md:gap-3 flex-wrap items-center px-2 py-[10px] md:px-3 font-medium h-12`}>*/}
                                                <span
                                                    className={"cursor-pointer text-ellipsis overflow-hidden whitespace-nowrap"}
                                                    onClick={() => onEdit(x)}>{x?.post_title}</span>
                                                {x.post_pin_to_top === 1 && <Pin size={14} className={`${theme === "dark" ? "fill-card-foreground" : "fill-card-foreground"}`}/>}
                                                {
                                                    x.labels && x.labels.length > 0 ?
                                                        <div className={"flex flex-wrap gap-1"}>
                                                            <Fragment>
                                                                {
                                                                    (x.labels || []).map((y, index) => {
                                                                        return (
                                                                            <Badge variant={"outline"} key={index}
                                                                                   style={{
                                                                                       color: y.label_color_code,
                                                                                       borderColor: y.label_color_code,
                                                                                       textTransform: "capitalize"
                                                                                   }}
                                                                                   className={`h-[20px] py-0 px-2 text-xs rounded-[5px]  font-medium text-[${y.label_color_code}] border-[${y.label_color_code}] capitalize`}>{y.label_name}</Badge>
                                                                        )
                                                                    })
                                                                }
                                                            </Fragment>
                                                        </div> : ""}
                                            </TableCell>
                                            <TableCell
                                                className={`font-medium px-2 py-[10px] md:px-3`}>{x?.post_modified_date ? moment.utc(x.post_modified_date).local().startOf('seconds').fromNow() : "-"}</TableCell>
                                            <TableCell className={`font-medium px-2 py-[10px] md:px-3`}>{x.post_published_at ? moment(x.post_published_at).format('D MMM, YYYY') : moment().format('D MMM, YYYY')}</TableCell>
                                            <TableCell className={"px-2 py-[10px] md:px-3"}>
                                                <Select value={x.post_status}
                                                        onValueChange={(value) => handleStatusChange(x, value)}>
                                                    <SelectTrigger className="w-[137px] h-7">
                                                        <SelectValue
                                                            placeholder={x.post_status ? status.find(s => s.value == x.post_status)?.name : "Publish"}/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {
                                                                (x.post_status === 2 ? status2 : status || []).map((x, i) => {
                                                                    return (
                                                                        <Fragment key={i}>
                                                                            <SelectItem value={x.value}
                                                                                        disabled={x.value === 2}>
                                                                                <div
                                                                                    className={"flex items-center gap-2"}>
                                                                                    <Circle fill={x.fillColor}
                                                                                            stroke={x.strokeColor}
                                                                                            className={`font-medium w-2 h-2`}/>
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
                                            <TableCell className={"px-2 py-[10px] md:px-3"}>
                                                <Button
                                                    disabled={x.post_status !== 1}
                                                    variant={"ghost"}
                                                    onClick={() => shareFeedback(x.domain, x.post_slug_url)}
                                                    className={"p-0 h-auto"}
                                                >
                                                    <Eye size={18} className={`font-medium`}/>
                                                </Button>
                                            </TableCell>
                                            <TableCell className={"px-2 py-[10px] md:px-3"}>
                                                <Button
                                                    onClick={() => openSheet(x)}
                                                    variant={"ghost"}
                                                    className={"p-0 h-auto"}
                                                >
                                                    <BarChart size={18} className={`font-medium`}/>
                                                </Button>
                                            </TableCell>
                                            <TableCell className={"px-2 py-[10px] md:px-3"}>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger>
                                                        <Ellipsis className={`font-medium`} size={18}/>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align={"end"}>
                                                        <DropdownMenuItem className={"cursor-pointer"}
                                                                          onClick={() => onEdit(x)}>Edit</DropdownMenuItem>
                                                        <DropdownMenuItem className={"cursor-pointer"}
                                                                          onClick={() => deleteRow(x.id)}>Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </> : <TableRow>
                                <TableCell colSpan={7}>
                                    <EmptyData/>
                                </TableCell>
                            </TableRow>
                        }
                    </TableBody>
                </Table>
            </CardContent>
        </Fragment>
    );
};

export default AnnouncementsTable;