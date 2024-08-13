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
import {Skeleton} from "../../ui/skeleton";
import EmptyData from "../../Comman/EmptyData";
import {Dialog} from "@radix-ui/react-dialog";
import {DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "../../ui/dialog";
import randomColor from 'randomcolor';


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
    const [openDelete,setOpenDelete]=useState(false);
    const [isDeleteLoading,setIsDeleteLoading]=useState(false);
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const dispatch = useDispatch();
    let apiService = new ApiService();

    useEffect(() => {
        getAllRoadmapStatus()
    },[allStatusAndTypes.roadmap_status])

    const getAllRoadmapStatus = async () => {
        const clone = [];
        allStatusAndTypes.roadmap_status.map((x,i)=>{
            let obj ={...x,index:i};
            clone.push(obj);
        });
        setStatusList(clone);
        setIsLoading(false);
    }

    const onChangeColorColor = (newColor, index) => {
        const updatedColors = [...statusList];
        updatedColors[index] = { ...updatedColors[index], color_code: newColor.color_code };
        setStatusList(updatedColors);
    };

    const handleShowInput = () => {
        setShowColorInput(true);
        setDisableStatusBtn(true);
        setNewStatus(prevState => ({
            ...prevState,
            color_code: randomColor()
        }));
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
                description:data.message
            })
        } else {
            setIsSave(false)
            toast({
                description:data.message,
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
                description:data.message
            })
        } else {
            setIsSave(false)
            toast({
                description:data.message,
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
        setDeleteIndex(index);
        setOpenDelete(true);
    };

    const deleteParticularRow = async () => {
        if (deleteId) {
            setIsDeleteLoading(true);
            const data = await apiService.deleteRoadmapStatus(deleteId)
            if (data.status === 200) {
                const clone = [...statusList];
                clone.splice(deleteIndex, 1)
                setStatusList(clone)
                dispatch(allStatusAndTypesAction({...allStatusAndTypes, roadmap_status: clone}))
                toast({
                    description:data.message
                })
            } else if(data.status === 201){
                toast({
                    description:data.message,
                    variant: "destructive"
                });
            } else {
                toast({
                    description:data.message,
                    variant: "destructive"
                });
            }
        setOpenDelete(false);
        setIsDeleteLoading(false);
        }
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
                                    <DialogTitle className={"text-start"}>You really want delete this status ?</DialogTitle>
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
                                    onClick={deleteParticularRow}
                                >
                                    {isDeleteLoading ? <Loader2 size={16} className={"animate-spin"}/> : "Delete"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </Fragment>
            }

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
                    <div className={"grid grid-cols-1 overflow-visible whitespace-nowrap"}>
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
                                                <TableCell className={"px-2 py-[10px] md:px-3"}><Menu className={"cursor-grab"} size={16}/></TableCell>
                                                {
                                                    isEdit === i ?
                                                        <TableCell className={"px-2 py-[10px] md:px-3"}>
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
                                                            className={`font-medium text-xs px-2 py-[10px] md:px-3 ${theme === "dark" ? "" : "text-muted-foreground"}`}>{x.title}</TableCell>
                                                }
                                                {isEdit === i ?
                                                    <TableCell
                                                        className={`px-2 py-[10px] md:px-3 font-medium text-xs ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                        <div className={"flex justify-center items-center"}>
                                                            <ColorInput style={{width:"102px"}}  name={"color_code"} value={x.color_code} onChange={(color) => onChangeColorColor(color, i)}/>
                                                        </div>
                                                    </TableCell> :
                                                    <TableCell
                                                        className={`px-2 py-[10px] md:px-3 font-medium text-xs ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                        <div className={"flex justify-center items-center gap-1"}>
                                                            <Square size={16} strokeWidth={1} fill={x.color_code} stroke={x.color_code}/>
                                                            <p>{x.color_code}</p>
                                                        </div>
                                                    </TableCell>
                                                }
                                                <TableCell className="px-2 py-[10px] md:px-3 flex justify-end gap-2 pr-4">
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
                                                <TableCell className={`px-2 py-[10px] md:px-3 ${labelError ? "align-top" : ""}`}>
                                                    <Button variant={"ghost hover:bg-transparent"}
                                                            className={"p-0 cursor-grab"}><Menu size={16}/></Button>
                                                </TableCell>
                                                <TableCell className={"px-2 py-[10px] md:px-3"}>
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
                                                <TableCell className={`px-2 py-[10px] md:px-3 ${labelError ? "align-top" : ""} text-xs ${theme === "dark" ? "" : "text-muted-foreground"} `}>
                                                    <div className={"flex justify-center items-center"}>
                                                        <ColorInput
                                                            style={{width:"102px"}}
                                                            name="color_code"
                                                            value={newStatus.color_code}
                                                            onChange={(color) => setNewStatus((prevState) => ({
                                                                ...prevState,
                                                                color_code: color.color_code
                                                            }))}
                                                        />
                                                    </div>
                                                </TableCell>
                                                <TableCell className="flex justify-end gap-2 px-2 py-[15px] md:px-3">
                                                    <Button
                                                        variant=""
                                                        className={`${!isSave === true ? "py-2 px-4" : "py-2 px-4"} h-[30px] w-[100px] text-sm font-semibold`}
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
                                                            setNewStatus(initialStatus)
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
