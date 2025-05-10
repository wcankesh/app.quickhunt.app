import React, {useState, Fragment, useEffect} from 'react';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../ui/table";
import {Badge} from "../ui/badge";
import {Button} from "../ui/button";
import {BarChart, ChevronDown, ChevronUp, Circle, Ellipsis, Eye, Pin} from "lucide-react";
import {useTheme} from "../theme-provider"
import {CardContent} from "../ui/card";
import {DropdownMenu, DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";
import {DropdownMenuContent, DropdownMenuItem} from "../ui/dropdown-menu";
import {Select, SelectItem, SelectGroup, SelectContent, SelectTrigger, SelectValue} from "../ui/select";
import moment from "moment";
import {apiService, baseUrl} from "../../utils/constent";
import {toast} from "../ui/use-toast";
import {Skeleton} from "../ui/skeleton";
import EmptyData from "../Comman/EmptyData";
import {useNavigate} from "react-router";
import {useLocation} from "react-router-dom";
import DeleteDialog from "../Comman/DeleteDialog";
import {Popover, PopoverContent, PopoverTrigger} from "../ui/popover";
import {Avatar, AvatarFallback} from "../ui/avatar";

const status = [
    {name: "Publish", value: 1, fillColor: "#389E0D", strokeColor: "#389E0D",},
    {name: "Draft", value: 3, fillColor: "#CF1322", strokeColor: "#CF1322",},
];
const status2 = [
    {name: "Publish", value: 1, fillColor: "#389E0D", strokeColor: "#389E0D",},
    {name: "Scheduled", value: 2, fillColor: "#63C8D9", strokeColor: "#63C8D9",},
    {name: "Draft", value: 3, fillColor: "#CF1322", strokeColor: "#CF1322",},
]

const AnnouncementsTable = ({data, isLoading, handleDelete, isLoadingDelete, onStatusChange}) => {
    const location = useLocation();
    const UrlParams = new URLSearchParams(location.search);
    const getPageNo = UrlParams.get("pageNo");
    const navigate = useNavigate();
    const {theme} = useTheme();

    const [announcementData, setAnnouncementData] = useState([]);
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortedColumn, setSortedColumn] = useState('');
    const [idToDelete, setIdToDelete] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);

    // useEffect(() => {
    //     // const updatedData = data.map(item => ({
    //     //     ...item,
    //     //     status: item.status ?? 1,
    //     // }));
    //     // setAnnouncementData(updatedData);
    //     setAnnouncementData(data.map((item) => ({...item, status: item.status ?? 1})));
    //     // navigate(`${baseUrl}/announcements?pageNo=${getPageNo}`);
    // }, [data]);

    useEffect(() => {
        if (Array.isArray(data)) {
            setAnnouncementData(data.map((item) => ({ ...item, status: item.status ?? 1 })));
        } else {
            setAnnouncementData([]);
        }
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
                const dateA = new Date(a.publishedAt);
                const dateD = new Date(d.publishedAt);
                return sortOrder === 'asc' ? dateA - dateD : dateD - dateA;
            });
        }
        setAnnouncementData(sortedData);
    };

    const handleStatusChange = async (object, value) => {
        const updatedRecord = {
            ...object,
            status: value,
            publishedAt: value === 1 ? moment(new Date()).format("YYYY-MM-DD") : object.publishedAt,
        };
        setAnnouncementData((prev) =>
            prev.map((x) => (x.id === object.id ? updatedRecord : x))
        );
        onStatusChange(updatedRecord);
        const labelIds = object.labels.map((label) => label.id);
        const payload = {
            ...object,
            status: value,
            publishedAt: value === 1 ? moment(new Date()).format("YYYY-MM-DD") : object.publishedAt,
            labels: labelIds,
        };
        const data = await apiService.updatePosts(payload, object.id);
        if (data.success) {
            toast({ description: data.message });
        } else {
            toast({ description: data.error.message, variant: "destructive" });
            setAnnouncementData((prev) =>
                prev.map((x) => (x.id === object.id ? object : x))
            );
            onStatusChange(object);
        }
    };

    const handleStatusChangeqq = async (object, value) => {
        setAnnouncementData(announcementData.map(x => x.id === object.id ? {
            ...x,
            status: value,
            publishedAt: value === 1 ? moment(new Date()).format("YYYY-MM-DD") : object.publishedAt
        } : x));
        const labelIds = object.labels.map(label => label.id);
        const payload = {
            ...object,
            status: value,
            publishedAt: value === 1 ? moment(new Date()).format("YYYY-MM-DD") : object.publishedAt,
            labels: labelIds
        }
        const data = await apiService.updatePosts(payload, object.id);
        if (data.success) {
            toast({description: data.message,});
        } else {
            toast({description: data.error.message, variant: "destructive",});
        }
        getAllPosts();
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

            {
                openDelete &&
                <DeleteDialog
                    title={"You really want to delete this Announcement?"}
                    isOpen={openDelete}
                    onOpenChange={() => setOpenDelete(false)}
                    onDelete={deleteParticularRow}
                    isDeleteLoading={isLoadingDelete}
                    deleteRecord={idToDelete}
                />
            }

            <CardContent className={"p-0 overflow-auto"}>
                <Table>
                    <TableHeader className={`${theme === "dark" ? "" : "bg-muted"}`}>
                        <TableRow>
                            {
                                ["Title", "Last Updated", "Published At", "Status", "", "", ""].map((x, i) => {
                                    return (
                                        <TableHead className={`font-medium text-card-foreground px-2 py-[10px] md:px-3 ${i === 2 && "cursor-pointer"} ${i > 0 ? "max-w-[140px] truncate text-ellipsis overflow-hidden whitespace-nowrap" : ""}`} key={i}
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
                                                        <TableCell key={i} className={"max-w-[373px] px-2 py-[10px] md:px-3"}>
                                                            <Skeleton className={"rounded-md w-full h-7"}/>
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
                                        <TableRow key={index} className={""}>
                                            <TableCell className={`inline-flex gap-2 md:gap-1 flex-wrap items-center px-2 py-[10px] md:px-3 font-normal`}>
                                                <span
                                                    className={"cursor-pointer max-w-[270px] truncate text-ellipsis overflow-hidden whitespace-nowrap"}
                                                    onClick={() => onEdit(x)}>{x?.title}</span>
                                                {x.pinTop === 1 && <Pin size={14} className={`fill-card-foreground`}/>}
                                                {
                                                    x.labels && x.labels.length > 0 ?
                                                        <div className={"flex flex-wrap gap-1"}>
                                                            <Fragment>
                                                                {
                                                                    (x.labels || []).map((y, index) => {
                                                                        return (
                                                                            <Badge variant={"outline"} key={index}
                                                                                   style={{
                                                                                       color: y.colorCode,
                                                                                       borderColor: y.colorCode,
                                                                                       textTransform: "capitalize"
                                                                                   }}
                                                                                   className={`h-[20px] py-0 px-2 text-xs rounded-[5px]  font-medium text-[${y.colorCode}] border-[${y.colorCode}] capitalize`}>
                                                                                <span className={"max-w-[85px] truncate text-ellipsis overflow-hidden whitespace-nowrap"}>{y.name}</span>
                                                                            </Badge>
                                                                        )
                                                                    })
                                                                }
                                                                {/*<Popover>*/}
                                                                {/*    <PopoverTrigger asChild>*/}
                                                                {/*        <Button variant={"ghost hove:none"} className={"p-0 h-[24px]"}>*/}
                                                                {/*            <div className={"flex justify-between items-center"}>*/}
                                                                {/*                <div className={"text-sm text-center"}>*/}
                                                                {/*                    <div className={`flex flex-wrap gap-2`}>*/}
                                                                {/*                        {*/}
                                                                {/*                            x?.labels?.slice(0, 1).map((labelsId, i) => (*/}
                                                                {/*                                <div className={"text-sm font-normal"} key={i}>*/}
                                                                {/*                                    {labelsId?.name}*/}
                                                                {/*                                </div>*/}
                                                                {/*                            ))*/}
                                                                {/*                        }*/}
                                                                {/*                    </div>*/}
                                                                {/*                </div>*/}
                                                                {/*                {*/}
                                                                {/*                    (x?.labels?.length > 1) &&*/}
                                                                {/*                    <div*/}
                                                                {/*                        className={"update-idea text-sm rounded-full border text-center"}>*/}
                                                                {/*                        <Avatar>*/}
                                                                {/*                            <AvatarFallback>+{x?.labels?.length - 1}</AvatarFallback>*/}
                                                                {/*                        </Avatar>*/}
                                                                {/*                    </div>*/}
                                                                {/*                }*/}
                                                                {/*            </div>*/}
                                                                {/*        </Button>*/}
                                                                {/*    </PopoverTrigger>*/}
                                                                {/*    <PopoverContent className="p-0" align={"start"}>*/}
                                                                {/*        <div className={""}>*/}
                                                                {/*            <div className={"py-3 px-4"}>*/}
                                                                {/*                <h4 className="font-normal leading-none text-sm">{`Topics (${x?.labels?.length})`}</h4>*/}
                                                                {/*            </div>*/}
                                                                {/*            <div className="border-t px-4 py-3 space-y-2">*/}
                                                                {/*                {x.labels && x.labels.length > 0 && (*/}
                                                                {/*                    <div className="space-y-2">*/}
                                                                {/*                        {x.labels.map((y, i) => (*/}
                                                                {/*                            <Badge variant={"outline"} key={i}*/}
                                                                {/*                                           style={{*/}
                                                                {/*                                               color: y.colorCode,*/}
                                                                {/*                                               borderColor: y.colorCode,*/}
                                                                {/*                                               textTransform: "capitalize"*/}
                                                                {/*                                           }}*/}
                                                                {/*                                           className={`h-[20px] py-0 px-2 text-xs rounded-[5px]  font-medium text-[${y.colorCode}] border-[${y.colorCode}] capitalize`}>*/}
                                                                {/*                                        <span className={"max-w-[85px] truncate text-ellipsis overflow-hidden whitespace-nowrap"}>{y.name}</span>*/}
                                                                {/*                                    </Badge>*/}
                                                                {/*                        ))}*/}
                                                                {/*                    </div>*/}
                                                                {/*                )}*/}
                                                                {/*            </div>*/}
                                                                {/*        </div>*/}
                                                                {/*    </PopoverContent>*/}
                                                                {/*</Popover>*/}
                                                            </Fragment>
                                                        </div> : ""}
                                            </TableCell>
                                            <TableCell
                                                className={`font-normal px-2 py-[10px] md:px-3`}>{x?.updatedAt ? moment.utc(x.updatedAt).local().startOf('seconds').fromNow() : "-"}</TableCell>
                                            <TableCell className={`font-normal px-2 py-[10px] md:px-3`}>{x.publishedAt ? moment(x.publishedAt).format('D MMM, YYYY') : moment().format('D MMM, YYYY')}</TableCell>
                                            <TableCell className={"px-2 py-[10px] md:px-3"}>
                                                <Select value={x.status}
                                                        onValueChange={(value) => handleStatusChange(x, value)}>
                                                    <SelectTrigger className="w-[137px] h-7">
                                                        <SelectValue placeholder={x.status ? status.find(s => s.value == x.status)?.name : "Publish"}/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {
                                                                (x.status === 2 ? status2 : status || []).map((x, i) => {
                                                                    return (
                                                                        <Fragment key={i}>
                                                                            <SelectItem value={x.value}
                                                                                        disabled={x.value === 2}>
                                                                                <div
                                                                                    className={"flex items-center gap-2"}>
                                                                                    <Circle fill={x.fillColor}
                                                                                            stroke={x.strokeColor}
                                                                                            className={`font-normal w-2 h-2`}/>
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
                                                    disabled={x.status !== 1}
                                                    variant={"ghost"}
                                                    onClick={() => shareFeedback(x.domain, x.slug)}
                                                    className={"p-0 h-auto"}
                                                >
                                                    <Eye size={18} className={`font-normal`}/>
                                                </Button>
                                            </TableCell>
                                            <TableCell className={"px-2 py-[10px] md:px-3"}>
                                                <Button
                                                    onClick={() => navigate(`${baseUrl}/announcements/analytic-view?id=${x.id}`)}
                                                    variant={"ghost"}
                                                    className={"p-0 h-auto"}
                                                >
                                                    <BarChart size={18}/>
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