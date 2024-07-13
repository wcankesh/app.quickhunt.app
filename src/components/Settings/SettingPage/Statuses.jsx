import React, { Fragment, useState,useEffect, } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../ui/card";
import { Button } from "../../ui/button";
import {Check, Menu, Pencil, Plus, Square, Trash2, X} from "lucide-react";
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "../../ui/table";
import ColorInput from "../../Comman/ColorPicker";
import {Input} from "../../ui/input";
import {useTheme} from "../../theme-provider";
import {useSelector,useDispatch} from "react-redux";
import {ApiService} from "../../../utils/ApiService";
import {toast} from "../../ui/use-toast";
import {allStatusAndTypesAction} from "../../../redux/action/AllStatusAndTypesAction";
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

const initialStatus = {
    title: '',
    color_code: '#000000',
};



const Statuses = () => {
    const {theme} = useTheme();
    const [isLoading,setIsLoading]=useState(false);
    const [labelColors, setLabelColors] = useState([
        {labelName: "Under consideration", name: "clr", value: "#ff3c3c",},
        {labelName: "Planned", name: "clr", value: "#3b82f6",},
        {labelName: "In Development", name: "clr", value: "#63c8d9",},
    ]);
    const [showColorInput, setShowColorInput] = useState(false);
    const [newStatus, setNewStatus] = useState({...initialStatus });
    const [labelError, setLabelError] = useState(initialStatus);
    const [isEdit,setIsEdit]= useState(null);
    const [statusList,setStatusList]=useState([]);
    const [isSave,setIsSave]= useState(false);
    const [deleteId,setDeleteId]=useState(null);
    const [deleteIndex,setDeleteIndex] =useState(null);
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const dispatch = useDispatch();
    let apiService = new ApiService();




    useEffect(() => {
        getAllRoadmapStatus()
    },[projectDetailsReducer.id])

    const getAllRoadmapStatus = async () => {
        setIsLoading(true)
        const data = await apiService.getAllRoadmapStatus(projectDetailsReducer.id)
        if(data.status === 200){
            const clone = [];
            data.data.map((x, i) => {
                let obj = {...x,index: i}
                clone.push(obj)
            })
            setStatusList(clone)
            setIsLoading(false)
        } else {
            setIsLoading(false)
        }
    }

    const onChangeColorColor = (newColor, index) => {
        const updatedColors = [...statusList];
        updatedColors[index] = { ...updatedColors[index], color_code: newColor.color_code };
        setStatusList(updatedColors);
    };

    const handleShowInput = () => {
        setShowColorInput(true);
    };

    const handleInputChange = (event, index) => {
        const { name, value } = event.target;
        if (index !== undefined) {
            const updatedColors = [...statusList];
            updatedColors[index] = { ...updatedColors[index], [name]: value };
            setStatusList(updatedColors);
        } else {
            setNewStatus({ ...newStatus, [name]: value });
        }
        setLabelError(labelError => ({
            ...labelError,
            [name]: ""
        }));
    };

    const handleAddNewLabel = async () => {
        let validationErrors = {};
        Object.keys(newStatus).forEach(name => {
            const error = validation(name, newStatus[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });
        if (Object.keys(validationErrors).length > 0) {
            setLabelError(validationErrors);
            return;
        }

        setIsSave(true)
        const payload = {
            project_id: `${projectDetailsReducer.id}`,
            title: newStatus.title,
            color_code: newStatus.color_code,
        }
        const data = await apiService.createRoadmapStatus(payload)
        if (data.status === 200) {
            let clone = [...statusList];
            clone[index] = data.data
            setStatusList(clone)
            dispatch(allStatusAndTypesAction({...allStatusAndTypes, roadmap_status: clone}))
            // setSelectedRecord(null)
            setIsSave(false)
            // message.success("Status add successfully")
        } else {
            setIsSave(false)
            // message.error(data.message)
        }

        // setLabelColors((prevLabels) => [
        //     ...prevLabels,
        //     {
        //         labelName: newLabel.labelName,
        //         name: 'clr',
        //         value: newLabel.value,
        //     },
        // ]);
        //
        // setNewLabel({ ...initialNewLabel });
        // setShowColorInput(false);
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
            case "title":
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
        const updatedColors = [...labelColors];
        updatedColors[index] = { ...updatedColors[index]};
        setLabelColors(updatedColors);
        setIsEdit(index);
    };

    const handleSaveStatus = async (record,index) => {
        const updatedColors = [...statusList];
        const labelToSave = updatedColors[index];

        if (!labelToSave.title || labelToSave.title.trim() === "") {
            setLabelError({
                ...labelError,
                title: "Label name is required."
            });
            return;
        }
        setLabelError({
            ...labelError,
            title: ""
        });

        setIsSave(true)
        const payload = {
            project_id: `${projectDetailsReducer.id}`,
            title: record.title,
            color_code: record.color_code,
        }
        const data = await apiService.updateRoadmapStatus(payload, record.id)
        if (data.status === 200) {
            let clone = [...statusList];
            let index = clone.findIndex((x) => x.id === record.id);
            if (index !== -1) {
                clone[index] = data.data;
                setStatusList(clone)
                dispatch(allStatusAndTypesAction({...allStatusAndTypes, roadmap_status: clone}))
            }
            // setSelectedRecord(null)
            setIsSave(false)
            toast({
                title:"Status update successfully"
            })
        } else {
            setIsSave(false)
            toast({
                title:"Something went wrong"
            })
        }

        updatedColors[index] = { ...labelToSave };
        setStatusList(updatedColors);
        setIsEdit(null);
    };

    const handleCancelEdit = (index) => {
        const updatedColors = [...labelColors];
        updatedColors[index] = { ...updatedColors[index],};
        setLabelColors(updatedColors);
        setIsEdit(null);
    };

    const handleDeleteLabel = (id,index) => {
        setDeleteId(id);
        setDeleteIndex(index)
    };

    const onDelete = async () => {
        if (deleteId) {
            const data = await apiService.deleteRoadmapStatus(deleteId)
            if (data.status === 200) {
                const clone = [...statusList];
                clone.splice(deleteIndex, 1)
                setStatusList(clone)
                dispatch(allStatusAndTypesAction({...allStatusAndTypes, roadmap_status: clone}))
                toast({
                    title:"Status delete successfully"
                })
            } else {
                toast({
                    title:"Something went wrong "
                })
            }
        } else {
            const clone = [...statusList];
            clone.splice(index, 1)
            setStatusList(clone)
        }
    }

    return (
        <Fragment>
            <AlertDialog open={deleteId} onOpenChange={setDeleteId}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>You really want delete Status?</AlertDialogTitle>
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
            <Card>
                <CardHeader className="flex flex-row justify-between items-center border-b">
                    <div>
                        <CardTitle className="text-2xl font-medium">Statuses</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground p-0">
                            Use Statuses to track Ideas on your Roadmap.
                        </CardDescription>
                    </div>
                    <Button
                        disabled={showColorInput}
                        className="flex gap-1 items-center text-sm font-semibold m-0"
                        onClick={handleShowInput}
                    >
                        <div><Plus size={20} /></div>New Status
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="p-0">
                            <TableRow>
                                <TableHead className={"w-[48px]"}/>
                                <TableHead className={`w-2/5 pl-0 ${theme === "dark" ? "" : "text-card-foreground"}`}>Label Name</TableHead>
                                <TableHead className={`text-center ${theme === "dark" ? "" : "text-card-foreground"}`}>Label Color</TableHead>
                                <TableHead className={`pr-[39px] text-end ${theme === "dark" ? "" : "text-card-foreground"}`}>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(statusList || []).map((x, i) => (
                                <TableRow key={i}>
                                    <TableCell><Menu className={"cursor-grab"} size={16} /></TableCell>
                                    {
                                        isEdit === i ?
                                            <TableCell className={"py-[8.5px] pl-0 py-[11px]"}>
                                                <Input
                                                    className={"bg-card h-9"}
                                                    type="title"
                                                    value={x.title}
                                                    name={"title"}
                                                    onBlur={onBlur}
                                                    onChange={(e) => handleInputChange(e, i)}
                                                />
                                                <div className="grid gap-2">
                                                    {
                                                        labelError.title &&
                                                        <span className="text-red-500 text-sm">{labelError.title}</span>
                                                    }
                                                </div>
                                            </TableCell>
                                            : <TableCell className={`font-medium text-xs py-[8.5px] pl-0 ${theme === "dark" ? "" : "text-muted-foreground"}`}>{x.title}</TableCell>
                                    }
                                    {isEdit === i ?
                                        <TableCell className={`font-medium text-xs ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                            <div className={"flex justify-center items-center"}>
                                                <ColorInput name={"color_code"} value={x.color_code} onChange={(color) => onChangeColorColor(color, i)} />
                                            </div>
                                        </TableCell> :
                                        <TableCell className={`font-medium text-xs ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                            <div className={"flex justify-center items-center gap-1"}>
                                                <Square size={16} strokeWidth={1} fill={x.color_code} stroke={x.color_code}/>
                                                <p>{x.color_code}</p>
                                            </div>
                                        </TableCell>
                                    }
                                    <TableCell className="flex justify-end gap-2 pr-6">
                                        {isEdit === i ? (
                                            <Fragment>
                                                <Button
                                                    variant="outline hover:bg-transparent"
                                                    className="p-1 border w-[30px] h-[30px]"
                                                    onClick={() => handleSaveStatus(x,i)}
                                                >
                                                    <Check size={16} />
                                                </Button>
                                                <Button
                                                    variant="outline hover:bg-transparent"
                                                    className="p-1 border w-[30px] h-[30px]"
                                                    onClick={() => handleCancelEdit(i)}
                                                >
                                                    <X size={16} />
                                                </Button>
                                            </Fragment>
                                        ) : (
                                            <Fragment>
                                                <Button
                                                    variant="outline hover:bg-transparent"
                                                    className="p-1 border w-[30px] h-[30px]"
                                                    onClick={() => handleEditLabel(i)}
                                                >
                                                    <Pencil size={16} />
                                                </Button>
                                                <Button
                                                    variant="outline hover:bg-transparent"
                                                    className="p-1 border w-[30px] h-[30px]"
                                                    onClick={() => handleDeleteLabel(x.id,i)}
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </Fragment>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {showColorInput && (
                                <TableRow>
                                    <TableCell className={`${labelError ? "align-top" : ""}`}>
                                        <Button variant={"ghost hover:bg-transparent"} className={"p-0 cursor-grab"}><Menu size={16} /></Button>
                                    </TableCell>
                                    <TableCell className={"p-0 py-4 pr-4"}>
                                        <Input
                                            className={"bg-card"}
                                            type="text"
                                            id="title"
                                            name="title"
                                            value={newStatus.title}
                                            onChange={handleInputChange}
                                            placeholder="Enter Label Name"
                                            onBlur={onBlur}
                                        />
                                        <div className="grid gap-2">
                                            {
                                                labelError.title &&
                                                <span className="text-red-500 text-sm">{labelError.title}</span>
                                            }
                                        </div>
                                    </TableCell>
                                    <TableCell className={`${labelError ? "align-top" : ""} p-0 py-4`}>
                                        <div className={"py-2 px-3 border border-border rounded-lg"}>
                                            <ColorInput
                                                name="color_code"
                                                value={newStatus.color_code}
                                                onChange={(color) => setNewStatus((prevState) => ({ ...prevState, color_code: color.color_code }))}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="flex justify-end gap-2 pr-6">
                                        <Button
                                            variant=""
                                            className="text-sm font-semibold"
                                            onClick={()=>handleAddNewLabel()}
                                        >
                                            Add Label
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
        </Card>
        </Fragment>
    );
};

export default Statuses;
