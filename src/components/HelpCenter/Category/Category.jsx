import React, { Fragment, useState, useEffect } from 'react';
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Card, CardContent } from "../../ui/card";
import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuItem } from "../../ui/dropdown-menu";
import {X, Plus, Ellipsis, Loader2, CircleX, Upload} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetOverlay } from "../../ui/sheet";
import { Label } from "../../ui/label";
import moment from 'moment';
import {toast, useToast} from "../../ui/use-toast";
import {useTheme} from "../../theme-provider";
import {Dialog} from "@radix-ui/react-dialog";
import {DialogContent, DialogDescription, DialogHeader, DialogTitle} from "../../ui/dialog";
import ReactQuillEditor from "../../Comman/ReactQuillEditor";
import {useSelector} from "react-redux";
import {ApiService} from "../../../utils/ApiService";

const initialState = {
    title: "",
    description: "",
    createdAt: moment().fromNow(),
    images: [],
};

const initialStateError = {
    title: "",
    description: "",
}

const initialStateTable = [
    {
        title : "Get Started",
        data : [
            {
                title: "Setup account",
                description: "Sample Description",
                articles: "02",
                createdAt: moment().startOf('hour').fromNow(),
            }
        ]
    }
];

const Category = () => {
    const {theme} = useTheme();
    const {toast} = useToast()
    const [isSheetOpen, setSheetOpen] = useState(false);
    const [isSave, setIsSave] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [subLoading, setSubLoading] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [type, setType] = useState('');
    const [editData, setEditData] = useState(null);
    const [openDelete,setOpenDelete]=useState(false);

    const apiService = new ApiService();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const [formError, setFormError] = useState(initialStateError);
    const [tables, setTables] = useState(initialStateTable);
    const [categoryData, setCategoryData] = useState(initialState);
    const [categoryList, setCategoryList] = useState([]);
    const [subCategoryList, setSubCategoryList] = useState([]);
    const [idToDelete, setIdToDelete] = useState(null);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);

    useEffect(() => {
        if(projectDetailsReducer.id){
            // setSubCategoryList(allStatusAndTypes?.categories)
            getAllCategory();
            getAllSubCategory();
        }
    }, [projectDetailsReducer.id])

    const getAllCategory = async () => {
        setIsLoading(true);
        const data = await apiService.getAllCategory(projectDetailsReducer.id);
        if (data.status === 200) {
            setCategoryList(data.data);
        }
        setIsLoading(false)
    };

    const getAllSubCategory = async () => {
        setSubLoading(true);
        const data = await apiService.getAllSubCategory(projectDetailsReducer.id);
        if (data.status === 200) {
            setSubCategoryList(data.data);
        }
        setSubLoading(false)
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
        Object.keys(categoryData).forEach(name => {
            const error = formValidate(name, categoryData[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
            return;
        }
        setIsSave(true);
        let formData = new FormData();
        formData.append('project_id', projectDetailsReducer.id);
        formData.append('title', categoryData.title);
        formData.append('description', categoryData.description);
        formData.append(`images[0]`, categoryData.images);
        const data = await apiService.createCategory(formData)
        if(data.status === 200) {
            setIsSave(false);
            setCategoryData(initialState);
            toast({
                description: data.message,
            });
            // getAllCategory()
            let clone = [...categoryList];
            clone.push(data.data);
            setCategoryList(clone);
        } else {
            setIsSave(false);
            toast({description: data.message, variant: "destructive",})
        }
        closeSheet();
    };

    const addSubCategory = async () => {
        let validationErrors = {};
        Object.keys(categoryData).forEach(name => {
            const error = formValidate(name, categoryData[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });

        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
            return;
        }
        setIsSave(true);
        let formData = new FormData();
        formData.append(`images[0]`, categoryData.images);
        formData.append('title', categoryData.title);
        formData.append('description', categoryData.description);
        formData.append('project_id', projectDetailsReducer.id);
        formData.append('category_id', selectedIndex);
        const data = await apiService.createSubCategory(formData);
        if (data.status === 200) {
            setIsSave(false);
            setCategoryData(initialState);
            toast({description: data.message,});
            const updatedCategoryList = [...subCategoryList];
            const categoryToUpdate = updatedCategoryList.find(cat => cat.id === selectedIndex);
            if (categoryToUpdate) {
                categoryToUpdate.data.push(data.data);
            }
            setSubCategoryList(updatedCategoryList);
            // getAllSubCategory();
            setSelectedIndex(null)
        } else {
            setIsSave(false);
            toast({description: data.message, variant: "destructive",});
        }
        closeSheet();
    };

    const onEditCategory = async () => {
        let formData = new FormData();
        formData.append('project_id', projectDetailsReducer.id);
        formData.append('title', categoryData.title);
        formData.append('description', categoryData.description);
        formData.append(`images[0]`, categoryData.images);
        formData.append(`delete_image[0]`, categoryData?.images?.replace('https://code.quickhunt.app/public/storage/category/', ''));
        const data = await apiService.updateCategory(formData)
        if (data.state === 200) {
            setCategoryList([])
        }
    }

    const openSheet = (type, id , data ) => {
        setType(type);
        setSelectedIndex(id);
        setEditData(data);
        setCategoryData(data || initialState);
        setSheetOpen(true);
    };

    const closeSheet = () => {
        setSheetOpen(false);
        setCategoryData(initialState);
        setFormError(initialStateError);
    };

    const handleOnChange = (name, value) => {
        setCategoryData({ ...categoryData, [name]: value });
    };

    console.log("categoryData", categoryData)
    console.log("categoryData?.images", categoryData?.images)

    const handleImageUpload = (file) => {
        const selectedFile = file.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > 5 * 1024 * 1024) { // 5 MB
                setFormError(prevErrors => ({
                    ...prevErrors,
                    images: 'Image size must be less than 5 MB.'
                }));
            } else {
                setFormError(prevErrors => ({
                    ...prevErrors,
                    images: ''
                }));
                setCategoryData({
                    ...categoryData,
                    images: selectedFile
                });
            }
        }
    };

    const onDeleteImg = async (name, value) => {
        if (categoryData && categoryData?.images && categoryData.images?.name) {
            setCategoryData({...categoryData, images: ""})
        } else {
            setCategoryData({...categoryData, [name]: value, images: ""})
        }
    }

    const deleteCustomer =  (index) => {
        setOpenDelete(true);
        setSelectedIndex(index)
    };

    const handleDelete = (type, index, data) => {
        setIsLoading(true);
        let clone = [...tables];
         if (type === 'sub') {
            let updatedTable = { ...clone[index] };
            updatedTable.data = updatedTable.data.filter(item => item.title !== data.title);
            clone[index] = updatedTable;
             toast({ description: 'Subcategory deleted successfully!' });
        } else {
             clone.splice(selectedIndex, 1);
             toast({ description: 'Category deleted successfully!' });
         }
        setTables(clone);
        setOpenDelete(false);
        setIsLoading(false);
    };

    // const deleteCategory = async (id) => {
    //     const data = await apiService.deleteCategories(id)
    //     if(data.status === 200) {
    //
    //     }
    // }

    const deleteRow = (id) => {
        setIdToDelete(id);
        setOpenDelete(true);
    }

    const deleteCategory = async () => {
        setIsLoadingDelete(true)
        const data = await apiService.deleteCategories(idToDelete)
        const clone = [...categoryList];
        const index = clone.findIndex((x) => x.id == idToDelete)
        if (data.status === 200) {
            setIsLoadingDelete(false)
            if (index !== -1) {
                clone.splice(index, 1)
                setCategoryList(clone);
            }
            // setTotalRecord(Number(totalRecord) - 1)
            toast({
                description: data.message,
            })
        } else {
            setIsLoadingDelete(false)
            toast({
                description: data.message,
                variant: "destructive"
            })
        }
        setOpenDelete(false);
    }

    return (
        <Fragment>
            {isSheetOpen && (
                <Sheet open={isSheetOpen} onOpenChange={isSheetOpen ? closeSheet : openSheet}>
                    <SheetOverlay className={"inset-0"} />
                    <SheetContent className={"sm:max-w-[662px] p-0"}>
                        <SheetHeader className={"px-3 py-4 lg:px-8 lg:py-[20px] flex flex-row justify-between items-center border-b"}>
                            <h5 className={"text-sm md:text-xl font-normal"}>
                                {type === "cate"
                                    ? (editData ? "Update Category" : "Create New Category")
                                    : (editData ? "Update Subcategory" : "Create New Subcategory")}
                            </h5>
                            <X onClick={closeSheet} size={18} className={"cursor-pointer m-0"} />
                        </SheetHeader>
                        <div className={"h-[calc(100%_-_69px)] overflow-y-auto"}>
                        <div className={"sm:px-8 sm:py-6 px-3 py-4 border-b space-y-6"}>
                            <div className="grid w-full gap-2">
                                <Label htmlFor="category-name" className={"font-normal"}>Category name</Label>
                                <Input
                                    value={categoryData?.title}
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
                                    value={categoryData?.description}
                                    onChange={(e) => handleOnChange("description", e.target.value)}
                                />
                                {formError?.description && <span className="text-red-500 text-sm">{formError?.description}</span>}
                            </div>
                            <div className={"flex flex-col gap-2"}>
                                <Label className={"font-normal"}>Category Icon</Label>
                            <div className="w-[282px] h-[128px] flex gap-1">
                                {/*{categoryData?.images && categoryData?.images instanceof File ? (*/}
                                {/*    <div className={"w-[282px] h-[128px] relative border p-[5px]"}>*/}
                                {/*        <img*/}
                                {/*            className={"upload-img"}*/}
                                {/*            src={URL.createObjectURL(categoryData?.images)}*/}
                                {/*            alt="Uploaded icon"*/}
                                {/*            // onLoad={() => URL.revokeObjectURL(categoryData.image)}*/}
                                {/*        />*/}
                                {/*        <CircleX className={`${theme === "dark" ? "text-card-foreground" : "text-muted-foreground"} cursor-pointer absolute top-[0%] left-[100%] translate-x-[-50%] translate-y-[-50%] z-10`} size={20} onClick={() => handleOnChange("images", null)} />*/}
                                {/*    </div>*/}
                                {/*) : (*/}
                                {/*    <div>*/}
                                {/*        <input*/}
                                {/*            id="imageInput"*/}
                                {/*            type="file"*/}
                                {/*            className="hidden"*/}
                                {/*            onChange={handleImageUpload}*/}
                                {/*            accept={".jpg,.jpeg"}*/}
                                {/*        />*/}
                                {/*        <label*/}
                                {/*            htmlFor="imageInput"*/}
                                {/*            className="border-dashed w-[282px] h-[128px] py-[52px] flex items-center justify-center bg-muted border border-muted-foreground rounded cursor-pointer"*/}
                                {/*        >*/}
                                {/*            <Upload className="h-4 w-4 text-muted-foreground" />*/}
                                {/*        </label>*/}
                                {/*    </div>*/}
                                {/*)}*/}

                                {
                                    categoryData?.images ?
                                        <div>
                                            {categoryData && categoryData?.images && categoryData?.images?.name ?
                                                <div className={"w-[282px] h-[128px] relative border p-[5px]"}>
                                                    <img
                                                        className={"upload-img"}
                                                        src={categoryData && categoryData?.images && categoryData?.images?.name ? URL.createObjectURL(categoryData?.images) : categoryData?.images}
                                                        alt=""
                                                    />
                                                    <CircleX
                                                        size={20}
                                                        className={`${theme === "dark" ? "text-card-foreground" : "text-muted-foreground"} cursor-pointer absolute top-[0%] left-[100%] translate-x-[-50%] translate-y-[-50%] z-10`}
                                                        onClick={() => onDeleteImg('delete_image', categoryData && categoryData?.images && categoryData?.images?.name ? "" : categoryData?.images.replace("https://code.quickhunt.app/public/storage/help/category/", ""))}
                                                    />
                                                </div> :
                                                <div className={"w-[282px] h-[128px] relative border p-[5px]"}>
                                                    <img className={"upload-img"} src={categoryData?.images}
                                                         alt=""/>
                                                    <CircleX
                                                        size={20}
                                                        className={`${theme === "dark" ? "text-card-foreground" : "text-muted-foreground"} cursor-pointer absolute top-[0%] left-[100%] translate-x-[-50%] translate-y-[-50%] z-10`}
                                                        onClick={() => onDeleteImg('delete_image', categoryData && categoryData?.images && categoryData?.images?.name ? "" : categoryData?.images.replace("https://code.quickhunt.app/public/storage/help/category/", ""))}
                                                    />
                                                </div>
                                            }
                                        </div> :
                                        <div>
                                            <input
                                                id="pictureInput"
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
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
                                className={`border w-[132px] font-medium hover:bg-primary ${isSave ? "justify-center items-center" : ""}`}
                                onClick={type === 'sub' ? addSubCategory : addCategory}
                            >
                                {isSave ? <Loader2 className="h-4 w-4 animate-spin" /> : (type === 'sub' ? "Save Subcategory" : "Save Category")}
                            </Button>

                            <Button
                                variant={"ghost hover:bg-none"}
                                onClick={closeSheet}
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
                                        <DialogTitle className={"text-start"}>You really want delete this category ?</DialogTitle>
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
                                        Delete
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
                            onClick={() => openSheet("cate")}
                            className={"gap-2 font-medium hover:bg-primary"}
                        >
                            <Plus size={20} strokeWidth={3} />New Category
                        </Button>
                    </div>
                </div>

                {

                        (categoryList || []).map((x, i) => (
                            <div key={i} className={"mt-6"}>
                                <Card className={""}>
                                    <CardContent className={"p-0"}>
                                        <div className={"rounded-md grid grid-cols-1 overflow-auto whitespace-nowrap"}>
                                            <Table>
                                                <TableHeader className={`${theme === "dark" ? "" : "bg-muted"} py-8 px-5`}>
                                                    <TableRow className={""}>
                                                        <TableHead className={`px-2 py-[10px] md:px-3 text-primary font-medium w-[300px]`}>
                                                            {x?.title}
                                                        </TableHead>
                                                        <TableHead className={`font-medium px-2 py-[10px] md:px-3 w-[300px]`}>Description</TableHead>
                                                        <TableHead className={`font-medium px-2 py-[10px] md:px-3 w-[300px]`}>Articles</TableHead>
                                                        <TableHead className={`font-medium px-2 py-[10px] md:px-3 w-[300px]`}>Created at</TableHead>
                                                        <TableHead className={`font-medium px-2 py-[10px] md:px-3 w-[300px]`}>
                                                            <div className={"space-x-2"}>
                                                                <Button
                                                                    size={"sm"}
                                                                    variant={"ghost hover:bg-none"}
                                                                    onClick={() => openSheet('sub',x.id)}
                                                                    className={"mr-3 border border-primary font-normal text-primary py-2 px-3"}
                                                                >
                                                                    <Plus size={16} className={"mr-2"} /> Add Subcategory
                                                                </Button>
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger>
                                                                        <Ellipsis size={16} />
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align={"end"}>
                                                                        <DropdownMenuItem className={"cursor-pointer"} onClick={() => openSheet('cate', i, x.id)}>Edit</DropdownMenuItem>
                                                                        <DropdownMenuItem className={"cursor-pointer"} onClick={() => deleteRow(x.id)}>Delete</DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </div>
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {subCategoryList.map((y, j) => (
                                                        <TableRow key={j} className="">
                                                            <TableCell className={`inline-flex gap-2 md:gap-1 flex-wrap items-center px-2 py-[10px] md:px-3 w-[300px]`}>
                                                                <span className={"cursor-pointer text-ellipsis overflow-hidden whitespace-nowrap"}>{y.title}</span>
                                                            </TableCell>
                                                            <TableCell className={"px-2 py-[10px] md:px-3 w-[300px]"}>
                                                                <span className={"cate-ellipsis"} dangerouslySetInnerHTML={{ __html: y.description || "-" }}/>
                                                            </TableCell>
                                                            <TableCell className={"px-2 py-[10px] md:px-3 w-[300px]"}>
                                                                {y.articles ? y.articles : "00"}
                                                            </TableCell>
                                                            <TableCell className={"px-2 py-[10px] md:px-3 w-[300px]"}>
                                                                {y?.updated_at ? moment.utc(y.updated_at).local().startOf('seconds').fromNow() : "-"}
                                                            </TableCell>
                                                            <TableCell className={"px-2 py-[10px] md:px-3 w-[300px] text-center"}>
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger>
                                                                        <Ellipsis className={`font-normal`} size={18} />
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align={"end"}>
                                                                        <DropdownMenuItem className={"cursor-pointer"} onClick={() => openSheet('sub', i, y)}>Edit</DropdownMenuItem>
                                                                        <DropdownMenuItem className={"cursor-pointer"} onClick={() => handleDelete('sub', i, y)}>Delete</DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))

                }

            </div>
        </Fragment>
    );
};

export default Category;
