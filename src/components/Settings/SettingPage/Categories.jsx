import React, {useState, Fragment, useEffect,} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../../ui/card";
import {Button} from "../../ui/button";
import {Check, Loader2, Pencil, Plus, Trash2, X} from "lucide-react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../ui/table";
import {useTheme} from "../../theme-provider";
import {Input} from "../../ui/input";
import {ApiService} from "../../../utils/ApiService";
import {useSelector, useDispatch} from "react-redux";
import moment from "moment";
import {allStatusAndTypesAction} from "../../../redux/action/AllStatusAndTypesAction";
import {toast} from "../../ui/use-toast";
import {Dialog} from "@radix-ui/react-dialog";
import {DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "../../ui/dialog";
import EmptyData from "../../Comman/EmptyData";

const initialState = {
    name: "",
    description: ""
}

const Categories = () => {
    const {theme} = useTheme();
    const [formError, setFormError] = useState(initialState);
    const [isLoading, setIsLoading] = useState(true);
    const [categoriesList, setCategoriesList] = useState([]);
    const [isSave, setIsSave] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);
    const [isEdit,setIsEdit] =useState(null);
    const apiService = new ApiService();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const dispatch = useDispatch();

    useEffect(() => {
        if (allStatusAndTypes.categories) {
            getAllCategory();
        }
    }, [allStatusAndTypes.categories]);

    const getAllCategory = async () => {
        setCategoriesList(allStatusAndTypes.categories);
        setIsLoading(false);
    }

    const onBlur = (e) => {
        const {name, value} = e.target;
        setFormError({
            ...formError,
            [name]: formValidate(name, value)
        });
    };

    const formValidate = (name, value) => {
        switch (name) {
            case "name":
                if (!value || value.trim() === "") {
                    return "Category name is required";
                } else {
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

    const addCategory = async (newCategory,index) => {
        let validationErrors = {};
        Object.keys(newCategory).forEach(name => {
            const error = formValidate(name, newCategory[name]);
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
            name: newCategory.name,
            description: newCategory.description
        }

        const clone = [...categoriesList];
        const data = await apiService.createCategory(payload)

        if(data.status === 200){
            clone.push(data.data);
            clone.splice(index,1);
            dispatch(allStatusAndTypesAction({...allStatusAndTypes, categories: clone}))
            setCategoriesList(clone);
            setIsSave(false);
            toast({
                description:data.message
            });
        } else {
            toast({
                description:data.message,
                variant: "destructive"
            })
        }
        setIsEdit(null);
    }

    const onDelete = async () => {
        setIsLoadingDelete(true)
        const data = await apiService.deleteCategories(deleteId);
        const clone = [...categoriesList];
        const deleteToIndex = clone.findIndex((x)=> x.id == deleteId);
        if(data.status === 200) {

            setCategoriesList(clone);
            clone.splice(deleteToIndex,1);
            dispatch(allStatusAndTypesAction({...allStatusAndTypes, categories: clone}));
            setCategoriesList(clone);
            toast({
                description:data.message
            });
        }
        else{
            toast({
                description:data.message,
                variant: "destructive"
            });
        }
        setIsLoadingDelete(false);
        setOpenDelete(false);
    }

    const deleteCategory = (id) => {
        setDeleteId(id);
        setOpenDelete(true);
        setCategoriesList(allStatusAndTypes.categories);
        setIsEdit(null)
    }

    const addNewTopic = () => {
        const clone = [...categoriesList];
        clone.push(initialState);
        setCategoriesList(clone);
        setIsEdit(clone.length - 1);
        setFormError(initialState);
    }

    const onEdit = (index) => {
        setFormError(initialState);
        const clone =[...categoriesList];
        if(isEdit !== null && !clone[isEdit]?.id){
            clone.splice(isEdit, 1)
            setIsEdit(index)
            setCategoriesList(clone);
        } else if (isEdit !== index){
            setCategoriesList(allStatusAndTypes?.categories);
            setIsEdit(index);
        }
        else {
            setIsEdit(index);
        }
    }

    const handleInputChange = (event,index) => {
        const { name, value } = event.target;
        const updatedCategory = [...categoriesList];
        updatedCategory[index] = { ...updatedCategory[index], [name]: value,description:value};
        setCategoriesList(updatedCategory);
        setFormError(x => ({...x, [name]: ""}));
    }

    const handleSaveCategory = async (index) => {
        const clone = [...categoriesList];
        const topicToSave = clone[index];

        if (!topicToSave.name || topicToSave.name.trim() === "") {
            setFormError({...formError, name: "Label name is required."});
            return;
        }
        setIsSave(true);
        const payload = {
            name: topicToSave.name,
            description:topicToSave.description,
            project_id: projectDetailsReducer.id,
        }
        const data = await apiService.updateCategory(payload, topicToSave.id);
        if(data.status === 200){
            const clone = [...categoriesList];
            const index = clone.findIndex((x) => x.id === topicToSave.id)
            if(index !== -1){
                clone[index] = data.data;
                dispatch(allStatusAndTypesAction({...allStatusAndTypes, categories: clone}));
                setCategoriesList(clone)
            }
            setIsSave(false);
            toast({
                description:data.message
            });
            setIsEdit(null);
        } else {
            setIsSave(false);
            toast({
                description:data.message,
                variant: "destructive"
            });
        }
    }

    const onEditCancel = () => {
        setIsEdit(null)
        setCategoriesList(allStatusAndTypes?.categories);
    }

    return (
        <Fragment>
            {
                openDelete &&
                <Fragment>
                    <Dialog open onOpenChange={()=> setOpenDelete(false)}>
                        <DialogContent className="max-w-[350px] w-full sm:max-w-[525px] p-3 md:p-6 rounded-lg">
                            <DialogHeader className={"flex flex-row justify-between gap-2"}>
                                <div className={"flex flex-col gap-2"}>
                                    <DialogTitle className={"text-start"}>You really want delete this Category?</DialogTitle>
                                    <DialogDescription className={"text-start"}>This action can't be undone.</DialogDescription>
                                </div>
                                <X size={16} className={"m-0 cursor-pointer"} onClick={() => setOpenDelete(false)}/>
                            </DialogHeader>
                            <DialogFooter className={"flex-row justify-end space-x-2"}>
                                <Button variant={"outline hover:none"}
                                        className={"text-sm font-semibold border"}
                                        onClick={() => setOpenDelete(false)}>Cancel</Button>
                                <Button
                                    variant={"hover:bg-destructive"}
                                    className={` ${theme === "dark" ? "text-card-foreground" : "text-card"} ${isLoading === true ? "py-2 px-6" : "py-2 px-6"} w-[76px] text-sm font-semibold bg-destructive`}
                                    onClick={onDelete}
                                >
                                    {isLoadingDelete ? <Loader2 size={16} className={"animate-spin"}/> : "Delete"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </Fragment>
            }

            <Card>
                <CardHeader className={"p-6 gap-1 border-b flex flex-row flex-wrap justify-between items-center p-4 sm:p-6 gap-y-2"}>
                    <div>
                        <CardTitle className={"text-lg sm:text-2xl font-medium leading-8"}>Categories</CardTitle>
                        <CardDescription className={"text-sm text-muted-foreground p-0 mt-1 leading-5"}>Use Categories to organise your Changelog</CardDescription>
                    </div>
                    <Button size="sm" disabled={isEdit != null} onClick={addNewTopic} className={"gap-2 font-semibold hover:bg-primary m-0"}>
                        <Plus size={18} strokeWidth={3}/>New Categories
                    </Button>
                </CardHeader>
                <CardContent className={"p-0"}>
                    <div className={"grid grid-cols-1 overflow-auto whitespace-nowrap"}>
                        <Table>
                            <TableHeader className={""}>
                                <TableRow>
                                    {
                                        ["Category Name","Last Update","Action"].map((x,i)=>{
                                            return(
                                                <TableHead className={`${i == 0 ? "w-2/5" : i == 1 ? "text-center" : i == 2 ? "text-end" : ""}  px-2 py-[10px] md:px-3 ${theme === "dark" ? "" : "text-card-foreground"}`}>{x}</TableHead>
                                            )
                                        })
                                    }
                                </TableRow>
                            </TableHeader>
                                <TableBody>
                                    {
                                        categoriesList.length > 0 ?
                                            <Fragment>
                                                {
                                                    (categoriesList || []).map((x,i)=>{
                                                        return(
                                                            <TableRow key={i}>
                                                                {
                                                                    isEdit == i ?
                                                                        <Fragment>
                                                                            <TableCell className={"px-2 py-[10px] md:px-3"}>
                                                                                <Input
                                                                                    placeholder={"Enter category name"}
                                                                                    className={"bg-card h-9"}
                                                                                    type="title"
                                                                                    value={x.name}
                                                                                    name={"name"}
                                                                                    onBlur={onBlur}
                                                                                    onChange={(e) => handleInputChange(e, i)}
                                                                                />
                                                                                <div className="grid gap-2">
                                                                                    {formError.name && <span className="text-red-500 text-sm">{formError.name}</span>}
                                                                                </div>
                                                                            </TableCell>
                                                                            <TableCell/>
                                                                            <TableCell className={`px-2 py-[10px] pt-[13px] md:px-3 font-medium text-xs align-top ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                                                <div className={"flex justify-end items-center gap-2"}>
                                                                                    <Fragment>
                                                                                        {
                                                                                            x.id ? <Button
                                                                                                variant="outline hover:bg-transparent"
                                                                                                className={`p-1 border w-[30px] h-[30px]`}
                                                                                                onClick={() => handleSaveCategory(i)}
                                                                                            >
                                                                                                {isSave ? <Loader2 className="h-4 w-4 animate-spin"/> : <Check size={16}/>}
                                                                                            </Button> : <Button
                                                                                                variant=""
                                                                                                className="text-sm font-semibold h-[30px] w-[126px] hover:bg-primary"
                                                                                                onClick={() => addCategory(x, i)}
                                                                                            >
                                                                                                {isSave ? <Loader2 className={"h-4 w-4 animate-spin"}/> : "Add Category"}
                                                                                            </Button>
                                                                                        }

                                                                                        <Button
                                                                                            variant="outline hover:bg-transparent"
                                                                                            className="p-1 border w-[30px] h-[30px]"
                                                                                            onClick={() =>  x.id ? onEditCancel() : onEdit(null)}
                                                                                        >
                                                                                            <X size={16}/>
                                                                                        </Button>
                                                                                    </Fragment>
                                                                                </div>
                                                                            </TableCell>
                                                                        </Fragment>
                                                                        :
                                                                        <Fragment>
                                                                            <TableCell className={`font-medium text-xs px-2 py-[10px] md:px-3 ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                                                {x.name}
                                                                            </TableCell>
                                                                            <TableCell className={`px-2 py-[10px] md:px-3 font-medium text-xs leading-normal text-center ${theme === "dark" ? "" : "text-muted-foreground"}`}>{moment.utc(x.updated_at).local().startOf('seconds').fromNow()}</TableCell>
                                                                            <TableCell className={`px-2 py-[10px] md:px-3  ${theme === "dark" ? "" : "text-muted-foreground"}} `}>
                                                                                <div className={"flex justify-end items-center"}>
                                                                                    <div className="pr-0">
                                                                                        <Button onClick={() => onEdit(i)} variant={"outline hover:bg-transparent"} className={`p-1 border w-[30px] h-[30px] text-muted-foreground`}><Pencil size={16}/></Button>
                                                                                    </div>
                                                                                    <div className="pl-2"><Button onClick={()=>deleteCategory(x.id)} variant={"outline hover:bg-transparent"} className={`p-1 border w-[30px] h-[30px] text-muted-foreground`}><Trash2 size={16} /></Button></div>
                                                                                </div>
                                                                            </TableCell>
                                                                        </Fragment>
                                                                }
                                                            </TableRow>
                                                        )
                                                    })
                                                }
                                            </Fragment>
                                            :
                                            (categoriesList.length == 0 && isLoading == false) ? <TableRow>
                                                <TableCell colSpan={6}>
                                                    <EmptyData />
                                                </TableCell>
                                            </TableRow> :null
                                    }
                                </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </Fragment>
    );
};

export default Categories;