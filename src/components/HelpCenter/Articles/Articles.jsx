import React, {Fragment, useEffect, useState} from 'react';
import { Input } from "../../ui/input";
import { Select, SelectGroup, SelectValue, SelectItem, SelectTrigger, SelectContent } from "../../ui/select";
import {ChevronLeft, Circle, Ellipsis, Filter, Plus, X} from "lucide-react";
import { Button } from "../../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import {Card, CardContent} from "../../ui/card";
import { useTheme } from "../../theme-provider";
import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuItem } from "../../ui/dropdown-menu";
import {useNavigate} from "react-router-dom";
import {baseUrl} from "../../../utils/constent";
import moment from "moment";
import {ApiService} from "../../../utils/ApiService";
import {useSelector} from "react-redux";
import {useToast} from "../../ui/use-toast";
import {Skeleton} from "../../ui/skeleton";
import EmptyData from "../../Comman/EmptyData";
import {Popover, PopoverContent, PopoverTrigger} from "../../ui/popover";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "../../ui/command";
import {Checkbox} from "../../ui/checkbox";
import {Badge} from "../../ui/badge";
import Pagination from "../../Comman/Pagination";
import DeleteDialog from "../../Comman/DeleteDialog";

const status = [
    {name: "Publish", value: 1, fillColor: "#389E0D", strokeColor: "#389E0D",},
    {name: "Draft", value: 0, fillColor: "#CF1322", strokeColor: "#CF1322",},
];

// const initialFilter = {
//     all: "",
//     search: "",
//     title: "",
//     category_id: "",
//     sub_category_id: "",
// }

const initialFilter = [
    {name: "Category", value: "category_id",},
    {name: "Sub Category", value: "sub_category_id",},
]

const perPageLimit = 10

const Articles = () => {
    const apiService = new ApiService();
    const {theme} = useTheme();
    const {toast} = useToast();
    const navigate = useNavigate();
    const UrlParams = new URLSearchParams(location.search);
    const getPageNo = UrlParams.get("pageNo") || 1;
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);

    const [filter, setFilter] = useState(initialFilter);
    const [articles, setArticles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [openFilter, setOpenFilter] = useState('');
    const [openFilterType, setOpenFilterType] = useState('');
    const [totalRecord, setTotalRecord] = useState(0);
    const [pageNo, setPageNo] = useState(Number(getPageNo));
    const [idToDelete, setIdToDelete] = useState(null);
    const [openDelete,setOpenDelete]=useState(false);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if(filter.sub_category_id || filter.category_id || filter.title || filter.all) {
            let payload = {...filter, project_id: projectDetailsReducer.id, page: pageNo, limit: perPageLimit}
            articleSearch(payload)
        } else {
            if (projectDetailsReducer.id) {
                getAllArticles();
            }
        }
        navigate(`${baseUrl}/help/article?pageNo=${pageNo}`);
    }, [projectDetailsReducer.id, pageNo])

    const getAllArticles = async () => {
        const data = await apiService.getAllArticles({
            project_id: projectDetailsReducer.id,
            search: "",
            category_id: "",
            sub_category_id: "",
            page: pageNo,
            limit: perPageLimit
        });
        if (data.status === 200) {
            setArticles(data.data);
            setTotalRecord(data.total);
            setIsLoading(false)
        }
        setIsLoading(false)
    };

    const articleSearch = async (payload) => {
        const data = await apiService.articleSearch(payload)
        if (data.status === 200) {
            setArticles(data.data)
            setTotalRecord(data.total)
            setPageNo(payload.page)
            setIsLoading(false)
        } else {
            setIsLoading(false)
        }
    }

    const handleChangeSearch = (e) => {
        let payload = {
            ...filter,
            project_id: projectDetailsReducer.id,
            page: 1,
            limit: perPageLimit,
        };
        if(e.name === "category_id") {
            if (e.value === "category_id") {
                payload.category_id = payload.category_id === 1 ? 0 : 1;
                payload.sub_category_id = 0;
            } else {
                payload.sub_category_id = payload.sub_category_id === 1 ? 0 : 1;
                payload.category_id = 0;
            }
        }
    }

    const handleCreateClick = () => {
        navigate(`${baseUrl}/help/article/new`);
    };

    const onEdit = (record) => {
        navigate(`${baseUrl}/help/article/${record}?pageNo=${getPageNo}`)
    }

    const deleteRow = (id) => {
        setIdToDelete(id);
        setOpenDelete(true);
    }

    const handleDelete = async () => {
        setIsLoadingDelete(true)
        const data = await apiService.deleteArticles(idToDelete)
        const clone = [...articles];
        const index = clone.findIndex((x) => x.id == idToDelete)
        if (data.status === 200) {
            if (index !== -1) {
                clone.splice(index, 1)
                setArticles(clone);
            }
            toast({description: data.message,})
        } else {
            toast({description: data.message, variant: "destructive"})
        }
        setIsLoadingDelete(false)
        setOpenDelete(false);
    }

    const totalPages = Math.ceil(totalRecord / perPageLimit);

    const handlePaginationClick = async (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setIsLoading(true);
            setPageNo(newPage);
        } else {
            setIsLoading(false);
        }
    };

    const handleStatus = async (object, value) => {
        setArticles(articles.map(x => x.id === object.id ? {
            ...x,
            is_active: value,
        } : x));
        const payload = {
            ...object,
            is_active: value,
        }
        const data = await apiService.updateArticle(payload, object.id);
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

    return (
        <div className={"container xl:max-w-[1200px] lg:max-w-[992px] md:max-w-[768px] sm:max-w-[639px] pt-8 pb-5 px-3 md:px-4"}>

            {
                openDelete &&
                <DeleteDialog
                    title={"You really want to delete this Article?"}
                    isOpen={openDelete}
                    onOpenChange={() => setOpenDelete(false)}
                    onDelete={handleDelete}
                    isDeleteLoading={isLoadingDelete}
                    deleteRecord={idToDelete}
                />
            }

            <div className={"flex items-center justify-between flex-wrap gap-2"}>
                <div className={"flex flex-col flex-1 gap-y-0.5"}>
                    <h1 className="text-2xl font-normal flex-initial w-auto">All Articles ({totalRecord})</h1>
                    <p className={"text-sm text-muted-foreground"}>Create a self-service help center to save your team time and provide customers with the support they've been seeking.</p>
                </div>
                <div className={"w-full lg:w-auto flex sm:flex-nowrap flex-wrap gap-2 items-center"}>
                    <div className={"flex gap-2 items-center w-full lg:w-auto"}>
                        <div className={"w-full"}>
                        <Input
                            type="search"
                            placeholder="Search..."
                            className={"w-full pl-4 pr-14 text-sm font-normal h-9"}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        </div>
                        <div className={"flex items-center"}>
                        <Popover
                            open={openFilter}
                            onOpenChange={() => {
                                setOpenFilter(!openFilter);
                                setOpenFilterType('');
                            }}
                            className="w-full p-0"
                        >
                            <PopoverTrigger asChild>
                                <Button className={"h-9 w-9"} size={"icon"} variant="outline"><Filter fill="true" className='w-4 -h4' /></Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0" align='end'>
                                <Command className="w-full">
                                    <CommandInput placeholder="Search filter..."/>
                                    <CommandList className="w-full">
                                        <CommandEmpty>No filter found.</CommandEmpty>
                                        {
                                            openFilterType === 'category_id' ?
                                                <CommandGroup>
                                                    <CommandItem onSelect={() => {setOpenFilterType('')}} className={"p-0 flex gap-2 items-center cursor-pointer p-1"}>
                                                        <ChevronLeft className="mr-2 h-4 w-4" />
                                                        <span className={"flex-1 w-full text-sm font-normal cursor-pointer flex gap-2 items-center"}>
                                                                Back
                                                            </span>
                                                    </CommandItem>
                                                    {(initialFilter || []).map((x, i) => {
                                                        return (
                                                            <CommandItem key={i} value={x.value} className={"p-0 flex gap-1 items-center cursor-pointer"}>
                                                                <Checkbox className={'m-2'} checked={filter[x.value] === 1} onClick={() => {
                                                                    // handleChange({name: "status" , value: x.value});
                                                                    setOpenFilter(true);
                                                                    setOpenFilterType('category_id');
                                                                }}/>
                                                                <span onClick={() => {
                                                                    // handleChange({name: "status" , value: x.value});
                                                                    setOpenFilter(true);
                                                                    setOpenFilterType('category_id');
                                                                }} className={"flex-1 w-full text-sm font-normal cursor-pointer flex gap-2 items-center"}>{x.name}</span>
                                                            </CommandItem>
                                                        )
                                                    })}
                                                </CommandGroup> :
                                                <CommandGroup>
                                                    <CommandItem onSelect={() => {setOpenFilterType('category_id');}}>
                                                        <span className={"text-sm font-normal cursor-pointer"}>Category</span>
                                                    </CommandItem>
                                                    <CommandItem onSelect={() => {setOpenFilterType('sub_category_id');}}>
                                                        <span className={"text-sm font-normal cursor-pointer"}>Sub Category</span>
                                                    </CommandItem>
                                                </CommandGroup>
                                        }
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        </div>
                        </div>
                    <Button onClick={handleCreateClick} className={"gap-2 font-medium hover:bg-primary"}>
                        <Plus size={20} strokeWidth={3} />
                        <span className={"text-xs md:text-sm font-medium"}>New Article</span>
                    </Button>
                </div>
            </div>
            {
                filter.category_id === 1 &&
                <Badge key={`selected-${filter.category_id}`} variant="outline" className="rounded p-0 font-medium">
                    <span className="px-3 py-1.5 border-r">Category</span>
                    <span className="w-7 h-7 flex items-center justify-center cursor-pointer"
                        // onClick={() =>  handleChange({name: "status" , value: "archive"})}
                    >
                        <X className='w-4 h-4'/>
                    </span>
                </Badge>
            }
            <div className={"mt-6"}>
                <Card className={""}>
                    <CardContent className={"p-0 overflow-auto"}>
                        <Table>
                            <TableHeader className={`${theme === "dark" ? "" : "bg-muted"} py-8 px-5`}>
                                <TableRow>
                                    {["Title", "Category / Subcategory", "Status", "Seen", "Created At", ""].map((x, i) => (
                                        <TableHead className={`font-medium text-card-foreground px-2 py-[10px] md:px-3 ${i === 4 ? "max-w-[140px] truncate text-ellipsis overflow-hidden whitespace-nowrap" : ""}`} key={i}>{x}</TableHead>
                                    ))}
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
                                    ) : articles.length > 0 ? <Fragment>
                                        {
                                            articles.map((x, index) => (<>
                                                {console.log(x?.is_active)}
                                                <TableRow key={index}>
                                                    <TableCell onClick={() => onEdit(x.id)}
                                                        className={"px-2 py-[10px] md:px-3 font-normal cursor-pointer max-w-[270px] truncate text-ellipsis overflow-hidden whitespace-nowrap"}>{x.title}</TableCell>
                                                    <TableCell
                                                        className={"px-2 py-[10px] md:px-3 font-normal max-w-[270px] truncate text-ellipsis overflow-hidden whitespace-nowrap"}>{x?.category_title} / {x?.sub_category_title}</TableCell>
                                                    <TableCell className={"px-2 py-[10px] md:px-3 font-normal"}>
                                                        <Select value={x.is_active}  onValueChange={(value) => handleStatus(x, value)}>
                                                            <SelectTrigger className="w-[137px] h-7">
                                                                <SelectValue
                                                                    placeholder={x.is_active ? status.find(s => s.value == x.is_active)?.name : "Publish"}/>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    {
                                                                        (status || []).map((x, i) => {
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
                                                    <TableCell className={"px-2 py-[10px] md:px-3 font-normal"}>{x.view}</TableCell>
                                                    <TableCell className={"px-2 py-[10px] md:px-3 font-normal max-w-[140px] truncate text-ellipsis overflow-hidden whitespace-nowrap"}>
                                                        {x?.updated_at ? moment.utc(x?.updated_at).local().startOf('seconds').fromNow() : "-"}
                                                    </TableCell>
                                                    <TableCell className={"px-2 py-[10px] md:px-3 font-normal"}>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger>
                                                                <Ellipsis size={16}/>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align={"end"}>
                                                                <DropdownMenuItem onClick={() => onEdit(x.id)}>Edit</DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => deleteRow(x.id)}>Delete</DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                                </>
                                            ))
                                        }
                                    </Fragment> : <TableRow>
                                        <TableCell colSpan={6}>
                                            <EmptyData/>
                                        </TableCell>
                                    </TableRow>
                                }
                            </TableBody>
                        </Table>
                    </CardContent>
                    {
                        articles.length > 0 ?
                            <Pagination
                                pageNo={pageNo}
                                totalPages={totalPages}
                                isLoading={isLoading}
                                handlePaginationClick={handlePaginationClick}
                                stateLength={articles.length}
                            /> : ""
                    }
                </Card>
            </div>
        </div>
    );
};

export default Articles;