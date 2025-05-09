import React, {useState, Fragment, useEffect,} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../../ui/card";
import {Button} from "../../ui/button";
import {Check, Loader2, Pencil, Plus, Trash2, X} from "lucide-react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../ui/table";
import {useTheme} from "../../theme-provider";
import {Input} from "../../ui/input";
import {useSelector, useDispatch} from "react-redux";
import moment from "moment";
import {allStatusAndTypesAction} from "../../../redux/action/AllStatusAndTypesAction";
import {toast} from "../../ui/use-toast";
import EmptyData from "../../Comman/EmptyData";
import DeleteDialog from "../../Comman/DeleteDialog";
import {apiService} from "../../../utils/constent";

const initialState = {
    title: "",
    description: ""
}

const Categories = () => {
    const {theme} = useTheme();
    const dispatch = useDispatch();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);

    const [formError, setFormError] = useState(initialState);
    const [categoriesList, setCategoriesList] = useState([]);
    const [isSave, setIsSave] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);
    const [isEdit, setIsEdit] = useState(null);

    useEffect(() => {
        if (allStatusAndTypes.categories) {
            getAllCategory();
        }
    }, [allStatusAndTypes.categories]);

    const getAllCategory = async () => {
        setCategoriesList(allStatusAndTypes.categories);
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
            case "title":
                if (!value || value.trim() === "") {
                    return "Category name is required";
                } else {
                    return "";
                }
            case "description":
                if (!value || value.trim() === "") {
                    return "Description is required";
                } else {
                    return "";
                }
            default: {
                return "";
            }
        }
    };

    const addCategory = async (newCategory, index) => {
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
            projectId: projectDetailsReducer.id,
            title: newCategory.title,
            description: newCategory.description
        }

        const clone = [...categoriesList];
        const data = await apiService.createCategorySettings(payload)

        if (data.success) {
            clone.push(data.data);
            clone.splice(index, 1);
            dispatch(allStatusAndTypesAction({...allStatusAndTypes, categories: clone}))
            setCategoriesList(clone);
            setIsSave(false);
            toast({description: data.message});
        } else {
            toast({description: data?.error.message, variant: "destructive"})
        }
        setIsEdit(null);
    }

    const onDelete = async () => {
        setIsLoadingDelete(true)
        const data = await apiService.deleteCategorySettings(deleteId);
        const clone = [...categoriesList];
        const deleteToIndex = clone.findIndex((x) => x.id == deleteId);
        if (data.success) {
            clone.splice(deleteToIndex, 1);
            dispatch(allStatusAndTypesAction({...allStatusAndTypes, categories: clone}));
            setCategoriesList(clone);
            toast({description: data.message});
        } else {
            toast({description: data?.error.message, variant: "destructive"});
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
        const clone = [...categoriesList];
        if (isEdit !== null && !clone[isEdit]?.id) {
            clone.splice(isEdit, 1)
            setIsEdit(index)
            setCategoriesList(clone);
        } else if (isEdit !== index) {
            setCategoriesList(allStatusAndTypes?.categories);
            setIsEdit(index);
        } else {
            setIsEdit(index);
        }
    }

    const handleInputChange = (event, index) => {
        const {name, value} = event.target;
        const updatedCategory = [...categoriesList];
        updatedCategory[index] = {...updatedCategory[index], [name]: value, description: value};
        setCategoriesList(updatedCategory);
        setFormError({
            ...formError,
            [name]: formValidate(name, value)
        });
    }

    const handleSaveCategory = async (index) => {
        const clone = [...categoriesList];
        const topicToSave = clone[index];

        if (!topicToSave.title || topicToSave.title.trim() === "") {
            setFormError({...formError, title: "Category name is required."});
            return;
        }
        setIsSave(true);
        const payload = {
            title: topicToSave.title,
            description: topicToSave.description,
            projectId: projectDetailsReducer.id,
        }
        const data = await apiService.updateCategorySettings(payload, topicToSave.id);
        if (data.success) {
            const clone = [...categoriesList];
            const index = clone.findIndex((x) => x.id === topicToSave.id)
            if (index !== -1) {
                clone[index] = data.data;
                dispatch(allStatusAndTypesAction({...allStatusAndTypes, categories: clone}));
                setCategoriesList(clone)
            }
            setIsSave(false);
            toast({description: data.message});
            setIsEdit(null);
        } else {
            setIsSave(false);
            toast({description: data?.error.message, variant: "destructive"});
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
                <DeleteDialog
                    title={"You really want to delete this Category?"}
                    isOpen={openDelete}
                    onOpenChange={() => setOpenDelete(false)}
                    onDelete={onDelete}
                    isDeleteLoading={isLoadingDelete}
                    deleteRecord={deleteId}
                />
            }

            <Card>
                <CardHeader
                    className={"p-6 gap-1 border-b flex flex-row flex-wrap justify-between items-center p-4 sm:px-5 sm:py-4 gap-y-2"}>
                    <div>
                        <CardTitle className={"text-xl lg:text-2xl font-normal"}>Categories</CardTitle>
                        <CardDescription className={"text-sm text-muted-foreground p-0 mt-1"}>Organize your changelog
                            with categories.</CardDescription>
                    </div>
                    <Button disabled={isEdit != null} onClick={addNewTopic}
                            className={"gap-2 font-medium hover:bg-primary m-0"}>
                        <Plus size={18} strokeWidth={3}/>New Categories
                    </Button>
                </CardHeader>
                <CardContent className={"p-0"}>
                    <div className={"grid grid-cols-1 overflow-auto whitespace-nowrap"}>
                        <Table>
                            <TableHeader className={`dark:bg-transparent bg-muted`}>
                                <TableRow>
                                    {
                                        ["Category Name", "Last Update", "Action"].map((x, i) => {
                                            return (
                                                <TableHead
                                                    className={`${i == 0 ? "w-2/5" : i == 1 ? "w-2/5" : ""} text-sm font-normal px-2 py-[10px] md:px-3 text-card-foreground dark:text-muted-foreground`}>{x}</TableHead>
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
                                                (categoriesList || []).map((x, i) => {
                                                    return (
                                                        <TableRow key={i}>
                                                            {
                                                                isEdit == i ?
                                                                    <Fragment>
                                                                        <TableCell className={"px-[12px] py-[10px]"}>
                                                                            <Input
                                                                                placeholder={"Enter Category Name"}
                                                                                className={"bg-card h-9"}
                                                                                type="title"
                                                                                value={x.title}
                                                                                name={"title"}
                                                                                onBlur={onBlur}
                                                                                onChange={(e) => handleInputChange(e, i)}
                                                                            />
                                                                            {
                                                                                formError.title ?
                                                                                    <div className="grid gap-2 mt-[4px]">
                                                                                        <span className="text-red-500 text-sm">{formError.title}</span>
                                                                                    </div> : ""
                                                                            }
                                                                        </TableCell>
                                                                        <TableCell/>
                                                                        <TableCell
                                                                            className={`px-2 py-[10px] pt-[13px] md:px-3 font-normal text-xs align-top ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                                            <div className={"flex items-center gap-2"}>
                                                                                <Fragment>
                                                                                    {
                                                                                        x.id ? <Button
                                                                                            variant="outline hover:bg-transparent"
                                                                                            className={`p-1 border w-[30px] h-[30px]`}
                                                                                            onClick={() => handleSaveCategory(i)}
                                                                                        >
                                                                                            {isSave ? <Loader2
                                                                                                    className="h-4 w-4 animate-spin"/> :
                                                                                                <Check size={16}/>}
                                                                                        </Button> : <Button
                                                                                            className="text-sm font-medium h-[30px] w-[112px] hover:bg-primary"
                                                                                            onClick={() => addCategory(x, i)}
                                                                                        >
                                                                                            {isSave ? <Loader2
                                                                                                className={"h-4 w-4 animate-spin"}/> : "Add Category"}
                                                                                        </Button>
                                                                                    }

                                                                                    <Button
                                                                                        variant="outline hover:bg-transparent"
                                                                                        className="p-1 border w-[30px] h-[30px]"
                                                                                        onClick={() => x.id ? onEditCancel() : onEdit(null)}
                                                                                    >
                                                                                        <X size={16}/>
                                                                                    </Button>
                                                                                </Fragment>
                                                                            </div>
                                                                        </TableCell>
                                                                    </Fragment>
                                                                    :
                                                                    <Fragment>
                                                                        <TableCell
                                                                            className={`px-2 py-[10px] md:px-3 font-normal text-xs max-w-[140px] truncate text-ellipsis overflow-hidden whitespace-nowrap ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                                            {x.title}
                                                                        </TableCell>
                                                                        <TableCell
                                                                            className={`px-2 py-[10px] md:px-3 font-normal text-xs ${theme === "dark" ? "" : "text-muted-foreground"}`}>{moment.utc(x.updatedAt).local().startOf('seconds').fromNow()}</TableCell>
                                                                        <TableCell
                                                                            className={`px-2 py-[10px] md:px-3  ${theme === "dark" ? "" : "text-muted-foreground"}} `}>
                                                                            <div className={"flex items-center"}>
                                                                                <div className="pr-0">
                                                                                    <Button onClick={() => onEdit(i)}
                                                                                            variant={"outline hover:bg-transparent"}
                                                                                            className={`p-1 border w-[30px] h-[30px] text-muted-foreground`}><Pencil
                                                                                        size={16}/></Button>
                                                                                </div>
                                                                                <div className="pl-2"><Button
                                                                                    onClick={() => deleteCategory(x.id)}
                                                                                    variant={"outline hover:bg-transparent"}
                                                                                    className={`p-1 border w-[30px] h-[30px] text-muted-foreground`}><Trash2
                                                                                    size={16}/></Button></div>
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
                                        <TableRow>
                                            <TableCell colSpan={6}><EmptyData/></TableCell>
                                        </TableRow>
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