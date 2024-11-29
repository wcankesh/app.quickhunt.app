import React, {Fragment, useEffect, useRef, useState} from 'react';
import { Input } from "../../ui/input";
import { Select, SelectGroup, SelectValue, SelectItem, SelectTrigger, SelectContent } from "../../ui/select";
import {Check, Circle, Ellipsis, Filter, Plus, X} from "lucide-react";
import { Button } from "../../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import {Card, CardContent} from "../../ui/card";
import { useTheme } from "../../theme-provider";
import {DropdownMenu, DropdownMenuPortal, DropdownMenuSub, DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";
import {DropdownMenuContent, DropdownMenuItem, DropdownMenuSubContent, DropdownMenuSubTrigger} from "../../ui/dropdown-menu";
import {useNavigate} from "react-router-dom";
import {baseUrl} from "../../../utils/constent";
import moment from "moment";
import {ApiService} from "../../../utils/ApiService";
import {useSelector} from "react-redux";
import {useToast} from "../../ui/use-toast";
import {Skeleton} from "../../ui/skeleton";
import EmptyData from "../../Comman/EmptyData";
import {Badge} from "../../ui/badge";
import Pagination from "../../Comman/Pagination";
import DeleteDialog from "../../Comman/DeleteDialog";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "../../ui/command";
import { debounce } from 'lodash';

const status = [
    {name: "Publish", value: 1, fillColor: "#389E0D", strokeColor: "#389E0D",},
    {name: "Draft", value: 0, fillColor: "#CF1322", strokeColor: "#CF1322",},
];

const perPageLimit = 10

const Articles = () => {
    const apiService = new ApiService();
    const {theme} = useTheme();
    const {toast} = useToast();
    const navigate = useNavigate();
    const UrlParams = new URLSearchParams(location.search);
    const getPageNo = UrlParams.get("pageNo") || 1;
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const timeoutHandler = useRef(null);

    const [filter, setFilter] = useState({
        search: "",
        category_id: "",
        sub_category_id: ""
    });
    const [articles, setArticles] = useState([]);
    const [articleList, setArticleList] = useState([]);
    const [totalRecord, setTotalRecord] = useState(0);
    const [pageNo, setPageNo] = useState(Number(getPageNo));
    const [idToDelete, setIdToDelete] = useState(null);
    const [openDelete,setOpenDelete]=useState(false);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [openFilter, setOpenFilter] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);

    useEffect(() => {
        if (projectDetailsReducer.id) {
            getAllArticles(filter.search, filter.category_id, filter.sub_category_id);
            getAllCategory();
        }
        navigate(`${baseUrl}/help/article?pageNo=${pageNo}`);
    }, [projectDetailsReducer.id, pageNo])

    const getAllArticles = async (search, category_id, sub_category_id) => {
        setIsLoading(true)
        const data = await apiService.getAllArticles({
            project_id: projectDetailsReducer.id,
            search: search,
            category_id: category_id,
            sub_category_id: sub_category_id,
            page: pageNo,
            limit: perPageLimit
        });
        if (data.status === 200) {
            setArticles(data.data);
            setTotalRecord(data.total);
        }
        setIsLoading(false)
    };

    const getAllCategory = async () => {
        // setIsLoading(true);
        const data = await apiService.getAllCategory({
            project_id: projectDetailsReducer.id,
        });
        if (data.status === 200) {
            setArticleList(data.data);
        }
        setIsLoading(false)
    };

    // const onChangeSearch = async (event) => {
    //     setFilter({...filter, [event.target.name]: event.target.value,})
    //     if (timeoutHandler.current) {
    //         clearTimeout(timeoutHandler.current);
    //     }
    //     timeoutHandler.current = setTimeout(() => {
    //         setPageNo(1);
    //         getAllArticles(event.target.value, '');
    //     }, 2000);
    // }

    const debounceGetAllArticles = debounce((searchValue) => {
        setPageNo(1);
        getAllArticles(searchValue, filter.category_id, filter.sub_category_id);
    }, 500);

    const onChangeSearch = (event) => {
        const value = event.target.value;
        setFilter((prev) => ({ ...prev, search: value }));
        debounceGetAllArticles(value);
    };

    const filterData = (name, value) => {
        setFilter(prevFilter => ({
            ...prevFilter,
            [name]: value
        }));

        let category_id = '';
        let sub_category_id = '';

        if (name === "category_id") {
            category_id = value;
            setSelectedCategory({ id: value, title: articleList.find(x => x.id === value)?.title || 'Unknown' });
        } else if (name === 'sub_category_id') {
            sub_category_id = value;
            const subCategory = articleList.flatMap(x => x.sub_categories).find(y => y.id === value);
            setSelectedSubCategory({ id: value, title: subCategory?.title || 'Unknown' });
        }

        setOpenFilter(false)
        setPageNo(1);
        getAllArticles(filter.search, category_id, sub_category_id);
    };

    const clearSearchFilter = () => {
        setFilter(prev => ({ ...prev, search: '' }));
        setPageNo(1);
        getAllArticles('', filter.category_id, filter.sub_category_id);
    };

    const clearFilter = (key, setSelected) => {
        setSelected(null);
        setFilter(prev => ({ ...prev, [key]: null }));
        setPageNo(1);
        getAllArticles(filter.search, key === "category_id" ? null : filter.category_id, key === "sub_category_id" ? null : filter.sub_category_id);
    };

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
                if (clone.length === 0 && pageNo > 1) {
                    handlePaginationClick(pageNo - 1);
                } else {
                    getAllArticles();
                }
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
                        <div className={"relative w-full"}>
                        <Input
                            type="search" value={filter.search}
                            placeholder="Search..."
                            className={"w-full pl-4 pr-14 text-sm font-normal h-9"}
                            name={"search"}
                            onChange={onChangeSearch}
                        />
                            {filter.search.trim() !== '' && (
                                <button
                                    type="button"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600"
                                    onClick={clearSearchFilter}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <div className={"flex items-center"}>
                            <DropdownMenu open={openFilter} onOpenChange={setOpenFilter}>
                                <DropdownMenuTrigger asChild>
                                    <Button className="h-9 w-9" size="icon" variant="outline">
                                        <Filter fill="true" className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>Category</DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <Command>
                                                    <CommandInput placeholder="Search..." />
                                                    <CommandList>
                                                        <CommandEmpty>No data found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {(articleList || []).map((x) => (
                                                                <CommandItem
                                                                    key={x.id}
                                                                    value={x.id}
                                                                >
                                                                    <Fragment key={x.id}>
                                                                        <span onClick={() => {
                                                                            setSelectedCategoryId(x.id);
                                                                            filterData("category_id", x.id);
                                                                            setOpenFilter(false);
                                                                        }}
                                                                            className={"flex-1 w-full text-sm font-normal cursor-pointer flex gap-2 items-center"}
                                                                        >
                                                                            {selectedCategoryId === x.id ? <Check size={18} /> : <div className={"h-[18px] w-[18px]"}/>}
                                                                            <span className={"max-w-[140px] truncate text-ellipsis overflow-hidden whitespace-nowrap"}>{x.title}</span>
                                                                        </span>
                                                                    </Fragment>
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>Sub Category</DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <Command>
                                                    <CommandInput placeholder="Search..." />
                                                    <CommandList>
                                                        <CommandEmpty>No data found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {(articleList || []).map((x) => (
                                                                x.sub_categories.map((y) => (
                                                                    <CommandItem
                                                                        key={y.id}
                                                                        value={y.id}
                                                                        onSelect={() => {
                                                                            setSelectedSubCategoryId(y.id);
                                                                            filterData("sub_category_id", y.id);
                                                                            setOpenFilter(false);
                                                                        }}
                                                                    >
                                                                        <Fragment key={y.id}>
                                                                            <span
                                                                                className={"flex-1 w-full text-sm font-normal cursor-pointer flex gap-2 items-center"}
                                                                            >
                                                                                {selectedSubCategoryId === y.id ? <Check size={18} /> : <div className={"h-[18px] w-[18px]"}/>}
                                                                                <span className={"max-w-[140px] truncate text-ellipsis overflow-hidden whitespace-nowrap"}>{y.title}</span>
                                                                            </span>
                                                                        </Fragment>
                                                                    </CommandItem>
                                                                ))))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        </div>
                    <Button onClick={handleCreateClick} className={"gap-2 font-medium hover:bg-primary"}>
                        <Plus size={20} strokeWidth={3} />
                        <span className={"text-xs md:text-sm font-medium"}>New Article</span>
                    </Button>
                </div>
            </div>
            <div className="mt-4 flex gap-4">
                {selectedCategory && (
                    <Badge key={`selected-${selectedCategory.id}`} variant="outline" className="rounded p-0 font-medium">
                        <span className="px-3 py-1.5 border-r">{selectedCategory.title}</span>
                        <span
                            className="w-7 h-7 flex items-center justify-center cursor-pointer"
                            onClick={() => clearFilter("category_id", setSelectedCategory)}
                        >
                        <X className='w-4 h-4'/>
                    </span>
                    </Badge>
                )}
                {selectedSubCategory && (
                    <Badge key={`selected-${selectedSubCategory.id}`} variant="outline" className="rounded p-0 font-medium">
                        <span className="px-3 py-1.5 border-r">{selectedSubCategory.title}</span>
                        <span
                            className="w-7 h-7 flex items-center justify-center cursor-pointer"
                            onClick={() => clearFilter("sub_category_id", setSelectedSubCategory)}
                        >
                        <X className='w-4 h-4'/>
                    </span>
                    </Badge>
                )}
            </div>
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
                                                                <DropdownMenuItem className={"cursor-pointer"} onClick={() => onEdit(x.id)}>Edit</DropdownMenuItem>
                                                                <DropdownMenuItem className={"cursor-pointer"}
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