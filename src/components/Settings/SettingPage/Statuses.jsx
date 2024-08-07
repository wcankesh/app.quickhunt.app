import React, { Fragment, useState,useEffect, } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../ui/card";
import { Button } from "../../ui/button";
import {Check, Loader2, Menu, Pencil, Plus, Square, Trash2, X} from "lucide-react";
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
    AlertDialogHeader,
    AlertDialogTitle
} from "../../ui/alert-dialog";
import {Skeleton} from "../../ui/skeleton";
import NoDataThumbnail from "../../../img/Frame.png";
import EmptyData from "../../Comman/EmptyData";

const initialStatus = {
    title: '',
    color_code: '#000000',
};

const Statuses = () => {
    const {theme} = useTheme();
    const [isLoading,setIsLoading]=useState(true);
    const [showColorInput, setShowColorInput] = useState(false);
    const [newStatus, setNewStatus] = useState({...initialStatus });
    const [labelError, setLabelError] = useState(initialStatus);
    const [isEdit,setIsEdit]= useState(null);
    const [statusList,setStatusList]=useState([]);
    const [isSave,setIsSave]= useState(false);
    const [deleteId,setDeleteId]=useState(null);
    const [deleteIndex,setDeleteIndex] =useState(null);
    const [disableStatusBtn,setDisableStatusBtn]=useState(false);
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
            setStatusList(clone);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }

    const onChangeColorColor = (newColor, index) => {
        const updatedColors = [...statusList];
        updatedColors[index] = { ...updatedColors[index], color_code: newColor.color_code };
        setStatusList(updatedColors);
    };

    const handleShowInput = () => {
        setShowColorInput(true);
        setDisableStatusBtn(true);
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

    const handleAddNewStatus = async () => {
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
            clone.push(data.data);
            setStatusList(clone);
            dispatch(allStatusAndTypesAction({...allStatusAndTypes, roadmap_status: clone}))
            setIsSave(false);
            setShowColorInput(false);
            setNewStatus(initialStatus);
            toast({
                description:"Status added successfully"
            })
        } else {
            setIsSave(false)
            toast({
                description:"Something went wrong",
                variant: "destructive",
            })
        }
        setDisableStatusBtn(false);
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
                    return "Status name is required."
                } else {
                    return "";
                }
            default: {
                return  "";
            }
        }
    }

    const handleSaveStatus = async (index) => {
        const updatedColors = [...statusList];
        const labelToSave = updatedColors[index];

        if (!labelToSave.title || labelToSave.title.trim() === "") {
            setLabelError({
                ...labelError,
                title: "Status name is required."
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
            title: labelToSave.title,
            color_code: labelToSave.color_code,
        }
        const data = await apiService.updateRoadmapStatus(payload, labelToSave.id)
        if (data.status === 200) {
            let clone = [...statusList];
            let index = clone.findIndex((x) => x.id === labelToSave.id);
            if (index !== -1) {
                clone[index] = data.data;
                setStatusList(clone)
                dispatch(allStatusAndTypesAction({...allStatusAndTypes, roadmap_status: clone}))
            }
            setIsSave(false)
            toast({
                description:"Status update successfully"
            })
        } else {
            setIsSave(false)
            toast({
                description:"Something went wrong",
                variant: "destructive"
            })
        }

        updatedColors[index] = { ...labelToSave };
        setStatusList(updatedColors);
        setIsEdit(null);
        setDisableStatusBtn(false);
    };

    const handleDeleteStatus = (id,index) => {
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
                    description:"Status deleted successfully"
                })
            } else if(data.status === 201){
                toast({
                    description:data.success,
                    variant: "destructive"
                })
            } else {
                toast({
                    description:data.message,
                    variant: "destructive"
                })
            }
        }
    }

    return (
        <Fragment>
            <AlertDialog open={deleteId} onOpenChange={setDeleteId}>
                <AlertDialogContent className={"w-[310px] md:w-full rounded-lg"}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>You really want delete Status?</AlertDialogTitle>
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
                <CardHeader className="flex flex-row flex-wrap gap-y-2 justify-between items-center border-b p-4 sm:p-6">
                    <div>
                        <CardTitle className="text-lg sm:text-2xl font-medium">Statuses</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground p-0">
                            Use Statuses to track Ideas on your Roadmap.
                        </CardDescription>
                    </div>
                    <Button
                        disabled={disableStatusBtn}
                        className="flex gap-1 items-center text-sm font-semibold m-0"
                        onClick={handleShowInput}
                    >
                        <div><Plus size={20} /></div>New Status
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    <div className={"grid grid-cols-1 overflow-auto whitespace-nowrap"}>
                        <Table>
                        <TableHeader className={"p-0"}>
                            <TableRow>
                                {
                                    ["","Status Name","Status Color","Action"].map((x,i)=>{
                                        return(
                                            <TableHead className={`p-0 ${theme === "dark" ? "" : "text-card-foreground"} ${i === 0 ? "w-[48px]" : i === 1 ? "w-2/5" : i === 2 ? "text-center" : i === 3 ? "text-end pr-4" : ""}`}>{x}</TableHead>
                                        )
                                    })
                                }
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {
                                isLoading ? [...Array(5)].map((_, index) => {
                                    return (
                                        <TableRow key={index}>
                                            {
                                                [...Array(4)].map((_, i) => {
                                                    return (
                                                        <TableCell className={"px-2"}>
                                                            <Skeleton className={`rounded-md  w-full h-[24px] ${i == 0 ? "w-full" : ""}`}/>
                                                        </TableCell>
                                                    )
                                                })
                                            }
                                        </TableRow>
                                    )
                                }) :
                                    statusList.length > 0 ? <>
                                        {(statusList || []).map((x, i) => (
                                            <TableRow key={i}>
                                                <TableCell><Menu className={"cursor-grab"} size={16}/></TableCell>
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
                                                        : <TableCell
                                                            className={`font-medium text-xs py-[8.5px] pl-0 ${theme === "dark" ? "" : "text-muted-foreground"}`}>{x.title}</TableCell>
                                                }
                                                {isEdit === i ?
                                                    <TableCell
                                                        className={`font-medium text-xs ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                        <div className={"flex justify-center items-center"}>
                                                            <ColorInput name={"color_code"} value={x.color_code} onChange={(color) => onChangeColorColor(color, i)}/>
                                                        </div>
                                                    </TableCell> :
                                                    <TableCell
                                                        className={`font-medium text-xs ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                        <div className={"flex justify-center items-center gap-1"}>
                                                            <Square size={16} strokeWidth={1} fill={x.color_code} stroke={x.color_code}/>
                                                            <p>{x.color_code}</p>
                                                        </div>
                                                    </TableCell>
                                                }
                                                <TableCell className="flex justify-end gap-2 pr-4">
                                                    {isEdit === i ? (
                                                        <Fragment>
                                                            <Button
                                                                variant="outline hover:bg-transparent"
                                                                className={`p-1 border w-[30px] h-[30px] ${isSave ? "justify-center items-center" : ""}`}
                                                                onClick={() => handleSaveStatus(i)}
                                                            >
                                                                {isSave ? <Loader2 className="mr-1 h-4 w-4 animate-spin justify-center"/> : <Check size={16}/>}
                                                            </Button>
                                                            <Button
                                                                variant="outline hover:bg-transparent"
                                                                className="p-1 border w-[30px] h-[30px]"
                                                                onClick={() => {
                                                                    setIsEdit(null);
                                                                    setDisableStatusBtn(false);
                                                                }}
                                                            >
                                                                <X size={16}/>
                                                            </Button>
                                                        </Fragment>
                                                    ) : (
                                                        <Fragment>
                                                            <Button
                                                                variant="outline hover:bg-transparent"
                                                                className="p-1 border w-[30px] h-[30px]"
                                                                onClick={() => {
                                                                    setIsEdit(i);
                                                                    setDisableStatusBtn(true);
                                                                    setShowColorInput(false);
                                                                }}
                                                            >
                                                                <Pencil size={16}/>
                                                            </Button>
                                                            <Button
                                                                variant="outline hover:bg-transparent"
                                                                className="p-1 border w-[30px] h-[30px]"
                                                                onClick={() => handleDeleteStatus(x.id, i)}
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
                                                <TableCell className={`${labelError ? "align-top" : ""}`}>
                                                    <Button variant={"ghost hover:bg-transparent"}
                                                            className={"p-0 cursor-grab"}><Menu size={16}/></Button>
                                                </TableCell>
                                                <TableCell className={"p-0 py-4 pr-4"}>
                                                    <Input
                                                        className={"bg-card"}
                                                        type="text"
                                                        id="title"
                                                        name="title"
                                                        value={newStatus.title}
                                                        onChange={handleInputChange}
                                                        placeholder="Enter Status Name"
                                                        onBlur={onBlur}
                                                    />
                                                    <div className="grid gap-2">
                                                        {
                                                            labelError.title &&
                                                            <span className="text-red-500 text-sm">{labelError.title}</span>
                                                        }
                                                    </div>
                                                </TableCell>
                                                <TableCell className={`${labelError ? "align-top" : ""} p-0 py-4 text-xs ${theme === "dark" ? "" : "text-muted-foreground"} `}>
                                                    <div className={"flex justify-center items-center"}>
                                                        <ColorInput
                                                            name="color_code"
                                                            value={newStatus.color_code}
                                                            onChange={(color) => setNewStatus((prevState) => ({
                                                                ...prevState,
                                                                color_code: color.color_code
                                                            }))}
                                                        />
                                                    </div>
                                                </TableCell>
                                                <TableCell className="flex justify-end gap-2 pr-6 pt-[21px]">
                                                    <Button
                                                        variant=""
                                                        className="text-sm font-semibold h-[30px]"
                                                        onClick={handleAddNewStatus}
                                                    >
                                                        {isSave ? <Loader2 className={"mr-2  h-4 w-4 animate-spin"}/> : "Add Status"}
                                                    </Button>
                                                    <Button
                                                        variant="outline hover:bg-transparent"
                                                        className="p-1 border w-[30px] h-[30px]"
                                                        onClick={()=> {
                                                            setShowColorInput(false);
                                                            setDisableStatusBtn(false);
                                                        }}
                                                    >
                                                        <X size={16}/>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </> :  <TableRow>
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
        </Fragment>
    );
};

export default Statuses;
