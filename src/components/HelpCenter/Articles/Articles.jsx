import React, {Fragment, useCallback, useEffect, useState} from 'react';
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "../../ui/select";
import {Check, Circle, Ellipsis, Filter, Plus, X} from "lucide-react";
import {Button} from "../../ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../ui/table";
import {Card, CardContent} from "../../ui/card";
import {useTheme} from "../../theme-provider";
import {DropdownMenu, DropdownMenuPortal, DropdownMenuSub, DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";
import {DropdownMenuContent, DropdownMenuItem, DropdownMenuSubContent, DropdownMenuSubTrigger} from "../../ui/dropdown-menu";
import {useNavigate} from "react-router-dom";
import {apiService, baseUrl} from "../../../utils/constent";
import moment from "moment";
import {useSelector} from "react-redux";
import {useToast} from "../../ui/use-toast";
import {Skeleton} from "../../ui/skeleton";
import EmptyData from "../../Comman/EmptyData";
import {Badge} from "../../ui/badge";
import Pagination from "../../Comman/Pagination";
import DeleteDialog from "../../Comman/DeleteDialog";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "../../ui/command";
import {debounce} from 'lodash';
import {EmptyDataContent} from "../../Comman/EmptyDataContent";
import {CommSearchBar} from "../../Comman/CommentEditor";
import {EmptyInArticlesContent} from "../../Comman/EmptyContentForModule";

const status = [
    {name: "Publish", value: 1, fillColor: "#389E0D", strokeColor: "#389E0D",},
    {name: "Draft", value: 0, fillColor: "#CF1322", strokeColor: "#CF1322",},
];

const perPageLimit = 10

const Articles = () => {
    const {theme} = useTheme();
    const {toast} = useToast();
    const navigate = useNavigate();
    const UrlParams = new URLSearchParams(location.search);
    const getPageNo = UrlParams.get("pageNo") || 1;
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);

    const [filter, setFilter] = useState({
        search: "",
        categoryId: "",
        subcategoryId: ""
    });
    const [articles, setArticles] = useState([]);
    const [articleList, setArticleList] = useState([]);
    const [totalRecord, setTotalRecord] = useState(0);
    const [pageNo, setPageNo] = useState(Number(getPageNo));
    const [idToDelete, setIdToDelete] = useState(null);
    const [openDelete,setOpenDelete]=useState(false);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [openFilter, setOpenFilter] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const [emptyContentBlock, setEmptyContentBlock] = useState(true);

    const emptyContent = (status) => {setEmptyContentBlock(status);};

    useEffect(() => {
        if (projectDetailsReducer.id) {
            getAllArticles(filter.search);
            getAllCategory();
        }
        navigate(`${baseUrl}/help/article?pageNo=${pageNo}`);
    }, [projectDetailsReducer.id, pageNo])

    const getAllArticles = async (search, categoryId, subCategoryId) => {
        const params = {
            projectId: projectDetailsReducer.id,
            page: pageNo,
            limit: perPageLimit
        };

        if (search !== undefined && search !== "") params.search = search;
        if (categoryId !== undefined && categoryId !== "") params.categoryId = categoryId;
        if (subCategoryId !== undefined && subCategoryId !== "") params.subCategoryId = subCategoryId;

        const data = await apiService.getAllArticles(params);
        if (data.success) {
            setArticles(data?.data?.formattedData);
            setTotalRecord(data.data.total);
            setIsLoading(false)
            if (!data?.data?.formattedData || data?.data?.formattedData.length === 0) {
                emptyContent(true);
            } else {
                emptyContent(false);
            }
        } else {
            setIsLoading(false)
            emptyContent(true);
        }
    };

    const getAllCategory = async () => {
        // setIsLoading(true);
        const data = await apiService.getAllCategory({
            projectId: projectDetailsReducer.id,
        });
        if (data.success) {
            setArticleList(data.data);
            setIsLoading(false)
            if (!data.data.rows || data.data.rows.length === 0) {
                emptyContent(true);
            } else {
                setIsLoading(false)
                emptyContent(false);
            }
        }
    };

    const throttledDebouncedSearch = useCallback(
        debounce((value) => {
            getAllArticles(value, filter.categoryId, filter.subcategoryId);
        }, 500),
        [projectDetailsReducer.id, filter.categoryId, filter.subcategoryId]
    );

    const onChangeSearch = (e) => {
        const value = e.target.value;
        setFilter({ ...filter, search: value });
        throttledDebouncedSearch(value);
    };

    const filterData = (name, value) => {
        let updatedFilter = { ...filter };

        if (name === "categoryId") {
            updatedFilter.categoryId = value;
            const category = articleList.rows.find(x => x.id === value);
            setSelectedCategory(category ? { id: value, title: category.title } : null);
        } else if (name === "subcategoryId") {
            updatedFilter.subcategoryId = value;
            const subCategory = articleList.rows
                .flatMap(x => x.subCategories)
                .find(y => y.id === value);
            setSelectedSubCategory(subCategory ? { id: value, title: subCategory.title } : null);
        }

        setFilter(updatedFilter);
        setOpenFilter(false);
        setPageNo(1);
        getAllArticles(updatedFilter.search, updatedFilter.categoryId, updatedFilter.subcategoryId);
    };

    const clearSearchFilter = () => {
        setFilter(prev => ({ ...prev, search: '' }));
        setPageNo(1);
        getAllArticles('', filter.categoryId, filter.subcategoryId);
    };

    const clearCategoryFilter = () => {
        setSelectedCategory(null);
        setFilter(prev => ({
            ...prev,
            categoryId: "",
        }));
        setPageNo(1);
        getAllArticles(filter.search, "", filter.subcategoryId);
    };

    const clearSubCategoryFilter = () => {
        setSelectedSubCategory(null);
        setFilter(prev => ({ ...prev, subcategoryId: "" }));
        setPageNo(1);
        getAllArticles(filter.search, filter.categoryId, "");
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
        if (data.success) {
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
            toast({description: data.error.message, variant: "destructive"})
        }
        setIsLoadingDelete(false)
        setOpenDelete(false);
    }

    const totalPages = Math.ceil(totalRecord / perPageLimit);

    const handlePaginationClick = async (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPageNo(newPage);
            setIsLoading(false);
        }
    };

    const handleStatus = async (object, value) => {
        setArticles(articles.map(x => x.id === object.id ? {
            ...x,
            isActive: value,
        } : x));
        const payload = {
            ...object,
            isActive: value,
        }
        const data = await apiService.updateArticle(payload, object.id);
        if (data.success) {
            toast({description: data.message,});
        } else {
            toast({description: data.error.message, variant: "destructive",});
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
                        <CommSearchBar
                            value={filter.search}
                            onChange={onChangeSearch}
                            onClear={clearSearchFilter}
                            placeholder="Search..."
                            inputClassName={"min-w-[224px] pr-[34px]"}
                        />
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
                                                            {(articleList || [])?.rows?.map((x, l) => (
                                                                <CommandItem
                                                                    key={l}
                                                                    value={x.id}
                                                                >
                                                                    <Fragment key={x.id}>
                                                                        <span onClick={() => {
                                                                            filterData("categoryId", x.id);
                                                                            setOpenFilter(false);
                                                                        }}
                                                                            className={"flex-1 w-full text-sm font-normal cursor-pointer flex gap-2 items-center"}
                                                                        >
                                                                            {filter.categoryId === x.id ? <Check size={18} /> : <div className={"h-[18px] w-[18px]"}/>}
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
                                                            {(articleList || [])?.rows?.map((x) => (
                                                                x.subCategories.map((y, u) => (
                                                                    <CommandItem
                                                                        key={u}
                                                                        value={y.id}
                                                                        onSelect={() => {
                                                                            filterData("subcategoryId", y.id);
                                                                            setOpenFilter(false);
                                                                        }}
                                                                    >
                                                                        <Fragment key={y.id}>
                                                                            <span
                                                                                className={"flex-1 w-full text-sm font-normal cursor-pointer flex gap-2 items-center"}
                                                                            >
                                                                                {filter.subcategoryId === y.id ? <Check size={18} /> : <div className={"h-[18px] w-[18px]"}/>}
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
            {
                ( selectedCategory || selectedSubCategory ) && (
                    <div className="mt-4 flex gap-4">
                        {selectedCategory && (
                            <Badge key={`selected-${selectedCategory.id}`} variant="outline" className="rounded p-0 font-medium">
                                <span className="px-3 py-1.5 border-r">{selectedCategory.title}</span>
                                <span
                                    className="w-7 h-7 flex items-center justify-center cursor-pointer"
                                    onClick={clearCategoryFilter}
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
                                    onClick={clearSubCategoryFilter}
                                >
                        <X className='w-4 h-4'/>
                    </span>
                            </Badge>
                        )}
                    </div>
                )
            }
            <div className={"my-6"}>
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
                                                                <TableCell key={i}
                                                                    className={"max-w-[373px] px-2 py-[10px] md:px-3"}>
                                                                    <Skeleton className={"rounded-md  w-full h-7"}/>
                                                                </TableCell>
                                                            )
                                                        })
                                                    }
                                                </TableRow>
                                            )
                                        })
                                    ) : articles?.length > 0 ? <Fragment>
                                        {
                                            (articles || [])?.map((x, index) => (<>
                                                <TableRow key={index}>
                                                    <TableCell onClick={() => onEdit(x.id)}
                                                        className={"px-2 py-[10px] md:px-3 font-normal cursor-pointer max-w-[270px] truncate text-ellipsis overflow-hidden whitespace-nowrap"}>{x.title}</TableCell>
                                                    <TableCell
                                                        className={"px-2 py-[10px] md:px-3 font-normal max-w-[270px] truncate text-ellipsis overflow-hidden whitespace-nowrap"}>{x?.categoryTitle} / {x?.subCategoryTitle}</TableCell>
                                                    <TableCell className={"px-2 py-[10px] md:px-3 font-normal"}>
                                                        <Select value={x.isActive}  onValueChange={(value) => handleStatus(x, value)}>
                                                            <SelectTrigger className="w-[137px] h-7">
                                                                <SelectValue
                                                                    placeholder={x.isActive ? status.find(s => s.value == x.isActive)?.name : "Publish"}/>
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
                                                    <TableCell className={"px-2 py-[10px] md:px-3 font-normal"}>{x.view ? x.view : 0}</TableCell>
                                                    <TableCell className={"px-2 py-[10px] md:px-3 font-normal max-w-[140px] truncate text-ellipsis overflow-hidden whitespace-nowrap"}>
                                                        {x?.updatedAt ? moment.utc(x?.updatedAt).local().startOf('seconds').fromNow() : "-"}
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
                        articles?.length > 0 ?
                            <Pagination
                                pageNo={pageNo}
                                totalPages={totalPages}
                                isLoading={isLoading}
                                handlePaginationClick={handlePaginationClick}
                                stateLength={articles?.length}
                            /> : ""
                    }
                </Card>
            </div>
            {
                (isLoading || !emptyContentBlock || filter) ? "" :
                    <EmptyDataContent data={EmptyInArticlesContent} onClose={() => emptyContent(false)} setSheetOpenCreate={handleCreateClick}/>
            }
        </div>
    );
};

export default Articles;