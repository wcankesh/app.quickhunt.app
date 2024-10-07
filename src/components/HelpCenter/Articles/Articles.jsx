import React, {Fragment, useEffect, useState} from 'react';
import { Input } from "../../ui/input";
import { Select, SelectGroup, SelectValue, SelectLabel, SelectItem, SelectTrigger, SelectContent } from "../../ui/select";
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Circle,
    Ellipsis,
    Filter,
    Loader2,
    Plus,
    X
} from "lucide-react";
import { Button } from "../../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import {Card, CardContent, CardFooter} from "../../ui/card";
import { useTheme } from "../../theme-provider";
import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuItem } from "../../ui/dropdown-menu";
import {useNavigate, useParams} from "react-router-dom";
import { baseUrl } from "../../../utils/constent";
import moment from "moment";
import {ApiService} from "../../../utils/ApiService";
import {useSelector} from "react-redux";
import {useToast} from "../../ui/use-toast";
import {Skeleton} from "../../ui/skeleton";
import EmptyData from "../../Comman/EmptyData";
import {Dialog} from "@radix-ui/react-dialog";
import {DialogContent, DialogDescription, DialogHeader, DialogTitle} from "../../ui/dialog";
import {Popover, PopoverContent, PopoverTrigger} from "../../ui/popover";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "../../ui/command";
import {Checkbox} from "../../ui/checkbox";
import {Badge} from "../../ui/badge";

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
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const {theme} = useTheme();
    const {toast} = useToast();
    const navigate = useNavigate();
    const UrlParams = new URLSearchParams(location.search);
    const getPageNo = UrlParams.get("pageNo") || 1;

    const [isLoading, setIsLoading] = useState(true);
    const [articles, setArticles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [idToDelete, setIdToDelete] = useState(null);
    const [openDelete,setOpenDelete]=useState(false);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);
    const [pageNo, setPageNo] = useState(Number(getPageNo));
    const [totalRecord, setTotalRecord] = useState(0);
    const [filter, setFilter] = useState(initialFilter);
    const [openFilter, setOpenFilter] = useState('');
    const [openFilterType, setOpenFilterType] = useState('');

    console.log("articles", articles)

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
        navigate(`${baseUrl}/help/article/${record}`)
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

    return (
        <div className={"container xl:max-w-[1200px] lg:max-w-[992px] md:max-w-[768px] sm:max-w-[639px] pt-8 pb-5 px-3 md:px-4"}>

            {
                openDelete &&
                <Fragment>
                    <Dialog open onOpenChange={()=> setOpenDelete(false)}>
                        <DialogContent className="w-[310px] md:w-full rounded-lg">
                            <DialogHeader className={"flex flex-row justify-between gap-2"}>
                                <div className={"flex flex-col gap-2"}>
                                    <DialogTitle className={"text-start font-medium"}>You really want delete this article ?</DialogTitle>
                                    <DialogDescription className={"text-start"}>This action can't be undone.</DialogDescription>
                                </div>
                                <X size={16} className={"m-0 cursor-pointer"} onClick={() => setOpenDelete(false)}/>
                            </DialogHeader>
                            <div className={"flex justify-end gap-2"}>
                                <Button variant={"outline hover:none"}
                                        className={"text-sm font-medium border"}
                                        onClick={() => setOpenDelete(false)}>Cancel</Button>
                                <Button
                                    variant={"hover:bg-destructive"}
                                    className={`${theme === "dark" ? "text-card-foreground" : "text-card"} w-[76px] text-sm font-medium bg-destructive`}
                                    onClick={handleDelete}
                                >
                                    {isLoadingDelete ? <Loader2 size={16} className={"animate-spin"}/> : "Delete"}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </Fragment>
            }

            <div className={"flex justify-between items-center flex-wrap gap-3"}>
                <h4 className={"font-normal text-lg sm:text-2xl"}>All Articles</h4>
                <div className={"flex flex-wrap gap-3"}>
                    <div className={"flex flex-wrap md:flex-nowrap gap-3"}>
                        <Input
                            type="search"
                            placeholder="Search..."
                            className={"pl-4 pr-4 text-sm font-normal h-9 min-w-[352px] w-full"}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Popover
                            open={openFilter}
                            onOpenChange={() => {
                                setOpenFilter(!openFilter);
                                setOpenFilterType('');
                            }}
                            className="w-full p-0"
                        >
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="icon" className={"w-9 h-9 "}><Filter fill="true" className='w-4 -h4' /></Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0" align='end'>
                                <Command className="w-full">
                                    <CommandInput placeholder="Search filter..."/>
                                    <CommandList className="w-full">
                                        <CommandEmpty>No filter found.</CommandEmpty>
                                        {
                                            openFilterType === 'category_id' ?
                                                <CommandGroup>
                                                    <CommandItem  className={"p-0 flex gap-2 items-center cursor-pointer p-1"}>
                                                        <ChevronLeft className="mr-2 h-4 w-4" />
                                                        <span
                                                            onClick={() => {
                                                                setOpenFilterType('');
                                                            }}
                                                            className={"flex-1 w-full text-sm font-normal cursor-pointer flex gap-2 items-center"}
                                                        >
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
                    <Button size="sm" onClick={handleCreateClick} className={"gap-2 font-medium hover:bg-primary"}>
                        <Plus size={20} strokeWidth={3} /> New Article
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
                    <CardContent className={"p-0"}>
                        <Table>
                            <TableHeader className={`${theme === "dark" ? "" : "bg-muted"} py-8 px-5`}>
                                <TableRow>
                                    {["Title", "Category / Subcategory", "Status", "Seen", "Created At", ""].map((x, i) => (
                                        <TableHead className={`font-medium text-card-foreground px-2 py-[10px] md:px-3`} key={i}>{x}</TableHead>
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
                                            articles.map((x, index) => (
                                                <TableRow key={index}>
                                                    <TableCell
                                                        className={"px-2 py-[10px] md:px-3 font-normal"}>{x.title}</TableCell>
                                                    <TableCell
                                                        className={"px-2 py-[10px] md:px-3 font-normal"}>{x?.category_title} / {x?.sub_category_title}</TableCell>
                                                    <TableCell className={"px-2 py-[10px] md:px-3 font-normal"}>
                                                        <Select value={x.is_active}>
                                                            <SelectTrigger className="w-[137px] h-7">
                                                                <SelectValue
                                                                    placeholder={"Publish"}/>
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
                                                    <TableCell
                                                        className={"px-2 py-[10px] md:px-3 font-normal"}>{x.view}</TableCell>
                                                    <TableCell className={"px-2 py-[10px] md:px-3 font-normal"}>
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
                            <CardFooter className={`p-0`}>
                                <div className={`w-full ${theme === "dark" ? "" : "bg-muted"} rounded-b-lg rounded-t-none flex justify-end p-2 md:px-3 md:py-[10px]`}>
                                    <div className={"w-full flex gap-2 items-center justify-between sm:justify-end"}>
                                        <div>
                                            <h5 className={"text-sm font-medium"}>Page {articles.length <= 0 ? 0 :pageNo} of {totalPages}</h5>
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
                                                    disabled={pageNo === totalPages || isLoading || articles.length <= 0}>
                                                <ChevronRight
                                                    className={pageNo === totalPages || isLoading || articles.length <= 0 ? "stroke-muted-foreground" : "stroke-primary"} />
                                            </Button>
                                            <Button variant={"outline"} className={"h-[30px] w-[30px] p-1.5"}
                                                    onClick={() => handlePaginationClick(totalPages)}
                                                    disabled={pageNo === totalPages || isLoading || articles.length <= 0}>
                                                <ChevronsRight
                                                    className={pageNo === totalPages || isLoading || articles.length <= 0 ? "stroke-muted-foreground" : "stroke-primary"} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardFooter> : ""
                    }
                </Card>
            </div>
        </div>
    );
};

export default Articles;
