import React, { Fragment, useState,useEffect, } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../ui/card";
import { Button } from "../../ui/button";
import {Check, Loader2, Menu, Pencil, Plus, Square, Trash2, X} from "lucide-react";
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "../../ui/table";
import ColorInput from "../../Comman/ColorPicker";
import {Input} from "../../ui/input";
import {useTheme} from "../../theme-provider";
import {ApiService} from "../../../utils/ApiService";
import {useSelector,useDispatch} from "react-redux";
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
import {allStatusAndTypesAction} from "../../../redux/action/AllStatusAndTypesAction";
import {Skeleton} from "../../ui/skeleton";

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
    const [isLoading,setIsLoading]=useState(false);
    const apiService = new ApiService();
    const [labelList, setLabelList] = useState([]);
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const [isOpenDeleteAlert,setIsOpenDeleteAlert] =useState(false);
    const [deleteIndex,setDeleteIndex] = useState(null);
    const [deleteId,setDeleteId]=useState(null);
    const [isSave,setIsSave]=useState(false);
    const [selectedRecord,setSelectedRecord]=useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        getAllLabels()
    }, [projectDetailsReducer.id]);

    const getAllLabels = async () => {
        setIsLoading(true)
        const data = await apiService.getAllLabels(projectDetailsReducer.id)
        if (data.status === 200) {
            setLabelList(data.data)
            setIsLoading(false)
        } else {
            setIsLoading(false)
        }
    }

    const onChangeColorColor = (newColor, index) => {
        const updatedColors = [...labelList];
        updatedColors[index] = { ...updatedColors[index], label_color_code: newColor.clr };
        setLabelList(updatedColors);
    };

    const handleShowInput = () => {
        setShowColorInput(true);
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
            clone[index] = data.data
            setLabelList(clone)
            dispatch(allStatusAndTypesAction({...allStatusAndTypes, labels: clone}))
            setSelectedRecord(null)
            setIsSave(false)
        } else {
            setIsSave(false)
        }

        setLabelList((prevLabels) => [
            ...prevLabels,
            {
                label_name: newLabel.label_name,
                label_color_code: newLabel.label_color_code,
            },
        ]);

        setNewLabel({ ...initialNewLabel });
        setShowColorInput(false);
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
    };

    const handleSaveLabel = async (index) => {
        const updatedColors = [...labelList];
        const labelToSave = updatedColors[index];
        console.log(labelToSave)

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
            setSelectedRecord(null)
            setIsSave(false)
        } else {
            setIsSave(false)
        }
        setLabelError({
            ...labelError,
            label_name: ""
        });

        updatedColors[index] = { ...labelToSave };
        // setLabelColors(updatedColors);
        setIsEdit(null);
    };

    const handleCancelEdit = (index) => {
        const updatedColors = [...labelList];
        updatedColors[index] = { ...updatedColors[index],};
        setLabelList(updatedColors);
        setIsEdit(null);
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
                console.log("ddfad")
                const clone = [...labelList];
                clone.splice(deleteIndex, 1);
                setLabelList(clone);
                dispatch(allStatusAndTypesAction({...allStatusAndTypes, labels: clone}));
            } else {
            }
        } else {
            console.log("else")
            const clone = [...labelList];
            clone.splice(deleteIndex, 1);
            setLabelList(clone);
        }
    }

    return (
        <Card>
            <AlertDialog open={isOpenDeleteAlert} onOpenChange={setIsOpenDeleteAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>You really want delete label?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action can't be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className={"bg-red-600 hover:bg-red-600"} onClick={onDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <CardHeader className="flex flex-row justify-between items-center border-b">
                <div>
                    <CardTitle className="text-2xl font-medium">Labels</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground p-0">
                        Use Labels to organise your Changelog
                    </CardDescription>
                </div>
                <Button
                    disabled={showColorInput}
                    className="flex gap-1 items-center text-sm font-semibold m-0"
                    onClick={handleShowInput}
                >
                    <div><Plus size={20} /></div>New Label
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                {isLoading ? <Table>
                                <TableHeader className="p-0">
                                    <TableRow>
                                        {/*<TableHead className={"w-[48px]"}/>*/}
                                        <TableHead className={`w-2/5 pl-4 ${theme === "dark" ? "" : "text-card-foreground"}`}>Label
                                            Name</TableHead>
                                        <TableHead
                                            className={`w-1/5 text-center ${theme === "dark" ? "" : "text-card-foreground"}`}>Label
                                            Color</TableHead>
                                        <TableHead
                                            className={`pr-[39px] text-end ${theme === "dark" ? "" : "text-card-foreground"}`}>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {
                                        [...Array(3)].map((_,index)=>{
                                            return(
                                                <TableRow key={index}>
                                                    {/*<TableCell><Skeleton className={"w-full h-[24px] rounded-md"}/></TableCell>*/}
                                                    <TableCell><Skeleton className={"w-full h-[24px] rounded-md"}/></TableCell>
                                                    <TableCell><Skeleton className={"w-full h-[24px] rounded-md"}/></TableCell>
                                                    <TableCell><Skeleton className={"w-full h-[24px] rounded-md"}/></TableCell>
                                                </TableRow>
                                            )
                                        })
                                    }
                                </TableBody>
                             </Table> : <Table>
                                <TableHeader className="p-0">
                                    <TableRow>
                                        {/*<TableHead className={"w-[48px]"}/>*/}
                                        <TableHead className={`w-2/5 pl-4 ${theme === "dark" ? "" : "text-card-foreground"}`}>Label
                                            Name</TableHead>
                                        <TableHead
                                            className={`w-1/5 text-center ${theme === "dark" ? "" : "text-card-foreground"}`}>Label
                                            Color</TableHead>
                                        <TableHead
                                            className={`pr-[39px] text-end ${theme === "dark" ? "" : "text-card-foreground"}`}>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
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
                                                        <ColorInput name={"clr"} value={x.label_color_code}
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
                                            <TableCell className={`${labelError ? "align-top" : ""} p-0 py-4`}>
                                                <div className={"py-2 px-3 border border-border rounded-lg"}>
                                                    <ColorInput
                                                        name="label_color_code"
                                                        value={newLabel.label_color_code}
                                                        onChange={(color) => setNewLabel((prevState) => ({
                                                            ...prevState,
                                                            label_color_code: color.label_color_code
                                                        }))}
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell className="flex justify-end gap-2 pr-6">
                                                <Button
                                                    variant=""
                                                    className="text-sm font-semibold"
                                                    onClick={() => handleAddNewLabel(newLabel)}
                                                >
                                                    {isSave ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Add Label"}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>}
            </CardContent>
        </Card>
    );
};

export default Labels;
