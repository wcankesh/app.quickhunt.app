import React, {Fragment, useEffect, useState,} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../../ui/card";
import {Button} from "../../ui/button";
import {Check, Loader2, Pencil, Plus, Square, Trash2, X} from "lucide-react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../ui/table";
import ColorInput from "../../Comman/ColorPicker";
import {Input} from "../../ui/input";
import {useTheme} from "../../theme-provider";
import {useDispatch, useSelector} from "react-redux";
import {allStatusAndTypesAction} from "../../../redux/action/AllStatusAndTypesAction";
import {toast} from "../../ui/use-toast";
import EmptyData from "../../Comman/EmptyData";
import randomColor from 'randomcolor';
import DeleteDialog from "../../Comman/DeleteDialog";
import {apiService} from "../../../utils/constent";

const initialNewLabel = {
    name: '',
    colorCode: "",
};

const Labels = () => {
    const {theme} = useTheme();
    const dispatch = useDispatch();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);

    const [labelError, setLabelError] = useState(initialNewLabel);
    const [labelList, setLabelList] = useState([]);
    const [isEdit, setIsEdit] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteId, setDeleteId] = useState(null);
    const [isSave, setIsSave] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);

    useEffect(() => {
        if (allStatusAndTypes.labels) {
            getAllLabels();
        }
    }, [allStatusAndTypes.labels]);

    const getAllLabels = async () => {
        setLabelList(allStatusAndTypes.labels);
        setIsLoading(false);
    }

    const onChangeColorColor = (newColor, index) => {
        const updatedColors = [...labelList];
        updatedColors[index] = {...updatedColors[index], colorCode: newColor.clr};
        setLabelList(updatedColors);
    };

    const handleShowInput = () => {
        const clone = [...labelList];
        clone.push({name: '', colorCode: randomColor(),});
        setIsEdit(clone.length - 1);
        setLabelList(clone)
        setLabelError(initialNewLabel);
    };

    const handleInputChange = (event, index) => {
        const {name, value} = event.target;
        const updatedColors = [...labelList];
        updatedColors[index] = {...updatedColors[index], [name]: value};
        setLabelList(updatedColors);
        setLabelError({
            ...labelError,
            [name]: validation(name, value)
        });
    };

    const handleAddNewLabel = async (record, index) => {
        let validationErrors = {};
        Object.keys(record).forEach(name => {
            const error = validation(name, record[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });
        if (Object.keys(validationErrors).length > 0) {
            setLabelError(validationErrors);
            return;
        }
        setIsSave(true);
        const payload = {
            projectId: `${projectDetailsReducer.id}`,
            name: record.name,
            colorCode: record.colorCode,
            // label_sort_order_id: record.label_sort_order_id || "1",
            // user_browser: record.user_browser || '',
            // user_ip_address: record.user_ip_address || '',
        }

        const data = await apiService.createLabels(payload)
        if (data.success) {
            let clone = [...labelList];
            clone.push(data.data);
            clone.splice(index, 1);
            setLabelList(clone);
            dispatch(allStatusAndTypesAction({...allStatusAndTypes, labels: clone}))
            setIsSave(false);
            toast({
                description: data.message
            })
        } else {
            setIsSave(false);
            toast({
                description: (data?.error?.message),
                variant: "destructive"
            })
        }
        setIsEdit(null);
    };

    const onBlur = (event) => {
        const {name, value} = event.target;
        setLabelError({
            ...labelError,
            [name]: validation(name, value)
        });
    };

    const validation = (name, value) => {
        switch (name) {
            case "name":
                if (!value || value.trim() === "") {
                    return "Label name is required.";
                }
                    // else if (value.length > 255) {
                    //     return "Label name must not exceed 255 characters.";
                // }
                else {
                    return "";
                }
            default: {
                return "";
            }
        }
    };

    const handleSaveLabel = async (index) => {
        const updatedColors = [...labelList];
        const labelToSave = updatedColors[index];

        if (!labelToSave.name || labelToSave.name.trim() === "") {
            setLabelError({
                ...labelError,
                name: "Label name is required."
            });
            return;
        }
        if (labelToSave?.name?.length > 255) {
            toast({
                description: 'Label name must not exceed 255 characters.',
                variant: "destructive"
            })
            return
        }
        setIsSave(true);

        const payload = {
            projectId: `${projectDetailsReducer.id}`,
            name: labelToSave.name,
            colorCode: labelToSave.colorCode,
            // label_sort_order_id: labelToSave.label_sort_order_id || '',
            // user_browser: labelToSave.user_browser || '',
            // user_ip_address: labelToSave.user_ip_address || '',
        }
        const data = await apiService.updateLabels(payload, labelToSave.id)

        if (data.success) {
            let clone = [...labelList];
            let index = clone.findIndex((x) => x.id === labelToSave.id);
            if (index !== -1) {
                clone[index] = data.data;
                setLabelList(clone)
                dispatch(allStatusAndTypesAction({...allStatusAndTypes, labels: clone}))
            }
            setIsSave(false)
            toast({description: data.message})
        } else {
            setIsSave(false);
            toast({description: data?.error?.message, variant: "destructive"})
        }
        setLabelError({
            ...labelError,
            name: ""
        });
        updatedColors[index] = {...labelToSave};
        setIsEdit(null);
    };

    const handleDeleteLabel = (id) => {
        setDeleteId(id);
        setOpenDelete(true);
        setLabelList(allStatusAndTypes.labels);
        setIsEdit(null)
    };

    const onDelete = async () => {
        setIsLoadingDelete(true);
        const clone = [...labelList];
        const indexToDelete = clone.findIndex((x) => x.id == deleteId);
        if (deleteId) {
            const data = await apiService.deleteLabels(deleteId)
            if (data.success) {
                clone.splice(indexToDelete, 1);
                setLabelList(clone);
                dispatch(allStatusAndTypesAction({...allStatusAndTypes, labels: clone}));
                toast({
                    description: data.message,
                })
            } else {
                toast({
                    description: data?.error?.message,
                    variant: "destructive",
                })
            }
        } else {
            const clone = [...labelList];
            clone.splice(indexToDelete, 1);
            setLabelList(clone);
        }
        setOpenDelete(false);
        setIsLoadingDelete(false);
    }

    const onEdit = (index) => {
        setLabelError(initialNewLabel);
        const clone = [...labelList]
        if (isEdit !== null && !clone[isEdit]?.id) {
            clone.splice(isEdit, 1)
            setIsEdit(index)
            setLabelList(clone)
        } else if (isEdit !== index) {
            setLabelList(allStatusAndTypes?.labels);
            setIsEdit(index);
        } else {
            setIsEdit(index)
        }
    }

    const onEditCancel = () => {
        setIsEdit(null)
        setLabelList(allStatusAndTypes.labels);
    }

    return (
        <Card>
            {
                openDelete &&
                <DeleteDialog
                    title={"You really want to delete this Label?"}
                    isOpen={openDelete}
                    onOpenChange={() => setOpenDelete(false)}
                    onDelete={onDelete}
                    isDeleteLoading={isLoadingDelete}
                    deleteRecord={deleteId}
                />
            }

            <CardHeader
                className="flex flex-row justify-between items-center border-b p-4 sm:px-5 sm:py-4 flex-wrap md:flex-nowrap gap-y-2">
                <div>
                    <CardTitle className="text-xl lg:text-2xl font-normal">Labels</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground p-0">
                        Organize your changelog efficiently with labels.
                    </CardDescription>
                </div>
                <Button
                    disabled={isEdit != null}
                    className={"gap-2 font-medium hover:bg-primary m-0"}
                    onClick={handleShowInput}
                >
                    <Plus size={18} strokeWidth={3}/>New Label
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                <div className={"grid grid-cols-1 overflow-auto sm:overflow-visible whitespace-nowrap"}>
                    <Table>
                        <TableHeader className={`dark:bg-transparent bg-muted`}>
                            <TableRow>
                                {
                                    ["Label Name", "Label Color", "Action"].map((x, i) => {
                                        return (
                                            <TableHead key={i}
                                                       className={`px-2 py-[10px] text-sm font-normal md:px-3 text-card-foreground dark:text-muted-foreground ${i === 0 ? "w-2/5" : i === 1 ? "w-2/5" : ""}`}>{x}</TableHead>
                                        )
                                    })
                                }
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {
                                labelList.length > 0 ?
                                    <Fragment>
                                        {
                                            (labelList || []).map((x, i) => {
                                                return (
                                                    <TableRow>
                                                        {
                                                            isEdit == i ?
                                                                <Fragment>
                                                                    <TableCell className={"px-[12px] py-[10px]"}>
                                                                        <Input
                                                                            className={"bg-card h-9 "}
                                                                            type="text"
                                                                            value={x.name}
                                                                            name={"name"}
                                                                            onBlur={onBlur}
                                                                            onChange={(e) => handleInputChange(e, i)}
                                                                            placeholder={"Enter Label Name"}
                                                                        />
                                                                        {
                                                                            labelError.name ?
                                                                                <div className="grid gap-2 mt-[4px]">
                                                                                    {labelError.name && <span
                                                                                        className="text-destructive text-sm">{labelError.name}</span>}
                                                                                </div> : ""
                                                                        }
                                                                    </TableCell>

                                                                    <TableCell
                                                                        className={"px-[12px] py-[10px] align-top"}>
                                                                        <div className={"flex items-center"}>
                                                                            <ColorInput name={"clr"} value={x.colorCode}
                                                                                        onChange={(color) => onChangeColorColor(color, i)}/>
                                                                        </div>
                                                                    </TableCell>

                                                                    <TableCell
                                                                        className={`flex gap-2 px-[12px] py-[10px] ${labelError?.name ? "" : ""} ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                                        <Fragment>
                                                                            {
                                                                                x.id ? <Button
                                                                                    variant="outline hover:bg-transparent"
                                                                                    className={`p-1 border w-[30px] h-[30px]`}
                                                                                    onClick={() => handleSaveLabel(i)}
                                                                                >
                                                                                    {isSave ? <Loader2
                                                                                            className="h-4 w-4 animate-spin"/> :
                                                                                        <Check size={16}/>}
                                                                                </Button> : <Button
                                                                                    className={`text-sm font-medium h-[30px] w-[88px] hover:bg-primary`}
                                                                                    onClick={() => handleAddNewLabel(x, i)}
                                                                                >
                                                                                    {isSave ? <Loader2
                                                                                        className={"h-4 w-4 animate-spin"}/> : "Add Label"}
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
                                                                    </TableCell>
                                                                </Fragment>
                                                                :
                                                                <Fragment>
                                                                    <TableCell
                                                                        className={`px-2 py-[10px] md:px-3 font-normal text-xs max-w-[140px] truncate text-ellipsis overflow-hidden whitespace-nowrap ${theme === "dark" ? "" : "text-muted-foreground"}`}>{x.name}</TableCell>
                                                                    <TableCell
                                                                        className={`px-2 py-[10px] md:px-3 font-normal text-xs ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                                        <div
                                                                            className={"flex items-center gap-1"}>
                                                                            <Square size={16} strokeWidth={1}
                                                                                    fill={x.colorCode}
                                                                                    stroke={x.colorCode}/>
                                                                            <p>{x.colorCode}</p>
                                                                        </div>
                                                                    </TableCell>

                                                                    <TableCell
                                                                        className={`flex gap-2 px-2 py-[10px] md:px-3 font-normal text-xs ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                                        <Button
                                                                            variant="outline hover:bg-transparent"
                                                                            className="p-1 border w-[30px] h-[30px]"
                                                                            onClick={() => onEdit(i)}
                                                                        >
                                                                            <Pencil size={16}/>
                                                                        </Button>
                                                                        <Button
                                                                            variant="outline hover:bg-transparent"
                                                                            className="p-1 border w-[30px] h-[30px]"
                                                                            onClick={() => handleDeleteLabel(x.id, i)}
                                                                        >
                                                                            <Trash2 size={16}/>
                                                                        </Button>
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
    );
};

export default Labels;
