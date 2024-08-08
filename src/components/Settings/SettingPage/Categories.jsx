import React, {useState,Fragment,useEffect,} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../../ui/card";
import {Button} from "../../ui/button";
import {Loader2, Pencil, Plus, Trash2, X} from "lucide-react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../ui/table";
import {useTheme} from "../../theme-provider";
import {Input} from "../../ui/input";
import {Sheet, SheetContent, SheetHeader, SheetOverlay, SheetTitle} from "../../ui/sheet";
import {Label} from "../../ui/label";
import {Separator} from "../../ui/separator";
import {ApiService} from "../../../utils/ApiService";
import {useSelector,useDispatch} from "react-redux";
import moment from "moment";
import {allStatusAndTypesAction} from "../../../redux/action/AllStatusAndTypesAction";
import {toast} from "../../ui/use-toast";
import {Skeleton} from "../../ui/skeleton";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "../../ui/alert-dialog";
import NoDataThumbnail from "../../../img/Frame.png";

const initialState = {
    name:"",
    description:""
}

const Categories = () => {
    const [isSheetOpen, setSheetOpen] = useState(false);
    const [editRecord,setEditRecord]=useState({})
    const { theme } = useTheme();
    const [categoryDetails,setCategoryDetails] =useState(initialState);
    const [formError, setFormError] = useState(initialState);
    const [isLoading,setIsLoading]= useState(true);
    const [categoriesList,setCategoriesList]=useState([]);
    const [isSave,setIsSave]=useState(false);
    const [isOpenDeleteAlert,setIsOpenDeleteAlert] =useState(false);
    const [deleteId,setDeleteId]= useState(null);
    const [deleteIndex,setDeleteIndex]=useState(null);
    const apiService = new ApiService();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const dispatch = useDispatch();

    useEffect(() => {
        if(allStatusAndTypes.categories){
            getAllCategory();
        }
    }, [allStatusAndTypes.categories]);

    const getAllCategory = async () => {
        setIsLoading(true);
        setCategoriesList(allStatusAndTypes.categories);
        setIsLoading(false);
    }

    const onEditOption = (record) => {
            setEditRecord(record);
            setSheetOpen(true);
            setCategoryDetails({...record});
    }
    const openSheet = () => setSheetOpen(true);
    const closeSheet = () => {
        setSheetOpen(false);
        setEditRecord({});
    };

    const onChange = (e) => {
        setCategoryDetails({...categoryDetails,[e.target.name]:e.target.value});
        setFormError(formError => ({...formError, [e.target.name]: ""}));
    }

    const onBlur = (e) => {
        const { name, value } = e.target;
        setFormError({
            ...formError,
            [name]: formValidate(name, value)
        });
    };

    const formValidate = (name, value) => {
        switch (name) {
            case "name":
                if (!value || value.trim() === "") {
                    return "Name is required";
                }else {
                    return "";
                }
            case "description":
                if (!value || value.trim() === "") {
                    return "Description is required";
                }else {
                    return "";
                }
            default: {
                return "";
            }
        }
    };

    const addCategory = async () => {
        let validationErrors = {};
        Object.keys(categoryDetails).forEach(name => {
            const error = formValidate(name, categoryDetails[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
            return;
        }
        setIsSave(true);
        const payload = {
            project_id: projectDetailsReducer.id,
            name: categoryDetails.name,
            description: categoryDetails.description
        }
        setIsSave(true)
        const data = await apiService.createCategory(payload)
        if(data.status === 200){
            const clone = [...categoriesList];
            let index = clone.findIndex((x) => x.id === categoryDetails.id);
            if(index === -1){
                clone.unshift(data.data);
                dispatch(allStatusAndTypesAction({...allStatusAndTypes, categories: clone}));
                setCategoriesList(clone);
            }
            setCategoriesList(clone)
            setIsSave(false);
            closeSheet();
            toast({
                description:"Category added successfully."
            });
            setCategoryDetails({
                name:"",
                description:""
            })
        } else {
            toast({
                description:"Something went wrong.",
                variant: "destructive"
            })
        }
    }

    const onDelete = async () => {
        const data = await apiService.deleteCategories(deleteId)
        if(data.status === 200) {
            const clone = [...categoriesList];
            setCategoriesList(clone);
            clone.splice(deleteIndex,1);
            dispatch(allStatusAndTypesAction({...allStatusAndTypes, categories: clone}));
            setCategoriesList(clone);
            toast({
                description:"Category delete successfully"
            })
        }
        else{
            toast({
                description:data.message,
                variant: "destructive"
            })
        }
    }

    const deleteCategory = (id,index) => {
        setIsOpenDeleteAlert(true);
        setDeleteId(id);
        setDeleteIndex(index);
    }

    const updateCategory = async () => {
        let validationErrors = {};
        Object.keys(categoryDetails).forEach(name => {
            const error = formValidate(name, categoryDetails[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
            return;
        }
        setIsSave(true);

        const payload = {
            project_id: projectDetailsReducer.id,
            name: categoryDetails.name,
            description: categoryDetails.description
        };
        setIsSave(true)
        const data = await  apiService.updateCategory(payload, categoryDetails.id)
        if(data.status === 200){
            const clone = [...categoriesList];
            let index = clone.findIndex((x) => x.id === categoryDetails.id);
            if(index !== -1){
                clone[index] = {...data.data}
                dispatch(allStatusAndTypesAction({...allStatusAndTypes, categories: clone}))
            }
            setCategoriesList(clone)
            setCategoryDetails(initialState);
            setIsSave(false);
            toast({
                description:"Category update successfully",
            })
        } else {
            setIsSave(false);
            toast({
                description:data.message,
                variant: "destructive"
            })
        }
        setEditRecord({});
        closeSheet();
    }

    return (
        <Fragment>
            <AlertDialog open={isOpenDeleteAlert} onOpenChange={setIsOpenDeleteAlert}>
                <AlertDialogContent className={"w-[310px] md:w-full rounded-lg"}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>You really want delete Category?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action can't be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className={"flex justify-end gap-2"}>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className={"bg-red-600 hover:bg-red-600"} onClick={onDelete}>Delete</AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
            <Card>
                <CardHeader className={"p-6 gap-1 border-b flex flex-row flex-wrap justify-between items-center p-4 sm:p-6 gap-y-2"}>
                    <div>
                        <CardTitle className={"text-lg sm:text-2xl font-medium leading-8"}>Categories</CardTitle>
                        <CardDescription className={"text-sm text-muted-foreground p-0 mt-1 leading-5"}>Use Categories to organise your Changelog</CardDescription>
                    </div>
                    <div className={"m-0"}>
                        <Button onClick={openSheet} className={"text-sm font-semibold"}><Plus size={16} className={"mr-1 text-[#f9fafb]"} /> New Categories</Button>
                    </div>
                </CardHeader>
                <CardContent className={"p-0"}>
                                    <Table>
                                        <TableHeader className={""}>
                                            <TableRow>
                                                <TableHead className={`w-2/5 pl-4 ${theme === "dark" ? "" : "text-card-foreground"}`}>Label Name</TableHead>
                                                <TableHead className={`text-center ${theme === "dark" ? "" : "text-card-foreground"}`}>Last Update</TableHead>
                                                <TableHead className={`pr-[39px] text-end ${theme === "dark" ? "" : "text-card-foreground"}`}>Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        {
                                            isLoading ? <TableBody>
                                                    {
                                                        [...Array(5)].map((_, index) => {
                                                            return (
                                                                <TableRow key={index}>
                                                                    {
                                                                        [...Array(3)].map((_, i) => {
                                                                            return (
                                                                                <TableCell key={i} className={"px-2"}>
                                                                                    <Skeleton className={`rounded-md  w-full h-[24px] ${i == 0 ? "w-full" : ""}`}/>
                                                                                </TableCell>
                                                                            )
                                                                        })
                                                                    }
                                                                </TableRow>
                                                            )
                                                        })
                                                    }
                                                </TableBody> :
                                            <TableBody>
                                                    {
                                                        (categoriesList || []).map((x,index)=>{
                                                            return(
                                                                <TableRow key={x.id}>
                                                                    <TableCell className={`font-medium text-xs py-[8.5px] pl-4 ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                                        {x.name}
                                                                    </TableCell>
                                                                    <TableCell className={`font-medium text-xs leading-normal text-center ${theme === "dark" ? "" : "text-muted-foreground"}`}>{moment.utc(x.updated_at).local().startOf('seconds').fromNow()}</TableCell>
                                                                    <TableCell className={"flex justify-end"}>
                                                                        <div className="pr-0">
                                                                            <Button onClick={() => onEditOption(x,index)} variant={"outline hover:bg-transparent"} className={`p-1 border w-[30px] h-[30px]`}><Pencil size={16}/></Button>
                                                                        </div>
                                                                        <div className="pl-2"><Button onClick={()=>deleteCategory(x.id,index)} variant={"outline hover:bg-transparent"} className={`p-1 border w-[30px] h-[30px]`}><Trash2 size={16} /></Button></div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            )
                                                        })
                                                    }
                                                </TableBody>
                                        }
                                    </Table>
                                {isLoading === false && categoriesList.length === 0 && <div className={"flex flex-row justify-center py-[45px]"}>
                                    <div className={"flex flex-col items-center gap-2"}>
                                        <img src={NoDataThumbnail} className={"flex items-center"}/>
                                        <h5 className={`text-center text-2xl font-medium leading-8 ${theme === "dark" ? "" : "text-[#A4BBDB]"}`}>No Data</h5>
                                    </div>
                                </div>}
                </CardContent>
            </Card>
            {isSheetOpen && (
                <Sheet open={isSheetOpen} onOpenChange={isSheetOpen ? closeSheet : openSheet}>
                    <SheetOverlay className={"inset-0"} />
                    <SheetContent className={"sm:max-w-[662px] p-0"}>
                        <SheetHeader className={"px-4 py-3 md:py-5 lg:px-8 lg:py-[20px] border-b flex flex-row justify-between items-center"}>
                            <SheetTitle className={"text-sm md:text-xl font-medium flex justify-between items-center"}>
                                {editRecord.id ? "Edit New Category" : "New Category"}
                            </SheetTitle>
                            <X className={"cursor-pointer m-0"} onClick={closeSheet}/>
                        </SheetHeader>
                        <div className="overflow-auto comm-sheet-height">
                            <div className="grid gap-6 px-3 py-4 sm:px-8 sm:py-6 border-b">
                            <div className={"flex flex-col gap-6"}>
                                <div className="grid w-full gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input onChange={onChange} value={categoryDetails.name} name={"name"} onBlur={onBlur} placeholder={"Enter the name of Category"} type="text" id="name" className={"h-9"}/>
                                    {formError?.name && <span className={"text-red-500 text-sm"}>{formError?.name}</span>}
                                </div>
                                <div className="grid w-full gap-2">
                                    <Label htmlFor="Description">Description</Label>
                                    <Input onChange={onChange} value={categoryDetails.description} name={"description"}  placeholder={"Enter the Description of Category"} type="text" id="Description" className={"h-9"}/>
                                    {formError?.description && <span className={"text-red-500 text-sm"}>{formError?.description}</span>}
                                </div>
                            </div>
                        </div>
                        <div className={"sm:px-8 sm:py-6 py-4 px-3"}>
                            <Button
                                className={`${isSave === true ? "py-2 px-4" : "py-2 px-4 w-[147px]"} text-sm font-semibold`}
                                onClick={editRecord?.id ? updateCategory : addCategory}
                            >
                                {isSave ? <Loader2 className={"mr-2 h-4 w-4 animate-spin"}/> : editRecord.id ? "Update Category" : "Add Category" }
                            </Button>
                        </div>
                        </div>
                    </SheetContent>
                </Sheet>
            )}
        </Fragment>
    );
};

export default Categories;