import React, {Fragment, useEffect, useRef, useState} from 'react';
import {Input} from "../../ui/input";
import {Button} from "../../ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../ui/table";
import {Card, CardContent} from "../../ui/card";
import {DropdownMenu, DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";
import {DropdownMenuContent, DropdownMenuItem} from "../../ui/dropdown-menu";
import {CircleX, Ellipsis, Loader2, Plus, Upload, X} from "lucide-react";
import {Sheet, SheetContent, SheetHeader, SheetOverlay} from "../../ui/sheet";
import {Label} from "../../ui/label";
import moment from 'moment';
import {useToast} from "../../ui/use-toast";
import {useTheme} from "../../theme-provider";
import ReactQuillEditor from "../../Comman/ReactQuillEditor";
import {useSelector} from "react-redux";
import {ApiService} from "../../../utils/ApiService";
import {Skeleton} from "../../ui/skeleton";
import EmptyData from "../../Comman/EmptyData";
import {baseUrl} from "../../../utils/constent";
import {useNavigate} from "react-router";
import Pagination from "../../Comman/Pagination";
import DeleteDialog from "../../Comman/DeleteDialog";
import {debounce} from "lodash";

const initialState = {
    title: "",
    description: "",
    createdAt: moment().fromNow(),
    image: "",
};

const initialStateError = {
    title: "",
    description: "",
}

const perPageLimit = 10

const Category = () => {
    const apiService = new ApiService();
    const {theme} = useTheme();
    const {toast} = useToast();
    const navigate = useNavigate();
    const UrlParams = new URLSearchParams(location.search);
    const getPageNo = UrlParams.get("pageNo") || 1;
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const timeoutHandler = useRef(null);

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
    const [filter, setFilter] = useState({
        search: "",
        category_id: "",
        sub_category_id: ""
    });

    useEffect(() => {
        if(projectDetailsReducer.id){
            getAllCategory(filter.search, filter.category_id, filter.sub_category_id);
        }
        navigate(`${baseUrl}/help/category?pageNo=${pageNo}`);
    }, [projectDetailsReducer.id, pageNo])

    const getAllCategory = async (search, category_id, sub_category_id) => {
        const data = await apiService.getAllCategory({
            project_id: projectDetailsReducer.id,
            search: search,
            page: pageNo,
            limit: perPageLimit
        });
        if (data.status === 200) {
            setCategoryList(data.data);
            setTotalRecord(data.total);
            setIsLoading(false)
        } else {
            setIsLoading(false)
        }
    };

    // const onChangeSearch = async (event) => {
    //     setFilter({...filter, [event.target.name]: event.target.value,})
    //     if (timeoutHandler.current) {
    //         clearTimeout(timeoutHandler.current);
    //     }
    //     timeoutHandler.current = setTimeout(() => {
    //         setPageNo(1);
    //         getAllCategory(event.target.value, '');
    //     }, 2000);
    // }

    const debounceGetAllArticles = debounce((searchValue) => {
        setPageNo(1);
        setIsLoading(true);
        getAllCategory(searchValue).then(() => {
            setIsLoading(false);
        });
    }, 500);

    const onChangeSearch = (event) => {
        const value = event.target.value;
        setFilter((prev) => ({ ...prev, search: value }));
        debounceGetAllArticles(value);
    };

    const clearSearchFilter = () => {
        setFilter(prev => ({ ...prev, search: '' }));
        setPageNo(1);
        setIsLoading(true);
        getAllCategory('').then(() => {
            setIsLoading(false);
        });
    };

    const handleOnChange = (name, value) => {
        setSelectedCategory({ ...selectedCategory, [name]: value });
        setFormError(formError => ({
            ...formError,
            [name]: formValidate(name, value)
        }));
    };

    const handleOnChangeSub = (name, value) => {
        setSelectedSubCategory({ ...selectedSubCategory, [name]: value });
        setFormError(formError => ({
            ...formError,
            [name]: formValidate(name, value)
        }));
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
        formData.append('project_id', projectDetailsReducer.id);
        formData.append('title', selectedCategory.title);
        formData.append('description', selectedCategory.description);
        formData.append(`image`, selectedCategory.image);
        
        const data = await apiService.createCategory(formData);
        if(data.status === 200) {
            setSelectedCategory(initialState);
            let clone = [...categoryList];
            clone.unshift(data.data);
            setCategoryList(clone);
            toast({description: data.message,});
        } else {
            toast({description: data.message, variant: "destructive",})
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
        formData.append('project_id', projectDetailsReducer.id);
        formData.append('category_id', subCategoryId);
        formData.append('title', selectedSubCategory.title);
        formData.append('description', selectedSubCategory.description);
        formData.append(`image`, selectedSubCategory.image);
        
        const data = await apiService.createSubCategory(formData);
        if (data.status === 200) {
            let clone = [...categoryList];
            const index = clone.findIndex((x) => x.id == subCategoryId)
            if(index !== -1){
                let cloneSub = clone[index].sub_categories || [];
                const subIndex = cloneSub.findIndex((x) => x.id === subCategoryId);
                if(subIndex !== -1){
                    cloneSub[subIndex] = data.data
                } else {
                    cloneSub.push(data.data)
                }
                clone[index].sub_categories = cloneSub;
                setCategoryList(clone)
            }
            setSelectedSubCategory(initialState)
            toast({description: data.message});
            closeSheetSubCategory()
        } else {
            toast({description: data.message, variant: "destructive",});
        }
        setSubCategoryEdit(false);
    };

    const updateCategory = async () => {
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
        formData.append('project_id', projectDetailsReducer.id);
        formData.append('title', selectedCategory.title);
        formData.append('description', selectedCategory.description);
        formData.append(`image`, selectedCategory.image);
        
        const data = await apiService.updateCategory(formData, selectedCategory.id)
        if (data.status === 200) {
            let clone = [...categoryList];
            const index = clone.findIndex((x) => x.id === selectedCategory.id)
            if(index !== -1){
                clone[index] = {...data.data, sub_categories: clone[index].sub_categories || []};
                setCategoryList(clone);
                toast({description: data.message,});
            } else {
                toast({description: data.message, variant: "destructive",});
            }
        }
        setCategoryEdit(false);
        setSheetOpen(false);
    }

    const updateSubCategory = async () => {
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
        formData.append('project_id', projectDetailsReducer.id);
        formData.append('category_id', selectedSubCategory.category_id);
        formData.append('title', selectedSubCategory.title);
        formData.append('description', selectedSubCategory.description);
        formData.append(`image`, selectedSubCategory.image);
        
        const data = await apiService.updateSubCategory(formData, selectedSubCategory.id)
        if (data.status === 200) {
            let clone = [...categoryList];
            const index = clone.findIndex((x) => x.id == selectedSubCategory.category_id);
            if(index !== -1){
                const subIndex = clone[index].sub_categories.findIndex(sub => sub.id === selectedSubCategory.id);
                if (subIndex !== -1) {
                    clone[index].sub_categories[subIndex] = data.data;
                    setCategoryList(clone);
                }
                toast({description: data.message});
            } else {
                toast({description: data.message, variant: "destructive",});
            }
        }
        setSubCategoryEdit(false);
        setSheetOpenSub(false);
    }

    const openSheetCategory = (id, data) => {
        setSelectedCategory(id ? data : initialState);
        navigate(`${baseUrl}/help/category`)
        setSheetOpen(true);
    };

    const openSheetSubCategory = (id, data) => {
        setSelectedSubCategory(id ? data : initialState);
        navigate(`${baseUrl}/help/category`)
        setSheetOpenSub(true);
        setSubCategoryId(data.category_id)
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

    const onDeleteImg = async (name, value) => {
        const payload = {
            name: [value],
            type: "post"
        }
        const data = await apiService.deletePostsImage(payload);
        if(data.status === 200) {
            // if (selectedCategory && selectedCategory?.image) {
            if (name === "image") {
                setSelectedCategory({...selectedCategory, image: ""})
            } else {
                setSelectedCategory({...selectedCategory, [name]: value})
                // setSelectedCategory({...selectedCategory, [name]: value, image: ""})
            }
        }
    }

    const onSubDeleteImg = async (name, value) => {
        if (selectedSubCategory && selectedSubCategory?.image) {
            setSelectedSubCategory({...selectedSubCategory, image: ""})
        } else {
            setSelectedSubCategory({...selectedSubCategory, [name]: value, image: ""})
        }
    }

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
        const clone = [...categoryList];
        const index = clone.findIndex((x) => x.id == idToDelete)
        if (data.status === 200) {
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
            toast({description: data.message, variant: "destructive"})
        }
        setIsLoadingDelete(false)
        setOpenDelete(false);
    }

    const deleteSubCategory = async () => {
        setIsLoadingDelete(true)
        
        const data = await apiService.deleteSubCategories(subIdToDelete)
        if (data.status === 200) {
            const clone = [...categoryList];
            clone.forEach(category => {
                const subIndex = category.sub_categories?.findIndex(sub => sub.id === subIdToDelete);
                if (subIndex !== -1) {
                    category.sub_categories.splice(subIndex, 1);
                }
            });
            setCategoryList(clone);
            getAllCategory()
            toast({description: data.message,})
        } else {
            toast({description: data.message, variant: "destructive"})
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
                    <SheetOverlay className={"inset-0"} />
                    <SheetContent className={"sm:max-w-[662px] p-0"}>
                        <SheetHeader className={"px-3 py-4 lg:px-8 lg:py-[20px] flex flex-row justify-between items-center border-b"}>
                            <h5 className={"text-sm md:text-xl font-normal"}>
                                { selectedCategory?.id ? "Update Category" : "Create Category"}
                            </h5>
                            <X onClick={closeSheetCategory} size={18} className={"cursor-pointer m-0"} />
                        </SheetHeader>
                        <div className={"h-[calc(100%_-_69px)] overflow-y-auto"}>
                        <div className={"sm:px-8 sm:py-6 px-3 py-4 border-b space-y-6"}>
                            <div className="grid w-full gap-2">
                                <Label htmlFor="category-name" className={"font-normal"}>Category Name</Label>
                                <Input
                                    value={selectedCategory?.title}
                                    onChange={(e) => handleOnChange("title", e.target.value)}
                                    type="text"
                                    id="category-name"
                                    className={"h-9"}
                                    placeholder={"Enter the category name..."}
                                />
                                {
                                    formError?.title && <span className="text-red-500 text-sm">{formError?.title}</span>
                                }
                            </div>
                            <div className="grid w-full gap-2">
                                <Label className={"font-normal"}>Category Description</Label>
                                <ReactQuillEditor
                                    value={selectedCategory?.description}
                                    onChange={(e) => handleOnChange("description", e.target.value)}
                                />
                                {formError?.description && <span className="text-red-500 text-sm">{formError?.description}</span>}
                            </div>
                            <div className={"flex flex-col gap-2"}>
                                <Label className={"font-normal"}>Category Icon</Label>
                            <div className="w-[282px] h-[128px] flex gap-1">
                                {
                                    selectedCategory?.image ?
                                        <div>
                                            <div className={"w-[282px] h-[128px] relative border p-[5px]"}>
                                                <img
                                                    className={"upload-img"}
                                                    src={selectedCategory && selectedCategory?.image && selectedCategory?.image?.name ? URL.createObjectURL(selectedCategory?.image) : selectedCategory?.image}
                                                    alt=""
                                                />
                                                <CircleX
                                                    size={20}
                                                    className={`${theme === "dark" ? "text-card-foreground" : "text-muted-foreground"} cursor-pointer absolute top-[0%] left-[100%] translate-x-[-50%] translate-y-[-50%] z-10`}
                                                    onClick={() => onDeleteImg('image', selectedCategory && selectedCategory?.image && selectedCategory?.image?.name ? "" : selectedCategory?.image.replace("https://code.quickhunt.app/public/storage/post/", ""))}
                                                />
                                            </div>
                                        </div> :
                                        <div>
                                            <input
                                                id="pictureInput"
                                                type="file"
                                                className="hidden"
                                                accept={".jpg,.jpeg"}
                                                onChange={handleImageUpload}
                                            />
                                            <label
                                                htmlFor="pictureInput"
                                                className="border-dashed w-[282px] h-[128px] py-[52px] flex items-center justify-center bg-muted border border-muted-foreground rounded cursor-pointer"
                                            >
                                                <Upload className="h-4 w-4 text-muted-foreground" />
                                            </label>
                                        </div>
                                }
                            </div>
                            </div>
                        </div>
                        <div className={"flex gap-4 px-3 py-4 sm:py-6 sm:px-8"}>
                            <Button
                                className={`border w-[115px] font-medium hover:bg-primary`}
                                onClick={selectedCategory?.id ? updateCategory : addCategory}
                            >
                                {categoryEdit ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Category"}
                            </Button>

                            <Button
                                variant={"ghost hover:bg-none"}
                                onClick={closeSheetCategory}
                                className={`border border-primary font-medium text-primary`}
                            >
                                Cancel
                            </Button>
                        </div>
                        </div>
                    </SheetContent>
                </Sheet>
            )}

            {isSheetOpenSub && (
                <Sheet open={isSheetOpenSub} onOpenChange={isSheetOpenSub ? closeSheetSubCategory : openSheetSubCategory}>
                    <SheetOverlay className={"inset-0"} />
                    <SheetContent className={"sm:max-w-[662px] p-0"}>
                        <SheetHeader className={"px-3 py-4 lg:px-8 lg:py-[20px] flex flex-row justify-between items-center border-b"}>
                            <h5 className={"text-sm md:text-xl font-normal"}>
                                { selectedSubCategory?.id ? "Update Sub Category" : "Create Sub Category"}
                            </h5>
                            <X onClick={closeSheetSubCategory} size={18} className={"cursor-pointer m-0"} />
                        </SheetHeader>
                        <div className={"h-[calc(100%_-_69px)] overflow-y-auto"}>
                            <div className={"sm:px-8 sm:py-6 px-3 py-4 border-b space-y-6"}>
                                <div className="grid w-full gap-2">
                                    <Label htmlFor="category-name" className={"font-normal"}>Sub Category Name</Label>
                                    <Input
                                        value={selectedSubCategory?.title}
                                        onChange={(e) => handleOnChangeSub("title", e.target.value)}
                                        type="text"
                                        id="category-name"
                                        className={"h-9"}
                                        placeholder={"Enter the sub-category name..."}
                                    />
                                    {
                                        formError?.title && <span className="text-red-500 text-sm">{formError?.title}</span>
                                    }
                                </div>
                                <div className="grid w-full gap-2">
                                    <Label className={"font-normal"}>Sub Category Description</Label>
                                    <ReactQuillEditor
                                        value={selectedSubCategory?.description}
                                        onChange={(e) => handleOnChangeSub("description", e.target.value)}
                                    />
                                    {formError?.description && <span className="text-red-500 text-sm">{formError?.description}</span>}
                                </div>
                                <div className={"flex flex-col gap-2"}>
                                    <Label className={"font-normal"}>Sub Category Icon</Label>
                                    <div className="w-[282px] h-[128px] flex gap-1">
                                        {
                                            selectedSubCategory?.image ?
                                                <div>
                                                    <div className={"w-[282px] h-[128px] relative border p-[5px]"}>
                                                        <img
                                                            className={"upload-img"}
                                                            src={selectedSubCategory && selectedSubCategory?.image && selectedSubCategory?.image?.name ? URL.createObjectURL(selectedSubCategory?.image) : selectedSubCategory?.image}
                                                            alt=""
                                                        />
                                                        <CircleX
                                                            size={20}
                                                            className={`${theme === "dark" ? "text-card-foreground" : "text-muted-foreground"} cursor-pointer absolute top-[0%] left-[100%] translate-x-[-50%] translate-y-[-50%] z-10`}
                                                            onClick={() => onSubDeleteImg('image', selectedSubCategory && selectedSubCategory?.image && selectedSubCategory?.image?.name ? "" : selectedSubCategory?.image.replace("https://code.quickhunt.app/public/storage/post", ""))}
                                                        />
                                                    </div>
                                                </div> :
                                                <div>
                                                    <input
                                                        id="pictureInput"
                                                        type="file"
                                                        className="hidden"
                                                        accept={".jpg,.jpeg"}
                                                        onChange={handleImageUploadSub}
                                                    />
                                                    <label
                                                        htmlFor="pictureInput"
                                                        className="border-dashed w-[282px] h-[128px] py-[52px] flex items-center justify-center bg-muted border border-muted-foreground rounded cursor-pointer"
                                                    >
                                                        <Upload className="h-4 w-4 text-muted-foreground" />
                                                    </label>
                                                </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className={"flex gap-4 px-3 py-4 sm:py-6 sm:px-8"}>
                                <Button
                                    className={`border w-[145px] font-medium hover:bg-primary`}
                                    onClick={selectedSubCategory?.id ? updateSubCategory : addSubCategory}
                                >
                                    {subCategoryEdit ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Sub Category"}
                                </Button>

                                <Button
                                    variant={"ghost hover:bg-none"}
                                    onClick={closeSheetSubCategory}
                                    className={`border border-primary font-medium text-primary`}
                                >
                                    Cancel
                                </Button>
                            </div>
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
                                                            <TableHead className={`font-medium text-card-foreground px-2 py-[10px] md:px-3 max-w-[300px]`}>{x}</TableHead>
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
                    categoryList?.length > 0 ? (
                        categoryList.map((x, i) => (
                            <div key={i} className={"mt-6"}>
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
                                                                    onClick={() => openSheetSubCategory("", { ...initialState, category_id: x.id })}
                                                                    className={"border border-primary h-8 font-normal text-primary"}
                                                                >
                                                                    <Plus size={16} className={"mr-2"} /> Add Subcategory
                                                                </Button>
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger>
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
                                                    {x.sub_categories?.length > 0 ? (
                                                        x.sub_categories.map((y, j) => (
                                                            <TableRow key={j}>
                                                                {/*<TableCell className={`cursor-pointer inline-flex gap-2 md:gap-1 flex-wrap items-center px-2 py-[10px] md:px-3 max-w-[270px] cursor-pointer truncate text-ellipsis overflow-hidden whitespace-nowrap`}>*/}
                                                                <TableCell className={`px-2 py-[10px] md:px-3 max-w-[270px] cursor-pointer truncate text-ellipsis overflow-hidden whitespace-nowrap`} onClick={() => openSheetSubCategory(y.id, { ...y, category_id: x.id })}>
                                                                    {y.title}
                                                                </TableCell>
                                                                <TableCell className={"px-2 py-[10px] md:px-3 w-[300px] text-end"}>
                                                                    {y.article_count ? y.article_count : "0"}
                                                                </TableCell>
                                                                <TableCell className={"px-2 py-[10px] md:px-3 w-[300px] text-end"}>
                                                                    {y.updated_at ? moment.utc(y.updated_at).local().startOf('seconds').fromNow() : "-"}
                                                                </TableCell>
                                                                <TableCell className={"px-2 py-[10px] md:px-3 w-[300px] text-center"}>
                                                                    <DropdownMenu>
                                                                        <DropdownMenuTrigger>
                                                                            <Ellipsis className={`font-normal`} size={18} />
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent align={"end"}>
                                                                            <DropdownMenuItem className={"cursor-pointer"} onClick={() => openSheetSubCategory(y.id, { ...y, category_id: x.id })}>Edit</DropdownMenuItem>
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
                        <Card className={"mt-6"}>
                            <EmptyData />
                        </Card>
                    )
                )}
                {
                    categoryList.length > 0 ?
                        <div className={`mt-6 ${isLoading ? "hidden" : ""}`}>
                            <Card>
                                {
                                    categoryList.length > 0 ?
                                        <Pagination
                                            pageNo={pageNo}
                                            totalPages={totalPages}
                                            isLoading={isLoading}
                                            handlePaginationClick={handlePaginationClick}
                                            stateLength={categoryList.length}
                                        /> : ""
                                }
                            </Card>
                        </div>
                        : ""
                }
            </div>
        </Fragment>
    );
};

export default Category;
