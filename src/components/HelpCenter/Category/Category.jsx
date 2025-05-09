import React, {Fragment, useEffect, useCallback, useState} from 'react';
import {Button} from "../../ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../ui/table";
import {Card, CardContent} from "../../ui/card";
import {DropdownMenu, DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";
import {DropdownMenuContent, DropdownMenuItem} from "../../ui/dropdown-menu";
import {Ellipsis, Plus, X} from "lucide-react";
import {Sheet, SheetContent, SheetHeader} from "../../ui/sheet";
import moment from 'moment';
import {useToast} from "../../ui/use-toast";
import {useTheme} from "../../theme-provider";
import {useSelector} from "react-redux";
import {Skeleton} from "../../ui/skeleton";
import EmptyData from "../../Comman/EmptyData";
import {apiService, baseUrl} from "../../../utils/constent";
import {useNavigate} from "react-router";
import Pagination from "../../Comman/Pagination";
import DeleteDialog from "../../Comman/DeleteDialog";
import {debounce} from "lodash";
import {EmptyDataContent} from "../../Comman/EmptyDataContent";
import CategoryForm from "../../Comman/CategoryForm";
import {CommSearchBar} from "../../Comman/CommentEditor";
import {EmptyInCategoryContent} from "../../Comman/EmptyContentForModule";
import {DialogTitle} from "../../ui/dialog";

const initialState = {
    title: "",
    description: "",
    createdAt: moment().fromNow(),
    image: "",
    deleteImage: ""
};

const initialStateError = {
    title: "",
    description: "",
}

const perPageLimit = 10

const Category = () => {
    const {theme} = useTheme();
    const {toast} = useToast();
    const navigate = useNavigate();
    const UrlParams = new URLSearchParams(location.search);
    const getPageNo = UrlParams.get("pageNo") || 1;
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);

    const [formError, setFormError] = useState(initialStateError);
    const [selectedCategory, setSelectedCategory] = useState(initialState);
    const [selectedSubCategory, setSelectedSubCategory] = useState(initialState);
    const [categoryList, setCategoryList] = useState([]);
    const [subCategoryId,setSubCategoryId] = useState("")
    const [pageNo, setPageNo] = useState(Number(getPageNo));
    const [totalRecord, setTotalRecord] = useState(0);
    const [isSheetOpen, setSheetOpen] = useState(false);
    const [isSheetOpenSub, setSheetOpenSub] = useState(false);
    const [categoryEdit, setCategoryEdit] = useState(false);
    const [subCategoryEdit, setSubCategoryEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [openDelete,setOpenDelete]=useState(false);
    const [openSubDelete,setOpenSubDelete]=useState(false);
    const [idToDelete, setIdToDelete] = useState(null);
    const [subIdToDelete, setSubIdToDelete] = useState(null);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);
    const [filter, setFilter] = useState({search: "", categoryId: "", subCategoryId: ""});
    const [emptyContentBlock, setEmptyContentBlock] = useState(true);

    const emptyContent = (status) => {setEmptyContentBlock(status);};

    useEffect(() => {
        if(projectDetailsReducer.id){
            // getAllCategory(filter.search, filter.categoryId, filter.subCategoryId);
            getAllCategory(filter.search);
        }
        navigate(`${baseUrl}/help/category?pageNo=${pageNo}`);
    }, [projectDetailsReducer.id, pageNo])

    const getAllCategory = async (search) => {
        const data = await apiService.getAllCategory({
            projectId: projectDetailsReducer.id,
            search: search,
            page: pageNo,
            limit: perPageLimit,
        });
        if (data.success) {
            setCategoryList(data.data);
            setTotalRecord(data.data.total);
            setIsLoading(false)
            if (!data.data.rows || data.data.rows.length === 0) {
                emptyContent(true);
            } else {
                emptyContent(false);
            }
        } else {
            setIsLoading(false)
            emptyContent(true);
        }
    };

    const throttledDebouncedSearch = useCallback(
        debounce((value) => {
            getAllCategory(value, filter.categoryId, filter.subCategoryId);
        }, 500),
        [projectDetailsReducer.id]
    );

    const onChangeSearch = (e) => {
        const value = e.target.value;
        setFilter({ ...filter, search: value });
        throttledDebouncedSearch(value);
    };

    const clearSearchFilter = () => {
        setFilter(prev => ({ ...prev, search: '' }));
        setPageNo(1);
        setIsLoading(true);
        getAllCategory('').then(() => {
            setIsLoading(false);
        });
    };

    const formValidate = (name, value) => {
        switch (name) {
            case "title":
                if (!value || value.trim() === "") {
                    return "Name is required";
                } else {
                    return "";
                }
            case "description":
                const cleanValue = value.trim();
                const emptyContent = /^(<p>\s*<\/p>|<p><br><\/p>|<\/?[^>]+>)*$/;
                if (!value || cleanValue === "" || emptyContent.test(cleanValue)) {
                    return "Description is required.";
                } else {
                    return "";
                }
            default: {
                return "";
            }
        }
    };

    const addCategory = async () => {
        let validationErrors = {};
        Object.keys(selectedCategory).forEach(name => {
            const error = formValidate(name, selectedCategory[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
            return;
        }
        setCategoryEdit(true)
        let formData = new FormData();
        formData.append('projectId', projectDetailsReducer.id);
        formData.append('title', selectedCategory.title);
        formData.append('description', selectedCategory.description);
        formData.append(`image`, selectedCategory.image);
        
        const data = await apiService.createCategory(formData);
        if(data.success) {
            setSelectedCategory(initialState);
            let clone = [...categoryList.rows];
            clone.unshift(data.data);
            setCategoryList(clone);
            toast({description: data.message,});
        } else {
            toast({description: data?.error.message, variant: "destructive",})
        }
        setCategoryEdit(false)
        closeSheetCategory();
    };

    const addSubCategory = async () => {
        let validationErrors = {};
        Object.keys(selectedSubCategory).forEach(name => {
            const error = formValidate(name, selectedSubCategory[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
            return;
        }
        setSubCategoryEdit(true)
        let formData = new FormData();
        formData.append('projectId', projectDetailsReducer.id);
        formData.append('categoryId', subCategoryId);
        formData.append('title', selectedSubCategory.title);
        formData.append('description', selectedSubCategory.description);
        formData.append(`image`, selectedSubCategory.image);
        const data = await apiService.createSubCategory(formData);
        if (data.success) {
            let clone = [...categoryList.rows];
            const index = clone.findIndex((x) => x.id === subCategoryId);
            if (index !== -1) {
                const updatedSubCategories = [
                    ...(clone[index].subCategories || []),
                    data.data
                ];
                clone[index] = {
                    ...clone[index],
                    subCategories: updatedSubCategories
                };
                setCategoryList({ ...categoryList, rows: clone });
            }

            setSelectedSubCategory(initialState)
            toast({description: data.message});
            closeSheetSubCategory()
        } else {
            toast({description: data?.error.message, variant: "destructive",});
        }
        setSubCategoryEdit(false);
    };

    const updateCategory = async (name, value) => {

        let validationErrors = {};
        Object.keys(selectedCategory).forEach(name => {
            const error = formValidate(name, selectedCategory[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
            return;
        }
        if (name === "deleteImage") {
            setSelectedCategory({...selectedCategory, image: ""})
        } else {
            setSelectedCategory({...selectedCategory, [name]: value})
        }
        setCategoryEdit(true)
        let formData = new FormData();
        formData.append('projectId', projectDetailsReducer.id);
        formData.append('title', selectedCategory.title);
        formData.append('description', selectedCategory.description);


        if (selectedCategory?.image === "") {
            formData.append("deleteImage", selectedCategory.deleteImage);
        }else {
            formData.append(`image`, selectedCategory.image);
        }
        
        const data = await apiService.updateCategory(formData, selectedCategory.id)
        if (data.success) {
            let clone = [...categoryList.rows];
            const index = clone.findIndex((x) => x.id === selectedCategory.id)
            if(index !== -1){
                clone[index] = {...data.data, subCategories: clone[index].subCategories || []};
                setCategoryList({ rows: clone, total: categoryList.total });
                toast({description: data.message,});
            } else {
                toast({description: data.error.message, variant: "destructive",});
            }
        }
        setCategoryEdit(false);
        setSheetOpen(false);
    }

    const updateSubCategory = async (name, value) => {
        let validationErrors = {};
        Object.keys(selectedSubCategory).forEach(name => {
            const error = formValidate(name, selectedSubCategory[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
            return;
        }
        if (name === "deleteImage") {
            setSelectedSubCategory({...selectedSubCategory, image: ""})
        } else {
            setSelectedSubCategory({...selectedSubCategory, [name]: value})
        }
        setSubCategoryEdit(true)
        let formData = new FormData();
        formData.append('projectId', projectDetailsReducer.id);
        formData.append('categoryId', selectedSubCategory.categoryId);
        formData.append('title', selectedSubCategory.title);
        formData.append('description', selectedSubCategory.description);
        if (selectedSubCategory?.image === "") {
            formData.append("deleteImage", selectedSubCategory.deleteImage);
        }else {
            formData.append(`image`, selectedSubCategory.image);
        }
        
        const data = await apiService.updateSubCategory(formData, selectedSubCategory.id)
        if (data.success) {
            let clone = [...categoryList.rows];
            const index = clone.findIndex((x) => x.id == selectedSubCategory.categoryId);
            if(index !== -1){
                const subIndex = clone[index].subCategories.findIndex(sub => sub.id === selectedSubCategory.id);
                if (subIndex !== -1) {
                    clone[index].subCategories[subIndex] = data.data;
                    setCategoryList({ rows: clone, total: categoryList.total });
                }
                toast({description: data.message});
            } else {
                toast({description: data.error.message, variant: "destructive",});
            }
        }
        setSubCategoryEdit(false);
        setSheetOpenSub(false);
    }

    const openSheetCategory = (id, data) => {
        const updatedData = {
            ...data,
            deleteImage: data?.image
                ? data.image
                : ""
        };
        setSelectedCategory(id ? updatedData : initialState);
        navigate(`${baseUrl}/help/category`);
        setSheetOpen(true);
    };

    const openSheetSubCategory = (id, data) => {
        const updatedData = {
            ...data,
            deleteImage: data?.image
                ? data.image
                : ""
        };
        setSelectedSubCategory(id ? updatedData : initialState);
        navigate(`${baseUrl}/help/category`)
        setSheetOpenSub(true);
        setSubCategoryId(data.categoryId)
    };

    const closeSheetCategory = () => {
        setSheetOpen(false);
        setSelectedCategory(initialState);
        navigate(`${baseUrl}/help/category?pageNo=${pageNo}`);
        setFormError(initialStateError);
        getAllCategory();
    };

    const closeSheetSubCategory = () => {
        setSheetOpenSub(false);
        setSelectedSubCategory(initialState);
        navigate(`${baseUrl}/help/category?pageNo=${pageNo}`);
        setFormError(initialStateError);
    };

    const handleImageUpload = (file) => {
        const selectedFile = file.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > 5 * 1024 * 1024) { // 5 MB
                setFormError(prevErrors => ({
                    ...prevErrors,
                    image: 'Image size must be less than 5 MB.'
                }));
            } else {
                setFormError(prevErrors => ({
                    ...prevErrors,
                    image: ''
                }));
                setSelectedCategory({
                    ...selectedCategory,
                    image: selectedFile
                });
            }
        }
    };

    const handleImageUploadSub = (file) => {
        const selectedFile = file.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > 5 * 1024 * 1024) { // 5 MB
                setFormError(prevErrors => ({
                    ...prevErrors,
                    image: 'Image size must be less than 5 MB.'
                }));
            } else {
                setFormError(prevErrors => ({
                    ...prevErrors,
                    image: ''
                }));
                setSelectedSubCategory({
                    ...selectedSubCategory,
                    image: selectedFile
                });
            }
        }
    };

    const deleteRow = (id) => {
        setIdToDelete(id);
        setOpenDelete(true);
    }

    const deleteSubRow = (id) => {
        setSubIdToDelete(id);
        setOpenSubDelete(true);
    }

    const deleteCategory = async () => {
        setIsLoadingDelete(true)
        
        const data = await apiService.deleteCategories(idToDelete)
        const clone = [...categoryList.rows];
        const index = clone.findIndex((x) => x.id == idToDelete)
        if (data.success) {
            if (index !== -1) {
                clone.splice(index, 1)
                setCategoryList(clone);
                if (clone.length === 0 && pageNo > 1) {
                    handlePaginationClick(pageNo - 1);
                } else {
                    getAllCategory();
                }
            }
            toast({description: data.message,})
        } else {
            toast({description: data.error.message, variant: "destructive"})
        }
        setIsLoadingDelete(false)
        setOpenDelete(false);
    }

    const deleteSubCategory = async () => {
        setIsLoadingDelete(true)
        
        const data = await apiService.deleteSubCategories(subIdToDelete)
        if (data.success) {
            const clone = [...categoryList.rows];
            clone.forEach(category => {
                const subIndex = category.subCategories?.findIndex(sub => sub.id === subIdToDelete);
                if (subIndex !== -1) {
                    category.subCategories.splice(subIndex, 1);
                }
            });
            setCategoryList({ ...categoryList, rows: clone });
            getAllCategory()
            toast({description: data.message,})
        } else {
            toast({description: data.error.message, variant: "destructive"})
        }
        setIsLoadingDelete(false)
        setOpenSubDelete(false);
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
        <Fragment>

            {isSheetOpen && (
                <Sheet open={isSheetOpen} onOpenChange={isSheetOpen ? closeSheetCategory : openSheetCategory}>
                    <SheetContent className={"sm:max-w-[662px] p-0"}>
                        <SheetHeader className={"px-3 py-4 lg:px-8 lg:py-[20px] flex flex-row justify-between items-center border-b space-y-0"}>
                            <DialogTitle className={"text-lg md:text-xl font-normal"}>
                                { selectedCategory?.id ? "Update Category" : "Create Category"}
                            </DialogTitle>
                            <span className={"max-w-[24px]"}><X onClick={closeSheetCategory} className={"cursor-pointer m-0"} /></span>
                        </SheetHeader>
                        {/*<div className={"h-[calc(100vh_-_120px)] lg:h-[calc(100vh_-_69px)] overflow-y-auto"}>*/}
                        <div className={"h-[calc(100vh_-_61px)] overflow-y-auto"}>
                            <CategoryForm
                                selectedData={selectedCategory}
                                setSelectedData={setSelectedCategory}
                                formError={formError}
                                setFormError={setFormError}
                                handleImageUpload={handleImageUpload}
                                handleSubmit={selectedCategory?.id ? updateCategory : addCategory}
                                isLoading={categoryEdit}
                                closeSheet={closeSheetCategory}
                                saveTitle={"Save Category"}
                                className={"w-[117px]"}
                            />
                        </div>
                    </SheetContent>
                </Sheet>
            )}

            {isSheetOpenSub && (
                <Sheet open={isSheetOpenSub} onOpenChange={isSheetOpenSub ? closeSheetSubCategory : openSheetSubCategory}>
                    <SheetContent className={"sm:max-w-[662px] p-0"}>
                        <SheetHeader className={"px-3 py-4 lg:px-8 lg:py-[20px] flex flex-row justify-between items-center border-b space-y-0"}>
                            <DialogTitle className={"text-lg md:text-xl font-normal"}>
                                { selectedSubCategory?.id ? "Update Sub Category" : "Create Sub Category"}
                            </DialogTitle>
                            <span className={"max-w-[24px]"}><X onClick={closeSheetSubCategory} className={"cursor-pointer m-0"} /></span>
                        </SheetHeader>
                        {/*<div className={"h-[calc(100vh_-_120px)] lg:h-[calc(100vh_-_69px)] overflow-y-auto"}>*/}
                        <div className={"h-[calc(100vh_-_61px)] overflow-y-auto"}>
                            <CategoryForm
                                selectedData={selectedSubCategory}
                                setSelectedData={setSelectedSubCategory}
                                formError={formError}
                                setFormError={setFormError}
                                handleImageUpload={handleImageUploadSub}
                                handleSubmit={selectedSubCategory?.id ? updateSubCategory : addSubCategory}
                                isLoading={subCategoryEdit}
                                closeSheet={closeSheetSubCategory}
                                saveTitle={"Save Sub Category"}
                                className={"w-[145px]"}
                            />
                        </div>
                    </SheetContent>
                </Sheet>
            )}

            <div className={"container xl:max-w-[1200px] lg:max-w-[992px] md:max-w-[768px] sm:max-w-[639px] pt-8 pb-5 px-3 md:px-4"}>

                {
                    openDelete &&
                    <DeleteDialog
                        title={"You really want to delete this Category?"}
                        isOpen={openDelete}
                        onOpenChange={() => setOpenDelete(false)}
                        onDelete={deleteCategory}
                        isDeleteLoading={isLoadingDelete}
                        deleteRecord={idToDelete}
                    />
                }

                {
                    openSubDelete &&
                    <DeleteDialog
                        title={"You really want to delete this Sub Category?"}
                        isOpen={openSubDelete}
                        onOpenChange={() => setOpenSubDelete(false)}
                        onDelete={deleteSubCategory}
                        isDeleteLoading={isLoadingDelete}
                        deleteRecord={subIdToDelete}
                    />
                }

                <div className={"flex items-center justify-between flex-wrap gap-2"}>
                    <div className={"flex flex-col flex-1 gap-y-0.5"}>
                        <h1 className={"text-2xl font-normal flex-initial w-auto"}>All Category ({totalRecord})</h1>
                        <p className={"text-sm text-muted-foreground"}>Organize your articles into categories and sub-categories to improve navigation and help users quickly find relevant information.</p>
                    </div>
                    <div className={"w-full lg:w-auto flex flex-wrap sm:flex-nowrap gap-2 items-center"}>
                        <div className={"flex gap-2 items-center w-full lg:w-auto"}>
                            <CommSearchBar
                                value={filter.search}
                                onChange={onChangeSearch}
                                onClear={clearSearchFilter}
                                placeholder="Search..."
                            />
                            <Button
                                onClick={() => openSheetCategory("", "")}
                                className={"gap-2 font-medium hover:bg-primary"}
                            >
                                <Plus size={20} strokeWidth={3} /><span className={"text-xs md:text-sm font-medium"}>New Category</span>
                            </Button>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className={"mt-6"}>
                        <Card>
                            <CardContent className={"p-0"}>
                                <div className={"rounded-md grid grid-cols-1 overflow-auto whitespace-nowrap"}>
                                    <Table>
                                        <TableHeader className={`${theme === "dark" ? "" : "bg-muted"} py-8 px-5`}>
                                            <TableRow>
                                                {
                                                    ["Title", "Articles", "Created At", "Actions"].map((x, i) => {
                                                        return (
                                                            <TableHead key={i} className={`font-medium text-card-foreground px-2 py-[10px] md:px-3 max-w-[300px]`}>{x}</TableHead>
                                                        )
                                                    })
                                                }
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {
                                                isLoading ? <Fragment>
                                                    {[...Array(10)].map((_, index) => (
                                                        <TableRow key={index}>
                                                            {[...Array(4)].map((_, i) => (
                                                                <TableCell key={i} className={"max-w-[373px] px-2 py-[10px] md:px-3"}>
                                                                    <Skeleton className={"rounded-md w-full h-7"} />
                                                                </TableCell>
                                                            ))}
                                                        </TableRow>
                                                    ))}
                                                </Fragment> : <TableRow>
                                                    <TableCell colSpan={4}>
                                                        <EmptyData />
                                                    </TableCell>
                                                </TableRow>
                                            }
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    categoryList?.rows?.length > 0 ? (
                        categoryList?.rows?.map((x, i) => (
                            <div key={i} className={"my-6"}>
                                <Card>
                                    <CardContent className={"p-0"}>
                                        <div className={"rounded-md grid grid-cols-1 overflow-auto whitespace-nowrap"}>
                                            <Table>
                                                <TableHeader className={`${theme === "dark" ? "" : "bg-muted"} py-8 px-5`}>
                                                    <TableRow>
                                                        <TableHead className={`capitalize px-2 py-[10px] md:px-3 text-primary font-medium max-w-[270px] cursor-pointer truncate text-ellipsis overflow-hidden whitespace-nowrap`} onClick={() => openSheetCategory(x.id, x)}>
                                                            {x.title}
                                                        </TableHead>
                                                        <TableHead className={`capitalize font-medium text-card-foreground px-2 py-[10px] md:px-3 w-[300px] text-end`}>Articles</TableHead>
                                                        <TableHead className={`capitalize font-medium text-card-foreground px-2 py-[10px] md:px-3 w-[300px] text-end`}>Created At</TableHead>
                                                        <TableHead className={`capitalize font-medium px-2 py-[10px] md:px-3 w-[300px] text-center`}>
                                                            <div className={"space-x-4"}>
                                                                <Button
                                                                    variant={"ghost hover:bg-none"}
                                                                    onClick={() => openSheetSubCategory("", { ...initialState, categoryId: x.id })}
                                                                    className={"border border-primary h-8 font-normal text-primary"}
                                                                >
                                                                    <Plus size={16} className={"mr-2"} /> Add Subcategory
                                                                </Button>
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger className={"text-card-foreground dark:text-card"}>
                                                                        <Ellipsis size={16} />
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align={"end"}>
                                                                        <DropdownMenuItem className={"cursor-pointer"} onClick={() => openSheetCategory(x.id, x)}>Edit</DropdownMenuItem>
                                                                        <DropdownMenuItem className={"cursor-pointer"} onClick={() => deleteRow(x.id)}>Delete</DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </div>
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {x.subCategories?.length > 0 ? (
                                                        x.subCategories.map((y, j) => (
                                                            <TableRow key={j}>
                                                                {/*<TableCell className={`cursor-pointer inline-flex gap-2 md:gap-1 flex-wrap items-center px-2 py-[10px] md:px-3 max-w-[270px] cursor-pointer truncate text-ellipsis overflow-hidden whitespace-nowrap`}>*/}
                                                                <TableCell className={`px-2 py-[10px] md:px-3 max-w-[270px] cursor-pointer truncate text-ellipsis overflow-hidden whitespace-nowrap`} onClick={() => openSheetSubCategory(y.id, { ...y, categoryId: x.id })}>
                                                                    {y.title}
                                                                </TableCell>
                                                                <TableCell className={"px-2 py-[10px] md:px-3 w-[300px] text-end"}>
                                                                    {y?.articleCount ? y?.articleCount : "0"}
                                                                </TableCell>
                                                                <TableCell className={"px-2 py-[10px] md:px-3 w-[300px] text-end"}>
                                                                    {y?.updatedAt ? moment.utc(y?.updatedAt).local().startOf('seconds').fromNow() : "-"}
                                                                </TableCell>
                                                                <TableCell className={"px-2 py-[10px] md:px-3 w-[300px] text-center"}>
                                                                    <DropdownMenu>
                                                                        <DropdownMenuTrigger>
                                                                            <Ellipsis className={`font-normal`} size={18} />
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent align={"end"}>
                                                                            <DropdownMenuItem className={"cursor-pointer"} onClick={() => openSheetSubCategory(y.id, { ...y, categoryId: x.id })}>Edit</DropdownMenuItem>
                                                                            <DropdownMenuItem className={"cursor-pointer"} onClick={() => deleteSubRow(y.id)}>Delete</DropdownMenuItem>
                                                                        </DropdownMenuContent>
                                                                    </DropdownMenu>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    ) : (
                                                        <TableRow>
                                                            <TableCell colSpan={4}>
                                                                <EmptyData />
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))
                    ) : (
                        <Card className={"my-6"}>
                            <EmptyData />
                        </Card>
                    )
                )}
                {
                    categoryList?.rows?.length > 0 ?
                        <div className={`mt-6 ${isLoading ? "hidden" : ""}`}>
                            <Card>
                                {
                                    categoryList?.rows?.length > 0 ?
                                        <Pagination
                                            pageNo={pageNo}
                                            totalPages={totalPages}
                                            isLoading={isLoading}
                                            handlePaginationClick={handlePaginationClick}
                                            stateLength={categoryList?.rows?.length}
                                        /> : ""
                                }
                            </Card>
                        </div>
                        : ""
                }
                {
                    (isLoading || !emptyContentBlock) ? "" :
                        <EmptyDataContent data={EmptyInCategoryContent} onClose={() => emptyContent(false)} setSheetOpenCreate={() => openSheetCategory("", "")}/>
                }
            </div>
        </Fragment>
    );
};

export default Category;
