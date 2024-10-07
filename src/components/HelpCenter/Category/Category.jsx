import React, {Fragment, useEffect, useState} from 'react';
import {Input} from "../../ui/input";
import {Button} from "../../ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../ui/table";
import {Card, CardContent, CardFooter} from "../../ui/card";
import {DropdownMenu, DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";
import {DropdownMenuContent, DropdownMenuItem} from "../../ui/dropdown-menu";
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    CircleX,
    Ellipsis,
    Loader2,
    Plus,
    Upload,
    X
} from "lucide-react";
import {Sheet, SheetContent, SheetHeader, SheetOverlay} from "../../ui/sheet";
import {Label} from "../../ui/label";
import moment from 'moment';
import {useToast} from "../../ui/use-toast";
import {useTheme} from "../../theme-provider";
import {Dialog} from "@radix-ui/react-dialog";
import {DialogContent, DialogDescription, DialogHeader, DialogTitle} from "../../ui/dialog";
import ReactQuillEditor from "../../Comman/ReactQuillEditor";
import {useSelector} from "react-redux";
import {ApiService} from "../../../utils/ApiService";
import {Skeleton} from "../../ui/skeleton";
import EmptyData from "../../Comman/EmptyData";
import {baseUrl} from "../../../utils/constent";
import {useNavigate} from "react-router";

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
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const {theme} = useTheme();
    const {toast} = useToast();
    const navigate = useNavigate();
    const UrlParams = new URLSearchParams(location.search);
    const getPageNo = UrlParams.get("pageNo") || 1;

    const [formError, setFormError] = useState(initialStateError);
    const [selectedCategory, setSelectedCategory] = useState(initialState);
    const [selectedSubCategory, setSelectedSubCategory] = useState(initialState);
    const [isSheetOpen, setSheetOpen] = useState(false);
    const [isSheetOpenSub, setSheetOpenSub] = useState(false);
    const [categoryEdit, setCategoryEdit] = useState(false);
    const [subCategoryEdit, setSubCategoryEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [openDelete,setOpenDelete]=useState(false);
    const [openSubDelete,setOpenSubDelete]=useState(false);
    const [categoryList, setCategoryList] = useState([]);
    const [idToDelete, setIdToDelete] = useState(null);
    const [subIdToDelete, setSubIdToDelete] = useState(null);
    const [subCategoryId,setSubCategoryId] = useState("")
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);
    const [pageNo, setPageNo] = useState(Number(getPageNo));
    const [totalRecord, setTotalRecord] = useState(0);

    useEffect(() => {
        if(projectDetailsReducer.id){
            getAllCategory();
        }
        navigate(`${baseUrl}/help/category?pageNo=${pageNo}`);
    }, [projectDetailsReducer.id, pageNo])

    const getAllCategory = async () => {
        const data = await apiService.getAllCategory({
            project_id: projectDetailsReducer.id,
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
                    return "Title is required";
                } else {
                    return "";
                }
            case "description":
                if (!value || value.toString().trim() === "") {
                    return "Description is required";
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
                const cloneSub = [...clone[index].sub_categories];
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

    const onEditCategory = async () => {
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

    const onEditSubCategory = async () => {
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
        setSheetOpen(true);
    };

    const openSheetSubCategory = (id, data) => {
        setSelectedSubCategory(id ? data : initialState);
        setSheetOpenSub(true);
        setSubCategoryId(data.category_id)
    };

    const closeSheetCategory = () => {
        setSheetOpen(false);
        setSelectedCategory(initialState);
        setFormError(initialStateError);
    };

    const closeSheetSubCategory = () => {
        setSheetOpenSub(false);
        setSelectedSubCategory(initialState);
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
        if (selectedCategory && selectedCategory?.image) {
            setSelectedCategory({...selectedCategory, image: ""})
        } else {
            setSelectedCategory({...selectedCategory, [name]: value, image: ""})
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
                                <Label htmlFor="category-name" className={"font-normal"}>Category name</Label>
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
                                <Label className={"font-normal"}>Category description</Label>
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
                                                    onClick={() => onDeleteImg('image', selectedCategory && selectedCategory?.image && selectedCategory?.image?.name ? "" : selectedCategory?.image.replace("https://code.quickhunt.app/public/storage/post", ""))}
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
                                className={`border w-[132px] font-medium hover:bg-primary`}
                                onClick={selectedCategory?.id ? onEditCategory : addCategory}
                            >
                                {categoryEdit ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Category"}
                            </Button>

                            <Button
                                variant={"ghost hover:bg-none"}
                                onClick={closeSheetCategory}
                                className={`border border-primary font-medium`}
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
                                    <Label htmlFor="category-name" className={"font-normal"}>Category name</Label>
                                    <Input
                                        value={selectedSubCategory?.title}
                                        onChange={(e) => handleOnChangeSub("title", e.target.value)}
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
                                    <Label className={"font-normal"}>Category description</Label>
                                    <ReactQuillEditor
                                        value={selectedSubCategory?.description}
                                        onChange={(e) => handleOnChangeSub("description", e.target.value)}
                                    />
                                    {formError?.description && <span className="text-red-500 text-sm">{formError?.description}</span>}
                                </div>
                                <div className={"flex flex-col gap-2"}>
                                    <Label className={"font-normal"}>Category Icon</Label>
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
                                                        accept="image/*"
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
                                    className={`border w-[156px] font-medium hover:bg-primary`}
                                    onClick={selectedSubCategory?.id ? onEditSubCategory : addSubCategory}
                                >
                                    {subCategoryEdit ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Subcategory"}
                                </Button>

                                <Button
                                    variant={"ghost hover:bg-none"}
                                    onClick={closeSheetSubCategory}
                                    className={`border border-primary font-medium`}
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
                    <Fragment>
                        <Dialog open onOpenChange={()=> setOpenDelete(false)}>
                            <DialogContent className="w-[310px] md:w-full rounded-lg">
                                <DialogHeader className={"flex flex-row justify-between gap-2"}>
                                    <div className={"flex flex-col gap-2"}>
                                        <DialogTitle className={"text-start font-medium"}>You really want delete this category ?</DialogTitle>
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
                                        onClick={deleteCategory}
                                    >
                                        {isLoadingDelete ? <Loader2 size={16} className={"animate-spin"}/> : "Delete"}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </Fragment>
                }

                {
                    openSubDelete &&
                    <Fragment>
                        <Dialog open onOpenChange={()=> setOpenSubDelete(false)}>
                            <DialogContent className="w-[310px] md:w-full rounded-lg">
                                <DialogHeader className={"flex flex-row justify-between gap-2"}>
                                    <div className={"flex flex-col gap-2"}>
                                        <DialogTitle className={"text-start font-medium"}>You really want delete this sub category ?</DialogTitle>
                                        <DialogDescription className={"text-start"}>This action can't be undone.</DialogDescription>
                                    </div>
                                    <X size={16} className={"m-0 cursor-pointer"} onClick={() => setOpenSubDelete(false)}/>
                                </DialogHeader>
                                <div className={"flex justify-end gap-2"}>
                                    <Button variant={"outline hover:none"}
                                            className={"text-sm font-medium border"}
                                            onClick={() => setOpenSubDelete(false)}>Cancel</Button>
                                    <Button
                                        variant={"hover:bg-destructive"}
                                        className={`${theme === "dark" ? "text-card-foreground" : "text-card"} w-[76px] text-sm font-medium bg-destructive`}
                                        onClick={deleteSubCategory}
                                    >
                                        {isLoadingDelete ? <Loader2 size={16} className={"animate-spin"}/> : "Delete"}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </Fragment>
                }

                <div className={"flex justify-between gap-3"}>
                    <h4 className={"font-normal text-lg sm:text-2xl"}>All Category</h4>
                    <div className={"flex gap-4"}>
                        <Input
                            type="search"
                            placeholder="Search..."
                            className={"pl-4 pr-4 text-sm font-normal h-9 w-full"}
                        />
                        <Button
                            size="sm"
                            onClick={() => openSheetCategory("", "")}
                            className={"gap-2 font-medium hover:bg-primary"}
                        >
                            <Plus size={20} strokeWidth={3} />New Category
                        </Button>
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
                                                <TableHead className={`px-2 py-[10px] md:px-3 font-medium max-w-[300px]`}>
                                                    Title
                                                </TableHead>
                                                <TableHead className={`font-medium px-2 py-[10px] md:px-3 w-[300px] text-end`}>
                                                    Articles
                                                </TableHead>
                                                <TableHead className={`font-medium px-2 py-[10px] md:px-3 w-[300px] text-end`}>
                                                    Created at
                                                </TableHead>
                                                <TableHead className={`font-medium px-2 py-[10px] md:px-3 w-[300px] text-center`}>
                                                    Actions
                                                </TableHead>
                                                <TableHead className={`font-medium px-2 py-[10px] md:px-3 w-[300px] text-center`}>
                                                    Status
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {
                                                isLoading ? <Fragment>
                                                    {[...Array(5)].map((_, index) => (
                                                        <TableRow key={index}>
                                                            {[...Array(5)].map((_, i) => (
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
                                                        <TableHead className={`px-2 py-[10px] md:px-3 text-primary font-medium max-w-[300px] overflow-hidden text-ellipsis`}>
                                                            {x.title}
                                                        </TableHead>
                                                        <TableHead className={`font-medium px-2 py-[10px] md:px-3 w-[300px] text-end`}>Articles</TableHead>
                                                        <TableHead className={`font-medium px-2 py-[10px] md:px-3 w-[300px] text-end`}>Created at</TableHead>
                                                        <TableHead className={`font-medium px-2 py-[10px] md:px-3 w-[300px] text-center`}>
                                                            <div className={"space-x-2"}>
                                                                <Button
                                                                    size={"sm"}
                                                                    variant={"ghost hover:bg-none"}
                                                                    onClick={() => openSheetSubCategory("", { ...initialState, category_id: x.id })}
                                                                    className={"mr-3 border border-primary font-normal text-primary py-2 px-3"}
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
                                                                <TableCell className={`inline-flex gap-2 md:gap-1 flex-wrap items-center px-2 py-[10px] md:px-3 w-[300px]`}>
                                                                    <span className={"cursor-pointer text-ellipsis overflow-hidden whitespace-nowrap"}>{y.title}</span>
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
                <div className={`mt-6 ${isLoading ? "hidden" : ""}`}>
                    <Card>
                        {
                            categoryList.length > 0 ?
                                <CardContent className={`p-0`}>
                                    <div className={`w-full ${theme === "dark" ? "" : "bg-muted"} rounded-b-lg rounded-t-none flex justify-end p-2 md:px-3 md:py-[10px]`}>
                                        <div className={"w-full flex gap-2 items-center justify-between sm:justify-end"}>
                                            <div>
                                                <h5 className={"text-sm font-medium"}>Page {categoryList.length <= 0 ? 0 :pageNo} of {totalPages}</h5>
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
                                                        disabled={pageNo === totalPages || isLoading || categoryList.length <= 0}>
                                                    <ChevronRight
                                                        className={pageNo === totalPages || isLoading || categoryList.length <= 0 ? "stroke-muted-foreground" : "stroke-primary"} />
                                                </Button>
                                                <Button variant={"outline"} className={"h-[30px] w-[30px] p-1.5"}
                                                        onClick={() => handlePaginationClick(totalPages)}
                                                        disabled={pageNo === totalPages || isLoading || categoryList.length <= 0}>
                                                    <ChevronsRight
                                                        className={pageNo === totalPages || isLoading || categoryList.length <= 0 ? "stroke-muted-foreground" : "stroke-primary"} />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent> : ""
                        }
                    </Card>
                </div>
            </div>
        </Fragment>
    );
};

export default Category;
