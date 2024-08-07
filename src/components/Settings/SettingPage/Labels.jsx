import React, {Fragment, useEffect, useState,} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../../ui/card";
import {Button} from "../../ui/button";
import {Check, Loader2, Pencil, Plus, Square, Trash2, X} from "lucide-react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../ui/table";
import ColorInput from "../../Comman/ColorPicker";
import {Input} from "../../ui/input";
import {useTheme} from "../../theme-provider";
import {ApiService} from "../../../utils/ApiService";
import {useDispatch, useSelector} from "react-redux";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle
} from "../../ui/alert-dialog";
import {allStatusAndTypesAction} from "../../../redux/action/AllStatusAndTypesAction";
import {toast} from "../../ui/use-toast";
import {Skeleton} from "../../ui/skeleton";
import EmptyData from "../../Comman/EmptyData";

const initialNewLabel = {
    label_name: '',
    label_color_code: '#000000',
};

const Labels = () => {
    const {theme} = useTheme();
    const [showColorInput, setShowColorInput] = useState(false);
    const [newLabel, setNewLabel] = useState({...initialNewLabel });
    const [labelError, setLabelError] = useState(initialNewLabel);
    const [isEdit,setIsEdit]= useState(null);
    const [isLoading,setIsLoading]=useState(true);
    const apiService = new ApiService();
    const [labelList, setLabelList] = useState([]);
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const [isOpenDeleteAlert,setIsOpenDeleteAlert] =useState(false);
    const [deleteIndex,setDeleteIndex] = useState(null);
    const [deleteId,setDeleteId]=useState(null);
    const [isSave,setIsSave]=useState(false);
    const [disableLabelBtn,setDisableLabelBtn]=useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if(allStatusAndTypes.labels){
            getAllLabels();
        }
    }, [allStatusAndTypes.labels]);

    const getAllLabels = async () => {
        setIsLoading(true);
        setLabelList(allStatusAndTypes.labels);
        setIsLoading(false);
    }

    const onChangeColorColor = (newColor, index) => {
        const updatedColors = [...labelList];
        updatedColors[index] = { ...updatedColors[index], label_color_code: newColor.clr };
        setLabelList(updatedColors);
    };

    const handleShowInput = () => {
        setShowColorInput(true);
        setDisableLabelBtn(true);
    };

    const handleInputChange = (event, index) => {
        const { name, value } = event.target;
        if (index !== undefined) {
            const updatedColors = [...labelList];
            updatedColors[index] = { ...updatedColors[index], [name]: value };
            setLabelList(updatedColors);
        } else {
            setNewLabel({ ...newLabel, [name]: value });
        }
        setLabelError(labelError => ({
            ...labelError,
            [name]: ""
        }));
    };

    const handleAddNewLabel = async (record,index) => {
        let validationErrors = {};
        Object.keys(newLabel).forEach(name => {
            const error = validation(name, newLabel[name]);
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
            project_id: `${projectDetailsReducer.id}`,
            label_name: record.label_name,
            label_color_code: record.label_color_code,
            label_sort_order_id: record.label_sort_order_id || "1",
            user_browser: record.user_browser || '',
            user_ip_address: record.user_ip_address || '',
        }

        const data = await apiService.createLabels(payload)
        if (data.status === 200) {
            let clone = [...labelList];
            clone.push(data.data);
            setLabelList(clone);
            dispatch(allStatusAndTypesAction({...allStatusAndTypes, labels: clone}))
            setIsSave(false);
            toast({
                description:"Label added successfully"
            })
        } else {
            setIsSave(false);
            toast({
                description:"Something went wrong",
                variant: "destructive"
            })
        }

        setNewLabel({ ...initialNewLabel });
        setShowColorInput(false);
        setDisableLabelBtn(false);

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
            case "label_name":
                if(!value || value.trim() === "") {
                    return "Label name is required."
                } else {
                    return "";
                }
            default: {
                return  "";
            }
        }
    }

    const handleEditLabel = (index) => {
        const updatedColors = [...labelList];
        updatedColors[index] = { ...updatedColors[index]};
        setLabelList(updatedColors);
        setIsEdit(index);
        setShowColorInput(false);
        setDisableLabelBtn(true);
    };

    const handleSaveLabel = async (index) => {
        const updatedColors = [...labelList];
        const labelToSave = updatedColors[index];

        if (!labelToSave.label_name || labelToSave.label_name.trim() === "") {
            setLabelError({
                ...labelError,
                label_name: "Label name is required."
            });
            return;
        }
        setIsSave(true);
        const payload = {
            project_id: `${projectDetailsReducer.id}`,
            label_name: labelToSave.label_name,
            label_color_code: labelToSave.label_color_code,
            label_sort_order_id: labelToSave.label_sort_order_id || '',
            user_browser: labelToSave.user_browser || '',
            user_ip_address: labelToSave.user_ip_address || '',
        }
        const data = await apiService.updateLabels(payload, labelToSave.id)
        if (data.status === 200) {
            let clone = [...labelList];
            let index = clone.findIndex((x) => x.id === labelToSave.id);
            if (index !== -1) {
                clone[index] = data.data;
                setLabelList(clone)
                dispatch(allStatusAndTypesAction({...allStatusAndTypes, labels: clone}))
            }
            setIsSave(false)
            toast({
                description:"Label updated successfully"
            })
        } else {
            setIsSave(false);
            toast({
                description:"Something went wrong",
                variant: "destructive"
            })
        }
        setLabelError({
            ...labelError,
            label_name: ""
        });
        updatedColors[index] = { ...labelToSave };
        setIsEdit(null);
        setDisableLabelBtn(false);
    };

    const handleCancelEdit = (index) => {
        const updatedColors = [...labelList];
        updatedColors[index] = { ...updatedColors[index],};
        setLabelList(updatedColors);
        setIsEdit(null);
        setDisableLabelBtn(false);
    };

    const handleDeleteLabel = (id,index) => {
        setIsOpenDeleteAlert(true);
        setDeleteIndex(index);
        setDeleteId(id);
    };

    const onDelete =async () =>{
        if (deleteId) {
            const data = await apiService.deleteLabels(deleteId)
            if (data.status === 200) {
                const clone = [...labelList];
                clone.splice(deleteIndex, 1);
                setLabelList(clone);
                dispatch(allStatusAndTypesAction({...allStatusAndTypes, labels: clone}));
                toast({
                    description:data.message,
                })
            } else {
                toast({
                    description:data.message,
                    variant: "destructive",
                })
            }
        } else {
            const clone = [...labelList];
            clone.splice(deleteIndex, 1);
            setLabelList(clone);
        }
    }

    return (
        <Card>
            <AlertDialog open={isOpenDeleteAlert} onOpenChange={setIsOpenDeleteAlert}>
                <AlertDialogContent className={"w-[310px] md:w-full rounded-lg"}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>You really want delete label?</AlertDialogTitle>
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
            <CardHeader className="flex flex-row justify-between items-center border-b p-4 flex-wrap md:flex-nowrap sm:p-6 gap-y-2">
                <div>
                    <CardTitle className="text-lg sm:text-2xl font-medium">Labels</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground p-0">
                        Use Labels to organise your Changelog
                    </CardDescription>
                </div>
                <Button
                    disabled={disableLabelBtn}
                    className="flex gap-1 items-center text-sm font-semibold m-0"
                    onClick={handleShowInput}
                >
                    <div><Plus size={20} /></div>New Label
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                <div className={"grid grid-cols-1 overflow-auto whitespace-nowrap"}>
                    <Table>
                    <TableHeader className="p-0">
                        <TableRow>
                            {
                                ["Label Name","Label Color","Action"].map((x,i)=>{
                                    return(
                                        <TableHead key={i} className={`${i === 0 ? "w-2/5" : i === 1 ? "w-1/5 text-center" : "pr-[39px] text-end"} pl-4 ${theme === "dark" ? "" : "text-card-foreground"}`}>{x}</TableHead>
                                    )
                                })
                            }
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            isLoading ? [...Array(4)].map((_, index) => {
                                return (
                                    <TableRow key={index}>
                                        {
                                            [...Array(3)].map((_, i) => {
                                                return (
                                                    <TableCell className={"px-2"} key={i}>
                                                        <Skeleton className={"rounded-md  w-full h-[24px]"}/>
                                                    </TableCell>
                                                )
                                            })
                                        }
                                    </TableRow>
                                )
                            }) : labelList.length > 0 ? <>
                                {(labelList || []).map((x, i) => (
                                    <TableRow key={i}>
                                        {
                                            isEdit === i ?
                                                <TableCell className={"py-[8.5px] pl-4 py-[11px] "}>
                                                    <Input
                                                        className={"bg-card h-9 "}
                                                        type="text"
                                                        value={x.label_name}
                                                        name={"label_name"}
                                                        onBlur={onBlur}
                                                        onChange={(e) => handleInputChange(e, i)}
                                                    />
                                                    <div className="grid gap-2">
                                                        {
                                                            labelError.label_name &&
                                                            <span
                                                                className="text-red-500 text-sm">{labelError.label_name}</span>
                                                        }
                                                    </div>
                                                </TableCell>
                                                : <TableCell
                                                    className={`font-medium text-xs py-[8.5px] pl-4 ${theme === "dark" ? "" : "text-muted-foreground"}`}>{x.label_name}</TableCell>
                                        }
                                        {isEdit === i ?
                                            <TableCell
                                                className={`font-medium text-xs ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                <div className={"flex justify-center items-center"}>
                                                    <ColorInput style={{width:"98px"}} name={"clr"} value={x.label_color_code}
                                                                onChange={(color) => onChangeColorColor(color, i)}/>
                                                </div>
                                            </TableCell> :
                                            <TableCell
                                                className={`font-medium text-xs ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                <div className={"flex justify-center items-center gap-1"}>
                                                    <Square size={16} strokeWidth={1} fill={x.label_color_code}
                                                            stroke={x.label_color_code}/>
                                                    <p>{x.label_color_code}</p>
                                                </div>
                                            </TableCell>
                                        }
                                        <TableCell className="flex justify-end gap-2 pr-6">
                                            {isEdit === i ? (
                                                <Fragment>
                                                    <Button
                                                        variant="outline hover:bg-transparent"
                                                        className={`p-1 border w-[30px] h-[30px] ${isSave ? "justify-center items-center" : ""}`}
                                                        onClick={() => handleSaveLabel(i)}
                                                    >
                                                        {isSave ?
                                                            <Loader2 className="mr-1 h-4 w-4 animate-spin justify-center"/> :
                                                            <Check size={16}/>}
                                                    </Button>
                                                    <Button
                                                        variant="outline hover:bg-transparent"
                                                        className="p-1 border w-[30px] h-[30px]"
                                                        onClick={() => handleCancelEdit(i)}
                                                    >
                                                        <X size={16}/>
                                                    </Button>
                                                </Fragment>
                                            ) : (
                                                <Fragment>
                                                    <Button
                                                        variant="outline hover:bg-transparent"
                                                        className="p-1 border w-[30px] h-[30px]"
                                                        onClick={() => handleEditLabel(i)}
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
                                                </Fragment>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {showColorInput && (
                                    <TableRow>
                                        <TableCell className={"p-0 py-4 pl-4 pr-4"}>
                                            <Input
                                                className={"bg-card"}
                                                type="text"
                                                id="labelName"
                                                name="label_name"
                                                value={newLabel.label_name}
                                                onChange={handleInputChange}
                                                placeholder="Enter Label Name"
                                                onBlur={onBlur}
                                            />
                                            <div className="grid gap-2">
                                                {
                                                    labelError.label_name &&
                                                    <span className="text-red-500 text-sm">{labelError.label_name}</span>
                                                }
                                            </div>
                                        </TableCell>
                                        <TableCell className={`${labelError ? "align-top" : ""} p-0 py-4 text-xs ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                            <div className={"flex justify-center items-center"}>
                                                <ColorInput
                                                    className={"w-[98px]"}
                                                    name="label_color_code"
                                                    value={newLabel.label_color_code}
                                                    onChange={(color) => setNewLabel((prevState) => ({
                                                        ...prevState,
                                                        label_color_code: color.label_color_code
                                                    }))}
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell className="flex justify-end gap-2 pr-6 items-center pt-[21px]">
                                            <Button
                                                variant=""
                                                className="text-sm font-semibold h-[30px]"
                                                onClick={() => handleAddNewLabel(newLabel)}
                                            >
                                                {isSave ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Add Label"}
                                            </Button>
                                            <Button
                                                variant="outline hover:bg-transparent"
                                                className="p-1 border w-[30px] h-[30px]"
                                                onClick={()=> {
                                                    setShowColorInput(false);
                                                    setDisableLabelBtn(false);
                                                }}
                                            >
                                                <X size={16}/>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )}
                                                        </> : <TableRow>
                                <TableCell colSpan={6}>
                                    <EmptyData />
                                </TableCell>
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
